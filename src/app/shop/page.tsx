"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
// import { useI18n } from "@/contexts/I18nContext";

export default function ShopPage() {
  return (
    <Suspense fallback={<main className="container mx-auto px-6 py-8 max-w-7xl"><p>Chargement…</p></main>}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const { addItem } = useCart();
  const { has } = useFavorites();
  const params = useSearchParams();
  const r = useRouter();
  const { products } = useProducts();
  const { categories } = useCategories();
  // const { t } = useI18n();

  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DZD`;

  // filters from URL
  const q = (params.get("q") || "").toLowerCase();
  const category = params.get("category") || "";
  const categoryId = params.get("categoryId") || "";
  const min = Number(params.get("min") || 0);
  const max = Number(params.get("max") || 1e9);
  const [rangeMax, setRangeMax] = useState<number>(max && max < 1e9 ? max : 10000);
  const onlyFav = params.get("fav") === "1";

  const items = products.map((p) => {
    const primary = p.variants.find((v) => v.isPrimary && v.images && v.images.length);
    const firstWithImg = primary || p.variants.find((v) => v.images && v.images.length);
    const cover = firstWithImg?.images?.[0] || "";
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      rating: p.rating ?? 4,
      img: cover,
      categories: p.categories,
    };
  });

  const selectedCategoryName = categoryId ? (categories.find((c) => c.id === categoryId)?.name || "") : category;
  const filtered = items.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (categoryId) {
      const catName = selectedCategoryName.toLowerCase();
      const hasId = p.categories.includes(categoryId);
      const hasName = p.categories.some((c) => c.toLowerCase().includes(catName));
      if (!hasId && !hasName) return false;
    } else if (selectedCategoryName) {
      if (!p.categories.some((c) => c.toLowerCase().includes(selectedCategoryName.toLowerCase()))) return false;
    }
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
    <main className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Catégories</h3>
            <ul className="space-y-2">
              {(categories.length ? categories : [{ id: "vetements", name: "Vêtements", cover: "" }, { id: "jouets", name: "Jouets", cover: "" }, { id: "electronique", name: "Électronique", cover: "" }]).map((c) => (
                <li key={c.id}>
                  <button onClick={() => setFilter({ categoryId: c.id, category: undefined })} className={`block w-full rounded-lg px-4 py-2 text-left ${categoryId === c.id || selectedCategoryName === c.name ? "bg-white font-semibold text-black" : "hover:bg-white"}`}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Filtrer par Prix</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">0 DZD</span>
                <span className="text-sm font-semibold">Jusqu&apos;à {fmt(rangeMax)}</span>
              </div>
              <input
                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                type="range"
                min={0}
                max={10000}
                value={rangeMax}
                onChange={(e)=> setRangeMax(Number(e.target.value))}
                onMouseUp={()=> setFilter({ max: rangeMax })}
                onTouchEnd={()=> setFilter({ max: rangeMax })}
                aria-valuenow={rangeMax}
              />
              <div className="flex justify-between text-xs text-black/50">
                <span>0</span>
                <span>10 000+</span>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Trier par</h3>
            <div className="space-y-3">
              {["Popularité", "Nouveautés", "Prix Croissant", "Prix Décroissant"].map((label, i) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input className="form-radio h-4 w-4 text-black bg-white border-gray-300 focus:ring-black" name="sort" type="radio" defaultChecked={i===1} />
                  <span className="text-base">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div key={p.id} className="flex flex-col space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <Link href={go(p).href}>
                    <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url('${p.img}')` }} />
                  </Link>
                  {/* Example badge placeholder: could derive from data in future */}
                  {/* <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Nouveau</div> */}
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href={go(p).href} className="font-bold text-lg truncate hover:underline">{p.name}</Link>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const value = (i + 1);
                        const icon = p.rating >= value ? "star" : p.rating >= value - 0.5 ? "star_half" : "star";
                        const color = p.rating >= value - 0.49 ? "text-yellow-400" : "text-gray-300";
                        return <span key={i} className={`material-symbols-outlined ${color}`}>{icon}</span>;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.oldPrice && p.oldPrice > p.price && (
                        <>
                          <span className="text-sm text-gray-400 line-through">{fmt(p.oldPrice)}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-{Math.round(((p.oldPrice - p.price)/p.oldPrice)*100)}%</span>
                        </>
                      )}
                      <span className="font-semibold text-lg">{fmt(p.price)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => add(p)} className="flex-1 bg-white border border-gray-300 text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors text-sm">Ajouter au panier</button>
                    <Link href={go(p).href} className="flex-1 bg-black text-white py-2 px-4 rounded-full hover:bg-black/90 transition-colors text-sm text-center flex items-center justify-center leading-none">Acheter</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recommendations */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Découvrez nos recommendations</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(filtered.length ? filtered : items).slice(0, 4).map((p) => (
            <div key={`rec-${p.id}`} className="flex flex-col space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <Link href={go(p).href}>
                  <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url('${p.img}')` }} />
                </Link>
              </div>
              <div className="flex flex-col space-y-3">
                <Link href={go(p).href} className="font-bold text-lg truncate hover:underline">{p.name}</Link>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const value = (i + 1);
                      const icon = p.rating >= value ? "star" : p.rating >= value - 0.5 ? "star_half" : "star";
                      const color = p.rating >= value - 0.49 ? "text-yellow-400" : "text-gray-300";
                      return <span key={i} className={`material-symbols-outlined ${color}`}>{icon}</span>;
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {p.oldPrice && p.oldPrice > p.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{fmt(p.oldPrice)}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-{Math.round(((p.oldPrice - p.price)/p.oldPrice)*100)}%</span>
                      </>
                    )}
                    <span className="font-semibold text-lg">{fmt(p.price)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => add(p)} className="flex-1 bg-white border border-gray-300 text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors text-sm">Ajouter au panier</button>
                  <Link href={go(p).href} className="flex-1 bg-black text-white py-2 px-4 rounded-full hover:bg-black/90 transition-colors text-sm text-center flex items-center justify-center leading-none">Acheter</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-800 text-white rounded-[24px] mt-16">
        <div className="mx-auto max-w-4xl py-16 px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à découvrir nos nouveautés ?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Soyez les premiers informés de nos derniers arrivages, de nos offres exclusives et de nos histoires en coulisses. Rejoignez la famille DARNA SHOP !</p>
          <div className="relative max-w-lg mx-auto">
            <input className="w-full bg-gray-700 border-transparent rounded-full py-4 pl-6 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" placeholder="Entrez votre adresse e-mail" type="email" />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 bg-white text-gray-800 rounded-full hover:bg-gray-200 transition-colors" type="button">
              <span className="material-symbols-outlined leading-none">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
