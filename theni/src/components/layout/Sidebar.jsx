import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import Logo from '../common/Logo';

// Navigation pour les différents rôles
const ROLE_NAVIGATION = {
  admin: [
    { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { label: 'Training Programs', icon: 'school', to: '/formations' },
    { label: 'Catalog', icon: 'menu_book', to: '/catalogue' },
    { label: 'Users', icon: 'group', to: '/participants' },
    { label: 'Trainers', icon: 'psychology', to: '/trainers' },
    { label: 'Session Planning', icon: 'calendar_month', to: '/planning' },
    { label: 'Evaluations', icon: 'star', to: '/evaluations' },
    { label: 'Certifications', icon: 'verified', to: '/certifications' },
    { label: 'Finance', icon: 'payments', to: '/finance' },
    { label: 'Complaints', icon: 'report_problem', to: '/reclamations' },
    { label: 'Role Management', icon: 'manage_accounts', to: '/gestion-des-roles' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ],

  formateur: [
    { label: 'My Dashboard', icon: 'dashboard', to: '/formateur/dashboard' },
    { label: 'My Planning', icon: 'calendar_view_week', to: '/formateur/planning' },
    { label: 'Enter Grades', icon: 'grade', to: '/formateur/evaluations' },
    { label: 'My Certifications', icon: 'workspace_premium', to: '/formateur/certifications' },
    { label: 'Training Catalog', icon: 'menu_book', to: '/catalogue' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ],

  participant: [
    { label: 'My Dashboard', icon: 'dashboard', to: '/participant/dashboard' },
    { label: 'Training Catalog', icon: 'library_books', to: '/participant/catalogue' },
    { label: 'My Certificates', icon: 'workspace_premium', to: '/participant/certificats' },
    { label: 'Give Feedback', icon: 'feedback', to: '/reclamations' },
    { label: 'Settings', icon: 'settings', to: '/parametres' }
  ]
};

const ROLE_TITLES = {
  admin: 'Admin Portal',
  formateur: 'Trainer Portal',
  participant: 'Learning Portal'
};

const ROLE_NAMES = {
  admin: 'Administrator',
  formateur: 'Trainer',
  participant: 'Participant'
};

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) return user;
      } catch (e) { /* ignore */ }
    }
    return null;
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

  const userRole = currentUser.role || 'admin';
  const roleTitle = ROLE_TITLES[userRole] || 'Training Portal';
  const navItems = ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION.admin;

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