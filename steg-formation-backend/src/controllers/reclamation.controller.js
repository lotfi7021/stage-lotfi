const prisma = require('../config/prisma');

exports.getReclamations = async (req, res, next) => {
  try {
    const { search, type, priorite, statut, formationId, participantId, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { participant: { nom: { contains: search } } },
        { participant: { prenom: { contains: search } } },
        { titre: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (type) where.type = type;
    if (priorite) where.priorite = priorite;
    if (statut) where.statut = statut;
    if (formationId) where.formationId = Number(formationId);
    if (participantId) where.participantId = Number(participantId);

    const [reclamations, total] = await Promise.all([
      prisma.reclamation.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          participant: {
            select: { id: true, nom: true, prenom: true, email: true, matricule: true },
          },
          formation: {
            select: { id: true, titre: true, reference: true },
          },
          session: {
            select: { id: true, dateDebut: true, dateFin: true, lieu: true },
          },
        },
      }),
      prisma.reclamation.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: reclamations.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reclamations,
    });
  } catch (err) {
    next(err);
  }
};

exports.getReclamationById = async (req, res, next) => {
  try {
    const reclamation = await prisma.reclamation.findUnique({
      where: { id: req.params.id },
      include: {
        participant: {
          select: { id: true, nom: true, prenom: true, email: true, matricule: true },
        },
        formation: {
          select: { id: true, titre: true, reference: true, categorie: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
      },
    });

    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation introuvable.' });
    }

    res.status(200).json({ success: true, reclamation });
  } catch (err) {
    next(err);
  }
};

exports.createReclamation = async (req, res, next) => {
  try {
    const { participantId, formationId, sessionId, type, priorite, titre, description, centre, date } = req.body;

    const participant = await prisma.utilisateur.findUnique({ where: { id: Number(participantId) } });
    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    const formation = await prisma.formation.findUnique({ where: { id: Number(formationId) } });
    if (!formation) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    if (sessionId) {
      const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
      if (!session) {
        return res.status(404).json({ error: 'Session introuvable.' });
      }
    }

    const count = await prisma.reclamation.count();
    const id = `REC-${String(count + 1).padStart(3, '0')}`;

    const reclamation = await prisma.reclamation.create({
      data: {
        id,
        participantId: Number(participantId),
        formationId: Number(formationId),
        sessionId: sessionId ? Number(sessionId) : null,
        type,
        priorite,
        titre: titre || null,
        description,
        centre: centre || null,
        date: new Date(date),
      },
      include: {
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
        formation: {
          select: { id: true, titre: true, reference: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Réclamation créée avec succès.',
      reclamation,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReclamation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut, priorite, description } = req.body;

    const existing = await prisma.reclamation.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Réclamation introuvable.' });
    }

    const reclamation = await prisma.reclamation.update({
      where: { id },
      data: {
        ...(statut && { statut }),
        ...(priorite && { priorite }),
        ...(description !== undefined && { description }),
      },
      include: {
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
        formation: {
          select: { id: true, titre: true, reference: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Réclamation mise à jour avec succès.',
      reclamation,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReclamation = async (req, res, next) => {
  try {
    const existing = await prisma.reclamation.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Réclamation introuvable.' });
    }

    await prisma.reclamation.delete({ where: { id: req.params.id } });

    res.status(200).json({ success: true, message: 'Réclamation supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
