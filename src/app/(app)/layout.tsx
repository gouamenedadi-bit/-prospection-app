"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getMySubscriptionStatus } from "@/app/actions/subscription";
import BottomNav from "@/components/BottomNav";

const EXEMPT_PATHS = ["/login", "/register", "/register/partner", "/register/stockiste", "/abonnement", "/admin"];

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

  return (
    <div className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative overflow-hidden mx-auto">
      {/* Header */}
      <header className="bg-forest text-white p-4 shadow-md sticky top-0 z-50 flex justify-center items-center">
        <h1 className="text-xl font-bold font-heading text-center">Prospection Longrich</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-cream">
        {isBlocked ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-5 px-2">
            <div className="w-16 h-16 bg-gold-light text-gold rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink font-heading">Votre essai gratuit est terminé</h2>
              <p className="text-sm text-ink-soft mt-2 max-w-xs">
                Vos 14 jours d'essai sont écoulés. Abonnez-vous pour continuer à utiliser Prospections Longrich.
              </p>
            </div>
            <button
              onClick={() => router.push("/abonnement")}
              className="w-full bg-forest text-white font-bold py-3 rounded-xl shadow-md hover:bg-forest-deep transition-all"
            >
              Voir les forfaits
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs font-bold text-red-500 hover:text-red-600"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            {!isExempt && subStatus && !subStatus.isExpired && subStatus.daysLeft <= 3 && !bannerDismissed && (
              <div className="mb-4 p-3 bg-gold-light border border-gold/30 rounded-xl flex items-center justify-between gap-3 text-sm">
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
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
