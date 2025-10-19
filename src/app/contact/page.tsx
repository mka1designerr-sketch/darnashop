"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Contactez-nous</h1>
      <p className="mt-2 text-black/70">Une question, une suggestion ? Écrivez-nous, nous répondons sous 24h.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Nom complet</label>
          <input className="mt-1 w-full rounded-lg border border-[var(--color-subtle-light)] px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-[var(--color-subtle-light)] px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Message</label>
          <textarea className="mt-1 w-full rounded-lg border border-[var(--color-subtle-light)] px-3 py-2" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button disabled={status === "sending"} className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-bold text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-60">
          {status === "sending" ? "Envoi..." : "Envoyer"}
        </button>
        {status === "sent" && <p className="text-green-700">Merci ! Votre message a été envoyé.</p>}
        {status === "error" && <p className="text-red-600">Une erreur est survenue. Réessayez.</p>}
      </form>
    </div>
  );
}
