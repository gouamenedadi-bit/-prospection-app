"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAccount, requireAdmin } from "@/lib/authz";
import { PLANS, PlanId, activateSubscription } from "@/lib/subscription";

export async function getMySubscriptionStatus() {
  try {
    const account = await getCurrentAccount();
    if (!account) {
      return { success: false, error: "Non authentifié." };
    }

    const expiresAt =
      account.role === "stockiste"
        ? (await prisma.stockiste.findUnique({ where: { id: Number(account.id) }, select: { subscriptionExpiresAt: true } }))?.subscriptionExpiresAt
        : (await prisma.partenaire.findUnique({ where: { id: Number(account.id) }, select: { subscriptionExpiresAt: true } }))?.subscriptionExpiresAt;

    if (!expiresAt) {
      return { success: false, error: "Compte introuvable." };
    }

    const now = new Date();
    const isExpired = expiresAt.getTime() <= now.getTime();
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

    return { success: true, expiresAt: expiresAt.toISOString(), isExpired, daysLeft };
  } catch (error) {
    console.error("Erreur getMySubscriptionStatus:", error);
    return { success: false, error: "Impossible de récupérer le statut de l'abonnement." };
  }
}

export async function initiatePayment(planId: PlanId) {
  const account = await getCurrentAccount();
  if (!account) {
    return { success: false, error: "Non authentifié." };
  }

  const plan = PLANS[planId];
  if (!plan) {
    return { success: false, error: "Forfait invalide." };
  }

  let payment;
  try {
    payment = await prisma.payment.create({
      data: {
        accountType: account.role,
        accountId: Number(account.id),
        planLabel: plan.label,
        durationDays: plan.days,
        amount: plan.amount,
        provider: "cinetpay",
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    return { success: false, error: "Impossible d'initier le paiement." };
  }

  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  if (apiKey && siteId) {
    const transactionRef = `sub-${payment.id}-${Date.now()}`;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    try {
      const res = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apikey: apiKey,
          site_id: siteId,
          transaction_id: transactionRef,
          amount: plan.amount,
          currency: "XOF",
          description: `Abonnement Prospections Longrich - ${plan.label}`,
          notify_url: `${baseUrl}/api/payment/cinetpay-webhook`,
          return_url: `${baseUrl}/abonnement?payment=return`,
          channels: "ALL",
        }),
      });
      const data = await res.json();

      if (data?.code === "201" && data?.data?.payment_url) {
        await prisma.payment.update({ where: { id: payment.id }, data: { transactionRef } });
        return { success: true, mode: "redirect" as const, paymentUrl: data.data.payment_url };
      }

      console.error("Réponse CinetPay inattendue:", data);
      return { success: false, error: "Impossible d'initier le paiement CinetPay." };
    } catch (error) {
      console.error("Erreur d'appel CinetPay:", error);
      return { success: false, error: "Erreur de connexion au service de paiement." };
    }
  }

  // Mode manuel : pas de clés CinetPay configurées.
  return {
    success: true,
    mode: "manual" as const,
    paymentId: payment.id,
    amount: plan.amount,
    planLabel: plan.label,
    supportContact: process.env.SUPPORT_CONTACT || "le support Prospections Longrich",
  };
}

export async function getPendingPayments() {
  try {
    await requireAdmin();

    const payments = await prisma.payment.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    const enriched = await Promise.all(
      payments.map(async (p) => {
        const name =
          p.accountType === "stockiste"
            ? (await prisma.stockiste.findUnique({ where: { id: p.accountId }, select: { name: true } }))?.name
            : (await prisma.partenaire.findUnique({ where: { id: p.accountId }, select: { firstName: true, lastName: true } }).then((r) => (r ? `${r.firstName} ${r.lastName}` : undefined)));
        return { ...p, accountName: name || `#${p.accountId}` };
      })
    );

    return { success: true, data: enriched };
  } catch (error) {
    console.error("Erreur getPendingPayments:", error);
    return { success: false, error: "Impossible de récupérer les paiements en attente." };
  }
}

export async function validatePayment(paymentId: number) {
  try {
    await requireAdmin();
    const result = await activateSubscription(paymentId, "admin");
    return result;
  } catch (error) {
    console.error("Erreur validatePayment:", error);
    return { success: false, error: "Impossible de valider le paiement." };
  }
}
