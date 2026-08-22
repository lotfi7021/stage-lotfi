// Service pour l'envoi d'emails
class EmailService {
  
  // Envoyer les credentials de connexion par email
  async sendCredentials(userInfo) {
    // Dans une vraie application, cela ferait un appel API vers votre service d'email
    const emailTemplate = {
      to: userInfo.email,
      subject: 'Vos identifiants STEG Formation',
      body: `
        Bonjour ${userInfo.prenom} ${userInfo.nom},

        Votre compte a été créé sur la plateforme STEG Formation.

        🔐 Vos identifiants de connexion :
        • Email : ${userInfo.email}
        • Matricule : ${userInfo.matricule}
        • Mot de passe temporaire : ${userInfo.temporaryPassword}
        • Rôle : ${userInfo.role}

        📝 Instructions :
        1. Connectez-vous sur : ${window.location.origin}/connexion
        2. Utilisez votre email ou matricule comme identifiant
        3. Changez votre mot de passe dès la première connexion

        Pour toute question, contactez l'administration.

        Cordialement,
        L'équipe STEG Formation
      `
    };

    try {
      // Simulation de l'envoi d'email
      console.log('📧 Email envoyé:', emailTemplate);
      
      // Dans une vraie application :
      // const response = await api.post('/email/send-credentials', emailTemplate);
      // return response.data;
      
      return {
        success: true,
        message: `Email envoyé à ${userInfo.email}`
      };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw new Error('Échec de l\'envoi de l\'email');
    }
  }

  // Générer un mot de passe temporaire
  generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export default new EmailService();