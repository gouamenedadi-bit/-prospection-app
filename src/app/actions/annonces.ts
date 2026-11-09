"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { ANNONCE_CATEGORIES } from "@/lib/annonces";

/** Annonces les plus récentes d'abord. Lecture ouverte : rien de confidentiel. */
export async function getAnnonces(limit = 100) {
  try {
    const take = Math.min(Math.max(1, Math.floor(Number(limit)) || 100), 100);
    const data = await prisma.annonce.findMany({ orderBy: { createdAt: "desc" }, take });
    return { success: true, data };
  } catch (error) {
    console.error("Erreur getAnnonces:", error);
    return { success: false, error: "Impossible de charger les annonces." };
  }
}

export type AnnonceInput = {
  id?: number;
  category: string;
  title: string;
  body: string;
  eventDate?: string;
  place?: string;
  image?: string;
};

/** Crée l'annonce, ou la met à jour si `id` est fourni. */
export async function saveAnnonce(input: AnnonceInput) {
  try {
    await requireAdmin();

    const category = String(input?.category ?? "");
    const title = String(input?.title ?? "").trim();
    const body = String(input?.body ?? "").trim();
    const place = String(input?.place ?? "").trim();
    const image = String(input?.image ?? "").trim();
    const day = String(input?.eventDate ?? "").trim();

    if (!ANNONCE_CATEGORIES.some((c) => c.id === category)) return { success: false, error: "Choisissez le type d'annonce." };
    if (!title || title.length > 120) return { success: false, error: "Saisissez un titre (120 caractères au plus)." };
    if (!body || body.length > 3000) return { success: false, error: "Saisissez le texte de l'annonce (3 000 caractères au plus)." };
    if (place.length > 120) return { success: false, error: "Le lieu est trop long (120 caractères au plus)." };
    if (image && !/^https?:\/\//.test(image)) return { success: false, error: "L'image n'est pas valide. Ajoutez-la de nouveau." };

    let eventDate: Date | null = null;
    if (day) {
      eventDate = /^\d{4}-\d{2}-\d{2}$/.test(day) ? new Date(`${day}T12:00:00.000Z`) : new Date(NaN);
      if (Number.isNaN(eventDate.getTime())) return { success: false, error: "La date n'est pas valide." };
    }

    const data = { category, title, body, eventDate, place: place || null, image: image || null };
    const annonce = input.id
      ? await prisma.annonce.update({ where: { id: Number(input.id) }, data })
      : await prisma.annonce.create({ data });

    return { success: true, data: annonce };
  } catch (error) {
    console.error("Erreur saveAnnonce:", error);
    return { success: false, error: "L'annonce n'a pas été enregistrée. Réessayez." };
  }
}

export async function deleteAnnonce(id: number) {
  try {
    await requireAdmin();
    await prisma.annonce.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteAnnonce:", error);
    return { success: false, error: "L'annonce n'a pas été supprimée. Réessayez." };
  }
}
