import api from '../config/api';

class AuthService {
  async login({ identifiant, motDePasse, seSouvenir }) {
    try {
      const payload = {
        motDePasse,
        ...(identifiant.includes('@') ? { email: identifiant } : { matricule: identifiant }),
      };

      const { data } = await api.post('/auth/login', payload);

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
        redirectTo: this.getRedirectUrl(data.user.role)
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignorer les erreurs réseau lors de la déconnexion
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

  getRedirectUrl(role) {
    const roleUrls = {
      admin: '/dashboard',
      formateur: '/formateur/dashboard',
      participant: '/participant/dashboard'
    };
    return roleUrls[role] || '/connexion';
  }

  getToken() {
    return localStorage.getItem('userToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

export default new AuthService();