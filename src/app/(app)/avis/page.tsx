"use client";

import Link from "next/link";
import AvisForm from "@/components/AvisForm";
import { PageHeader } from "@/components/ui";

export default function AvisPage() {
  return (
    <div className="pb-4">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-forest mb-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        Accueil
      </Link>

      <PageHeader
        eyebrow="Votre retour"
        title="Donner votre avis"
        lead="Votre note et vos suggestions nous aident à améliorer l'application."
      />

      <div className="card p-5">
        <AvisForm />
      </div>
    </div>
  );
}
