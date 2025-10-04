export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--color-background-light)] text-[var(--color-text-light)]">
      {/* Shared Header */}
      {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
      {require("@/components/Header").default({})}

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
          <h2 className="mb-6 text-2xl font-bold">Meilleures Ventes</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Chemise en lin", price: "3,499 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLrPG1qXWQ4hioSagVYjShAkRR_HKhX8zuvuXuud3IBnik10tsvotnfSdYPzZxORDBy_4WkbViKvRJ2ISU9AQHLrcpYQswfxZcEa_PuB9OyP3vk8Sistai-o9a4tfIlmzkyPdU79faEdT5I-xxV-MwrPswpSQQFscMP6z0sLNVglpDSJfKRJwu10mRqLXSJgtBT56RmDcmR9wsSkOQRUhkGUjptIrhosOn7mH6WspTWM81tzC4dAN21PvTdYgftWQ6tFm9xDc4DIyp" },
              { name: "Robe d'été", price: "4,999 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDEC4eVKo5dM8tVc4MLHFB8CXBY8TJmCaZ5osjgeMSno_3xhvAuyh2pyA9MfecfscYwTe6T32Jmk2IPGUKZVtcjX4R-STR3_tGs0kf10vm4_FdGYGRIwikInG0C8VtsdrCUmTMWs5ERL-k-UKQpDXo4DOm7T5osNRm2a0Y9kxfcD4-pduy6M6iq4Lsd1ydMLtHUejg2nskA5nrDbRPMQvif-M2MoASVK3q2L-MC44tgMXD4eu8EWLQ_0iknrRo13DkHICt2Spv5XpU" },
              { name: "Casque sans fil", price: "7,800 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkJTx-e_f7vov0TUvRZHxdhhfql4JITt2_tepO2ldOOdIRmq3vapkawts7IY1nem0LMwZjnscwWgQmEXOyMchMwxmrroivTmGwFWGVUnfR16LfK3MlYvb6rQ1fae2KxhO57KENARbmJSArF1uc5QA56bAf21my2E-y03j7O32-R_t2woL345fW4JmiPGN5_X6ta1R7LFIeAxOSETKCScUXfLvFIgZPhX2LHPlZPhG401Mk7S8rWPH3YaCquKaYXOOwHl5c6gXZvkGE" },
              { name: "Jeu de construction", price: "2,500 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK1Oasg4cXBwHDYUykxTVbHg2tvkzSjP5y0SXyHGFf1iwCQqcS32d3aosLU_D7U2vEDH_IKk3vbPChs5A61gnw_ZNgSp6cxel4B_kdwhnbc0CGcpPvTizMsqAx854gdETENGP8vi_lQkE5KVm1Lv3d7dLUVnC2BQi6QmDTmci5b93uyKXM2xT8N4SemH_qCe-NBor0gI2zCvnlJRhvTCKXtqjXKkPnXqNmUYyev0eZBNVm_ODhgVGwSyHR3gkVaSVBTzDiRi7DpfcW" },
              { name: "Montre connectée", price: "9,990 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt-Xd2U4BFLmdB84DtfUUcp5UpXIZ4GAR4-A7vLmpKo5FWywQAq9WmE2ADUV7jbVliKWL7Hkxnjx4T5Dw58TgZy0IS7RrzKnmBlxbAaZ9S-ns6eQcAneLvddQdR9TN583NuyOVo3V-QUX3fGBK-qe4WQDwRfQLOAvXdv4kusVQi-ml_h-SGA56-g5wG_CQzpP4wxELS6RoODVlTs2fbU3XbuustuJkqQwXVBHWl5ByigqvjD1uNeIerDBMFNnonUztf3fbkvpxveT_" },
              { name: "Sac à dos", price: "4,200 DA", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsYlvAstFpbpZN0NOVmF33rX1PSgqNeffkjW4HOFGw7W82E00h3NWyTvvOlzaO6wl-EeSL_EyCvYf4vBvBzPX53HyycawSGR2CFapvTMLuMY19DjlhtNBfMCNpQa8CW2lqaFfuRmwVNarmQCFDqikblfpWILmxUjCgxfLSnd8QWzi1Vp3WyY36ZDSTwQMWg3n37E_WgTJ6Hhz9ganImbM_fDR2WhGvDSaT12zvEn_Af1HMvQy8dh9Q_hkmuhpybhshj7JVpD28y1TC" },
            ].map((p) => (
              <div key={p.name} className="group">
                <div className="mb-2 w-full overflow-hidden rounded-lg bg-cover bg-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={p.name} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" src={p.src} />
                </div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="font-bold text-[var(--color-primary)]">{p.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Catégories Principales</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((c) => (
              <a key={c.title} className="group relative flex aspect-video items-end justify-start overflow-hidden rounded-lg p-6 text-white" href="#">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url('${c.bg}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold">{c.title}</h3>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
