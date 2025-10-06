"use client";
import { useState } from "react";
import { Product, ProductsProvider, useProducts } from "@/contexts/ProductsContext";

function AdminInner() {
  const pass = process.env.NEXT_PUBLIC_ADMIN_PASS || "0000";
  const [ok, setOk] = useState(false);
  const [input, setInput] = useState("");
  const { products, add, update, remove } = useProducts();

  const [draft, setDraft] = useState<Partial<Product>>({
    id: "",
    name: "",
    price: 0,
    categories: [],
    qty: 0,
    variants: [],
  });

  const [variantColorName, setVariantColorName] = useState("");
  const [variantColorHex, setVariantColorHex] = useState("");
  const [variantImages, setVariantImages] = useState("");

  if (!ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">Admin - Connexion</h1>
        <input className="w-full rounded border p-2" placeholder="Code admin" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={() => setOk(input === pass)} className="mt-3 rounded bg-[var(--color-primary)] px-4 py-2 font-bold text-white">
          Entrer
        </button>
        {!process.env.NEXT_PUBLIC_ADMIN_PASS && <p className="mt-2 text-xs text-slate-600">Astuce: aucun mot de passe défini, défaut: 0000 (définissez NEXT_PUBLIC_ADMIN_PASS).</p>}
      </main>
    );
  }

  function resetDraft() {
    setDraft({ id: "", name: "", price: 0, categories: [], qty: 0, variants: [] });
    setVariantColorName("");
    setVariantColorHex("");
    setVariantImages("");
  }

  function addVariantToDraft() {
    if (!variantColorName) return;
    setDraft((d) => ({
      ...d,
      variants: [
        ...(d.variants || []),
        { colorName: variantColorName, colorHex: variantColorHex, images: variantImages.split(",").map((s) => s.trim()).filter(Boolean) },
      ],
    }));
    setVariantColorName("");
    setVariantColorHex("");
    setVariantImages("");
  }

  function saveDraft() {
    if (!draft.id || !draft.name || typeof draft.price !== "number") return;
    const p: Product = {
      id: draft.id!,
      name: draft.name!,
      price: Number(draft.price || 0),
      categories: (draft.categories as string[]) || [],
      qty: Number(draft.qty || 0),
      variants: draft.variants || [],
    };
    const exists = products.some((x) => x.id === p.id);
    if (exists) update(p.id, p);
    else add(p);
    resetDraft();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Panneau Admin</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-[var(--color-subtle-light)] bg-white p-4">
          <h2 className="mb-3 text-lg font-bold">Produits</h2>
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Prix</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Catégories</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2 font-mono text-xs">{p.id}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.price}</td>
                    <td className="p-2">{p.qty}</td>
                    <td className="p-2">{p.categories.join(", ")}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setDraft(p)}
                        className="mr-2 rounded border px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        Éditer
                      </button>
                      <button onClick={() => remove(p.id)} className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-subtle-light)] bg-white p-4">
          <h2 className="mb-3 text-lg font-bold">Ajouter / Éditer</h2>
          <div className="grid grid-cols-2 gap-3">
            <input className="col-span-2 rounded border p-2" placeholder="ID unique (slug)" value={draft.id || ""} onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))} />
            <input className="col-span-2 rounded border p-2" placeholder="Nom" value={draft.name || ""} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            <input className="rounded border p-2" placeholder="Prix" type="number" value={draft.price as number} onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value || 0) }))} />
            <input className="rounded border p-2" placeholder="Quantité" type="number" value={draft.qty as number} onChange={(e) => setDraft((d) => ({ ...d, qty: Number(e.target.value || 0) }))} />
            <input className="col-span-2 rounded border p-2" placeholder="Catégories (séparées par des virgules)" value={(draft.categories as string[])?.join(", ") || ""} onChange={(e) => setDraft((d) => ({ ...d, categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} />

            <div className="col-span-2 rounded border p-3">
              <div className="mb-2 font-semibold">Variante</div>
              <div className="grid grid-cols-2 gap-2">
                <input className="rounded border p-2" placeholder="Nom couleur" value={variantColorName} onChange={(e) => setVariantColorName(e.target.value)} />
                <input className="rounded border p-2" placeholder="#hex couleur (optionnel)" value={variantColorHex} onChange={(e) => setVariantColorHex(e.target.value)} />
                <input className="col-span-2 rounded border p-2" placeholder="URLs images (séparées par des virgules)" value={variantImages} onChange={(e) => setVariantImages(e.target.value)} />
              </div>
              <button onClick={addVariantToDraft} className="mt-2 rounded border px-3 py-1 text-sm">Ajouter variante</button>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {(draft.variants || []).map((v, i) => (
                  <li key={i}>
                    {v.colorName} ({v.images.length} image{v.images.length > 1 ? "s" : ""})
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex gap-2">
              <button onClick={saveDraft} className="rounded bg-[var(--color-primary)] px-4 py-2 font-bold text-white">Enregistrer</button>
              <button onClick={resetDraft} className="rounded border px-4 py-2">Réinitialiser</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  // ensure provider exists if admin route is hard refreshed
  return (
    <ProductsProvider>
      <AdminInner />
    </ProductsProvider>
  );
}
