"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";

export async function getAllUsers() {
  try {
    await requireAdmin();

    const [stockistes, partenaires] = await Promise.all([
      prisma.stockiste.findMany({
        select: { id: true, name: true, phone: true, createdAt: true, subscriptionExpiresAt: true },
      }),
      prisma.partenaire.findMany({
        select: { id: true, firstName: true, lastName: true, phone: true, createdAt: true, subscriptionExpiresAt: true },
      }),
    ]);

    const now = new Date();

    const users = [
      ...stockistes.map((s) => ({
        id: `stockiste-${s.id}`,
        name: s.name,
        phone: s.phone,
        role: "Stockiste" as const,
        createdAt: s.createdAt,
        isActive: s.subscriptionExpiresAt > now,
      })),
      ...partenaires.map((p) => ({
        id: `partenaire-${p.id}`,
        name: `${p.firstName} ${p.lastName}`,
        phone: p.phone,
        role: "Partenaire" as const,
        createdAt: p.createdAt,
        isActive: p.subscriptionExpiresAt > now,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return { success: true, data: users };
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    return { success: false, error: "Impossible de récupérer les utilisateurs." };
  }
}

/**
 * Redonne un accès temporaire à un membre (14 jours ou 1 mois), sans paiement.
 * Le délai part d'aujourd'hui si l'accès est terminé, sinon de sa date de fin.
 */
export async function extendMember(memberId: string, days: number) {
  try {
    await requireAdmin();

    if (days !== 14 && days !== 30) return { success: false, error: "Durée invalide." };
    const match = /^(stockiste|partenaire)-(\d+)$/.exec(String(memberId));
    if (!match) return { success: false, error: "Membre introuvable." };
    const accountType = match[1];
    const id = Number(match[2]);

    const select = { subscriptionExpiresAt: true };
    const account =
      accountType === "stockiste"
        ? await prisma.stockiste.findUnique({ where: { id }, select })
        : await prisma.partenaire.findUnique({ where: { id }, select });
    if (!account) return { success: false, error: "Ce membre n'existe plus." };

    const now = new Date();
    const base = account.subscriptionExpiresAt > now ? account.subscriptionExpiresAt : now;
    const subscriptionExpiresAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

    if (accountType === "stockiste") {
      await prisma.stockiste.update({ where: { id }, data: { subscriptionExpiresAt } });
    } else {
      await prisma.partenaire.update({ where: { id }, data: { subscriptionExpiresAt } });
    }

    return { success: true, expiresAt: subscriptionExpiresAt.toISOString() };
  } catch (error) {
    console.error("Erreur extendMember:", error);
    return { success: false, error: "La prolongation n'a pas abouti. Réessayez." };
  }
}

/**
 * Supprime définitivement un compte membre (compte d'essai, abonnement non reconduit…).
 * Supprime aussi ce qui n'a de sens qu'avec le compte : avis, paiements en attente,
 * liens de réinitialisation, formations et stock (stockiste).
 * Les paiements déjà validés sont conservés pour l'historique.
 */
export async function deleteMember(memberId: string) {
  try {
    await requireAdmin();

    const match = /^(stockiste|partenaire)-(\d+)$/.exec(String(memberId));
    if (!match) return { success: false, error: "Membre introuvable." };
    const accountType = match[1] as "stockiste" | "partenaire";
    const id = Number(match[2]);

    const exists =
      accountType === "stockiste"
        ? await prisma.stockiste.findUnique({ where: { id }, select: { id: true } })
        : await prisma.partenaire.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { success: false, error: "Ce membre a déjà été supprimé." };

    await prisma.$transaction(async (tx) => {
      await tx.avis.deleteMany({ where: { accountType, accountId: id } });
      await tx.payment.deleteMany({ where: { accountType, accountId: id, status: { not: "success" } } });
      await tx.passwordResetToken.deleteMany({ where: { accountType, accountId: id } });
      if (accountType === "stockiste") {
        await tx.formation.deleteMany({ where: { stockisteId: id } });
        await tx.stockiste.delete({ where: { id } }); // le stock est supprimé en cascade
      } else {
        await tx.partenaire.delete({ where: { id } });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur deleteMember:", error);
    return { success: false, error: "La suppression n'a pas abouti. Réessayez." };
  }
}
