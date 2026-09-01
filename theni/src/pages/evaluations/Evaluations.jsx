import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import evaluationService from '../../services/evaluations/evaluationService';
import formationService from '../../services/formations/formationService';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const STAT_COLORS = {
  OPEN: 'text-on-surface-variant',
  SUBMITTED: 'text-primary',
  VALIDATED: 'text-green-600',
};

export default function Evaluations() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [campaignModal, setCampaignModal] = useState(false);
  const [form, setForm] = useState({ sessionId: '', type: 'SATISFACTION', date: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await formationService.getAllFormations({ limit: 100 });
        const allSessions = [];
        for (const f of (data || [])) {
          const res = await formationService.getFormationSessions(f.id);
          for (const s of (res.data || [])) {
            allSessions.push({ ...s, formationTitre: f.titre });
          }
        }
        setSessions(allSessions);
        if (allSessions.length > 0) setSelectedSessionId(String(allSessions[0].id));
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
    fetchSessions();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (selectedSessionId) params.sessionId = selectedSessionId;
      const { data, total: t, totalPages: tp } = await evaluationService.getAllEvaluations(params);
      setEvaluations(data || []);
      setTotal(t || 0);
      setTotalPages(tp || 1);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSessionId) fetchEvaluations();
  }, [selectedSessionId, page]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await evaluationService.createEvaluation({
        sessionId: Number(form.sessionId || selectedSessionId),
        type: form.type,
        date: form.date || new Date().toISOString(),
      });
      setForm({ sessionId: '', type: 'SATISFACTION', date: '' });
      setCampaignModal(false);
      fetchEvaluations();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  const selectedSession = sessions.find((s) => String(s.id) === String(selectedSessionId));

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((acc, e) => acc + (e.score || 0), 0) / evaluations.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-[1200px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            Gestion des Évaluations
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Consultez les retours des participants, analysez la satisfaction globale et gérez les
            rapport d'évaluation par session de formation.
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="bg-surface-lowest border border-primary text-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2" onClick={handleExportPdf}>
            <Icon name="download" size={14} />
            Exporter PDF
          </button>
          <button type="button" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-[#004494] transition-colors shadow-sm" onClick={() => setCampaignModal(true)}>
            Nouvelle Campagne
          </button>
        </div>
      </header>

      <section className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Sélectionner une Session
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all" value={selectedSessionId} onChange={(e) => { setSelectedSessionId(e.target.value); setPage(1); }}>
              {sessions.length === 0 && <option value="">Aucune session disponible</option>}
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.formationTitre} - {s.lieu || s.id}</option>
              ))}
            </select>
            <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
        <div className="hidden md:block w-px h-12 bg-outline-variant" />
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Formateur</p>
            <p className="font-body-md text-body-md font-medium text-on-surface">
              {selectedSession?.formateur?.utilisateur?.prenom} {selectedSession?.formateur?.utilisateur?.nom || '-'}
            </p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Date</p>
            <p className="font-body-md text-body-md font-medium text-on-surface">
              {selectedSession ? `${formatDate(selectedSession.dateDebut)} - ${formatDate(selectedSession.dateFin)}` : '-'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">Score Moyen</h3>
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
              <Icon name="star" className="text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-primary">{avgScore}</span>
              <span className="font-body-lg text-body-lg text-on-surface-variant">/ 5</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">Total Évaluations</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
              <Icon name="fact_check" className="text-secondary" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">{total}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-4">Statuts</h3>
          <div className="space-y-2">
            {['OPEN', 'SUBMITTED', 'VALIDATED'].map((statut) => {
              const count = evaluations.filter((e) => e.statut === statut).length;
              return (
                <div key={statut} className="flex items-center gap-3">
                  <span className={`font-label-sm text-label-sm w-20 ${STAT_COLORS[statut]}`}>{statut}</span>
                  <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }} />
                  </div>
                  <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-md text-headline-md text-on-surface">Résultats Individuels</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Participant</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Date</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Type</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Score</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Commentaire</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-on-surface-variant">Chargement...</td></tr>
              ) : evaluations.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-on-surface-variant">Aucune évaluation pour cette session.</td></tr>
              ) : (
                evaluations.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-body-md text-body-md text-on-surface font-medium">
                        {ev.participant?.prenom} {ev.participant?.nom}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {ev.participant?.matricule}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{formatDate(ev.date)}</td>
                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{ev.type}</td>
                    <td className="py-4 px-6">
                      <span className="font-label-md text-label-md font-bold text-primary">{ev.score ?? '-'}</span>
                    </td>
                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface max-w-xs truncate">{ev.commentaire || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`font-label-sm text-label-sm font-medium ${STAT_COLORS[ev.statut] || ''}`}>{ev.statut}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-center bg-surface-bright">
          <div className="flex gap-1">
            <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <Icon name="chevron_left" />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" className={`px-3 py-1 rounded font-label-md text-label-md ${p === page ? 'bg-primary-container text-on-primary' : 'text-on-surface hover:bg-surface-container'}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </section>

      {campaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setCampaignModal(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Nouvelle Campagne d'évaluation</h3>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" type="button" onClick={() => setCampaignModal(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSaveCampaign}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="campaign-session">Session</label>
                <select id="campaign-session" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="sessionId" value={form.sessionId} onChange={updateForm} required>
                  <option value="">Choisir une session...</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>{s.formationTitre} - {s.lieu || s.id}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="campaign-type">Type</label>
                <select id="campaign-type" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="type" value={form.type} onChange={updateForm}>
                  <option value="SATISFACTION">Satisfaction</option>
                  <option value="PRE">Pré-formation</option>
                  <option value="POST">Post-formation</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="campaign-date">Date</label>
                <input id="campaign-date" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="date" name="date" value={form.date} onChange={updateForm} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" type="button" onClick={() => setCampaignModal(false)}>Annuler</button>
                <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2" type="submit" disabled={creating}>
                  <Icon name="add" />
                  {creating ? 'Création...' : 'Créer la campagne'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
