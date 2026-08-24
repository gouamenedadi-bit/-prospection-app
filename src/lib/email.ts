const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Prospections Longrich <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) {
    console.log(`[email non envoyé - RESEND_API_KEY absente] À: ${to} | Sujet: ${subject}\n${html}`);
    return { success: false, configured: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      console.error("Erreur envoi email Resend:", await res.text());
      return { success: false, configured: true };
    }

    return { success: true, configured: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, configured: true };
  }
}
