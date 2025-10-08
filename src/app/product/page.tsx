"use client";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useOrderStats } from "@/contexts/OrderStatsContext";

export default function ProductPage() {
  const { addItem } = useCart();
  const { byId } = useProducts();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") || "";
  const product = byId(id);
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const webhook = process.env.NEXT_PUBLIC_ORDERS_WEBHOOK_URL;
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [buyer, setBuyer] = useState({ name: "", phone: "", address: "", size: "M", wilaya: "", commune: "" });
  const { wilayas, byWilaya } = useAlgeriaLocations();
  const { increment } = useOrderStats();

  useEffect(() => {
    setVariantIdx(0);
    setImageIdx(0);
  }, [id]);

  const currentVariant = useMemo(() => product?.variants[variantIdx], [product, variantIdx]);
  const firstWithImages = useMemo(() => product?.variants.find((v) => v.images && v.images.length) || { images: [] }, [product]);
  const gallery = (currentVariant?.images && currentVariant.images.length ? currentVariant.images : firstWithImages.images) || [];

  if (!product) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <p className="text-center">Produit introuvable.</p>
      </main>
    );
  }

  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DZD`;

  async function submitOrder() {
    setSubmitting(true);
    const payload = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: currentVariant?.colorName,
      size: buyer.size,
      qty,
      name: buyer.name,
      phone: buyer.phone,
      address: buyer.address,
      wilaya: buyer.wilaya,
      commune: buyer.commune,
      createdAt: new Date().toISOString(),
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      try { increment(product.id, qty); } catch {}
      alert("Merci pour votre commande !");
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("Commande enregistrée localement. Veuillez vérifier la connexion du webhook.");
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative overflow-hidden rounded-lg">
              <div className="aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: `url('${gallery[imageIdx]}')` }} />
              {gallery.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <button
                    onClick={() => setImageIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                    className="rounded-full bg-white/70 p-2 hover:bg-white"
                  >
                    ‹
                  </button>
                  <button onClick={() => setImageIdx((i) => (i + 1) % gallery.length)} className="rounded-full bg-white/70 p-2 hover:bg-white">
                    ›
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {gallery.map((g, idx) => (
                <button key={g} className={`overflow-hidden rounded-lg ring-2 ${idx === imageIdx ? "ring-[var(--color-primary)]" : "ring-transparent"}`} onClick={() => setImageIdx(idx)}>
                  <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${g}')` }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-[var(--color-primary)]">{fmt(product.price)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Taille</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une taille</legend>
                <div className="flex flex-wrap gap-3">
                  {["S", "M", "L", "XL"].map((s) => (
                    <label key={s} className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-2 ring-transparent transition-all hover:bg-slate-200 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 has-[:checked]:text-[var(--color-primary)] has-[:checked]:ring-[var(--color-primary)]/30">
                      <input className="sr-only" name="size-choice" type="radio" defaultChecked={s === "M"} onChange={() => setBuyer((b) => ({ ...b, size: s }))} /> {s}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <h3 className="text-sm font-medium">Couleur</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une couleur</legend>
                <div className="flex items-center gap-4">
                  {product.variants.map((v, i) => (
                    <label key={v.colorName} className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-slate-400 focus:outline-none has-[:checked]:ring has-[:checked]:ring-offset-1">
                      <input className="sr-only" name="color-choice" type="radio" defaultChecked={i === 0} onChange={() => setVariantIdx(i)} />
                      <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: v.colorHex || "#eee" }} title={v.colorName} />
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="quantity">
                Quantité
              </label>
              <input
                className="mt-2 block w-24 rounded-lg border-slate-300 bg-white py-2 shadow-sm focus:border-[var(--color-primary)]/50 focus:ring-[var(--color-primary)]/50"
                id="quantity"
                min={1}
                name="quantity"
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button onClick={() => setShowForm(true)} className="flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary)]/90">
              Acheter Maintenant
            </button>
            <button onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: gallery[0] || "" }, qty)} className="flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-200/70">
              Ajouter au Panier
            </button>
          </div>

          {showForm && (
            <div className="rounded-lg border border-[var(--color-subtle-light)] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">Informations d'achat</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className="rounded border p-2" placeholder="Nom complet" value={buyer.name} onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))} />
                <input className="rounded border p-2" placeholder="Téléphone" value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} />
                <input className="rounded border p-2 sm:col-span-2" placeholder="Adresse complète" value={buyer.address} onChange={(e) => setBuyer((b) => ({ ...b, address: e.target.value }))} />
                <select className="rounded border p-2" value={buyer.wilaya} onChange={(e) => setBuyer((b) => ({ ...b, wilaya: e.target.value, commune: "" }))}>
                  <option value="">Wilaya</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </select>
                <select className="rounded border p-2" value={buyer.commune} onChange={(e) => setBuyer((b) => ({ ...b, commune: e.target.value }))} disabled={!buyer.wilaya}>
                  <option value="">Commune</option>
                  {buyer.wilaya && byWilaya(buyer.wilaya).map((c) => (
                    <option key={`${buyer.wilaya}-${c.name}`} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button disabled={submitting} onClick={submitOrder} className="rounded bg-[var(--color-primary)] px-4 py-2 font-bold text-white disabled:opacity-50">
                  {submitting ? "Envoi..." : "Confirmer"}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded border px-4 py-2">Annuler</button>
              </div>
              {!webhook && (
                <p className="mt-2 text-xs text-red-600">Aucune URL de Google Sheet configurée. Définissez NEXT_PUBLIC_ORDERS_WEBHOOK_URL pour envoyer la commande.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8">
        <div className="prose prose-slate max-w-none">
          <p>
            Détails du produit, composition et conseils d'entretien. Images et couleurs peuvent varier selon les variantes disponibles.
          </p>
        </div>
      </div>
    </main>
  );
}
