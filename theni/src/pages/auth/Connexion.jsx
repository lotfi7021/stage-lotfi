import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Lock, Eye, EyeOff } from "lucide-react";
import authService from '../../services/auth/authService';
import Logo from '../../components/common/Logo';

export default function Connexion() {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [seSouvenir, setSeSouvenir] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!identifiant || !motDePasse) {
      setErreur("Veuillez renseigner votre identifiant et votre mot de passe.");
      return;
    }

    setChargement(true);
    
    try {
      const result = await authService.login({ identifiant, motDePasse, seSouvenir });
      
      // Rediriger vers le dashboard approprié selon le rôle
      navigate(result.redirectTo);
    } catch (err) {
      const backendError = err.response?.data?.error;
      setErreur(backendError || err.message || "Identifiant ou mot de passe incorrect.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4 md:p-8 text-[#191c1d] relative overflow-hidden">
      {/* Éléments de fond abstraits */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#d7e2ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#ffe08b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Conteneur principal */}
      <main className="w-full max-w-[1024px] grid grid-cols-1 md:grid-cols-2 bg-[#f8f9fa] rounded-xl shadow-lg z-10 overflow-hidden relative">
        {/* Côté gauche : image / identité visuelle */}
        <div className="hidden md:block relative bg-[#e7e8e9] h-full">
          <div className="absolute inset-0 bg-[#003f87]/20 z-10 mix-blend-overlay" />
          <img
            className="object-cover w-full h-full absolute inset-0 z-0"
            alt="Installation industrielle moderne de la STEG"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVrs3Vv3SwpMo1vceSKdBgHA-tqLs2K3KyjzbET-2XSdWNx9vaPCggSXYZps89MhYh-S8iVTgjWqxegRtBcyjLPz_pAzW_Q3qUh992TLykwFQXfEtH_pmEWfqIeIoZ9CtIaiD7UqzkcHRnjkZn416mJT6w0-wU82U45lXGCfd5datdBi4LRGfnrtGf3Vbj-9QAjxl8NTd_xS1gPbPWUHTqYUkvquUGxgk74GFymi6_QeSMwWXBY6_RIA"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-[#191c1d]/80 to-transparent">
            <div className="flex flex-col items-center text-center mb-4">
              <Logo width="140" height="70" className="mb-3 bg-white/90 p-2 rounded-lg" />
            </div>
            <p className="text-white/90 text-center">Excellence en formation technique et gestion des utilités.</p>
          </div>
        </div>

        {/* Côté droit : formulaire de connexion */}
        <div className="p-8 md:p-12 flex flex-col justify-center h-full bg-[#f8f9fa]">
          {/* En-tête mobile avec logo STEG */}
          <div className="md:hidden flex flex-col items-center justify-center mb-8">
            <Logo width="160" height="80" className="mb-2" />
            <h1 className="text-xl font-semibold text-[#003f87]">Espace Formation</h1>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-[#191c1d] mb-2">Connexion</h2>
            <p className="text-[#424752]">Accédez à votre espace professionnel</p>
          </div>

        

          {erreur && (
            <div className="mb-4 rounded-lg border border-[#ba1a1a]/30 bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
              {erreur}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email / Matricule */}
            <div>
              <label
                className="block text-sm font-medium text-[#191c1d] mb-1"
                htmlFor="identifier"
              >
                Email ou Matricule STEG
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-[#727784]" size={20} />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Saisissez votre identifiant"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#c2c6d4] rounded-lg bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003f87] focus:border-[#003f87] transition-all duration-200"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label
                className="block text-sm font-medium text-[#191c1d] mb-1"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-[#727784]" size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={afficherMotDePasse ? "text" : "password"}
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-[#c2c6d4] rounded-lg bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003f87] focus:border-[#003f87] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727784] hover:text-[#003f87] transition-colors"
                  aria-label={afficherMotDePasse ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {afficherMotDePasse ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={seSouvenir}
                  onChange={(e) => setSeSouvenir(e.target.checked)}
                  className="h-4 w-4 text-[#003f87] focus:ring-[#003f87] border-[#c2c6d4] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#424752]">
                  Se souvenir de moi
                </label>
              </div>
              <a href="#" className="text-sm text-[#003f87] hover:text-[#0056b3] transition-colors underline">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={chargement}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#003f87] hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003f87] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {chargement ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#c2c6d4] text-center">
            <p className="text-[#424752]">
              Nouveau sur la plateforme ?{" "}
              <Link
                to="/inscription"
                className="text-sm font-medium text-[#003f87] hover:text-[#0056b3] transition-colors underline ml-1"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-auto pt-8 text-center md:text-left">
            <span className="text-xs font-semibold text-[#727784]">
              STEG - Espace Formation v2.1.0
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}