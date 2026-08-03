"use server";

import { prisma } from "@/lib/prisma";

export async function getAllStockistes() {
  try {
    const stockistes = await prisma.stockiste.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        commune: true,
        neighborhood: true,
        phone: true,
        latitude: true,
        longitude: true
      }
    });
    return { success: true, data: stockistes };
  } catch (error) {
    console.error("Erreur getAllStockistes:", error);
    return { success: false, error: "Impossible de récupérer les stockistes." };
  }
}

export async function getStockisteProfile(id: number | string) {
  try {
    const sId = typeof id === "string" ? parseInt(id) : id;
    const stockiste = await prisma.stockiste.findUnique({
      where: { id: sId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        city: true,
        commune: true,
        neighborhood: true,
      }
    });
    return { success: true, data: stockiste };
  } catch (error) {
    console.error("Erreur getStockisteProfile:", error);
    return { success: false, error: "Impossible de récupérer le profil." };
  }
}

export async function updateStockisteProfile(id: number | string, data: any) {
  try {
    const sId = typeof id === "string" ? parseInt(id) : id;
    const stockiste = await prisma.stockiste.update({
      where: { id: sId },
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        commune: data.commune,
        neighborhood: data.neighborhood
      }
    });
    return { success: true, data: stockiste };
  } catch (error) {
    console.error("Erreur updateStockisteProfile:", error);
    return { success: false, error: "Impossible de mettre à jour le profil." };
  }
}
