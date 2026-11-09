import { readFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Le PDF est hors de `public/` : seul ce point d'accès, réservé aux comptes connectés, le distribue.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Connectez-vous pour télécharger le guide.", { status: 401 });
  }

  try {
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
