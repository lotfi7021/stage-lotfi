import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const RECLAMATIONS = [
  {
    id: '#RCL-2023-089',
    initials: 'MA',
    avatarClass: 'bg-primary-fixed-dim text-on-primary-fixed',
    name: 'Mohamed Amine',
    matricule: 'Matricule: 44521',
    formation: 'Sécurité Electrique HTA',
    type: 'Logistique',
    typeIcon: 'restaurant',
    priorityId: 'Haute',
    priorityClass: 'border border-[#93000a] text-[#93000a] bg-error-container',
    status: 'Ouvert',
    statusClass: 'text-[#b35e00]',
    dotClass: 'bg-[#b35e00]',
    pulse: false,
    date: '12 Oct 2023',
    time: '12 Oct 2023, 10:45',
    title: 'Technicien Supérieur (Matricule: 44521)',
    center: 'Centre Khelidia'
  },
  {
    id: '#RCL-2023-088',
    initials: 'SB',
    avatarClass: 'bg-secondary-fixed text-on-secondary-fixed',
    name: 'Sana Benali',
    matricule: 'Matricule: 55210',
    formation: "Management d'Equipe",
    type: 'Pédagogie',
    typeIcon: 'school',
    priorityId: 'Moyenne',
    priorityClass: 'border border-[#0056b3] text-[#0056b3] bg-primary-fixed',
    status: 'En cours',
    statusClass: 'text-[#0056b3]',
    dotClass: 'bg-[#0056b3]',
    pulse: true,
    date: '10 Oct 2023',
    time: '10 Oct 2023, 09:15',
    title: 'Responsable Formation (Matricule: 55210)',
    center: 'Centre Khelidia'
  }
];

const EMPTY_FORM = {
  name: '',
  matricule: '',
  formation: '',
  type: 'Logistique',
  priorityId: 'Moyenne',
  description: '',
  center: ''
};

