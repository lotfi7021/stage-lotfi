const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

(async () => {
  const users = await prisma.utilisateur.findMany({
    select: { id: true, nom: true, prenom: true, email: true, matricule: true, isActive: true, role: { select: { nomRole: true } } }
  });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
})();
