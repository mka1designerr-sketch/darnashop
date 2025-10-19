export default function CGVPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Conditions Générales de Vente</h1>
      <p className="mt-4 text-black/70">Ces conditions régissent les ventes réalisées sur DARNA SHOP. En commandant, vous acceptez les présentes conditions. Les prix sont indiqués en DZD et incluent les taxes applicables. Le paiement s’effectue à la livraison sauf mention contraire.</p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-black/70">
        <li>Commandes: validation après confirmation par nos équipes.</li>
        <li>Livraison: délais indicatifs, variables selon la wilaya.</li>
        <li>Retours: sous 7 jours, article neuf et emballage d’origine.</li>
        <li>Garanties: légales selon la réglementation en vigueur.</li>
      </ul>
    </div>
  );
}
