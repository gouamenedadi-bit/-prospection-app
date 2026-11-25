import { getPublicAvis } from "@/app/actions/avis";
import { prisma } from "@/lib/prisma";
import Presentation from "./PresentationClient";

export const dynamic = "force-dynamic";

export default async function PresentationPage() {
  const res = await getPublicAvis();
  const avis = res.success && res.data ? res.data : [];
  const userCount = await countUsers();

  return <Presentation avis={avis} userCount={userCount} />;
}

// Personnes réellement inscrites (partenaires + stockistes). Masqué si la base ne répond pas.
async function countUsers(): Promise<number | null> {
  try {
    const [partenaires, stockistes] = await Promise.all([prisma.partenaire.count(), prisma.stockiste.count()]);
    return partenaires + stockistes;
  } catch (error) {
    console.error("Erreur comptage utilisateurs:", error);
    return null;
  }
}
