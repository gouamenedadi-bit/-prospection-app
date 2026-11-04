"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getMySubscriptionStatus } from "@/app/actions/subscription";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";

const EXEMPT_PATHS = ["/login", "/register", "/register/partner", "/register/stockiste", "/abonnement", "/admin", "/forgot-password", "/reset-password"];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const [subStatus, setSubStatus] = useState<{ isExpired: boolean; daysLeft: number } | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isExempt = EXEMPT_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (status !== "authenticated") return;
    getMySubscriptionStatus().then((res) => {
      if (res.success) {
        setSubStatus({ isExpired: res.isExpired!, daysLeft: res.daysLeft! });
      }
    });
  }, [status, pathname]);

  const isBlocked = !isExempt && subStatus?.isExpired;
  // Sur ordinateur, une personne connectée a une colonne de navigation à gauche.
  // Déconnecté (connexion, inscription…), on garde la colonne centrée façon téléphone.
  const desk = status === "authenticated";

  return (
    <div data-desk={desk} className={`w-full ${desk ? "lg:flex lg:min-h-screen lg:bg-[linear-gradient(to_right,var(--color-forest)_248px,transparent_248px)]" : ""}`}>
    {desk && <SideNav />}
    <div className={`w-full max-w-md bg-cream min-h-screen sm:shadow-[0_0_0_1px_rgb(220_232_225),0_20px_60px_-20px_rgb(7_60_40/0.25)] flex flex-col relative overflow-x-clip mx-auto ${desk ? "lg:max-w-none lg:mx-0 lg:flex-1 lg:min-w-0 lg:shadow-none" : ""}`}>
      {/* Header */}
      <header className={`bg-forest text-cream px-4 h-14 sticky top-0 z-50 flex items-center justify-between ${desk ? "lg:hidden" : ""}`}>
        <a href="/dashboard" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          <span className="w-8 h-8 rounded-lg bg-gold text-forest-deep flex items-center justify-center font-heading text-lg leading-none" aria-hidden="true">L</span>
          <span className="leading-tight">
            <span className="block font-heading text-[17px]">Prospection</span>
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Longrich · Côte d&apos;Ivoire</span>
          </span>
        </a>
      </header>

      {/* Main Content */}
      <main className={`flex-1 px-4 pt-5 pb-6 bg-cream ${desk ? "lg:px-12 lg:pt-11 lg:pb-16" : ""}`}>
        <div className={desk ? "lg:max-w-[960px] lg:mx-auto" : ""}>
        {isBlocked ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-5 px-2">
            <div className="w-16 h-16 bg-gold-light text-gold-deep rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <div>
              <h2 className="font-heading text-2xl text-ink">Votre essai gratuit est terminé</h2>
              <p className="text-sm text-ink-soft mt-2 max-w-xs">
                Vos 14 jours d'essai sont écoulés. Abonnez-vous pour continuer à utiliser Prospections Longrich.
              </p>
            </div>
            <button
              onClick={() => router.push("/abonnement")}
              className="btn-primary w-full"
            >
              Voir les forfaits
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="btn-ghost text-xs"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            {!isExempt && subStatus && !subStatus.isExpired && subStatus.daysLeft <= 3 && !bannerDismissed && (
              <div className="mb-5 p-3 pl-4 bg-gold-light border border-gold/30 rounded-xl flex items-center justify-between gap-3 text-sm">
                <span className="text-forest-deep font-semibold">
                  {subStatus.daysLeft <= 0
                    ? "Votre essai se termine aujourd'hui."
                    : `Il vous reste ${subStatus.daysLeft} jour${subStatus.daysLeft > 1 ? "s" : ""} d'essai.`}{" "}
                  <a href="/abonnement" className="underline">S'abonner</a>
                </span>
                <button onClick={() => setBannerDismissed(true)} className="text-forest-deep/60 hover:text-forest-deep flex-shrink-0" aria-label="Fermer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
            {children}
          </>
        )}
        </div>
      </main>

      {/* Barre du bas : téléphone et tablette uniquement quand on a la colonne latérale */}
      <BottomNav className={desk ? "lg:hidden" : ""} />
    </div>
    </div>
  );
}
