"use client";
import { useEffect, useState } from "react";
import { ProductVariant, useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
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
  const { categories: available } = useCategories();
  const [selectedCats, setSelectedCats] = useState<string[]>(base?.categories || []);
  const [variants, setVariants] = useState<ProductVariant[]>(base?.variants || []);
  const [description, setDescription] = useState<string>(base?.description || "");
  const [deliveryInfo, setDeliveryInfo] = useState<string>(base?.deliveryInfo ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!base) return;
    setName(base.name);
    setPrice(base.price);
    setQty(base.qty);
    setSelectedCats(base.categories);
    setVariants(base.variants);
    setDescription(base.description || "");
    setDeliveryInfo(base.deliveryInfo || "");
  }, [id, base]);

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

  function setPrimary(idx: number) {
    setVariants((arr) => arr.map((v, i) => ({ ...v, isPrimary: i === idx })));
  }

  async function save() {
    setSaving(true);
    // ensure exactly one primary
    let nextVariants = variants;
    if (!nextVariants.some((v) => v.isPrimary)) {
      nextVariants = nextVariants.map((v, i) => ({ ...v, isPrimary: i === 0 }));
    }
    update(id, {
      name,
      price: Number(price || 0),
      qty: Number(qty || 0),
      categories: selectedCats,
      variants: nextVariants,
      description: description || undefined,
      deliveryInfo: deliveryInfo || undefined,
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
            <label className="block text-sm font-medium">Categories</label>
            <select
              multiple
              className="mt-1 w-full rounded border p-2"
              value={selectedCats}
              onChange={(e) => setSelectedCats(Array.from(e.target.selectedOptions).map((o) => o.value))}
            >
              {available.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le produit..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Delivery details</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={3}
              value={deliveryInfo}
              onChange={(e) => setDeliveryInfo(e.target.value)}
              placeholder="Ex: Livraison 2-5 jours via Yalidine; frais variables selon wilaya."
            />
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
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{v.isPrimary ? "Primary variant" : "Variant"}</span>
                  {!v.isPrimary && <button onClick={() => setPrimary(idx)} className="text-xs rounded border px-2 py-1">Set as primary</button>}
                </div>
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
