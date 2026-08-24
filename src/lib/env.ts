// Défensif contre les valeurs d'env var collées avec des guillemets ou des espaces superflus
// (arrivé plusieurs fois via l'interface Vercel).
export function cleanEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']+/, "").replace(/["']+$/, "").trim();
}
