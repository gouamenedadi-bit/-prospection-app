"use client";

import { useSession, signOut } from "next-auth/react";
import QuickAccessGrid from "@/components/QuickAccessGrid";

export default function Home() {
  const { data: session } = useSession();
  const settingsHref = session?.user?.role === "stockiste" ? "/dashboard/stockiste" : "/dashboard/partner/settings";

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-forest to-forest-deep rounded-xl p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold mb-2 font-heading">Bienvenue Partenaire !</h2>
        <p className="text-sm opacity-90">Développez votre réseau et suivez vos performances en Côte d'Ivoire.</p>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex flex-col gap-2 mb-3">
          <h3 className="font-semibold text-ink font-heading m-0">Accès Rapide</h3>
          <div className="flex items-center justify-between">
            <a
              href={settingsHref}
              className="text-ink-soft hover:text-forest text-base font-bold flex items-center gap-1.5 transition-colors bg-cream-deep px-2 py-1.5 rounded-lg whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Paramètres
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-500 hover:text-red-600 text-base font-bold flex items-center gap-1.5 transition-colors bg-red-50 px-2 py-1.5 rounded-lg whitespace-nowrap"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Se déconnecter
            </button>
          </div>
        </div>
        <QuickAccessGrid />
      </div>

      {/* Actualités */}
      <div>
        <h3 className="font-semibold text-ink mb-3 font-heading">Dernières informations</h3>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-line">
          <p className="text-ink-soft text-sm italic">Aucune nouveauté pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
