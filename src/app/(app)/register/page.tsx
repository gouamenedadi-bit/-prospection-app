"use client";

import React from "react";
import Link from "next/link";

const PROFILES = [
  {
    href: "/register/partner",
    title: "Partenaire",
    text: "Suivez vos grades, trouvez les stockistes proches et conseillez vos clients avec le guide des soins.",
    cta: "Créer un compte partenaire",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  },
  {
    href: "/register/stockiste",
    title: "Stockiste",
    text: "Référencez votre bureau sur la carte, gérez votre stock et servez les partenaires de votre zone.",
    cta: "Créer un compte stockiste",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  },
];

export default function RegisterIndex() {
  return (
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{__html: `nav { display: none !important; }`}} />
      <header className="page-head">
        <p className="eyebrow">Inscription</p>
        <h2 className="page-title">Quel est votre profil ?</h2>
        <p className="page-lead">Rejoignez le réseau Longrich Côte d&apos;Ivoire. 14 jours d&apos;essai gratuit, sans engagement.</p>
      </header>

      <div className="space-y-3">
        {PROFILES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="card group flex gap-4 p-5 hover:border-palm/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="w-12 h-12 shrink-0 bg-palm-light rounded-xl flex items-center justify-center text-palm group-hover:bg-palm group-hover:text-cream transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">{p.icon}</svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-xl text-ink">{p.title}</h3>
              <p className="text-sm text-ink-soft mt-1 leading-relaxed">{p.text}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-palm mt-3 group-hover:text-forest">
                {p.cta} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-ink-soft pt-2">
        Déjà inscrit ? <Link href="/login" className="font-bold text-palm hover:text-forest underline-offset-2 hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}
