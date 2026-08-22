import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const CATEGORIES = [
  {
    id: 'cours',
    label: 'Support de Cours',
    count: '124 Fichiers',
    icon: 'menu_book'
  },
  {
    id: 'emargement',
    label: "Feuilles d'Émargement",
    count: '86 Fichiers',
    icon: 'how_to_reg'
  },
  {
    id: 'certifications',
    label: 'Certifications',
    count: '42 Fichiers',
    icon: 'verified'
  },
  {
    id: 'catalogues',
    label: 'Catalogues PDF',
    count: '15 Fichiers',
    icon: 'library_books'
  }
];

const DOCUMENTS = [
  {
    id: 1,
    name: 'Manuel_Securite_2023.pdf',
    category: 'cours',
    categoryLabel: 'Support de Cours',
    date: '12 Oct 2023',
    status: 'Validé',
    statusColor: 'text-primary',
    dot: 'bg-primary',
    icon: 'picture_as_pdf',
    iconColor: 'text-error'
  },
  {
    id: 2,
    name: 'Emargement_Session_A.docx',
    category: 'emargement',
    categoryLabel: 'Feuilles',
    date: '10 Oct 2023',
    status: 'En attente',
    statusColor: 'text-secondary',
    dot: 'bg-secondary',
    icon: 'description',
    iconColor: 'text-secondary'
  }
];

const FILTERS = ['Tous', 'Validés', 'En attente'];

export default function GestionDocumentaire() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();
  const filtered = DOCUMENTS.filter(
    (doc) =>
      (activeCategory === null || doc.category === activeCategory) &&
      (statusFilter === 'Tous' || doc.status === statusFilter) &&
      (search === '' || doc.name.toLowerCase().includes(search))
  );

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Gestion Documentaire
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Gérez, partagez et consultez les documents liés aux formations.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-primary font-label-md text-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all border border-outline-variant"
              type="button"
            >
              <Icon name="create_new_folder" />
              Nouveau Dossier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <section className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setActiveCategory(active ? null : cat.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveCategory(active ? null : cat.id);
                      }
                    }}
                    className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm hover:shadow-ambient transition-all cursor-pointer flex items-start gap-4 group ${
                      active ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="p-3 bg-surface-container rounded-lg text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon name={cat.icon} className="text-3xl" />
                    </div>
                    <div>
                      <h3 className="font-headline-md text-label-md font-bold text-on-surface">
                        {cat.label}
                      </h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Documents Récents
                </h3>
                <button className="font-label-md text-label-md text-primary hover:underline" type="button">
                  Voir tout
                </button>
              </div>
              <div className="p-4 bg-surface-container-low border-b border-outline-variant flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Icon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md"
                  />
                  <input
                    type="text"
                    placeholder="Filtrer par nom..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-full border text-label-sm transition-all ${
                        statusFilter === filter
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-outline-variant hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">
                      <th className="py-4 px-6 font-semibold">Nom du Fichier</th>
                      <th className="py-4 px-6 font-semibold">Catégorie</th>
                      <th className="py-4 px-6 font-semibold">Date d'Ajout</th>
                      <th className="py-4 px-6 font-semibold">Statut</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md">
                    {filtered.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-surface-variant hover:bg-surface-bright transition-colors"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <Icon name={doc.icon} className={doc.iconColor} />
                          {doc.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-surface-container px-2 py-1 rounded text-label-sm font-label-sm">
                            {doc.categoryLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">{doc.date}</td>
                        <td className="py-4 px-6">
                          <span className={`flex items-center gap-1.5 text-label-sm ${doc.statusColor}`}>
                            <span className={`w-2 h-2 rounded-full ${doc.dot}`}></span>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            className="text-on-surface-variant hover:text-primary transition-colors mr-2"
                            type="button"
                          >
                            <Icon name="visibility" />
                          </button>
                          <button
                            className="text-on-surface-variant hover:text-primary transition-colors"
                            type="button"
                          >
                            <Icon name="download" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          className="py-10 px-6 text-center text-on-surface-variant"
                          colSpan={5}
                        >
                          Aucun document ne correspond à ces critères.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                Upload Rapide
              </h3>
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-surface-bright hover:border-primary transition-all cursor-pointer">
                <Icon name="cloud_upload" className="text-4xl text-primary mb-2" />
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  ou cliquez pour parcourir (Max 50MB)
                </p>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                Téléchargements Récents
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="picture_as_pdf" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface line-clamp-1">Catalogue_Formations_24.pdf</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Aujourd'hui, 09:41
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="description" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface line-clamp-1">Liste_Participants_V2.xlsx</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Hier, 14:22
                    </p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}