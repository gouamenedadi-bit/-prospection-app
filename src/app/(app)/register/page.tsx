"use client";

import React from "react";
import Link from "next/link";

export default function RegisterIndex() {
  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{__html: `nav { display: none !important; }`}} />
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-white font-heading">Inscription</h2>
        <p className="text-sm text-white/90 mt-2">Rejoignez le réseau Longrich Côte d'Ivoire. Choisissez votre profil.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <Link href="/register/stockiste" className="bg-white p-6 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-forest mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-ink font-heading">Devenir Stockiste</h3>
          <p className="text-sm text-ink-soft mt-2 mb-4">Ouvrez votre bureau, gérez vos produits et servez les partenaires de votre zone.</p>
          <span className="text-forest font-bold text-sm bg-forest/10 px-4 py-2 rounded-full">S'inscrire comme Stockiste</span>
        </Link>

        <Link href="/register/partner" className="bg-white p-6 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-ink font-heading">Devenir Partenaire</h3>
          <p className="text-sm text-ink-soft mt-2 mb-4">Gérez votre réseau, suivez vos grades et développez vos revenus Longrich.</p>
          <span className="text-gold font-bold text-sm bg-gold/10 px-4 py-2 rounded-full">S'inscrire comme Partenaire</span>
        </Link>
      </div>
    </div>
  );
}
