import { getPublicAvis } from "@/app/actions/avis";
import Presentation from "./PresentationClient";

export const dynamic = "force-dynamic";

export default async function PresentationPage() {
  const res = await getPublicAvis();
  const avis = res.success && res.data ? res.data : [];

  return <Presentation avis={avis} />;
}
