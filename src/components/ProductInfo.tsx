"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

const ProductInfo = () => {
  const [size, setSize] = useState('m');
  const [color, setColor] = useState('white');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const product = {
    id: 'robe-traditionnelle-algerienne',
    name: 'Robe Traditionnelle Algérienne',
    price: 3500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANXiy7FX2xa0IL7WgSxIIdKQ3dr3-J2xBSzQDS3CAeUcddKwsFCa6EA9Rtk9sbMDFX4wJaR4O9E1azZmrFIuPneS6JI-GBCCETY5ytxdjC4qy5nvL_JRBByZLd4Rw95fKM9eWTWF3QUSSJWdF1tH0EvXp-Varl9r8TLvjcgOGctRr-b85GSLZav3fdK5nNn9OXfguuWGRom1RPkIFEGS463H-vLipjpmciJ8AgbHTJC6BL9NG2yRde2esLX0bqTH_FLdkxI59AGvg',
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] tracking-tight">
          {product.name}
        </h1>
        <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">{product.price.toLocaleString('fr-DZ')} DZD</p>
        <p className="mt-4 text-base text-[var(--color-text-light)]/80 dark:text-[var(--color-text-dark)]/80">
          Une élégante robe inspirée du patrimoine algérien, parfaite pour les
          occasions spéciales ou pour ajouter une touche d&apos;authenticité à votre
          garde-robe.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] tracking-wider">
            TAILLE
          </h3>
          <div className="flex flex-wrap gap-3 mt-2">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value={s}
                  checked={size === s}
                  onChange={() => setSize(s)}
                />
                <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-[var(--color-subtle-light)] dark:border-[var(--color-subtle-dark)] peer-checked:border-[var(--color-primary)] peer-checked:ring-2 peer-checked:ring-[var(--color-primary)]/50 transition-all font-semibold">
                  {s}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] tracking-wider">
            COULEUR
          </h3>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              { name: 'white', code: '#F8F9FA' },
              { name: 'blue', code: '#003366' },
              { name: 'orange', code: '#E87461' },
            ].map((c) => (
              <label key={c.name} className="cursor-pointer">
                <input
                  className="sr-only peer"
                  name="color"
                  type="radio"
                  value={c.name}
                  checked={color === c.name}
                  onChange={() => setColor(c.name)}
                />
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-[var(--color-background-light)] dark:ring-offset-[var(--color-background-dark)] peer-checked:ring-[var(--color-primary)] transition-all"
                  style={{ backgroundColor: c.code }}
                ></div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] tracking-wider">
            QUANTITÉ
          </h3>
          <div className="relative mt-2 rounded-lg w-32">
            <button
              className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-[var(--color-text-light)]/50 dark:text-[var(--color-text-dark)]/50 hover:text-[var(--color-primary)]"
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              className="w-full h-12 rounded-lg border border-[var(--color-subtle-light)] dark:border-[var(--color-subtle-dark)] bg-[var(--color-background-light)] dark:bg-[var(--color-subtle-dark)] text-center font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
            <button
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-[var(--color-text-light)]/50 dark:text-[var(--color-text-dark)]/50 hover:text-[var(--color-primary)]"
              type="button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 space-y-4">
        <button
          className="w-full bg-[var(--color-primary)] text-white rounded-lg h-14 text-base font-bold flex items-center justify-center hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          onClick={handleAddToCart}
        >
          Acheter Maintenant
        </button>
        <button
          className="w-full bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg h-14 text-base font-bold flex items-center justify-center hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Ajouter au Panier
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

