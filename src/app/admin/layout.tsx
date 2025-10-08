"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductsProvider } from "@/contexts/ProductsContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pass = process.env.NEXT_PUBLIC_ADMIN_PASS || "0000";
  const [ok, setOk] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem("admin_ok") === "1";
      setOk(v);
    } catch {}
  }, []);

  const submit = () => {
    const good = input === pass;
    setOk(good);
    try {
      localStorage.setItem("admin_ok", good ? "1" : "0");
    } catch {}
  };

  if (!ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">Admin - Connexion</h1>
        <input className="w-full rounded border p-2" placeholder="Code admin" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={submit} className="mt-3 rounded bg-[var(--color-primary)] px-4 py-2 font-bold text-white">Entrer</button>
        {!process.env.NEXT_PUBLIC_ADMIN_PASS && (
          <p className="mt-2 text-xs text-slate-600">Astuce: aucun mot de passe défini, défaut: 0000 (définissez NEXT_PUBLIC_ADMIN_PASS).</p>
        )}
      </main>
    );
  }

  return (
    <ProductsProvider>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">Admin</h1>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/admin/products" className="hover:underline">Produits</Link>
            <Link href="/admin/categories" className="hover:underline">Catégories</Link>
          </nav>
        </div>
      </header>
      {children}
    </ProductsProvider>
  );
}
