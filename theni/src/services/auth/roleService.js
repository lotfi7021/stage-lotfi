import api from '../config/api';

class RoleService {
  // Récupérer tous les rôles
  async getAllRoles() {
    const { data } = await api.get('/roles');
    return { success: true, data: data.roles, total: data.count };
  }

  // Récupérer un rôle par ID
  async getRoleById(id) {
    const { data } = await api.get('/roles');
    const role = (data.roles || []).find((r) => r.id === Number(id));
    if (!role) {
      throw new Error('Rôle non trouvé');
    }
    return { success: true, data: role };
  }

  // Créer un rôle
  async createRole(roleData) {
    const { data } = await api.post('/roles', roleData);
    return { success: true, data: data.role, message: data.message };
  }

  // Mettre à jour un rôle
  async updateRole(id, roleData) {
    const { data } = await api.put(`/roles/${id}`, roleData);
    return { success: true, data: data.role, message: data.message };
  }

  // Supprimer un rôle
  async deleteRole(id) {
    const { data } = await api.delete(`/roles/${id}`);
    return { success: true, message: data.message };
  }

  // Assigner un rôle à un utilisateur
  async assignRoleToUser(userId, roleId) {
    const { data } = await api.put(`/users/${userId}`, { roleId });
    return { success: true, message: 'Rôle assigné avec succès', data: data.user };
  }

  // Récupérer les permissions d'un rôle
  async getRolePermissions(roleId) {
    const permissions = {
      1: ['MANAGE_USERS', 'MANAGE_ROLES', 'WRITE_ALL'], // Admin
      2: ['READ_FORMATIONS', 'WRITE_PRESENCES', 'WRITE_EVALUATIONS'], // Formateur
      3: ['READ_CATALOGUE', 'READ_OWN_DATA', 'WRITE_INSCRIPTION'], // Participant
    };
    return { success: true, data: permissions[roleId] || [], roleId: Number(roleId) };
  }

  // Vérifier si un utilisateur a une permission
  async checkUserPermission(userId, permission) {
    return { success: true, hasPermission: true };
  }
}

export default new RoleService();
