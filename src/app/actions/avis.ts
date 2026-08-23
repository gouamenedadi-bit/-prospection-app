"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAccount, requireAdmin } from "@/lib/authz";

export async function submitAvis(data: { rating: number; comment?: string }) {
  try {
    const account = await getCurrentAccount();
    if (!account) {
      return { success: false, error: "Non authentifié." };
    }
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Note invalide." };
    }

    await prisma.avis.create({
      data: {
        accountType: account.role,
        accountId: Number(account.id),
        rating: data.rating,
        comment: data.comment?.trim() || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur submitAvis:", error);
    return { success: false, error: "Impossible d'envoyer votre avis." };
  }
}

export async function getAllAvis() {
  try {
    await requireAdmin();

    const avis = await prisma.avis.findMany({ orderBy: { createdAt: "desc" } });

    const enriched = await Promise.all(
      avis.map(async (a) => {
        const name =
          a.accountType === "stockiste"
            ? (await prisma.stockiste.findUnique({ where: { id: a.accountId }, select: { name: true } }))?.name
            : (await prisma.partenaire
                .findUnique({ where: { id: a.accountId }, select: { firstName: true, lastName: true } })
                .then((r) => (r ? `${r.firstName} ${r.lastName}` : undefined)));
        return { ...a, accountName: name || `#${a.accountId}` };
      })
    );

    return { success: true, data: enriched };
  } catch (error) {
    console.error("Erreur getAllAvis:", error);
    return { success: false, error: "Impossible de récupérer les avis." };
  }
}
