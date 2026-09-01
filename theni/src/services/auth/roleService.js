import api from '../config/api';

class RoleService {
  async getAllRoles() {
    const { data } = await api.get('/roles');
    return { success: true, data: data.roles, total: data.count };
  }

  async getRoleById(id) {
    const { data } = await api.get('/roles');
    const role = (data.roles || []).find((r) => r.id === Number(id));
    if (!role) {
      throw new Error('Rôle non trouvé');
    }
    return { success: true, data: role };
  }

  async createRole(roleData) {
    const { data } = await api.post('/roles', roleData);
    return { success: true, data: data.role, message: data.message };
  }

  async updateRole(id, roleData) {
    const { data } = await api.put(`/roles/${id}`, roleData);
    return { success: true, data: data.role, message: data.message };
  }

  async deleteRole(id) {
    const { data } = await api.delete(`/roles/${id}`);
    return { success: true, message: data.message };
  }

  async assignRoleToUser(userId, roleId) {
    const { data } = await api.put(`/users/${userId}`, { roleId });
    return { success: true, message: 'Rôle assigné avec succès', data: data.user };
  }
}

export default new RoleService();
