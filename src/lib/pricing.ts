// Tarifs de l'abonnement. Fichier sans accès base de données : utilisable côté navigateur et serveur.
export type MemberRole = "partenaire" | "stockiste";

export const YEARLY_PRICES: Record<MemberRole, number> = {
  partenaire: 1000,
  stockiste: 2000,
};

export const planFor = (role: MemberRole) => ({
  label: "1 an",
  days: 365,
  amount: YEARLY_PRICES[role],
});
