// Garde sur le téléphone la dernière réponse réussie des lectures (annonces, produits, stocks…),
// pour les afficher quand il n'y a pas d'internet. Seulement des lectures : jamais d'envoi.
const PREFIX = "lr-offline:";

type Saved<T> = { at: number; data: T };

function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), data } satisfies Saved<T>));
  } catch {
    // Mémoire pleine ou navigation privée : tant pis, on reste en ligne seulement.
  }
}

function load<T>(key: string): Saved<T> | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Saved<T>) : null;
  } catch {
    return null;
  }
}

/** Prévient le bandeau « Pas de connexion » : le téléphone peut se croire en ligne sans internet réel. */
export const OFFLINE_EVENT = "lr-connection";
function signal(offline: boolean) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(OFFLINE_EVENT, { detail: offline }));
}

export const OFFLINE_ERROR = "Pas de connexion internet. Cette page s'affichera dès que le réseau reviendra.";

/**
 * Lance la lecture ; si elle réussit, la garde. Sans réseau, rend la dernière copie gardée
 * (avec `offline: true`), sinon un message clair au lieu d'un chargement sans fin.
 */
export async function readWithOffline<T extends { success: boolean }>(key: string, read: () => Promise<T>): Promise<T & { offline?: boolean }> {
  try {
    const res = await read();
    if (res.success) save(key, res);
    signal(false);
    return res;
  } catch {
    signal(true);
    const saved = load<T>(key);
    if (saved) return { ...saved.data, offline: true };
    return { success: false, error: OFFLINE_ERROR, offline: true } as unknown as T & { offline?: boolean };
  }
}

/** À la déconnexion : rien ne doit rester pour la personne suivante sur le même téléphone. */
export function clearOfflineData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
