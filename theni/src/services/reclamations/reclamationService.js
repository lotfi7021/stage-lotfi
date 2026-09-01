import api from '../config/api';

class ReclamationService {
  async getAllReclamations(params = {}) {
    const { data } = await api.get('/reclamations', { params });
    return {
      success: true,
      data: data.reclamations || [],
      total: data.total || 0,
    };
  }

  async getReclamationById(id) {
    const { data } = await api.get(`/reclamations/${id}`);
    return { success: true, data: data.reclamation };
  }

  async createReclamation(reclamationData) {
    const { data } = await api.post('/reclamations', reclamationData);
    return { success: true, data: data.reclamation, message: data.message };
  }

  async updateReclamation(id, reclamationData) {
    const { data } = await api.put(`/reclamations/${id}`, reclamationData);
    return { success: true, data: data.reclamation, message: data.message };
  }

  async deleteReclamation(id) {
    const { data } = await api.delete(`/reclamations/${id}`);
    return { success: true, message: data.message };
  }
}

export default new ReclamationService();
