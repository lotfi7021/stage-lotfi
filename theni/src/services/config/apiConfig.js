// Configuration de l'API - Points de connexion avec le back-end
export const API_CONFIG = {
  // URL de base de votre API back-end (proxy Vite)
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  
  // Endpoints d'authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },

  // Endpoints des utilisateurs
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    CHANGE_PASSWORD: (id) => `/users/${id}/change-password`
  },

  // Endpoints des formations
  FORMATIONS: {
    LIST: '/formations',
    CREATE: '/formations',
    GET: (id) => `/formations/${id}`,
    UPDATE: (id) => `/formations/${id}`,
    DELETE: (id) => `/formations/${id}`,
    SEARCH: '/formations/search'
  },

  // Endpoints des sessions
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions',
    GET: (id) => `/sessions/${id}`,
    UPDATE: (id) => `/sessions/${id}`,
    DELETE: (id) => `/sessions/${id}`,
    BY_FORMATION: (formationId) => `/formations/${formationId}/sessions`
  },

  // Endpoints des inscriptions
  INSCRIPTIONS: {
    LIST: '/inscriptions',
    CREATE: '/inscriptions',
    GET: (id) => `/inscriptions/${id}`,
    UPDATE: (id) => `/inscriptions/${id}`,
    DELETE: (id) => `/inscriptions/${id}`,
    BY_USER: (userId) => `/users/${userId}/inscriptions`,
    BY_SESSION: (sessionId) => `/sessions/${sessionId}/inscriptions`
  },

  // Endpoints des présences
  PRESENCES: {
    LIST: '/presences',
    CREATE: '/presences',
    GET: (id) => `/presences/${id}`,
    UPDATE: (id) => `/presences/${id}`,
    BY_SESSION: (sessionId) => `/sessions/${sessionId}/presences`
  },

  // Endpoints des évaluations
  EVALUATIONS: {
    LIST: '/evaluations',
    CREATE: '/evaluations',
    GET: (id) => `/evaluations/${id}`,
    UPDATE: (id) => `/evaluations/${id}`,
    BY_INSCRIPTION: (inscriptionId) => `/inscriptions/${inscriptionId}/evaluations`
  },

  // Endpoints des certificats
  CERTIFICATIONS: {
    LIST: '/certifications',
    CREATE: '/certifications',
    GET: (id) => `/certifications/${id}`,
    BY_USER: (userId) => `/users/${userId}/certifications`,
    DOWNLOAD: (id) => `/certifications/${id}/download`
  },

  // Endpoints dashboard et statistiques
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHART_DATA: '/dashboard/charts',
    RECENT_ACTIVITY: '/dashboard/activity'
  },

  // Endpoints upload de fichiers
  UPLOAD: {
    DOCUMENTS: '/upload/documents',
    AVATARS: '/upload/avatars'
  }
};

// Configuration des headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Configuration pour l'upload de fichiers
export const UPLOAD_HEADERS = {
  'Content-Type': 'multipart/form-data'
};