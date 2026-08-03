import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { productsList } from '../src/data/products';

async function main() {
  console.log('Seeding products...');
  await prisma.produit.deleteMany({});
  for (const p of productsList) {
    const partnerPrice = parseFloat(p.partner.replace(/\s/g, ''));
    const publicPrice = parseFloat(p.public.replace(/\s/g, ''));
    const pv = parseFloat(p.pv);

    // check if it exists so we don't duplicate on multiple seeds, but update missing fields
    const existing = await prisma.produit.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.produit.create({
        data: {
          name: p.name,
          description: p.description,
          posology: p.posology,
          partnerPrice,
          publicPrice,
          pv,
        },
      });
    } else {
      await prisma.produit.update({
        where: { id: existing.id },
        data: {
          description: p.description,
          posology: p.posology,
          partnerPrice,
          publicPrice,
          pv,
        }
      });
    }
  }
  console.log('Finished seeding products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
