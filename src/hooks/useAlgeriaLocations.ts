"use client";

import { useEffect, useState } from "react";

type Wilaya = { code: string; name: string; name_ar?: string };
type Commune = { name: string; name_ar?: string; wilaya_code: string };
type DeliveryMethod = "home" | "desk";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const PRICES: Record<string, { home: number; desk: number }> = {
  [norm("Adrar")]: { home: 1300, desk: 800 },
  [norm("Chlef")]: { home: 900, desk: 400 },
  [norm("Laghouat")]: { home: 1000, desk: 500 },
  [norm("Oum El Bouaghi")]: { home: 900, desk: 400 },
  [norm("Batna")]: { home: 900, desk: 400 },
  [norm("Bejaia")]: { home: 900, desk: 400 },
  [norm("Biskra")]: { home: 1000, desk: 600 },
  [norm("Bechar")]: { home: 1000, desk: 600 },
  [norm("Blida")]: { home: 900, desk: 400 },
  [norm("Bouira")]: { home: 900, desk: 400 },
  [norm("Tamanrasset")]: { home: 1600, desk: 1000 },
  [norm("Tebessa")]: { home: 1000, desk: 600 },
  [norm("Tlemcen")]: { home: 900, desk: 400 },
  [norm("Tiaret")]: { home: 900, desk: 400 },
  [norm("Tizi Ouzou")]: { home: 900, desk: 300 },
  [norm("Alger")]: { home: 700, desk: 300 },
  [norm("Djelfa")]: { home: 1000, desk: 600 },
  [norm("Jijel")]: { home: 900, desk: 400 },
  [norm("Setif")]: { home: 900, desk: 400 },
  [norm("Saida")]: { home: 900, desk: 400 },
  [norm("Skikda")]: { home: 900, desk: 400 },
  [norm("Sidi Bel Abbes")]: { home: 700, desk: 300 },
  [norm("Annaba")]: { home: 900, desk: 400 },
  [norm("Guelma")]: { home: 900, desk: 400 },
  [norm("Constantine")]: { home: 900, desk: 400 },
  [norm("Medea")]: { home: 900, desk: 400 },
  [norm("Mostaganem")]: { home: 700, desk: 300 },
  [norm("Msila")]: { home: 900, desk: 400 },
  [norm("Mascara")]: { home: 700, desk: 300 },
  [norm("Ouargla")]: { home: 1000, desk: 600 },
  [norm("Oran")]: { home: 300, desk: 300 },
  [norm("Illizi")]: { home: 1800, desk: 1200 },
  [norm("El Bayadh")]: { home: 1000, desk: 600 },
  [norm("Bordj Bou Arreridj")]: { home: 900, desk: 400 },
  [norm("Boumerdes")]: { home: 900, desk: 400 },
  [norm("El Tarf")]: { home: 900, desk: 400 },
  [norm("Tissemsilt")]: { home: 900, desk: 400 },
  [norm("El Oued")]: { home: 1000, desk: 600 },
  [norm("Tindouf")]: { home: 1600, desk: 1000 },
  [norm("Khenchela")]: { home: 900, desk: 400 },
  [norm("Souk Ahras")]: { home: 900, desk: 400 },
  [norm("Tipaza")]: { home: 900, desk: 400 },
  [norm("Mila")]: { home: 800, desk: 400 },
  [norm("Ain Defla")]: { home: 900, desk: 400 },
  [norm("Naama")]: { home: 1000, desk: 600 },
  [norm("Ain Temouchent")]: { home: 700, desk: 300 },
  [norm("Ghardaia")]: { home: 1000, desk: 600 },
  [norm("Relizane")]: { home: 900, desk: 400 },
};

// Common spelling aliases from external tables to official names
const ALIASES: Record<string, string> = {
  [norm("Tamenrasset")]: norm("Tamanrasset"),
  [norm("Media")]: norm("Medea"),
  [norm("Mosta")]: norm("Mostaganem"),
  [norm("Ouergla")]: norm("Ouargla"),
  [norm("Khenchla")]: norm("Khenchela"),
  [norm("Soukahras")]: norm("Souk Ahras"),
  [norm("Bayed")]: norm("El Bayadh"),
  [norm("Bordj Bouariridj")]: norm("Bordj Bou Arreridj"),
  [norm("El Taref")]: norm("El Tarf"),
  [norm("Tissemsilet")]: norm("Tissemsilt"),
  [norm("Eloued")]: norm("El Oued"),
  [norm("Sidi Belabes")]: norm("Sidi Bel Abbes"),
  // From AbderrahmeneDZ dataset variations
  [norm("Tbessa")]: norm("Tebessa"),
  [norm("Saefda")]: norm("Saida"),
  [norm("Ghardaefa")]: norm("Ghardaia"),
};

const W_KEY = "dz_wilayas_cache_v3"; // bump to refresh from new API/source
const C_KEY = "dz_communes_cache_v3";

export function useAlgeriaLocations() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // pricing table is embedded above (PRICES)

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
          fetch("/api/dz/wilayas"),
          fetch("/api/dz/communes"),
        ]);
        if (!wRes.ok || !cRes.ok) throw new Error("Failed to load DZ data");
        const wJson = (await wRes.json()) as Array<{ code: string | number; name: string; name_ar?: string }>;
        const cJson = (await cRes.json()) as Array<{ name: string; name_ar?: string; wilaya_code: string | number }>;
        const ws: Wilaya[] = wJson.map((w) => ({ code: String(w.code), name: String(w.name), name_ar: w.name_ar }));
        const cs: Commune[] = cJson.map((c) => ({ name: String(c.name), name_ar: c.name_ar, wilaya_code: String(c.wilaya_code) }));
        if (!cancelled) {
          setWilayas(ws);
          setCommunes(cs);
          try {
            localStorage.setItem(W_KEY, JSON.stringify(ws));
            localStorage.setItem(C_KEY, JSON.stringify(cs));
          } catch {}
          setLoading(false);
        }
      } catch (e: unknown) {
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
          setError(e instanceof Error ? e.message : "load_error");
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

  function deliveryPrice(code: string, method: DeliveryMethod): number {
    const name = wilayas.find((w) => w.code === code)?.name;
    if (!name) return 0;
    let key = norm(name);
    if (ALIASES[key]) key = ALIASES[key];
    const p = PRICES[key];
    if (!p) return 0;
    return method === "home" ? p.home : p.desk;
  }

  return { wilayas, communes, byWilaya, loading, error, deliveryPrice };
}
