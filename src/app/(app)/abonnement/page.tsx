"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMySubscriptionStatus, initiatePayment } from "@/app/actions/subscription";

const PLAN = { duration: "1 an", price: "2 000 FCFA" };

export default function AbonnementPage() {
  const router = useRouter();
  const { status } = useSession();
  const [subStatus, setSubStatus] = useState<{ isExpired: boolean; daysLeft: number; expiresAt: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInstructions, setManualInstructions] = useState<{ amount: number; planLabel: string; supportContact: string } | null>(null);
  const [error, setError] = useState("");
  const [showOperatorChoice, setShowOperatorChoice] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      getMySubscriptionStatus().then((res) => {
        if (res.success) {
          setSubStatus({ isExpired: res.isExpired!, daysLeft: res.daysLeft!, expiresAt: res.expiresAt! });
        }
      });
    }
  }, [status]);

  const handleSubscribeClick = () => {
    if (status !== "authenticated") {
      setShowOperatorChoice(true);
      return;
    }
    handlePay();
  };

  const handlePay = async () => {
    setError("");
    setIsProcessing(true);
    const res = await initiatePayment("12m");
    setIsProcessing(false);

    if (!res.success) {
      setError(res.error || "Une erreur est survenue.");
      return;
    }

    if (res.mode === "redirect") {
      window.location.href = res.paymentUrl;
    } else if (res.mode === "manual") {
      setManualInstructions({ amount: res.amount!, planLabel: res.planLabel!, supportContact: res.supportContact! });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <style dangerouslySetInnerHTML={{ __html: `nav { display: none !important; }` }} />
      <div className="bg-gradient-to-r from-forest to-forest-deep p-8 rounded-xl text-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-white font-heading relative z-10">Abonnement Premium</h2>
        <p className="text-white/90 mt-2 relative z-10 max-w-lg mx-auto">
          Débloquez toutes les fonctionnalités de l'application Prospections Longrich pour développer votre réseau plus rapidement.
        </p>
      </div>

      {status === "authenticated" && subStatus && (
        <div
          className={`rounded-xl p-4 text-center font-semibold text-sm border ${
            subStatus.isExpired
              ? "bg-red-50 text-red-700 border-red-200"
              : subStatus.daysLeft <= 3
              ? "bg-gold-light text-forest-deep border-gold/30"
              : "bg-palm-light text-palm border-palm/20"
          }`}
        >
          {subStatus.isExpired
            ? "Votre essai gratuit est terminé. Choisissez un forfait pour continuer."
            : `Il vous reste ${subStatus.daysLeft} jour${subStatus.daysLeft > 1 ? "s" : ""} d'essai gratuit.`}
        </div>
      )}

      {manualInstructions ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-line space-y-4 text-center">
          <div className="w-14 h-14 bg-gold-light text-gold rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-ink font-heading">Finalisez votre paiement</h3>
          <p className="text-sm text-ink-soft">
            Envoyez <strong>{manualInstructions.amount} FCFA</strong> par Mobile Money (Orange Money, MTN MoMo ou Wave) pour le forfait <strong>{manualInstructions.planLabel}</strong>, puis contactez {manualInstructions.supportContact} pour valider votre abonnement.
          </p>
          <p className="text-xs text-ink-soft/70">Votre compte sera débloqué sous 24h après validation.</p>
          <button onClick={() => setManualInstructions(null)} className="text-forest font-semibold text-sm underline">Retour</button>
        </div>
      ) : showOperatorChoice ? (
        <div className="bg-white rounded-xl p-6 border border-line shadow-sm max-w-sm mx-auto space-y-5">
          <h3 className="text-lg font-bold text-ink font-heading text-center">Choisissez votre moyen de paiement</h3>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedOperator("orange")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                selectedOperator === "orange" ? "border-forest bg-palm-light" : "border-line hover:border-forest/40"
              }`}
            >
              <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">O</span>
              <span className="font-bold text-ink">Orange Money</span>
            </button>
            <button
              onClick={() => setSelectedOperator("mtn")}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                selectedOperator === "mtn" ? "border-forest bg-palm-light" : "border-line hover:border-forest/40"
              }`}
            >
              <span className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold flex-shrink-0">M</span>
              <span className="font-bold text-ink">MTN Money</span>
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-cream-deep text-ink-soft py-3 rounded-xl font-bold hover:bg-line transition-all"
            >
              Annuler
            </button>
            <button
              onClick={() => router.push("/login")}
              disabled={!selectedOperator}
              className="flex-1 bg-forest text-white py-3 rounded-xl font-bold shadow-md hover:bg-forest-deep transition-all disabled:opacity-40"
            >
              Valider
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-semibold">{error}</div>}
          <div className="bg-white rounded-xl p-8 border-2 border-forest shadow-md max-w-sm mx-auto text-center">
            <div className="text-gray-500 font-semibold mb-2">Forfait unique</div>
            <div className="text-3xl font-bold text-forest font-heading mb-4">{PLAN.duration}</div>
            <div className="text-3xl font-bold text-ink mb-6">{PLAN.price}</div>
            <button
              onClick={handleSubscribeClick}
              disabled={isProcessing}
              className="w-full bg-forest text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-forest-deep transition-all disabled:opacity-50"
            >
              {isProcessing ? "Traitement..." : status === "authenticated" ? "S'abonner maintenant" : "Se connecter pour s'abonner"}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-900">
              ← Retour à la page de présentation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
