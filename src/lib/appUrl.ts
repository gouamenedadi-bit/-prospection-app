/** Domaine officiel du site en production. */
export const PRODUCTION_URL = "https://www.prospectionlongrich.com";

/**
 * Adresse publique du site, pour les liens envoyés par email (mot de passe oublié…).
 * NEXTAUTH_URL sert en local (http://localhost:3001) ; en ligne, c'est le domaine officiel.
 * Jamais l'en-tête Host de la requête, qu'un attaquant pourrait falsifier pour détourner le lien.
 */
export function appUrl() {
  const fromEnv = process.env.NEXTAUTH_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return PRODUCTION_URL;
}
