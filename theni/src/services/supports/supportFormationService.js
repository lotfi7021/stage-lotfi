import api from '../config/api';

class SupportFormationService {
  async getAllSupports(params = {}) {
    const { data } = await api.get('/supports', { params });
    return {
      success: true,
      data: data.supports || [],
      total: data.total || 0,
    };
  }

  async getSupportById(id) {
    const { data } = await api.get(`/supports/${id}`);
    return { success: true, data: data.support };
  }

  async createSupport(supportData) {
    const { data } = await api.post('/supports', supportData);
    return { success: true, data: data.support, message: data.message };
  }

  async updateSupport(id, supportData) {
    const { data } = await api.put(`/supports/${id}`, supportData);
    return { success: true, data: data.support, message: data.message };
  }

  async deleteSupport(id) {
    const { data } = await api.delete(`/supports/${id}`);
    return { success: true, message: data.message };
  }
}

export default new SupportFormationService();
