import 'dotenv/config';
import { prisma } from './src/lib/prisma';
async function run() {
  try {
    const data = {
      name: "Arthemisin anti bacteria soap (savon anti bactérien Arthemisia)",
      partnerPrice: 2600,
      publicPrice: 3120,
      description: "Savon exfoliant naturel antibactérien. Nettoie en profondeur et élimine les impuretés de la peau.",
      posology: "",
      pv: 2.5,
      imageUrl: null
    };
    const { imageUrl, ...restData } = data;
    const product = await prisma.produit.update({
      where: { id: 59 },
      data: {
        ...restData,
        image: imageUrl,
      },
    });
    console.log("SUCCESS");
  } catch (error: any) {
    console.error("ERROR:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
