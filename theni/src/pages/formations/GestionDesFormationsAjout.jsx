import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';

const EMPTY_FORM = {
  title: '',
  category: '',
  duration: '',
  basePrice: '',
  prerequisites: '',
  objectives: '',
  description: '',
  status: 'planned',
};

const CATEGORIES = ['Safety', 'Management', 'Technical', 'IT & Software'];

export default function GestionDesFormationsAjout() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.duration) {
      setError('Veuillez remplir les champs obligatoires (titre, catégorie, durée).');
      return;
    }
    const newFormation = {
      id: Date.now(),
      titre: form.title,
      categorie: form.category,
      duree_jours: parseInt(form.duration, 10) || 0,
      prix_base: parseFloat(form.basePrice) || 0,
      prerequis: form.prerequisites,
      objectifs: form.objectives,
      description: form.description,
      statut: form.status,
      created_at: new Date().toISOString(),
    };
    console.log('Nouvelle formation :', newFormation);
    alert(`Formation « ${newFormation.titre} » ajoutée avec succès.`);
    navigate('/formations');
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/formations')}
            className="mb-3 inline-flex items-center gap-1.5 text-label-md text-primary hover:underline"
          >
            <Icon name="arrow_back" /> Back to Training Programs
          </button>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Add Training Program</h2>
          <p className="font-body-md text-on-surface-variant">
            Create a new training program record in the <strong>formations</strong> table.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-2">
          <Icon name="error" className="text-on-error-container text-[20px]" />
          <p className="text-body-sm text-on-error-container font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={updateForm}
              placeholder="e.g. Electrical Safety Certification BR"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={updateForm}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Duration (days) *</label>
            <input
              name="duration"
              type="number"
              min="1"
              value={form.duration}
              onChange={updateForm}
              placeholder="e.g. 5"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Base Price (TND)</label>
            <input
              name="basePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              onChange={updateForm}
              placeholder="e.g. 1200"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Initial Status</label>
            <div className="flex gap-6 h-full items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="status"
                  type="radio"
                  value="planned"
                  checked={form.status === 'planned'}
                  onChange={updateForm}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-body-md">Planned</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="status"
                  type="radio"
                  value="active"
                  checked={form.status === 'active'}
                  onChange={updateForm}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-body-md">Active</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Prerequisites</label>
            <textarea
              name="prerequisites"
              rows={2}
              value={form.prerequisites}
              onChange={updateForm}
              placeholder="e.g. Basic electricity knowledge"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Learning Objectives</label>
            <textarea
              name="objectives"
              rows={3}
              value={form.objectives}
              onChange={updateForm}
              placeholder="List the main objectives of the training..."
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={updateForm}
              placeholder="Brief description of the course..."
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
          <button
            type="button"
            onClick={() => navigate('/formations')}
            className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
          >
            <Icon name="add" /> Add Training
          </button>
        </div>
      </form>
    </div>
  );
}