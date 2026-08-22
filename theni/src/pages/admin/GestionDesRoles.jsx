import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const ROLE_COLORS = [
  { color: 'bg-primary-container text-on-primary', dot: 'bg-primary' },
  { color: 'bg-secondary-container text-on-secondary-container', dot: 'bg-secondary' },
  { color: 'bg-surface-variant text-on-surface-variant', dot: 'bg-outline' },
  { color: 'bg-tertiary-container text-on-tertiary-container', dot: 'bg-tertiary' },
  { color: 'bg-error-container text-on-error-container', dot: 'bg-error' },
];

const roleStyle = (role) => {
  const scheme = ROLE_COLORS[role.id % ROLE_COLORS.length] || ROLE_COLORS[0];
  return { ...scheme, usersCount: role._count?.utilisateurs ?? 0 };
};

const EMPTY_ROLE_FORM = { nomRole: '', description: '' };

export default function GestionDesRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/roles');
      setRoles(data.roles || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Impossible de charger les rôles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const updateRoleForm = (e) => {
    const { name, value } = e.target;
    setRoleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/roles', roleForm);
      setRoleForm(EMPTY_ROLE_FORM);
      setRoleModal(false);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/roles/${selectedRole.id}`, roleForm);
      setEditModal(false);
      setSelectedRole(null);
      setRoleForm(EMPTY_ROLE_FORM);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (role) => {
    setSelectedRole(role);
    setRoleForm({ nomRole: role.nomRole, description: role.description || '' });
    setError('');
    setEditModal(true);
  };

  const handleDeleteRole = async () => {
    setSaving(true);
    setError('');
    try {
      await api.delete(`/roles/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la suppression.');
      setDeleteConfirm(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Role Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Define and manage access levels and permissions for each user profile.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="border border-primary text-primary hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md flex items-center justify-center gap-2 w-full sm:w-auto"
            type="button" onClick={() => window.print()}
          >
            <Icon name="picture_as_pdf" /> Export PDF
          </button>
          <button
            className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center justify-center gap-2 w-full sm:w-auto"
            type="button" onClick={() => { setRoleForm(EMPTY_ROLE_FORM); setError(''); setRoleModal(true); }}
          >
            <Icon name="add" /> Create Role
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        ) : roles.map((role) => {
          const style = roleStyle(role);
          return (
            <div key={role.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${style.color}`}>{role.nomRole}</span>
                <span className={`w-2.5 h-2.5 rounded-full mt-1 ${style.dot}`} />
              </div>
              <p className="font-label-md text-on-surface font-semibold leading-tight">{role.nomRole}</p>
              <p className="font-label-sm text-on-surface-variant">{style.usersCount} users</p>
              <p className="font-label-sm text-on-surface-variant">{role.description || '—'}</p>
            </div>
          );
        })}
      </div>

      {/* Roles List */}
      <div className="flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Roles List</h3>
              <p className="text-body-md text-on-surface-variant mt-1">{roles.length} roles configured</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Users</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {loading ? (
                  <tr><td className="px-6 py-8 text-body-md text-on-surface-variant text-center" colSpan={4}>Loading...</td></tr>
                ) : roles.length === 0 ? (
                  <tr><td className="px-6 py-8 text-body-md text-on-surface-variant text-center" colSpan={4}>No roles found.</td></tr>
                ) : roles.map((role) => {
                  const style = roleStyle(role);
                  return (
                    <tr key={role.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${style.dot}`} />
                          <span className="font-label-md text-on-surface font-semibold">{role.nomRole}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-sm text-on-surface-variant">{style.usersCount}</td>
                      <td className="px-6 py-4 text-body-sm text-on-surface-variant">{role.description || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" onClick={() => openEdit(role)}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                          <Icon name="edit" className="text-[18px]" />
                        </button>
                        <button type="button" onClick={() => setDeleteConfirm(role)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Delete">
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setRoleModal(false)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Create New Role</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setRoleModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleCreateRole}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Role Name</label>
                <input name="nomRole" required value={roleForm.nomRole} onChange={updateRoleForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full"
                  placeholder="e.g. Manager" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Description</label>
                <textarea name="description" rows={2} value={roleForm.description} onChange={updateRoleForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full resize-none"
                  placeholder="Role description..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setRoleModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60">
                  <Icon name="add" /> {saving ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setEditModal(false)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Edit Role</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setEditModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleEditRole}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Role Name</label>
                <input name="nomRole" required value={roleForm.nomRole} onChange={updateRoleForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Description</label>
                <textarea name="description" rows={2} value={roleForm.description} onChange={updateRoleForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60">
                  <Icon name="save" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center shrink-0">
                <Icon name="warning" className="text-on-error-container text-[24px]" />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-background">Delete Role</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Are you sure you want to delete this role?</p>
              </div>
            </div>
            <div className="bg-surface-container p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${roleStyle(deleteConfirm).dot}`} />
                <span className="font-label-md text-on-surface font-semibold">{deleteConfirm.nomRole}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-2">{deleteConfirm.description}</p>
              <p className="text-body-sm text-error mt-2 font-semibold">{roleStyle(deleteConfirm).usersCount} users currently have this role</p>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" disabled={saving} className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button type="button" disabled={saving} className="bg-error text-on-error hover:bg-[#ba1a1a] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60" onClick={handleDeleteRole}>
                <Icon name="delete" /> {saving ? 'Deleting...' : 'Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
