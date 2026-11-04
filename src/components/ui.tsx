"use client";

import React, { useState } from "react";

/** En-tête standard d'une page : sur-titre doré, titre Fraunces, phrase d'introduction. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-head flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="page-title">{title}</h2>
        {lead && <p className="page-lead">{lead}</p>}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  );
}

/**
 * Cadre des écrans d'accès (connexion, inscription, mot de passe).
 * Bandeau vert foncé en tête, formulaire en dessous, liens en pied.
 * La barre de navigation est grisée tant que l'utilisateur n'est pas connecté.
 */
export function AuthShell({
  eyebrow,
  title,
  lead,
  children,
  footer,
  nav = "lock",
}: {
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** "lock" = barre grisée, "hide" = barre masquée, "show" = inchangée */
  nav?: "lock" | "hide" | "show";
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-2">
      {nav === "lock" && <style dangerouslySetInnerHTML={{ __html: `nav[data-bottom-nav] { pointer-events: none; opacity: 0.4; filter: grayscale(100%); }` }} />}
      {nav === "hide" && <style dangerouslySetInnerHTML={{ __html: `nav[data-bottom-nav] { display: none !important; }` }} />}
      <div className="w-full card overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
        <div className="bg-forest-deep px-6 pt-7 pb-6 text-cream">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h2 className="font-heading text-[28px] leading-tight mt-2">{title}</h2>
          {lead && <p className="text-sm text-cream/70 mt-1.5 leading-relaxed">{lead}</p>}
        </div>
        <div className="p-6">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-ink-soft space-y-2">{footer}</div>}
    </div>
  );
}

/** Champ mot de passe avec bouton Afficher / Masquer. */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  minLength,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pr-11"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-soft/60 hover:text-ink rounded-r-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        )}
      </button>
    </div>
  );
}

/** Onglets segmentés (ex. Partenaire / Stockiste). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex bg-cream-deep p-1 rounded-xl">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            value === o.value ? "bg-white text-forest shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
