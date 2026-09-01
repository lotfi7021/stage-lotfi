import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import userService from '../../services/auth/userService';
import roleService from '../../services/auth/roleService';

const TABS = [
  { id: 'utilisateurs', label: 'Utilisateurs' },
  { id: 'roles', label: 'Rôles & Permissions' },
];

const AVATAR_COLORS = [
  'bg-secondary-container text-on-secondary-container',
  'bg-primary-fixed text-on-primary-fixed',
  'bg-tertiary-fixed text-on-tertiary-fixed',
  'bg-primary-container text-on-primary-container',
  'bg-secondary-fixed text-on-secondary-fixed',
];

const ROLE_COLORS = {
  admin: { bg: '#fee2e2', text: '#991b1b' },
  formateur: { bg: '#dbeafe', text: '#1e40af' },
  participant: { bg: '#d1fae5', text: '#065f46' },
};

const getInitials = (nom, prenom) => {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase() || '?';
};

export default function Administration() {
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [userModal, setUserModal] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', matricule: '', roleId: '', genre: 'Male' });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (query.trim()) params.search = query.trim();
      const { data, total: t, totalPages: tp } = await userService.getAllUsers(params);
      setUsers(data || []);
      setTotal(t || 0);
      setTotalPages(tp || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await roleService.getAllRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, query]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await userService.createUser({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        matricule: form.matricule || undefined,
        roleId: Number(form.roleId),
        genre: form.genre,
      });
      setForm({ prenom: '', nom: '', email: '', matricule: '', roleId: '', genre: 'Male' });
      setUserModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la création de l'utilisateur");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  const filtered = users;

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Administration</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Gestion des paramètres système, des rôles et des niveaux d'accès.
        </p>
      </div>

      <div className="border-b border-outline-variant mb-6">
        <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.id} type="button" aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => setActiveTab(tab.id)} className={`border-b-2 font-label-md text-label-md py-4 px-1 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'utilisateurs' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl shadow-ambient border border-outline-variant gap-4 flex-col md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
              <input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Rechercher par nom ou matricule..." type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md" type="button" onClick={() => setUserModal(true)}>
              <Icon name="person_add" className="text-[20px]" />
              Ajouter un Utilisateur
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Nom / Matricule</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Rôle</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Email</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Statut</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high bg-surface-container-lowest">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Chargement...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-4 font-body-md text-body-md text-on-surface-variant text-center">Aucun utilisateur trouvé.</td></tr>
                  ) : (
                    filtered.map((user, idx) => {
                      const initials = getInitials(user.nom, user.prenom);
                      const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                      return (
                        <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-label-md font-bold`}>{initials}</div>
                              <div>
                                <div className="font-label-md text-label-md text-on-surface font-semibold">{user.prenom} {user.nom}</div>
                                <div className="font-body-md text-body-md text-on-surface-variant text-[13px]">{user.matricule}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-body-md text-body-md text-on-surface">
                            {(() => {
                              const rc = ROLE_COLORS[user.role?.nomRole?.toLowerCase()];
                              return rc ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider" style={{ backgroundColor: rc.bg, color: rc.text }}>
                                  {user.role?.nomRole || '-'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                                  {user.role?.nomRole || '-'}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider ${user.isActive ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                              {user.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" title={user.isActive ? 'Désactiver' : 'Activer'} type="button" onClick={() => handleToggleStatus(user.id, user.isActive)}>
                              <Icon name={user.isActive ? 'block' : 'check_circle'} className="text-[20px]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Affichage {filtered.length > 0 ? (page - 1) * 10 + 1 : 0} à {Math.min(page * 10, total)} sur {total} utilisateurs
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-outline-variant rounded bg-surface text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-md disabled:opacity-50" type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Précédent
                </button>
                <button className="px-3 py-1 border border-outline-variant rounded bg-surface text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-md disabled:opacity-50" type="button" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-surface">Rôles du système</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Nom du rôle</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Description</th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Utilisateurs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {roles.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-4 text-center text-on-surface-variant">Aucun rôle trouvé.</td></tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 font-label-md text-label-md text-on-surface font-semibold">{role.nomRole}</td>
                        <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{role.description || '-'}</td>
                        <td className="py-4 px-6 font-body-md text-body-md text-on-surface">{role._count?.utilisateurs ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {userModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setUserModal(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Ajouter un Utilisateur</h3>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" type="button" onClick={() => setUserModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSaveUser}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-prenom">Prénom</label>
                  <input id="user-prenom" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="text" placeholder="Ex : Karim" name="prenom" value={form.prenom} onChange={updateForm} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-nom">Nom</label>
                  <input id="user-nom" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="text" placeholder="Ex : Ben Ali" name="nom" value={form.nom} onChange={updateForm} required />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="user-email">Email</label>
                <input id="user-email" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="email" placeholder="nom@steg.com.tn" name="email" value={form.email} onChange={updateForm} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-matricule">Matricule (optionnel)</label>
                  <input id="user-matricule" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="text" placeholder="Auto-généré si vide" name="matricule" value={form.matricule} onChange={updateForm} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-role">Rôle</label>
                  <select id="user-role" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="roleId" value={form.roleId} onChange={updateForm} required>
                    <option value="">Choisir un rôle...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.nomRole}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="user-genre">Genre</label>
                <select id="user-genre" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="genre" value={form.genre} onChange={updateForm}>
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" type="button" onClick={() => setUserModal(false)}>Annuler</button>
                <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2" type="submit" disabled={creating}>
                  <Icon name="person_add" />
                  {creating ? 'Création...' : "Ajouter l'utilisateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
