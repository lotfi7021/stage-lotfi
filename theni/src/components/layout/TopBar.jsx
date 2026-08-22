import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import LogoutButton from '../common/LogoutButton';
import authService from '../../services/auth/authService';

export default function TopBar({ pageTitle }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté via authService
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1: return 'Admin';
      case 2: return 'Formateur';  
      case 3: return 'Participant';
      default: return 'Utilisateur';
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 sticky top-0 z-40 bg-surface shadow-sm border-b border-outline-variant">
        <div className="flex items-center md:hidden">
          <span className="text-headline-md font-bold text-primary capitalize">
            {pageTitle || 'STEG Formation'}
          </span>
        </div>
        {pageTitle && (
          <div className="hidden md:flex flex-1 items-center gap-6">
            <span className="text-headline-md font-bold text-primary capitalize">{pageTitle}</span>
          </div>
        )}
        <div className="flex items-center gap-4 ml-auto">
          {/* Affichage du rôle actuel */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg border border-outline-variant text-label-sm">
            <span className="font-semibold text-on-surface-variant">
              {getRoleName(currentUser.role_id)}
            </span>
          </div>

          <button className="text-on-surface-variant hover:bg-surface-container-low transition-all p-2 rounded-full cursor-pointer active:opacity-80">
            <Icon name="notifications" />
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-all p-2 rounded-full cursor-pointer active:opacity-80">
            <Icon name="help" />
          </button>
          <button className="flex items-center gap-2 hover:bg-surface-container-low transition-all p-1 pr-3 rounded-full border border-outline-variant cursor-pointer active:opacity-80">
            <img
              alt="User Profile Avatar"
              className="w-8 h-8 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.prenom}`}
            />
            <span className="text-label-md font-medium text-primary hidden sm:block">
              {currentUser.prenom}
            </span>
          </button>
        </div>
      </header>
      <LogoutButton />
    </>
  );
}