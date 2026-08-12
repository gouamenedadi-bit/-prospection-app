"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getMySubscriptionStatus, initiatePayment } from "@/app/actions/subscription";
import { PlanId } from "@/lib/subscription";

const PLAN_OPTIONS: { id: PlanId; duration: string; price: string; popular?: boolean }[] = [
  { id: "1m", duration: "1 mois", price: "500 FCFA" },
  { id: "2m", duration: "2 mois", price: "1 000 FCFA" },
  { id: "3m", duration: "3 mois", price: "1 500 FCFA" },
  { id: "6m", duration: "6 mois", price: "3 000 FCFA", popular: true },
  { id: "12m", duration: "1 an", price: "5 000 FCFA" },
];

export default function AbonnementPage() {
  const router = useRouter();
  const { status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [subStatus, setSubStatus] = useState<{ isExpired: boolean; daysLeft: number; expiresAt: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInstructions, setManualInstructions] = useState<{ amount: number; planLabel: string; supportContact: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      getMySubscriptionStatus().then((res) => {
        if (res.success) {
          setSubStatus({ isExpired: res.isExpired!, daysLeft: res.daysLeft!, expiresAt: res.expiresAt! });
        }
      });
    }
  }, [status]);

  const handlePay = async () => {
    if (!selectedPlan) return;

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setError("");
    setIsProcessing(true);
    const res = await initiatePayment(selectedPlan);
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
      ) : (
        <div className="pt-2">
          <h3 className="text-xl font-bold text-ink font-heading text-center mb-6">Choisissez votre forfait</h3>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLAN_OPTIONS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                  selectedPlan === plan.id ? "border-forest shadow-md transform scale-105" : "border-line shadow-sm hover:border-forest/50 hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold text-forest-deep text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Le plus populaire
                  </div>
                )}
                <div className="text-center">
                  <div className="text-gray-500 font-semibold mb-2">Forfait</div>
                  <div className="text-3xl font-bold text-forest font-heading mb-4">{plan.duration}</div>
                  <div className="text-2xl font-bold text-ink">{plan.price}</div>
                </div>
                {selectedPlan === plan.id && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPlan && !manualInstructions && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-line shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">Forfait sélectionné</p>
              <p className="font-bold text-forest text-lg">
                {PLAN_OPTIONS.find((p) => p.id === selectedPlan)?.duration} - {PLAN_OPTIONS.find((p) => p.id === selectedPlan)?.price}
              </p>
            </div>
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-forest text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-forest-deep transition-all disabled:opacity-50"
            >
              {isProcessing ? "Traitement..." : status === "authenticated" ? "Procéder au paiement" : "Se connecter pour s'abonner"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
