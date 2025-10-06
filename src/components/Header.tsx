"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header() {
  const { count } = useCart();
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
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/shop" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Nouveautés
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Femme
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Homme
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Enfants
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Électronique
            </Link>
            <Link href="/about" className="rounded-full bg-[var(--color-accent-orange)] px-3 py-1 text-sm font-bold text-white hover:bg-opacity-90">
              À propos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="relative hidden md:block">
            <input
              className="w-full rounded-full border-[var(--color-subtle-light)] bg-[var(--color-background-light)] py-2 pl-10 pr-4 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              placeholder="Rechercher..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="text-black/50" fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
          </div>
          <Link href="/checkout" className="relative rounded-full p-2 hover:bg-[var(--color-subtle-light)]">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-orange)] text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
