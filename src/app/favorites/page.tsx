"use client";

import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

export default function FavoritesPage() {
  const { items, remove } = useFavorites();
  const { addItem } = useCart();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Mes Favoris</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-black/70">Vous n’avez pas encore de favoris. Découvrez nos <Link href="/shop" className="underline">produits</Link>.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-[var(--color-subtle-light)] bg-white">
              <Link href={`/product?id=${encodeURIComponent(p.id)}`} className="block aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }} />
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                {typeof p.price === "number" && (
                  <p className="mt-1 text-sm font-bold text-[var(--color-primary)]">{p.price.toLocaleString("fr-DZ")} DA</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-lg border border-[var(--color-subtle-light)] px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    Retirer
                  </button>
                  <button
                    onClick={() => {
                      if (typeof p.price === "number")
                        addItem({ id: p.id, image: p.image, name: p.name, price: p.price }, 1);
                    }}
                    className="rounded-lg bg-[var(--color-primary)] px-2 py-1 text-xs font-bold text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-60"
                    disabled={typeof p.price !== "number"}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
