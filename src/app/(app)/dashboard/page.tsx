"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import QuickAccessGrid from "@/components/QuickAccessGrid";
import { getAnnonces } from "@/app/actions/annonces";
import { annonceCategory, formatEventDate, type Annonce } from "@/lib/annonces";

export default function Home() {
  const { data: session } = useSession();
  const isStockiste = session?.user?.role === "stockiste";
  const isAdmin = session?.user?.role === "admin";
  const settingsHref = isStockiste ? "/dashboard/stockiste" : "/dashboard/partner/settings";
  const firstName = session?.user?.name?.split(" ")[0];
  const [annonce, setAnnonce] = useState<Annonce | null>(null);

  useEffect(() => {
    getAnnonces(1).then((res) => {
      if (res.success && res.data) setAnnonce(res.data[0] ?? null);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Bienvenue */}
      <section className="card-dark p-5 relative overflow-hidden rise-in">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-[18px] border-gold/15" aria-hidden="true" />
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold relative">
          {isAdmin ? "Espace administrateur" : isStockiste ? "Espace stockiste" : "Espace partenaire"}
        </p>
        <h2 className="font-heading text-[26px] leading-tight mt-1.5 relative">
          {firstName ? `Bonjour ${firstName}` : "Bienvenue"}
        </h2>
        <p className="text-sm text-cream/75 mt-1 relative max-w-[30ch]">
          {isAdmin
            ? "Gérez le catalogue, les membres, les paiements et les avis."
            : isStockiste
            ? "Gérez votre stock et restez visible auprès des partenaires de votre zone."
            : "Développez votre réseau et suivez vos performances en Côte d'Ivoire."}
        </p>
      </section>

      {/* Dernière annonce : masquée tant que rien n'est publié */}
      {annonce && (
        <section aria-label="Dernière annonce" className="card overflow-hidden rise-in" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
          <a href="/annonces" className="flex gap-3.5 p-4 hover:bg-cream/60 transition-colors">
            {annonce.image && <img src={annonce.image} alt="" className="w-[72px] h-[72px] shrink-0 rounded-xl object-cover bg-cream-deep" />}
            <div className="min-w-0 flex-1">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-bold ${annonceCategory(annonce.category).chip}`}>{annonceCategory(annonce.category).label}</span>
              <p className="font-bold text-[17px] text-ink mt-1 break-words">{annonce.title}</p>
              {annonce.eventDate && <p className="text-[15px] text-ink-soft mt-0.5 first-letter:uppercase">{formatEventDate(annonce.eventDate)}</p>}
            </div>
          </a>
          <a href="/annonces" className="flex items-center justify-between gap-3 px-4 py-3 border-t border-line text-[15px] font-bold text-palm hover:bg-palm-light/50 transition-colors">
            Voir toutes les annonces
            <span aria-hidden="true">›</span>
          </a>
        </section>
      )}

      {/* Pénurie : où trouver un produit */}
      <a href="/ou-trouver" className="card flex items-center gap-3.5 p-4 hover:bg-cream/60 transition-colors rise-in" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
        <span className="w-11 h-11 shrink-0 rounded-xl bg-gold-light text-gold-deep flex items-center justify-center" aria-hidden="true">
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-5.2-5.2M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[17px] text-ink">Un produit manque ?</span>
          <span className="block text-[15px] text-ink-soft">Voyez quel stockiste en a le plus.</span>
        </span>
        <span className="text-ink-soft/50" aria-hidden="true">›</span>
      </a>

      {/* Accès rapides */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Accès rapides</h3>
        </div>
        <QuickAccessGrid />
      </section>

      {/* Compte */}
      <section className="card divide-y divide-line/70 rise-in" style={{ ["--i" as string]: 7 } as React.CSSProperties}>
        <a href={settingsHref} className="flex items-center gap-3 px-4 py-3.5 hover:bg-cream/60 transition-colors rounded-t-2xl">
          <span className="w-9 h-9 rounded-xl bg-cream-deep text-ink-soft flex items-center justify-center" aria-hidden="true">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </span>
          <span className="flex-1 text-sm font-semibold text-ink">Paramètres du compte</span>
          <span className="text-ink-soft/50" aria-hidden="true">›</span>
        </a>
        <a href={isAdmin ? "/admin" : "/avis"} className="flex items-center gap-3 px-4 py-3.5 hover:bg-cream/60 transition-colors">
          <span className="w-9 h-9 rounded-xl bg-gold-light text-gold-deep flex items-center justify-center" aria-hidden="true">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
          </span>
          <span className="flex-1 text-sm font-semibold text-ink">{isAdmin ? "Voir les avis reçus" : "Donner votre avis"}</span>
          <span className="text-ink-soft/50" aria-hidden="true">›</span>
        </a>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-clay-light/50 transition-colors rounded-b-2xl text-left"
        >
          <span className="w-9 h-9 rounded-xl bg-clay-light text-clay flex items-center justify-center" aria-hidden="true">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </span>
          <span className="flex-1 text-sm font-semibold text-clay">Se déconnecter</span>
        </button>
      </section>
    </div>
  );
}
