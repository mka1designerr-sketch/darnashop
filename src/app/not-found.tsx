"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Page introuvable</h1>
      <p className="mt-4 text-gray-600">Désolé, la page que vous recherchez n’existe pas.</p>
      <div className="mt-8">
        <Link href="/" className="inline-flex items-center rounded-full bg-black px-6 py-3 text-white hover:bg-black/90">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}