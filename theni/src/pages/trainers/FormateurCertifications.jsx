import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';
import authService from '../../services/auth/authService';

const STATUS_BADGE = {
  VALIDE: 'bg-green-100 text-green-800',
  EXPIRE: 'bg-red-100 text-red-800',
  RENOUVELLEMENT: 'bg-orange-100 text-orange-800',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function FormateurCertifications() {
  const currentUser = authService.getCurrentUser();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [participants, setParticipants] = useState([]);
  const [formations, setFormations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [form, setForm] = useState({
    participantId: '',
    formationId: '',
    sessionId: '',
    dateEmission: new Date().toISOString().split('T')[0],
  });

  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      const { data } = await api.get('/certifications', { params });
      setCertifications(data.certifications || data || []);
    } catch (err) {
      console.error('Error fetching certifications:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [partRes, formRes, sessRes] = await Promise.allSettled([
        api.get('/users', { params: { role: 'participant', limit: 200 } }),
        api.get('/formations', { params: { limit: 200 } }),
        api.get('/sessions', { params: { limit: 200 } }),
      ]);
      if (partRes.status === 'fulfilled') setParticipants(partRes.value.data.users || []);
      if (formRes.status === 'fulfilled') setFormations(formRes.value.data.formations || []);
      if (sessRes.status === 'fulfilled') {
        const mySessions = (sessRes.value.data.sessions || []).filter(
          (s) => s.formateurId && s.formateur?.utilisateur?.id === currentUser?.id
        );
        setSessions(mySessions);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    } finally {
      setLoadingOptions(false);
    }
  }, [currentUser?.id]);

  const openModal = () => {
    setForm({
      participantId: '',
      formationId: '',
      sessionId: '',
      dateEmission: new Date().toISOString().split('T')[0],
    });
    setError('');
    fetchOptions();
    setModalOpen(true);
  };

  const updateForm = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setCreating(true);
      await api.post('/certifications', {
        participantId: Number(form.participantId),
        formationId: Number(form.formationId),
        sessionId: Number(form.sessionId),
        dateEmission: form.dateEmission,
      });
      setModalOpen(false);
      fetchCertifications();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const total = certifications.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Mes Certifications</h2>
          <p className="font-body-md text-on-surface-variant mt-2 max-w-2xl">
            Gérez les certificats délivrés aux participants de vos sessions.
          </p>
        </div>
        <button
          className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center justify-center gap-2"
          type="button" onClick={openModal}
        >
          <Icon name="add_circle" /> Nouveau Certificat
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl">
        <Icon name="info" className="text-primary" size={20} />
        <span className="text-body-sm text-on-surface-variant">
          Seules les sessions que vous avez animées sont disponibles pour la création de certificats.
        </span>
      </div>

      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-error-container">{error}</div>
      )}

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Réf.</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Participant</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Formation</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Émission</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Chargement...</td></tr>
              ) : certifications.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Aucune certification créée.</td></tr>
              ) : certifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-label-md text-primary font-bold">{cert.reference}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface">{cert.participant?.prenom} {cert.participant?.nom}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface">{cert.formation?.titre}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                    {new Date(cert.session?.dateDebut).toLocaleDateString('fr-FR')} — {cert.session?.lieu}
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface">{formatDate(cert.dateEmission)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-label-sm font-medium ${STATUS_BADGE[cert.statut] || 'bg-gray-100 text-gray-800'}`}>
                      {cert.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-background">Nouveau Certificat</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              {error && (
                <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-error-container">{error}</div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Session *</label>
                <select name="sessionId" value={form.sessionId} onChange={updateForm} required disabled={loadingOptions}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full">
                  <option value="">{loadingOptions ? 'Chargement...' : 'Sélectionnez une session'}</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.formation?.titre || 'Session'} — {new Date(s.dateDebut).toLocaleDateString('fr-FR')} ({s.lieu})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Participant *</label>
                <select name="participantId" value={form.participantId} onChange={updateForm} required disabled={loadingOptions}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full">
                  <option value="">{loadingOptions ? 'Chargement...' : 'Sélectionnez un participant'}</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>{p.prenom} {p.nom} — {p.email}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Formation *</label>
                <select name="formationId" value={form.formationId} onChange={updateForm} required disabled={loadingOptions}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full">
                  <option value="">{loadingOptions ? 'Chargement...' : 'Sélectionnez une formation'}</option>
                  {formations.map((f) => (
                    <option key={f.id} value={f.id}>{f.titre} ({f.reference})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Date d'émission *</label>
                <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="date" name="dateEmission" value={form.dateEmission} onChange={updateForm} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" disabled={creating} className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60">
                  <Icon name="add_circle" /> {creating ? 'Création...' : 'Créer le certificat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
