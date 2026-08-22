import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS } from './apiConfig';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: DEFAULT_HEADERS,
  withCredentials: true,
  timeout: 15000,
});

// Intercepteur : ajoute le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserId');
      
      // Redirection vers la page de connexion
      if (window.location.pathname !== '/connexion') {
        window.location.href = '/connexion';
      }
    }
    
    // Gestion des autres erreurs
    if (error.response?.status >= 500) {
      console.error('Erreur serveur:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;