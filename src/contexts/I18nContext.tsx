"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Lang = "fr" | "ar";
type Dict = Record<string, Record<Lang, string>>;

const KEY = "darna_lang";

const dict: Dict = {
  nav_new: { fr: "Nouveautés", ar: "الجديد" },
  nav_women: { fr: "Femme", ar: "نساء" },
  nav_men: { fr: "Homme", ar: "رجال" },
  nav_kids: { fr: "Enfants", ar: "أطفال" },
  nav_elec: { fr: "Électronique", ar: "إلكترونيات" },
  nav_promos: { fr: "Promotions", ar: "تخفيضات" },
  search_placeholder: { fr: "Rechercher...", ar: "ابحث..." },
  validate: { fr: "Valider", ar: "تأكيد" },
  close: { fr: "Fermer", ar: "إغلاق" },
  buy_now: { fr: "Acheter Maintenant", ar: "شراء الآن" },
  add_to_cart: { fr: "Ajouter au Panier", ar: "أضف إلى السلة" },
  products: { fr: "Produits", ar: "المنتجات" },
  categories: { fr: "Catégories", ar: "الفئات" },
  filter_price: { fr: "Filtrer par Prix", ar: "تصفية حسب السعر" },
  sort_by: { fr: "Trier par", ar: "ترتيب حسب" },
  best_sellers: { fr: "Meilleures Ventes", ar: "الأكثر مبيعًا" },
  main_categories: { fr: "Catégories Principales", ar: "الفئات الرئيسية" },
};

type I18nState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
};

const Ctx = createContext<I18nState | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const saved = (localStorage.getItem(KEY) as Lang) || "fr";
      setLangState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const t = useCallback((key: keyof typeof dict) => dict[key]?.[lang] ?? String(key), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used within I18nProvider");
  return v;
}
