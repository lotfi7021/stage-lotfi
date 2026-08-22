import api from '../config/api';

class AuthService {
  // Connexion réelle vers le backend
  async login({ identifiant, motDePasse, seSouvenir }) {
    try {
      const payload = {
        motDePasse,
        ...(identifiant.includes('@') ? { email: identifiant } : { matricule: identifiant }),
      };

      const { data } = await api.post('/auth/login', payload);

      // Stocker les informations de session
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('currentUserId', data.user.id.toString());

      if (seSouvenir) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return {
        user: data.user,
        token: data.token,
        redirectTo: this.getRedirectUrl(data.user.role_id || data.user.roleId)
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  // Inscription réelle vers le backend
  async register(userData) {
    try {
      const { confirmationMotDePasse, ...payload } = userData;
      const { data } = await api.post('/auth/register', payload);
      
      return {
        user: data.user,
        message: data.message || 'Compte créé avec succès'
      };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du compte');
    }
  }

  // Déconnexion vers le backend puis nettoyage local
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignorer les erreurs réseau lors de la déconnexion
      console.warn('Erreur lors de la déconnexion:', err);
    } finally {
      this.clearSession();
    }
  }

  clearSession() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('rememberMe');
  }

  // Obtenir l'URL de redirection selon le rôle
  getRedirectUrl(roleId) {
    const roleUrls = {
      1: '/dashboard',           // Admin → Interface Admin
      2: '/formateur/dashboard', // Formateur → Interface Formateur
      3: '/participant/dashboard' // Participant → Interface Participant
    };
    return roleUrls[roleId] || '/participant/dashboard';
  }

  getToken() {
    return localStorage.getItem('userToken');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('Erreur lors du parsing de currentUser:', err);
      return null;
    }
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const { data } = await api.post('/auth/refresh');
      localStorage.setItem('userToken', data.token);
      return data.token;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.clearSession();
      throw error;
    }
  }
}

export default new AuthService();