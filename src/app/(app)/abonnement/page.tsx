"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMySubscriptionStatus, initiatePayment } from "@/app/actions/subscription";
import ContactList from "@/components/ContactList";

const PLAN = { duration: "1 an", price: "2 000", currency: "FCFA" };

const INCLUDED = [
  "Catalogue complet : prix, PV et posologie",
  "Guide Soins & bien-être par pathologie",
  "Carte des stockistes et leurs produits",
  "Grades et plan de compensation",
];

// Les pastilles gardent la couleur de chaque opérateur pour être reconnues d'un coup d'œil.
const OPERATORS = [
  { id: "orange" as const, label: "Orange Money", badge: <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">O</span> },
  { id: "mtn" as const, label: "MTN Mobile Money", badge: <span className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold shrink-0">M</span> },
  { id: "wave" as const, label: "Wave", badge: <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">W</span> },
  {
    id: "visa" as const,
    label: "Carte Visa",
    badge: (
      <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10h20"></path></svg>
      </span>
    ),
  },
];

export default function AbonnementPage() {
  const router = useRouter();
  const { status } = useSession();
  const [subStatus, setSubStatus] = useState<{ isExpired: boolean; daysLeft: number; expiresAt: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInstructions, setManualInstructions] = useState<{ amount: number; planLabel: string; supportContact: string } | null>(null);
  const [error, setError] = useState("");
  const [showOperatorChoice, setShowOperatorChoice] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | "wave" | "visa" | null>(null);

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
      setError(res.error || "Le paiement n'a pas pu démarrer. Réessayez dans un instant.");
      return;
    }

    if (res.mode === "redirect") {
      window.location.href = res.paymentUrl;
    } else if (res.mode === "manual") {
      setManualInstructions({ amount: res.amount!, planLabel: res.planLabel!, supportContact: res.supportContact! });
    }
  };

  return (
    <div className="space-y-5 pb-4 lg:max-w-2xl">
      <style dangerouslySetInnerHTML={{ __html: `nav[data-bottom-nav], aside { display: none !important; }` }} />

      <header className="page-head">
        <p className="eyebrow">Abonnement</p>
        <h2 className="page-title">Continuer avec Prospection</h2>
        <p className="page-lead">Un seul forfait, tout inclus, pour développer votre réseau Longrich.</p>
      </header>

      {status === "authenticated" && subStatus && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-semibold border ${
            subStatus.isExpired
              ? "bg-clay-light text-clay border-clay/20"
              : subStatus.daysLeft <= 3
              ? "bg-gold-light text-gold-deep border-gold/30"
              : "bg-palm-light text-palm border-palm/20"
          }`}
        >
          {subStatus.isExpired
            ? "Votre essai gratuit est terminé. Abonnez-vous pour retrouver l'accès."
            : `Il vous reste ${subStatus.daysLeft} jour${subStatus.daysLeft > 1 ? "s" : ""} d'essai gratuit.`}
        </div>
      )}

      {manualInstructions ? (
        <div className="card p-6 space-y-4 rise-in">
          <div className="w-12 h-12 bg-gold-light text-gold-deep rounded-xl flex items-center justify-center" aria-hidden="true">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h3 className="font-heading text-xl text-ink">Finalisez votre paiement</h3>
            <p className="text-sm text-ink-soft mt-1">Forfait {manualInstructions.planLabel}</p>
          </div>
          <ol className="space-y-3 text-sm text-ink">
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-forest text-cream text-xs font-bold flex items-center justify-center">1</span>
              <span>Envoyez <strong className="font-mono">{manualInstructions.amount.toLocaleString("fr-FR")} FCFA</strong> par Orange Money, MTN MoMo ou Wave.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-forest text-cream text-xs font-bold flex items-center justify-center">2</span>
              <div className="flex-1 min-w-0 space-y-2.5">
                <span className="block">Envoyez la référence du transfert à l&apos;un de ces numéros, par appel ou WhatsApp :</span>
                <ContactList message="Bonjour, je viens de payer mon abonnement Prospections Longrich (1 an, 2 000 FCFA). Référence du transfert : " />
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-forest text-cream text-xs font-bold flex items-center justify-center">3</span>
              <span>Votre compte est débloqué sous 24 h après validation.</span>
            </li>
          </ol>
          <button onClick={() => setManualInstructions(null)} className="btn-secondary w-full">Retour au forfait</button>
        </div>
      ) : showOperatorChoice ? (
        <div className="card p-5 space-y-4 rise-in" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
          <h3 className="section-title">Choisissez votre moyen de paiement</h3>

          <div className="space-y-2" role="radiogroup" aria-label="Moyen de paiement">
            {OPERATORS.map((op) => {
              const selected = selectedOperator === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedOperator(op.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    selected ? "border-palm bg-palm-light/60" : "border-line bg-white hover:border-palm/40"
                  }`}
                >
                  {op.badge}
                  <span className="flex-1 text-left font-semibold text-sm text-ink">{op.label}</span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-palm" : "border-line"}`} aria-hidden="true">
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-palm" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={() => router.push("/")} className="btn-secondary flex-1">Annuler</button>
            <button onClick={() => router.push("/login")} disabled={!selectedOperator} className="btn-primary flex-1">
              Continuer
            </button>
          </div>
          <p className="text-[11px] text-ink-soft text-center">Vous serez invité à vous connecter pour finaliser le paiement.</p>
        </div>
      ) : (
        <>
          {error && <div role="alert" className="alert-error">{error}</div>}

          <div className="card overflow-hidden rise-in">
            <div className="bg-forest-deep text-cream px-5 py-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Forfait unique</p>
                <p className="font-heading text-2xl mt-1">{PLAN.duration}</p>
              </div>
              <p className="text-right">
                <span className="font-mono text-3xl font-semibold tabular-nums">{PLAN.price}</span>
                <span className="block text-xs text-cream/70">{PLAN.currency} / an</span>
              </p>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-palm" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="px-5 pb-5">
              <button onClick={handleSubscribeClick} disabled={isProcessing} className="btn-primary w-full">
                {isProcessing ? "Préparation du paiement…" : status === "authenticated" ? "S'abonner pour 1 an" : "Choisir un moyen de paiement"}
              </button>
            </div>
          </div>

          <section className="card p-5 space-y-3 rise-in" style={{ ["--i" as string]: 2 } as React.CSSProperties} aria-labelledby="aide-titre">
            <div>
              <h3 id="aide-titre" className="font-heading text-lg text-ink">Besoin d&apos;aide pour payer ?</h3>
              <p className="text-sm text-ink-soft mt-0.5">Le support Prospections Longrich vous répond par appel ou sur WhatsApp.</p>
            </div>
            <ContactList message="Bonjour, j'ai une question sur l'abonnement Prospections Longrich." />
          </section>

          <p className="text-center">
            <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-ink">Retour à la présentation</Link>
          </p>
        </>
      )}
    </div>
  );
}
