"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestAdminPasswordReset } from "@/app/actions/adminAuth";
import { AuthShell } from "@/components/ui";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestAdminPasswordReset(email);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <AuthShell
      eyebrow="Espace administrateur"
      title="Accès oublié"
      lead="Nous envoyons un lien à l'email administrateur pour redéfinir l'accès."
      footer={<Link href="/admin" className="font-semibold text-ink-soft hover:text-ink">Retour à la connexion admin</Link>}
    >
      {isSent ? (
        <div role="status" className="alert-success leading-relaxed">
          Si cet email correspond à l&apos;accès administrateur, un lien de réinitialisation vient d&apos;être envoyé.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="afp-email" className="label">Email administrateur</label>
            <input
              id="afp-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
