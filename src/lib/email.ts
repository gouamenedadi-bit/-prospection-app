import { cleanEnvValue } from "@/lib/env";

type EmailInput = { to: string; subject: string; html: string };
type EmailResult = { success: boolean; configured: boolean; provider?: "brevo" | "resend" };

const DEFAULT_SENDER_NAME = "Prospections Longrich";

// Brevo : il suffit d'une adresse d'expédition validée dans Brevo (pas besoin de domaine).
async function sendWithBrevo(apiKey: string, { to, subject, html }: EmailInput): Promise<EmailResult> {
  const senderEmail = cleanEnvValue(process.env.BREVO_SENDER_EMAIL);
  const senderName = cleanEnvValue(process.env.BREVO_SENDER_NAME) || DEFAULT_SENDER_NAME;

  if (!senderEmail) {
    console.error("[email] BREVO_SENDER_EMAIL manquant : indiquez l'adresse d'expédition validée dans Brevo.");
    return { success: false, configured: false, provider: "brevo" };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    console.error(`[email] Brevo a refusé l'envoi (${res.status}) :`, await res.text());
    return { success: false, configured: true, provider: "brevo" };
  }
  return { success: true, configured: true, provider: "brevo" };
}

// Resend : nécessite un domaine vérifié pour écrire à d'autres adresses que celle du compte.
async function sendWithResend(apiKey: string, { to, subject, html }: EmailInput): Promise<EmailResult> {
  const fromEmail = cleanEnvValue(process.env.RESEND_FROM_EMAIL) || `${DEFAULT_SENDER_NAME} <onboarding@resend.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: fromEmail, to, subject, html }),
  });

  if (!res.ok) {
    console.error(`[email] Resend a refusé l'envoi (${res.status}) :`, await res.text());
    return { success: false, configured: true, provider: "resend" };
  }
  return { success: true, configured: true, provider: "resend" };
}

/**
 * Envoie un email transactionnel. Brevo est utilisé si BREVO_API_KEY est défini,
 * sinon Resend. Le contenu n'est jamais écrit dans les logs : il peut contenir
 * un lien de réinitialisation de mot de passe.
 */
export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  const brevoKey = cleanEnvValue(process.env.BREVO_API_KEY);
  const resendKey = cleanEnvValue(process.env.RESEND_API_KEY);

  try {
    if (brevoKey) return await sendWithBrevo(brevoKey, input);
    if (resendKey) return await sendWithResend(resendKey, input);
  } catch (error) {
    console.error("[email] Erreur réseau pendant l'envoi :", error);
    return { success: false, configured: true };
  }

  console.warn(`[email] Aucun service d'envoi configuré (BREVO_API_KEY ou RESEND_API_KEY). Email non envoyé : « ${input.subject} ».`);
  return { success: false, configured: false };
}
