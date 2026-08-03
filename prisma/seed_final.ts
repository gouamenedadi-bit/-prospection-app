import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const pdfProducts = [
  { name: "Arthemisin anti bacteria soap (savon anti bactérien Arthemisia)", pv: 2.5, partner: 2600, public: 3120, posology: "Toilette quotidienne (visage et corps).", description: "Savon exfoliant naturel antibactérien. Nettoie en profondeur et élimine les impuretés de la peau." },
  { name: "Arthemisin body wash (Gel de douche Arthemisia)", pv: 4.5, partner: 4500, public: 5400, posology: "Utilisation quotidienne sous la douche.", description: "Gel nettoyant aux extraits de plantes. Laisse la peau douce, hydratée et délicatement parfumée." },
  { name: "Arthemisin Conditioner", pv: 4.3, partner: 4500, public: 5400, posology: "Appliquer sur cheveux humides après le shampooing.", description: "Après-shampooing adoucissant pour des cheveux soyeux et faciles à coiffer." },
  { name: "Arthemisin hand wash (Gel de main Arthemisia)", pv: 1.5, partner: 2500, public: 3000, posology: "Lavage fréquent des mains.", description: "Gel nettoyant pour les mains, doux et respectueux de la peau." },
  { name: "Arthemisin Laundry soap (savon de linge Arthemisia)", pv: 2.5, partner: 2700, public: 3240, posology: "Pour le lavage du linge à la main ou en machine.", description: "Savon de lessive efficace contre les taches, respectueux des tissus." },
  { name: "Arthemisin liquid soap (Détergent Arthemisia)", pv: 4, partner: 6000, public: 7200, posology: "Pour l'entretien de la maison.", description: "Détergent liquide multi-usage, puissant et écologique." },
  { name: "Arthemisin mouthwash (bain de bouche Arthemisia)", pv: 3.4, partner: 3800, public: 4560, posology: "1 à 2 bains de bouche par jour après le brossage.", description: "Rafraîchit l'haleine et purifie la cavité buccale." },
  { name: "Arthemisin Shampoo (Shampooing Arthemisia)", pv: 4.3, partner: 4500, public: 5400, posology: "Lavage des cheveux 2 à 3 fois par semaine.", description: "Shampooing traitant doux et nourrissant. Élimine efficacement les pellicules et apaise le cuir chevelu." },
  { name: "Arthemisin Toothpaste (Pâte dentifrice Arthemisia) 120 g", pv: 2.1, partner: 2500, public: 3000, posology: "Brossage quotidien (matin et soir).", description: "Format pratique du soin dentaire. Protège les gencives et rafraîchit l'haleine." },
  { name: "Arthemisin Toothpaste (Pâte dentifrice Arthemisia) 200 g", pv: 3.8, partner: 4000, public: 4800, posology: "Brossage quotidien (matin et soir).", description: "Soin dentaire complet sans fluor. Protège les gencives et rafraîchit l'haleine." },
  { name: "Arthro SupReviver Tablets 60 comprimés", pv: 20, partner: 20000, public: 24000, posology: "3 gélules, 2 fois par jour.", description: "Soin spécifique pour les articulations douloureuses. Soulage l'arthrose et favorise la mobilité." },
  { name: "Berry Oil", pv: 30, partner: 30500, public: 36600, posology: "3 capsules par jour.", description: "Huile d'argousier riche en vitamines et oméga. Favorise la santé cardiovasculaire et la protection de la vue." },
  { name: "Body Relief Lotion (Lotion anti douleur)", pv: 1, partner: 1500, public: 1800, posology: "Massage local sur les zones douloureuses.", description: "Lotion apaisante et analgésique. Détend les muscles et soulage les douleurs articulaires." },
  { name: "Boisson énergétique à base de Cordyceps & Gingembre noir", pv: 2, partner: 2700, public: 3250, posology: "1 bouteille par jour selon le besoin d'énergie.", description: "Boisson tonifiante naturelle pour lutter contre la fatigue physique et mentale." },
  { name: "Brosse à dent", pv: 1, partner: 1100, public: 1320, posology: "Utilisation quotidienne, changer tous les 3 mois.", description: "Brosse à dents ergonomique pour un nettoyage efficace en douceur." },
  { name: "Calcium 160 comprimés", pv: 11, partner: 11000, public: 13500, posology: "1 comprimé 3 fois par jour.", description: "Complément en calcium facilement assimilable. Renforce les os, les dents et prévient l'ostéoporose." },
  { name: "Chaussures de Sport Energie Aplus Acupuncture", pv: 80, partner: 100000, public: 120000, posology: "Port quotidien.", description: "Chaussures de santé stimulant la microcirculation. Soulagent les douleurs plantaires et corrigent la posture." },
  { name: "Complément de fertilité Femme (MENGQIAN)", pv: 28, partner: 25000, public: 30000, posology: "2 gélules par jour.", description: "Complément spécifique pour la santé reproductive féminine. Régule le cycle et soutient la fertilité." },
  { name: "Complément de fertilité Homme (LIBAO)", pv: 28, partner: 25000, public: 30000, posology: "2 gélules par jour.", description: "Complément pour la santé reproductive masculine. Améliore les performances et la vitalité." },
  { name: "Comprimé Vitamine C à Sucer (Goût d'Orange)", pv: 8, partner: 10000, public: 12000, posology: "1 à 2 comprimés à sucer par jour.", description: "Source de vitamine C pour renforcer l'immunité et apporter de l'énergie au quotidien." },
  { name: "Cordyceps Militaris (60 capsules)", pv: 70, partner: 75000, public: 90000, posology: "1 capsule matin et soir.", description: "Puissant antibiotique naturel et stimulant immunitaire. Soutient les fonctions respiratoires et rénales." },
  { name: "Cordyceps Militaris café", pv: 4, partner: 5500, public: 7000, posology: "1 sachet par jour dans de l'eau chaude.", description: "Boisson stimulante enrichie en Cordyceps Militaris. Renforce l'énergie et améliore les défenses immunitaires." },
  { name: "Couche de bébé taille L / M / S / XL", pv: 4, partner: 7500, public: 9000, posology: "Utilisation quotidienne selon les besoins du bébé.", description: "Couches ultra-absorbantes et respirantes pour le confort et la peau sensible de bébé." },
  { name: "Crème à main réparatrice (100g)", pv: 3.5, partner: 3700, public: 4500, posology: "Appliquer sur les mains et masser doucement.", description: "Crème nourrissante pour réparer les mains sèches et abîmées." },
  { name: "Crème de bébé", pv: 3, partner: 3100, public: 3720, posology: "Application douce sur la peau de bébé après le bain.", description: "Crème hydratante et protectrice, spécialement formulée pour la peau délicate des bébés." },
  { name: "Déodorant Antitranspirant 50ml", pv: 3.5, partner: 3500, public: 4200, posology: "Application quotidienne sous les aisselles.", description: "Roll-on efficace sans résidus collants. Neutralise les odeurs corporelles tout en douceur." },
  { name: "Eau de toilette Femme \"Rencontre Miracle\"", pv: 15, partner: 17500, public: 21000, posology: "Vaporiser sur la peau ou les vêtements.", description: "Parfum féminin élégant et longue tenue pour une sensation de fraîcheur." },
  { name: "Eau de toilette Homme \"Rencontre Passion\"", pv: 15, partner: 17500, public: 21000, posology: "Vaporiser sur la peau ou les vêtements.", description: "Parfum masculin aux notes boisées et raffinées." },
  { name: "Gel de douche 300ml", pv: 6, partner: 6700, public: 8000, posology: "Utilisation quotidienne sous la douche.", description: "Gel nettoyant relaxant. Laisse la peau douce, hydratée et délicatement parfumée." },
  { name: "Gel désinfectant de main 100 ml", pv: 2, partner: 3100, public: 3720, posology: "Frictionner les mains jusqu'à séchage complet.", description: "Gel hydroalcoolique pour désinfecter les mains efficacement sans les dessécher." },
  { name: "Gobelet Alcalin", pv: 45, partner: 50000, public: 60000, posology: "Boire 1 à 2 litres d'eau alcaline par jour.", description: "Purificateur d'eau portable qui équilibre le pH. Transforme l'eau ordinaire en eau alcaline ionisée." },
  { name: "Huile de Bain Parfumée Golden Olive (1 L)", pv: 8, partner: 9000, public: 10800, posology: "Verser quelques gouttes dans l'eau du bain ou en massage.", description: "Huile d'olive pure pour hydrater la peau en profondeur et détendre le corps." },
  { name: "Kit Voyage", pv: 0.5, partner: 1000, public: 1200, posology: "Usage lors de vos déplacements.", description: "Trousse compacte contenant les essentiels d'hygiène pour vos voyages." },
  { name: "Lait de Corps à base de Placenta de Brebis 200ml", pv: 4, partner: 4500, public: 5400, posology: "Application quotidienne après le bain.", description: "Lait corporel hydratant enrichi au placenta de brebis. Répare, adoucit et protège l'épiderme." },
  { name: "Liqueur Puissante pour la Santé", pv: 9, partner: 13000, public: 15000, posology: "30 à 50ml le soir.", description: "Alternative fortifiante pour le bien-être général. Lutte contre la fatigue physique et mentale." },
  { name: "Lotion corporelle rajeunissante", pv: 3.8, partner: 4000, public: 4800, posology: "Application quotidienne sur tout le corps.", description: "Lotion hydratante anti-âge pour redonner fermeté et élasticité à la peau." },
  { name: "Marmite énergétique 24cm", pv: 170, partner: 184000, public: 220800, posology: "Cuisson des repas.", description: "Ustensile de cuisine innovant préservant les nutriments. Équilibre l'énergie des aliments pendant la cuisson." },
  { name: "Marmite énergétique 28cm", pv: 180, partner: 200000, public: 240000, posology: "Cuisson des repas.", description: "Ustensile de cuisine innovant grand format préservant les nutriments." },
  { name: "NutriVRich Vegefruit MINCEUR rose boisson instantanée", pv: 30, partner: 30500, public: 36000, posology: "1 sachet par jour mélangé à de l'eau.", description: "Boisson instantanée riche en vitamines et fibres, favorise la perte de poids." },
  { name: "NutriVRich Vegefruit NUTRITIVE boisson instantanée", pv: 30, partner: 30500, public: 36000, posology: "1 sachet par jour mélangé à de l'eau.", description: "Complément nutritionnel complet, idéal pour remplacer un repas ou booster l'apport en vitamines." },
  { name: "Parfum anti-moustique", pv: 3.5, partner: 3700, public: 4500, posology: "Vaporiser sur les vêtements ou la peau exposée.", description: "Spray protecteur naturel pour éloigner les moustiques et autres insectes." },
  { name: "Pâte Dentifrice au Thé Blanc 100g", pv: 3.5, partner: 2000, public: 2400, posology: "Brossage quotidien (matin et soir).", description: "Soin dentaire complet au thé blanc sans fluor. Protège les gencives et rafraîchit l'haleine." },
  { name: "Pâte Dentifrice au Thé Blanc 200g", pv: 3.5, partner: 3700, public: 4500, posology: "Brossage quotidien (matin et soir).", description: "Soin dentaire complet au thé blanc sans fluor. Format familial." },
  { name: "Poudre pour bébé", pv: 6, partner: 6500, public: 7800, posology: "Saupoudrer après le bain sur une peau sèche.", description: "Poudre de talc douce pour éviter les rougeurs et absorber l'humidité." },
  { name: "Power Bank", pv: 10, partner: 21000, public: 25200, posology: "Utilisation selon le besoin de charge.", description: "Batterie de secours haute capacité pour vos appareils mobiles." },
  { name: "Préservatif Longrich en latex de caoutchouc naturel (10 pcs)", pv: 4, partner: 5000, public: 6000, posology: "Usage unique.", description: "Préservatifs ultra-résistants et lubrifiés pour un maximum de confort et de sécurité." },
  { name: "Savon nettoyant au charbon de Bambou (100g x 3)", pv: 6, partner: 6200, public: 7500, posology: "Toilette quotidienne (visage et corps).", description: "Savon exfoliant naturel riche en antioxydants. Nettoie en profondeur et élimine les impuretés." },
  { name: "Senteur de bouche 15g", pv: 3, partner: 3100, public: 3700, posology: "1 à 2 pulvérisations dans la bouche au besoin.", description: "Rafraîchisseur d'haleine antibactérien de poche. Soigne les maux de gorge." },
  { name: "Shampooing au thé blanc", pv: 3.2, partner: 3200, public: 3840, posology: "Lavage régulier des cheveux.", description: "Shampooing doux enrichi au thé blanc, renforce la racine et revitalise le cuir chevelu." },
  { name: "Shampooing de bébé", pv: 6, partner: 6500, public: 7800, posology: "Lavage des cheveux de bébé.", description: "Formule ultra-douce qui ne pique pas les yeux, nettoie en respectant le cuir chevelu." },
  { name: "Shampooing Eclat 300ml", pv: 6, partner: 6500, public: 7800, posology: "Lavage régulier des cheveux.", description: "Redonne de la brillance et de la vitalité aux cheveux ternes." },
  { name: "Superbklean : Protège Slip Magnétique (16 packs)", pv: 50, partner: 52000, public: 62400, posology: "Utilisation quotidienne.", description: "Protège-slips respirants avec technologie aux anions. Assure fraîcheur et confort tout au long de la journée." },
  { name: "Superbklean : Serviette Hygiénique Magnétique (nuit 19 packs)", pv: 50, partner: 52000, public: 62400, posology: "Pendant la nuit lors des menstruations.", description: "Protection nocturne optimale avec anions pour prévenir les fuites et soulager les douleurs." },
  { name: "Superbklean : Serviette Hygiénique Magnétique(19 packs)", pv: 50, partner: 52000, public: 62400, posology: "Pendant les menstruations, changer régulièrement.", description: "Protection hygiénique jour à bande magnétique et anions. Prévient les infections." },
  { name: "Thé MINCEUR Body Curve Slimming Tea", pv: 5, partner: 6200, public: 7500, posology: "1 sachet infusé dans de l'eau chaude par jour.", description: "Thé amincissant qui aide à réguler le métabolisme et brûler les graisses." },
  { name: "Thé VERT Detoxification & Cleansing Tea", pv: 5, partner: 6200, public: 7500, posology: "1 sachet infusé dans de l'eau chaude par jour.", description: "Infusion détoxifiante pour nettoyer l'organisme et faciliter la digestion." },
  { name: "Thé TENSION Blood Pressue & Blood Fat Reducing", pv: 5, partner: 6200, public: 7500, posology: "1 sachet infusé dans de l'eau chaude par jour.", description: "Thé hypotenseur naturel qui aide à réguler la tension artérielle et le taux de lipides." },
  { name: "Vin Rouge-Ondes Rageuses", pv: 20, partner: 25000, public: 30000, posology: "Un demi-verre par jour.", description: "Vin rouge de santé aux extraits végétaux, favorise la circulation sanguine et la longévité." }
];

async function main() {
  console.log('Seeding products from PDF list WITH descriptions...');
  
  await prisma.produit.deleteMany({});
  
  for (const p of pdfProducts) {
    await prisma.produit.create({
      data: {
        name: p.name,
        pv: p.pv,
        partnerPrice: p.partner,
        publicPrice: p.public,
        description: p.description,
        posology: p.posology,
      },
    });
  }
  console.log('Finished seeding ' + pdfProducts.length + ' products with descriptions.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
