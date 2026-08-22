import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const TABS = [
  { id: 'utilisateurs', label: 'Utilisateurs' },
  { id: 'roles', label: 'Rôles & Permissions' },
  { id: 'systeme', label: 'Paramètres Système' },
  { id: 'logs', label: "Logs d'activité" }
];

const USERS = [
  {
    id: 1,
    initials: 'KB',
    initialsClass: 'bg-secondary-container text-on-secondary-container',
    name: 'Karim Ben Ali',
    matricule: 'MAT-84729',
    role: 'Admin Système',
    department: 'DSI Principale',
    status: { label: 'Actif', cls: 'bg-secondary-container text-on-secondary-container' },
    editTitle: 'Edit User',
    resetTitle: 'Reset Password'
  },
  {
    id: 2,
    initials: 'SM',
    initialsClass: 'bg-primary-fixed text-on-primary-fixed',
    name: 'Salma Mzali',
    matricule: 'MAT-10293',
    role: 'Manager RH',
    department: 'Ressources Humaines',
    status: { label: 'Actif', cls: 'bg-secondary-container text-on-secondary-container' }
  },
  {
    id: 3,
    initials: 'YT',
    initialsClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    name: 'Youssef Trabelsi',
    matricule: 'MAT-55821',
    role: 'Formateur Senior',
    department: 'Département Technique',
    status: { label: 'Inactif', cls: 'bg-surface-variant text-on-surface-variant' }
  },
  {
    id: 4,
    initials: 'NF',
    initialsClass: 'bg-primary-fixed text-on-primary-fixed',
    name: 'Nadia Feki',
    matricule: 'MAT-90334',
    role: 'Superviseur',
    department: 'Réseau Électrique',
    status: { label: 'Actif', cls: 'bg-secondary-container text-on-secondary-container' }
  }
];

const ROLES = ['Admin Système', 'Manager RH', 'Formateur Senior', 'Superviseur', 'Utilisateur'];

const EMPTY_USER_FORM = {
  name: '',
  matricule: '',
  role: ROLES[0],
  department: '',
  email: ''
};

export default function Administration() {
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [query, setQuery] = useState('');
  const [userModal, setUserModal] = useState(false);
  const [form, setForm] = useState(EMPTY_USER_FORM);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    alert(`Utilisateur ajouté : ${form.name || 'Sans nom'}`);
    setForm(EMPTY_USER_FORM);
    setUserModal(false);
  };

  const q = query.trim().toLowerCase();
  const filtered = USERS.filter(
    (user) =>
      q === '' ||
      user.name.toLowerCase().includes(q) ||
      user.matricule.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q)
  );

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Administration</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage system settings, roles, and user access levels across the portal.
        </p>
      </div>

      <div className="border-b border-outline-variant mb-6">
        <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 font-label-md text-label-md py-4 px-1 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'utilisateurs' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl shadow-ambient border border-outline-variant gap-4 flex-col md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
              />
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Rechercher par nom ou matricule..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md"
                type="button"
              >
                <Icon name="filter_list" className="text-[20px]" />
                Filtres
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md"
                type="button"
                onClick={() => setUserModal(true)}
              >
                <Icon name="person_add" className="text-[20px]" />
                Ajouter un Utilisateur
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                      Nom / Matricule
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                      Rôle
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                      Département
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                      Statut
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high bg-surface-container-lowest">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${user.initialsClass} flex items-center justify-center font-label-md font-bold`}
                          >
                            {user.initials}
                          </div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface font-semibold">
                              {user.name}
                            </div>
                            <div className="font-body-md text-body-md text-on-surface-variant text-[13px]">
                              {user.matricule}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface">
                        {user.role}
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface">
                        {user.department}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-label-sm ${user.status.cls} uppercase tracking-wider`}
                        >
                          {user.status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                          title={user.editTitle ? 'Edit User' : undefined}
                          type="button"
                        >
                          <Icon name="edit" className="text-[20px]" />
                        </button>
                        <button
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                          title={user.resetTitle ? 'Reset Password' : undefined}
                          type="button"
                        >
                          <Icon name="lock_reset" className="text-[20px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        className="px-6 py-4 font-body-md text-body-md text-on-surface-variant text-center"
                        colSpan={5}
                      >
                        Aucun utilisateur trouvé pour cette recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Affichage {filtered.length === 0 ? 0 : 1} à {filtered.length} sur 124 utilisateurs
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-outline-variant rounded bg-surface text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-md disabled:opacity-50"
                  type="button"
                  disabled
                >
                  Précédent
                </button>
                <button
                  className="px-3 py-1 border border-outline-variant rounded bg-surface text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-md"
                  type="button"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {userModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60"
          onClick={() => setUserModal(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">
                Ajouter un Utilisateur
              </h3>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                type="button"
                onClick={() => setUserModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSaveUser}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="user-name">
                  Nom complet
                </label>
                <input
                  id="user-name"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Karim Ben Ali"
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-matricule">
                    Matricule
                  </label>
                  <input
                    id="user-matricule"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    type="text"
                    placeholder="Ex : MAT-51000"
                    name="matricule"
                    value={form.matricule}
                    onChange={updateForm}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="user-role">
                    Rôle
                  </label>
                  <select
                    id="user-role"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    name="role"
                    value={form.role}
                    onChange={updateForm}
                  >
                    {ROLES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="user-department">
                  Département
                </label>
                <input
                  id="user-department"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : DSI Principale"
                  name="department"
                  value={form.department}
                  onChange={updateForm}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="user-email">
                  Email
                </label>
                <input
                  id="user-email"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="email"
                  placeholder="nom@steg.com.tn"
                  name="email"
                  value={form.email}
                  onChange={updateForm}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                  type="button"
                  onClick={() => setUserModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
                  type="submit"
                >
                  <Icon name="person_add" />
                  Ajouter l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}