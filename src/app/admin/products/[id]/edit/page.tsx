"use client";
import { useEffect, useState } from "react";
import { Product, ProductVariant, useProducts } from "@/contexts/ProductsContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditProductPage() {
  const { byId, update } = useProducts();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = decodeURIComponent(params.id);
  const base = byId(id);
  const [name, setName] = useState(base?.name || "");
  const [price, setPrice] = useState<number>(base?.price || 0);
  const [qty, setQty] = useState<number>(base?.qty || 0);
  const [categories, setCategories] = useState<string>((base?.categories || []).join(", "));
  const [variants, setVariants] = useState<ProductVariant[]>(base?.variants || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!base) return;
    setName(base.name);
    setPrice(base.price);
    setQty(base.qty);
    setCategories(base.categories.join(", "));
    setVariants(base.variants);
  }, [id]);

  if (!base) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p>Product not found.</p>
      </main>
    );
  }

  function updateVariant(idx: number, patch: Partial<ProductVariant>) {
    setVariants((arr) => arr.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  async function uploadVariantImages(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6);
    const urls = await Promise.all(files.map(readFileAsDataURL));
    setVariants((arr) => arr.map((v, i) => (i === idx ? { ...v, images: [...v.images, ...urls].slice(0, 6) } : v)));
  }

  function addVariant() {
    setVariants((arr) => [...arr, { colorName: "", colorHex: "", images: [] }]);
  }

  function removeVariant(idx: number) {
    setVariants((arr) => arr.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    update(id, {
      name,
      price: Number(price || 0),
      qty: Number(qty || 0),
      categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
      variants,
    });
    setSaving(false);
    router.push("/admin/products");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/products" className="text-sm text-[var(--color-primary)] hover:underline">← Back to Product List</Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="space-y-8 rounded-xl border bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Product ID (slug)</label>
            <input className="mt-1 w-full rounded border p-2" value={id} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 w-full rounded border p-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (DZD)</label>
            <input className="mt-1 w-full rounded border p-2" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input className="mt-1 w-full rounded border p-2" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value || 0))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Categories (comma separated)</label>
            <input className="mt-1 w-full rounded border p-2" value={categories} onChange={(e) => setCategories(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Color Variants</h3>
            <button onClick={addVariant} className="rounded border px-3 py-1 text-sm">Add color</button>
          </div>
          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={idx} className="rounded-lg border bg-slate-50 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input className="rounded border p-2" placeholder="Color name" value={v.colorName} onChange={(e) => updateVariant(idx, { colorName: e.target.value })} />
                  <input className="rounded border p-2" placeholder="#hex (optional)" value={v.colorHex || ""} onChange={(e) => updateVariant(idx, { colorHex: e.target.value })} />
                  <button onClick={() => removeVariant(idx)} className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">Remove</button>
                </div>
                <div className="mt-3">
                  <input type="file" multiple accept="image/*" onChange={(e) => uploadVariantImages(idx, e)} />
                  {v.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {v.images.map((src) => (
                        <div key={src} className="aspect-square rounded bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {variants.length === 0 && <p className="text-sm text-slate-600">No color variants yet.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button disabled={saving} onClick={save} className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
