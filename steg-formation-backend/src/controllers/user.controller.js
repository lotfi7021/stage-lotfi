const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateMatricule } = require('../utils/matricule');

/**
 * @GET /api/users
 * Liste paginée des utilisateurs avec filtres (search, role, isActive)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const { search, role, isActive } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { email: { contains: search } },
        { matricule: { contains: search } },
      ];
    }

    if (role) {
      const roleRecherche = await prisma.role.findUnique({
        where: { nomRole: role },
        select: { id: true },
      });
      if (!roleRecherche) {
        return res.status(404).json({ error: `Rôle '${role}' introuvable.` });
      }
      where.roleId = roleRecherche.id;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === '1';
    }

    const [utilisateurs, total] = await Promise.all([
      prisma.utilisateur.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          matricule: true,
          college: true,
          genre: true,
          dateNaissance: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          role: { select: { id: true, nomRole: true } },
        },
      }),
      prisma.utilisateur.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      users: utilisateurs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/users/:id
 * Détail d'un utilisateur
 */
exports.getUserById = async (req, res, next) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        matricule: true,
        college: true,
        genre: true,
        dateNaissance: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, nomRole: true, description: true } },
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    res.status(200).json({ success: true, user: utilisateur });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/users
 * Crée un utilisateur (admin) avec attribution du rôle
 */
exports.createUser = async (req, res, next) => {
  try {
    const { prenom, nom, matricule, email, motDePasse, college, genre, dateNaissance, roleId, isActive } = req.body;

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

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return res.status(400).json({ error: 'Rôle invalide.' });
    }

    if (role.nomRole === 'formateur') {
      return res.status(403).json({ error: 'Les comptes formateurs doivent être créés via la page dédiée.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        matricule: finalMatricule,
        email,
        motDePasse: hashedPassword,
        college: college || null,
        genre: genre === 'Female' ? 'Female' : 'Male',
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        roleId: role.id,
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        matricule: true,
        college: true,
        genre: true,
        isActive: true,
        createdAt: true,
        role: { select: { id: true, nomRole: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      user: utilisateur,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/users/:id
 * Met à jour un utilisateur (profil, rôle, statut, mot de passe optionnel)
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { prenom, nom, matricule, email, motDePasse, college, genre, dateNaissance, roleId, isActive } = req.body;

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });

    if (!utilisateurExistant) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    if (email) {
      const doublon = await prisma.utilisateur.findFirst({
        where: { email, NOT: { id: Number(id) } },
      });
      if (doublon) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }
    }

    if (matricule) {
      const doublon = await prisma.utilisateur.findFirst({
        where: { matricule, NOT: { id: Number(id) } },
      });
      if (doublon) {
        return res.status(409).json({ error: 'Ce matricule est déjà utilisé.' });
      }
    }

    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        return res.status(400).json({ error: 'Rôle invalide.' });
      }
    }

    let hashedPassword;
    if (motDePasse) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(motDePasse, salt);
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id: Number(id) },
      data: {
        ...(prenom && { prenom }),
        ...(nom && { nom }),
        ...(email && { email }),
        ...(matricule && { matricule }),
        ...(hashedPassword && { motDePasse: hashedPassword }),
        ...(college !== undefined && { college: college || null }),
        ...(genre && { genre: genre === 'Female' ? 'Female' : 'Male' }),
        ...(dateNaissance !== undefined && {
          dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        }),
        ...(roleId && { roleId }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        matricule: true,
        college: true,
        genre: true,
        dateNaissance: true,
        isActive: true,
        updatedAt: true,
        role: { select: { id: true, nomRole: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès.',
      user: utilisateur,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PATCH /api/users/:id/status
 * Active / désactive un compte utilisateur
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });

    if (!utilisateurExistant) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id: Number(id) },
      data: { isActive: Boolean(isActive) },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      message: utilisateur.isActive
        ? 'Compte activé.'
        : 'Compte désactivé.',
      user: utilisateur,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/users/:id
 * Supprime définitivement un utilisateur
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'Impossible de supprimer votre propre compte.' });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });

    if (!utilisateurExistant) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    await prisma.utilisateur.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès.' });
  } catch (err) {
    next(err);
  }
};
