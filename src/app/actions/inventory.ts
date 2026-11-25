"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pickTopStocks, type Place } from "@/lib/topStocks";
import { getContentAccess } from "@/lib/authz";

async function requireOwnStockiste(id: number | string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "stockiste" || String(session.user.id) !== String(id)) {
    throw new Error("Non autorisé.");
  }
}

// Met à jour la quantité d'un produit pour un stockiste donné
export async function updateStock(stockisteId: number | string, produitId: number | string, quantity: number) {
  try {
    await requireOwnStockiste(stockisteId);
    const sId = typeof stockisteId === "string" ? parseInt(stockisteId) : stockisteId;
    const pId = typeof produitId === "string" ? parseInt(produitId) : produitId;

    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000) {
      return { success: false, error: "La quantité doit être un nombre entier positif." };
    }
    if (!Number.isInteger(pId)) {
      return { success: false, error: "Produit invalide." };
    }

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
    return { success: false, error: "Impossible de mettre à jour le stock." };
  }
}

/**
 * Pour chaque produit en stock, un seul stockiste : le plus proche de la personne
 * (commune puis ville de son compte), sinon celui qui en a le plus.
 * Réservé aux abonnements actifs (contient des téléphones).
 */
export async function getTopStocks() {
  try {
    const access = await getContentAccess();
    if (access === "none") {
      return { success: false as const, error: "Connectez-vous pour voir où trouver les produits." };
    }
    if (access === "expired") {
      return { success: false as const, error: "Votre abonnement est terminé. Renouvelez-le pour voir où trouver les produits." };
    }

    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const myId = Number(session?.user?.id);
    let me: Place | null = null;
    if (role === "partenaire") {
      me = await prisma.partenaire.findUnique({ where: { id: myId }, select: { city: true, commune: true } });
    } else if (role === "stockiste") {
      me = await prisma.stockiste.findUnique({ where: { id: myId }, select: { city: true, commune: true } });
    }

    const rows = await prisma.inventory.findMany({
      where: { quantity: { gt: 0 } },
      select: {
        quantity: true,
        stockisteId: true,
        produit: { select: { id: true, name: true, image: true } },
        stockiste: { select: { name: true, phone: true, city: true, commune: true, neighborhood: true } },
      },
    });
    return { success: true as const, data: pickTopStocks(rows, me, role === "stockiste" ? myId : null) };
  } catch (error) {
    console.error("Erreur getTopStocks:", error);
    return { success: false as const, error: "Impossible de charger les stocks. Réessayez." };
  }
}

/**
 * Les 10 produits qu'un stockiste a le plus en stock, pour sa fiche.
 * Le reste de son stock n'est pas affiché : on l'appelle ou on lui écrit pour le connaître.
 */
export async function getStockisteTopProducts(stockisteId: number) {
  try {
    const access = await getContentAccess();
    if (access === "none") {
      return { success: false as const, error: "Connectez-vous pour voir les produits de ce stockiste." };
    }
    if (access === "expired") {
      return { success: false as const, error: "Votre abonnement est terminé. Renouvelez-le pour voir les produits des stockistes." };
    }
    if (!Number.isInteger(stockisteId)) {
      return { success: false as const, error: "Stockiste introuvable." };
    }

    const rows = await prisma.inventory.findMany({
      where: { stockisteId, quantity: { gt: 0 } },
      orderBy: [{ quantity: "desc" }, { produitId: "asc" }],
      take: 10,
      select: { quantity: true, produit: { select: { id: true, name: true, image: true } } },
    });
    return {
      success: true as const,
      data: rows.map((r) => ({ productId: r.produit.id, productName: r.produit.name, image: r.produit.image, quantity: r.quantity })),
    };
  } catch (error) {
    console.error("Erreur getStockisteTopProducts:", error);
    return { success: false as const, error: "Impossible de charger ses produits. Réessayez." };
  }
}

// Récupère tout l'inventaire d'un stockiste. Réservé à lui-même : les autres ne voient
// que le stock le plus élevé de chaque produit (getTopStocks).
export async function getStockisteInventory(stockisteId: number | string) {
  try {
    await requireOwnStockiste(stockisteId);
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
    return { success: false, error: "Impossible de récupérer l'inventaire." };
  }
}