export default function Reclamations() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Tous les Types');
  const [priority, setPriority] = useState('Toutes les Priorités');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Réclamation enregistrée pour : ${form.name || 'Sans nom'}`);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const query = search.trim().toLowerCase();
  const filtered = RECLAMATIONS.filter((reclamation) => {
    const matchesSearch =
      query === '' ||
      reclamation.id.toLowerCase().includes(query) ||
      reclamation.name.toLowerCase().includes(query) ||
      reclamation.formation.toLowerCase().includes(query) ||
      reclamation.matricule.toLowerCase().includes(query);
    const matchesType = type === 'Tous les Types' || reclamation.type === type;
    const matchesPriority =
      priority === 'Toutes les Priorités' || reclamation.priorityId === priority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const shown = filtered.length;

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
        <button
          type="button"
          className="bg-primary-container text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-xl hover:bg-[#004494] transition-colors flex items-center justify-center gap-2 shrink-0"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="add" className="text-[20px]" />
          Nouvelle Réclamation
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-4 ambient-shadow flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full lg:max-w-md pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            placeholder="Chercher par ID, Agent, ou Formation..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select
            className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 font-label-md text-label-md text-on-surface bg-transparent focus:outline-none focus:border-primary-container"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Tous les Types</option>
            <option>Logistique</option>
            <option>Pédagogie</option>
            <option>Technique</option>
          </select>
          <select
            className="border border-outline-variant rounded-lg py-2 pl-3 pr-8 font-label-md text-label-md text-on-surface bg-transparent focus:outline-none focus:border-primary-container"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Toutes les Priorités</option>
            <option>Haute</option>
            <option>Moyenne</option>
            <option>Basse</option>
          </select>
          <button
            type="button"
            className="border border-outline-variant rounded-lg py-2 px-4 font-label-md text-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
          >
            <Icon name="filter_list" className="text-[18px]" /> Filtrer
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  ID
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Agent / Participant
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Formation
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Type
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Priorité
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Statut
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filtered.map((reclamation) => (
                <tr
                  key={reclamation.id}
                  className="hover:bg-surface-bright transition-colors cursor-pointer"
                  onClick={() => setSelected(reclamation)}
                >
                  <td className="py-4 px-6 font-label-md text-label-md text-on-surface font-medium">
                    {reclamation.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${reclamation.avatarClass} flex items-center justify-center font-bold text-xs`}
                      >
                        {reclamation.initials}
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">
                          {reclamation.name}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {reclamation.matricule}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                    {reclamation.formation}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                      <Icon name={reclamation.typeIcon} className="text-[14px]" />{' '}
                      {reclamation.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full ${reclamation.priorityClass} font-label-sm text-label-sm uppercase`}
                    >
                      {reclamation.priorityId}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 ${reclamation.statusClass} font-label-sm text-label-sm uppercase`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${reclamation.dotClass} ${
                          reclamation.pulse ? 'animate-pulse' : ''
                        }`}
                      ></span>{' '}
                      {reclamation.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                    {reclamation.date}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      className="text-primary-container hover:text-primary transition-colors p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(reclamation);
                      }}
                    >
                      <Icon name="visibility" />
                    </button>
                  </td>
                </tr>
              ))}
              {shown === 0 && (
                <tr>
                  <td
                    className="py-4 px-6 text-sm text-on-surface-variant text-center"
                    colSpan={8}
                  >
                    Aucune réclamation ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-outline-variant bg-surface flex items-center justify-between">
          <span className="font-body-md text-sm text-on-surface-variant">
            Affichage 1 à {shown} sur 142 réclamations
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface disabled:opacity-50"
              disabled={shown === 0}
            >
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button
              type="button"
              className="p-1 border border-primary-container bg-primary-container text-on-primary rounded text-sm px-3"
            >
              1
            </button>
            <button
              type="button"
              className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface text-sm px-3"
            >
              2
            </button>
            <button
              type="button"
              className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface text-sm px-3"
            >
              ...
            </button>
            <button
              type="button"
              className="p-1 border border-outline-variant rounded hover:bg-surface-container-low text-on-surface"
              disabled={shown === 0}
            >
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-surface border-l border-outline-variant flex flex-col transform transition-transform shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Réclamation {selected.id}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {selected.time}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full ${selected.priorityClass} font-label-sm text-xs uppercase`}
                  >
                    {selected.priorityId} Priorité
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors"
                onClick={() => setSelected(null)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${selected.avatarClass} flex items-center justify-center font-bold text-lg`}
                >
                  {selected.initials}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-headline-md text-lg text-on-surface">
                        {selected.name}
                      </h4>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        {selected.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-primary-container font-label-md text-label-md flex items-center gap-1 hover:underline"
                    >
                      <Icon name="mail" className="text-[18px]" /> Contacter
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-on-surface-variant mb-1">
                        Formation concernée:
                      </span>
                      <span className="font-medium text-on-surface">{selected.formation}</span>
                    </div>
                    <div>
                      <span className="block text-on-surface-variant mb-1">
                        Centre de formation:
                      </span>
                      <span className="font-medium text-on-surface">{selected.center}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                  Détails de la réclamation ({selected.type})
                </h4>
                <div className="bg-surface border border-outline-variant rounded-xl p-5 relative">
                  <Icon
                    name="format_quote"
                    className="absolute top-4 right-4 text-outline-variant opacity-30 text-4xl"
                  />
                  <p className="font-body-md text-body-md text-on-surface relative z-10 leading-relaxed">
                    Lors de la formation sur la sécurité électrique HTA du 10 au 12 Octobre, les
                    repas servis au centre d'hébergement étaient insuffisants et de très mauvaise
                    qualité. De plus, le chauffage dans la salle de cours B2 était en panne le
                    deuxième jour, rendant les conditions de suivi très difficiles.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                  Traitement Administratif
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      Changer le statut
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2 border border-outline-variant bg-surface rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low"
                      >
                        Ouvert
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2 border border-primary-container bg-primary-fixed text-on-primary-fixed rounded-lg font-label-md text-label-md font-bold ring-2 ring-primary-container"
                      >
                        En cours
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2 border border-outline-variant bg-surface rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low"
                      >
                        Résolu
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="reclamation-resolution"
                      className="block font-label-md text-label-md text-on-surface mb-2"
                    >
                      Réponse / Note de résolution
                    </label>
                    <textarea
                      id="reclamation-resolution"
                      className="w-full p-3 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container bg-surface"
                      placeholder="Saisir la réponse administrative ou les actions entreprises..."
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                onClick={() => setSelected(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-primary-container text-on-primary rounded-xl font-label-md text-label-md hover:bg-[#004494] transition-colors shadow-sm"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Nouvelle Réclamation
              </h3>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-name">
                    Nom du réclamant
                  </label>
                  <input
                    id="reclam-name"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    type="text"
                    placeholder="Ex : Mohamed Amine"
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-matricule">
                    Matricule
                  </label>
                  <input
                    id="reclam-matricule"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    type="text"
                    placeholder="Ex : 44521"
                    name="matricule"
                    value={form.matricule}
                    onChange={updateForm}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-formation">
                  Formation concernée
                </label>
                <input
                  id="reclam-formation"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Sécurité Électrique HTA"
                  name="formation"
                  value={form.formation}
                  onChange={updateForm}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-type">
                    Type
                  </label>
                  <select
                    id="reclam-type"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    name="type"
                    value={form.type}
                    onChange={updateForm}
                  >
                    <option>Logistique</option>
                    <option>Pédagogie</option>
                    <option>Technique</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="reclam-priority">
                    Priorité
                  </label>
                  <select
                    id="reclam-priority"
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                    name="priorityId"
                    value={form.priorityId}
                    onChange={updateForm}
                  >
                    <option>Haute</option>
                    <option>Moyenne</option>
                    <option>Basse</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-center">
                  Centre de formation
                </label>
                <input
                  id="reclam-center"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Centre Khelidia"
                  name="center"
                  value={form.center}
                  onChange={updateForm}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="reclam-description">
                  Description
                </label>
                <textarea
                  id="reclam-description"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  rows="4"
                  placeholder="Décrivez le problème rencontré..."
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
                  type="submit"
                >
                  <Icon name="add" />
                  Enregistrer la réclamation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}