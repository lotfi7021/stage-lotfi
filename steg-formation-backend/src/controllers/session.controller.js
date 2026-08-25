const prisma = require('../config/prisma');

/**
 * @GET /api/sessions
 * Liste des sessions avec filtres, pagination et recherche
 */
exports.getSessions = async (req, res, next) => {
  try {
    const { search, statut, formationId, formateurId, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { lieu: { contains: search } },
        { formation: { titre: { contains: search } } },
        { formateur: { utilisateur: { nom: { contains: search } } } },
      ];
    }

    if (statut) {
      where.statut = statut;
    }

    if (formationId) {
      where.formationId = Number(formationId);
    }

    if (formateurId) {
      where.formateurId = Number(formateurId);
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        orderBy: { dateDebut: 'desc' },
        skip,
        take: limitNum,
        include: {
          formation: { select: { id: true, titre: true, reference: true } },
          formateur: {
            select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
          },
          _count: { select: { inscriptions: true } },
        },
      }),
      prisma.session.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/sessions/:id
 * Détail d'une session avec relations
 */
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        formation: { select: { id: true, titre: true, reference: true, categorie: true, duree: true, prix: true } },
        formateur: {
          select: { id: true, specialite: true, utilisateur: { select: { nom: true, prenom: true, email: true } } },
        },
        _count: { select: { inscriptions: true, presences: true, evaluations: true } },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/sessions
 * Créer une session
 */
exports.createSession = async (req, res, next) => {
  try {
    const {
      formationId, formateurId, dateDebut, dateFin,
      heure, lieu, statut, maxParticipants,
    } = req.body;

    const formation = await prisma.formation.findUnique({ where: { id: Number(formationId) } });
    if (!formation) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    const formateur = await prisma.formateur.findUnique({ where: { id: Number(formateurId) } });
    if (!formateur) {
      return res.status(404).json({ error: 'Formateur introuvable.' });
    }

    const session = await prisma.session.create({
      data: {
        formationId: Number(formationId),
        formateurId: Number(formateurId),
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        heure: heure ? new Date(heure) : null,
        lieu,
        statut: statut || 'PENDING',
        maxParticipants: maxParticipants ? Number(maxParticipants) : null,
      },
      include: {
        formation: { select: { id: true, titre: true, reference: true } },
        formateur: {
          select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Session créée avec succès.',
      session,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/sessions/:id
 * Mettre à jour une session
 */
exports.updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      formationId, formateurId, dateDebut, dateFin,
      heure, lieu, statut, maxParticipants,
    } = req.body;

    const sessionExistante = await prisma.session.findUnique({
      where: { id: Number(id) },
    });

    if (!sessionExistante) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    if (formationId) {
      const formation = await prisma.formation.findUnique({ where: { id: Number(formationId) } });
      if (!formation) {
        return res.status(404).json({ error: 'Formation introuvable.' });
      }
    }

    if (formateurId) {
      const formateur = await prisma.formateur.findUnique({ where: { id: Number(formateurId) } });
      if (!formateur) {
        return res.status(404).json({ error: 'Formateur introuvable.' });
      }
    }

    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        ...(formationId && { formationId: Number(formationId) }),
        ...(formateurId && { formateurId: Number(formateurId) }),
        ...(dateDebut && { dateDebut: new Date(dateDebut) }),
        ...(dateFin && { dateFin: new Date(dateFin) }),
        ...(heure !== undefined && { heure: heure ? new Date(heure) : null }),
        ...(lieu && { lieu }),
        ...(statut && { statut }),
        ...(maxParticipants !== undefined && { maxParticipants: maxParticipants ? Number(maxParticipants) : null }),
      },
      include: {
        formation: { select: { id: true, titre: true, reference: true } },
        formateur: {
          select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Session mise à jour avec succès.',
      session,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/sessions/:id
 * Supprimer une session (vérifie l'absence d'inscriptions)
 */
exports.deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    const inscriptionExistante = await prisma.inscription.findFirst({
      where: { sessionId: Number(id) },
    });

    if (inscriptionExistante) {
      return res.status(400).json({ error: 'Des inscriptions sont liées à cette session' });
    }

    await prisma.session.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Session supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
