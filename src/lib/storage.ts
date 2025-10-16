import { promises as fs } from "fs";
import path from "path";

export type StoredProduct = unknown;
export type StoredCategory = unknown;

const dataDir = path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");
const categoriesFile = path.join(dataDir, "categories.json");
const ordersFile = path.join(dataDir, "orders.json");

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const buf = await fs.readFile(file, "utf8");
    return JSON.parse(buf) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function loadProducts(): Promise<StoredProduct[]> {
  return readJson(productsFile, [] as StoredProduct[]);
}

export async function saveProducts(list: StoredProduct[]): Promise<void> {
  await writeJson(productsFile, list);
}

export async function loadCategories(): Promise<StoredCategory[]> {
  return readJson(categoriesFile, [] as StoredCategory[]);
}

export async function saveCategories(list: StoredCategory[]): Promise<void> {
  await writeJson(categoriesFile, list);
}

export type StoredOrder = {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  remaining: number;
  createdAt: string;
};

export async function loadOrders(): Promise<StoredOrder[]> {
  return readJson(ordersFile, [] as StoredOrder[]);
}

export async function appendOrders(orders: StoredOrder[]): Promise<void> {
  const cur = await loadOrders();
  await writeJson(ordersFile, [...cur, ...orders]);
}
