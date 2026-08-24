"use server";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string, role: "stockiste" | "partenaire") {
  try {
    const account =
      role === "stockiste"
        ? await prisma.stockiste.findUnique({ where: { email } })
        : await prisma.partenaire.findUnique({ where: { email } });

    if (account) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(token);

      await prisma.passwordResetToken.create({
        data: {
          accountType: role,
          accountId: account.id,
          tokenHash,
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&role=${role}`;
      const name = role === "stockiste" ? (account as { name: string }).name : (account as { firstName: string }).firstName;

      await sendEmail({
        to: email,
        subject: "Réinitialisation de votre mot de passe — Prospections Longrich",
        html: `<p>Bonjour ${name},</p><p>Vous avez demandé à réinitialiser votre mot de passe sur Prospections Longrich.</p><p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a> (lien valable 1 heure).</p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
      });
    }

    // Réponse générique dans tous les cas, pour ne pas révéler si l'email existe en base.
    return { success: true };
  } catch (error) {
    console.error("Erreur requestPasswordReset:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function resetPassword(token: string, role: "stockiste" | "partenaire", newPassword: string) {
  try {
    if (newPassword.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    const tokenHash = hashToken(token);
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.accountType !== role || record.usedAt || record.expiresAt < new Date()) {
      return { success: false, error: "Ce lien est invalide ou a expiré. Merci de refaire une demande." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (role === "stockiste") {
      await prisma.stockiste.update({ where: { id: record.accountId }, data: { password: hashedPassword } });
    } else {
      await prisma.partenaire.update({ where: { id: record.accountId }, data: { password: hashedPassword } });
    }

    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

    return { success: true };
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return { success: false, error: "Une erreur est survenue." };
  }
}
