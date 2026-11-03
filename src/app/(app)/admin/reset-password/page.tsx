"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetAdminCredentials } from "@/app/actions/adminAuth";
import { AuthShell, PasswordInput } from "@/components/ui";

function AdminResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    setIsLoading(true);
    const res = await resetAdminCredentials(token, email, password);
    setIsLoading(false);

    if (res.success) {
      setIsDone(true);
      setTimeout(() => router.push("/admin"), 2500);
    } else {
      setError(res.error || "L'accès n'a pas pu être mis à jour. Refaites une demande de réinitialisation.");
    }
  };

  return (
    <AuthShell
      eyebrow="Espace administrateur"
      title="Nouvel accès"
      lead="Choisissez l'email et le mot de passe de l'administrateur."
      footer={<Link href="/admin" className="font-semibold text-ink-soft hover:text-ink">Retour à la connexion admin</Link>}
    >
      {!token ? (
        <div role="alert" className="alert-error leading-relaxed">
          Ce lien n&apos;est pas valide.{" "}
          <Link href="/admin/forgot-password" className="underline">Refaire une demande</Link>
        </div>
      ) : isDone ? (
        <div role="status" className="alert-success">
          Accès administrateur mis à jour. Redirection vers la connexion…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div role="alert" className="alert-error">{error}</div>}

          <div>
            <label htmlFor="arp-email" className="label">Email administrateur</label>
            <input
              id="arp-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="arp-new" className="label">Nouveau mot de passe</label>
            <PasswordInput id="arp-new" value={password} onChange={setPassword} minLength={6} autoComplete="new-password" />
          </div>

          <div>
            <label htmlFor="arp-confirm" className="label">Confirmer le mot de passe</label>
            <PasswordInput id="arp-confirm" value={confirmPassword} onChange={setConfirmPassword} minLength={6} autoComplete="new-password" />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? "Enregistrement…" : "Mettre à jour l'accès"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense>
      <AdminResetPasswordForm />
    </Suspense>
  );
}
