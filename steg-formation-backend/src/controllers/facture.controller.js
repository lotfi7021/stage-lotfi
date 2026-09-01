const prisma = require('../config/prisma');

exports.getFactures = async (req, res, next) => {
  try {
    const { search, statut, formationId, sessionId, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { client: { contains: search } },
        { id: { contains: search } },
        { formation: { titre: { contains: search } } },
      ];
    }

    if (statut) where.statut = statut;
    if (formationId) where.formationId = Number(formationId);
    if (sessionId) where.sessionId = Number(sessionId);

    const [factures, total] = await Promise.all([
      prisma.facture.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          formation: {
            select: { id: true, titre: true, reference: true, categorie: true },
          },
          session: {
            select: { id: true, dateDebut: true, dateFin: true, lieu: true },
          },
        },
      }),
      prisma.facture.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: factures.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      factures,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFactureById = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({
      where: { id: req.params.id },
      include: {
        formation: {
          select: { id: true, titre: true, reference: true, categorie: true, duree: true, prix: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
      },
    });

    if (!facture) {
      return res.status(404).json({ error: 'Facture introuvable.' });
    }

    res.status(200).json({ success: true, facture });
  } catch (err) {
    next(err);
  }
};

exports.createFacture = async (req, res, next) => {
  try {
    const { client, formationId, sessionId, montant, tva, date, statut, datePaiement } = req.body;

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

    const count = await prisma.facture.count();
    const id = `FAC-${String(count + 1).padStart(3, '0')}`;

    const facture = await prisma.facture.create({
      data: {
        id,
        client,
        formationId: Number(formationId),
        sessionId: sessionId ? Number(sessionId) : null,
        montant: parseFloat(montant),
        tva: tva !== undefined ? parseFloat(tva) : null,
        date: new Date(date),
        statut: statut || 'EN_ATTENTE',
        datePaiement: datePaiement ? new Date(datePaiement) : null,
      },
      include: {
        formation: {
          select: { id: true, titre: true, reference: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès.',
      facture,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFacture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { client, montant, tva, statut, datePaiement } = req.body;

    const existing = await prisma.facture.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Facture introuvable.' });
    }

    const facture = await prisma.facture.update({
      where: { id },
      data: {
        ...(client !== undefined && { client }),
        ...(montant !== undefined && { montant: parseFloat(montant) }),
        ...(tva !== undefined && { tva: tva !== null ? parseFloat(tva) : null }),
        ...(statut && { statut }),
        ...(datePaiement !== undefined && { datePaiement: datePaiement ? new Date(datePaiement) : null }),
      },
      include: {
        formation: {
          select: { id: true, titre: true, reference: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Facture mise à jour avec succès.',
      facture,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFacture = async (req, res, next) => {
  try {
    const existing = await prisma.facture.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Facture introuvable.' });
    }

    await prisma.facture.delete({ where: { id: req.params.id } });

    res.status(200).json({ success: true, message: 'Facture supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
