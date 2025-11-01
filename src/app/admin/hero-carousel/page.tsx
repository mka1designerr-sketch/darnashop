"use client";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  position: number;
};

const STORAGE_KEY = "darnashop_admin_secret";

export default function AdminHeroCarouselPage() {
  const [secret, setSecret] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) setSecret(s);
  }, []);

  const headers = useMemo(() => ({ "x-admin-secret": secret }), [secret]);

  async function fetchSlides() {
    if (!secret) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-slides", { headers, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setSlides((Array.isArray(data?.slides) ? data.slides : []).sort((a: Slide, b: Slide) => a.position - b.position));
    } catch (e) {
      setError("Impossible de charger les slides. Secret invalide ?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret]);

  function saveSecret() {
    localStorage.setItem(STORAGE_KEY, secret);
    fetchSlides();
  }

  async function uploadSlide(form: HTMLFormElement) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData(form);
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur d'upload");
      form.reset();
      await fetchSlides();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(`Échec de l'upload: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm("Supprimer cette diapositive ?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur de suppression");
      setSlides((Array.isArray(data?.slides) ? data.slides : []).sort((a: Slide, b: Slide) => a.position - b.position));
    } catch (e) {
      setError("Échec de la suppression.");
    } finally {
      setLoading(false);
    }
  }

  async function reorder(next: Slide[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ order: next.map((s) => s.id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur de réorganisation");
      setSlides((Array.isArray(data?.slides) ? data.slides : []).sort((a: Slide, b: Slide) => a.position - b.position));
    } catch (e) {
      setError("Réorganisation échouée.");
    } finally {
      setLoading(false);
    }
  }

  function move(id: string, delta: number) {
    const index = slides.findIndex((s) => s.id === id);
    if (index < 0) return;
    const to = index + delta;
    if (to < 0 || to >= slides.length) return;
    const copy = slides.slice();
    const [item] = copy.splice(index, 1);
    copy.splice(to, 0, item);
    setSlides(copy.map((s, i) => ({ ...s, position: i })));
    void reorder(copy);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Gestion du Hero Carousel</h1>

      <div className="mb-6 rounded-lg border p-4">
        <label className="block text-sm font-medium">Admin Secret</label>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Saisissez votre secret"
          />
          <button onClick={saveSecret} className="rounded-md bg-black px-4 py-2 text-white">Enregistrer</button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Le secret est stocké localement dans votre navigateur.</p>
      </div>

      <form
        className="mb-8 space-y-3 rounded-lg border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void uploadSlide(e.currentTarget);
        }}
      >
        <h2 className="mb-2 text-lg font-semibold">Ajouter une diapositive</h2>
        <input name="image" type="file" accept="image/*" required className="w-full rounded-md border px-3 py-2" />
        <input name="title" type="text" placeholder="Titre (optionnel)" className="w-full rounded-md border px-3 py-2" />
        <input name="subtitle" type="text" placeholder="Sous-titre (optionnel)" className="w-full rounded-md border px-3 py-2" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input name="ctaLabel" type="text" placeholder="Texte du bouton (optionnel)" className="w-full rounded-md border px-3 py-2" />
          <input name="ctaHref" type="text" placeholder="Lien du bouton (optionnel)" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="pt-2">
          <button disabled={loading || !secret} className="rounded-full bg-black px-5 py-2 text-white disabled:opacity-50">
            {loading ? "En cours..." : "Uploader"}
          </button>
        </div>
      </form>

      {error && <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-3">
        {slides.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
            <img src={s.imageUrl} alt="slide" className="h-16 w-24 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{s.title || <span className="text-gray-500">(Sans titre)</span>}</div>
              <div className="truncate text-sm text-gray-500">{s.subtitle}</div>
              {s.ctaHref && (
                <a href={s.ctaHref} className="truncate text-xs text-blue-600 underline" target="_blank" rel="noreferrer">
                  {s.ctaHref}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(s.id, -1)} disabled={i === 0} className="rounded-md border px-2 py-1 disabled:opacity-50">
                ↑
              </button>
              <button onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} className="rounded-md border px-2 py-1 disabled:opacity-50">
                ↓
              </button>
              <button onClick={() => deleteSlide(s.id)} className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {!slides.length && !loading && <p className="text-sm text-gray-500">Aucune diapositive pour le moment.</p>}
      </div>
    </div>
  );
}
