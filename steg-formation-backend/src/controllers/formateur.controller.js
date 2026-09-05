const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateMatricule } = require('../utils/matricule');

const TEMPORARY_PASSWORD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateTemporaryPassword = (length = 8) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += TEMPORARY_PASSWORD_CHARS.charAt(Math.floor(Math.random() * TEMPORARY_PASSWORD_CHARS.length));
  }
  return result;
};

const utilisateurSelect = {
  select: {
    id: true,
    nom: true,
    prenom: true,
    email: true,
    matricule: true,
    genre: true,
    isActive: true,
    createdAt: true,
  },
};

const includeFormateur = {
  utilisateur: utilisateurSelect,
};

const formatFormateur = (f, role) => ({
  id: f.id,
  utilisateur_id: f.utilisateurId,
  nom: f.utilisateur?.nom || null,
  prenom: f.utilisateur?.prenom || null,
  ...(role !== 'participant' && {
    email: f.utilisateur?.email || null,
    matricule: f.utilisateur?.matricule || null,
  }),
  genre: f.utilisateur?.genre || null,
  isActive: f.utilisateur?.isActive ?? null,
  specialite: f.specialite,
  qualifications: f.qualifications,
  disponibilites: f.disponibilites,
  createdAt: f.createdAt,
  updatedAt: f.updatedAt,
});

/**
 * @GET /api/formateurs
 * Liste des formateurs (utilisateurs avec profil formateur)
 */
exports.getFormateurs = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.utilisateur = {
        OR: [
          { nom: { contains: search } },
          { prenom: { contains: search } },
          { email: { contains: search } },
          { matricule: { contains: search } },
        ],
      };
    }

    const allFormateurs = await prisma.formateur.findMany({
      where,
      orderBy: { id: 'asc' },
      include: includeFormateur,
    });

    const formateurs = allFormateurs.filter(f => f.utilisateur);

    res.status(200).json({
      success: true,
      count: formateurs.length,
      formateurs: formateurs.map((f) => formatFormateur(f, req.user.role)),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/formateurs/:id
 * Détail d'un formateur
 */
exports.getFormateurById = async (req, res, next) => {
  try {
    const formateur = await prisma.formateur.findUnique({
      where: { id: Number(req.params.id) },
      include: includeFormateur,
    });

    if (!formateur) {
      return res.status(404).json({ error: 'Formateur introuvable.' });
    }

    res.status(200).json({ success: true, formateur: formatFormateur(formateur, req.user.role) });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/formateurs
 * Crée un utilisateur (rôle formateur) + son profil formateur
 */
exports.createFormateur = async (req, res, next) => {
  try {
    const {
      prenom, nom, matricule, email, genre, college, dateNaissance,
      specialite, qualifications, disponibilites,
    } = req.body;

    const emailExistant = await prisma.utilisateur.findUnique({ where: { email } });
    if (emailExistant) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    let finalMatricule = matricule;
    if (!finalMatricule) {
      let exists = true;
      while (exists) {
        finalMatricule = generateMatricule();
        const m = await prisma.utilisateur.findUnique({ where: { matricule: finalMatricule } });
        exists = !!m;
      }
    } else {
      const matriculeExistant = await prisma.utilisateur.findUnique({ where: { matricule: finalMatricule } });
      if (matriculeExistant) {
        return res.status(409).json({ error: 'Ce matricule est déjà utilisé.' });
      }
    }

    const roleFormateur = await prisma.role.findUnique({ where: { nomRole: 'formateur' } });
    if (!roleFormateur) {
      return res.status(500).json({ error: 'Rôle formateur introuvable. Lancez le seed.' });
    }

    const motDePasse = req.body.motDePasse || generateTemporaryPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    const formateur = await prisma.formateur.create({
      data: {
        specialite: specialite || null,
        qualifications: qualifications || null,
        disponibilites: disponibilites !== undefined ? disponibilites : true,
        utilisateur: {
          create: {
            prenom,
            nom,
            matricule: finalMatricule,
            email,
            motDePasse: hashedPassword,
            genre: genre === 'Female' ? 'Female' : 'Male',
            college: college || null,
            dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
            roleId: roleFormateur.id,
            isActive: true,
          },
        },
      },
      include: includeFormateur,
    });

    res.status(201).json({
      success: true,
      message: 'Formateur créé avec succès.',
      formateur: formatFormateur(formateur, req.user.role),
      temporaryPassword: req.body.motDePasse ? undefined : motDePasse,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/formateurs/:id
 * Met à jour un formateur (profil + informations utilisateur)
 */
exports.updateFormateur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      prenom, nom, matricule, email, genre, college, dateNaissance,
      specialite, qualifications, disponibilites,
    } = req.body;

    const formateurExistant = await prisma.formateur.findUnique({
      where: { id: Number(id) },
    });

    if (!formateurExistant) {
      return res.status(404).json({ error: 'Formateur introuvable.' });
    }

    const utilisateurId = formateurExistant.utilisateurId;

    if (email) {
      const doublon = await prisma.utilisateur.findFirst({
        where: { email, NOT: { id: utilisateurId } },
      });
      if (doublon) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }
    }

    if (matricule) {
      const doublon = await prisma.utilisateur.findFirst({
        where: { matricule, NOT: { id: utilisateurId } },
      });
      if (doublon) {
        return res.status(409).json({ error: 'Ce matricule est déjà utilisé.' });
      }
    }

    const formateur = await prisma.formateur.update({
      where: { id: Number(id) },
      data: {
        specialite: specialite !== undefined ? specialite || null : undefined,
        qualifications: qualifications !== undefined ? qualifications || null : undefined,
        disponibilites: disponibilites !== undefined ? disponibilites : undefined,
        utilisateur: {
          update: {
            ...(prenom && { prenom }),
            ...(nom && { nom }),
            ...(email && { email }),
            ...(matricule && { matricule }),
            ...(college !== undefined && { college: college || null }),
            ...(genre && { genre: genre === 'Female' ? 'Female' : 'Male' }),
            ...(dateNaissance !== undefined && {
              dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
            }),
          },
        },
      },
      include: includeFormateur,
    });

    res.status(200).json({
      success: true,
      message: 'Formateur mis à jour avec succès.',
      formateur: formatFormateur(formateur, req.user.role),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/formateurs/:id
 * Supprime un formateur (profil + compte utilisateur)
 */
exports.deleteFormateur = async (req, res, next) => {
  try {
    const { id } = req.params;

    const formateur = await prisma.formateur.findUnique({
      where: { id: Number(id) },
    });

    if (!formateur) {
      return res.status(404).json({ error: 'Formateur introuvable.' });
    }

    if (Number(formateur.utilisateurId) === req.user.id) {
      return res.status(400).json({ error: 'Impossible de supprimer votre propre compte.' });
    }

    await prisma.$transaction([
      prisma.formateur.delete({ where: { id: formateur.id } }),
      prisma.utilisateur.delete({ where: { id: formateur.utilisateurId } }),
    ]);

    res.status(200).json({ success: true, message: 'Formateur supprimé avec succès.' });
  } catch (err) {
    next(err);
  }
};
