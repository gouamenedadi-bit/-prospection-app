// Numéros du support Prospections Longrich (Côte d'Ivoire).
// Pour en changer, modifier uniquement cette liste : toutes les pages la reprennent.
export const SUPPORT_CONTACTS = [
  { display: "+225 01 40 47 56 28", tel: "+2250140475628", whatsapp: "2250140475628" },
  { display: "+225 07 08 23 02 46", tel: "+2250708230246", whatsapp: "2250708230246" },
] as const;

export function whatsappLink(number: string, message?: string) {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
