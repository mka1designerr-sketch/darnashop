"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCategories } from "@/contexts/CategoriesContext";
import { useI18n } from "@/contexts/I18nContext";

type Item = { title: string; bg: string };

export default function CategoryCarousel() {
  const { categories } = useCategories();
  const { lang } = useI18n();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const items: Item[] = (categories.length
    ? categories.map((c) => ({ title: c.name, bg: c.cover }))
    : [
        {
          title: "Mode & Vêtements",
          bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbhG36T44DaUGrgaHrkqOgSr6fvLILLocgLSKMBs1E4QaOlB-FVdHrvxviuGCwaHWvSUT-4MUok9kXJl7-0Ix-86EsBH41b1q-kUA6PxK8UaBVFJExbvpw0r19G2p3D6_ZQYq8bfGYtQavb9A8Vep7sFT8TRQVsptlcrScHZkF1Mz_zjGyulGhbXmPxehQfgGsG9MAZ9ZoM1d_3wtTOAYQzqB1XHP37cb2erTKyKAzbTkG7DzSQVMr-O1GjLTLIwig5KQy7zti0F-j",
        },
        {
          title: "Jeux & Jouets",
          bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtPQOipc1QxN_DTgck-843xIv8cvJIIZruLwUzLRy_U385jy3cc-DlYmde8O5dRLLgov86D1saKTFAlebM63AMQXlTIzdItbG8m7foecvcQb42Kvma-21XCZ2LHvNx6rdWQu31VUJBk7w30fnuvGd3m8pFB954PiIcuF68lszu8Pke_CTd_0PmjDTAYoTpcqJkue1wx0z_u-jVkEobfpVdK1-urxV8zZ53hrEQvV-Ysno275cWIMVxV_hjuHvSRPeK1LPo0nSnHVqY",
        },
        {
          title: "Électronique & Gadgets",
          bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxS-merjzq6c37NiF5gQJWBA4o8a3NlrZumKClL8F-9b8BCRxdyHyhU1bOlSBt2Rmif47cP-uer08BK4S1sfs2XNwo_vWcugp_TkMeYa69Rm1t294_Qtj_yH6Mttqu13vajBCrZQUJA66QV6zCPkELlp3CdhtGRrRVazA8pSbiOOEE2mxIxCpVrZmbluZ8yHlFeJIugwAsWiDAQ-7meC5SorXQ4n3w-kbwnddejhCHwWWZHCWMjfoKXHh0Yk61molsTi6Kvro2kie6",
        },
      ]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const visible = 3; // responsive handled via CSS snap; autoplay steps by 1

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, items.length));
    }, 3000);
    return () => clearInterval(id);
  }, [items.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  function step(delta: number) {
    setIndex((i) => {
      const n = items.length;
      return ((i + delta) % n + n) % n;
    });
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide"
        dir={dir}
      >
        {items.map((c) => (
          <Link
            key={c.title}
            className="group relative flex h-48 min-w-[280px] snap-center items-end justify-start overflow-hidden rounded-lg p-6 text-white sm:h-56 md:h-64"
            href={`/shop?category=${encodeURIComponent(c.title)}`}
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url('${c.bg}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="relative z-10 text-xl font-bold md:text-2xl">{c.title}</h3>
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <button onClick={() => step(dir === "rtl" ? 1 : -1)} className="pointer-events-auto rounded-full bg-white/80 p-2 text-black shadow hover:bg-white">
          ‹
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <button onClick={() => step(dir === "rtl" ? -1 : 1)} className="pointer-events-auto rounded-full bg-white/80 p-2 text-black shadow hover:bg-white">
          ›
        </button>
      </div>
    </div>
  );
}
