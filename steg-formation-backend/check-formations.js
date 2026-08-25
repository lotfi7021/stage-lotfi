require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
  const prisma = new PrismaClient({ adapter });
  
  const formations = await prisma.formation.findMany({
    select: { id: true, titre: true, reference: true }
  });
  
  console.log('Formations existantes :');
  console.log(JSON.stringify(formations, null, 2));
  
  await prisma.$disconnect();
}

main();
