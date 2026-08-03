import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const pdfProducts = [
  { name: "Arthemisin anti bacteria soap (savon anti bactérien Arthemisia)", pv: 2.5, partner: 2600, public: 3120 },
  { name: "Arthemisin body wash (Gel de douche Arthemisia)", pv: 4.5, partner: 4500, public: 5400 },
  { name: "Arthemisin Conditioner", pv: 4.3, partner: 4500, public: 5400 },
  { name: "Arthemisin hand wash (Gel de main Arthemisia)", pv: 1.5, partner: 2500, public: 3000 },
  { name: "Arthemisin Laundry soap (savon de linge Arthemisia)", pv: 2.5, partner: 2700, public: 3240 },
  { name: "Arthemisin liquid soap (Détergent Arthemisia)", pv: 4, partner: 6000, public: 7200 },
  { name: "Arthemisin mouthwash (bain de bouche Arthemisia)", pv: 3.4, partner: 3800, public: 4560 },
  { name: "Arthemisin Shampoo (Shampooing Arthemisia)", pv: 4.3, partner: 4500, public: 5400 },
  { name: "Arthemisin Toothpaste (Pâte dentifrice Arthemisia) 120 g", pv: 2.1, partner: 2500, public: 3000 },
  { name: "Arthemisin Toothpaste (Pâte dentifrice Arthemisia) 200 g", pv: 3.8, partner: 4000, public: 4800 },
  { name: "Arthro SupReviver Tablets 60 comprimés", pv: 20, partner: 20000, public: 24000 },
  { name: "Berry Oil", pv: 30, partner: 30500, public: 36600 },
  { name: "Body Relief Lotion (Lotion anti douleur)", pv: 1, partner: 1500, public: 1800 },
  { name: "Boisson énergétique à base de Cordyceps & Gingembre noir", pv: 2, partner: 2700, public: 3250 },
  { name: "Brosse à dent", pv: 1, partner: 1100, public: 1320 },
  { name: "Calcium 160 comprimés", pv: 11, partner: 11000, public: 13500 },
  { name: "Chaussures de Sport Energie Aplus Acupuncture", pv: 80, partner: 100000, public: 120000 },
  { name: "Complément de fertilité Femme (MENGQIAN)", pv: 28, partner: 25000, public: 30000 },
  { name: "Complément de fertilité Homme (LIBAO)", pv: 28, partner: 25000, public: 30000 },
  { name: "Comprimé Vitamine C à Sucer (Goût d'Orange)", pv: 8, partner: 10000, public: 12000 },
  { name: "Cordyceps Militaris (60 capsules)", pv: 70, partner: 75000, public: 90000 },
  { name: "Cordyceps Militaris café", pv: 4, partner: 5500, public: 7000 },
  { name: "Couche de bébé taille L / M / S / XL", pv: 4, partner: 7500, public: 9000 },
  { name: "Crème à main réparatrice (100g)", pv: 3.5, partner: 3700, public: 4500 },
  { name: "Crème de bébé", pv: 3, partner: 3100, public: 3720 },
  { name: "Déodorant Antitranspirant 50ml", pv: 3.5, partner: 3500, public: 4200 },
  { name: "Eau de toilette Femme \"Rencontre Miracle\"", pv: 15, partner: 17500, public: 21000 },
  { name: "Eau de toilette Homme \"Rencontre Passion\"", pv: 15, partner: 17500, public: 21000 },
  { name: "Gel de douche 300ml", pv: 6, partner: 6700, public: 8000 },
  { name: "Gel désinfectant de main 100 ml", pv: 2, partner: 3100, public: 3720 },
  { name: "Gobelet Alcalin", pv: 45, partner: 50000, public: 60000 },
  { name: "Huile de Bain Parfumée Golden Olive (1 L)", pv: 8, partner: 9000, public: 10800 },
  { name: "Kit Voyage", pv: 0.5, partner: 1000, public: 1200 },
  { name: "Lait de Corps à base de Placenta de Brebis 200ml", pv: 4, partner: 4500, public: 5400 },
  { name: "Liqueur Puissante pour la Santé", pv: 9, partner: 13000, public: 15000 },
  { name: "Lotion corporelle rajeunissante", pv: 3.8, partner: 4000, public: 4800 },
  { name: "Marmite énergétique 24cm", pv: 170, partner: 184000, public: 220800 },
  { name: "Marmite énergétique 28cm", pv: 180, partner: 200000, public: 240000 },
  { name: "NutriVRich Vegefruit MINCEUR rose boisson instantanée", pv: 30, partner: 30500, public: 36000 },
  { name: "NutriVRich Vegefruit NUTRITIVE boisson instantanée", pv: 30, partner: 30500, public: 36000 },
  { name: "Parfum anti-moustique", pv: 3.5, partner: 3700, public: 4500 },
  { name: "Pâte Dentifrice au Thé Blanc 100g", pv: 3.5, partner: 2000, public: 2400 },
  { name: "Pâte Dentifrice au Thé Blanc 200g", pv: 3.5, partner: 3700, public: 4500 },
  { name: "Poudre pour bébé", pv: 6, partner: 6500, public: 7800 },
  { name: "Power Bank", pv: 10, partner: 21000, public: 25200 },
  { name: "Préservatif Longrich en latex de caoutchouc naturel (10 pcs)", pv: 4, partner: 5000, public: 6000 },
  { name: "Savon nettoyant au charbon de Bambou (100g x 3)", pv: 6, partner: 6200, public: 7500 },
  { name: "Senteur de bouche 15g", pv: 3, partner: 3100, public: 3700 },
  { name: "Shampooing au thé blanc", pv: 3.2, partner: 3200, public: 3840 },
  { name: "Shampooing de bébé", pv: 6, partner: 6500, public: 7800 },
  { name: "Shampooing Eclat 300ml", pv: 6, partner: 6500, public: 7800 },
  { name: "Superbklean : Protège Slip Magnétique (16 packs)", pv: 50, partner: 52000, public: 62400 },
  { name: "Superbklean : Serviette Hygiénique Magnétique (nuit 19 packs)", pv: 50, partner: 52000, public: 62400 },
  { name: "Superbklean : Serviette Hygiénique Magnétique(19 packs)", pv: 50, partner: 52000, public: 62400 },
  { name: "Thé MINCEUR Body Curve Slimming Tea", pv: 5, partner: 6200, public: 7500 },
  { name: "Thé VERT Detoxification & Cleansing Tea", pv: 5, partner: 6200, public: 7500 },
  { name: "Thé TENSION Blood Pressue & Blood Fat Reducing", pv: 5, partner: 6200, public: 7500 },
  { name: "Vin Rouge-Ondes Rageuses", pv: 20, partner: 25000, public: 30000 }
];

async function main() {
  console.log('Seeding products from PDF list...');
  
  // Wipe all existing products to recreate from PDF cleanly
  await prisma.produit.deleteMany({});
  
  for (const p of pdfProducts) {
    await prisma.produit.create({
      data: {
        name: p.name,
        pv: p.pv,
        partnerPrice: p.partner,
        publicPrice: p.public,
        description: "",
        posology: "",
      },
    });
  }
  console.log('Finished seeding ' + pdfProducts.length + ' products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
