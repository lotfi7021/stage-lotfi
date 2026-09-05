const prisma = require('../config/prisma');

const ROLES_SYSTEME = ['admin', 'formateur', 'participant'];

/**
 * @GET /api/roles
 * Liste tous les rôles
 */
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nomRole: true,
        description: true,
        createdAt: true,
        _count: { select: { utilisateurs: true } },
      },
    });

    res.status(200).json({ success: true, count: roles.length, roles });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/roles
 * Crée un nouveau rôle
 */
exports.createRole = async (req, res, next) => {
  try {
    let { nomRole, description } = req.body;
    nomRole = nomRole.toLowerCase();

    const roleExistant = await prisma.role.findUnique({ where: { nomRole } });
    if (roleExistant) {
      return res.status(409).json({ error: 'Ce rôle existe déjà.' });
    }

    const role = await prisma.role.create({
      data: { nomRole, description: description || null },
    });

    res.status(201).json({ success: true, role });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/roles/:id
 * Met à jour un rôle
 */
exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { nomRole, description } = req.body;

    const roleExistant = await prisma.role.findUnique({ where: { id: Number(id) } });
    if (!roleExistant) {
      return res.status(404).json({ error: 'Rôle introuvable.' });
    }

    if (ROLES_SYSTEME.includes(roleExistant.nomRole)) {
      if (nomRole && nomRole.toLowerCase() !== roleExistant.nomRole) {
        return res.status(403).json({ error: 'Impossible de renommer un rôle système.' });
      }
      nomRole = undefined;
    }

    if (nomRole) {
      nomRole = nomRole.toLowerCase();
      const doublon = await prisma.role.findUnique({ where: { nomRole } });
      if (doublon) {
        return res.status(409).json({ error: 'Ce rôle existe déjà.' });
      }
    }

    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        ...(nomRole && { nomRole }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    res.status(200).json({ success: true, role });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/roles/:id
 * Supprime un rôle (uniquement si aucun utilisateur ne l'utilise)
 */
exports.deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { utilisateurs: true } } },
    });

    if (!role) {
      return res.status(404).json({ error: 'Rôle introuvable.' });
    }

    if (ROLES_SYSTEME.includes(role.nomRole)) {
      return res.status(403).json({ error: 'Impossible de supprimer un rôle système.' });
    }

    if (role._count.utilisateurs > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer ce rôle : il est attribué à des utilisateurs.',
      });
    }

    await prisma.role.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Rôle supprimé avec succès.' });
  } catch (err) {
    next(err);
  }
};
