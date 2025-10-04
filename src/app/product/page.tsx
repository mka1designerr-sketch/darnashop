"use client";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const { addItem } = useCart();
  const gallery = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvfzseZhZySo1YppNPX0h6wqbm4joj-_Azd9p1xfCDuW62TR3Y5TR4fksSxvDAU45oYhekrYxNt2mbU-fq6Z-El0y2MjxbDCbkIxrHybZR8LX-Ncg8z9CJPKwnt1uVlQzW2Gs4e1IV8m1ISrKWgINjo35ZluSax2N9Z_Fhdg0d7X9ZOfBw344pdVEGQJ97foDgrmnrRHWiv5Ecyz9YpVOmYDs2Afv_MchVtPvGZBhUQHg7NDU8NUtcnDY9v9VCaYi1-raHDRFKGfy",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB1hRpED-pkKkVm9xMJtt5AqXFUv18dBeHS3twLvmUp94IJtSHxZ22OLKY6iw8SQKNw1Lz77euCFyrFV733M8H_e3sHFfHwF3CK5APYlwDFj6_BjNx3HKvcAAty0201eQXRrzREaU1LZlOLSvjBIw5NavD091ZYYPyeGgHHOELfiuCrN_z2KSDi2umorFtnPYv6NsMos99YXeKS2X_EScZG8qkgIDQXwo8JI2GY-eLuq4x3hopwGhWw2AWT7tkkL2_S13Ix9txGi8TR",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAbnqlGN5i5ib4joZ_0n8A6XRppc2528-ldQZ8MrSlKR022yWxCDCD9zJwv5mdRPzrk1A8QV2OV3_qcIunRv383RrGEwTprK-J8t6Bx0Mdmzoy3i4sqw1awnbYudmituiPsVAyr6GYRs0vJpfG61WtTw4EodxqPfH4BE0mIE59-CUoFx1917tvarVMblqytyyyLzkOfxA_FDBsqmyuLPl4S80WmYvO52ZCdXOoIwixk3G1jz74YKrWsnmI4pmV5OZxfJpRqzHgg2iGh",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDmbG0NJveNSGZWO2Blguxe8v_kbhVsCdhkduntLfFJboEtRt3_ZX95qoNoIJbq4SMf1FSiBcW0VkDKU6c6TfxjgEe8uc1sw6ZIAMptd6sYn3KEO-ILrDpTiOU9GNxfH9IH_eOdRm7WpUov4FWZiic4rd8cicCT-tqBiQlMEISg3K8p6aZaw1eMRy_0M-RQxA-V4S6EQm9aLqWS89JE3hqrG7_qJMf9D0OMNy0i3o_yBKBFibc38H41OYj86F88iGoQ37qdjDUPNMoy",
  ];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="overflow-hidden rounded-lg">
              <div
                className="aspect-[3/4] bg-cover bg-center"
                style={{ backgroundImage: `url('${gallery[0]}')` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {gallery.slice(1).map((g) => (
                <div key={g} className="overflow-hidden rounded-lg">
                  <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${g}')` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-sm">
                <li>
                  <a className="text-slate-500 hover:text-[var(--color-primary)]" href="#">
                    Femme
                  </a>
                </li>
                <li className="text-slate-400">/</li>
                <li>
                  <a className="text-slate-500 hover:text-[var(--color-primary)]" href="#">
                    Robes
                  </a>
                </li>
                <li className="text-slate-400">/</li>
                <li className="font-medium text-slate-700">Robe d&apos;été</li>
              </ol>
            </nav>

            <h1 className="text-3xl font-extrabold tracking-tight">Robe d&apos;été à fleurs</h1>
            <p className="text-sm text-slate-500">Marque: Zina Mode</p>
            <p className="text-3xl font-bold text-[var(--color-primary)]">3,500 DZD</p>
            <p className="text-base text-slate-600">
              Une robe d&apos;été légère et aérée, parfaite pour les journées chaudes. Motifs floraux délicats, coupe
              fluide et confortable.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Taille</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une taille</legend>
                <div className="flex flex-wrap gap-3">
                  {["S", "M", "L", "XL"].map((s, i) => (
                    <label
                      key={s}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-2 ring-transparent transition-all hover:bg-slate-200 has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 has-[:checked]:text-[var(--color-primary)] has-[:checked]:ring-[var(--color-primary)]/30"
                    >
                      <input className="sr-only" name="size-choice" type="radio" defaultChecked={i === 1} /> {s}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <h3 className="text-sm font-medium">Couleur</h3>
              <fieldset className="mt-2">
                <legend className="sr-only">Choisir une couleur</legend>
                <div className="flex items-center gap-4">
                  {[
                    { c: "#f2f2f2", checked: true },
                    { c: "#336699" },
                    { c: "#ffcc33" },
                  ].map((o) => (
                    <label
                      key={o.c}
                      className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-slate-400 focus:outline-none has-[:checked]:ring has-[:checked]:ring-offset-1"
                    >
                      <input className="sr-only" name="color-choice" type="radio" defaultChecked={!!o.checked} />
                      <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: o.c }} />
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="quantity">
                Quantité
              </label>
              <input
                className="mt-2 block w-24 rounded-lg border-slate-300 bg-white py-2 shadow-sm focus:border-[var(--color-primary)]/50 focus:ring-[var(--color-primary)]/50"
                id="quantity"
                min={1}
                name="quantity"
                type="number"
                defaultValue={1}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() =>
                addItem({ id: "robe-ete", name: "Robe d'été à fleurs", price: 3500, image: gallery[0] }, 1)
              }
              className="flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary)]/90"
            >
              Acheter Maintenant
            </button>
            <button
              onClick={() => addItem({ id: "robe-ete", name: "Robe d'été à fleurs", price: 3500, image: gallery[0] }, 1)}
              className="flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-200/70"
            >
              Ajouter au Panier
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-4">
          <div className="border-b border-slate-200">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              <a className="whitespace-nowrap border-b-2 border-[var(--color-primary)] px-1 py-4 text-sm font-medium text-[var(--color-primary)]" href="#">
                Description Détaillée
              </a>
              <a className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700" href="#">
                Infos de Livraison
              </a>
              <a className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700" href="#">
                Avis Clients
              </a>
            </nav>
          </div>
          <div className="prose prose-slate max-w-none">
            <p>
              Cette robe d&apos;été est fabriquée à partir de coton biologique, assurant un confort optimal et une
              respirabilité maximale. Les motifs floraux sont imprimés avec des encres écologiques, respectueuses de
              l&apos;environnement. Disponible en plusieurs tailles et couleurs pour s&apos;adapter à toutes les morphologies et
              préférences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
