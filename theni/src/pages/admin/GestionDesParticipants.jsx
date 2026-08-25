import React, { useRef, useState, useEffect, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const generateMatricule = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STEG-${year}-${random}`;
};

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  genre: 'Male',
  dateNaissance: '',
  roleId: '',
  isActive: true,
};

export default function GestionDesParticipants() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Charger les rôles pour les filtres et le formulaire
  useEffect(() => {
    api.get('/roles')
      .then(({ data }) => setRoles(data.roles || []))
      .catch(() => setRoles([]));
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter === 'active';
      const { data } = await api.get('/users', { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(errorMessage(err, 'Impossible de charger les utilisateurs.'));
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const initialsFor = (prenom, nom) =>
    `${(prenom || '?')[0]}${(nom || '?')[0]}`.toUpperCase();

  const roleName = (user) => user.role?.nomRole || 'Inconnu';

  const errorMessage = (err, fallback) => {
    const data = err.response?.data;
    if (data?.error) return data.error;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.msg || e.message).join(', ');
    }
    return fallback;
  };

  const handleImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    alert('Import functionality requires backend integration.');
    e.target.value = '';
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    if (!roles.length) {
      setError('Impossible de créer un utilisateur : aucun rôle n\'est disponible.');
      return;
    }
    setModalMode('create');
    setEditingId(null);
    setForm({ ...EMPTY_FORM, roleId: roles[0]?.id || '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = async (user) => {
    setModalMode('edit');
    setEditingId(user.id);
    setError('');
    setModalOpen(true);
    let u = user;
    try {
      const { data } = await api.get(`/users/${user.id}`);
      if (data?.user) u = data.user;
    } catch (err) {
      // En cas d'échec, on utilise les données de la ligne
    }
    setForm({
      nom: u.nom || '',
      prenom: u.prenom || '',
      email: u.email || '',
      motDePasse: '',
      matricule: u.matricule || '',
      genre: u.genre || 'Male',
      dateNaissance: u.dateNaissance ? u.dateNaissance.slice(0, 10) : '',
      roleId: u.role?.id || roles[0]?.id || '',
      isActive: u.isActive,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (modalMode === 'edit' && form.motDePasse && form.motDePasse.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        matricule: form.matricule,
        genre: form.genre,
        roleId: Number(form.roleId) || null,
        isActive: form.isActive,
      };
      if (!payload.roleId) {
        setError('Sélectionnez un rôle valide.');
        return;
      }
      if (form.dateNaissance) payload.dateNaissance = form.dateNaissance;

      if (modalMode === 'create') {
        payload.motDePasse = form.motDePasse;
        await api.post('/users', payload);
      } else {
        if (form.motDePasse) payload.motDePasse = form.motDePasse;
        await api.put(`/users/${editingId}`, payload);
      }

      setModalOpen(false);
      setForm(EMPTY_FORM);
      fetchUsers();
    } catch (err) {
      setError(errorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    const action = user.isActive ? 'désactiver' : 'activer';
    if (!window.confirm(`Voulez-vous ${action} le compte de ${user.prenom} ${user.nom} ?`)) return;
    try {
      await api.patch(`/users/${user.id}/status`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      setError(errorMessage(err, 'Erreur lors du changement de statut.'));
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer définitivement le compte de ${user.prenom} ${user.nom} ?`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      fetchUsers();
    } catch (err) {
      setError(errorMessage(err, 'Erreur lors de la suppression.'));
    }
  };

  const filtered = users;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">User Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage all users, track their status and roles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface border border-primary text-primary font-label-md rounded-xl hover:bg-surface-container-low transition-all"
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <Icon name="upload" size={20} />
            Import
          </button>
          <input ref={fileInputRef} className="hidden" type="file" accept=".csv,text/csv" onChange={handleImport} />
          <button
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary rounded-xl font-label-md hover:brightness-95 transition-all shadow-sm"
            type="button"
            onClick={openCreate}
          >
            <Icon name="person_add" size={20} />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-t-xl border-x border-t border-outline-variant p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
          <div className="relative w-full max-w-sm">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary transition-shadow"
              placeholder="Search by name, email, matricule..."
              type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select className="w-full max-w-xs pl-4 pr-10 py-2 border border-outline-variant rounded-lg text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary bg-surface-container-lowest"
            value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            {roles.map((role) => <option key={role.id} value={role.nomRole}>{role.nomRole}</option>)}
          </select>
          <select className="w-full max-w-xs pl-4 pr-10 py-2 border border-outline-variant rounded-lg text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary bg-surface-container-lowest"
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary font-label-md hover:bg-surface-container-low rounded-lg transition-colors shrink-0" type="button">
          <Icon name="download" size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-b-xl border border-outline-variant shadow-[0_4px_24px_rgba(0,51,102,0.06)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">Matricule</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {loading ? (
              <tr><td className="px-6 py-8 text-body-md text-on-surface-variant text-center" colSpan={7}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-6 py-8 text-body-md text-on-surface-variant text-center" colSpan={7}>No users match the search criteria.</td></tr>
            ) : filtered.map((user) => (
              <tr key={user.id} className="hover:bg-surface transition-colors group">
                <td className="px-6 py-4 font-label-md text-primary font-bold">#{user.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md font-bold shrink-0">{initialsFor(user.prenom, user.nom)}</div>
                    <div>
                      <p className="font-body-md text-on-surface font-medium">{user.prenom} {user.nom}</p>
                      <p className="text-label-sm text-on-surface-variant">{user.genre || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-body-sm text-on-surface font-mono">{user.matricule || '—'}</td>
                <td className="px-6 py-4 text-body-sm text-on-surface-variant">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 border border-purple-200 tracking-wide uppercase">{roleName(user)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${user.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors" type="button" title="Edit" onClick={() => openEdit(user)}>
                      <Icon name="edit" size={20} />
                    </button>
                    <button className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors" type="button" title={user.isActive ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(user)}>
                      <Icon name={user.isActive ? 'toggle_off' : 'toggle_on'} size={20} />
                    </button>
                    <button className="text-on-surface-variant hover:text-error p-1 rounded transition-colors" type="button" title="Delete" onClick={() => handleDelete(user)}>
                      <Icon name="delete" size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <span className="text-body-md text-on-surface-variant">
            Showing {filtered.length} of {total} users
          </span>
          <div className="flex items-center gap-1">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-50" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <Icon name="chevron_left" size={20} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-label-md" type="button">{page}</span>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-50" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <Icon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-background">{modalMode === 'create' ? 'New User' : `Edit User #${editingId}`}</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setModalOpen(false)}><Icon name="close" /></button>
            </div>
            {error && (
              <div className="mb-4 rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
                {error}
              </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Last Name <span className="text-error">*</span></label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="text" placeholder="e.g. Jlassi" name="nom" value={form.nom} onChange={updateForm} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">First Name <span className="text-error">*</span></label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="text" placeholder="e.g. Mohamed Amine" name="prenom" value={form.prenom} onChange={updateForm} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Email <span className="text-error">*</span></label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="email" placeholder="e.g. m.jlassi@steg.com.tn" name="email" value={form.email} onChange={updateForm} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">{modalMode === 'create' ? 'Password' : 'New Password (optional)'}</label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="password" placeholder={modalMode === 'create' ? 'Enter password' : 'Leave empty to keep'} name="motDePasse" value={form.motDePasse} onChange={updateForm} required={modalMode === 'create'} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Gender</label>
                  <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    name="genre" value={form.genre} onChange={updateForm}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Date of Birth</label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="date" name="dateNaissance" value={form.dateNaissance} onChange={updateForm} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Role</label>
                  <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    name="roleId" value={form.roleId} onChange={updateForm} required>
                    {roles.filter((role) => role.nomRole !== 'formateur').map((role) => <option key={role.id} value={role.id}>{role.nomRole}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Account Status</label>
                  <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    name="isActive" value={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'true' }))}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60">
                  <Icon name={modalMode === 'create' ? 'person_add' : 'save'} />
                  {saving ? 'Saving...' : (modalMode === 'create' ? 'Add User' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
