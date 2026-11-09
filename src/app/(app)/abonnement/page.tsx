"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getMySubscriptionStatus, declareWavePayment } from "@/app/actions/subscription";
import ContactList from "@/components/ContactList";
import { YEARLY_PRICES, planFor, type MemberRole } from "@/lib/pricing";

const fcfa = (n: number) => n.toLocaleString("fr-FR");

const INCLUDED = [
  "Catalogue complet : prix, PV et posologie",
  "Guide Soins & bien-être par pathologie",
  "Carte des stockistes et leurs produits",
  "Grades et plan de compensation",
];

// Couleur officielle de Wave, pour que le bouton et le QR soient reconnus d'un coup d'œil.
const WAVE_BLUE = "#1DC8FF";

function WaveMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9c2.5 0 2.5 3 5 3s2.5-3 5-3 2.5 3 5 3 2.5-3 5-3M2 15c2.5 0 2.5 3 5 3s2.5-3 5-3 2.5 3 5 3 2.5-3 5-3" />
    </svg>
  );
}

type Step = "plan" | "wave" | "done";

export default function AbonnementPage() {
  const { status, data: session } = useSession();
  const role = session?.user?.role;
  const memberRole: MemberRole | null = role === "partenaire" || role === "stockiste" ? role : null;
  const plan = memberRole ? planFor(memberRole) : null;
  const [subStatus, setSubStatus] = useState<{ isExpired: boolean; daysLeft: number; expiresAt: string } | null>(null);
  const [step, setStep] = useState<Step>("plan");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [transferId, setTransferId] = useState("");
  const [payerPhone, setPayerPhone] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      getMySubscriptionStatus().then((res) => {
        if (res.success) setSubStatus({ isExpired: res.isExpired!, daysLeft: res.daysLeft!, expiresAt: res.expiresAt! });
      });
    }
  }, [status]);

  const handleIHavePaid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSending(true);
    const res = await declareWavePayment({ transferId, payerPhone });
    setIsSending(false);
    if (!res.success) {
      setError(res.error || "Votre paiement n'a pas pu être signalé. Réessayez dans un instant.");
      return;
    }
    setStep("done");
  };

  const activeUntil = subStatus && !subStatus.isExpired ? new Date(subStatus.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="space-y-5 pb-4 lg:max-w-2xl lg:mx-auto">
      <header className="page-head">
        <p className="eyebrow">Abonnement</p>
        <h2 className="page-title">Continuer avec Prospection</h2>
        <p className="page-lead">Un forfait annuel, tout inclus, payé avec Wave.</p>
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
            ? "Votre accès est terminé. Abonnez-vous pour retrouver toute l'application."
            : `Votre accès est actif encore ${subStatus.daysLeft} jour${subStatus.daysLeft > 1 ? "s" : ""}${activeUntil ? `, jusqu'au ${activeUntil}` : ""}.`}
        </div>
      )}

      {error && step !== "wave" && <div role="alert" className="alert-error">{error}</div>}

      {/* Étape 1 : le forfait */}
      {step === "plan" && (
        <>
          <div className="card overflow-hidden rise-in">
            {plan ? (
              <div className="bg-forest-deep text-cream px-5 py-5 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">Forfait {memberRole}</p>
                  <p className="font-heading text-2xl mt-1">{plan.label}</p>
                </div>
                <p className="text-right">
                  <span className="font-mono text-3xl font-semibold tabular-nums">{fcfa(plan.amount)}</span>
                  <span className="block text-xs text-cream/70">FCFA / an</span>
                </p>
              </div>
            ) : (
              <dl className="bg-forest-deep text-cream px-5 py-3 divide-y divide-cream/15">
                {(["partenaire", "stockiste"] as const).map((r) => (
                  <div key={r} className="py-2.5 flex items-end justify-between gap-3">
                    <dt>
                      <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-gold">Forfait {r}</span>
                      <span className="block font-heading text-xl mt-0.5">1 an</span>
                    </dt>
                    <dd className="text-right">
                      <span className="font-mono text-2xl font-semibold tabular-nums">{fcfa(YEARLY_PRICES[r])}</span>
                      <span className="block text-xs text-cream/70">FCFA / an</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <ul className="px-5 py-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-palm" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="px-5 pb-5">
              {plan ? (
                <button
                  onClick={() => setStep("wave")}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-[15px] font-bold text-white transition-[filter,transform] hover:brightness-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  style={{ backgroundColor: WAVE_BLUE }}
                >
                  <WaveMark />
                  Payer avec Wave
                </button>
              ) : status === "unauthenticated" ? (
                <Link href="/login" className="btn-primary w-full">Se connecter pour payer avec Wave</Link>
              ) : null}
              <p className="text-[13px] text-ink-soft text-center mt-2">Paiement uniquement par Wave.</p>
            </div>
          </div>

          <section className="card p-5 space-y-3 rise-in" style={{ ["--i" as string]: 2 } as React.CSSProperties} aria-labelledby="aide-titre">
            <div>
              <h3 id="aide-titre" className="font-heading text-lg text-ink">Besoin d&apos;aide pour payer ?</h3>
              <p className="text-sm text-ink-soft mt-0.5">Le support Prospections Longrich vous répond par appel ou sur WhatsApp.</p>
            </div>
            <ContactList message="Bonjour, j'ai une question sur l'abonnement Prospections Longrich." />
          </section>
        </>
      )}

      {/* Étape 2 : QR code Wave */}
      {step === "wave" && plan && (
        <div className="space-y-4">
          <section
            className="rounded-[28px] px-6 pt-6 pb-5 text-center shadow-[0_24px_50px_-24px_rgb(29_200_255/0.7)] pop-in"
            style={{ backgroundColor: WAVE_BLUE }}
            aria-labelledby="wave-titre"
          >
            <h3 id="wave-titre" className="text-white text-xl font-extrabold flex items-center justify-center gap-2">
              <WaveMark className="w-6 h-6" />
              Scannez avec Wave
            </h3>
            <div className="mx-auto mt-4 w-full max-w-[260px] rounded-3xl bg-white p-3 shadow-lg">
              <img src="/wave-qr.png" alt="QR code de paiement Wave de Prospections Longrich" className="w-full h-auto [image-rendering:pixelated]" />
            </div>
            <p className="inline-block mt-4 rounded-2xl bg-white/95 px-5 py-2.5 text-[15px] text-ink">
              Montant à payer : <strong className="tabular-nums">{fcfa(plan.amount)} FCFA</strong>
            </p>
          </section>

          <div className="card p-5 space-y-4 rise-in" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
            <ol className="space-y-3 text-sm text-ink">
              {[
                <>Ouvrez l&apos;application <strong>Wave</strong> et touchez <strong>Scanner</strong>.</>,
                <>Scannez le QR code ci-dessus et payez <strong className="tabular-nums">{fcfa(plan.amount)} FCFA</strong>.</>,
                <>Revenez ici, saisissez l&apos;<strong>ID de transfert</strong> et le <strong>numéro Wave</strong> utilisé, puis touchez <strong>« J&apos;ai payé »</strong>.</>,
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ol>

            <p className="text-xs text-ink-soft bg-cream rounded-xl px-3 py-2.5 leading-relaxed">
              Vous êtes sur le téléphone qui a Wave ? Téléchargez le QR code, puis scannez-le depuis un autre téléphone,
              ou appelez le support ci-dessous.
              {" "}
              <a href="/wave-qr.png" download="QR-Wave-Prospections-Longrich.png" className="font-bold text-palm underline underline-offset-2">Télécharger le QR code</a>
            </p>

            <form onSubmit={handleIHavePaid} className="space-y-4 border-t border-line pt-4">
              <div>
                <h4 className="font-bold text-ink">Après le paiement</h4>
                <p className="text-sm text-ink-soft mt-0.5">Ces deux informations nous servent à retrouver votre paiement dans Wave.</p>
              </div>
              <div>
                <label htmlFor="wave-transfer-id" className="label">ID de transfert Wave</label>
                <input
                  id="wave-transfer-id"
                  type="text"
                  required
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  value={transferId}
                  onChange={(e) => setTransferId(e.target.value)}
                  placeholder="Ex. T_ABCD1234EFGH"
                  className="input font-mono uppercase tracking-wide"
                />
                <p className="text-xs text-ink-soft mt-1.5">Dans Wave, ouvrez la transaction : l&apos;ID est en bas du reçu.</p>
              </div>
              <div>
                <label htmlFor="wave-payer-phone" className="label">Numéro Wave utilisé pour payer</label>
                <input
                  id="wave-payer-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="07 01 02 03 04"
                  className="input tabular-nums"
                />
              </div>
              {error && <div role="alert" className="alert-error">{error}</div>}
              <button type="submit" disabled={isSending} className="btn-primary w-full text-[15px] py-3.5">
                {isSending ? "Envoi…" : "J'ai payé"}
              </button>
            </form>
            <button onClick={() => setStep("plan")} className="btn-ghost w-full">Retour au forfait</button>
          </div>
        </div>
      )}

      {/* Étape 3 : paiement signalé */}
      {step === "done" && (
        <div className="card p-6 space-y-4 text-center rise-in">
          <div className="mx-auto w-14 h-14 rounded-full bg-palm-light text-palm flex items-center justify-center pop-in" aria-hidden="true">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h3 className="font-heading text-xl text-ink">Paiement signalé, merci !</h3>
            <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
              Nous vérifions la réception sur Wave et activons votre abonnement, en général sous 24 h.
              Pour aller plus vite, envoyez la capture de votre paiement Wave sur WhatsApp :
            </p>
          </div>
          <div className="text-left">
            <ContactList message={`Bonjour, je viens de payer mon abonnement Prospections Longrich (1 an, ${fcfa(plan?.amount ?? 0)} FCFA) avec Wave. Voici la capture de mon paiement :`} />
          </div>
          <Link href="/dashboard" className="btn-secondary w-full">Retour à l&apos;accueil</Link>
        </div>
      )}
    </div>
  );
}
