// Types d'annonces. Fichier sans accès base de données : utilisable côté navigateur et serveur.
export const ANNONCE_CATEGORIES = [
  { id: "produit", label: "Nouveau produit", chip: "bg-palm-light text-forest" },
  { id: "evenement", label: "Manifestation", chip: "bg-gold-light text-[#B4560B]" },
  { id: "voiture", label: "Remise de voitures", chip: "bg-forest text-white" },
  { id: "seminaire", label: "Séminaire", chip: "bg-clay-light text-clay" },
  { id: "autre", label: "Autre annonce", chip: "bg-cream-deep text-ink-soft" },
] as const;

export type AnnonceCategory = (typeof ANNONCE_CATEGORIES)[number]["id"];

export const annonceCategory = (id: string) =>
  ANNONCE_CATEGORIES.find((c) => c.id === id) ?? ANNONCE_CATEGORIES[ANNONCE_CATEGORIES.length - 1];

export type Annonce = {
  id: number;
  category: string;
  title: string;
  body: string;
  eventDate: Date | string | null;
  place: string | null;
  image: string | null;
  createdAt: Date | string;
};

/** Les dates d'événement sont enregistrées à midi UTC : le jour reste le même partout. */
export const formatEventDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
