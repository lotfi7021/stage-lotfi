import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const OPPORTUNITIES = [
  {
    id: 1,
    company: 'Société Tunisienne de Banque',
    contact: 'Ahmed Ben Ali',
    formation: 'Habilitation Électrique B1V',
    valeur: '12,500',
    probability: 80,
    stage: 'Négociation',
    bar: 'bg-[#198754]',
    badge: 'bg-[#FFF3CD] text-[#856404]'
  },
  {
    id: 2,
    company: 'Tunisie Telecom',
    contact: 'Samia Trabelsi',
    formation: 'Sécurité Incendie & Évacuation',
    valeur: '8,200',
    probability: 40,
    stage: 'Proposition',
    bar: 'bg-primary-container',
    badge: 'bg-[#D1ECF1] text-[#0C5460]'
  },
  {
    id: 3,
    company: 'Poulina Group',
    contact: 'Karim Mansour',
    formation: "Management de l'Énergie ISO 50001",
    valeur: '24,000',
    probability: 100,
    stage: 'Gagné',
    bar: 'bg-[#198754]',
    badge: 'bg-[#D4EDDA] text-[#155724]'
  },
  {
    id: 4,
    company: 'Groupe Chimique Tunisien',
    contact: 'Leila Khemiri',
    formation: 'Maintenance Électrique Industrielle',
    valeur: '18,500',
    probability: 10,
    stage: 'Lead',
    bar: 'bg-outline',
    badge: 'bg-surface-variant text-on-surface-variant'
  }
];

export default function Commercial() {
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const filtered = OPPORTUNITIES.filter((opportunity) => {
    if (query === '') return true;
    return (
      opportunity.company.toLowerCase().includes(query) ||
      opportunity.contact.toLowerCase().includes(query) ||
      opportunity.formation.toLowerCase().includes(query) ||
      opportunity.stage.toLowerCase().includes(query)
    );
  });

  const shown = filtered.length;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Gestion Commerciale
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Suivi du pipeline des ventes, gestion des opportunités commerciales et analyse des
            performances pour les formations STEG Academy.
          </p>
        </div>
        <button
          type="button"
          className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl py-3 px-6 font-label-md text-label-md flex items-center gap-2 shadow-ambient whitespace-nowrap self-start md:self-auto"
        >
          <Icon name="add" />
          Nouvel Opportunité
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-4">
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">
              Objectif du Mois
            </h3>
            <Icon name="target" className="text-primary" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-headline-md text-headline-md text-on-surface">145,000</span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              / 200,000 TND
            </span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-2 mt-4">
            <div className="bg-primary-container h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">
            72% Atteint
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">Nouveaux Leads</h3>
            <Icon name="group_add" className="text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">24</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[#198754]">
            <Icon name="trending_up" className="text-sm" />
            <span className="font-label-sm text-label-sm">+12% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">
              Taux de Conversion
            </h3>
            <Icon name="swap_horiz" className="text-tertiary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">32.5%</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[#198754]">
            <Icon name="trending_up" className="text-sm" />
            <span className="font-label-sm text-label-sm">+4.2% vs mois dernier</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F8F9FA]">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Pipeline des Opportunités
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
              />
              <input
                className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none w-full md:w-64"
                placeholder="Rechercher..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant"
            >
              <Icon name="filter_list" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant">
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Prospect / Entreprise
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Formation Demandée
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Valeur (TND)
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Probabilité
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Étape
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant font-body-md text-body-md">
              {filtered.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-medium text-on-surface">{opportunity.company}</div>
                    <div className="text-sm text-on-surface-variant">{opportunity.contact}</div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{opportunity.formation}</td>
                  <td className="py-4 px-6 font-medium text-on-surface">{opportunity.valeur}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-surface-variant rounded-full h-1.5">
                        <div
                          className={`${opportunity.bar} h-1.5 rounded-full`}
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-on-surface-variant">
                        {opportunity.probability}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${opportunity.badge}`}
                    >
                      {opportunity.stage}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-primary transition-colors p-1"
                    >
                      <Icon name="more_vert" className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
              {shown === 0 && (
                <tr>
                  <td
                    className="py-4 px-6 text-sm text-on-surface-variant text-center"
                    colSpan={6}
                  >
                    Aucune opportunité ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-surface-variant flex items-center justify-between bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Affichage 1-{shown} sur 12 opportunités
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="p-1 text-on-surface-variant hover:bg-surface-variant rounded disabled:opacity-50"
              disabled={shown === 0}
            >
              <Icon name="chevron_left" className="text-sm" />
            </button>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center rounded bg-primary-container text-on-primary font-label-sm text-label-sm"
            >
              1
            </button>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-variant text-on-surface-variant font-label-sm text-label-sm"
            >
              2
            </button>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-variant text-on-surface-variant font-label-sm text-label-sm"
            >
              3
            </button>
            <button
              type="button"
              className="p-1 text-on-surface-variant hover:bg-surface-variant rounded"
              disabled={shown === 0}
            >
              <Icon name="chevron_right" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}