"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useI18n } from "@/contexts/I18nContext";
import { useOrderStats } from "@/contexts/OrderStatsContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal: subFromCart } = useCart();
  const { wilayas, byWilaya, deliveryPrice } = useAlgeriaLocations();
  const { lang } = ((): any => {
    try { return require("@/contexts/I18nContext"); } catch { return {}; }
  })();
  const { incrementMany } = useOrderStats();
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [method, setMethod] = useState<"home" | "desk">("home");
  const [buyer, setBuyer] = useState({ name: "", phone: "", address: "" });
  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DA`;
  const subtotal = items.length ? subFromCart : 0;
  const shipping = selectedWilaya ? deliveryPrice(selectedWilaya, method) : 0;
  const total = subtotal + shipping;

  async function confirmOrder() {
    if (!items.length) return;
    const payload = {
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      subtotal,
      delivery_method: method,
      delivery_price: shipping,
      total,
      name: buyer.name,
      phone: buyer.phone,
      address: buyer.address,
      wilaya_code: selectedWilaya,
      wilaya: wilayas.find((w) => w.code === selectedWilaya)?.name || "",
      commune: selectedCommune,
      createdAt: new Date().toISOString(),
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      incrementMany(items.map((i) => ({ id: i.id, qty: i.qty })));
      alert("Commande envoyée ! Merci.");
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("Commande enregistrée localement. Vérifiez le webhook.");
      router.push("/");
    }
  }
  return (
    <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">Paiement à la livraison</h1>
          <p className="mt-4 text-lg text-slate-600">Finalisez votre commande en toute simplicité et sécurité.</p>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
          {/* Left side: forms */}
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-slate-900">
                <span className="mr-2 text-[var(--color-primary)]">1.</span> Vos informations
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="nom">
                    Nom complet
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Entrez votre nom complet"
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    value={buyer.name}
                    onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="telephone">
                    Numéro de téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    placeholder="Entrez votre numéro de téléphone"
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    value={buyer.phone}
                    onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-slate-900">
                <span className="mr-2 text-[var(--color-primary)]">2.</span> Adresse de livraison
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="wilaya">Wilaya</label>
                  <select
                    id="wilaya"
                    name="wilaya"
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    value={selectedWilaya}
                    onChange={(e) => { setSelectedWilaya(e.target.value); setSelectedCommune(""); }}
                  >
                    <option value="" disabled>Choisir...</option>
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="commune">Commune</label>
                  <select
                    id="commune"
                    name="commune"
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    disabled={!selectedWilaya}
                  >
                    <option value="" disabled>Choisir...</option>
                    {selectedWilaya && byWilaya(selectedWilaya).map((c) => (
                      <option key={`${selectedWilaya}-${c.name}`} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="adresse">
                    Adresse détaillée
                  </label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    rows={3}
                    placeholder="Entrez votre adresse détaillée"
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    value={buyer.address}
                    onChange={(e) => setBuyer((b) => ({ ...b, address: e.target.value }))}
                  />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Méthode de livraison</span>
                  <div className="flex gap-3">
                    <label className="flex cursor-pointer items-center rounded-lg border border-slate-300 p-3 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10">
                      <input type="radio" name="delivery-method" className="sr-only" defaultChecked onChange={() => setMethod("home")} />
                      <span>À domicile</span>
                    </label>
                    <label className="flex cursor-pointer items-center rounded-lg border border-slate-300 p-3 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10">
                      <input type="radio" name="delivery-method" className="sr-only" onChange={() => setMethod("desk")} />
                      <span>Bureau le plus proche</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right side: summary card */}
          <aside className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-slate-900">
              <span className="mr-2 text-[var(--color-primary)]">3.</span> Résumé &amp; Confirmation
            </h2>

            <div className="flex-grow space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-slate-600">Votre panier est vide.</p>
              )}
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${it.image}')` }} />
                  <div className="flex-grow">
                    <p className="font-semibold text-slate-800">{it.name}</p>
                    <p className="text-sm text-slate-500">Quantité: {it.qty}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{fmt(it.price * it.qty)}</p>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-slate-200 pt-4">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{fmt(shipping)}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between pt-2 text-lg font-bold text-slate-900">
                <span>Total à Payer</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={confirmOrder}
                disabled={!items.length || !selectedWilaya || !selectedCommune}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-4 text-lg font-bold text-white shadow-sm transition-all ${items.length && selectedWilaya && selectedCommune ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" : "cursor-not-allowed bg-slate-300"}`}
              >
                Confirmer la commande
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
