"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { readWithOffline, clearOfflineData } from "@/lib/offlineCache";
import { getAnnonces } from "@/app/actions/annonces";
import { getProducts } from "@/app/actions/products";
import { getTopStocks } from "@/app/actions/inventory";
import { getAllStockistes } from "@/app/actions/stockistes";
import "@/lib/installPrompt";

// Pages à garder sur le téléphone dès la connexion, pour qu'elles marchent sans internet.
const MAIN_PAGES = ["/dashboard", "/health", "/grades", "/compensation", "/annonces", "/ou-trouver", "/stockistes", "/stockiste/products", "/abonnement"];
const WARM_KEY = "lr-offline-warmed-at";
const WARM_EVERY = 12 * 60 * 60 * 1000;

function postToWorker(message: unknown) {
  navigator.serviceWorker?.ready.then((reg) => reg.active?.postMessage(message)).catch(() => {});
}

/**
 * Mode hors connexion : installe le service worker, prépare les pages et les données
 * principales quand il y a du réseau, et efface tout à la déconnexion.
 */
export default function OfflineSupport() {
  const { status } = useSession();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!navigator.onLine) return;

    if (status === "unauthenticated") {
      clearOfflineData();
      try { localStorage.removeItem(WARM_KEY); } catch {}
      postToWorker({ type: "clear" });
      return;
    }
    if (status !== "authenticated") return;

    let last = 0;
    try { last = Number(localStorage.getItem(WARM_KEY)) || 0; } catch {}
    if (Date.now() - last < WARM_EVERY) return;
    try { localStorage.setItem(WARM_KEY, String(Date.now())); } catch {}

    // Les données, avec les mêmes clés que les pages qui les affichent.
    readWithOffline("annonces:1", () => getAnnonces(1));
    readWithOffline("annonces:all", () => getAnnonces());
    readWithOffline("top-stocks", () => getTopStocks());
    readWithOffline("stockistes", () => getAllStockistes());
    readWithOffline("products", () => getProducts()).then((res) => {
      // Les fiches produits aussi : on s'en sert pour prospecter, même sans réseau.
      const ids = res.success && "data" in res && Array.isArray(res.data) ? res.data.map((p: { id: number }) => p.id) : [];
      postToWorker({ type: "warm", urls: [...MAIN_PAGES, ...ids.slice(0, 250).map((id) => `/stockiste/products/${id}`)] });
    });
  }, [status]);

  return null;
}
