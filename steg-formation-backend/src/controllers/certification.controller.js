const prisma = require('../config/prisma');
const { generateMatricule } = require('../utils/matricule');

exports.getCertifications = async (req, res, next) => {
  try {
    const { search, statut, formationId, participantId, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (req.user.role === 'formateur') {
      const formateur = await prisma.formateur.findUnique({
        where: { utilisateurId: req.user.id },
      });
      if (formateur) {
        where.formateurId = formateur.id;
      }
    }

    if (search) {
      where.OR = [
        { participant: { nom: { contains: search } } },
        { participant: { prenom: { contains: search } } },
        { reference: { contains: search } },
        { formation: { titre: { contains: search } } },
      ];
    }

    if (statut) where.statut = statut;
    if (formationId) where.formationId = Number(formationId);
    if (participantId) where.participantId = Number(participantId);

    const [certifications, total] = await Promise.all([
      prisma.certification.findMany({
        where,
        orderBy: [{ dateEmission: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
        include: {
          participant: {
            select: { id: true, nom: true, prenom: true, email: true, matricule: true },
          },
          formation: {
            select: { id: true, titre: true, reference: true, categorie: true, duree: true },
          },
          session: {
            select: { id: true, dateDebut: true, dateFin: true, lieu: true },
          },
        },
      }),
      prisma.certification.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: certifications.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      certifications,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCertificationById = async (req, res, next) => {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        participant: {
          select: { id: true, nom: true, prenom: true, email: true, matricule: true, genre: true },
        },
        formation: {
          select: { id: true, titre: true, reference: true, categorie: true, duree: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
      },
    });

    if (!certification) {
      return res.status(404).json({ error: 'Certification introuvable.' });
    }

    res.status(200).json({ success: true, certification });
  } catch (err) {
    next(err);
  }
};

exports.createCertification = async (req, res, next) => {
  try {
    const { participantId, formationId, sessionId, dateEmission, dateExpiration, qrCode } = req.body;

    const formateur = await prisma.formateur.findUnique({
      where: { utilisateurId: req.user.id },
    });
    if (!formateur) {
      return res.status(404).json({ error: 'Profil formateur introuvable.' });
    }

    const participant = await prisma.utilisateur.findUnique({ where: { id: Number(participantId) } });
    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    const formation = await prisma.formation.findUnique({ where: { id: Number(formationId) } });
    if (!formation) {
      return res.status(404).json({ error: 'Formation introuvable.' });
    }

    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable.' });
    }

    if (session.formateurId !== formateur.id) {
      return res.status(403).json({ error: 'Vous ne pouvez créer des certificats que pour vos propres sessions.' });
    }

    const reference = `CERT-${generateMatricule()}`;

    const certification = await prisma.certification.create({
      data: {
        reference,
        participantId: Number(participantId),
        formationId: Number(formationId),
        sessionId: Number(sessionId),
        formateurId: formateur.id,
        dateEmission: new Date(dateEmission),
        dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
        qrCode: qrCode || null,
      },
      include: {
        participant: {
          select: { id: true, nom: true, prenom: true, matricule: true },
        },
        formation: {
          select: { id: true, titre: true, reference: true },
        },
        session: {
          select: { id: true, dateDebut: true, dateFin: true, lieu: true },
        },
        formateur: {
          include: { utilisateur: { select: { nom: true, prenom: true } } },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Certification créée avec succès.',
      certification,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut, dateExpiration, qrCode } = req.body;

    const existing = await prisma.certification.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Certification introuvable.' });
    }

    const certification = await prisma.certification.update({
      where: { id: Number(id) },
      data: {
        ...(statut && { statut }),
        ...(dateExpiration !== undefined && { dateExpiration: dateExpiration ? new Date(dateExpiration) : null }),
        ...(qrCode !== undefined && { qrCode: qrCode || null }),
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
      message: 'Certification mise à jour avec succès.',
      certification,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCertification = async (req, res, next) => {
  try {
    const existing = await prisma.certification.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Certification introuvable.' });
    }

    await prisma.certification.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({ success: true, message: 'Certification supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};
