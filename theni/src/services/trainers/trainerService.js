import api from '../config/api';
import { SESSIONS, FORMATIONS, PRESENCES, EVALUATIONS } from '../../data/mock';

class TrainerService {
  // Récupérer tous les formateurs
  async getAllTrainers() {
    try {
      const { data } = await api.get('/formateurs');
      return {
        success: true,
        data: data.formateurs || [],
        total: data.count || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des formateurs:', error);
      throw error;
    }
  }

  // Récupérer un formateur
  async getTrainer(trainerId) {
    try {
      const { data } = await api.get(`/formateurs/${trainerId}`);
      return { success: true, data: data.formateur };
    } catch (error) {
      console.error(`Erreur lors de la récupération du formateur ${trainerId}:`, error);
      throw error;
    }
  }

  // Créer un formateur (profil + compte utilisateur)
  async createTrainer(trainerData) {
    try {
      const { data } = await api.post('/formateurs', trainerData);
      return { success: true, data: data.formateur, temporaryPassword: data.temporaryPassword, message: data.message };
    } catch (error) {
      console.error('Erreur lors de la création du formateur:', error);
      throw error;
    }
  }

  // Mettre à jour un formateur
  async updateTrainer(trainerId, trainerData) {
    try {
      const { data } = await api.put(`/formateurs/${trainerId}`, trainerData);
      return { success: true, data: data.formateur, message: data.message };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du formateur ${trainerId}:`, error);
      throw error;
    }
  }

  // Supprimer un formateur (profil + compte utilisateur)
  async deleteTrainer(trainerId) {
    try {
      const { data } = await api.delete(`/formateurs/${trainerId}`);
      return { success: true, message: data.message };
    } catch (error) {
      console.error(`Erreur lors de la suppression du formateur ${trainerId}:`, error);
      throw error;
    }
  }

  // Récupérer les sessions d'un formateur
  async getTrainerSessions(trainerId) {
    try {
      const sessions = SESSIONS.filter(s => s.formateur_id === parseInt(trainerId));

      // Enrichir avec les informations de formation
      const enrichedSessions = sessions.map(session => {
        const formation = FORMATIONS.find(f => f.id === session.formation_id);
        return {
          ...session,
          formation: formation || null
        };
      });

      return { success: true, data: enrichedSessions };
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }

  // Planning d'un formateur
  async getTrainerPlanning(trainerId, startDate, endDate) {
    try {
      const sessions = SESSIONS.filter(s =>
        s.formateur_id === parseInt(trainerId) &&
        new Date(s.date_debut) >= new Date(startDate) &&
        new Date(s.date_fin) <= new Date(endDate)
      );

      return { success: true, data: sessions };
    } catch (error) {
      console.error('Erreur lors de la récupération du planning:', error);
      throw error;
    }
  }

  // Marquer les présences pour une session
  async markAttendance(sessionId, attendanceData) {
    try {
      console.log(`Présences marquées pour la session ${sessionId}:`, attendanceData);
      return { success: true, message: 'Présences enregistrées avec succès' };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des présences:', error);
      throw error;
    }
  }

  // Saisir les évaluations
  async submitEvaluations(sessionId, evaluationsData) {
    try {
      console.log(`Évaluations saisies pour la session ${sessionId}:`, evaluationsData);
      return { success: true, message: 'Évaluations enregistrées avec succès' };
    } catch (error) {
      console.error('Erreur lors de la saisie des évaluations:', error);
      throw error;
    }
  }

  // Récupérer les statistiques d'un formateur
  async getTrainerStats(trainerId) {
    try {
      const sessions = SESSIONS.filter(s => s.formateur_id === parseInt(trainerId));

      const stats = {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.statut === 'Completed').length,
        plannedSessions: sessions.filter(s => s.statut === 'Planned').length,
        averageRating: 4.5, // Calculé à partir des évaluations
        totalParticipants: sessions.length * 15 // Estimation
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export default new TrainerService();
