import api from '../config/api';

class FactureService {
  async getAllFactures(params = {}) {
    const { data } = await api.get('/factures', { params });
    return {
      success: true,
      data: data.factures || [],
      total: data.total || 0,
    };
  }

  async getFactureById(id) {
    const { data } = await api.get(`/factures/${id}`);
    return { success: true, data: data.facture };
  }

  async createFacture(factureData) {
    const { data } = await api.post('/factures', factureData);
    return { success: true, data: data.facture, message: data.message };
  }

  async updateFacture(id, factureData) {
    const { data } = await api.put(`/factures/${id}`, factureData);
    return { success: true, data: data.facture, message: data.message };
  }

  async deleteFacture(id) {
    const { data } = await api.delete(`/factures/${id}`);
    return { success: true, message: data.message };
  }

  async searchFactures(filters = {}) {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.statut) params.statut = filters.statut;
    if (filters.formationId) params.formationId = filters.formationId;
    params.page = filters.page || 1;
    params.limit = filters.limit || 20;

    const { data } = await api.get('/factures', { params });
    return {
      success: true,
      data: data.factures || [],
      total: data.total || 0,
    };
  }
}

export default new FactureService();
