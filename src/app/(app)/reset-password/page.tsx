"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/passwordReset";
import { AuthShell, PasswordInput } from "@/components/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const role = searchParams.get("role") === "stockiste" ? "stockiste" : "partenaire";

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
    const res = await resetPassword(token, role, password);
    setIsLoading(false);

    if (res.success) {
      setIsDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setError(res.error || "Le mot de passe n'a pas pu être changé. Refaites une demande de réinitialisation.");
    }
  };

  return (
    <AuthShell
      eyebrow="Accès au compte"
      title="Nouveau mot de passe"
      lead="Au moins 6 caractères."
      footer={<Link href="/login" className="font-semibold text-ink-soft hover:text-ink">Retour à la connexion</Link>}
    >
      {!token ? (
        <div role="alert" className="alert-error leading-relaxed">
          Ce lien n&apos;est pas valide.{" "}
          <Link href="/forgot-password" className="underline">Refaire une demande</Link>
        </div>
      ) : isDone ? (
        <div role="status" className="alert-success">
          Mot de passe changé. Redirection vers la connexion…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div role="alert" className="alert-error">{error}</div>}

          <div>
            <label htmlFor="rp-new" className="label">Nouveau mot de passe</label>
            <PasswordInput id="rp-new" value={password} onChange={setPassword} minLength={6} autoComplete="new-password" />
          </div>

          <div>
            <label htmlFor="rp-confirm" className="label">Confirmer le mot de passe</label>
            <PasswordInput id="rp-confirm" value={confirmPassword} onChange={setConfirmPassword} minLength={6} autoComplete="new-password" />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? "Enregistrement…" : "Changer le mot de passe"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
