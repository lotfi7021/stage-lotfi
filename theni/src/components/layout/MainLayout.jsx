import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const TITLES = {
  // Routes Admin
  '/dashboard': 'Tableau de Bord',
  '/formations': 'Formations',
  '/catalogue': 'Catalogue',
  '/participants': 'Participants',
  '/gestion-des-roles': 'Gestion des Rôles',
  '/trainers': 'Gestion des Formateurs',
  '/planning': 'Planning',
  '/presences': 'Gestion des Présences',
  '/evaluations': 'Évaluations',
  '/certifications': 'Certifications',
  '/finance': 'Gestion Financière',
  '/commercial': 'Gestion Commerciale',
  '/reclamations': 'Gestion des Réclamations',
  '/indicateurs': 'Indicateurs de Performance',
  '/administration': 'Administration',
  '/parametres': 'Paramètres',

  // Routes Formateur
  '/formateur/dashboard': 'Mon Tableau de Bord',
  '/formateur/planning': 'Mon Planning',
  '/formateur/presences': 'Gestion des Présences',
  '/formateur/evaluations': 'Saisie des Évaluations',

  // Routes Participant  
  '/participant/dashboard': 'Mon Espace Apprenant',
  '/participant/catalogue': 'Catalogue de Formations',
  '/participant/certificats': 'Mes Certificats'
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'STEG Formation';
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        <TopBar pageTitle={title} />
        <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}