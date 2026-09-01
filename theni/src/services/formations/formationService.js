import api from '../config/api';

class FormationService {
  async getAllFormations(params = {}) {
    const { data } = await api.get('/formations', { params });
    return {
      success: true,
      data: data.formations || [],
      total: data.total || 0,
    };
  }

  async getFormationById(id) {
    const { data } = await api.get(`/formations/${id}`);
    return { success: true, data: data.formation };
  }

  async createFormation(formationData) {
    const { data } = await api.post('/formations', formationData);
    return { success: true, data: data.formation, message: data.message };
  }

  async updateFormation(id, formationData) {
    const { data } = await api.put(`/formations/${id}`, formationData);
    return { success: true, data: data.formation, message: data.message };
  }

  async deleteFormation(id) {
    const { data } = await api.delete(`/formations/${id}`);
    return { success: true, message: data.message };
  }

  async searchFormations(filters = {}) {
    const params = {};
    if (filters.categorie) params.categorie = filters.categorie;
    if (filters.search) params.search = filters.search;
    if (filters.statut) params.statut = filters.statut;
    params.page = filters.page || 1;
    params.limit = filters.limit || 20;

    const { data } = await api.get('/formations', { params });
    return {
      success: true,
      data: data.formations || [],
      total: data.total || 0,
    };
  }

  async getFormationSessions(formationId) {
    const { data } = await api.get('/sessions', {
      params: { formationId, limit: 100 }
    });
    return {
      success: true,
      data: data.sessions || [],
      total: data.total || 0,
    };
  }
}

export default new FormationService();
