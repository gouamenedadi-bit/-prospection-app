import { prisma } from "@/lib/prisma";

export const TRIAL_DAYS = 14;

export type PlanId = "1m" | "2m" | "3m" | "6m" | "12m";

export const PLANS: Record<PlanId, { label: string; days: number; amount: number }> = {
  "1m": { label: "1 mois", days: 30, amount: 500 },
  "2m": { label: "2 mois", days: 60, amount: 1000 },
  "3m": { label: "3 mois", days: 90, amount: 1500 },
  "6m": { label: "6 mois", days: 180, amount: 3000 },
  "12m": { label: "1 an", days: 365, amount: 5000 },
};

type AccountType = "stockiste" | "partenaire";

export async function getSubscriptionExpiry(accountType: AccountType, accountId: number) {
  if (accountType === "stockiste") {
    const s = await prisma.stockiste.findUnique({ where: { id: accountId }, select: { subscriptionExpiresAt: true } });
    return s?.subscriptionExpiresAt ?? null;
  }
  const p = await prisma.partenaire.findUnique({ where: { id: accountId }, select: { subscriptionExpiresAt: true } });
  return p?.subscriptionExpiresAt ?? null;
}

export async function activateSubscription(paymentId: number, validatedBy: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status !== "pending") {
    return { success: false, error: "Paiement introuvable ou déjà traité." };
  }

  const accountType = payment.accountType as AccountType;
  const currentExpiry = await getSubscriptionExpiry(accountType, payment.accountId);
  const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();
  const newExpiry = new Date(base.getTime() + payment.durationDays * 24 * 60 * 60 * 1000);

  if (accountType === "stockiste") {
    await prisma.stockiste.update({ where: { id: payment.accountId }, data: { subscriptionExpiresAt: newExpiry } });
  } else {
    await prisma.partenaire.update({ where: { id: payment.accountId }, data: { subscriptionExpiresAt: newExpiry } });
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "success", validatedBy },
  });

  return { success: true, newExpiry };
}
