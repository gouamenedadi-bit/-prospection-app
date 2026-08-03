import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';
const imagesDir = 'C:\\Users\\HP\\Documents\\PROSPECTION LONGRICH\\images des produits longrich';
const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

async function main() {
  const products = await prisma.produit.findMany();
  const imageFiles = fs.readdirSync(imagesDir);

  for (const product of products) {
    const prodNorm = normalize(product.name);
    let bestMatch = null;
    let maxScore = 0;

    for (const img of imageFiles) {
      const imgNameOnly = img.substring(0, img.lastIndexOf('.'));
      const imgNorm = normalize(imgNameOnly);

      // Simple scoring based on matching substrings
      let score = 0;
      if (prodNorm.includes(imgNorm) || imgNorm.includes(prodNorm)) {
        score += 100;
      }
      
      // word by word match
      const prodWords = product.name.toLowerCase().split(/[\s\(\)-]+/);
      const imgWords = imgNameOnly.toLowerCase().split(/[\s\(\)-]+/);
      
      let wordMatches = 0;
      for (const pw of prodWords) {
        if (pw.length > 2 && imgWords.some(iw => iw.includes(pw) || pw.includes(iw))) {
          wordMatches++;
        }
      }
      score += wordMatches * 10;

      if (score > maxScore && score > 0) {
        maxScore = score;
        bestMatch = img;
      }
    }

    if (bestMatch) {
      console.log(`Matched product "${product.name}" with image "${bestMatch}" (Score: ${maxScore})`);
      const srcPath = path.join(imagesDir, bestMatch);
      // Create a URL-safe filename
      const safeFilename = bestMatch.replace(/[^a-zA-Z0-9.\-]/g, '_');
      const destPath = path.join(uploadsDir, safeFilename);
      
      fs.copyFileSync(srcPath, destPath);
      
      await prisma.produit.update({
        where: { id: product.id },
        data: { image: `/uploads/${safeFilename}` }
      });
    } else {
      console.log(`No match found for product "${product.name}"`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
