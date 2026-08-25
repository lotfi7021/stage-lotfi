const prisma = require('../config/prisma');

/**
 * @GET /api/formations
 * Liste des formations avec filtres, pagination et recherche
 */
exports.getFormations = async (req, res, next) => {
  try {
    const { search, categorie, statut, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { titre: { contains: search } },
        { reference: { contains: search } },
        { categorie: { contains: search } },
      ];
    }

    if (categorie) {
      where.categorie = categorie;
    }

    if (statut) {
      where.statut = statut;
    }

    const [formations, total] = await Promise.all([
      prisma.formation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.formation.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: formations.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      formations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/formations/:id
 * Détail d'une formation avec compteur sessions et factures
 */
exports.getFormationById = async (req, res, next) => {
  try {
    const formation = await prisma.formation.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        _count: {
          select: { sessions: true, factures: true },
        },
      },
    });

    if (!formation) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    res.status(200).json({ success: true, formation });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/formations
 * Créer une formation
 */
exports.createFormation = async (req, res, next) => {
  try {
    const {
      titre, reference, categorie, objectifs, prerequis,
      modules, duree, prix, maxParticipants, statut,
    } = req.body;

    const refExistante = await prisma.formation.findUnique({ where: { reference } });
    if (refExistante) {
      return res.status(409).json({ error: 'Cette référence est déjà utilisée.' });
    }

    const formation = await prisma.formation.create({
      data: {
        titre,
        reference,
        categorie,
        objectifs: objectifs || null,
        prerequis: prerequis || null,
        modules: modules || null,
        duree,
        prix: prix ? parseFloat(prix) : null,
        maxParticipants,
        statut: statut || 'PLANNED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Formation créée avec succès.',
      formation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/formations/:id
 * Mettre à jour une formation
 */
exports.updateFormation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      titre, reference, categorie, objectifs, prerequis,
      modules, duree, prix, maxParticipants, statut,
    } = req.body;

    const formationExistante = await prisma.formation.findUnique({
      where: { id: Number(id) },
    });

    if (!formationExistante) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    if (reference) {
      const doublon = await prisma.formation.findFirst({
        where: { reference, NOT: { id: Number(id) } },
      });
      if (doublon) {
        return res.status(409).json({ error: 'Cette référence est déjà utilisée.' });
      }
    }

    const formation = await prisma.formation.update({
      where: { id: Number(id) },
      data: {
        ...(titre && { titre }),
        ...(reference && { reference }),
        ...(categorie && { categorie }),
        ...(objectifs !== undefined && { objectifs: objectifs || null }),
        ...(prerequis !== undefined && { prerequis: prerequis || null }),
        ...(modules !== undefined && { modules: modules || null }),
        ...(duree && { duree }),
        ...(prix !== undefined && { prix: prix ? parseFloat(prix) : null }),
        ...(maxParticipants && { maxParticipants }),
        ...(statut && { statut }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Formation mise à jour avec succès.',
      formation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/formations/:id
 * Supprimer une formation (vérifie l'absence de sessions liées)
 */
exports.deleteFormation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const formation = await prisma.formation.findUnique({
      where: { id: Number(id) },
    });

    if (!formation) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    const sessionExistante = await prisma.session.findFirst({
      where: { formationId: Number(id) },
    });

    if (sessionExistante) {
      return res.status(400).json({ error: 'Des sessions sont liées à cette formation' });
    }

    await prisma.formation.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Formation supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
