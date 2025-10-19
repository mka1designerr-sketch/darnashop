export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">FAQ</h1>
      <div className="mt-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Quels sont les délais de livraison ?</h2>
          <p className="text-black/70">Selon la wilaya, 2 à 5 jours ouvrés. Le paiement se fait à la livraison.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Comment suivre ma commande ?</h2>
          <p className="text-black/70">Vous recevez un SMS et un email avec le numéro de suivi après expédition.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Puis-je retourner un article ?</h2>
          <p className="text-black/70">Oui, sous 7 jours après réception, article non utilisé et emballage intact.</p>
        </div>
      </div>
    </div>
  );
}
