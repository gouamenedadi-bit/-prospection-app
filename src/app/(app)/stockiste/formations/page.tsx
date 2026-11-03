"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";

export default function FormationsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const formations = [
    {
      title: "Présentation Plan de Compensation",
      day: "12", month: "août", year: "2026",
      time: "14:00",
      trainer: "Leader K. Jean",
      location: "Bureau Marc Kouassi (Abidjan, Cocody Angré)"
    },
    {
      title: "Formation Produits & Soins",
      day: "15", month: "août", year: "2026",
      time: "09:00",
      trainer: "Dr. A. Marie",
      location: "Bureau Fatou Diarra (Abidjan, Yopougon)"
    },
    {
      title: "Stratégies de Prospection",
      day: "20", month: "août", year: "2026",
      time: "10:00",
      trainer: "Leader S. Michel",
      location: "Bureau Jean Pierre (Bouaké, Commerce)"
    },
  ];

  const filteredFormations = formations.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Formations"
        lead="Les prochaines sessions organisées dans les bureaux du réseau."
      />

      <div className="relative mb-4">
        <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="search"
          aria-label="Rechercher une formation"
          placeholder="Ville, bureau, thème ou formateur"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-11"
        />
      </div>

      {filteredFormations.length > 0 ? (
        <ul className="space-y-3 desk:space-y-0 desk:grid desk:grid-cols-2 desk:gap-3">
          {filteredFormations.map((form, i) => (
            <li key={i} className="card lift-card accent-gold rise-in p-4 pl-5 flex gap-4" style={{ ["--i" as string]: i } as React.CSSProperties}>
              <div className="lift-badge w-14 shrink-0 self-start rounded-xl bg-forest text-cream text-center py-2 shadow-sm" aria-hidden="true">
                <span className="block font-heading text-2xl leading-none">{form.day}</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-gold mt-1">{form.month}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-forest text-[17px] leading-snug">{form.title}</h3>
                <p className="font-mono text-xs text-gold-deep mt-1">{form.day} {form.month} {form.year}, {form.time}</p>
                <dl className="mt-2 space-y-1 text-[13px]">
                  <div className="flex gap-1.5"><dt className="text-ink-soft shrink-0">Lieu :</dt><dd className="text-ink">{form.location}</dd></div>
                  <div className="flex gap-1.5"><dt className="text-ink-soft shrink-0">Formateur :</dt><dd className="text-ink">{form.trainer}</dd></div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-6 text-center text-sm text-ink-soft">
          Aucune formation ne correspond à « <span className="font-semibold text-ink">{searchTerm}</span> ».
        </div>
      )}
    </div>
  );
}
