import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import formationService from '../../services/formations/formationService';

// Category badge colors
const CATEGORY_STYLE = {
  Safety:     'bg-error-container text-on-error-container',
  Management: 'bg-surface-container-highest text-on-surface',
  Technical:  'bg-secondary-container text-on-secondary-container',
  IT:         'bg-primary-container text-on-primary',
  default:    'bg-surface-container-high text-on-surface-variant',
};

const categoryStyle = (cat) => CATEGORY_STYLE[cat] || CATEGORY_STYLE.default;

export default function Catalogue() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [search, setSearch] = useState('');
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const res = await formationService.getAllFormations();
        setFormations(res.data || []);
      } catch (error) {
        console.error('Error fetching formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const categories = [...new Set(formations.map((f) => f.categorie))];

  const parseDuration = (duree) => {
    if (!duree) return 0;
    const match = String(duree).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      const matchCat = categoryFilter === '' || f.categorie === categoryFilter;
      const dur = parseDuration(f.duree);
      const matchDur =
        durationFilter === '' ||
        (durationFilter === 'short' && dur >= 1 && dur <= 2) ||
        (durationFilter === 'medium' && dur >= 3 && dur <= 5) ||
        (durationFilter === 'long' && dur > 5);
      const matchSearch =
        search.trim() === '' ||
        f.titre.toLowerCase().includes(search.toLowerCase()) ||
        f.categorie.toLowerCase().includes(search.toLowerCase()) ||
        (f.objectifs && f.objectifs.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchDur && matchSearch;
    });
  }, [formations, categoryFilter, durationFilter, search]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
          Training Catalogue
        </h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl">
          Browse all available training programs. Each entry reflects a record from the
          <strong> formations</strong> table in the database.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Category</label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Duration</label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="">Any Duration</option>
            <option value="short">Short (1–2 days)</option>
            <option value="medium">Medium (3–5 days)</option>
            <option value="long">Long (6+ days)</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Search</label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary"
            type="text"
            placeholder="Title, category, objectives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-primary-container text-on-primary text-label-md font-label-md py-2 px-6 rounded-lg hover:bg-[#004494] transition-colors h-10 flex items-center gap-2 shrink-0"
          onClick={() => { setCategoryFilter(''); setDurationFilter(''); setSearch(''); }}
        >
          <Icon name="filter_list" className="text-[18px]" />
          Reset
        </button>
      </div>

      {/* Cards grid */}
      {!loading && filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <Icon name="search_off" className="text-[48px] mb-3 text-outline" />
          <p className="font-body-lg">No training programs match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filtered.map((f) => (
            <div key={f.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col ambient-shadow hover:shadow-md transition-shadow">
              {/* Card top color band */}
              <div className={`h-2 w-full ${f.categorie === 'Safety' ? 'bg-error' : f.categorie === 'Management' ? 'bg-secondary' : 'bg-primary'}`} />
              <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Meta row */}
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-1 rounded text-label-sm font-semibold uppercase tracking-wide ${categoryStyle(f.categorie)}`}>
                    {f.categorie}
                  </span>
                  <span className="flex items-center gap-1 text-on-surface-variant text-label-sm">
                    <Icon name="schedule" className="text-[15px]" />
                    {f.duree || '—'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-headline-sm text-on-surface font-bold line-clamp-2">
                  {f.titre}
                </h3>

                {/* Objectives */}
                <p className="font-body-md text-on-surface-variant line-clamp-3 flex-1">
                  {f.objectifs}
                </p>

                {/* DB fields preview */}
                <div className="border-t border-outline-variant pt-3 flex flex-col gap-1.5">
                  <div className="flex justify-between text-label-sm">
                    <span className="text-on-surface-variant">Base price</span>
                    <span className="font-semibold text-on-surface">{f.prix != null ? Number(f.prix).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'} TND</span>
                  </div>
                  <div className="flex justify-between text-label-sm">
                    <span className="text-on-surface-variant">Prerequisites</span>
                    <span className="text-on-surface truncate max-w-[180px] text-right">{f.prerequis}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  className="mt-auto w-full border border-primary text-primary hover:bg-primary-container/30 font-label-md py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => navigate(`/formations/${f.id}`)}
                >
                  View Details <Icon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-body-sm text-on-surface-variant text-center pb-6">
        Showing {filtered.length} of {formations.length} training programs
      </p>
    </div>
  );
}
