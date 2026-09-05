import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const MONTH_LABELS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

const WEEKDAYS = ['LUN','MAR','MER','JEU','VEN','SAM','DIM'];

const STATUT_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Planning() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    formationId: '',
    formateurId: '',
    dateDebut: '',
    dateFin: '',
    lieu: '',
  });
  const [success, setSuccess] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sessionsRes, formationsRes, formateursRes] = await Promise.allSettled([
        api.get('/sessions', { params: { limit: 100 } }),
        api.get('/formations', { params: { limit: 100 } }),
        api.get('/formateurs'),
      ]);
      setSessions(sessionsRes.status === 'fulfilled' ? (sessionsRes.value.data.sessions || []) : []);
      setFormations(formationsRes.status === 'fulfilled' ? (formationsRes.value.data.formations || []) : []);
      setFormateurs(formateursRes.status === 'fulfilled' ? (formateursRes.value.data.formateurs || []) : []);

      const errors = [sessionsRes, formationsRes, formateursRes]
        .filter(r => r.status === 'rejected')
        .map(r => r.reason?.response?.data?.error || r.reason?.message);
      if (errors.length) setError(errors.join(' | '));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFormationTitre = (session) => session?.formation?.titre || 'N/A';
  const getFormateurNom = (session) => {
    const u = session?.formateur?.utilisateur;
    return u ? `${u.prenom || ''} ${u.nom || ''}`.trim() || 'N/A' : 'N/A';
  };

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    else if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y);
  };

  const goToday = () => { setMonth(today.getMonth() + 1); setYear(today.getFullYear()); };

  const buildCells = () => {
    const first = new Date(year, month - 1, 1);
    const leading = (first.getDay() + 6) % 7;
    const days = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const calendarEvents = useMemo(() => {
    const events = {};
    sessions.forEach((s) => {
      const d = new Date(s.dateDebut);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        const day = d.getDate();
        if (!events[day]) events[day] = [];
        events[day].push(s);
      }
    });
    return events;
  }, [sessions, year, month]);

  const isWeekend = (day) => {
    const d = new Date(year, month - 1, day).getDay();
    return d === 0 || d === 6;
  };

  const isToday = (day) => {
    return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        formationId: parseInt(form.formationId),
        formateurId: parseInt(form.formateurId),
        dateDebut: form.dateDebut,
        dateFin: form.dateFin || form.dateDebut,
        lieu: form.lieu,
      };
      await api.post('/sessions', payload);
      setModalOpen(false);
      setForm({ formationId: '', formateurId: '', dateDebut: '', dateFin: '', lieu: '' });
      setSuccess('Session créée avec succès !');
      await fetchData();
    } catch (err) {
      console.error('Erreur création session:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création.');
    }
  };

  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/sessions/${sessionToDelete.id}`);
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      setSuccess('Session supprimée avec succès !');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const cells = buildCells();

  const upcomingSessions = useMemo(() => {
    return sessions
      .filter((s) => new Date(s.dateDebut) >= new Date())
      .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
      .slice(0, 5);
  }, [sessions]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end flex-col lg:flex-row gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background font-bold mb-2">Planning des Sessions</h2>
          <p className="font-body-md text-on-surface-variant">Calendrier des sessions de formation STEG.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md hover:bg-surface-container-low transition-colors shadow-sm"
            type="button" onClick={() => setListModalOpen(true)}
          >
            <Icon name="list" /> Liste des Sessions
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-on-primary rounded-xl font-label-md hover:bg-[#004494] transition-colors shadow-sm"
            type="button" onClick={() => setModalOpen(true)}
          >
            <Icon name="add" /> Nouvelle Session
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-error-container">{typeof error === 'string' ? error : error.message || 'Erreur inconnue'}</div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 rounded-xl px-4 py-3 text-sm text-green-800">{success}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow w-full lg:w-3/4 min-w-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant flex-wrap gap-3">
              <h3 className="font-headline-md text-on-surface">{MONTH_LABELS[month - 1]} {year}</h3>
              <div className="flex gap-2">
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant" type="button" onClick={() => changeMonth(-1)}>
                  <Icon name="chevron_left" />
                </button>
                <button className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-label-md text-on-surface" type="button" onClick={goToday}>
                  Aujourd'hui
                </button>
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant" type="button" onClick={() => changeMonth(1)}>
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-outline-variant/20">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center font-semibold py-2 bg-surface-container-low text-on-surface-variant text-label-sm">{day}</div>
              ))}
              {cells.map((day, index) => {
                if (day === null) return <div key={`e-${index}`} className="min-h-[100px] bg-surface-container-lowest/50" />;
                const events = calendarEvents[day] || [];
                return (
                  <div key={day} className={`min-h-[100px] p-2 text-label-sm text-on-surface transition-colors ${isToday(day) ? 'bg-primary/10 ring-1 ring-inset ring-primary' : isWeekend(day) ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                    <span className={`font-medium ${isToday(day) ? 'text-primary font-bold' : ''}`}>{day}</span>
                    {events.map((event) => (
                      <div key={event.id} className="mt-1 p-1 bg-primary-container text-on-primary rounded text-xs truncate flex items-center justify-between" title={getFormationTitre(event)}>
                        <span className="truncate">{getFormationTitre(event)}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openDeleteModal(event); }}
                          className="ml-1 p-0.5 hover:text-red-200 transition-colors shrink-0"
                          title="Supprimer"
                        >
                          <Icon name="close" size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5">
            <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
              <Icon name="view_week" className="text-primary" /> Prochaines Sessions
            </h3>
            <div className="flex flex-col gap-3">
              {loading ? (
                <p className="text-body-sm text-on-surface-variant text-center py-4">Chargement...</p>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant text-center py-4">Aucune session prévue.</p>
              ) : upcomingSessions.map((session) => (
                <div key={session.id} className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {new Date(session.dateDebut).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUT_COLORS[session.statut] || ''}`}>
                        {session.statut}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(session)}
                        className="p-1 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer la session"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-label-md text-on-surface font-semibold truncate mt-1">{getFormationTitre(session)}</h4>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <Icon name="person" size={14} />{getFormateurNom(session)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <Icon name="location_on" size={14} />{session.lieu}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-background">Nouvelle Session</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleCreate}>
              {error && (
                <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-error-container">{error}</div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Formation *</label>
                <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  value={form.formationId} onChange={(e) => setForm((f) => ({ ...f, formationId: e.target.value }))} required>
                  <option value="">Sélectionnez une formation</option>
                  {formations.map((f) => <option key={f.id} value={f.id}>{f.titre} ({f.reference})</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Formateur *</label>
                <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  value={form.formateurId} onChange={(e) => setForm((f) => ({ ...f, formateurId: e.target.value }))} required>
                  <option value="">Sélectionnez un formateur</option>
                  {formateurs.map((f) => <option key={f.id} value={f.id}>{f.prenom} {f.nom} - {f.specialite || 'N/A'}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Date début *</label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="date" value={form.dateDebut} onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Date fin *</label>
                  <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="date" value={form.dateFin} onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))} required />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Lieu *</label>
                <input className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="text" placeholder="ex: Centre STEG Tunis" value={form.lieu} onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2">
                  <Icon name="add" /> Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => { setDeleteModalOpen(false); setSessionToDelete(null); }}>
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-on-background">Supprimer la session</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => { setDeleteModalOpen(false); setSessionToDelete(null); }}>
                <Icon name="close" />
              </button>
            </div>
            <p className="text-body-md text-on-surface-variant mb-6">
              Voulez-vous vraiment supprimer la session <strong>{getFormationTitre(sessionToDelete)}</strong> prévue le <strong>{new Date(sessionToDelete.dateDebut).toLocaleDateString('fr-FR')}</strong> ?
            </p>
            <p className="text-body-sm text-red-500 mb-4">Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                onClick={() => { setDeleteModalOpen(false); setSessionToDelete(null); }}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600 transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Suppression...' : <><Icon name="delete" /> Supprimer</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setListModalOpen(false)}>
          <div className="w-full max-w-4xl max-h-[80vh] bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h3 className="font-headline-md text-on-background">Liste des Sessions ({sessions.length})</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setListModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {sessions.length === 0 ? (
                <p className="text-body-md text-on-surface-variant text-center py-8">Aucune session enregistrée.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Formation</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Formateur</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Date début</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Date fin</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Lieu</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant">Statut</th>
                        <th className="pb-3 text-label-md font-semibold text-on-surface-variant text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                          <td className="py-3 text-body-sm text-on-surface font-medium">{getFormationTitre(session)}</td>
                          <td className="py-3 text-body-sm text-on-surface-variant">{getFormateurNom(session)}</td>
                          <td className="py-3 text-body-sm text-on-surface-variant">{new Date(session.dateDebut).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 text-body-sm text-on-surface-variant">{new Date(session.dateFin).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 text-body-sm text-on-surface-variant">{session.lieu}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUT_COLORS[session.statut] || ''}`}>
                              {session.statut}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => { setListModalOpen(false); openDeleteModal(session); }}
                              className="p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Icon name="delete" size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
