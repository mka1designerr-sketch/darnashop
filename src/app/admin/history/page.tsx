"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type OrderRow = {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  remaining: number;
  createdAt: string;
};

export default function AdminHistoryPage() {
  const [data, setData] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        const list = await res.json();
        if (!cancelled) setData(list);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historique des commandes</h1>
        <Link href="/admin/products" className="text-sm text-[var(--color-primary)] hover:underline">← Retour Produits</Link>
      </div>

      {!data && !error && <p>Chargement...</p>}
      {error && <p className="text-red-600">Erreur de chargement.</p>}
      {data && !error && (
        <div className="overflow-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Quantité</th>
                <th className="px-4 py-3">Stock restant</th>
                <th className="px-4 py-3">ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{row.productName} <span className="text-xs text-slate-500">({row.productId})</span></td>
                  <td className="px-4 py-3">{row.qty}</td>
                  <td className="px-4 py-3">{row.remaining}</td>
                  <td className="px-4 py-3 text-slate-500">{row.id}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-600">Aucun enregistrement</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
