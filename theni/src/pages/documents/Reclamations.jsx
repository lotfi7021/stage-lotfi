import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import reclamationService from '../../services/reclamations/reclamationService';
import api from '../../services/config/api';

const TYPE_ICON = { LOGISTIQUE: 'restaurant', PEDAGOGIE: 'school', RESTAURATION: 'restaurant_menu', AUTRE: 'help' };
const PRIORITY_CLASS = {
  HAUTE: 'border border-[#93000a] text-[#93000a] bg-error-container',
  MOYENNE: 'border border-[#0056b3] text-[#0056b3] bg-primary-fixed',
  BASSE: 'border border-outline-variant text-on-surface-variant bg-surface-container-low',
};
const STATUS_CLASS = {
  OUVERT: 'text-[#b35e00]',
  EN_COURS: 'text-[#0056b3]',
  RESOLU: 'text-green-600',
  CLOS: 'text-on-surface-variant',
};
const DOT_CLASS = { OUVERT: 'bg-[#b35e00]', EN_COURS: 'bg-[#0056b3]', RESOLU: 'bg-green-600', CLOS: 'bg-on-surface-variant' };

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getInitials = (nom, prenom) => {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase() || '?';
};

export default function Reclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Tous les Types');
  const [priority, setPriority] = useState('Toutes les Priorités');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ titre: '', type: 'LOGISTIQUE', priorite: 'MOYENNE', description: '', centre: '', formationId: '', participantId: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [creating, setCreating] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [formations, setFormations] = useState([]);

  const fetchReclamations = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (type !== 'Tous les Types') params.type = type.toUpperCase();
      if (priority !== 'Toutes les Priorités') params.priorite = priority.toUpperCase();
      const { data, total: t, totalPages: tp } = await reclamationService.getAllReclamations(params);
      setReclamations(data || []);
      setTotal(t || 0);
      setTotalPages(tp || 1);
    } catch (err) {
      console.error('Error fetching reclamations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, [page, type, priority]);

  useEffect(() => {
    if (modalOpen) {
      api.get('/users', { params: { role: 'Participant', limit: 100 } })
        .then(({ data }) => setParticipants(data.users || []))
        .catch(() => {});
      api.get('/formations', { params: { limit: 100 } })
        .then(({ data }) => setFormations(data.formations || []))
        .catch(() => {});
    }
  }, [modalOpen]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.participantId || !form.formationId) {
      alert('Veuillez sélectionner un participant et une formation.');
      return;
    }
    try {
      setCreating(true);
      await reclamationService.createReclamation({
        titre: form.titre,
        type: form.type,
        priorite: form.priorite,
        description: form.description,
        centre: form.centre,
        formationId: Number(form.formationId),
        participantId: Number(form.participantId),
        date: new Date().toISOString(),
      });
      setForm({ titre: '', type: 'LOGISTIQUE', priorite: 'MOYENNE', description: '', centre: '', formationId: '', participantId: '' });
      setModalOpen(false);
      fetchReclamations();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reclamationService.updateReclamation(id, { statut: newStatus });
      setSelected(null);
      fetchReclamations();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  const shown = reclamations.length;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Gestion des Réclamations
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Suivi et traitement des réclamations liées aux formations.
          </p>
        </div>
        <button type="button" className="bg-primary-container text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-[#004494] transition-colors flex items-center justify-center gap-2 shrink-0" onClick={() => setModalOpen(true)}>
          <Icon name="add" className="text-[20px]" />
          Nouvelle Réclamation
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-4 ambient-shadow flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input className="w-full lg:max-w-md pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container" placeholder="Chercher par titre..." type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchReclamations()} />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 font-label-md text-label-md text-on-surface bg-transparent focus:outline-none focus:border-primary-container" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option>Tous les Types</option>
            <option>Logistique</option>
            <option>Pédagogie</option>
            <option>Restauration</option>
            <option>Autre</option>
          </select>
          <select className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 font-label-md text-label-md text-on-surface bg-transparent focus:outline-none focus:border-primary-container" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
            <option>Toutes les Priorités</option>
            <option>Haute</option>
            <option>Moyenne</option>
            <option>Basse</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Agent / Participant</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Titre</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Priorité</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Statut</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {loading ? (
                <tr><td colSpan={8} className="py-8 text-center text-on-surface-variant">Chargement...</td></tr>
              ) : reclamations.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-on-surface-variant">Aucune réclamation trouvée.</td></tr>
              ) : (
                reclamations.map((rec) => {
                  const initials = getInitials(rec.participant?.nom, rec.participant?.prenom);
                  return (
                    <tr key={rec.id} className="hover:bg-surface-bright transition-colors cursor-pointer" onClick={() => setSelected(rec)}>
                      <td className="py-4 px-6 font-label-md text-label-md text-on-surface font-medium">{rec.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-xs">{initials}</div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface">{rec.participant?.prenom} {rec.participant?.nom}</div>
                            <div className="text-xs text-on-surface-variant">{rec.participant?.matricule}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant max-w-[200px] truncate">{rec.titre}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                          <Icon name={TYPE_ICON[rec.type] || 'help'} className="text-[14px]" /> {rec.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full ${PRIORITY_CLASS[rec.priorite] || ''} font-label-sm text-label-sm uppercase`}>{rec.priorite}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 ${STATUS_CLASS[rec.statut] || ''} font-label-sm text-label-sm uppercase`}>
                          <span className={`w-2 h-2 rounded-full ${DOT_CLASS[rec.statut] || ''}`}></span> {rec.statut?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{formatDate(rec.date)}</td>
                      <td className="py-4 px-6 text-right">
                        <button type="button" className="text-primary-container hover:text-primary transition-colors p-1" onClick={(e) => { e.stopPropagation(); setSelected(rec); }}>
                          <Icon name="visibility" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-outline-variant bg-surface flex items-center justify-between">
          <span className="font-body-md text-sm text-on-surface-variant">Affichage {shown > 0 ? (page - 1) * 10 + 1 : 0} à {Math.min(page * 10, total)} sur {total} réclamations</span>
          <div className="flex gap-1">
            <button type="button" className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" className={`p-1 border rounded text-sm px-3 ${p === page ? 'border-primary-container bg-primary-container text-on-primary' : 'border-outline-variant hover:bg-surface-container-low text-on-surface'}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button type="button" className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setSelected(null)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-surface border-l border-outline-variant flex flex-col transform transition-transform shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Réclamation {selected.id}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(selected.date)}</span>
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${PRIORITY_CLASS[selected.priorite] || ''} font-label-sm text-xs uppercase`}>{selected.priorite} Priorité</span>
                </div>
              </div>
              <button type="button" className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" onClick={() => setSelected(null)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-lg">
                  {getInitials(selected.participant?.nom, selected.participant?.prenom)}
                </div>
                <div className="flex-1">
                  <h4 className="font-headline-md text-lg text-on-surface">{selected.participant?.prenom} {selected.participant?.nom}</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant">{selected.participant?.matricule}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-on-surface-variant mb-1">Centre:</span>
                      <span className="font-medium text-on-surface">{selected.centre || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-on-surface-variant mb-1">Type:</span>
                      <span className="font-medium text-on-surface">{selected.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">Description</h4>
                <div className="bg-surface border border-outline-variant rounded-xl p-5 relative">
                  <Icon name="format_quote" className="absolute top-4 right-4 text-outline-variant opacity-30 text-4xl" />
                  <p className="font-body-md text-body-md text-on-surface relative z-10 leading-relaxed">{selected.description || 'Aucune description'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">Traitement Administratif</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">Changer le statut</label>
                    <div className="flex gap-2">
                      {['OUVERT', 'EN_COURS', 'RESOLU'].map((s) => (
                        <button key={s} type="button" className={`flex-1 py-2 border rounded-lg font-label-md text-label-md transition-colors ${selected.statut === s ? 'border-primary-container bg-primary-fixed text-on-primary-fixed font-bold ring-2 ring-primary-container' : 'border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low'}`} onClick={() => handleUpdateStatus(selected.id, s)}>
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button type="button" className="px-6 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors" onClick={() => setSelected(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Nouvelle Réclamation</h3>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" type="button" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-titre">Titre</label>
                <input id="reclam-titre" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="text" placeholder="Ex: Problème de chauffage" name="titre" value={form.titre} onChange={updateForm} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-type">Type</label>
                  <select id="reclam-type" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="type" value={form.type} onChange={updateForm}>
                    <option value="LOGISTIQUE">Logistique</option>
                    <option value="PEDAGOGIE">Pédagogie</option>
                    <option value="RESTAURATION">Restauration</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-priority">Priorité</label>
                  <select id="reclam-priority" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="priorite" value={form.priorite} onChange={updateForm}>
                    <option value="HAUTE">Haute</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="BASSE">Basse</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-participant">Participant <span className="text-error">*</span></label>
                  <select id="reclam-participant" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="participantId" value={form.participantId} onChange={updateForm} required>
                    <option value="">Choisir un participant...</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.matricule})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-formation">Formation <span className="text-error">*</span></label>
                  <select id="reclam-formation" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" name="formationId" value={form.formationId} onChange={updateForm} required>
                    <option value="">Choisir une formation...</option>
                    {formations.map((f) => (
                      <option key={f.id} value={f.id}>{f.titre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-center">Centre de formation</label>
                <input id="reclam-center" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="text" placeholder="Ex : Centre Khelidia" name="centre" value={form.centre} onChange={updateForm} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-description">Description</label>
                <textarea id="reclam-description" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" rows="4" placeholder="Décrivez le problème rencontré..." name="description" value={form.description} onChange={updateForm} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" type="button" onClick={() => setModalOpen(false)}>Annuler</button>
                <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2" type="submit" disabled={creating}>
                  <Icon name="add" />
                  {creating ? 'Enregistrement...' : 'Enregistrer la réclamation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
