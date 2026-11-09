"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import { getAnnonces } from "@/app/actions/annonces";
import { ANNONCE_CATEGORIES, annonceCategory, formatEventDate, type Annonce } from "@/lib/annonces";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAnnonces().then((res) => {
      if (res.success && res.data) setAnnonces(res.data);
      else setError(res.error || "Impossible de charger les annonces.");
      setIsLoading(false);
    });
  }, []);

  const usedCategories = ANNONCE_CATEGORIES.filter((c) => annonces.some((a) => a.category === c.id));
  const shown = filter === "all" ? annonces : annonces.filter((a) => a.category === filter);
  const chipCls = (active: boolean) =>
    `shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
      active ? "bg-forest text-white" : "bg-white border border-line text-ink-soft hover:text-forest"
    }`;

  return (
    <div className="space-y-5 pb-4 lg:max-w-2xl lg:mx-auto">
      <PageHeader eyebrow="Annonces" title="La vie du réseau" lead="Nouveaux produits, manifestations, remises de voitures et séminaires." />

      {error && <div role="alert" className="alert-error">{error}</div>}

      {usedCategories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filtrer par type d'annonce">
          <button type="button" onClick={() => setFilter("all")} aria-pressed={filter === "all"} className={chipCls(filter === "all")}>Toutes</button>
          {usedCategories.map((c) => (
            <button key={c.id} type="button" onClick={() => setFilter(c.id)} aria-pressed={filter === c.id} className={chipCls(filter === c.id)}>{c.label}</button>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-sm text-ink-soft py-12">Chargement des annonces…</p>
      ) : !error && annonces.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-sm text-ink-soft">Aucune annonce pour le moment. Revenez bientôt.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((annonce, i) => {
            const category = annonceCategory(annonce.category);
            return (
              <li key={annonce.id} className="card overflow-hidden rise-in" style={{ ["--i" as string]: i } as React.CSSProperties}>
                {annonce.image && (
                  <div className="bg-cream-deep">
                    <img src={annonce.image} alt="" loading="lazy" className="w-full max-h-[420px] object-contain" />
                  </div>
                )}
                <div className="p-5">
                  <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-bold ${category.chip}`}>{category.label}</span>
                  <h3 className="font-heading text-[21px] leading-snug text-ink mt-2.5">{annonce.title}</h3>
                  {(annonce.eventDate || annonce.place) && (
                    <dl className="mt-3 space-y-1 text-[15px] text-ink">
                      {annonce.eventDate && (
                        <div className="flex gap-2">
                          <dt className="text-ink-soft">Date :</dt>
                          <dd className="font-semibold first-letter:uppercase">{formatEventDate(annonce.eventDate)}</dd>
                        </div>
                      )}
                      {annonce.place && (
                        <div className="flex gap-2">
                          <dt className="text-ink-soft">Lieu :</dt>
                          <dd className="font-semibold min-w-0 break-words">{annonce.place}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  <p className="text-[15px] text-ink mt-3 leading-relaxed whitespace-pre-line break-words">{annonce.body}</p>
                  <p className="text-[13px] text-ink-soft mt-3">Publié le {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
