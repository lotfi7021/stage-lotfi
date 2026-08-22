// =============================================================================
//  MOCK DATA — aligné sur le dictionnaire de données STEG Formation
//  Chaque objet reflète exactement les colonnes de la table BD correspondante
// =============================================================================

// ─── TABLE: roles ────────────────────────────────────────────────────────────
// Columns: id | nom_role | description | created_at
export const ROLES = [
  { id: 1, nom_role: 'Admin', description: 'Full access to all platform features.', created_at: '2024-01-01T08:00:00Z' },
  { id: 2, nom_role: 'Formateur', description: 'Manage training sessions, attendance, and evaluations.', created_at: '2024-01-01T08:00:00Z' },
  { id: 3, nom_role: 'Participant', description: 'View catalog and track own training progress.', created_at: '2024-01-01T08:00:00Z' },
];

// ─── TABLE: utilisateurs (users) ──────────────────────────────────────────────
// Columns: id | nom | prenom | email | mot_de_passe | matricule | genre | date_naissance | role_id | is_active | created_at
export const UTILISATEURS = [
  {
    id: 1,
    nom: 'Ben Salah',
    prenom: 'Ahmed',
    email: 'ahmed.bensalah@steg.com.tn',
    mot_de_passe: '$2b$10$hashed_password_1',
    matricule: 'STEG-2019-0042',
    genre: 'Male',
    date_naissance: '1985-03-14',
    role_id: 1, // Admin
    is_active: true,
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    id: 2,
    nom: 'Jlassi',
    prenom: 'Mohamed Amine',
    email: 'm.jlassi@steg.com.tn',
    mot_de_passe: '$2b$10$hashed_password_2',
    matricule: 'STEG-2021-0118',
    genre: 'Male',
    date_naissance: '1992-07-22',
    role_id: 3, // Participant
    is_active: true,
    created_at: '2024-02-01T08:30:00Z',
  },
  {
    id: 3,
    nom: 'Trabelsi',
    prenom: 'Fatima',
    email: 'f.trabelsi@steg.com.tn',
    mot_de_passe: '$2b$10$hashed_password_3',
    matricule: 'STEG-2020-0087',
    genre: 'Female',
    date_naissance: '1988-11-15',
    role_id: 2, // Formateur
    is_active: true,
    created_at: '2024-01-15T09:00:00Z',
  },
];

// Utilisateur actuellement connecté - Vous pouvez changer l'ID pour tester différents rôles
// ID 1 = Admin, ID 2 = Participant, ID 3 = Formateur
const getCurrentUser = () => {
  const storedUserId = localStorage.getItem('currentUserId');
  if (storedUserId) {
    const user = UTILISATEURS.find(u => u.id === parseInt(storedUserId));
    if (user) return user;
  }
  return UTILISATEURS[0]; // Par défaut Admin
};

export const CURRENT_USER = getCurrentUser();

// ─── TABLE: formateurs (trainers) ─────────────────────────────────────────────
// Columns: id | user_id | specialty | qualifications | availability


// ─── TABLE: formations (training programs) ───────────────────────────────────
// Columns: id | titre | objectifs | prerequis | duree_jours | prix_base | categorie | created_at
export const FORMATIONS = [
  {
    id: 1,
    titre: 'Electrical Safety Certification BR',
    objectifs: 'Master low voltage electrical safety protocols and risk assessment procedures.',
    prerequis: 'Basic electricity knowledge',
    duree_jours: 5,
    prix_base: 1200.00,
    categorie: 'Safety',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    titre: 'Project Management',
    objectifs: 'Lead complex projects within deadlines using proven methodologies.',
    prerequis: 'Team management experience',
    duree_jours: 3,
    prix_base: 900.00,
    categorie: 'Management',
    created_at: '2024-02-10T08:00:00Z',
  },
];

// ─── TABLE: sessions ──────────────────────────────────────────────────────────
// Columns: id | training_id | trainer_id | start_date | end_date | location | session_type | status
export const SESSIONS = [
  { id: 1, formation_id: 1, formateur_id: 3, date_debut: '2024-10-15', date_fin: '2024-10-19', lieu: 'Radès Training Center', type_session: 'Inter', statut: 'Planned' },
];

// ─── TABLE: inscriptions (enrollments) ────────────────────────────────────────
// Columns: id | participant_id | session_id | enrollment_date | enrollment_status
export const INSCRIPTIONS = [
  { id: 1, participant_id: 2, session_id: 1, date_inscription: '2024-09-20T10:00:00Z', statut_inscription: 'Confirmed' },
];

// ─── TABLE: presences (attendance) ────────────────────────────────────────────
// Columns: id | enrollment_id | date | present_training | present_cafeteria
export const PRESENCES = [
  { id: 1, inscription_id: 1, date_jour: '2024-10-15', present_cours: true, present_cantine: true },
];

// ─── TABLE: evaluations ───────────────────────────────────────────────────────
// Columns: id | enrollment_id | evaluation_type | grade | comments
export const EVALUATIONS = [
  { id: 1, inscription_id: 1, type_evaluation: 'Post-training', note: 17.00, commentaires: 'Excellent progress.' },
];

// ─── TABLE: reclamations (complaints) ─────────────────────────────────────────
// Columns: id | user_id | subject | description | status | creation_date
export const RECLAMATIONS = [
  { id: 1, utilisateur_id: 2, sujet: 'Insufficient meals at center', description: 'Meals served at Radès center were insufficient during the Oct 15 session.', statut: 'Open', date_creation: '2024-10-16T08:30:00Z' },
];

// ─── TABLE: certifications ────────────────────────────────────────────────────
// Columns: id | enrollment_id | issue_date | expiration_date | qr_code_token | electronic_signature
export const CERTIFICATIONS = [
  { id: 1, inscription_id: 1, date_obtention: '2024-10-20', date_expiration: '2026-10-20', qr_code_token: 'QRC-STEG-2024-001', signature_electronique: 'SIG-a1b2c3d4' },
];

// ─── TABLE: factures (invoices) ───────────────────────────────────────────────
// Columns: id | session_id | total_amount | purchase_order | payment_status | revenues | costs
export const FACTURES = [
  { id: 1, session_id: 1, montant_total: 18000.000, bon_de_commande: 'PO-2024-0142', statut_paiement: 'Paid', revenus: 18000.000, couts: 4500.000 },
];

// ─── TABLE: supports_formation (training materials) ───────────────────────────
// Columns: id | session_id | document_title | file_path | material_type | upload_date
export const SUPPORTS_FORMATION = [
  { id: 1, session_id: 1, titre_document: 'HV Safety Manual 2024', chemin_fichier: '/docs/hv_safety_manual_2024.pdf', type_support: 'Course Material', date_upload: '2024-10-10T08:00:00Z' },
];

// =============================================================================
//  DONNÉES DASHBOARD — agrégations calculées à partir des tables ci-dessus
// =============================================================================

// =============================================================================
//  DASHBOARD DATA — aggregated calculations from tables above
// =============================================================================

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

// Alias maintenus pour la compatibilité avec les pages existantes
export const USERS        = UTILISATEURS;
export const PARTICIPANTS = UTILISATEURS.filter((u) => u.role_id === 3);
