"use client";

import { useI18n } from "@/contexts/I18nContext";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const toggle = () => setLang(lang === "fr" ? "ar" : "fr");

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
