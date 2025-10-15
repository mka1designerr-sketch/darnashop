"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

export default function Header() {
  const { count, items, removeItem, updateQty } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [query, setQuery] = useState("");
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const r = useRouter();
  const submitSearch = () => {
    if (!query.trim()) return;
    r.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };
  const cartRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!cartRef.current) return;
      if (!cartRef.current.contains(e.target as Node)) setOpenCart(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCart(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--color-subtle-light)] bg-[var(--color-background-light)]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <svg className="text-[var(--color-primary)]" fill="none" height="32" viewBox="0 0 48 48" width="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">DARNA SHOP</span>
          </Link>
          <nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
            <Link href="/shop?categoryId=nouveautes" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {t("nav_new")}
            </Link>
            <Link href="/shop?categoryId=femme" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {t("nav_women")}
            </Link>
            <Link href="/shop?categoryId=homme" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {t("nav_men")}
            </Link>
            <Link href="/shop?categoryId=enfants" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {t("nav_kids")}
            </Link>
            <Link href="/shop?categoryId=electronique" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {t("nav_elec")}
            </Link>
            <Link href="/shop?categoryId=promotions" className="rounded-full bg-[var(--color-accent-orange)] px-3 py-1 text-sm font-bold text-white hover:bg-opacity-90">
              {t("nav_promos")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="relative hidden md:block min-w-40 max-w-xs">
            <input
              className="w-full rounded-full border-[var(--color-subtle-light)] bg-white py-2 pl-10 pr-4 text-sm text-[var(--color-primary)] placeholder-black/40 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              placeholder={t("search_placeholder")}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="text-[var(--color-primary)]" fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
          </div>
          {/* Favorites icon (placeholder dropdown) */}
          <Link href="/shop?fav=1" className="relative rounded-full p-2 hover:bg-[var(--color-subtle-light)]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.5C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Link>
          {/* Mini cart */}
          <div className="relative" ref={cartRef}>
          <button onClick={() => setOpenCart((v) => !v)} className="relative rounded-full p-2 hover:bg-[var(--color-subtle-light)]">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
            </svg>
            {count > 0 && (
              <span className={`absolute ${isRTL ? "-left-1" : "-right-1"} -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-orange)] text-xs font-bold text-white`}>
                {count}
              </span>
            )}
          </button>
          {openCart && (
            <div className={`absolute ${isRTL ? "left-0" : "right-0"} top-12 z-30 w-[320px] rounded-lg border border-[var(--color-subtle-light)] bg-white p-3 shadow-xl`}>
              <div className="max-h-64 space-y-3 overflow-auto">
                {items.length === 0 && <p className="text-sm text-slate-600">Votre panier est vide.</p>}
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded bg-cover bg-center" style={{ backgroundImage: `url('${it.image}')` }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{it.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <input
                          type="number"
                          min={1}
                          className="w-14 rounded border border-[var(--color-subtle-light)] px-1 py-0.5"
                          value={it.qty}
                          onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value) || 1))}
                        />
                        <button onClick={() => removeItem(it.id)} className="text-red-600 hover:underline">
                          Retirer
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{(it.price * it.qty).toLocaleString("fr-DZ")} DA</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/checkout" className={`w-full rounded-lg px-3 py-2 text-center text-sm font-bold text-white ${items.length ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" : "cursor-not-allowed bg-slate-300"}`} aria-disabled={items.length === 0}>
                  Valider
                </Link>
                <button onClick={() => setOpenCart(false)} className="whitespace-nowrap rounded-lg border border-[var(--color-subtle-light)] px-3 py-2 text-sm">
                  Fermer
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
