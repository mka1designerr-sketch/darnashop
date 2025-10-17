import type { Metadata } from "next";
import { Plus_Jakarta_Sans, El_Messiri, Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { OrderStatsProvider } from "@/contexts/OrderStatsContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DARNA SHOP — Mode & Lifestyle en Algérie",
    template: "%s | DARNA SHOP",
  },
  description: "Boutique algérienne: vêtements, accessoires, électronique. Paiement à la livraison.",
  metadataBase: new URL("https://darnashop.example.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.variable} ${elMessiri.variable} ${tajawal.variable} antialiased bg-[var(--color-background-light)] text-[var(--color-text-light)]`}>
        <I18nProvider>
          <CategoriesProvider>
            <ProductsProvider>
              <OrderStatsProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </FavoritesProvider>
                </CartProvider>
              </OrderStatsProvider>
            </ProductsProvider>
          </CategoriesProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
