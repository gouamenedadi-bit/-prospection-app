"use client";

import { useState } from "react";
import { submitAvis } from "@/app/actions/avis";

export default function AvisForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Merci de choisir une note.");
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
      setError(res.error || "Erreur lors de l'envoi.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center text-sm text-green-700 font-semibold">
        Merci pour votre avis !
        <button type="button" onClick={() => setSubmitted(false)} className="block mx-auto mt-2 text-xs underline text-green-800">
          Donner un autre avis
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center font-semibold">{error}</div>}

      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1"
            aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`w-8 h-8 ${(hoverRating || rating) >= star ? "text-gold" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Un commentaire pour nous aider à améliorer l'application ? (optionnel)"
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest resize-none"
      />

      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-forest text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all disabled:opacity-50"
      >
        {isSaving ? "Envoi..." : "Envoyer mon avis"}
      </button>
    </form>
  );
}
