"use client";

import { useEffect, useRef, useState } from "react";
import { Recognition, SPEECH_ERRORS, getRecognitionCtor } from "@/lib/speech";

/**
 * Micro dans un champ de recherche, pour les personnes qui préfèrent parler qu'écrire.
 * On touche le micro, on dit « Yopougon » : le mot s'écrit pendant qu'on parle,
 * la dictée s'arrête seule dès qu'on se tait, et la recherche se lance.
 * À placer dans un conteneur `relative` ; le champ doit garder de la place à droite (pr-14).
 */
export default function VoiceSearchButton({
  onText,
  onError,
  onListeningChange,
  lang = "fr-FR",
}: {
  /** Appelé pendant la dictée (texte provisoire) puis à la fin (texte définitif). */
  onText: (text: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
  onListeningChange?: (listening: boolean) => void;
  lang?: string;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const lastRef = useRef("");

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recRef.current?.abort();
  }, []);

  if (!supported) return null;

  const setState = (v: boolean) => {
    setListening(v);
    onListeningChange?.(v);
  };

  // « Yopougon. » → « Yopougon »
  const clean = (t: string) => t.trim().replace(/[.,!?;:]+$/g, "").trim();

  const start = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    onError?.("");
    lastRef.current = "";

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = false; // une seule phrase : s'arrête dès que la personne se tait
    rec.interimResults = true;

    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      lastRef.current = clean(text);
      onText(lastRef.current, false);
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") onError?.(SPEECH_ERRORS[e.error] ?? "La dictée s'est interrompue. Touchez le micro pour réessayer.");
    };
    rec.onend = () => {
      setState(false);
      recRef.current = null;
      if (lastRef.current) onText(lastRef.current, true);
    };

    recRef.current = rec;
    try {
      rec.start();
      setState(true);
    } catch {
      onError?.("La dictée n'a pas pu démarrer. Réessayez.");
    }
  };

  const stop = () => recRef.current?.stop();

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-pressed={listening}
      aria-label={listening ? "Arrêter la recherche vocale" : "Rechercher en parlant"}
      title={listening ? "Arrêter" : "Rechercher en parlant"}
      className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        listening ? "bg-gold text-white voice-pulse" : "bg-palm-light text-forest hover:bg-forest hover:text-white"
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
        {listening ? (
          <rect x="7" y="7" width="10" height="10" rx="2" />
        ) : (
          <>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" />
          </>
        )}
      </svg>
    </button>
  );
}
