import api from '../config/api';

class EvaluationService {
  async getAllEvaluations(params = {}) {
    const { data } = await api.get('/evaluations', { params });
    return {
      success: true,
      data: data.evaluations || [],
      total: data.total || 0,
    };
  }

  async getEvaluationById(id) {
    const { data } = await api.get(`/evaluations/${id}`);
    return { success: true, data: data.evaluation };
  }

  async createEvaluation(evaluationData) {
    const { data } = await api.post('/evaluations', evaluationData);
    return { success: true, data: data.evaluation, message: data.message };
  }

  async updateEvaluation(id, evaluationData) {
    const { data } = await api.put(`/evaluations/${id}`, evaluationData);
    return { success: true, data: data.evaluation, message: data.message };
  }

  async deleteEvaluation(id) {
    const { data } = await api.delete(`/evaluations/${id}`);
    return { success: true, message: data.message };
  }
}

export default new EvaluationService();
