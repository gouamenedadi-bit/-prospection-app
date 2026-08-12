"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function requireOwnPartenaire(id: number | string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "partenaire" || String(session.user.id) !== String(id)) {
    throw new Error("Non autorisé.");
  }
}

export async function getPartenaireProfile(id: number | string) {
  try {
    await requireOwnPartenaire(id);
    const pId = typeof id === "string" ? parseInt(id) : id;
    const partenaire = await prisma.partenaire.findUnique({
      where: { id: pId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        city: true,
        commune: true,
      },
    });
    return { success: true, data: partenaire };
  } catch (error) {
    console.error("Erreur getPartenaireProfile:", error);
    return { success: false, error: "Impossible de récupérer le profil." };
  }
}

export async function updatePartenaireProfile(
  id: number | string,
  data: { firstName: string; lastName: string; phone: string; city: string; commune: string }
) {
  try {
    await requireOwnPartenaire(id);
    const pId = typeof id === "string" ? parseInt(id) : id;
    const partenaire = await prisma.partenaire.update({
      where: { id: pId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        commune: data.commune,
      },
    });
    return { success: true, data: partenaire };
  } catch (error) {
    console.error("Erreur updatePartenaireProfile:", error);
    return { success: false, error: "Impossible de mettre à jour le profil." };
  }
}
