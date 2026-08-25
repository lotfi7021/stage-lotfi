import { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const generateMatricule = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STEG-${year}-${random}`;
};

const SPECIALITES_OPTIONS = [
  'Electrical Safety HV/LV',
  'Project Management',
  'Technical Skills',
  'Leadership & Management',
  'Digital Transformation',
  'Quality Management',
  'HSE (Health, Safety, Environment)',
  'Customer Service',
];

const EMPTY_TRAINER_FORM = {
  nom: '',
  prenom: '',
  email: '',
  specialite: '',
  qualifications: '',
  disponibilites: true
};

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [trainerModal, setTrainerModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerForm, setTrainerForm] = useState(EMPTY_TRAINER_FORM);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');

  const errorMessage = (err, fallback) => {
    const data = err.response?.data;
    if (data?.error) return data.error;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.msg || e.message).join(', ');
    }
    return fallback;
  };

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/formateurs');
      setTrainers(data.formateurs || []);
    } catch (err) {
      setError(errorMessage(err, 'Impossible de charger les formateurs.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const updateTrainerForm = (e) => {
    const { name, value, type, checked } = e.target;
    setTrainerForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = 
      (trainer.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trainer.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trainer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trainer.specialite || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = 
      filterAvailable === 'all' || 
      (filterAvailable === 'available' && trainer.disponibilites) ||
      (filterAvailable === 'unavailable' && !trainer.disponibilites);
    
    return matchesSearch && matchesAvailability;
  });

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post('/formateurs', trainerForm);
      setTrainers(prev => [...prev, data.formateur]);
      setTrainerForm(EMPTY_TRAINER_FORM);
      setTrainerModal(false);
      if (data.temporaryPassword) {
        alert(`Formateur créé avec succès.\n\nMot de passe temporaire : ${data.temporaryPassword}\n\nVeuillez le transmettre au formateur.`);
      }
    } catch (err) {
      setError(errorMessage(err, 'Erreur lors de la création du formateur.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditTrainer = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put(`/formateurs/${selectedTrainer.id}`, trainerForm);
      setTrainers(prev => prev.map(trainer =>
        trainer.id === selectedTrainer.id ? data.formateur : trainer
      ));
      setEditModal(false);
      setSelectedTrainer(null);
      setTrainerForm(EMPTY_TRAINER_FORM);
    } catch (err) {
      setError(errorMessage(err, 'Erreur lors de la mise à jour du formateur.'));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (trainer) => {
    setSelectedTrainer(trainer);
    setTrainerForm({
      nom: trainer.nom,
      prenom: trainer.prenom,
      email: trainer.email,
      specialite: trainer.specialite,
      qualifications: trainer.qualifications,
      disponibilites: trainer.disponibilites
    });
    setError('');
    setEditModal(true);
  };

  const handleDeleteTrainer = async () => {
    setSaving(true);
    setError('');
    try {
      await api.delete(`/formateurs/${deleteConfirm.id}`);
      setTrainers(prev => prev.filter(trainer => trainer.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(errorMessage(err, 'Erreur lors de la suppression du formateur.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Trainers Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Manage STEG trainers, their specialties, qualifications, and availability for training sessions.
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
            type="button" onClick={() => { setError(''); setTrainerForm(EMPTY_TRAINER_FORM); setTrainerModal(true); }}
          >
            <Icon name="person_add" /> Add Trainer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-[20px]" />
            <input
              type="text"
              placeholder="Search trainers by name, email, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-5 py-4 flex items-center justify-between gap-3">
          <p className="text-body-md text-on-error-container font-medium flex items-center gap-2">
            <Icon name="error" className="text-[20px]" /> {error}
          </p>
          <button type="button" onClick={() => setError('')} className="p-1 text-on-error-container hover:opacity-70 transition-opacity" title="Fermer">
            <Icon name="close" />
          </button>
        </div>
      )}

      {/* Trainers List */}
      <div className="flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Trainers List</h3>
              <p className="text-body-md text-on-surface-variant mt-1">{filteredTrainers.length} trainers found</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-body-md text-on-surface-variant">Loading trainers...</p>
            </div>
          ) : filteredTrainers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Trainer</th>
                    <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                            <Icon name="psychology" className="text-on-primary-container text-[18px]" />
                          </div>
                          <div>
                            <div className="font-label-md text-on-surface font-semibold">
                              {trainer.prenom} {trainer.nom}
                            </div>
                            <div className="text-body-sm text-on-surface-variant">{trainer.matricule}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body-md text-on-surface">{trainer.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body-md text-on-surface">{trainer.specialite}</div>
                        {trainer.qualifications && (
                          <div className="text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                            {trainer.qualifications}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-label-sm font-medium ${
                          trainer.disponibilites 
                            ? 'bg-success-container text-on-success-container' 
                            : 'bg-error-container text-on-error-container'
                        }`}>
                          {trainer.disponibilites ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" onClick={() => openEdit(trainer)}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                          <Icon name="edit" className="text-[18px]" />
                        </button>
                        <button type="button" onClick={() => setDeleteConfirm(trainer)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Delete">
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="psychology" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
              <h3 className="font-headline-sm text-on-surface-variant mb-2">No trainers found</h3>
              <p className="text-body-sm text-on-surface-variant mb-4">
                {searchTerm || filterAvailable !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Start by adding your first trainer to the system.'}
              </p>
              {(!searchTerm && filterAvailable === 'all') && (
                <button
                  className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center justify-center gap-2 mx-auto"
                  onClick={() => { setError(''); setTrainerForm(EMPTY_TRAINER_FORM); setTrainerModal(true); }}
                >
                  <Icon name="person_add" /> Add Trainer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Trainer Modal */}
      {trainerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setTrainerModal(false)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Add New Trainer</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setTrainerModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleCreateTrainer}>
              {error && (
                <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-2">
                  <Icon name="error" className="text-on-error-container text-[20px]" />
                  <p className="text-body-sm text-on-error-container font-medium">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">First Name *</label>
                  <input name="prenom" required value={trainerForm.prenom} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full"
                    placeholder="e.g. Ahmed" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Last Name *</label>
                  <input name="nom" required value={trainerForm.nom} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full"
                    placeholder="e.g. Ben Salah" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Email *</label>
                  <input name="email" type="email" required value={trainerForm.email} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full"
                    placeholder="e.g. ahmed.bensalah@steg.com.tn" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Specialty *</label>
                <select name="specialite" required value={trainerForm.specialite} onChange={updateTrainerForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full">
                  <option value="">Select a specialty...</option>
                  {SPECIALITES_OPTIONS.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Qualifications</label>
                <textarea name="qualifications" rows={3} value={trainerForm.qualifications} onChange={updateTrainerForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full resize-none"
                  placeholder="e.g. Electrical Engineer, Certified NFC 18-510" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="availability-create" name="disponibilites" checked={trainerForm.disponibilites} onChange={updateTrainerForm}
                  className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary" />
                <label htmlFor="availability-create" className="text-label-md text-on-surface">Available for training sessions</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setTrainerModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60">
                  <Icon name="person_add" /> {saving ? 'Adding...' : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainer Modal */}
      {editModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setEditModal(false)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Edit Trainer</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setEditModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleEditTrainer}>
              {error && (
                <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-2">
                  <Icon name="error" className="text-on-error-container text-[20px]" />
                  <p className="text-body-sm text-on-error-container font-medium">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">First Name *</label>
                  <input name="prenom" required value={trainerForm.prenom} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Last Name *</label>
                  <input name="nom" required value={trainerForm.nom} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Email *</label>
                  <input name="email" type="email" required value={trainerForm.email} onChange={updateTrainerForm}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Specialty *</label>
                <select name="specialite" required value={trainerForm.specialite} onChange={updateTrainerForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full">
                  <option value="">Select a specialty...</option>
                  {SPECIALITES_OPTIONS.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Qualifications</label>
                <textarea name="qualifications" rows={3} value={trainerForm.qualifications} onChange={updateTrainerForm}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim w-full resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="availability-edit" name="disponibilites" checked={trainerForm.disponibilites} onChange={updateTrainerForm}
                  className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary" />
                <label htmlFor="availability-edit" className="text-label-md text-on-surface">Available for training sessions</label>
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
                <h3 className="font-headline-sm text-headline-sm text-on-background">Delete Trainer</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Are you sure you want to delete this trainer?</p>
              </div>
            </div>
            <div className="bg-surface-container p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                  <Icon name="psychology" className="text-on-primary-container text-[14px]" />
                </div>
                <div>
                  <div className="font-label-md text-on-surface font-semibold">
                    {deleteConfirm.prenom} {deleteConfirm.nom}
                  </div>
                  <div className="text-body-sm text-on-surface-variant">{deleteConfirm.specialite}</div>
                </div>
              </div>
              <p className="text-body-sm text-error mt-2 font-semibold">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button type="button" disabled={saving} className="bg-error text-on-error hover:bg-[#ba1a1a] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60" onClick={handleDeleteTrainer}>
                <Icon name="delete" /> {saving ? 'Deleting...' : 'Delete Trainer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}