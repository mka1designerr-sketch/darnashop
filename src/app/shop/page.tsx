"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function ShopPage() {
  const { addItem } = useCart();
  const { toggle, has } = useFavorites();
  const params = useSearchParams();
  const r = useRouter();
  const products = [
    {
      name: "Chemise en lin",
      price: 2500,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuApwks67sac6VrF_M7auwEyzntrUFO6Egej29c61GNHTLIyRuqFguWfXnXw9OhfI2xWTdoQoVw-CFX5kVsArkCPqJ64zkUIlcLIh0h4bi3Wt-yJJnHmWhnh4uJjoRxnyW72MteDdOExzAogzAtIg225BEXPpMtWkEiKjg2hSkGu2zdyYRRZzpp02FYaBOiR9m6Sb3zZI85qfs6IVAyAWCW0MTYiuaKlkNobfDBWW2_xjS60xM6op7QkW3Vz6tUFAYxfhC9qKXGa7ibI",
    },
    {
      name: "Robe d'été",
      price: 3000,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBkcPZrnMcIt5GOaICwqjnK1pOA0zOFhlykRYNqukO6GtYX1djs9lu2gdy8QFS-iLdJSbdlH9L-IJgv4O6m_ot_CQbNOyEdQu0SoDYYv5lvRaRIr-nMwi-oQGXUGaVZfGvNROmXWGF88_r95Vf4-PDH0_UZ83QZ2m4jlJ-mGfPzePWp4v3DWbx_HPrc0P1aClFg0L03WF7yQgUrl5ih5OtNZQsAv3HCCtIyhxHwO3Mob4amyFtxkvm_LvketvNs7R38CHH2tcdoCkZD",
    },
    {
      name: "Casque audio sans fil",
      price: 4500,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDuM3CD74ixrUqYC9a451KuPmIMQDMaoV74UoFm5PvW6oGVIz1gGofdtI50gudrKWh4Thm5J0uD3O3dYDasZ4oeKzRIr3WK_y3I6WlEu_Bx6rpCkuljMsS9GE2ih6WoBzZwb5MCYVkSbAUojrWUSGHgNN1TB4jpYvJl2q76RFzKF0tkmBAtQMcTcdinGHcoFjffJ95ujoz2ZREkrtF9_2FFWq5EMe5iLyQL0tn_WVxvr8-BOndAPnGrVgWjnHk9YguzVjmZfEAObXQB",
    },
    {
      name: "Jeu de construction",
      price: 1500,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDZoZ-0zTxgDDcQKdxK7hB_QbuYCP8ApRCeNKoSIjqcCDL_AUf2SbdIgnEN-OxpADZjuLGs9HHjyGglw7WbG2QR80iFSXnppMfiCfteL4ADIPaMOtCeaMWD5EyQPm94kGd_ZmJeOwsDZCHQYSpI-Ysv0fiIkOLVimbKDuptxr_6fVxQvpMJcByOmRuw4Y1syr-6hag_oY0w1DCkKrWJskw_ACtO5v3j2-6nyO5emhR7KVBNwFi_-73PXSZ_54WOtqPWsJ3xhyxR0-SB",
    },
    {
      name: "Pantalon cargo",
      price: 3500,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBHzxF8aiwsz4wa3I0GbnzlLEqB1-CUkbiMOq3fmGfzDxsrZJUfYtbOrn2Ndx0ZC1kjP6SCKKKDzEG5kteZV6FgKLW90ilJUjLvm6NLArqK5yAI2A2NqzrxiykPWj0b4GS-5FcS5BYA54f_IoXTyoqG54RFGq1m32e-sRk24FfM63TunnH4-hzJuE8OAiIauD0ps2TcMAWBVrmD9TYwNE3uhopdcKGJ9Hiv1GKCxVhCDj6F7NC1ewfEKdSDdkypvqDCZ_QZz4ic0wKT",
    },
    {
      name: "T-shirt imprimé",
      price: 1800,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuABKfkl34tV21ArCixO_lVlorICcHToQ5ciRuslFBo2KuxP8o5NIuBp1WVdhK8Zei7wXNdUxx702j-sdJofMgaerLiL-N9lSX8-Bms4N0guvXHrnmAfq3Q2_uKBnWvru9T8pm7LaF9nWz3QIiuhgy7Xz8-roSrCgQ05ZMu3_1ErXq_HrySWWrMONDG3eHnRHmlNIxCZxu78LQEZ_g3-SK3wF14LyKxalvz0_W8I5P-I3y43xYsru2RqZx3adZu-pl7nFy1kNzvS2HMh",
    },
    {
      name: "Montre connectée",
      price: 6000,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYGUUnYkvtBdlrZuBWdlrVfYKcnk0YvgsCHFw5kJbAxPhmCOQobYiRprAQ__rBEJV5MobbEPdjwuVuhKmgv9V3MzErrRnshpnTYv4UD_S2KEIaSP_pDT5399dBP-Z3UcIKlJQRvVQL4zlf4VC5mmn-xU6Tk9hkwsOhnkiq4ix71jnPukk2qO3E6BhFOcj8Ei4GpxJ39A2QK93n3TJ2cqjXa2q8zT0y2Xv6u3oY_sION0G69pLpAOBOFFEXJPt_LMaq8O2p3WpwLoDr",
    },
    {
      name: "Poupée articulée",
      price: 1200,
      img:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCih_fjgPo7TB5Ltz-b125TAOXCvhBh9Plf877zlUA1JfCYWitgreHrh6pE1NB_XFr9X1A5QGzms23DprVjTe0B1-EnO-4-bR7l5NB4KnlWPtbSXxrmoRDHrSr-XelEWSNz9eEq0cUS6kEnpXyA5JnV2J-_vHkUOqYD7kgcoDuXaPz9Impn6EBKGeJIP-ElSS9s-osb9hOimHZaWNNCN1HLF5ts5RXiS9MM45FDXr-_g4wkvB9RxlvkrOW3tS9oXdhSJsRuUHr1Wvkk",
    },
  ];

  const fmt = (v: number) => `${v.toLocaleString("fr-DZ")} DZD`;

  // filters from URL
  const q = (params.get("q") || "").toLowerCase();
  const category = params.get("category") || "";
  const min = Number(params.get("min") || 0);
  const max = Number(params.get("max") || 1e9);
  const onlyFav = params.get("fav") === "1";

  const filtered = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (category && !p.name.toLowerCase().includes(category.toLowerCase())) return false; // demo category match by name
    if (p.price < min || p.price > max) return false;
    if (onlyFav && !has(p.name)) return false;
    return true;
  });

  const go = (p: (typeof products)[number]) => ({
    href: `/product?name=${encodeURIComponent(p.name)}`,
  });

  const add = (p: (typeof products)[number]) =>
    addItem({ id: p.name, name: p.name, price: p.price, image: p.img }, 1);

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
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">
                Catégories
              </h3>
              <ul className="space-y-2">
                {["Vêtements", "Jouets", "Électronique"].map((c) => (
                  <li key={c}>
                    <button onClick={() => setFilter({ category: c })} className="block w-full rounded px-4 py-2 font-semibold transition-colors hover:bg-[var(--color-primary)]/10 text-left">
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">
                Filtrer par Prix
              </h3>
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
              <h3 className="text-xl font-bold mb-4 border-b-2 border-[var(--color-primary)] pb-2">
                Trier par
              </h3>
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

        <section className="w-full lg:w-3/4 xl:w-4/5">
          <h1 className="text-4xl font-bold mb-6">Produits</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.name} className="group relative overflow-hidden rounded-lg border border-[var(--color-subtle-light)] bg-[var(--color-background-light)] transition-shadow hover:shadow-xl">
                <div className="absolute top-2 right-2 z-10">
                  <button onClick={() => toggle({ id: p.name, name: p.name, image: p.img, price: p.price })} className={`p-2 rounded-full bg-white/60 transition-colors ${has(p.name) ? "text-red-500" : "text-black/70 hover:text-red-500"}`}>
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
