import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const SESSIONS = [
  'HSE Fundamentals - Session 03/2024 (Tunis)',
  'Advanced Grid Maintenance - Session 02/2024',
  'Customer Service Excellence - Session 01/2024'
];

const ROWS = [
  {
    id: 1,
    name: 'Sami Trabelsi',
    matricule: 'Mat: #ST4592',
    date: '18 Mars 2024',
    score: '5.0',
    scoreColor: 'text-primary',
    starColor: 'text-primary',
    stars: [1, 1, 1, 1, 1],
    comment: "Excellente formation, très pratique pour notre travail quotidien sur le terrain."
  },
  {
    id: 2,
    name: 'Leila Karray',
    matricule: 'Mat: #ST1104',
    date: '19 Mars 2024',
    score: '4.0',
    scoreColor: 'text-on-surface',
    starColor: 'text-primary',
    stars: [1, 1, 1, 1, 0],
    comment: 'Le formateur maîtrise le sujet. Support de cours un peu trop long.'
  },
  {
    id: 3,
    name: 'Nizar Gharbi',
    matricule: 'Mat: #ST8830',
    date: '19 Mars 2024',
    score: '2.5',
    scoreColor: 'text-error',
    starColor: 'text-error',
    stars: [1, 1, 'half', -1, -1],
    comment: "Salle mal climatisée, équipement défectueux. Difficile de se concentrer."
  }
];

const EMPTY_FORM = {
  name: '',
  session: SESSIONS[0],
  startDate: '',
  endDate: ''
};

export default function Evaluations() {
  const [session, setSession] = useState(SESSIONS[0]);
  const [campaignModal, setCampaignModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCampaign = (e) => {
    e.preventDefault();
    alert(`Campagne créée : ${form.name || 'Sans titre'}`);
    setForm(EMPTY_FORM);
    setCampaignModal(false);
  };

  const handleExportPdf = () => {
    window.print();
  };

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
          <button
            type="button"
            className="bg-surface-lowest border border-primary text-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2"
            onClick={handleExportPdf}
          >
            <Icon name="download" size={14} />
            Exporter PDF
          </button>
          <button
            type="button"
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-[#004494] transition-colors shadow-sm"
            onClick={() => setCampaignModal(true)}
          >
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
            <select
              className="w-full appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              {SESSIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Icon
              name="expand_more"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
          </div>
        </div>
        <div className="hidden md:block w-px h-12 bg-outline-variant" />
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Formateur
            </p>
            <p className="font-body-md text-body-md font-medium text-on-surface">
              M. Ahmed Ben Ali
            </p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Date</p>
            <p className="font-body-md text-body-md font-medium text-on-surface">15-18 Mars 2024</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">
              Satisfaction Globale
            </h3>
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
              <Icon name="star" className="text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-primary">4.6</span>
              <span className="font-body-lg text-body-lg text-on-surface-variant">/ 5</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-on-secondary-container bg-secondary-container/20 w-fit px-2 py-1 rounded">
              <Icon name="trending_up" size={16} />
              <span className="font-label-sm text-label-sm">+0.2 vs Session Précédente</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">
              Taux de Participation
            </h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
              <Icon name="fact_check" className="text-secondary" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">24</span>
              <span className="font-body-lg text-body-lg text-on-surface-variant">/ 25</span>
            </div>
            <div className="w-full bg-surface-container mt-3 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '96%' }} />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
              96% des formulaires complétés
            </p>
          </div>
        </div>

        <div className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col justify-between">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-4">
            Répartition des Notes
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-label-sm text-label-sm w-4">5★</span>
              <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[60%]" />
              </div>
              <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">
                60%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-sm text-label-sm w-4">4★</span>
              <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary/80 h-full w-[25%]" />
              </div>
              <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">
                25%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-sm text-label-sm w-4">3★</span>
              <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-outline h-full w-[10%]" />
              </div>
              <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">
                10%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-sm text-label-sm w-4">2★</span>
              <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-error/60 h-full w-[5%]" />
              </div>
              <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">
                5%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-sm text-label-sm w-4">1★</span>
              <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-error h-full w-0" />
              </div>
              <span className="font-label-sm text-label-sm w-6 text-right text-on-surface-variant">
                0%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-md text-headline-md text-on-surface">Résultats Individuels</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              <Icon name="filter_list" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Participant
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Date
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Score
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  Commentaire Principal
                </th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {ROWS.map((row) => (
                <tr key={row.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-body-md text-body-md text-on-surface font-medium">
                      {row.name}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {row.matricule}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                    {row.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className={`font-label-md text-label-md font-bold ${row.scoreColor}`}>
                        {row.score}
                      </span>
                      <div className={`flex ${row.starColor} text-[14px]`}>
                        {row.stars.map((star, index) => (
                          <Icon
                            key={index}
                            name={star === 'half' ? 'star_half' : 'star'}
                            fill={star === 1}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface max-w-xs truncate">
                    {row.comment}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md flex items-center gap-1 ml-auto"
                    >
                      Détails <Icon name="chevron_right" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-center bg-surface-bright">
          <button
            type="button"
            className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
          >
            Voir les 21 autres évaluations
          </button>
        </div>
      </section>

      {campaignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60"
          onClick={() => setCampaignModal(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">
                Nouvelle Campagne d'évaluation
              </h3>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                type="button"
                onClick={() => setCampaignModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSaveCampaign}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="campaign-name">
                  Nom de la campagne
                </label>
                <input
                  id="campaign-name"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Évaluation AVRIL 2024"
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="campaign-session">
                  Session
                </label>
                <select
                  id="campaign-session"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  name="session"
                  value={form.session}
                  onChange={updateForm}
                >
                  {SESSIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="campaign-start">
                    Date de début
                  </label>
                  <input
                    id="campaign-start"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={updateForm}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="campaign-end">
                    Date de fin
                  </label>
                  <input
                    id="campaign-end"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={updateForm}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                  type="button"
                  onClick={() => setCampaignModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
                  type="submit"
                >
                  <Icon name="add" />
                  Créer la campagne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}