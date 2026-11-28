"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OFFLINE_EVENT } from "@/lib/offlineCache";

/**
 * Bandeau visible seulement sans internet, pour qu'on sache que les infos ne sont pas à jour.
 * Deux signaux : le téléphone dit qu'il est hors ligne, ou un chargement vient d'échouer faute de réseau.
 */
export default function OfflineBanner() {
  const pathname = usePathname();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const fromNavigator = () => setOffline(!navigator.onLine);
    const fromRead = (e: Event) => setOffline((e as CustomEvent<boolean>).detail || !navigator.onLine);
    fromNavigator();
    window.addEventListener("online", fromNavigator);
    window.addEventListener("offline", fromNavigator);
    window.addEventListener(OFFLINE_EVENT, fromRead);
    return () => {
      window.removeEventListener("online", fromNavigator);
      window.removeEventListener("offline", fromNavigator);
      window.removeEventListener(OFFLINE_EVENT, fromRead);
    };
  }, [pathname]);

  if (!offline) return null;
  return (
    <div role="status" className="mb-4 rounded-xl border border-gold/30 bg-gold-light px-4 py-3 text-[15px] text-forest-deep">
      <p className="font-bold">Pas de connexion internet</p>
      <p className="mt-0.5">Vous voyez les dernières informations enregistrées sur ce téléphone. Pour appeler un stockiste, le réseau téléphonique suffit.</p>
    </div>
  );
}
