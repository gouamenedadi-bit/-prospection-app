"use client";

import { useEffect, useState } from "react";
import { canPromptInstall, isInstalled, promptInstall, subscribeInstall } from "@/lib/installPrompt";

/**
 * Petit bouton « Installer » toujours visible en haut de l'écran, tant que l'application
 * n'est pas installée. Ouvre l'installation du navigateur, sinon explique quoi toucher.
 */
export default function InstallHeaderButton({ variant = "header" }: { variant?: "header" | "side" }) {
  const [, force] = useState(0);
  const [ready, setReady] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setReady(true);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const unsubscribe = subscribeInstall(() => force((n) => n + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  if (!ready || isInstalled()) return null;

  const install = async () => {
    if (canPromptInstall()) await promptInstall();
    else setShowHelp((v) => !v);
  };

  const help = isIos
    ? "Sur iPhone : touchez le bouton Partager (carré avec une flèche), puis « Sur l'écran d'accueil »."
    : "Ouvrez le menu du navigateur (les trois points ⋮), puis touchez « Installer l'application » ou « Ajouter à l'écran d'accueil ».";

  const icon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0" aria-hidden="true">
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );

  if (variant === "side") {
    return (
      <div className="pr-4">
        <button type="button" onClick={install} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold text-forest-deep font-bold text-[15px] px-3 py-2.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream">
          {icon}
          Installer l&apos;application
        </button>
        {showHelp && <p role="status" className="mt-2 rounded-xl bg-cream text-ink text-[14px] p-3">{help}</p>}
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={install}
        aria-expanded={showHelp}
        className="flex items-center gap-1.5 rounded-full bg-gold text-forest-deep font-bold text-[14px] pl-2 pr-2.5 h-9 shrink-0 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
      >
        {icon}
        Installer
      </button>
      {showHelp && (
        <p role="status" className="absolute right-0 top-11 w-64 rounded-xl bg-white text-ink text-[14px] p-3 shadow-lg ring-1 ring-line">
          {help}
        </p>
      )}
    </div>
  );
}
