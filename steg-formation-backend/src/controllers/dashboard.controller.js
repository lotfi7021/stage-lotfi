const prisma = require('../config/prisma');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalFormations,
      activeFormations,
      totalParticipants,
      totalSessions,
      plannedSessions,
      completedSessions,
      totalInscriptions,
      totalCertifications,
      totalFactures,
      facturesPayees,
      totalMontant,
      montantPaye,
    ] = await Promise.all([
      prisma.formation.count(),
      prisma.formation.count({ where: { statut: { in: ['ACTIVE', 'IN_PROGRESS'] } } }),
      prisma.utilisateur.count({ where: { role: { nomRole: 'participant' }, isActive: true } }),
      prisma.session.count(),
      prisma.session.count({ where: { statut: { in: ['PENDING', 'CONFIRMED'] } } }),
      prisma.session.count({ where: { statut: 'COMPLETED' } }),
      prisma.inscription.count(),
      prisma.certification.count({ where: { statut: 'VALIDE' } }),
      prisma.facture.count(),
      prisma.facture.count({ where: { statut: 'PAYEE' } }),
      prisma.facture.aggregate({ _sum: { montant: true } }),
      prisma.facture.aggregate({ _sum: { montant: true }, where: { statut: 'PAYEE' } }),
    ]);

    const satisfactionRate = 0;

    const collectionRate = totalFactures > 0
      ? Math.round((facturesPayees / totalFactures) * 100 * 10) / 10
      : 0;

    const totalRevenue = Number(totalMontant._sum.montant || 0);
    const paidRevenue = Number(montantPaye._sum.montant || 0);

    res.status(200).json({
      success: true,
      stats: {
        totalFormations,
        activeFormations,
        totalParticipants,
        totalSessions,
        plannedSessions,
        completedSessions,
        totalInscriptions,
        totalCertifications,
        totalFactures,
        facturesPayees,
        totalRevenue,
        paidRevenue,
        satisfactionRate,
        collectionRate,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUpcomingSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { statut: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { dateDebut: 'asc' },
      take: 10,
      include: {
        formation: { select: { id: true, titre: true, reference: true, categorie: true } },
        formateur: {
          select: { id: true, utilisateur: { select: { id: true, nom: true, prenom: true } } },
        },
        _count: { select: { inscriptions: true } },
      },
    });

    const result = sessions.map((s) => ({
      id: s.id,
      formation: s.formation.titre,
      reference: s.formation.reference,
      categorie: s.formation.categorie,
      formateur: `${s.formateur.utilisateur.prenom} ${s.formateur.utilisateur.nom}`,
      dateDebut: s.dateDebut,
      dateFin: s.dateFin,
      lieu: s.lieu,
      statut: s.statut,
      participants: `${s._count.inscriptions}/${s.maxParticipants || '∞'}`,
    }));

    res.status(200).json({ success: true, sessions: result });
  } catch (err) {
    next(err);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const recentInscriptions = await prisma.inscription.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        participant: { select: { nom: true, prenom: true } },
        session: {
          select: { formation: { select: { titre: true } } },
        },
      },
    });

    const recentCertifications = await prisma.certification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        participant: { select: { nom: true, prenom: true } },
        formation: { select: { titre: true } },
      },
    });

    const activities = [];

    recentInscriptions.forEach((ins) => {
      activities.push({
        id: `ins-${ins.id}`,
        type: 'inscription',
        text: `Nouvelle inscription: ${ins.participant.prenom} ${ins.participant.nom} — ${ins.session.formation.titre}`,
        date: ins.createdAt,
      });
    });

    recentCertifications.forEach((cert) => {
      activities.push({
        id: `cert-${cert.id}`,
        type: 'completed',
        text: `Certification délivrée: ${cert.participant.prenom} ${cert.participant.nom} — ${cert.formation.titre}`,
        date: cert.createdAt,
      });
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, activities: activities.slice(0, 8) });
  } catch (err) {
    next(err);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();

    const participantsByMonth = await prisma.inscription.groupBy({
      by: ['dateInscription'],
      where: {
        dateInscription: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31),
        },
      },
      _count: { id: true },
    });

    const monthlyCounts = new Array(12).fill(0);
    participantsByMonth.forEach((p) => {
      const month = new Date(p.dateInscription).getMonth();
      monthlyCounts[month] += p._count.id;
    });

    const categories = await prisma.formation.groupBy({
      by: ['categorie'],
      _count: { id: true },
    });

    const categoryLabels = categories.map((c) => c.categorie);
    const categoryValues = categories.map((c) => c._count.id);

    res.status(200).json({
      success: true,
      chartData: {
        participantsTrend: {
          labels: months.slice(0, 6),
          values: monthlyCounts.slice(0, 6),
        },
        categoryBreakdown: {
          labels: categoryLabels.length > 0 ? categoryLabels : ['Safety', 'Management'],
          values: categoryValues.length > 0 ? categoryValues : [60, 40],
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
