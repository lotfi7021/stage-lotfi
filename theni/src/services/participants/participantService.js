import api from '../config/api';

class ParticipantService {
  async getAllParticipants(params = {}) {
    const { data } = await api.get('/users', {
      params: { ...params, role: 'Participant' }
    });
    return {
      success: true,
      data: data.users || [],
      total: data.total || 0,
    };
  }

  async getParticipantInscriptions(participantId, params = {}) {
    const { data } = await api.get(`/inscriptions/participant/${participantId}`, { params });
    return {
      success: true,
      data: data.inscriptions || [],
      total: data.total || 0,
    };
  }

  async enrollParticipant(participantId, sessionId) {
    const { data } = await api.post('/inscriptions', {
      participantId: parseInt(participantId),
      sessionId: parseInt(sessionId),
    });
    return {
      success: true,
      data: data.inscription,
      message: data.message || 'Inscription réussie'
    };
  }

  async cancelEnrollment(inscriptionId) {
    const { data } = await api.delete(`/inscriptions/${inscriptionId}`);
    return {
      success: true,
      message: data.message || 'Inscription annulée avec succès'
    };
  }

  async updateInscriptionStatus(inscriptionId, statut) {
    const { data } = await api.put(`/inscriptions/${inscriptionId}`, { statut });
    return {
      success: true,
      data: data.inscription,
      message: data.message || 'Statut mis à jour'
    };
  }

  async getAllInscriptions(params = {}) {
    const { data } = await api.get('/inscriptions', { params });
    return {
      success: true,
      data: data.inscriptions || [],
      total: data.total || 0,
    };
  }

  async getCatalog(filters = {}) {
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

  async getParticipantStats(participantId) {
    const { data } = await api.get(`/inscriptions/participant/${participantId}`, { params: { limit: 100 } });
    const inscriptions = data.inscriptions || [];

    const stats = {
      totalInscriptions: inscriptions.length,
      completedTrainings: inscriptions.filter(i => i.statut === 'ATTENDED').length,
      pendingTrainings: inscriptions.filter(i => i.statut === 'ENROLLED' || i.statut === 'CONFIRMED').length,
      cancelledTrainings: inscriptions.filter(i => i.statut === 'CANCELLED').length,
    };

    return { success: true, data: stats };
  }
}

export default new ParticipantService();
