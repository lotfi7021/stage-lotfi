import api from '../config/api';

class UserService {
  // Récupérer tous les utilisateurs (paginé, avec filtres)
  async getAllUsers(params = {}) {
    const { data } = await api.get('/users', { params });
    return { success: true, data: data.users, total: data.total, ...data };
  }

  // Récupérer un utilisateur par ID
  async getUserById(id) {
    const { data } = await api.get(`/users/${id}`);
    return { success: true, data: data.user };
  }

  // Créer un utilisateur
  async createUser(userData) {
    const { data } = await api.post('/users', userData);
    return { success: true, data: data.user, message: data.message };
  }

  // Mettre à jour un utilisateur
  async updateUser(id, userData) {
    const { data } = await api.put(`/users/${id}`, userData);
    return { success: true, data: data.user, message: data.message };
  }

  // Activer / désactiver un compte
  async toggleUserStatus(id, isActive) {
    const { data } = await api.patch(`/users/${id}/status`, { isActive });
    return { success: true, data: data.user, message: data.message };
  }

  // Supprimer un utilisateur
  async deleteUser(id) {
    const { data } = await api.delete(`/users/${id}`);
    return { success: true, message: data.message };
  }

  // Filtrer / rechercher des utilisateurs
  async searchUsers(filters = {}) {
    return this.getAllUsers(filters);
  }
}

export default new UserService();
