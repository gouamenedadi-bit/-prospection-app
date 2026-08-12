import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  return { id: session.user.id, role: session.user.role as "stockiste" | "partenaire" };
}
