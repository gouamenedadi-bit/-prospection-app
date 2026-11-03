"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/passwordReset";
import { AuthShell, Segmented } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [activeTab, setActiveTab] = useState<"partenaire" | "stockiste">("partenaire");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPasswordReset(email, activeTab);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <AuthShell
      eyebrow="Accès au compte"
      title="Mot de passe oublié"
      lead="Indiquez votre email : nous vous envoyons un lien pour en choisir un nouveau."
      footer={<Link href="/login" className="font-semibold text-ink-soft hover:text-ink">Retour à la connexion</Link>}
    >
      {isSent ? (
        <div role="status" className="alert-success leading-relaxed">
          Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé. Pensez à vérifier vos spams.
        </div>
      ) : (
        <>
          <div className="mb-5">
            <Segmented
              label="Type de compte"
              value={activeTab}
              onChange={setActiveTab}
              options={[
                { value: "partenaire", label: "Partenaire" },
                { value: "stockiste", label: "Stockiste" },
              ]}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fp-email" className="label">Email du compte</label>
              <input
                id="fp-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="votre@email.com"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? "Envoi…" : "Envoyer le lien"}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
