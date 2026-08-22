import api from '../config/api';
import { FORMATIONS, SESSIONS } from '../../data/mock';

class FormationService {
  
  // Récupérer toutes les formations
  async getAllFormations() {
    try {
      return {
        success: true,
        data: FORMATIONS,
        total: FORMATIONS.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      throw error;
    }
  }

  // Récupérer une formation par ID
  async getFormationById(id) {
    try {
      const formation = FORMATIONS.find(f => f.id === parseInt(id));
      if (!formation) {
        throw new Error('Formation non trouvée');
      }
      return { success: true, data: formation };
    } catch (error) {
      console.error('Erreur lors de la récupération de la formation:', error);
      throw error;
    }
  }

  // Créer une nouvelle formation
  async createFormation(formationData) {
    try {
      const newFormation = {
        id: Date.now(),
        ...formationData,
        created_at: new Date().toISOString()
      };

      console.log('Formation créée:', newFormation);
      return { success: true, data: newFormation, message: 'Formation créée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      throw error;
    }
  }

  // Mettre à jour une formation
  async updateFormation(id, formationData) {
    try {
      console.log(`Mise à jour formation ${id}:`, formationData);
      return { success: true, message: 'Formation mise à jour avec succès' };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
      throw error;
    }
  }

  // Supprimer une formation
  async deleteFormation(id) {
    try {
      console.log(`Suppression formation ${id}`);
      return { success: true, message: 'Formation supprimée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
      throw error;
    }
  }

  // Rechercher des formations
  async searchFormations(filters = {}) {
    try {
      let filteredFormations = [...FORMATIONS];

      if (filters.categorie) {
        filteredFormations = filteredFormations.filter(f => 
          f.categorie.toLowerCase().includes(filters.categorie.toLowerCase())
        );
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        filteredFormations = filteredFormations.filter(f => 
          f.titre.toLowerCase().includes(query) ||
          f.objectifs.toLowerCase().includes(query)
        );
      }

      return { success: true, data: filteredFormations };
    } catch (error) {
      console.error('Erreur lors de la recherche de formations:', error);
      throw error;
    }
  }

  // Récupérer les sessions d'une formation
  async getFormationSessions(formationId) {
    try {
      const sessions = SESSIONS.filter(s => s.formation_id === parseInt(formationId));
      return { success: true, data: sessions };
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }
}

export default new FormationService();