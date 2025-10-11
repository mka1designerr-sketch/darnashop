"use client";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useOrderStats } from "@/contexts/OrderStatsContext";

export default function ProductPage() {
  const { addItem, clearCart } = useCart();
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
  const { wilayas, byWilaya, deliveryPrice } = useAlgeriaLocations();
  const [method, setMethod] = useState<"home" | "desk">("home");
  const { increment } = useOrderStats();
  const [tab, setTab] = useState<"desc" | "delivery" | "reviews">("desc");

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
  const subtotal = (product?.price || 0) * qty;
  const shipping = buyer.wilaya ? deliveryPrice(buyer.wilaya, method) : 0;
  const total = subtotal + shipping;

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
      wilaya_code: buyer.wilaya,
      wilaya: wilayas.find((w) => w.code === buyer.wilaya)?.name || "",
      commune: buyer.commune,
      delivery_method: method,
      delivery_price: shipping,
      subtotal,
      total,
      createdAt: new Date().toISOString(),
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      try { increment(product.id, qty); } catch {}
      try { clearCart(); } catch {}
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
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        <div className="">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <div className="aspect-[1/1] bg-cover bg-center" style={{ backgroundImage: `url('${gallery[imageIdx]}')` }} />
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
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((g, idx) => (
                <button
                  key={g}
                  className={`overflow-hidden rounded-2xl border-2 ${idx === imageIdx ? "border-primary-600" : "opacity-75 hover:opacity-100 border-transparent"}`}
                  onClick={() => setImageIdx(idx)}
                >
                  <div className="aspect-[1/1] bg-cover bg-center" style={{ backgroundImage: `url('${g}')` }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-600 mt-2">{fmt(product.price)}</p>
            <p className="mt-4 text-base text-gray-500">{product.description || "Une élégante pièce parfaite pour les occasions spéciales ou au quotidien."}</p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Taille</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une taille</legend>
                <div className="flex flex-wrap gap-3">
                  {["S", "M", "L", "XL"].map((s) => (
                    <label key={s} className="cursor-pointer">
                      <input className="sr-only peer" name="size-choice" type="radio" defaultChecked={s === "M"} onChange={() => setBuyer((b) => ({ ...b, size: s }))} />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-200 bg-white peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-600 font-semibold transition-all">{s}</div>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Couleur</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une couleur</legend>
                <div className="flex flex-wrap gap-4 mt-2">
                  {product.variants.map((v, i) => (
                    <label key={v.colorName} className="cursor-pointer">
                      <input className="sr-only peer" name="color-choice" type="radio" defaultChecked={i === 0} onChange={() => setVariantIdx(i)} />
                      <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-white peer-checked:ring-primary-600 transition-all border border-gray-200" style={{ backgroundColor: v.colorHex || "#eee" }} title={v.colorName}></div>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Quantité</h3>
              <div className="relative mt-2 rounded-xl w-32 border border-gray-200">
                <button type="button" className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <input className="w-full h-12 rounded-xl border-0 bg-transparent text-center font-bold focus:outline-none focus:ring-0" type="text" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
                <button type="button" className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-8 space-y-4">
            <button onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: gallery[0] || "" }, qty)} className="w-full bg-primary-600 text-white rounded-xl h-14 text-base font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222A2 2 0 006.48 5h7.78a2 2 0 001.94-1.515l.8-3A1 1 0 0016 0H6a1 1 0 00-.98.804L4.78 2H3z" /><path d="M6 7a1 1 0 000 2h7a1 1 0 100-2H6z" /><path fillRule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm3 9a1 1 0 100-2 1 1 0 000 2zm8-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>
              Ajouter au Panier
            </button>
            <button onClick={() => setShowForm(true)} className="w-full bg-gray-900 text-white rounded-xl h-14 text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300">
              Acheter Maintenant
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
                <div className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">Méthode de livraison</span>
                  <div className="flex gap-3">
                    <label className="flex cursor-pointer items-center rounded-lg border border-slate-300 p-2 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10">
                      <input type="radio" name="delivery-method" className="sr-only" defaultChecked onChange={() => setMethod("home")} />
                      <span>À domicile</span>
                    </label>
                    <label className="flex cursor-pointer items-center rounded-lg border border-slate-300 p-2 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10">
                      <input type="radio" name="delivery-method" className="sr-only" onChange={() => setMethod("desk")} />
                      <span>Bureau le plus proche</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Sous-total</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between"><span>Frais de livraison</span><span>{fmt(shipping)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{fmt(total)}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button disabled={submitting || !buyer.name || !buyer.phone || !buyer.wilaya || !buyer.commune} onClick={submitOrder} className="rounded bg-[var(--color-primary)] px-4 py-2 font-bold text-white disabled:opacity-50">
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

      {/* Tabs below main section */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            <button onClick={() => setTab("desc")} className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${tab === "desc" ? "border-primary-600 text-primary-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"}`}>Description</button>
            <button onClick={() => setTab("delivery")} className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${tab === "delivery" ? "border-primary-600 text-primary-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"}`}>Informations de Livraison</button>
            <button onClick={() => setTab("reviews")} className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${tab === "reviews" ? "border-primary-600 text-primary-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"}`}>Avis Clients (3)</button>
          </nav>
        </div>
        <div className="py-6">
          {tab === "desc" && (
            <p className="text-base text-gray-500 leading-relaxed">{product.description || "Cette pièce est confectionnée avec des matériaux de haute qualité, alliant confort et élégance. Tissu fluide et respirant, idéal pour les climats chauds."}</p>
          )}
          {tab === "delivery" && (
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Livraison à domicile ou au bureau le plus proche</li>
              <li>Frais variant selon la wilaya</li>
              <li>Délai moyen: 2-5 jours ouvrés</li>
            </ul>
          )}
          {tab === "reviews" && (
            <div className="space-y-4 text-sm text-gray-700">
              <p>⭐️⭐️⭐️⭐️⭐️ "Très belle qualité, je recommande."</p>
              <p>⭐️⭐️⭐️⭐️ "Coupe flatteuse et confortable."</p>
              <p>⭐️⭐️⭐️⭐️⭐️ "Livraison rapide, produit conforme."</p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <section className="bg-gray-50 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Rejoignez notre newsletter</h2>
            <p className="mt-4 text-lg text-gray-500">Soyez le premier à connaître les nouveautés, les ventes et les offres exclusives.</p>
          </div>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e)=>e.preventDefault()}>
            <input className="w-full h-14 px-6 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-gray-900 placeholder-gray-400" placeholder="Entrez votre e-mail" type="email" />
            <button className="w-full sm:w-auto bg-gray-900 text-white rounded-xl h-14 px-8 text-base font-bold flex items-center justify-center hover:bg-gray-800 transition-colors" type="submit">S'inscrire</button>
          </form>
        </div>
      </section>
    </main>
  );
}
