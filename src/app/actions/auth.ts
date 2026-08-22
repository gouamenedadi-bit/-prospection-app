"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { TRIAL_DAYS } from "@/lib/subscription";

function trialExpiryDate() {
  return new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

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

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "L'adresse email n'est pas valide." };
  }

  try {
    const existing = await prisma.stockiste.findUnique({ where: { email } });
    if (existing) {
      return { error: "Cet email est déjà utilisé par un autre compte." };
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
        subscriptionExpiresAt: trialExpiryDate(),
      },
    });

  } catch (error: unknown) {
    console.error("Erreur d'inscription:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur base de données";
    return { error: `Une erreur technique est survenue : ${errorMessage}` };
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

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "L'adresse email n'est pas valide." };
  }

  try {
    const existing = await prisma.partenaire.findUnique({ where: { email } });
    if (existing) {
      return { error: "Cet email est déjà utilisé par un autre compte." };
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
        subscriptionExpiresAt: trialExpiryDate(),
      },
    });

  } catch (error: unknown) {
    console.error("Erreur d'inscription:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur base de données";
    return { error: `Une erreur technique est survenue : ${errorMessage}` };
  }

  redirect("/login");
}
