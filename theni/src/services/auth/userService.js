import api from '../config/api';

class UserService {
  async getAllUsers(params = {}) {
    const { data } = await api.get('/users', { params });
    return { success: true, data: data.users, total: data.total, ...data };
  }

  async getUserById(id) {
    const { data } = await api.get(`/users/${id}`);
    return { success: true, data: data.user };
  }

  async createUser(userData) {
    const { data } = await api.post('/users', userData);
    return { success: true, data: data.user, message: data.message };
  }

  async updateUser(id, userData) {
    const { data } = await api.put(`/users/${id}`, userData);
    return { success: true, data: data.user, message: data.message };
  }

  async toggleUserStatus(id, isActive) {
    const { data } = await api.patch(`/users/${id}/status`, { isActive });
    return { success: true, data: data.user, message: data.message };
  }

  async deleteUser(id) {
    const { data } = await api.delete(`/users/${id}`);
    return { success: true, message: data.message };
  }

  async searchUsers(filters = {}) {
    return this.getAllUsers(filters);
  }
}

export default new UserService();
