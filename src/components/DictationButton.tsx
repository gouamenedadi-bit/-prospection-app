"use client";

import { useEffect, useRef, useState } from "react";
import { Recognition, SPEECH_ERRORS, getRecognitionCtor } from "@/lib/speech";

// Ajoute un morceau dicté au texte existant, avec l'espace et la majuscule qui conviennent.
function appendSpoken(base: string, spoken: string) {
  const chunk = spoken.trim();
  if (!chunk) return base;
  const trimmed = base.replace(/\s+$/, "");
  const startsSentence = trimmed === "" || /[.!?]$/.test(trimmed);
  const text = startsSentence ? chunk.charAt(0).toUpperCase() + chunk.slice(1) : chunk;
  return trimmed === "" ? text : `${trimmed} ${text}`;
}

/**
 * Bouton micro : la personne parle, le texte s'écrit dans le champ.
 * Masqué sur les navigateurs sans reconnaissance vocale (ex. Firefox).
 */
export default function DictationButton({
  value,
  onChange,
  lang = "fr-FR",
  hint = "Touchez le micro pour dicter votre commentaire.",
  singleLine = false,
  children,
}: {
  value: string;
  onChange: (next: string) => void;
  lang?: string;
  /** Phrase d'aide sous le champ, quand le micro n'écoute pas. */
  hint?: string;
  /** Champ d'une ligne : micro centré à droite (le champ garde pr-14). Sinon, coin bas droit. */
  singleLine?: boolean;
  /** Le champ texte. */
  children: React.ReactNode;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recRef = useRef<Recognition | null>(null);
  const baseRef = useRef("");

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recRef.current?.abort();
  }, []);

  if (!supported) return <>{children}</>;

  const stop = () => recRef.current?.stop();

  const start = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    setError("");

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = value;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          baseRef.current = appendSpoken(baseRef.current, r[0].transcript);
        } else {
          interim += r[0].transcript;
        }
      }
      onChange(appendSpoken(baseRef.current, interim));
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") setError(SPEECH_ERRORS[e.error] ?? "La dictée s'est interrompue. Touchez le micro pour reprendre.");
    };
    rec.onend = () => {
      setListening(false);
      onChange(baseRef.current);
      recRef.current = null;
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("La dictée n'a pas pu démarrer. Réessayez.");
    }
  };

  return (
    <>
      <div className="relative">
      {children}
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        aria-label={listening ? "Arrêter la dictée" : "Dicter avec le micro"}
        title={listening ? "Arrêter la dictée" : "Dicter avec le micro"}
        className={`absolute ${singleLine ? "right-1.5 top-1/2 -translate-y-1/2" : "right-2.5 bottom-2.5"} flex items-center gap-1.5 h-10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          listening
            ? singleLine ? "w-10 justify-center bg-clay text-white" : "bg-clay text-white pl-3 pr-4"
            : "w-10 justify-center bg-palm-light text-forest hover:bg-forest hover:text-cream"
        }`}
      >
        {listening && !singleLine && <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />}
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          {listening ? (
            <rect x="7" y="7" width="10" height="10" rx="2" />
          ) : (
            <>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0014 0M12 18v3" />
            </>
          )}
        </svg>
        {listening && !singleLine && <span className="text-xs font-bold">Arrêter</span>}
      </button>
      </div>
      <p role="status" aria-live="polite" className={`text-xs mt-1.5 ${error ? "text-clay" : "text-ink-soft"}`}>
        {error || (listening ? "Parlez, votre texte s'écrit au fur et à mesure… Touchez le carré pour arrêter." : hint)}
      </p>
    </>
  );
}
