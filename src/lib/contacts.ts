// Numéros du support Prospections Longrich (Côte d'Ivoire).
// Pour en changer, modifier uniquement cette liste : toutes les pages la reprennent.
export const SUPPORT_CONTACTS = [
  { display: "+225 01 40 47 56 28", tel: "+2250140475628", whatsapp: "2250140475628" },
  { display: "+225 07 08 23 02 46", tel: "+2250708230246", whatsapp: "2250708230246" },
] as const;

export function whatsappLink(number: string, message?: string) {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/**
 * Lien WhatsApp vers le numéro d'un membre, tel qu'il l'a saisi.
 * 10 chiffres : numéro ivoirien, on ajoute 225. Sinon l'indicatif est déjà présent.
 * Renvoie null si le numéro est inutilisable : le bouton n'est alors pas affiché.
 */
export function whatsappForPhone(phone: string | null | undefined, message?: string) {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = `225${digits}`;
  if (digits.length < 11 || digits.length > 15) return null;
  return whatsappLink(digits, message);
}

/** WhatsApp s'ouvre et la personne choisit à quel contact envoyer le message. */
export const whatsappShareLink = (message: string) => `https://wa.me/?text=${encodeURIComponent(message)}`;
