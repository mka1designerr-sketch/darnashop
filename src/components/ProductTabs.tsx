const ProductTabs = () => {
  return (
    <div className="mt-16">
      <div className="border-b border-subtle-light dark:border-subtle-dark">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <a
            className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm tracking-wide"
            href="#"
          >
            Description Détaillée
          </a>
          <a
            className="border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-primary hover:border-primary/50 whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm tracking-wide transition-colors"
            href="#"
          >
            Infos de Livraison
          </a>
          <a
            className="border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-primary hover:border-primary/50 whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm tracking-wide transition-colors"
            href="#"
          >
            Avis Clients
          </a>
        </nav>
      </div>
      <div className="py-6">
        <p className="text-base text-text-light/80 dark:text-text-dark/80 leading-relaxed">
          Cette robe est confectionnée avec des matériaux de haute qualité,
          alliant confort et élégance. Les motifs délicats s&apos;inspirent de
          l'artisanat traditionnel algérien, offrant une pièce unique et
          intemporelle. Tissu fluide et respirant, idéal pour les climats
          chauds. La coupe est flatteuse pour toutes les morphologies.
        </p>
      </div>
    </div>
  );
};

export default ProductTabs;
