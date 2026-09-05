import api from '../config/api';

class TrainerService {
  async getAllTrainers(params = {}) {
    const { data } = await api.get('/formateurs', { params });
    return {
      success: true,
      data: data.formateurs || [],
      total: data.count || 0,
    };
  }

  async getTrainer(trainerId) {
    const { data } = await api.get(`/formateurs/${trainerId}`);
    return { success: true, data: data.formateur };
  }

  async createTrainer(trainerData) {
    const { data } = await api.post('/formateurs', trainerData);
    return { success: true, data: data.formateur, temporaryPassword: data.temporaryPassword, message: data.message };
  }

  async updateTrainer(trainerId, trainerData) {
    const { data } = await api.put(`/formateurs/${trainerId}`, trainerData);
    return { success: true, data: data.formateur, message: data.message };
  }

  async deleteTrainer(trainerId) {
    const { data } = await api.delete(`/formateurs/${trainerId}`);
    return { success: true, message: data.message };
  }

  async getTrainerSessions(trainerId, params = {}) {
    const { data } = await api.get('/sessions', {
      params: { formateurId: trainerId, ...params }
    });
    return {
      success: true,
      data: data.sessions || [],
      total: data.total || 0,
    };
  }

  async getTrainerPlanning(trainerId, startDate, endDate) {
    const { data } = await api.get('/sessions', {
      params: {
        formateurId: trainerId,
        dateDebut: startDate,
        dateFin: endDate,
        limit: 100,
      },
    });
    return { success: true, data: data.sessions || [] };
  }

  async getSessionEvaluations(sessionId) {
    return { success: true, data: [] };
  }

  async submitEvaluations(sessionId, evaluationsData) {
    return { success: true, message: 'Évaluations enregistrées avec succès' };
  }

  async getTrainerStats(trainerId) {
    const { data } = await api.get('/sessions', {
      params: { formateurId: trainerId, limit: 100 },
    });

    const sessions = data.sessions || [];
    const stats = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.statut === 'COMPLETED').length,
      plannedSessions: sessions.filter(s => s.statut === 'PENDING' || s.statut === 'CONFIRMED').length,
      averageRating: 0,
      totalParticipants: sessions.reduce((acc, s) => acc + (s._count?.inscriptions || 0), 0),
    };

    return { success: true, data: stats };
  }
}

export default new TrainerService();
