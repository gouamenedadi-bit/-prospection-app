import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.produit.findMany({ take: 3 }).then(console.log).finally(() => prisma.$disconnect());
