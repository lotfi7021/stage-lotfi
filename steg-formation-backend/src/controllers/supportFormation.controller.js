const prisma = require('../config/prisma');

exports.getSupports = async (req, res, next) => {
  try {
    const { search, statut, sessionId, categorie, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { session: { formation: { titre: { contains: search } } } },
      ];
    }

    if (statut) where.statut = statut;
    if (sessionId) where.sessionId = Number(sessionId);
    if (categorie) where.categorie = categorie;

    const [supports, total] = await Promise.all([
      prisma.supportFormation.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          session: {
            select: {
              id: true, dateDebut: true, dateFin: true,
              formation: { select: { id: true, titre: true, reference: true } },
            },
          },
          uploader: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
        },
      }),
      prisma.supportFormation.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: supports.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      supports,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSupportById = async (req, res, next) => {
  try {
    const support = await prisma.supportFormation.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        session: {
          select: {
            id: true, dateDebut: true, dateFin: true, lieu: true,
            formation: { select: { id: true, titre: true, reference: true, categorie: true } },
          },
        },
        uploader: {
          select: { id: true, nom: true, prenom: true, email: true },
        },
      },
    });

    if (!support) {
      return res.status(404).json({ error: 'Support introuvable.' });
    }

    res.status(200).json({ success: true, support });
  } catch (err) {
    next(err);
  }
};

exports.createSupport = async (req, res, next) => {
  try {
    const { sessionId, nom, chemin, categorie, type, taille, uploaderId } = req.body;

    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    const uploader = await prisma.utilisateur.findUnique({ where: { id: Number(uploaderId) } });
    if (!uploader) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const support = await prisma.supportFormation.create({
      data: {
        sessionId: Number(sessionId),
        nom,
        chemin,
        categorie: categorie || null,
        type: type || null,
        taille: taille || null,
        uploaderId: Number(uploaderId),
      },
      include: {
        session: {
          select: { id: true, formation: { select: { titre: true } } },
        },
        uploader: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Support créé avec succès.',
      support,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSupport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut, nom, categorie } = req.body;

    const existing = await prisma.supportFormation.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Support introuvable.' });
    }

    const support = await prisma.supportFormation.update({
      where: { id: Number(id) },
      data: {
        ...(statut && { statut }),
        ...(nom !== undefined && { nom }),
        ...(categorie !== undefined && { categorie: categorie || null }),
      },
      include: {
        session: {
          select: { id: true, formation: { select: { titre: true } } },
        },
        uploader: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Support mis à jour avec succès.',
      support,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSupport = async (req, res, next) => {
  try {
    const existing = await prisma.supportFormation.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Support introuvable.' });
    }

    await prisma.supportFormation.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({ success: true, message: 'Support supprimé avec succès.' });
  } catch (err) {
    next(err);
  }
};
