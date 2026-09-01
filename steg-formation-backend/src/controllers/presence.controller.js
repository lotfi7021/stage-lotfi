const prisma = require('../config/prisma');

/**
 * @GET /api/presences
 * Liste des présences avec filtres, pagination et recherche
 */
exports.getPresences = async (req, res, next) => {
  try {
    const { search, statut, sessionId, participantId, date, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { participant: { nom: { contains: search } } },
        { participant: { prenom: { contains: search } } },
        { participant: { matricule: { contains: search } } },
        { session: { formation: { titre: { contains: search } } } },
      ];
    }

    if (statut) {
      where.statut = statut;
    }

    if (sessionId) {
      where.sessionId = Number(sessionId);
    }

    if (participantId) {
      where.participantId = Number(participantId);
    }

    if (date) {
      where.date = new Date(date);
    }

    const [presences, total] = await Promise.all([
      prisma.presence.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          session: {
            select: {
              id: true,
              dateDebut: true,
              dateFin: true,
              lieu: true,
              formation: { select: { id: true, titre: true, reference: true } },
            },
          },
          participant: {
            select: { id: true, nom: true, prenom: true, email: true, matricule: true },
          },
        },
      }),
      prisma.presence.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: presences.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      presences,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/presences/:id
 * Détail d'une présence
 */
exports.getPresenceById = async (req, res, next) => {
  try {
    const presence = await prisma.presence.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        session: {
          select: {
            id: true,
            dateDebut: true,
            dateFin: true,
            heure: true,
            lieu: true,
            statut: true,
            formation: { select: { id: true, titre: true, reference: true, categorie: true } },
            formateur: {
              select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
            },
          },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, email: true, matricule: true, genre: true },
        },
      },
    });

    if (!presence) {
      return res.status(404).json({ error: 'Présence introuvable.' });
    }

    res.status(200).json({ success: true, presence });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/presences/session/:sessionId
 * Récupérer les présences d'une session (pour une date donnée ou toutes)
 */
exports.getPresencesBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { date, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where = { sessionId: Number(sessionId) };

    if (date) {
      where.date = new Date(date);
    }

    const [presences, total] = await Promise.all([
      prisma.presence.findMany({
        where,
        orderBy: { participant: { nom: 'asc' } },
        skip,
        take: limitNum,
        include: {
          participant: {
            select: { id: true, nom: true, prenom: true, matricule: true, email: true },
          },
        },
      }),
      prisma.presence.count({ where }),
    ]);

    // Statistiques pour la session
    const stats = {
      total: presences.length,
      presents: presences.filter(p => p.statut === 'PRESENT').length,
      absents: presences.filter(p => p.statut === 'ABSENT').length,
      justifies: presences.filter(p => p.statut === 'JUSTIFIED').length,
      cantine: presences.filter(p => p.cantine === true).length,
    };

    res.status(200).json({
      success: true,
      count: presences.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      stats,
      presences,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/presences
 * Créer ou mettre à jour une présence (upsert par session+participant+date)
 */
exports.upsertPresence = async (req, res, next) => {
  try {
    const { sessionId, participantId, date, statut, note, cantine } = req.body;

    // Vérifier que la session existe
    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    // Vérifier que le participant existe
    const participant = await prisma.utilisateur.findUnique({ where: { id: Number(participantId) } });
    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    // Vérifier l'inscription du participant à la session
    const inscription = await prisma.inscription.findUnique({
      where: {
        sessionId_participantId: {
          sessionId: Number(sessionId),
          participantId: Number(participantId),
        },
      },
    });

    if (!inscription) {
      return res.status(400).json({ error: 'Ce participant n\'est pas inscrit à cette session.' });
    }

    const presenceDate = new Date(date);

    // Upsert : créer ou mettre à jour
    const presence = await prisma.presence.upsert({
      where: {
        sessionId_participantId_date: {
          sessionId: Number(sessionId),
          participantId: Number(participantId),
          date: presenceDate,
        },
      },
      update: {
        statut,
        note: note || null,
        cantine: cantine !== undefined ? cantine : undefined,
      },
      create: {
        sessionId: Number(sessionId),
        participantId: Number(participantId),
        date: presenceDate,
        statut,
        note: note || null,
        cantine: cantine !== undefined ? cantine : null,
      },
      include: {
        session: {
          select: { id: true, lieu: true, formation: { select: { titre: true } } },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Présence enregistrée avec succès.',
      presence,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/presences/bulk
 * Enregistrer les présences en masse pour une session et une date
 */
exports.bulkCreatePresences = async (req, res, next) => {
  try {
    const { sessionId, date, presences: presencesData } = req.body;

    // Vérifier que la session existe
    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    const presenceDate = new Date(date);
    const results = [];

    for (const item of presencesData) {
      const { participantId, statut, note, cantine } = item;

      // Vérifier l'inscription
      const inscription = await prisma.inscription.findUnique({
        where: {
          sessionId_participantId: {
            sessionId: Number(sessionId),
            participantId: Number(participantId),
          },
        },
      });

      if (!inscription) continue;

      const presence = await prisma.presence.upsert({
        where: {
          sessionId_participantId_date: {
            sessionId: Number(sessionId),
            participantId: Number(participantId),
            date: presenceDate,
          },
        },
        update: {
          statut,
          note: note || null,
          cantine: cantine !== undefined ? cantine : undefined,
        },
        create: {
          sessionId: Number(sessionId),
          participantId: Number(participantId),
          date: presenceDate,
          statut,
          note: note || null,
          cantine: cantine !== undefined ? cantine : null,
        },
      });

      results.push(presence);
    }

    res.status(201).json({
      success: true,
      message: `${results.length} présence(s) enregistrée(s) avec succès.`,
      count: results.length,
      presences: results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/presences/:id
 * Mettre à jour une présence
 */
exports.updatePresence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut, note, cantine } = req.body;

    const presenceExistante = await prisma.presence.findUnique({
      where: { id: Number(id) },
    });

    if (!presenceExistante) {
      return res.status(404).json({ error: 'Présence introuvable.' });
    }

    const presence = await prisma.presence.update({
      where: { id: Number(id) },
      data: {
        ...(statut && { statut }),
        ...(note !== undefined && { note: note || null }),
        ...(cantine !== undefined && { cantine }),
      },
      include: {
        session: {
          select: { id: true, lieu: true, formation: { select: { titre: true } } },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Présence mise à jour avec succès.',
      presence,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/presences/:id
 * Supprimer une présence
 */
exports.deletePresence = async (req, res, next) => {
  try {
    const { id } = req.params;

    const presence = await prisma.presence.findUnique({
      where: { id: Number(id) },
    });

    if (!presence) {
      return res.status(404).json({ error: 'Présence introuvable.' });
    }

    await prisma.presence.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Présence supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
