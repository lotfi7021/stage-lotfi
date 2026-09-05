const prisma = require('../config/prisma');

/**
 * @GET /api/inscriptions
 * Liste des inscriptions avec filtres, pagination et recherche
 */
exports.getInscriptions = async (req, res, next) => {
  try {
    const { search, statut, sessionId, participantId, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { participant: { nom: { contains: search } } },
        { participant: { prenom: { contains: search } } },
        { participant: { email: { contains: search } } },
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

    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          session: {
            select: {
              id: true,
              dateDebut: true,
              dateFin: true,
              lieu: true,
              statut: true,
              formation: { select: { id: true, titre: true, reference: true, categorie: true, duree: true } },
            },
          },
          participant: {
            select: { id: true, nom: true, prenom: true, email: true, matricule: true, genre: true },
          },
        },
      }),
      prisma.inscription.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: inscriptions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      inscriptions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/inscriptions/:id
 * Détail d'une inscription
 */
exports.getInscriptionById = async (req, res, next) => {
  try {
    const inscription = await prisma.inscription.findUnique({
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
            maxParticipants: true,
            formation: {
              select: { id: true, titre: true, reference: true, categorie: true, duree: true, prix: true, objectifs: true },
            },
            formateur: {
              select: { id: true, specialite: true, utilisateur: { select: { nom: true, prenom: true, email: true } } },
            },
            _count: { select: { inscriptions: true } },
          },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, email: true, matricule: true, genre: true, college: true },
        },
      },
    });

    if (!inscription) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }

    res.status(200).json({ success: true, inscription });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/inscriptions
 * Créer une inscription (inscrire un participant à une session)
 */
exports.createInscription = async (req, res, next) => {
  try {
    const { sessionId, participantId, statut } = req.body;

    // Vérifier que la session existe
    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
      include: {
        _count: { select: { inscriptions: true } },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    // Vérifier que la session n'est pas annulée ou terminée
    if (session.statut === 'CANCELLED' || session.statut === 'COMPLETED') {
      return res.status(400).json({ error: 'Cette session est clôturée.' });
    }

    // Vérifier la capacité maximale
    if (session.maxParticipants && session._count.inscriptions >= session.maxParticipants) {
      return res.status(400).json({ error: 'La session est complète. Nombre maximum de participants atteint.' });
    }

    // Vérifier que le participant existe et a le rôle participant
    const participant = await prisma.utilisateur.findUnique({
      where: { id: Number(participantId) },
      include: { role: true },
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    if (participant.role.nomRole !== 'Participant') {
      return res.status(400).json({ error: "L'utilisateur n'a pas le rôle participant." });
    }

    // Vérifier que le participant n'est pas déjà inscrit
    const inscriptionExistante = await prisma.inscription.findUnique({
      where: {
        sessionId_participantId: {
          sessionId: Number(sessionId),
          participantId: Number(participantId),
        },
      },
    });

    if (inscriptionExistante) {
      return res.status(409).json({ error: 'Ce participant est déjà inscrit à cette session.' });
    }

    const inscription = await prisma.inscription.create({
      data: {
        sessionId: Number(sessionId),
        participantId: Number(participantId),
        dateInscription: new Date(),
        statut: statut || 'ENROLLED',
      },
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
    });

    res.status(201).json({
      success: true,
      message: 'Inscription créée avec succès.',
      inscription,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/inscriptions/:id
 * Mettre à jour le statut d'une inscription
 */
exports.updateInscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const inscriptionExistante = await prisma.inscription.findUnique({
      where: { id: Number(id) },
    });

    if (!inscriptionExistante) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }

    const inscription = await prisma.inscription.update({
      where: { id: Number(id) },
      data: {
        ...(statut && { statut }),
      },
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
    });

    res.status(200).json({
      success: true,
      message: 'Inscription mise à jour avec succès.',
      inscription,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DELETE /api/inscriptions/:id
 * Supprimer / annuler une inscription
 */
exports.deleteInscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inscription = await prisma.inscription.findUnique({
      where: { id: Number(id) },
    });

    if (!inscription) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }

    // Vérifier s'il y a des évaluations ou certifications liées
    await prisma.inscription.delete({ where: { id: Number(id) } });

    res.status(200).json({ success: true, message: 'Inscription supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/inscriptions/participant/:participantId
 * Récupérer les inscriptions d'un participant
 */
exports.getInscriptionsByParticipant = async (req, res, next) => {
  try {
    const { participantId } = req.params;
    const { statut, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = { participantId: Number(participantId) };

    if (statut) {
      where.statut = statut;
    }

    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          session: {
            select: {
              id: true,
              dateDebut: true,
              dateFin: true,
              heure: true,
              lieu: true,
              statut: true,
              formation: {
                select: { id: true, titre: true, reference: true, categorie: true, duree: true, prix: true },
              },
              formateur: {
                select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
              },
            },
          },
        },
      }),
      prisma.inscription.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: inscriptions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      inscriptions,
    });
  } catch (err) {
    next(err);
  }
};
