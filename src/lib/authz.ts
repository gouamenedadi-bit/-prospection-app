import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getSubscriptionExpiry } from "@/lib/subscription";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Non autorisé.");
  }
}

export async function getCurrentAccount() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "stockiste" && session.user.role !== "partenaire")) {
    return null;
  }
  const role = session.user.role as "stockiste" | "partenaire";
  // Un compte supprimé par l'admin peut garder une session ouverte : on vérifie qu'il existe toujours.
  const id = Number(session.user.id);
  const exists =
    role === "stockiste"
      ? await prisma.stockiste.findUnique({ where: { id }, select: { id: true } })
      : await prisma.partenaire.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return null;
  return { id: session.user.id, role };
}

/**
 * Droit d'accès aux contenus réservés, vérifié côté serveur.
 * « none » : pas connecté, ou compte supprimé. « expired » : abonnement terminé.
 */
export async function getContentAccess(): Promise<"ok" | "none" | "expired"> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role === "admin") return "ok";
  if (role !== "stockiste" && role !== "partenaire") return "none";
  const expiresAt = await getSubscriptionExpiry(role, Number(session!.user.id));
  if (!expiresAt) return "none";
  return expiresAt.getTime() > Date.now() ? "ok" : "expired";
}
