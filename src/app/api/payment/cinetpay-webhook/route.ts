import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activateSubscription } from "@/lib/subscription";

// CinetPay appelle cette URL pour notifier un paiement. On ne fait jamais
// confiance au payload brut : on revérifie le statut réel via l'API
// "Check Payment Status" de CinetPay avant de créditer quoi que ce soit.
export async function POST(req: NextRequest) {
  try {
    const body = await req.formData().catch(() => null);
    const transactionRef = (body?.get("cpm_trans_id") as string) || (body?.get("transaction_id") as string) || "";

    if (!transactionRef) {
      return NextResponse.json({ received: true });
    }

    const apiKey = process.env.CINETPAY_API_KEY;
    const siteId = process.env.CINETPAY_SITE_ID;
    if (!apiKey || !siteId) {
      return NextResponse.json({ received: true });
    }

    const checkRes = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apikey: apiKey, site_id: siteId, transaction_id: transactionRef }),
    });
    const checkData = await checkRes.json();

    if (checkData?.data?.status === "ACCEPTED") {
      const payment = await prisma.payment.findUnique({ where: { transactionRef } });
      if (payment && payment.status === "pending") {
        await activateSubscription(payment.id, "cinetpay_webhook");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook CinetPay:", error);
    return NextResponse.json({ received: true });
  }
}
