import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import certificationService from '../../services/certifications/certificationService';

const STATUS_BADGE = {
  VALIDE: 'bg-green-100 text-green-800',
  EXPIRE: 'bg-red-100 text-red-800',
  RENOUVELLEMENT: 'bg-orange-100 text-orange-800',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ participantId: '', formationId: '', sessionId: '', dateEmission: '' });
  const [creating, setCreating] = useState(false);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      const { data, total: t, totalPages: tp } = await certificationService.getAllCertifications(params);
      setCertifications(data || []);
      setTotal(t || 0);
      setTotalPages(tp || 1);
    } catch (err) {
      console.error('Error fetching certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [page, search]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await certificationService.createCertification({
        participantId: Number(form.participantId),
        formationId: Number(form.formationId),
        sessionId: Number(form.sessionId),
        dateEmission: form.dateEmission,
      });
      setForm({ participantId: '', formationId: '', sessionId: '', dateEmission: '' });
      setModalOpen(false);
      fetchCertifications();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const filtered = certifications.filter((item) => {
    if (!date) return true;
    return item.dateEmission && item.dateEmission.startsWith(date);
  });

  return (
    <div className="max-w-container-max mx-auto space-y-[64px]">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 font-bold">
          Certifications &amp; Diplômes
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Gérez et consultez les certificats délivrés aux participants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-gutter">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient">
            <form className="flex flex-col md:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); setPage(1); fetchCertifications(); }}>
              <div className="flex-1 relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="w-full pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface placeholder:text-outline transition-colors py-1.5"
                  placeholder="Rechercher par nom, titre..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <input
                  className="w-full px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors py-1.5"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button
                className="bg-primary-container text-on-primary px-6 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center justify-center py-1.5"
                type="submit"
              >
                Rechercher
              </button>
            </form>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-ambient">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Réf.</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Participant</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Formation</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Émission</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Statut</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest font-body-md text-body-md text-on-surface">
                  {loading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">Chargement...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">Aucune certification trouvée.</td></tr>
                  ) : (
                    filtered.map((cert) => (
                      <tr key={cert.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-4 font-label-md text-label-md text-primary">{cert.reference}</td>
                        <td className="p-4">{cert.participant?.prenom} {cert.participant?.nom}</td>
                        <td className="p-4">{cert.formation?.titre}</td>
                        <td className="p-4">{formatDate(cert.dateEmission)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_BADGE[cert.statut] || 'bg-gray-100 text-gray-800'}`}>
                            {cert.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button type="button" className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-full transition-colors" title="Voir">
                              <Icon name="visibility" size={20} />
                            </button>
                            <button type="button" className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-full transition-colors" title="Télécharger">
                              <Icon name="download" size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Affichage {certifications.length > 0 ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, total)} sur {total}
              </span>
              <div className="flex gap-1">
                <button type="button" className="p-1 text-outline hover:bg-surface-container rounded" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  <Icon name="chevron_left" />
                </button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" className={`px-3 py-1 rounded font-label-md text-label-md ${p === page ? 'bg-primary-container text-on-primary' : 'text-on-surface hover:bg-surface-container'}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
                <button type="button" className="p-1 text-outline hover:bg-surface-container rounded" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-gutter">
          <div className="bg-primary-container text-on-primary rounded-xl p-6 shadow-ambient flex flex-col items-start relative overflow-hidden bg-gradient-to-br from-primary to-primary-container">
            <div className="relative z-10">
              <Icon name="workspace_premium" size={40} className="mb-2 opacity-80" />
              <h3 className="font-label-md text-label-md mb-1 opacity-90 uppercase tracking-wide">Total Certifications</h3>
              <div className="font-display-lg text-display-lg font-bold">{total}</div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Générer Rapide</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Créez un nouveau certificat manuellement ou par lot.
            </p>
            <button
              type="button"
              className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex justify-center items-center gap-2"
              onClick={() => setModalOpen(true)}
            >
              <Icon name="add_circle" />
              Nouveau Certificat
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Nouveau Certificat</h3>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" type="button" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-participant">ID Participant</label>
                <input id="cert-participant" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="number" placeholder="Ex : 1" name="participantId" value={form.participantId} onChange={updateForm} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-formation">ID Formation</label>
                <input id="cert-formation" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="number" placeholder="Ex : 1" name="formationId" value={form.formationId} onChange={updateForm} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-session">ID Session</label>
                <input id="cert-session" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="number" placeholder="Ex : 1" name="sessionId" value={form.sessionId} onChange={updateForm} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-emission">Date d'émission</label>
                <input id="cert-emission" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full" type="date" name="dateEmission" value={form.dateEmission} onChange={updateForm} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" type="button" onClick={() => setModalOpen(false)}>Annuler</button>
                <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2" type="submit" disabled={creating}>
                  <Icon name="add_circle" />
                  {creating ? 'Création...' : 'Créer le certificat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
