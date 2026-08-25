const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Démarrage du seed...');

  const rolesData = [
    { nomRole: 'admin', description: 'Accès complet à la plateforme' },
    { nomRole: 'formateur', description: 'Gestion des sessions, présences et évaluations' },
    { nomRole: 'participant', description: 'Accès au catalogue, planning et certificats' },
  ];

  for (const roleData of rolesData) {
    await prisma.role.upsert({
      where: { nomRole: roleData.nomRole },
      update: { description: roleData.description },
      create: roleData,
    });
  }
  console.log('✅ Rôles créés (admin, formateur, participant)');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminMatricule = process.env.ADMIN_MATRICULE;

  if (!adminEmail || !adminPassword || !adminMatricule) {
    console.log('⚠️  Variables ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_MATRICULE manquantes. Admin non créé.');
  } else {
    const roleAdmin = await prisma.role.findUnique({ where: { nomRole: 'admin' } });
    const motDePasseHache = await bcrypt.hash(adminPassword, 10);

    await prisma.utilisateur.upsert({
      where: { email: adminEmail },
      update: {
        matricule: adminMatricule,
        motDePasse: motDePasseHache,
        roleId: roleAdmin.id,
        isActive: true,
      },
      create: {
        matricule: adminMatricule,
        nom: 'Admin',
        prenom: 'System',
        email: adminEmail,
        motDePasse: motDePasseHache,
        genre: 'Male',
        roleId: roleAdmin.id,
        isActive: true,
      },
    });

    console.log('✅ Compte administrateur synchronisé depuis les variables d\'environnement.');
  }

  // ============ Données de démonstration (fake data) ============
  const FAKE_PASSWORD = 'Formation@2026';
  const fakePasswordHache = await bcrypt.hash(FAKE_PASSWORD, 10);

  const fakeUsers = [
    // Formateurs
    { nom: 'Ben Salah', prenom: 'Mohamed', email: 'mohamed.bensalah@steg.com.tn', matricule: 'STEG-F-0001', college: 'CTE Tunis', genre: 'Male', role: 'formateur', dateNaissance: new Date('1985-03-12') },
    { nom: 'Trabelsi', prenom: 'Sonia', email: 'sonia.trabelsi@steg.com.tn', matricule: 'STEG-F-0002', college: 'CTE Sfax', genre: 'Female', role: 'formateur', dateNaissance: new Date('1988-07-24') },

    // Participants
    { nom: 'Ayari', prenom: 'Mariem', email: 'mariem.ayari@steg.com.tn', matricule: 'STEG-P-0007', college: 'CTE Kairouan', genre: 'Female', role: 'participant', dateNaissance: new Date('2001-06-17') },
    { nom: 'Chaker', prenom: 'Fares', email: 'fares.chaker@steg.com.tn', matricule: 'STEG-P-0008', college: 'CTE Monastir', genre: 'Male', role: 'participant', dateNaissance: new Date('1994-10-30') },
  ];

  let fakeCount = 0;
  for (const userData of fakeUsers) {
    const role = await prisma.role.findUnique({ where: { nomRole: userData.role } });
    if (!role) continue;

    const { role: roleName, ...createData } = userData;

    await prisma.utilisateur.upsert({
      where: { email: userData.email },
      update: {
        nom: userData.nom,
        prenom: userData.prenom,
        matricule: userData.matricule,
        college: userData.college,
        genre: userData.genre,
        motDePasse: fakePasswordHache,
        roleId: role.id,
        isActive: true,
      },
      create: {
        ...createData,
        motDePasse: fakePasswordHache,
        roleId: role.id,
        isActive: true,
      },
    });
    fakeCount++;
  }
  console.log(`✅ ${fakeCount} utilisateurs de démonstration créés (formateurs + participants) — mot de passe : ${FAKE_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });