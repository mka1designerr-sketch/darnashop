"use client";

import { useEffect, useState } from "react";

const KEY = "darna_lang";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"fr" | "ar">("fr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(KEY) as "fr" | "ar")) || "fr";
    setLang(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem(KEY, lang);
    }
  }, [lang]);

  const toggle = () => setLang((p) => (p === "fr" ? "ar" : "fr"));

  return (
    <button
      type="button"
      onClick={toggle}
      title={lang === "fr" ? "Basculer en Arabe" : "Switch to French"}
      className="rounded-full border border-[var(--color-subtle-light)] px-3 py-1 text-xs font-semibold hover:bg-[var(--color-subtle-light)]"
    >
      {lang.toUpperCase()}
    </button>
  );
}
