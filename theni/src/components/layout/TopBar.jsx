import React, { useState, useEffect, useRef } from 'react';
import Icon from '../common/Icon';
import authService from '../../services/auth/authService';

export default function TopBar({ pageTitle }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/connexion';
  };

  const handleClearStorage = () => {
    const keysToKeep = ['userToken', 'currentUser', 'currentUserId', 'rememberMe'];
    const keysToRemove = [];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setMenuOpen(false);
  };

  if (!currentUser) return null;

  return (
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
      <div className="flex items-center gap-3 ml-auto">
        <button className="text-on-surface-variant hover:bg-surface-container-low transition-all p-2 rounded-full cursor-pointer active:opacity-80">
          <Icon name="notifications" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-surface-container-low transition-all p-1 pr-3 rounded-full border border-outline-variant cursor-pointer active:opacity-80"
          >
            <img
              alt="User Profile Avatar"
              className="w-8 h-8 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.prenom}`}
            />
            <span className="text-label-md font-medium text-primary hidden sm:block">
              {currentUser.prenom}
            </span>
            <Icon name={menuOpen ? 'expand_less' : 'expand_more'} size={18} className="text-on-surface-variant hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant py-2 z-50">
              <div className="px-4 py-3 border-b border-outline-variant">
                <p className="text-label-md font-semibold text-on-surface">{currentUser.prenom} {currentUser.nom}</p>
                <p className="text-body-sm text-on-surface-variant">{currentUser.email}</p>
              </div>
              <button
                onClick={handleClearStorage}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Icon name="cleaning_services" size={18} className="text-on-surface-variant" />
                Vider le cache
              </button>
              <div className="border-t border-outline-variant mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-error hover:bg-error-container/30 transition-colors"
                >
                  <Icon name="logout" size={18} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
