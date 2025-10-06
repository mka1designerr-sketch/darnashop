"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type FavItem = { id: string; name: string; image: string; price?: number };

type FavState = {
  items: FavItem[];
  toggle: (item: FavItem) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  count: number;
};

const Ctx = createContext<FavState | undefined>(undefined);
const KEY = "darna_favs_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  const toggle = useCallback((item: FavItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]));
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const count = useMemo(() => items.length, [items]);

  const value = useMemo(() => ({ items, toggle, has, remove, count }), [items, toggle, has, remove, count]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFavorites must be used within FavoritesProvider");
  return v;
}
