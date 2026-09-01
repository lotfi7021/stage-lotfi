const prisma = require('../config/prisma');

exports.getEvaluations = async (req, res, next) => {
  try {
    const { search, type, sessionId, participantId, statut, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { participant: { nom: { contains: search } } },
        { participant: { prenom: { contains: search } } },
        { session: { formation: { titre: { contains: search } } } },
      ];
    }

    if (type) where.type = type;
    if (sessionId) where.sessionId = Number(sessionId);
    if (participantId) where.participantId = Number(participantId);
    if (statut) where.statut = statut;

    const [evaluations, total] = await Promise.all([
      prisma.evaluation.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          session: {
            select: {
              id: true, dateDebut: true, dateFin: true, lieu: true,
              formation: { select: { id: true, titre: true, reference: true } },
            },
          },
          participant: {
            select: { id: true, nom: true, prenom: true, email: true, matricule: true },
          },
        },
      }),
      prisma.evaluation.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: evaluations.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      evaluations,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEvaluationById = async (req, res, next) => {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        session: {
          select: {
            id: true, dateDebut: true, dateFin: true, lieu: true,
            formation: { select: { id: true, titre: true, reference: true } },
            formateur: {
              select: { id: true, utilisateur: { select: { nom: true, prenom: true } } },
            },
          },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, email: true, matricule: true },
        },
      },
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Évaluation introuvable.' });
    }

    res.status(200).json({ success: true, evaluation });
  } catch (err) {
    next(err);
  }
};

exports.createEvaluation = async (req, res, next) => {
  try {
    const { sessionId, participantId, type, score, commentaire, date, statut } = req.body;

    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    const participant = await prisma.utilisateur.findUnique({ where: { id: Number(participantId) } });
    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        sessionId: Number(sessionId),
        participantId: Number(participantId),
        type,
        score: score !== undefined ? score : null,
        commentaire: commentaire || null,
        date: new Date(date),
        statut: statut || null,
      },
      include: {
        session: {
          select: { id: true, formation: { select: { titre: true } } },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Évaluation créée avec succès.',
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvaluation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, commentaire, statut } = req.body;

    const existing = await prisma.evaluation.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Évaluation introuvable.' });
    }

    const evaluation = await prisma.evaluation.update({
      where: { id: Number(id) },
      data: {
        ...(score !== undefined && { score }),
        ...(commentaire !== undefined && { commentaire: commentaire || null }),
        ...(statut && { statut }),
      },
      include: {
        session: {
          select: { id: true, formation: { select: { titre: true } } },
        },
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Évaluation mise à jour avec succès.',
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvaluation = async (req, res, next) => {
  try {
    const existing = await prisma.evaluation.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Évaluation introuvable.' });
    }

    await prisma.evaluation.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({ success: true, message: 'Évaluation supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
