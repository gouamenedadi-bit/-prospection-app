"use server";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { normalizeEmail } from "@/lib/normalize";

const TOKEN_TTL_MS = 60 * 60 * 1000;
const ADMIN_ACCOUNT_TYPE = "admin";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestAdminPasswordReset(email: string) {
  try {
    const admin = await prisma.admin.findFirst({
      where: { email: { equals: normalizeEmail(email), mode: "insensitive" } },
    });

    if (admin) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(token);

      await prisma.passwordResetToken.create({
        data: {
          accountType: ADMIN_ACCOUNT_TYPE,
          accountId: admin.id,
          tokenHash,
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;

      await sendEmail({
        to: admin.email,
        subject: "Réinitialisation de l'accès administrateur — Prospections Longrich",
        html: `<p>Vous avez demandé à réinitialiser l'accès administrateur de Prospections Longrich.</p><p><a href="${resetUrl}">Cliquez ici pour choisir un nouvel email et un nouveau mot de passe</a> (lien valable 1 heure).</p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
      });
    }

    // Réponse générique dans tous les cas, pour ne pas révéler si l'email existe en base.
    return { success: true };
  } catch (error) {
    console.error("Erreur requestAdminPasswordReset:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function resetAdminCredentials(token: string, newEmail: string, newPassword: string) {
  try {
    const email = normalizeEmail(newEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "L'adresse email n'est pas valide." };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    const tokenHash = hashToken(token);
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.accountType !== ADMIN_ACCOUNT_TYPE || record.usedAt || record.expiresAt < new Date()) {
      return { success: false, error: "Ce lien est invalide ou a expiré. Merci de refaire une demande." };
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing && existing.id !== record.accountId) {
      return { success: false, error: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: record.accountId },
      data: { email, password: hashedPassword },
    });

    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

    return { success: true };
  } catch (error) {
    console.error("Erreur resetAdminCredentials:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}
