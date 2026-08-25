import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const generateReference = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FORM-${year}-${random}`;
};

const EMPTY_FORM = {
  titre: '',
  reference: generateReference(),
  categorie: '',
  duree: '',
  maxParticipants: '',
  prix: '',
  objectifs: '',
  prerequis: '',
  modules: '',
  statut: 'PLANNED',
};

const CATEGORIES = ['Sécurité', 'Management', 'Technique', 'Informatique'];
const STATUTS = [
  { value: 'PLANNED', label: 'Planifiée' },
  { value: 'ACTIVE', label: 'Active' },
];

export default function GestionDesFormationsAjout() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.titre || !form.reference || !form.categorie || !form.duree || !form.maxParticipants) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titre: form.titre,
        reference: form.reference,
        categorie: form.categorie,
        duree: form.duree,
        maxParticipants: parseInt(form.maxParticipants, 10),
        prix: form.prix ? parseFloat(form.prix) : undefined,
        objectifs: form.objectifs || undefined,
        prerequis: form.prerequis || undefined,
        modules: form.modules || undefined,
        statut: form.statut,
      };

      await api.post('/formations', payload);
      navigate('/formations');
    } catch (err) {
      const backendError = err.response?.data?.error;
      setError(backendError || 'Une erreur est survenue lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/formations')}
            className="mb-3 inline-flex items-center gap-1.5 text-label-md text-primary hover:underline"
          >
            <Icon name="arrow_back" /> Retour aux formations
          </button>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Ajouter une Formation</h2>
          <p className="font-body-md text-on-surface-variant">
            Créer un nouveau programme de formation dans la base de données.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-2">
          <Icon name="error" className="text-on-error-container text-[20px]" />
          <p className="text-body-sm text-on-error-container font-medium">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Titre *</label>
            <input
              name="titre"
              value={form.titre}
              onChange={updateForm}
              placeholder="ex: Sécurité Électrique BT"
              required
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Référence *</label>
            <div className="flex gap-2">
              <input
                name="reference"
                value={form.reference}
                readOnly
                className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono text-on-surface-variant cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, reference: generateReference() }))}
                className="px-3 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                title="Régénérer"
              >
                <Icon name="refresh" className="text-[18px]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Catégorie *</label>
            <select
              name="categorie"
              value={form.categorie}
              onChange={updateForm}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Sélectionnez...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Durée *</label>
            <input
              name="duree"
              value={form.duree}
              onChange={updateForm}
              placeholder="ex: 40h"
              required
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Max Participants *</label>
            <input
              name="maxParticipants"
              type="number"
              min="1"
              value={form.maxParticipants}
              onChange={updateForm}
              placeholder="ex: 25"
              required
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Prix (TND)</label>
            <input
              name="prix"
              type="number"
              min="0"
              step="0.01"
              value={form.prix}
              onChange={updateForm}
              placeholder="ex: 1500.00"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={updateForm}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {STATUTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Objectifs</label>
            <textarea
              name="objectifs"
              rows={3}
              value={form.objectifs}
              onChange={updateForm}
              placeholder="Décrivez les objectifs pédagogiques..."
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Prérequis</label>
            <textarea
              name="prerequis"
              rows={2}
              value={form.prerequis}
              onChange={updateForm}
              placeholder="Connaissances préalables requises..."
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Modules</label>
            <textarea
              name="modules"
              rows={3}
              value={form.modules}
              onChange={updateForm}
              placeholder="Liste des modules de la formation..."
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
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60"
          >
            <Icon name="add" />
            {loading ? 'Création...' : 'Créer la Formation'}
          </button>
        </div>
      </form>
    </div>
  );
}
