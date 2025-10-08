"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Counts = Record<string, number>; // productId -> count

type OrderStatsState = {
  counts: Counts;
  increment: (id: string, qty?: number) => void;
  incrementMany: (items: { id: string; qty: number }[]) => void;
  top: (n: number) => string[]; // product ids
  total: number; // total ordered items across products
};

const KEY = "darna_order_stats_v1";
const Ctx = createContext<OrderStatsState | undefined>(undefined);

export function OrderStatsProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCounts(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(counts));
    } catch {}
  }, [counts]);

  const increment = useCallback((id: string, qty: number = 1) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + Math.max(1, qty) }));
  }, []);

  const incrementMany = useCallback((items: { id: string; qty: number }[]) => {
    setCounts((prev) => {
      const next = { ...prev } as Counts;
      for (const it of items) {
        next[it.id] = (next[it.id] || 0) + Math.max(1, it.qty || 1);
      }
      return next;
    });
  }, []);

  const top = useCallback(
    (n: number) => Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([id]) => id),
    [counts]
  );

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  const value = useMemo(() => ({ counts, increment, incrementMany, top, total }), [counts, increment, incrementMany, top, total]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrderStats() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOrderStats must be used within OrderStatsProvider");
  return ctx;
}
