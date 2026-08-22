import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import Logo from '../common/Logo';

// Navigation pour les différents rôles
const ROLE_NAVIGATION = {
  // Admin - Accès complet à tout
  1: [
    { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { label: 'Training Programs', icon: 'school', to: '/formations' },
    { label: 'Catalog', icon: 'menu_book', to: '/catalogue' },
    { label: 'Users', icon: 'group', to: '/participants' },
    { label: 'Trainers', icon: 'psychology', to: '/trainers' },
    { label: 'Session Planning', icon: 'calendar_month', to: '/planning' },
    { label: 'Attendance', icon: 'how_to_reg', to: '/presences' },
    { label: 'Evaluations', icon: 'star', to: '/evaluations' },
    { label: 'Certifications', icon: 'verified', to: '/certifications' },
    { label: 'Finance', icon: 'payments', to: '/finance' },
    { label: 'Complaints', icon: 'report_problem', to: '/reclamations' },
    { label: 'Role Management', icon: 'manage_accounts', to: '/gestion-des-roles' },
    { label: 'Create Account', icon: 'person_add_alt', to: '/admin/creer-compte' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ],

  // Formateur - Interface formateur
  2: [
    { label: 'My Dashboard', icon: 'dashboard', to: '/formateur/dashboard' },
    { label: 'My Planning', icon: 'calendar_view_week', to: '/formateur/planning' },
    { label: 'Mark Attendance', icon: 'fact_check', to: '/formateur/presences' },
    { label: 'Enter Grades', icon: 'grade', to: '/formateur/evaluations' },
    { label: 'Training Catalog', icon: 'menu_book', to: '/catalogue' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ],

  // Participant - Interface participant
  3: [
    { label: 'My Dashboard', icon: 'dashboard', to: '/participant/dashboard' },
    { label: 'Training Catalog', icon: 'library_books', to: '/participant/catalogue' },
    { label: 'My Certificates', icon: 'workspace_premium', to: '/participant/certificats' },
    { label: 'My Schedule', icon: 'calendar_view_week', to: '/participant/planning' },
    { label: 'Give Feedback', icon: 'feedback', to: '/reclamations' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ]
};

// Titres des rôles pour l'affichage
const ROLE_TITLES = {
  1: 'Admin Portal',
  2: 'Trainer Portal', 
  3: 'Learning Portal'
};

const ROLE_NAMES = {
  1: 'Administrator',
  2: 'Trainer', 
  3: 'Participant'
};

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const getCurrentUser = () => {
    // Utiliser l'utilisateur réel connecté (renvoyé par le backend)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) return user;
      } catch (e) { /* ignore */ }
    }

    // Charger les utilisateurs depuis mock.js
    const UTILISATEURS = [
      {
        id: 1,
        nom: 'Ben Salah',
        prenom: 'Ahmed',
        role_id: 1, // Admin
      },
      {
        id: 2,
        nom: 'Jlassi',
        prenom: 'Mohamed Amine',
        role_id: 3, // Participant
      },
      {
        id: 3,
        nom: 'Trabelsi',
        prenom: 'Fatima',
        role_id: 2, // Formateur
      },
    ];

    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const user = UTILISATEURS.find(u => u.id === parseInt(storedUserId));
      if (user) return user;
    }
    return UTILISATEURS[0]; // Par défaut Admin
  };

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les changements manuels (pour le même onglet)
    const interval = setInterval(() => {
      const newUser = getCurrentUser();
      if (newUser.id !== currentUser?.id) {
        setCurrentUser(newUser);
      }
    }, 500);

    // Fermer le menu si on clique ailleurs
    const handleClickOutside = (event) => {
      if (showRoleSelector && !event.target.closest('.role-selector')) {
        setShowRoleSelector(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('click', handleClickOutside);
      clearInterval(interval);
    };
  }, [currentUser?.id, showRoleSelector]);

  if (!currentUser) return null;

  const userRole = currentUser.role_id || 1;
  const roleTitle = ROLE_TITLES[userRole] || 'Training Portal';
  const navItems = ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION[1];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 overflow-y-auto flex-col p-4 border-r border-outline-variant bg-surface-container-low transition-all duration-200 ease-in-out z-50">
      <div className="mb-8 px-4 flex flex-col gap-2">
        <div className="flex flex-col items-center gap-2">
          <Logo width="120" height="60" className="mb-1" />
        </div>
        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider text-center">
          {roleTitle}
        </span>
        {/* Affichage du rôle et nom de l'utilisateur */}
        <div className="mt-2 p-2 bg-surface-container rounded-lg">
          <div className="text-label-sm text-on-surface font-semibold">
            {currentUser.prenom} {currentUser.nom}
          </div>
          <div className="text-body-sm text-on-surface-variant">
            {ROLE_NAMES[userRole]}
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-label-md ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}