"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ProductVariant = {
  colorName: string;
  colorHex?: string;
  images: string[];
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  categories: string[];
  qty: number;
  variants: ProductVariant[];
  description?: string;
  deliveryInfo?: string;
};

type ProductsState = {
  products: Product[];
  add: (p: Product) => void;
  update: (id: string, update: Partial<Product>) => void;
  remove: (id: string) => void;
  setAll: (list: Product[]) => void;
  byId: (id: string) => Product | undefined;
  byName: (name: string) => Product | undefined;
};

const KEY = "darna_products_v1";
const Ctx = createContext<ProductsState | undefined>(undefined);

const seed: Product[] = [
  {
    id: "chemise-lin",
    name: "Chemise en lin",
    price: 2500,
    categories: ["Vêtements", "Homme"],
    qty: 20,
    variants: [
      {
        colorName: "Blanc",
        colorHex: "#f2f2f2",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuApwks67sac6VrF_M7auwEyzntrUFO6Egej29c61GNHTLIyRuqFguWfXnXw9OhfI2xWTdoQoVw-CFX5kVsArkCPqJ64zkUIlcLIh0h4bi3Wt-yJJnHmWhnh4uJjoRxnyW72MteDdOExzAogzAtIg225BEXPpMtWkEiKjg2hSkGu2zdyYRRZzpp02FYaBOiR9m6Sb3zZI85qfs6IVAyAWCW0MTYiuaKlkNobfDBWW2_xjS60xM6op7QkW3Vz6tUFAYxfhC9qKXGa7ibI",
        ],
        isPrimary: true,
      },
    ],
  },
  {
    id: "robe-ete",
    name: "Robe d'été",
    price: 3500,
    categories: ["Vêtements", "Femme"],
    qty: 18,
    variants: [
      {
        colorName: "Crème",
        colorHex: "#f2f2f2",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvfzseZhZySo1YppNPX0h6wqbm4joj-_Azd9p1xfCDuW62TR3Y5TR4fksSxvDAU45oYhekrYxNt2mbU-fq6Z-El0y2MjxbDCbkIxrHybZR8LX-Ncg8z9CJPKwnt1uVlQzW2Gs4e1IV8m1ISrKWgINjo35ZluSax2N9Z_Fhdg0d7X9ZOfBw344pdVEGQJ97foDgrmnrRHWiv5Ecyz9YpVOmYDs2Afv_MchVtPvGZBhUQHg7NDU8NUtcnDY9v9VCaYi1-raHDRFKGfy",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB1hRpED-pkKkVm9xMJtt5AqXFUv18dBeHS3twLvmUp94IJtSHxZ22OLKY6iw8SQKNw1Lz77euCFyrFV733M8H_e3sHFfHwF3CK5APYlwDFj6_BjNx3HKvcAAty0201eQXRrzREaU1LZlOLSvjBIw5NavD091ZYYPyeGgHHOELfiuCrN_z2KSDi2umorFtnPYv6NsMos99YXeKS2X_EScZG8qkgIDQXwo8JI2GY-eLuq4x3hopwGhWw2AWT7tkkL2_S13Ix9txGi8TR",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAbnqlGN5i5ib4joZ_0n8A6XRppc2528-ldQZ8MrSlKR022yWxCDCD9zJwv5mdRPzrk1A8QV2OV3_qcIunRv383RrGEwTprK-J8t6Bx0Mdmzoy3i4sqw1awnbYudmituiPsVAyr6GYRs0vJpfG61WtTw4EodxqPfH4BE0mIE59-CUoFx1917tvarVMblqytyyyLzkOfxA_FDBsqmyuLPl4S80WmYvO52ZCdXOoIwixk3G1jz74YKrWsnmI4pmV5OZxfJpRqzHgg2iGh",
        ],
        isPrimary: true,
      },
      { colorName: "Bleu", colorHex: "#336699", images: ["https://picsum.photos/seed/robe-bleu/800/1000"] },
      { colorName: "Jaune", colorHex: "#ffcc33", images: ["https://picsum.photos/seed/robe-jaune/800/1000"] },
    ],
  },
  {
    id: "casque-audio",
    name: "Casque audio sans fil",
    price: 4500,
    categories: ["Électronique"],
    qty: 30,
    variants: [
      { colorName: "Noir", colorHex: "#222", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDuM3CD74ixrUqYC9a451KuPmIMQDMaoV74UoFm5PvW6oGVIz1gGofdtI50gudrKWh4Thm5J0uD3O3dYDasZ4oeKzRIr3WK_y3I6WlEu_Bx6rpCkuljMsS9GE2ih6WoBzZwb5MCYVkSbAUojrWUSGHgNN1TB4jpYvJl2q76RFzKF0tkmBAtQMcTcdinGHcoFjffJ95ujoz2ZREkrtF9_2FFWq5EMe5iLyQL0tn_WVxvr8-BOndAPnGrVgWjnHk9YguzVjmZfEAObXQB"] },
    ],
  },
];

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        if (res.ok) {
          const list = (await res.json()) as Product[];
          if (!cancelled && Array.isArray(list) && list.length) {
            setProducts(list);
            try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
            return;
          }
        }
      } catch {}
      try {
        const raw = localStorage.getItem(KEY);
        if (!cancelled) setProducts(raw ? JSON.parse(raw) : seed);
      } catch {
        if (!cancelled) setProducts(seed);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  const add = useCallback((p: Product) => {
    setProducts((prev) => [...prev, p]);
    fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }).catch(() => {});
  }, []);
  const update = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }).catch(() => {});
  }, []);
  const remove = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  }, []);
  const setAll = useCallback((list: Product[]) => setProducts(list), []);
  const byId = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const byName = useCallback((name: string) => products.find((p) => p.name === name), [products]);

  const value = useMemo(
    () => ({ products, add, update, remove, setAll, byId, byName }),
    [products, add, update, remove, setAll, byId, byName]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProducts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
