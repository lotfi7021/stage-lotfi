// ─── TABLE: roles ─────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:       'Admin',
  FORMATEUR:   'Trainer',
  PARTICIPANT: 'Participant',
  MANAGER:     'Manager',
};

// ─── Labels for StatusBadge component ─────────────────────────────────────────
export const STATUS_LABELS = {
  PLANNED: 'Planned',
  CONFIRMED: 'Confirmed',
  FULL: 'Full',
  COMPLETED: 'Completed',
  ONGOING: 'Ongoing',
  ACTIVE: 'Active',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
  INACTIF: 'Inactive',
  INACTIVE: 'Inactive',
};

// ─── TABLE: formations — status ────────────────────────────────────────────────
export const FORMATION_STATUS = {
  PLANIFIEE:  'Planned',
  EN_COURS:   'Ongoing',
  TERMINEE:   'Completed',
  ANNULEE:    'Cancelled',
};

// ─── TABLE: sessions — session_type ────────────────────────────────────────────
export const SESSION_TYPE = {
  INTRA:     'Intra',
  INTER:     'Inter',
  CATALOGUE: 'Catalog',
};

// ─── TABLE: sessions — status ──────────────────────────────────────────────────
export const SESSION_STATUS = {
  PLANIFIEE: 'Planned',
  EN_COURS:  'Ongoing',
  TERMINEE:  'Completed',
  ANNULEE:   'Cancelled',
};

// ─── TABLE: inscriptions — enrollment_status ──────────────────────────────────
export const INSCRIPTION_STATUS = {
  INSCRIT:  'Enrolled',
  VALIDE:   'Confirmed',
  ANNULE:   'Cancelled',
};

// ─── TABLE: evaluations — evaluation_type ──────────────────────────────────────
export const EVALUATION_TYPE = {
  PRE_FORMATION:  'Pre-training',
  POST_FORMATION: 'Post-training',
  SATISFACTION:   'Satisfaction',
};

// ─── TABLE: reclamations — status ──────────────────────────────────────────────
export const RECLAMATION_STATUS = {
  OUVERTE:  'Open',
  EN_COURS: 'In Progress',
  RESOLUE:  'Resolved',
};

// ─── TABLE: factures — payment_status ──────────────────────────────────────────
export const FACTURE_STATUS = {
  PAYEE:      'Paid',
  EN_ATTENTE: 'Pending',
  EN_RETARD:  'Overdue',
};

// ─── TABLE: supports_formation — material_type ─────────────────────────────────
export const SUPPORT_TYPE = {
  PDF:            'PDF',
  VIDEO:          'Video',
  SUPPORT_COURS:  'Course Material',
  CV_FORMATEUR:   'Trainer CV',
};

// ─── Display colors ────────────────────────────────────────────────────────────
export const COLORS = {
  session_status: {
    'Planned':    'bg-blue-100 text-blue-700 border-blue-200',
    'Ongoing':    'bg-orange-100 text-orange-700 border-orange-200',
    'Completed':  'bg-green-100 text-green-700 border-green-200',
    'Cancelled':  'bg-red-100 text-red-700 border-red-200',
  },
  inscription_status: {
    'Enrolled':   'bg-blue-100 text-blue-700',
    'Confirmed':  'bg-green-100 text-green-700',
    'Cancelled':  'bg-red-100 text-red-700',
  },
  facture_status: {
    'Paid':      'bg-green-100 text-green-800 border border-green-200',
    'Pending':   'bg-amber-100 text-amber-800 border border-amber-200',
    'Overdue':   'bg-red-100 text-red-800 border border-red-200',
  },
};
