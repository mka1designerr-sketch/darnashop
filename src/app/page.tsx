"use client";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useOrderStats } from "@/contexts/OrderStatsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function Home() {
  const { t } = useI18n();
  const { products } = useProducts();
  const { top, total } = useOrderStats();
  const { has, toggle } = useFavorites();
  const { addItem } = useCart();

  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DZD`;

  const coverOf = (p: (typeof products)[number]) => {
    const primary = p.variants.find((v) => v.isPrimary && v.images && v.images.length);
    const firstWithImg = primary || p.variants.find((v) => v.images && v.images.length);
    return firstWithImg?.images?.[0] || "";
  };

  const bestIds = total > 0 ? top(6) : [];
  const best = (bestIds.length ? bestIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) : products.slice(0, 6)) as typeof products;
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--color-background-light)] text-[var(--color-text-light)]">

      <main className="container mx-auto grow px-4 py-8 lg:px-8">
        {/* Hero */}
        <section className="relative mb-12 h-[50vh] min-h-[300px] w-full overflow-hidden rounded-lg">
          <div
            className="hero-slide absolute inset-0 h-full w-full bg-cover bg-center"
            style={{
              // demo image
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--bg-image": "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAC2pJKVfM86lYh4oMe_Zkr3ELg0MO4rMuf2idopoWKKZuJzgM3dfusKytCJabo8RlX5c6KDWja6cXrsFdQCSiCy_Q4ldtfaKmD9H0wYNBunrB3mcYbI1Zq4vF3t9AXXKKn6ksOPdIWfe7pGTKB-GOGkDpO3wWLmMKqspO8tjt7OygDOLABN8j7H3CB_BMMKiWnvuQOPakCvUfJgNBYoq1maVrqjkVVnx3mVPzCzDVmlc7yhIIZQvoVPi9O66BNCx01QFCVHeZ0A5aC')",
            } as React.CSSProperties}
          >
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">La Mode pour Toute la Famille</h2>
              <p className="mb-4 text-lg">Collections pour hommes, femmes et enfants.</p>
              <button className="rounded-full bg-white px-6 py-2 font-bold text-[var(--color-primary)] transition hover:bg-opacity-90">
                Découvrir
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <span className="h-2 w-2 cursor-pointer rounded-full bg-white"></span>
            <span className="h-2 w-2 cursor-pointer rounded-full bg-white/50"></span>
            <span className="h-2 w-2 cursor-pointer rounded-full bg-white/50"></span>
          </div>
        </section>

        {/* Trust badges */}
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-subtle-light)] bg-[var(--color-background-light)] p-6 md:grid-cols-3">
            {[
              {
                title: "Livraison Rapide",
                subtitle: "Partout en Algérie",
                icon: (
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                  </svg>
                ),
              },
              {
                title: "Service Client Dévoué",
                subtitle: "À votre écoute 7j/7",
                icon: (
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z"></path>
                  </svg>
                ),
              },
              {
                title: "Paiement à la Livraison",
                subtitle: "Payez en toute confiance",
                icon: (
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM240,56H16a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V64A8,8,0,0,0,240,56ZM193.65,184H62.35A56.78,56.78,0,0,0,24,145.65v-35.3A56.78,56.78,0,0,0,62.35,72h131.3A56.78,56.78,0,0,0,232,110.35v35.3A56.78,56.78,0,0,0,193.65,184ZM232,93.37A40.81,40.81,0,0,1,210.63,72H232ZM45.37,72A40.81,40.81,0,0,1,24,93.37V72ZM24,162.63A40.81,40.81,0,0,1,45.37,184H24ZM210.63,184A40.81,40.81,0,0,1,232,162.63V184Z"></path>
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <div className="rounded-full bg-[var(--color-primary)]/10 p-3 text-[var(--color-primary)]">{item.icon}</div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-black/70">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best sellers */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t("best_sellers")}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-stretch">
            {best.map((p) => {
              const img = coverOf(p);
              return (
                <div key={p.id} className="flex flex-col space-y-3">
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Link href={`/product?id=${encodeURIComponent(p.id)}`}>
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
                    </Link>
                    {p.oldPrice && p.oldPrice > p.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Solde</div>
                    )}
                    <button
                      aria-label={has(p.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      onClick={() => toggle({ id: p.id, name: p.name, image: img, price: p.price })}
                      className="absolute top-2 left-2 grid place-items-center w-8 h-8 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow"
                    >
                      <span
                        className={`material-symbols-outlined ${has(p.id) ? "text-red-500" : "text-gray-800"}`}
                        style={{ fontVariationSettings: `'FILL' ${has(p.id) ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20` }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2 min-w-0 overflow-hidden">
                    <Link href={`/product?id=${encodeURIComponent(p.id)}`} className="font-medium text-sm truncate hover:underline">
                      {p.name}
                    </Link>
                    {/* Rating row */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const value = i + 1;
                        const icon = (p.rating ?? 4) >= value ? "star" : (p.rating ?? 4) >= value - 0.5 ? "star_half" : "star";
                        const color = (p.rating ?? 4) >= value - 0.49 ? "text-yellow-400" : "text-gray-300";
                        return (
                          <span key={i} className={`material-symbols-outlined ${color}`} style={{ fontSize: 16, lineHeight: 1 }}>
                            {icon}
                          </span>
                        );
                      })}
                    </div>
                    {/* Price row */}
                    <div className="flex items-center gap-1">
                      {p.oldPrice && p.oldPrice > p.price && (
                        <>
                          <span className="text-[11px] text-gray-400 line-through whitespace-nowrap">{fmt(p.oldPrice)}</span>
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                          </span>
                        </>
                      )}
                      <span className="font-semibold text-sm whitespace-nowrap">{fmt(p.price)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: img }, 1)}
                        className="flex-1 bg-white border border-gray-300 text-black py-1.5 px-3 rounded-full hover:bg-gray-100 transition-colors text-xs"
                      >
                        Ajouter au panier
                      </button>
                      <Link
                        href={`/product?id=${encodeURIComponent(p.id)}`}
                        className="flex-1 bg-black text-white py-1.5 px-3 rounded-full hover:bg-black/90 transition-colors text-xs text-center flex items-center justify-center leading-none"
                      >
                        Acheter
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">{t("main_categories")}</h2>
          <CategoryCarousel />
        </section>
      </main>
    </div>
  );
}
