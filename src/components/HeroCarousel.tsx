"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  id: string;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  position: number;
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch("/api/hero-slides", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        const list: Slide[] = Array.isArray(d?.slides) ? d.slides : [];
        setSlides(list.sort((a, b) => a.position - b.position));
        setIdx(0);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!slides.length) return null;

  const current = slides[idx] as Slide | undefined;
  const go = (n: number) => setIdx((p) => (slides.length ? (p + n + slides.length) % slides.length : 0));

  return (
    <section className="relative mb-12 h-[50vh] min-h-[300px] w-full overflow-hidden rounded-lg">
      {current && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${current.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
            {current.title && (
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">{current.title}</h2>
            )}
            {current.subtitle && (
              <p className="mb-4 text-lg">{current.subtitle}</p>
            )}
            {current.ctaHref && current.ctaLabel && (
              <Link
                href={current.ctaHref}
                className="inline-block rounded-full bg-white px-6 py-2 font-bold text-[var(--color-primary)] transition hover:bg-opacity-90"
              >
                {current.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <button
        aria-label="Précédent"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/40"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        aria-label="Suivant"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/40"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Aller à la diapositive ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
