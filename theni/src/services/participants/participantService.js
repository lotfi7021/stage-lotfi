import api from '../config/api';
import { UTILISATEURS, INSCRIPTIONS, SESSIONS, FORMATIONS } from '../../data/mock';

class ParticipantService {
  
  // Récupérer tous les participants
  async getAllParticipants() {
    try {
      const participants = UTILISATEURS.filter(u => u.role_id === 3);
      return {
        success: true,
        data: participants,
        total: participants.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      throw error;
    }
  }

  // Récupérer les inscriptions d'un participant
  async getParticipantInscriptions(participantId) {
    try {
      const inscriptions = INSCRIPTIONS.filter(i => i.participant_id === parseInt(participantId));
      
      // Enrichir avec les informations de session et formation
      const enrichedInscriptions = inscriptions.map(inscription => {
        const session = SESSIONS.find(s => s.id === inscription.session_id);
        const formation = session ? FORMATIONS.find(f => f.id === session.formation_id) : null;
        
        return {
          ...inscription,
          session: session || null,
          formation: formation || null
        };
      });

      return { success: true, data: enrichedInscriptions };
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      throw error;
    }
  }

  // Inscrire un participant à une session
  async enrollParticipant(participantId, sessionId) {
    try {
      const newInscription = {
        id: Date.now(),
        participant_id: parseInt(participantId),
        session_id: parseInt(sessionId),
        date_inscription: new Date().toISOString(),
        statut_inscription: 'Confirmed'
      };

      console.log('Nouvelle inscription:', newInscription);
      return { success: true, data: newInscription, message: 'Inscription réussie' };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Annuler l'inscription d'un participant
  async cancelEnrollment(inscriptionId) {
    try {
      console.log(`Annulation inscription ${inscriptionId}`);
      return { success: true, message: 'Inscription annulée avec succès' };
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      throw error;
    }
  }

  // Récupérer le catalogue pour les participants
  async getCatalog(filters = {}) {
    try {
      let availableFormations = [...FORMATIONS];
      
      if (filters.categorie) {
        availableFormations = availableFormations.filter(f => 
          f.categorie.toLowerCase() === filters.categorie.toLowerCase()
        );
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        availableFormations = availableFormations.filter(f => 
          f.titre.toLowerCase().includes(query) ||
          f.objectifs.toLowerCase().includes(query)
        );
      }

      return { success: true, data: availableFormations };
    } catch (error) {
      console.error('Erreur lors de la récupération du catalogue:', error);
      throw error;
    }
  }

  // Récupérer les statistiques d'un participant
  async getParticipantStats(participantId) {
    try {
      const inscriptions = INSCRIPTIONS.filter(i => i.participant_id === parseInt(participantId));
      
      const stats = {
        totalInscriptions: inscriptions.length,
        completedTrainings: inscriptions.filter(i => i.statut_inscription === 'Completed').length,
        pendingTrainings: inscriptions.filter(i => i.statut_inscription === 'Confirmed').length,
        cancelledTrainings: inscriptions.filter(i => i.statut_inscription === 'Cancelled').length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export default new ParticipantService();