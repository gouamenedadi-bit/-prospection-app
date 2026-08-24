"use client";

import Link from "next/link";
import AvisForm from "@/components/AvisForm";

export default function AvisPage() {
  return (
    <div className="space-y-4 pb-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-deep">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Retour à l'accueil
      </Link>

      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-white font-heading">Votre avis</h2>
        <p className="text-sm text-white/90 mt-2">Aidez-nous à améliorer Prospections Longrich en partageant votre expérience.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <AvisForm />
      </div>
    </div>
  );
}
