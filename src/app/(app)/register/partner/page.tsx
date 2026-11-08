"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerPartenaire } from "@/app/actions/auth";
import { AuthShell, PasswordInput } from "@/components/ui";
import { CITIES, COMMUNES, communeForCity } from "@/lib/places";

export default function RegisterPartner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [commune, setCommune] = useState(COMMUNES[0]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerPartenaire(formData);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }
      // Compte créé : on connecte directement la personne.
      const login = await signIn("credentials", {
        redirect: false,
        email: result.email,
        password: String(formData.get("password") ?? ""),
        role: "partenaire",
      });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <AuthShell
      nav="hide"
      eyebrow="Inscription · Partenaire"
      title="Créer votre compte"
      lead="14 jours d'essai gratuit. Vous serez connecté dès l'inscription."
      footer={<Link href="/register" className="font-semibold text-ink-soft hover:text-ink">Retour au choix du profil</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div role="alert" className="alert-error">{error}</div>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rp-last" className="label">Nom</label>
            <input id="rp-last" name="lastName" type="text" required autoComplete="family-name" className="input" placeholder="Kouassi" />
          </div>
          <div>
            <label htmlFor="rp-first" className="label">Prénoms</label>
            <input id="rp-first" name="firstName" type="text" required autoComplete="given-name" className="input" placeholder="Aya Marie" />
          </div>
        </div>

        <div>
          <label htmlFor="rp-phone" className="label">Téléphone</label>
          <input id="rp-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="input" placeholder="07 01 02 03 04" />
        </div>
        <div>
          <label htmlFor="rp-email" className="label">Email</label>
          <input id="rp-email" name="email" type="email" required autoComplete="email" className="input" placeholder="votre@email.com" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rp-city" className="label">Ville</label>
            <select id="rp-city" name="city" className="input" defaultValue="Abidjan" onChange={(e) => setCommune(communeForCity(e.target.value, commune))}>
              {CITIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rp-commune" className="label">Commune</label>
            <select id="rp-commune" name="commune" className="input" value={commune} onChange={(e) => setCommune(e.target.value)}>
              {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="rp-sponsor" className="label">Code parrain <span className="font-normal text-ink-soft/70">(facultatif)</span></label>
          <input id="rp-sponsor" name="sponsorCode" type="text" className="input font-mono" placeholder="CI0123456" />
        </div>

        <div>
          <label htmlFor="rp-password" className="label">Mot de passe</label>
          <input type="hidden" name="password" value={password} />
          <PasswordInput id="rp-password" value={password} onChange={setPassword} autoComplete="new-password" />
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
          {isPending ? "Création du compte…" : "Créer mon compte partenaire"}
        </button>
      </form>
    </AuthShell>
  );
}
