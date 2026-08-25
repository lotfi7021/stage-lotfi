import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import api from '../../services/config/api';

const CATEGORY_BADGE = {
  'Sécurité':    'bg-error-container text-on-error-container',
  'Management':  'bg-surface-container-highest text-on-surface',
  'Technique':   'bg-secondary-container text-on-secondary-container',
  'Informatique':'bg-primary-container text-on-primary-container',
  default:       'bg-surface-container-high text-on-surface-variant',
};

const STATUT_BADGE = {
  PLANNED:      'bg-blue-100 text-blue-700 border border-blue-200',
  ACTIVE:       'bg-green-100 text-green-700 border border-green-200',
  IN_PROGRESS:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  COMPLETED:    'bg-gray-100 text-gray-600 border border-gray-200',
  CANCELLED:    'bg-red-100 text-red-700 border border-red-200',
};

export default function ListeDesFormations() {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const categories = [...new Set(formations.map((f) => f.categorie))];

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (categoryFilter) params.categorie = categoryFilter;
      const { data } = await api.get('/formations', { params });
      setFormations(data.formations || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des formations.');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleDelete = async (f) => {
    if (!window.confirm(`Supprimer la formation "${f.titre}" ?`)) return;
    try {
      await api.delete(`/formations/${f.id}`);
      fetchFormations();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Formations</h2>
          <p className="font-body-md text-on-surface-variant">
            Gérer tous les programmes de formation.
          </p>
        </div>
        <button
          className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-[#004494] transition-colors flex items-center gap-2 shadow-sm shrink-0"
          type="button"
          onClick={() => navigate('/formations/ajout')}
        >
          <Icon name="add" /> Ajouter
        </button>
      </div>

      {error && (
        <div className="bg-error-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary bg-surface-container-lowest"
            placeholder="Rechercher par titre, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-outline-variant rounded-lg px-4 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest min-w-[160px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider min-w-[200px]">Titre</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Durée</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Prix</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {loading ? (
                <tr><td className="px-6 py-8 text-center text-on-surface-variant" colSpan={8}>Chargement...</td></tr>
              ) : formations.length === 0 ? (
                <tr><td className="px-6 py-8 text-center text-on-surface-variant" colSpan={8}>Aucune formation trouvée.</td></tr>
              ) : formations.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-label-md text-primary font-bold">#{f.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-label-md text-on-surface font-semibold line-clamp-1">{f.titre}</p>
                    {f.objectifs && <p className="text-label-sm text-on-surface-variant line-clamp-1 mt-0.5">{f.objectifs}</p>}
                  </td>
                  <td className="px-6 py-4 text-body-sm text-on-surface font-mono">{f.reference}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-label-sm font-semibold uppercase tracking-wide ${CATEGORY_BADGE[f.categorie] || CATEGORY_BADGE.default}`}>
                      {f.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface whitespace-nowrap">{f.duree}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface whitespace-nowrap font-medium">
                    {f.prix ? `${Number(f.prix).toFixed(2)} TND` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-label-sm font-semibold uppercase tracking-wide ${STATUT_BADGE[f.statut] || ''}`}>
                      {f.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Voir" onClick={() => navigate(`/formations/${f.id}`)}>
                      <Icon name="visibility" className="text-[18px]" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Modifier" onClick={() => navigate(`/formations/modifier/${f.id}`)}>
                      <Icon name="edit" className="text-[18px]" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Supprimer" onClick={() => handleDelete(f)}>
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <span className="text-body-md text-on-surface-variant">
            {formations.length} sur {total} formations
          </span>
          <div className="flex items-center gap-1">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <Icon name="chevron_left" size={20} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-label-md">{page}</span>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <Icon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
