import { useState } from 'react';
import { User, Badge, Mail, KeyRound, Users, Send } from 'lucide-react';
import emailService from '../../services/auth/emailService';
import api from '../../services/config/api';

const CHAMPS_INITIAUX = {
  prenom: '',
  nom: '',
  matricule: '',
  email: '',
  genre: 'Male',
  role_id: 2, // Par défaut Formateur
  specialite: '',
  qualifications: ''
};

const ROLES_ADMIN = [
  { value: 1, label: 'Administrateur' },
  { value: 2, label: 'Formateur' }
];

const GENRES = [
  { value: 'Male', label: 'Homme' },
  { value: 'Female', label: 'Femme' }
];

export default function CreationCompteFormateur() {
  const [champs, setChamps] = useState(CHAMPS_INITIAUX);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamps(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');

    const { prenom, nom, matricule, email, genre, role_id } = champs;

    if (!prenom || !nom || !matricule || !email || !genre || !role_id) {
      setErreur('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setChargement(true);

    try {
      // Générer un mot de passe temporaire
      const temporaryPassword = emailService.generateTemporaryPassword();

      // Créer le compte via l'API backend
      const payload = {
        prenom: champs.prenom,
        nom: champs.nom,
        matricule: champs.matricule,
        email: champs.email,
        genre: champs.genre,
        motDePasse: temporaryPassword,
        roleId: Number(role_id),
        isActive: true,
      };
      const { data } = await api.post('/users', payload);

      // Envoyer les credentials par email
      const roleLabel = ROLES_ADMIN.find(r => r.value === parseInt(role_id))?.label;
      await emailService.sendCredentials({
        ...payload,
        temporaryPassword,
        role: roleLabel
      });

      setSucces(`Compte ${roleLabel.toLowerCase()} créé avec succès ! Les identifiants ont été envoyés à ${email}.`);
      
      // Réinitialiser le formulaire
      setChamps(CHAMPS_INITIAUX);

    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue lors de la création du compte.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Création de Compte</h2>
        <p className="text-on-surface-variant">
          Créez un nouveau compte formateur ou administrateur. Les identifiants seront envoyés par email.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
        {erreur && (
          <div className="mb-6 rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
            {erreur}
          </div>
        )}

        {succes && (
          <div className="mb-6 rounded-lg border border-success/30 bg-success-container px-4 py-3 text-sm text-on-success-container">
            {succes}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="prenom">
                Prénom *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-on-surface-variant" size={18} />
                </div>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  value={champs.prenom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Prénom du formateur"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="nom">
                Nom *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-on-surface-variant" size={18} />
                </div>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={champs.nom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Nom de famille"
                />
              </div>
            </div>
          </div>

          {/* Email et Matricule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="email">
                Email STEG *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-on-surface-variant" size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={champs.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="prenom.nom@steg.com.tn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="matricule">
                Matricule STEG *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Badge className="text-on-surface-variant" size={18} />
                </div>
                <input
                  id="matricule"
                  name="matricule"
                  type="text"
                  required
                  value={champs.matricule}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="STEG-YYYY-XXXX"
                />
              </div>
            </div>
          </div>

          {/* Genre et Rôle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="genre">
                Genre *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="text-on-surface-variant" size={18} />
                </div>
                <select
                  id="genre"
                  name="genre"
                  required
                  value={champs.genre}
                  onChange={handleChange}
                  className="w-full pl-10 pr-8 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  {GENRES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="role_id">
                Rôle *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="text-on-surface-variant" size={18} />
                </div>
                <select
                  id="role_id"
                  name="role_id"
                  required
                  value={champs.role_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-8 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  {ROLES_ADMIN.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Informations spécifiques aux formateurs */}
          {champs.role_id === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="specialite">
                  Spécialité
                </label>
                <input
                  id="specialite"
                  name="specialite"
                  type="text"
                  value={champs.specialite}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="ex: Sécurité électrique, Gestion de projets..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="qualifications">
                  Qualifications
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  rows="3"
                  value={champs.qualifications}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Diplômes, certifications, expériences..."
                />
              </div>
            </>
          )}

          {/* Note d'information */}
          <div className="bg-primary-container border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Send className="text-primary mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-on-primary-container mb-1">Envoi automatique des identifiants</h4>
                <p className="text-sm text-on-primary-container/80">
                  Un email contenant les identifiants de connexion et un mot de passe temporaire 
                  sera automatiquement envoyé à l'adresse email indiquée.
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {chargement ? (
              'Création en cours...'
            ) : (
              <>
                <Send size={18} />
                Créer le compte et envoyer les identifiants
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}