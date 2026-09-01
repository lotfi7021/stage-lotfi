import api from '../config/api';

class CertificationService {
  async getAllCertifications(params = {}) {
    const { data } = await api.get('/certifications', { params });
    return {
      success: true,
      data: data.certifications || [],
      total: data.total || 0,
    };
  }

  async getCertificationById(id) {
    const { data } = await api.get(`/certifications/${id}`);
    return { success: true, data: data.certification };
  }

  async createCertification(certificationData) {
    const { data } = await api.post('/certifications', certificationData);
    return { success: true, data: data.certification, message: data.message };
  }

  async updateCertification(id, certificationData) {
    const { data } = await api.put(`/certifications/${id}`, certificationData);
    return { success: true, data: data.certification, message: data.message };
  }

  async deleteCertification(id) {
    const { data } = await api.delete(`/certifications/${id}`);
    return { success: true, message: data.message };
  }
}

export default new CertificationService();
