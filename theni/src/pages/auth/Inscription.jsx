import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
  Badge,
  Mail,
  Lock,
  KeyRound,
  ChevronDown,
  Users,
} from "lucide-react";
import authService from '../../services/auth/authService';
import Logo from '../../components/common/Logo';

const GENRES = [
  { value: "Male", label: "Homme" },
  { value: "Female", label: "Femme" },
];

const CHAMPS_INITIAUX = {
  prenom: "",
  nom: "",
  matricule: "",
  email: "",
  genre: "",
  motDePasse: "",
  confirmationMotDePasse: "",
};

export default function Inscription() {
  const [champs, setChamps] = useState(CHAMPS_INITIAUX);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamps((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setSucces("");

    const { prenom, nom, matricule, email, genre, motDePasse, confirmationMotDePasse } = champs;

    if (!prenom || !nom || !matricule || !email || !genre || !motDePasse) {
      setErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (motDePasse !== confirmationMotDePasse) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);

    try {
      // Inscription automatiquement en tant que Participant
      const registrationData = {
        ...champs,
        role_id: 3 // Force le rôle Participant pour l'inscription publique
      };
      
      const result = await authService.register(registrationData);
      setSucces("Compte participant créé avec succès ! Redirection vers la connexion...");
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);
    } catch (err) {
      const backendError = err.response?.data?.error;
      setErreur(backendError || err.message || "Une erreur est survenue lors de la création du compte.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 w-full max-w-[1280px] mx-auto">
        <div className="w-full max-w-lg bg-[#f8f9fa] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-[#e1e3e4] overflow-hidden">
          {/* En-tête */}
          <div className="p-6 border-b border-[#e1e3e4] bg-[#f3f4f5] text-center flex flex-col items-center justify-center">
            <Logo width="140" height="70" className="mb-2" />
            <h1 className="text-xl font-semibold text-[#003f87]">Inscription Participant</h1>
            <p className="text-[#424752] mt-2">Créez votre compte pour accéder aux formations STEG</p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>📋 Information :</strong> Cette inscription est réservée aux employés STEG.<br/>
                Les comptes formateurs sont créés par l'administration.
              </p>
            </div>
          </div>

          {erreur && (
            <div className="mx-6 mt-4 rounded-lg border border-[#ba1a1a]/30 bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
              {erreur}
            </div>
          )}

          {succes && (
            <div className="mx-6 mt-4 rounded-lg border border-[#2e7d32]/30 bg-[#e8f5e8] px-4 py-3 text-sm text-[#2e7d32]">
              {succes}
            </div>
          )}

          {/* Formulaire */}
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="prenom">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-[#acc7ff]" size={18} />
                  </div>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Ex: Ahmed"
                    required
                    value={champs.prenom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="nom">
                  Nom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-[#acc7ff]" size={18} />
                  </div>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Ex: Ben Ali"
                    required
                    value={champs.nom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="matricule">
                Matricule STEG *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Badge className="text-[#acc7ff]" size={18} />
                </div>
                <input
                  id="matricule"
                  name="matricule"
                  type="text"
                  placeholder="Ex: STEG-2024-0001"
                  required
                  value={champs.matricule}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="email">
                Email professionnel *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-[#acc7ff]" size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="prenom.nom@steg.com.tn"
                  required
                  value={champs.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="genre">
                  Genre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="text-[#acc7ff]" size={18} />
                  </div>
                  <select
                    id="genre"
                    name="genre"
                    required
                    value={champs.genre}
                    onChange={handleChange}
                    className="w-full pl-10 pr-8 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d] appearance-none"
                  >
                    <option disabled value="">Sélectionnez votre genre</option>
                    {GENRES.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="text-[#424752]" size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191c1d] mb-1" htmlFor="password">
                Mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-[#acc7ff]" size={18} />
                </div>
                <input
                  id="password"
                  name="motDePasse"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={champs.motDePasse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#191c1d] mb-1"
                htmlFor="confirm_password"
              >
                Confirmation du mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="text-[#acc7ff]" size={18} />
                </div>
                <input
                  id="confirm_password"
                  name="confirmationMotDePasse"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={champs.confirmationMotDePasse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#f8f9fa] border border-[#c2c6d4] rounded focus:outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#acc7ff] transition-all text-[#191c1d]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={chargement}
                className="w-full bg-[#003f87] hover:bg-[#0056b3] text-white text-sm font-medium py-3 rounded shadow-sm hover:shadow transition-all duration-200 h-[44px] flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chargement ? "Création en cours..." : "S'inscrire"}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[#424752]">
                Déjà un compte ?{" "}
                <Link
                  to="/connexion"
                  className="text-[#003f87] font-semibold hover:underline transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-[#f3f4f5] text-[#424752] text-xs w-full py-8 mt-auto border-t border-[#c2c6d4] flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
        <div className="text-sm font-semibold text-[#003f87]">STEG</div>
        <div>
          © 2024 STEG - Société Tunisienne de l'Electricité et du Gaz. Tous droits réservés.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#003f87] transition-colors">
            Support Technique
          </a>
          <a href="#" className="hover:text-[#003f87] transition-colors">
            Conditions d'Utilisation
          </a>
          <a href="#" className="hover:text-[#003f87] transition-colors">
            Confidentialité
          </a>
        </div>
      </footer>
    </div>
  );
}