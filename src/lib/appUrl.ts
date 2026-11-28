/**
 * Adresse publique du site, pour les liens envoyés par email (mot de passe oublié…).
 * NEXTAUTH_URL n'est pas défini sur Vercel : on prend alors le domaine de production
 * fourni par Vercel, puis l'adresse connue. Jamais l'en-tête Host de la requête,
 * qu'un attaquant pourrait falsifier pour détourner le lien.
 */
export function appUrl() {
  const fromEnv = process.env.NEXTAUTH_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "https://prospection-applongrich.vercel.app";
}
