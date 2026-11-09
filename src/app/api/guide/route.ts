import { readFile } from "fs/promises";
import path from "path";
import { getContentAccess } from "@/lib/authz";

// Le PDF est hors de `public/` : seul ce point d'accès, réservé aux abonnements actifs, le distribue.
export async function GET() {
  try {
    const access = await getContentAccess();
    if (access === "none") {
      return new Response("Connectez-vous pour télécharger le guide.", { status: 401 });
    }
    if (access === "expired") {
      return new Response("Votre abonnement est terminé. Renouvelez-le pour télécharger le guide.", { status: 403 });
    }

    const file = await readFile(path.join(process.cwd(), "private", "guide-prospections-longrich.pdf"));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Guide-Prospections-Longrich.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Erreur guide:", error);
    return new Response("Le guide n'est pas disponible pour le moment.", { status: 500 });
  }
}
