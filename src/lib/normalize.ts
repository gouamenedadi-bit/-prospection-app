// Les emails sont comparés sans tenir compte des majuscules ni des espaces :
// "Jean@Gmail.com " et "jean@gmail.com" désignent le même compte.
export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

// Échappe un texte avant de l'insérer dans le HTML d'un email.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
