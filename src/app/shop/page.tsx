"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { useI18n } from "@/contexts/I18nContext";

export default function ShopPage() {
  const { addItem } = useCart();
  const { toggle, has } = useFavorites();
  const params = useSearchParams();
  const r = useRouter();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { t } = useI18n();

  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DZD`;

  // filters from URL
  const q = (params.get("q") || "").toLowerCase();
  const category = params.get("category") || "";
  const min = Number(params.get("min") || 0);
  const max = Number(params.get("max") || 1e9);
  const onlyFav = params.get("fav") === "1";

  const items = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    img: p.variants[0]?.images[0] || "",
    categories: p.categories,
  }));

  const filtered = items.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (category && !p.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()))) return false;
    if (p.price < min || p.price > max) return false;
    if (onlyFav && !has(p.id)) return false;
    return true;
  });

  const go = (p: (typeof items)[number]) => ({
    href: `/product?id=${encodeURIComponent(p.id)}`,
  });

  const add = (p: (typeof items)[number]) => addItem({ id: p.id, name: p.name, price: p.price, image: p.img }, 1);

  const setFilter = (next: Record<string, string | number | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "") url.searchParams.delete(k);
      else url.searchParams.set(k, String(v));
    });
    r.push(`/shop${url.search}`);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 xl:grid-cols-5">
        <aside className="lg:col-span-1 xl:col-span-1">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">{t("categories")}</h3>
              <ul className="space-y-2">
                {(categories.length ? categories.map((c) => c.name) : ["Vêtements", "Jouets", "Électronique"]).map((c) => (
                  <li key={c}>
                    <button onClick={() => setFilter({ category: c })} className="block w-full rounded px-4 py-2 font-semibold transition-colors hover:bg-[var(--color-primary)]/10 text-left">
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">{t("filter_price")}</h3>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input type="number" min={0} placeholder="Min" defaultValue={min || ""} className="w-24 rounded border px-2 py-1" onBlur={(e) => setFilter({ min: e.target.value })} />
                  <input type="number" min={0} placeholder="Max" defaultValue={max && max < 1e9 ? max : ""} className="w-24 rounded border px-2 py-1" onBlur={(e) => setFilter({ max: e.target.value })} />
                  <button onClick={() => setFilter({ min: 0, max: 1e9 })} className="rounded border px-2 py-1 text-sm">Réinitialiser</button>
                </div>
                <div className="flex justify-between text-sm mt-1 text-black/80">
                  <span>{min ? `${min} DZD` : "Min"}</span>
                  <span>{max && max < 1e9 ? `${max} DZD` : "Max"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">{t("sort_by")}</h3>
              <div className="space-y-3">
                {[
                  "Popularité",
                  "Nouveautés",
                  "Prix Croissant",
                  "Prix Décroissant",
                ].map((label, i) => (
                  <label
                    key={label}
                    className="flex items-center gap-3 p-3 rounded border border-[var(--color-subtle-light)] cursor-pointer has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 transition-all"
                  >
                    <input
                      className="h-5 w-5 border-2 border-[var(--color-subtle-light)] bg-transparent text-transparent checked:border-[var(--color-primary)] checked:bg-[image:var(--radio-dot-svg)] focus:ring-0 focus:ring-offset-0 transition"
                      name="sort-by"
                      type="radio"
                      defaultChecked={i === 0}
                    />
                    <span className="font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3 xl:col-span-4">
          <h1 className="text-4xl font-bold mb-6">{t("products")}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.name} className="group relative overflow-hidden rounded-lg border border-[var(--color-subtle-light)] bg-[var(--color-background-light)] transition-shadow hover:shadow-xl">
                <div className="absolute top-2 right-2 z-10">
                  <button onClick={() => toggle({ id: p.id, name: p.name, image: p.img, price: p.price })} className={`p-2 rounded-full bg-white/60 transition-colors ${has(p.id) ? "text-red-500" : "text-black/70 hover:text-red-500"}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </button>
                </div>
                <Link href={go(p).href}>
                  <div className="aspect-square w-full bg-cover bg-center" style={{ backgroundImage: `url('${p.img}')` }} />
                </Link>
                <div className="p-4">
                  <Link href={go(p).href} className="font-semibold text-base truncate hover:text-[var(--color-primary)]">
                    {p.name}
                  </Link>
                  <p className="font-bold text-lg text-[var(--color-primary)] mt-1">{fmt(p.price)}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-background-light)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button onClick={() => add(p)} className="w-full bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
