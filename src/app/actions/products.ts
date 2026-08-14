"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/authz";

export async function getProducts() {
  try {
    const products = await prisma.produit.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return { success: false, error: "Impossible de récupérer les produits." };
  }
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.produit.findUnique({ where: { id } });
    if (!product) {
      return { success: false, error: "Produit introuvable." };
    }
    return { success: true, data: product };
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return { success: false, error: "Impossible de récupérer le produit." };
  }
}

export async function createProduct(data: {
  name: string;
  partnerPrice: number;
  publicPrice: number;
  description: string;
  posology?: string | null;
  pv?: number | null;
  image?: string | null;
}) {
  try {
    await requireAdmin();
    const { image, ...restData } = data;
    const product = await prisma.produit.create({
      data: {
        ...restData,
        image,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/stockiste/products");
    revalidatePath("/partner/products");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Erreur lors de la création du produit:", error);
    return { success: false, error: error.message || "Impossible de créer le produit." };
  }
}

export async function updateProduct(id: number, data: {
  name: string;
  partnerPrice: number;
  publicPrice: number;
  description: string;
  posology?: string | null;
  pv?: number | null;
  image?: string | null;
}) {
  try {
    await requireAdmin();
    const { image, ...restData } = data;
    const product = await prisma.produit.update({
      where: { id: Number(id) },
      data: {
        ...restData,
        image,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/stockiste/products");
    revalidatePath("/partner/products");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    if (error.code === 'P2025') {
      return { success: false, error: "Le produit a été rechargé en arrière-plan. Veuillez actualiser la page complètement (F5) avant de modifier." };
    }
    return { success: false, error: error.message || "Erreur inconnue." };
  }
}

export async function deleteProduct(id: number) {
  try {
    await requireAdmin();
    const product = await prisma.produit.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/admin");
    revalidatePath("/stockiste/products");
    revalidatePath("/partner/products");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Erreur lors de la suppression du produit:", error);
    return { success: false, error: error.message || "Impossible de supprimer le produit." };
  }
}
