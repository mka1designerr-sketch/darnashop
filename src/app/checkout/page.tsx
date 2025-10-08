"use client";
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useI18n } from "@/contexts/I18nContext";
import { useOrderStats } from "@/contexts/OrderStatsContext";

export default function CheckoutPage() {
  const { items, subtotal: subFromCart } = useCart();
  const { wilayas, byWilaya } = useAlgeriaLocations();
  const { lang } = ((): any => {
    try { return require("@/contexts/I18nContext"); } catch { return {}; }
  })();
  const { incrementMany } = useOrderStats();
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DA`;
  const subtotal = items.length ? subFromCart : 12000; // fallback to demo values
  const shipping = 500;
  const total = subtotal + shipping; // 12500
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
                  />
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

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-slate-700">Confirmer la commande via :</p>
              <div className="space-y-3">
                {[{ label: "WhatsApp", checked: true }, { label: "Appel téléphonique" }].map((o) => (
                  <label
                    key={o.label}
                    className="flex cursor-pointer items-center rounded-lg border border-slate-300 p-3 transition-colors hover:bg-slate-50 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10"
                  >
                    <input
                      type="radio"
                      name="confirmation"
                      defaultChecked={!!o.checked}
                      className="h-4 w-4 border-2 border-[var(--color-subtle-light)] bg-transparent text-transparent checked:border-[var(--color-primary)] checked:bg-[image:var(--radio-dot-svg)] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-800">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bonjour DARNA SHOP, je confirme ma commande: ${items
                    .map((i) => `${i.name} x${i.qty}`)
                    .join(", ")}. Total: ${fmt(total)} | Wilaya: ${selectedWilaya} | Commune: ${selectedCommune}`
                )}`}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-4 text-lg font-bold text-white shadow-sm transition-all ${items.length ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" : "cursor-not-allowed bg-slate-300"}`}
                aria-disabled={items.length === 0}
                onClick={() => incrementMany(items.map((i) => ({ id: i.id, qty: i.qty })))}
              >
                ✅ WhatsApp
              </a>
              <a
                href={`tel:+213XXXXXXXXX`}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-4 text-lg font-bold text-slate-700 shadow-sm transition-all ${items.length ? "hover:bg-slate-200/70" : "opacity-50 cursor-not-allowed"}`}
                aria-disabled={items.length === 0}
                onClick={() => incrementMany(items.map((i) => ({ id: i.id, qty: i.qty })))}
              >
                📞 Appel téléphonique
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
