"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#F8F9FA]">
      <div className="container mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:gap-16 lg:gap-24">
            <div>
              <h4 className="font-bold text-lg mb-4">À Propos</h4>
              <ul className="space-y-3 text-sm text-black/60">
                <li><Link href="/a-propos" className="hover:text-black transition-colors">Notre Histoire</Link></li>
                <li><Link href="/carrieres" className="hover:text-black transition-colors">Carrières</Link></li>
                <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-black/60">
                <li><Link href="/contact" className="hover:text-black transition-colors">Contactez-nous</Link></li>
                <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                <li><Link href="/livraison-retours" className="hover:text-black transition-colors">Livraison & Retours</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Social icons */}
            <a href="#" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.407 0 22.675 0z"></path></svg>
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.744 3.419A9.875 9.875 0 010 19.548a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.447 14.307-14.008 0-.213-.005-.426-.015-.637a10.035 10.035 0 002.495-2.548z"></path></svg>
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.74 0 8.333.01 7.053.062 2.695.272.273 2.69.063 7.053.01 8.333 0 8.74 0 12s.01 3.667.063 4.947c.21 4.358 2.631 6.78 6.99 6.99C8.333 23.99 8.74 24 12 24s3.667-.01 4.947-.063c4.358-.21 6.78-2.631 6.99-6.99C23.99 15.667 24 15.26 24 12s-.01-3.667-.063-4.947c-.21-4.358-2.631-6.78-6.99-6.99C15.667.01 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path></svg>
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-[#EAEAEA] pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-black/60">
          <p className="mb-4 md:mb-0">Copyright © {new Date().getFullYear()} DARNA SHOP. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/cgv" className="hover:text-black transition-colors">Conditions Générales de Vente</Link>
            <Link href="/confidentialite" className="hover:text-black transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
