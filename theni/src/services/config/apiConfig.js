export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',

  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },

  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
  },

  FORMATIONS: {
    LIST: '/formations',
  },

  SESSIONS: {
    LIST: '/sessions',
  },

  INSCRIPTIONS: {
    LIST: '/inscriptions',
    BY_PARTICIPANT: (participantId) => `/inscriptions/participant/${participantId}`,
  },

  PRESENCES: {
    LIST: '/presences',
    BY_SESSION: (sessionId) => `/presences/session/${sessionId}`,
  },

  FORMATEURS: {
    LIST: '/formateurs',
  },

  ROLES: {
    LIST: '/roles',
  },

  EVALUATIONS: {
    LIST: '/evaluations',
    GET: (id) => `/evaluations/${id}`,
  },

  CERTIFICATIONS: {
    LIST: '/certifications',
    GET: (id) => `/certifications/${id}`,
  },

  RECLAMATIONS: {
    LIST: '/reclamations',
    GET: (id) => `/reclamations/${id}`,
  },

  FACTURES: {
    LIST: '/factures',
    GET: (id) => `/factures/${id}`,
  },

  SUPPORTS: {
    LIST: '/supports',
    GET: (id) => `/supports/${id}`,
  },

  DASHBOARD: {
    STATS: '/dashboard/stats',
    UPCOMING_SESSIONS: '/dashboard/upcoming-sessions',
    ACTIVITY: '/dashboard/activity',
    CHARTS: '/dashboard/charts',
  },
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};