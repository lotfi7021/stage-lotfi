import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages Admin
import Dashboard from './pages/admin/Dashboard';
import Administration from './pages/admin/Administration';
import GestionDesRoles from './pages/admin/GestionDesRoles';
import GestionDesParticipants from './pages/admin/GestionDesParticipants';
import CreationCompteFormateur from './pages/admin/CreationCompteFormateur';
import Finance from './pages/admin/Finance';
import Commercial from './pages/admin/Commercial';
import Parametres from './pages/admin/Parametres';

// Pages Formations
import ListeDesFormations from './pages/formations/ListeDesFormations';
import GestionDesFormationsAjout from './pages/formations/GestionDesFormationsAjout';
import ModificationFormation from './pages/formations/ModificationFormation';
import DetailsFormation from './pages/formations/DetailsFormation';
import Catalogue from './pages/formations/Catalogue';
import Planning from './pages/formations/Planning';

// Pages Trainers (Formateurs)
import FormateurDashboard from './pages/trainers/FormateurDashboard';
import FormateurPresences from './pages/trainers/FormateurPresences';
import FormateurEvaluations from './pages/trainers/FormateurEvaluations';
import FormateurPlanning from './pages/trainers/FormateurPlanning';
import Trainers from './pages/trainers/Trainers';

// Pages Participants
import ParticipantDashboard from './pages/participants/ParticipantDashboard';
import ParticipantCatalogue from './pages/participants/ParticipantCatalogue';
import ParticipantCertificats from './pages/participants/ParticipantCertificats';

// Pages Évaluations
import Evaluations from './pages/evaluations/Evaluations';
import Certifications from './pages/evaluations/Certifications';
import Presences from './pages/evaluations/Presences';

// Pages Documents
import Reclamations from './pages/documents/Reclamations';

// Pages d'authentification
import Connexion from './pages/auth/Connexion';
import Inscription from './pages/auth/Inscription';

// Service d'authentification
import authService from './services/auth/authService';

// Composant pour protéger les routes privées
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  return children;
}

// Composant pour gérer la déconnexion
function LogoutRoute() {
  React.useEffect(() => {
    authService.logout();
  }, []);
  
  return <Navigate to="/connexion" replace />;
}

// Composant pour rediriger vers le bon dashboard selon le rôle
function RoleBasedRedirect() {
  // Vérifier d'abord l'authentification
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  // Debug: afficher l'état dans la console
  console.log('RoleBasedRedirect - isAuthenticated:', isAuthenticated);
  console.log('RoleBasedRedirect - currentUser:', currentUser);
  console.log('RoleBasedRedirect - localStorage token:', localStorage.getItem('userToken'));
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  if (!currentUser) {
    return <Navigate to="/connexion" replace />;
  }
  
  // Redirection selon le rôle (string du backend)
  const roleUrls = {
    admin: '/dashboard', // Admin
    formateur: '/formateur/dashboard', // Formateur
    participant: '/participant/dashboard' // Participant
  };
  
  return <Navigate to={roleUrls[currentUser.role] || '/dashboard'} replace />;
}

export default function App() {
  // Pour le développement : fonction pour forcer la déconnexion
  React.useEffect(() => {
    // Vérifier si nous devons forcer la redirection vers la connexion
    const forceLogout = new URLSearchParams(window.location.search).get('logout');
    if (forceLogout === 'true') {
      authService.logout();
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes d'authentification (sans layout) - accessibles sans authentification */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        
        {/* Route de déconnexion */}
        <Route path="/logout" element={<LogoutRoute />} />

        {/* Routes protégées avec layout principal */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Routes Admin existantes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/formations" element={<ListeDesFormations />} />
          <Route path="/formations/ajout" element={<GestionDesFormationsAjout />} />
          <Route path="/formations/modifier/:id" element={<ModificationFormation />} />
          <Route path="/formations/modifier" element={<ModificationFormation />} />
          <Route path="/formations/:id" element={<DetailsFormation />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/participants" element={<GestionDesParticipants />} />
          <Route path="/gestion-des-roles" element={<GestionDesRoles />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/presences" element={<Presences />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/reclamations" element={<Reclamations />} />
          <Route path="/parametres" element={<Parametres />} />
          
          {/* Pages admin spécialisées */}
          <Route path="/admin/creer-compte" element={<CreationCompteFormateur />} />

          {/* Nouvelles routes Formateur */}
          <Route path="/formateur/dashboard" element={<FormateurDashboard />} />
          <Route path="/formateur/presences" element={<FormateurPresences />} />
          <Route path="/formateur/evaluations" element={<FormateurEvaluations />} />
          <Route path="/formateur/planning" element={<FormateurPlanning />} />

           {/* Nouvelles routes Participant */}
          <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
          <Route path="/participant/catalogue" element={<ParticipantCatalogue />} />
          <Route path="/participant/certificats" element={<ParticipantCertificats />} />
        </Route>
        
        {/* Redirection de la page d'accueil - soit vers connexion soit vers dashboard selon l'état de connexion */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}