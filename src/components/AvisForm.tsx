"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { submitAvis } from "@/app/actions/avis";
import DictationButton from "@/components/DictationButton";

const LABELS = ["", "Pas satisfait", "Peu satisfait", "Correct", "Satisfait", "Très satisfait"];

export default function AvisForm() {
  const { data: session, status } = useSession();
  const isMember = session?.user?.role === "partenaire" || session?.user?.role === "stockiste";
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Choisissez une note de 1 à 5 étoiles avant d'envoyer.");
      return;
    }
    setError("");
    setIsSaving(true);
    const res = await submitAvis({ rating, comment });
    setIsSaving(false);
    if (res.success) {
      setSubmitted(true);
      setRating(0);
      setComment("");
    } else {
      setError(res.error || "Votre avis n'a pas pu être envoyé. Vérifiez votre connexion et réessayez.");
    }
  };

  // Seuls les partenaires et stockistes donnent un avis (règle vérifiée côté serveur).
  if (status === "loading") {
    return <p className="text-sm text-ink-soft py-4 text-center">Chargement…</p>;
  }

  if (!isMember) {
    const isAdmin = session?.user?.role === "admin";
    return (
      <div className="text-center py-2 space-y-3">
        <p className="font-bold text-ink">
          {isAdmin ? "Vous êtes connecté en administrateur." : "Connectez-vous pour donner votre avis."}
        </p>
        <p className="text-sm text-ink-soft">
          {isAdmin
            ? "Les avis sont donnés par les partenaires et les stockistes. Vous les retrouvez dans l'onglet Avis de l'administration."
            : "Les avis sont réservés aux partenaires et aux stockistes inscrits."}
        </p>
        <a href={isAdmin ? "/admin" : "/login"} className="btn-primary w-full">
          {isAdmin ? "Voir les avis reçus" : "Se connecter"}
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div role="status" className="text-center py-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-palm-light text-palm flex items-center justify-center mb-3" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="font-bold text-ink">Avis envoyé. Merci !</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-3 text-xs font-semibold text-palm underline underline-offset-2 hover:text-forest">
          Donner un autre avis
        </button>
      </div>
    );
  }

  const shown = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div role="alert" className="alert-error">{error}</div>}

      <fieldset>
        <legend className="label">Votre note</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
              aria-pressed={rating === star}
            >
              <svg
                className={`w-8 h-8 transition-colors ${shown >= star ? "text-gold" : "text-line"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-ink-soft">{LABELS[shown]}</span>
        </div>
      </fieldset>

      <div>
        <label htmlFor="avis-comment" className="label">Commentaire <span className="font-normal text-ink-soft/70">(facultatif)</span></label>
        <DictationButton value={comment} onChange={setComment}>
          <textarea
            id="avis-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Écrivez ou dictez : ce qui vous plaît, ce qui manque…"
            className="input resize-none pb-14"
          />
        </DictationButton>
      </div>

      <button type="submit" disabled={isSaving} className="btn-primary w-full">
        {isSaving ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </form>
  );
}
