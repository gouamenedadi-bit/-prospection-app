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
