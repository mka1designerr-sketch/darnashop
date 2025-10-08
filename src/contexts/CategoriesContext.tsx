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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCategories(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  const add = useCallback((c: Category) => setCategories((prev) => [...prev, c]), []);
  const update = useCallback((id: string, patch: Partial<Category>) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))), []);
  const remove = useCallback((id: string) => setCategories((prev) => prev.filter((c) => c.id !== id)), []);

  const value = useMemo(() => ({ categories, add, update, remove }), [categories, add, update, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCategories() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
