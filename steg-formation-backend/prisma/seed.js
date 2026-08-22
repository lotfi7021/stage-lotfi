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
      update: {},
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
    const adminExistant = await prisma.utilisateur.findUnique({
      where: { email: adminEmail },
    });

    if (adminExistant) {
      console.log('ℹ️  Le compte admin existe déjà.');
    } else {
      const matriculeExistant = await prisma.utilisateur.findUnique({
        where: { matricule: adminMatricule },
      });

      if (matriculeExistant) {
        console.log(`⚠️  Le matricule ${adminMatricule} est déjà utilisé. Changez ADMIN_MATRICULE dans .env.`);
      } else {
        const roleAdmin = await prisma.role.findUnique({ where: { nomRole: 'admin' } });
        const motDePasseHache = await bcrypt.hash(adminPassword, 10);

        await prisma.utilisateur.create({
          data: {
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

        console.log('✅ Compte administrateur créé depuis les variables d\'environnement.');
      }
    }
  }

  // ============ Données de démonstration (fake data) ============
  const FAKE_PASSWORD = 'Formation@2026';
  const fakePasswordHache = await bcrypt.hash(FAKE_PASSWORD, 10);

  const fakeUsers = [
    // Formateurs
    { nom: 'Ben Salah', prenom: 'Mohamed', email: 'mohamed.bensalah@steg.com.tn', matricule: 'STEG-F-0001', college: 'CTE Tunis', genre: 'Male', role: 'formateur', dateNaissance: new Date('1985-03-12') },
    { nom: 'Trabelsi', prenom: 'Sonia', email: 'sonia.trabelsi@steg.com.tn', matricule: 'STEG-F-0002', college: 'CTE Sfax', genre: 'Female', role: 'formateur', dateNaissance: new Date('1988-07-24') },
    { nom: 'Gharbi', prenom: 'Ahmed', email: 'ahmed.gharbi@steg.com.tn', matricule: 'STEG-F-0003', college: 'CTE Sousse', genre: 'Male', role: 'formateur', dateNaissance: new Date('1990-11-02') },
    { nom: 'Jaziri', prenom: 'Ines', email: 'ines.jaziri@steg.com.tn', matricule: 'STEG-F-0004', college: 'CTE Tunis', genre: 'Female', role: 'formateur', dateNaissance: new Date('1992-05-19') },

    // Participants
    { nom: 'Hammami', prenom: 'Salma', email: 'salma.hammami@steg.com.tn', matricule: 'STEG-P-0001', college: 'CTE Tunis', genre: 'Female', role: 'participant', dateNaissance: new Date('1998-01-15') },
    { nom: 'Bouazizi', prenom: 'Omar', email: 'omar.bouazizi@steg.com.tn', matricule: 'STEG-P-0002', college: 'CTE Sfax', genre: 'Male', role: 'participant', dateNaissance: new Date('1997-09-03') },
    { nom: 'Khelifi', prenom: 'Nour', email: 'nour.khelifi@steg.com.tn', matricule: 'STEG-P-0003', college: 'CTE Sousse', genre: 'Female', role: 'participant', dateNaissance: new Date('1999-04-22') },
    { nom: 'Mejri', prenom: 'Yassine', email: 'yassine.mejri@steg.com.tn', matricule: 'STEG-P-0004', college: 'CTE Bizerte', genre: 'Male', role: 'participant', dateNaissance: new Date('1996-12-11') },
    { nom: 'Ben Amor', prenom: 'Rania', email: 'rania.benamor@steg.com.tn', matricule: 'STEG-P-0005', college: 'CTE Gabes', genre: 'Female', role: 'participant', dateNaissance: new Date('2000-02-28') },
    { nom: 'Slimi', prenom: 'Khaled', email: 'khaled.slimi@steg.com.tn', matricule: 'STEG-P-0006', college: 'CTE Nabeul', genre: 'Male', role: 'participant', dateNaissance: new Date('1995-08-09') },
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
      update: {},
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