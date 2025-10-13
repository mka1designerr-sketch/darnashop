"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Category = {
  id: string; // slug
  name: string;
  cover: string; // data URL or remote URL
};

type CategoriesState = {
  categories: Category[];
  add: (c: Category) => void;
  update: (id: string, patch: Partial<Category>) => void;
  remove: (id: string) => void;
};

const KEY = "darna_categories_v1";
const Ctx = createContext<CategoriesState | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const seed: Category[] = [
    {
      id: "nouveautes",
      name: "Nouveautés",
      cover: "https://picsum.photos/seed/nouveautes/1200/800",
    },
    {
      id: "femme",
      name: "Femme",
      cover: "https://picsum.photos/seed/femme/1200/800",
    },
    {
      id: "homme",
      name: "Homme",
      cover: "https://picsum.photos/seed/homme/1200/800",
    },
    {
      id: "enfants",
      name: "Enfants",
      cover: "https://picsum.photos/seed/enfants/1200/800",
    },
    {
      id: "electronique",
      name: "Électronique",
      cover: "https://picsum.photos/seed/electronique/1200/800",
    },
    {
      id: "promotions",
      name: "Promotions",
      cover: "https://picsum.photos/seed/promotions/1200/800",
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        if (res.ok) {
          const list = (await res.json()) as Category[];
          if (!cancelled && Array.isArray(list) && list.length) {
            setCategories(list);
            try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
            return;
          }
        }
      } catch {}
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed: Category[] = JSON.parse(raw);
          // Ensure default categories always exist (merge by id)
          const map = new Map<string, Category>(parsed.map((c) => [c.id, c]));
          for (const s of seed) if (!map.has(s.id)) map.set(s.id, s);
          if (!cancelled) setCategories(Array.from(map.values()));
        } else if (!cancelled) {
          setCategories(seed);
        }
      } catch {
        if (!cancelled) setCategories(seed);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  const add = useCallback((c: Category) => {
    setCategories((prev) => [...prev, c]);
    fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }).catch(() => {});
  }, []);
  const update = useCallback((id: string, patch: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }).catch(() => {});
  }, []);
  const remove = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  }, []);

  const value = useMemo(() => ({ categories, add, update, remove }), [categories, add, update, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCategories() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
