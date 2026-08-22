import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import { FORMATIONS, SESSIONS } from '../../data/mock';

const CATEGORY_BADGE = {
  Safety:     'bg-error-container text-on-error-container',
  Management: 'bg-surface-container-highest text-on-surface',
  Technical:  'bg-secondary-container text-on-secondary-container',
  default:    'bg-surface-container-high text-on-surface-variant',
};

export default function ListeDesFormations() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const categories = [...new Set(FORMATIONS.map((f) => f.categorie))];

  // Count sessions per formation
  const sessionCount = useMemo(() => {
    const map = {};
    SESSIONS.forEach((s) => {
      map[s.formation_id] = (map[s.formation_id] || 0) + 1;
    });
    return map;
  }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => (
    <Icon
      name={sortField === field ? (sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down') : 'unfold_more'}
      className="text-[16px] inline-block"
    />
  );

  const filtered = useMemo(() => {
    let rows = FORMATIONS.filter((f) => {
      const matchCat = categoryFilter === '' || f.categorie === categoryFilter;
      const q = search.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        f.titre.toLowerCase().includes(q) ||
        f.categorie.toLowerCase().includes(q) ||
        f.objectifs.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    rows = [...rows].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [categoryFilter, search, sortField, sortDir]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Training Programs</h2>
          <p className="font-body-md text-on-surface-variant">
            Manage all training programs — each row is a record from the <strong>formations</strong> table.
          </p>
        </div>
        <button
          className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-[#004494] transition-colors flex items-center gap-2 shadow-sm shrink-0"
          type="button"
          onClick={() => navigate('/formations/ajout')}
        >
          <Icon name="add" /> Add Training
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant ambient-shadow">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary bg-surface-container-lowest"
            placeholder="Search by title, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-outline-variant rounded-lg px-4 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest min-w-[160px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('id')}>
                  ID <SortIcon field="id" />
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider cursor-pointer select-none min-w-[220px]" onClick={() => handleSort('titre')}>
                  Title <SortIcon field="titre" />
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('categorie')}>
                  Category <SortIcon field="categorie" />
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('duree_jours')}>
                  Duration <SortIcon field="duree_jours" />
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('prix_base')}>
                  Base Price <SortIcon field="prix_base" />
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-label-md text-primary font-bold">#{f.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-label-md text-on-surface font-semibold line-clamp-1">{f.titre}</p>
                    <p className="text-label-sm text-on-surface-variant line-clamp-1 mt-0.5">{f.objectifs}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-label-sm font-semibold uppercase tracking-wide ${CATEGORY_BADGE[f.categorie] || CATEGORY_BADGE.default}`}>
                      {f.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface whitespace-nowrap">
                    {f.duree_jours} day{f.duree_jours > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface whitespace-nowrap font-medium">
                    {f.prix_base.toLocaleString('en-US', { minimumFractionDigits: 2 })} TND
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">
                    {sessionCount[f.id] || 0} session{sessionCount[f.id] !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="View details"
                      onClick={() => navigate(`/formations/${f.id}`)}
                    >
                      <Icon name="visibility" className="text-[18px]" />
                    </button>
                    <button
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit"
                      onClick={() => navigate(`/formations/modifier/${f.id}`)}
                    >
                      <Icon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      title="Delete"
                    >
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-on-surface-variant" colSpan={7}>
                    No training programs match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant text-body-md text-on-surface-variant">
          <span>Showing {filtered.length} of {FORMATIONS.length} records</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
