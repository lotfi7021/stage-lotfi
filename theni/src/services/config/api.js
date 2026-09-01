import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS } from './apiConfig';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: DEFAULT_HEADERS,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserId');

      if (window.location.pathname !== '/connexion') {
        window.location.href = '/connexion';
      }
    }

    return Promise.reject(error);
  }
);

export default api;