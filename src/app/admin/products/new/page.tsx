"use client";
import { useState } from "react";
import { Product, ProductVariant, useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import Link from "next/link";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewProductPage() {
  const { add } = useProducts();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);
  const { categories: available } = useCategories();
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [description, setDescription] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [saving, setSaving] = useState(false);

  async function onMainUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const urls = await Promise.all(files.map(readFileAsDataURL));
    setMainImages((prev) => [...prev, ...urls].slice(0, 5));
  }

  async function addVariant() {
    setVariants((v) => [...v, { colorName: "", colorHex: "", images: [] }]);
  }

  async function updateVariant(idx: number, patch: Partial<ProductVariant>) {
    setVariants((arr) => arr.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  async function uploadVariantImages(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6);
    const urls = await Promise.all(files.map(readFileAsDataURL));
    setVariants((arr) => arr.map((v, i) => (i === idx ? { ...v, images: [...v.images, ...urls].slice(0, 6) } : v)));
  }

  function removeVariant(idx: number) {
    setVariants((arr) => arr.filter((_, i) => i !== idx));
  }

  async function save() {
    if (!id || !name) return alert("ID et nom requis");
    setSaving(true);
    const p: Product = {
      id,
      name,
      price: Number(price || 0),
      qty: Number(qty || 0),
      categories: selectedCats,
      variants: variants.length ? variants : [{ colorName: "Default", images: mainImages }],
      description: description || undefined,
      deliveryInfo: deliveryInfo || undefined,
    };
    add(p);
    setSaving(false);
    window.location.href = "/admin/products";
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/products" className="text-sm text-[var(--color-primary)] hover:underline">← Back to Product List</Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <div className="space-y-8 rounded-xl border bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Product ID (slug)</label>
            <input className="mt-1 w-full rounded border p-2" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. tshirt-homme" />
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Categories</label>
              <Link href="/admin/categories" className="text-xs text-[var(--color-primary)] hover:underline">Manage categories</Link>
            </div>
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
            {available.length === 0 && (
              <p className="mt-1 text-xs text-slate-500">No categories yet. Create some in Admin → Categories.</p>
            )}
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
              placeholder="Décrivez le produit (matières, coupe, conseils d'entretien, etc.)"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Delivery details (visible in admin only)</label>
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
          <h3 className="mb-2 text-lg font-semibold">Product Images</h3>
          <div className="rounded-lg border-2 border-dashed p-4 text-center">
            <input type="file" multiple accept="image/*" onChange={onMainUpload} />
            <p className="mt-2 text-xs text-slate-500">Up to 5 images</p>
            {mainImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {mainImages.map((src) => (
                  <div key={src} className="aspect-square rounded bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }} />
                ))}
              </div>
            )}
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
            {variants.length === 0 && <p className="text-sm text-slate-600">No color variants yet. Add at least one or the main images will be used.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button disabled={saving} onClick={save} className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Publish Product"}
          </button>
        </div>
      </div>
    </main>
  );
}
