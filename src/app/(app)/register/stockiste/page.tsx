"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { registerStockiste } from "@/app/actions/auth";
import { AuthShell, PasswordInput } from "@/components/ui";
import { CITIES, COMMUNES } from "@/lib/places";

export default function RegisterStockiste() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerStockiste(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <AuthShell
      nav="hide"
      eyebrow="Inscription · Stockiste"
      title="Référencer votre bureau"
      lead="Votre bureau apparaîtra sur la carte des stockistes. 14 jours d'essai gratuit."
      footer={<Link href="/register" className="font-semibold text-ink-soft hover:text-ink">Retour au choix du profil</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div role="alert" className="alert-error">{error}</div>}

        <div>
          <label htmlFor="rs-name" className="label">Nom du responsable ou du bureau</label>
          <input id="rs-name" name="name" type="text" required className="input" placeholder="Longrich Cocody Centre" />
        </div>

        <div>
          <label htmlFor="rs-phone" className="label">Téléphone</label>
          <input id="rs-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="input" placeholder="07 01 02 03 04" />
        </div>
        <div>
          <label htmlFor="rs-email" className="label">Email</label>
          <input id="rs-email" name="email" type="email" required autoComplete="email" className="input" placeholder="contact@exemple.com" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rs-city" className="label">Ville</label>
            <select id="rs-city" name="city" className="input" defaultValue="Abidjan">
              {CITIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rs-commune" className="label">Commune</label>
            <select id="rs-commune" name="commune" className="input">
              {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="rs-hood" className="label">Quartier et repère</label>
          <input id="rs-hood" name="neighborhood" type="text" required className="input" placeholder="Angré 8e Tranche, près du rond-point" />
          <p className="text-[11px] text-ink-soft mt-1.5">Aide les partenaires à trouver votre bureau.</p>
        </div>

        <div>
          <label htmlFor="rs-password" className="label">Mot de passe</label>
          <input type="hidden" name="password" value={password} />
          <PasswordInput id="rs-password" value={password} onChange={setPassword} autoComplete="new-password" />
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
          {isPending ? "Création du compte…" : "Créer mon compte stockiste"}
        </button>
      </form>
    </AuthShell>
  );
}
