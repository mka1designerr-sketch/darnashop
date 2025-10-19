export default function LivraisonRetoursPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Livraison & Retours</h1>
      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Livraison</h2>
        <p className="text-black/70">Nous livrons partout en Algérie via nos partenaires. Délais indicatifs: 2 à 5 jours ouvrés selon la wilaya.</p>
        <p className="text-black/70">Paiement à la livraison disponible.</p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Retours</h2>
        <p className="text-black/70">Vous disposez de 7 jours après réception pour demander un retour. L’article doit être neuf, non utilisé et dans son emballage d’origine.</p>
        <p className="text-black/70">Contactez le support via la page Contact pour initier la procédure.</p>
      </section>
    </div>
  );
}
