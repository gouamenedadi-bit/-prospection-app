"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerStockiste(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const city = formData.get("city") as string;
  const commune = formData.get("commune") as string;
  const neighborhood = formData.get("neighborhood") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password || !phone) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  try {
    const existing = await prisma.stockiste.findUnique({ where: { email } });
    if (existing) {
      return { error: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.stockiste.create({
      data: {
        name,
        phone,
        email,
        city,
        commune,
        neighborhood,
        password: hashedPassword,
      },
    });

  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return { error: "Une erreur est survenue lors de l'inscription." };
  }

  redirect("/login");
}

export async function registerPartenaire(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const sponsorCode = formData.get("sponsorCode") as string;
  const city = formData.get("city") as string;
  const commune = formData.get("commune") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password || !phone) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  try {
    const existing = await prisma.partenaire.findUnique({ where: { email } });
    if (existing) {
      return { error: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.partenaire.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        sponsorCode,
        city,
        commune,
        password: hashedPassword,
      },
    });

  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return { error: "Une erreur est survenue lors de l'inscription." };
  }

  redirect("/login");
}
