import React from 'react';
import authService from '../../services/auth/authService';

const LogoutButton = () => {
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
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 text-sm"
      >
        Se déconnecter
      </button>
      <button
        onClick={handleClearStorage}
        className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 text-sm"
      >
        Vider le cache
      </button>
    </div>
  );
};

export default LogoutButton;