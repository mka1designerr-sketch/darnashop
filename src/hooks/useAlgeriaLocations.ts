"use client";

import { useEffect, useMemo, useState } from "react";

type Wilaya = { code: string; name: string; name_ar?: string };
type Commune = { name: string; name_ar?: string; wilaya_code: string };

const W_KEY = "dz_wilayas_cache_v1";
const C_KEY = "dz_communes_cache_v1";

export function useAlgeriaLocations() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        // try cache first
        const wCached = typeof localStorage !== "undefined" ? localStorage.getItem(W_KEY) : null;
        const cCached = typeof localStorage !== "undefined" ? localStorage.getItem(C_KEY) : null;
        if (wCached && cCached) {
          if (!cancelled) {
            setWilayas(JSON.parse(wCached));
            setCommunes(JSON.parse(cCached));
            setLoading(false);
          }
          return;
        }

        const [wRes, cRes] = await Promise.all([
          fetch("https://raw.githubusercontent.com/dzcode-io/leblad/master/data/wilayas.json"),
          fetch("https://raw.githubusercontent.com/dzcode-io/leblad/master/data/communes.json"),
        ]);
        if (!wRes.ok || !cRes.ok) throw new Error("Failed to load DZ data");
        const wJson = (await wRes.json()) as any[];
        const cJson = (await cRes.json()) as any[];
        const ws: Wilaya[] = wJson.map((w) => ({ code: String(w.code), name: w.name, name_ar: w.name_ar }));
        const cs: Commune[] = cJson.map((c) => ({ name: c.name, name_ar: c.name_ar, wilaya_code: String(c.wilaya_code) }));
        if (!cancelled) {
          setWilayas(ws);
          setCommunes(cs);
          try {
            localStorage.setItem(W_KEY, JSON.stringify(ws));
            localStorage.setItem(C_KEY, JSON.stringify(cs));
          } catch {}
          setLoading(false);
        }
      } catch (e) {
        // fallback minimal list to keep UI functional offline
        const ws: Wilaya[] = [
          { code: "16", name: "Alger", name_ar: "الجزائر" },
          { code: "31", name: "Oran", name_ar: "وهران" },
          { code: "25", name: "Constantine", name_ar: "قسنطينة" },
        ];
        const cs: Commune[] = [
          { name: "Alger Centre", name_ar: "الجزائر الوسطى", wilaya_code: "16" },
          { name: "Bir Mourad Raïs", name_ar: "بئر مراد رايس", wilaya_code: "16" },
          { name: "Oran", name_ar: "وهران", wilaya_code: "31" },
          { name: "Es Senia", name_ar: "السانية", wilaya_code: "31" },
          { name: "Constantine", name_ar: "قسنطينة", wilaya_code: "25" },
        ];
        if (!cancelled) {
          setError((e as Error)?.message ?? "load_error");
          setWilayas(ws);
          setCommunes(cs);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const byWilaya = (code: string) => communes.filter((c) => c.wilaya_code === code);

  return { wilayas, communes, byWilaya, loading, error };
}
