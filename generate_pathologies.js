const fs = require('fs');

const pathData = [
  ["Infertilité masculine / Éjaculation précoce", "Mauvaise alimentation, manque de sports, utilisation de lubrifiants, drogues.", "4 gélules la nuit", [
    ["Libao", "28", "30 000", "36 000"],
    ["NutriVrich bleu ou rose", "20", "15 000", "18 000"],
    ["Cordyceps militaris", "60", "35 000", "40 000"],
    ["Café cordyceps", "5", "6 000", "7 500"],
    ["Liqueur", "20", "18 000", "22 000"]
  ]],
  ["Impuissance sexuelle, faiblesse sexuelle", "Baisse du taux de testostérone, diminution de l'érection, anxiété, hypertension.", "1 gélule 2 fois par jour", [
    ["Cordyceps militaris", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Libao", "28", "30 000", "36 000"]
  ]],
  ["Système immunitaire faible", "Alcool, cigarette, manque de sports, déshydratation.", "Quotidien", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Infection de l'oreille", "Germes divers.", "1 gél. 2 fois /J", [
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Parkinson", "Gènes anormaux.", "Quotidien", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Arthro", "20", "15 000", "18 000"]
  ]],
  ["Hypertension", "Cigarette, alcool, manque de sports, vieillissement, infection rénale.", "1/J", [
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Calcium", "5", "6 000", "7 500"],
    ["Gobelet", "45", "25 000", "30 000"],
    ["Thé tension", "5", "5 500", "7 000"]
  ]],
  ["Hypotension", "Déshydratation, muscle cardiaque affaibli, médication.", "Quotidien", [
    ["NutriV Blue", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Gobelet", "45", "25 000", "30 000"]
  ]],
  ["Thyroïde / Goitre", "Hyperthyroïdisme, carence en iode.", "2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"]
  ]],
  ["Cancer", "Prédisposition génétique, style de vie, cigarette.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Toux / Bronchite", "Infections des poumons, asthme, bronchite, pneumonie.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Parfum de bouche", "1", "2 000", "2 500"]
  ]],
  ["Diarrhée", "Virus intestinaux.", "1gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Cataracte", "Protéines rendant les lentilles nuageuses.", "1 gel. 2 fois/J", [
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Cicatrices", "Processus normal de cicatrisation.", "2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Lait de corps", "3.5", "4 000", "5 000"]
  ]],
  ["Abcès", "Système immunitaire faible, mauvaise hygiène, diabète.", "Chaque jour", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Vieillissement", "Stress, corps acide.", "Quotidien", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["NutriV Rose", "20", "15 000", "18 000"]
  ]],
  ["Maladies de la peau", "Exposition au soleil, manque d'eau, bactéries, alcool.", "Quotidien", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Lait de corps", "3.5", "4 000", "5 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"]
  ]],
  ["Perte des cheveux", "Eau non minéralisée, maladies immunitaires.", "Utilisation quotidienne", [
    ["Shampooing", "4", "4 500", "5 500"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["NutriV rose", "20", "15 000", "18 000"]
  ]],
  ["Mal de tête", "Trouble de la structure qui ressent la douleur.", "Quotidien", [
    ["Calcium", "5", "6 000", "7 500"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Gobelet", "45", "25 000", "30 000"]
  ]],
  ["Migraine", "Médication, facteur physique, trouble du sommeil.", "Chaque jour", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Gobelet", "45", "25 000", "30 000"]
  ]],
  ["Stérilité féminine", "Troubles de l'ovulation, trouble hormonal, ovaires couturés, ménopause prématurée.", "Suivre les instructions (hors règles).", [
    ["Mengqian", "28", "30 000", "36 000"],
    ["Protège slip", "5", "3 500", "4 500"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Insuffisance rénale", "Facteur génétique, obésité, diabète, taux de graisse élevé.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Maladies cardio-vasculaires", "Régime pauvre, stress, facteur génétique.", "1 gel. 2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Hépatite (foie)", "Abus de l'alcool, hépatite infectieuse.", "Chaque jour", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Mauvaises Odeurs corporelles", "Bactérie causée par la saleté.", "Utilisation quotidienne", [
    ["Déodorant", "2", "2 500", "3 000"],
    ["Savon au charbon de bambou", "5", "12 000", "15 000"]
  ]],
  ["Anémie", "Réduction de la production des globules rouges.", "1 gel. 2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Calcium", "5", "6 000", "7 500"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Tuberculose", "Bactéries.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Leucémie (cancer du sang)", "Cause inconnue, cigarettes, radiation.", "Quotidien", [
    ["NutirV rose", "20", "15 000", "18 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Libao", "28", "30 000", "36 000"]
  ]],
  ["Cancer de la prostate", "Age, mode de vie, obésité, mauvaise alimentation.", "Quotidien", [
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Thé tension", "5", "5 500", "7 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Septicité", "Bactérie causant l'appendicite, pneumonie.", "Quotidien", [
    ["Arthro", "20", "15 000", "18 000"],
    ["NutriVrose", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Cancer du sein", "Fibroedema, Kystes.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Attaque cardiaque", "Diabète, problème cardiaque, cholestérol.", "Quotidien", [
    ["Arthro", "20", "15 000", "18 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Fibrome", "Prédisposition génétique, faible taux d'œstrogène.", "1-2 fois/J", [
    ["Protège slip", "5", "3 500", "4 500"],
    ["Serviette hygiénique", "5", "3 500", "4 500"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Infection vaginale par les levures", "Candidoses, utilisation d'antibiotiques.", "1 gel. 2 fois/J", [
    ["Protège slip", "5", "3 500", "4 500"],
    ["Serviette hygiénique", "5", "3 500", "4 500"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Douleurs corporelles", "Tension musculaire, sollicitation abusive.", "Quotidien", [
    ["Liqueur", "20", "18 000", "22 000"],
    ["Arthro", "20", "15 000", "18 000"],
    ["Calcium", "5", "6 000", "7 500"],
    ["Protège slip", "5", "3 500", "4 500"]
  ]],
  ["Perte d'appétit", "Réduction du désir pour la nourriture, bactéries.", "Quotidien", [
    ["Parfum de bouche", "1", "2 000", "2 500"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Mauvaise haleine", "Bouche sale, nourriture décomposée, maladies.", "Matin et soir", [
    ["Parfum de bouche", "1", "2 000", "2 500"],
    ["Pâte dentifrice", "3.5", "3 500", "4 200"],
    ["Calcium", "5", "6 000", "7 500"]
  ]],
  ["Furoncle", "Diabète, trouble du système immunitaire.", "1 gel. 2 fois/J", [
    ["Protège slip", "5", "3 500", "4 500"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Savon au charbon de bambou", "5", "12 000", "15 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Abcès des poumons", "Alcool, sécrétion gastrique.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Diarrhée virale", "Maladie, grippe intestinale, médication.", "Quotidien", [
    ["Nutiv rich rose ou bleu", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Colique", "Gaz intestinaux, augmentation du niveau d'hormone.", "1 gel. 2 fois/J", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Diarrhée du voyageur", "Nourriture contaminée ou empoisonnée.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Inflammation du colon", "Inflammation extérieure, activation anormale du système immunitaire.", "3 gel. 2 fois/J", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"]
  ]],
  ["Problème digestif", "Infection parasitaire et bactériale.", "3 gel. 2 fois/J", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"]
  ]],
  ["Maladie de Crohn", "Bactérie et virus, cigarette.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"]
  ]],
  ["Varicelle", "Virus de herpes zoster.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Cancer de l'estomac", "Genre, région, groupe sanguin, exposition aux produits miniers.", "1 gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["NutriV rose", "20", "15 000", "18 000"]
  ]],
  ["Trouble du larynx", "Infection virale qui affecte les nerfs, tumeurs.", "3 gel. 2 fois/J", [
    ["Nutriv Bleu", "20", "15 000", "18 000"],
    ["Parfum de bouche", "1", "2 000", "2 500"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"]
  ]],
  ["Maladie de la vésicule biliaire", "Hypothyroïdisme, maladie d'Hashimoto.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Arthro", "20", "15 000", "18 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Dysenterie", "Bactérie ou protozoaire, infestation des vers.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["The tension", "5", "5 500", "7 000"],
    ["Gobelet", "45", "25 000", "30 000"]
  ]],
  ["Dermatose", "Trichophyton, microspores.", "1 gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Grippe", "Virus de la grippe.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Insomnie", "Emotion (stress, anxiété, dépression), hypertension.", "3 gel. 2fois/J", [
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Mengqian", "28", "30 000", "36 000"],
    ["Calcium", "5", "6 000", "7 500"]
  ]],
  ["Infection respiratoire", "Virus et bactéries.", "Quotidien", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Parfum de bouche", "1", "2 000", "2 500"]
  ]],
  ["Taux élevé de cholestérol", "Régime alimentaire, obésité, âge.", "Quotidien", [
    ["NutriV rose", "20", "15 000", "18 000"],
    ["The tension", "5", "5 500", "7 000"],
    ["The minceur", "5", "5 500", "7 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Cholera", "Eau ou nourriture infectée.", "1 gel. 2 fois/J", [
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"]
  ]],
  ["Eczéma", "Certaines personnes naissent avec, exposition environnementale.", "3 gel. 2fois/J", [
    ["Gobelet", "45", "25 000", "30 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["BerryOil", "20", "15 000", "18 000"],
    ["Lait de corps", "3.5", "4 000", "5 000"],
    ["Savon", "5", "12 000", "15 000"],
    ["Calcium", "5", "6 000", "7 500"]
  ]],
  ["Carie dentaire", "Plaque dentaire, régime alimentaire.", "Matin/soir", [
    ["Pâte dentifrice", "3.5", "3 500", "4 200"],
    ["Calcium", "5", "6 000", "7 500"],
    ["Parfum de bouche", "1", "2 000", "2 500"]
  ]],
  ["Toux chronique", "Asthme, médicament contre l'hypertension.", "Quotidien", [
    ["Parfum de bouche", "1", "2 000", "2 500"],
    ["Gobelet", "45", "25 000", "30 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV rose", "20", "15 000", "18 000"]
  ]],
  ["Dépression", "Facteur psychologique, prédisposition génétique.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["The vert", "5", "5 500", "7 000"],
    ["Calcium", "5", "6 000", "7 500"]
  ]],
  ["Toxines de l'organisme", "L'eau ou nourriture, produits chimiques, air.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["The vert", "5", "5 500", "7 000"],
    ["Gobelet", "45", "25 000", "30 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"]
  ]],
  ["Vertiges", "Troubles de l'oreille, maladie de Meniere, migraine.", "3gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"]
  ]],
  ["Fièvre", "Virus, bactérie, fongique.", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"],
    ["Thé tension", "5", "5 500", "7 000"]
  ]],
  ["Règles douloureuses", "Ovaires ou utérus anormal, fibrome, IST.", "Période de menstrues", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["The tension", "5", "5 500", "7 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Protège slip", "5", "3 500", "4 500"],
    ["Serviette hygiénique", "5", "3 500", "4 500"]
  ]],
  ["Fatigue générale / Léthargie", "Maladies métaboliques, maladies rénales.", "3 gel. 2 fois /J", [
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Arthro Sup reviver", "20", "15 000", "18 000"]
  ]],
  ["Fracture", "Ostéoporoses, blessures liées au sport.", "3 comp. 2fois/J", [
    ["Calcium", "5", "6 000", "7 500"],
    ["Arthro Sup reviver", "20", "15 000", "18 000"],
    ["Bone M", "20", "15 000", "18 000"]
  ]],
  ["Malnutrition", "Manque de nourriture, excès de calories.", "1 gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"]
  ]],
  ["Déséquilibre hormonal", "Médication, grossesse, menstrues.", "3 gel. 2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Mengqian", "28", "30 000", "36 000"]
  ]],
  ["SIDA", "VIH", "Quotidien", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Gobelet", "45", "25 000", "30 000"]
  ]],
  ["Ménopause Précoce", "Maladie thyroïdienne, chimiothérapie.", "3 gel. 2 fois/J", [
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Protège slip", "5", "3 500", "4 500"]
  ]],
  ["Dépression nerveuse", "Stress, anxiété, abus d'alcool.", "3 gel. 2 fois/J", [
    ["Berry oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["NutriV rose", "20", "15 000", "18 000"]
  ]],
  ["Pneumonie", "Infection des poumons causée par les bactéries.", "1 gel. 2fois/J", [
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Thé tension", "5", "5 500", "7 000"],
    ["Gobelet alcalin", "45", "25 000", "30 000"]
  ]],
  ["Lipome", "Hérédité, blessure bénigne.", "3 gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"],
    ["Berry oil", "20", "15 000", "18 000"],
    ["Protège slip", "5", "3 500", "4 500"]
  ]],
  ["Hypoglycémie", "Sauter les repas, exercices physiques intenses.", "3 gel. 2 fois/J", [
    ["Bone M", "20", "15 000", "18 000"],
    ["NutriV Bleu", "20", "15 000", "18 000"],
    ["Arthro", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"]
  ]],
  ["Ostéoporose", "Prédisposition génétique, malnutrition.", "3 comp. 2fois/J", [
    ["Bone M", "20", "15 000", "18 000"],
    ["NutriV bleu", "20", "15 000", "18 000"],
    ["Arthro SupReviver", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"]
  ]],
  ["Battement cardiaque irrégulier", "Hypertension, maladie coronaire.", "3 gel. 2 fois/J", [
    ["Thé tension", "5", "5 500", "7 000"],
    ["NutriV rose", "20", "15 000", "18 000"],
    ["Berry Oil", "20", "15 000", "18 000"],
    ["Cordyceps", "60", "35 000", "40 000"]
  ]],
  ["Troubles auditifs", "Age avancé, bruits, traumatisme.", "1gel. 2 fois/J", [
    ["Cordyceps", "60", "35 000", "40 000"]
  ]]
];

const pathologiesList = pathData.map((p, i) => {
  const globalPosology = p[2];
  return {
    id: "p" + (i + 1),
    name: p[0],
    description: p[1],
    posology: globalPosology,
    products: p[3].map(prod => {
      let prodDosage = globalPosology;
      const isGeneric = /quotidien|chaque jour/i.test(globalPosology);
      const prodName = prod[0].toLowerCase();
      
      if (isGeneric) {
        if (prodName.includes('cordyceps') || prodName.includes('berry oil') || prodName.includes('nutriv') || prodName.includes('libao') || prodName.includes('mengqian') || prodName.includes('arthro') || prodName.includes('calcium') || prodName.includes('bone m')) {
          prodDosage = "2 gélules 2 fois par jour";
        } else if (prodName.includes('gobelet')) {
          prodDosage = "Boire l'eau du gobelet quotidiennement";
        } else if (prodName.includes('thé') || prodName.includes('café') || prodName.includes('the')) {
          prodDosage = "1 sachet par jour";
        } else if (prodName.includes('parfum de bouche')) {
          prodDosage = "Utilisation quotidienne (en cas de besoin)";
        } else if (prodName.includes('lait') || prodName.includes('savon') || prodName.includes('shampooing') || prodName.includes('protège') || prodName.includes('serviette') || prodName.includes('pâte dentifrice')) {
          prodDosage = "Utilisation quotidienne";
        }
      } else {
        if (prodName.includes('gobelet')) {
          prodDosage = "Boire l'eau du gobelet quotidiennement";
        } else if (prodName.includes('parfum de bouche')) {
          prodDosage = "Utilisation quotidienne (en cas de besoin)";
        } else if (prodName.includes('lait') || prodName.includes('savon') || prodName.includes('shampooing') || prodName.includes('protège') || prodName.includes('serviette') || prodName.includes('pâte dentifrice')) {
          prodDosage = "Utilisation quotidienne";
        } else if (prodName.includes('thé') || prodName.includes('café') || prodName.includes('the')) {
          prodDosage = "1 sachet par jour";
        }
      }

      return {
        name: prod[0],
        pv: prod[1],
        partner: prod[2],
        public: prod[3],
        dosage: prodDosage
      };
    })
  };
});

const fileContent = `export const pathologiesList = ${JSON.stringify(pathologiesList, null, 2)};\n`;
fs.writeFileSync('src/data/pathologies.ts', fileContent);
console.log("Generated " + pathologiesList.length + " pathologies successfully.");
