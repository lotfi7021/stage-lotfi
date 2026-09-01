// =============================================================================
//  MOCK DATA — données de démonstration pour les pages non connectées à l'API
// =============================================================================

// ─── Dashboard Admin ─────────────────────────────────────────────────────────
export const DASHBOARD_STATS = {
  activeFormations: 2,
  totalParticipants: 2,
  plannedSessions: 1,
  satisfactionRate: 94.5,
  trends: {
    formations: '+12%',
    participants: '+5%',
    sessions: '+1',
    satisfaction: '+0.5%',
  },
};

export const UPCOMING_SESSIONS = [
  { id: 1, formation: 'Electrical Safety Certification BR', trainer: 'Ahmed Ben Salah', date: '15 Oct 2024', participants: '1/15', status: 'Planned' },
];

export const DASHBOARD_ACTIVITY = [
  { id: 1, type: 'inscription', text: "New enrollment: Mohamed Amine enrolled in Electrical Safety Certification BR", time: '2 hours ago' },
];

export const CHART_DATA = {
  participantsTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [10, 15, 12, 18, 16, 20],
  },
  categoryBreakdown: {
    labels: ['Safety', 'Management'],
    values: [60, 40],
  },
};

// ─── Finance ─────────────────────────────────────────────────────────────────
export const SESSIONS = [
  { id: 1, formation_id: 1, formateur_id: 3, date_debut: '2024-10-15', date_fin: '2024-10-19', lieu: 'Radès Training Center', type_session: 'Inter', statut: 'Planned' },
];

export const FORMATIONS = [];

export const FACTURES = [
  { id: 1, session_id: 1, montant_total: 18000.000, bon_de_commande: 'PO-2024-0142', statut_paiement: 'Paid', revenus: 18000.000, couts: 4500.000 },
];

// ─── Certificats Participant ────────────────────────────────────────────────
export const INSCRIPTIONS = [
  { id: 1, participant_id: 2, session_id: 1, date_inscription: '2024-09-20T10:00:00Z', statut_inscription: 'Confirmed' },
];

export const CERTIFICATIONS = [
  { id: 1, inscription_id: 1, date_obtention: '2024-10-20', date_expiration: '2026-10-20', qr_code_token: 'QRC-STEG-2024-001', signature_electronique: 'SIG-a1b2c3d4' },
];

export const UTILISATEURS = [
  {
    id: 1,
    nom: 'Ben Salah',
    prenom: 'Ahmed',
    email: 'ahmed.bensalah@steg.com.tn',
    matricule: 'STEG-2019-0042',
    genre: 'Male',
    role_id: 1,
    is_active: true,
  },
  {
    id: 2,
    nom: 'Jlassi',
    prenom: 'Mohamed Amine',
    email: 'm.jlassi@steg.com.tn',
    matricule: 'STEG-2021-0118',
    genre: 'Male',
    role_id: 3,
    is_active: true,
  },
];

const getCurrentUser = () => {
  const storedUserId = localStorage.getItem('currentUserId');
  if (storedUserId) {
    const user = UTILISATEURS.find(u => u.id === parseInt(storedUserId));
    if (user) return user;
  }
  return UTILISATEURS[0];
};

export const CURRENT_USER = getCurrentUser();
