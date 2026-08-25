import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// Composant pour protéger les routes par rôle (layout route)
function RoleBasedRoute({ allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  if (!currentUser) {
    return <Navigate to="/connexion" replace />;
  }
  
  const userRole = currentUser.role;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const roleUrls = {
      admin: '/dashboard',
      formateur: '/formateur/dashboard',
      participant: '/participant/dashboard'
    };
    return <Navigate to={roleUrls[userRole] || '/connexion'} replace />;
  }
  
  return <Outlet />;
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
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  if (!currentUser) {
    return <Navigate to="/connexion" replace />;
  }
  
  const roleUrls = {
    admin: '/dashboard',
    formateur: '/formateur/dashboard',
    participant: '/participant/dashboard'
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
        
        {/* Route de déconnexion */}
        <Route path="/logout" element={<LogoutRoute />} />

        {/* Routes protégées avec layout principal */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Routes Admin */}
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/formations" element={<ListeDesFormations />} />
            <Route path="/formations/ajout" element={<GestionDesFormationsAjout />} />
            <Route path="/formations/modifier/:id" element={<ModificationFormation />} />
            <Route path="/formations/modifier" element={<ModificationFormation />} />
            <Route path="/formations/:id" element={<DetailsFormation />} />
            <Route path="/participants" element={<GestionDesParticipants />} />
            <Route path="/gestion-des-roles" element={<GestionDesRoles />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/parametres" element={<Parametres />} />
          </Route>

          {/* Routes partagées (admin + formateur) */}
          <Route element={<RoleBasedRoute allowedRoles={['admin', 'formateur']} />}>
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/presences" element={<Presences />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/reclamations" element={<Reclamations />} />
          </Route>

          {/* Routes Formateur */}
          <Route element={<RoleBasedRoute allowedRoles={['formateur']} />}>
            <Route path="/formateur/dashboard" element={<FormateurDashboard />} />
            <Route path="/formateur/presences" element={<FormateurPresences />} />
            <Route path="/formateur/evaluations" element={<FormateurEvaluations />} />
            <Route path="/formateur/planning" element={<FormateurPlanning />} />
          </Route>

          {/* Routes Participant */}
          <Route element={<RoleBasedRoute allowedRoles={['participant']} />}>
            <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
            <Route path="/participant/catalogue" element={<ParticipantCatalogue />} />
            <Route path="/participant/certificats" element={<ParticipantCertificats />} />
          </Route>
        </Route>
        
        {/* Redirection de la page d'accueil - soit vers connexion soit vers dashboard selon l'état de connexion */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}