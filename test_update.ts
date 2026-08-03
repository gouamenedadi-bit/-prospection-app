import 'dotenv/config';
import { prisma } from './src/lib/prisma';
async function run() {
  try {
    const p = await prisma.produit.update({
      where: { id: 1 },
      data: {
        name: "Arthemisin anti bacteria soap",
        partnerPrice: 2600,
        publicPrice: 3120,
        description: "Desc",
        posology: "",
        pv: 2.5,
        image: null
      }
    });
    console.log("SUCCESS:", p);
  } catch(e: any) {
    console.error("ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
