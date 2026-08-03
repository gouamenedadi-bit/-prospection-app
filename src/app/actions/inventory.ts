"use server";

import { prisma } from "@/lib/prisma";

// Met à jour la quantité d'un produit pour un stockiste donné
export async function updateStock(stockisteId: number | string, produitId: number | string, quantity: number) {
  try {
    const sId = typeof stockisteId === "string" ? parseInt(stockisteId) : stockisteId;
    const pId = typeof produitId === "string" ? parseInt(produitId) : produitId;
    
    const inventory = await prisma.inventory.upsert({
      where: {
        stockisteId_produitId: {
          stockisteId: sId,
          produitId: pId
        }
      },
      update: {
        quantity
      },
      create: {
        stockisteId: sId,
        produitId: pId,
        quantity
      }
    });
    
    return { success: true, data: inventory };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du stock:", error);
    return { success: false, error: error.message || "Impossible de mettre à jour le stock" };
  }
}

// Récupère tout l'inventaire d'un stockiste, en incluant les infos des produits
export async function getStockisteInventory(stockisteId: number | string) {
  try {
    const sId = typeof stockisteId === "string" ? parseInt(stockisteId) : stockisteId;
    
    const inventory = await prisma.inventory.findMany({
      where: { stockisteId: sId },
      include: {
        produit: true
      }
    });
    
    return { success: true, data: inventory };
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'inventaire:", error);
    return { success: false, error: error.message || "Impossible de récupérer l'inventaire" };
  }
}
