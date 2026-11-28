"use client";

import { useEffect, useState } from "react";
import { canPromptInstall, isInstalled, promptInstall, subscribeInstall } from "@/lib/installPrompt";

/**
 * « Installer l'application » : un bouton quand le navigateur le permet (Android, ordinateur),
 * sinon la marche à suivre (iPhone). Rien une fois l'application installée.
 */
export default function InstallAppCard({ className = "" }: { className?: string }) {
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

  return (
    <section className={`card p-4 flex items-start gap-3 ${className}`}>
      <img src="/icon-192.png" alt="" className="w-12 h-12 rounded-xl shrink-0" />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[17px] text-ink">Installer l&apos;application</h3>
        <p className="text-[15px] text-ink-soft mt-0.5">Une icône sur votre écran d&apos;accueil, et l&apos;application marche même sans internet.</p>
        <button type="button" onClick={install} className="btn-primary mt-3 w-full sm:w-auto">
          Installer
        </button>
        {showHelp && (
          <p role="status" className="text-[15px] text-ink mt-3 rounded-xl bg-cream-deep p-3">
            {isIos
              ? "Sur iPhone : touchez le bouton Partager (carré avec une flèche), puis « Sur l'écran d'accueil »."
              : "Ouvrez le menu du navigateur (les trois points ⋮), puis touchez « Installer l'application » ou « Ajouter à l'écran d'accueil »."}
          </p>
        )}
      </div>
    </section>
  );
}
