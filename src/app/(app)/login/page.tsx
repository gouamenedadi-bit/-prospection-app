"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthShell, PasswordInput, Segmented } from "@/components/ui";

export default function LoginIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"partenaire" | "stockiste">("partenaire");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: activeTab,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect. Vérifiez aussi que vous êtes sur le bon type de compte.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthShell
      eyebrow="Espace membre"
      title="Connexion"
      lead="Retrouvez vos produits, vos stockistes et votre suivi."
      footer={
        <>
          <p>
            Pas encore de compte ?{" "}
            {activeTab === "partenaire" ? (
              <Link href="/register/partner" className="font-bold text-palm hover:text-forest underline-offset-2 hover:underline">Créer un compte partenaire</Link>
            ) : (
              <Link href="/register/stockiste" className="font-bold text-palm hover:text-forest underline-offset-2 hover:underline">Créer un compte stockiste</Link>
            )}
          </p>
          <p>
            <Link href="/" className="font-semibold text-ink-soft hover:text-ink">Retour à l&apos;accueil</Link>
          </p>
        </>
      }
    >
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
        {error && <div role="alert" className="alert-error">{error}</div>}

        <div>
          <label htmlFor="login-email" className="label">Email</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-ink-soft">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-palm hover:text-forest underline-offset-2 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput id="login-password" value={password} onChange={setPassword} />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
          {isLoading ? "Connexion…" : `Se connecter comme ${activeTab === "partenaire" ? "partenaire" : "stockiste"}`}
        </button>
      </form>
    </AuthShell>
  );
}
