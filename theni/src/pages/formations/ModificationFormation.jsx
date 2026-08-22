import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const INITIAL_FORM = {
  title: 'Sécurité Réseaux Électriques HT',
  category: 'Technique',
  duration: '30',
  status: 'active',
  description:
    "Maîtriser les protocoles de sécurité, d'intervention et de maintenance sur les réseaux électriques Haute Tension...",
  objectives:
    "Maîtriser les protocoles de sécurité, d'intervention et de maintenance sur les réseaux électriques Haute Tension..."
};

const ROWS = [
  {
    id: 1,
    title: 'High Voltage Safety Protocol',
    reference: 'REF-HVS-2024',
    category: 'Technical Safety',
    duration: '40 Hours',
    trainer: 'Dr. Ahmed Ben Ali',
    sessions: '3 Active',
    badge: 'bg-[#e6f4ea] text-[#1e8e3e]',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Leadership in Energy Sector',
    reference: 'REF-MGT-102',
    category: 'Management',
    duration: '24 Hours',
    trainer: 'Sarah Mansouri',
    sessions: '1 Planned',
    badge: 'bg-[#fef7e0] text-[#f29900]',
    status: 'Planned'
  },
  {
    id: 3,
    title: 'Smart Grid Systems Intro',
    reference: 'REF-IT-005',
    category: 'IT & Software',
    duration: '16 Hours',
    trainer: 'Karim Trabelsi',
    sessions: '5 Completed',
    badge: 'bg-[#f1f3f4] text-[#5f6368]',
    status: 'Completed'
  }
];

export default function ModificationFormation() {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Formation modifiée : ${form.title}`);
    setForm(INITIAL_FORM);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Formations Management
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and monitor all training courses across the organization.
          </p>
        </div>
        <button
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md hover:bg-[#004494] transition-colors flex items-center gap-2 shadow-sm"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <Icon name="add" />
          Add Formation
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-surface p-4 rounded-xl border border-outline-variant ambient-shadow">
        <div className="flex-1 min-w-[200px]">
          <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
            <option>All Categories</option>
            <option>Technical Safety</option>
            <option>Management</option>
            <option>IT & Software</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Planned</option>
            <option>Completed</option>
          </select>
        </div>
        <button
          className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2"
          type="button"
        >
          <Icon name="filter_list" />
          More Filters
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant ambient-shadow overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface">
              {ROWS.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-label-md text-label-md text-on-surface font-semibold">
                      {row.title}
                    </div>
                    <div className="text-sm text-on-surface-variant">{row.reference}</div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                    {row.duration}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                    {row.trainer}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                    {row.sessions}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${row.badge} uppercase`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-primary hover:text-primary-fixed-variant p-2 rounded-full hover:bg-surface-container-high transition-colors"
                      type="button"
                    >
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant bg-surface mt-auto">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Showing 1 to 3 of 45 entries
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low disabled:opacity-50" type="button" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low" type="button">
              Next
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-md text-headline-md text-primary">Modifier la formation</h3>
              <button
                className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form className="space-y-6" id="formation-form" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Titre de la formation
                    </label>
                    <input
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
                      placeholder="Ex: Maintenance des transformateurs"
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={updateForm}
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Catégorie
                    </label>
                    <select
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                      name="category"
                      value={form.category}
                      onChange={updateForm}
                    >
                      <option>Sélectionner une catégorie</option>
                      <option>Technique</option>
                      <option>Technical Safety</option>
                      <option>Management</option>
                      <option>IT & Software</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Durée (Heures)
                    </label>
                    <input
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
                      placeholder="40"
                      type="number"
                      name="duration"
                      value={form.duration}
                      onChange={updateForm}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Statut Initial
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="text-primary focus:ring-primary"
                          name="status"
                          type="radio"
                          value="planned"
                          checked={form.status === 'planned'}
                          onChange={updateForm}
                        />
                        <span className="text-body-md">Planifiée</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="text-primary focus:ring-primary"
                          name="status"
                          type="radio"
                          value="active"
                          checked={form.status === 'active'}
                          onChange={updateForm}
                        />
                        <span className="text-body-md">Active</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
                      placeholder="Brève description du cours..."
                      rows="3"
                      name="description"
                      value={form.description}
                      onChange={updateForm}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Objectifs pédagogiques
                    </label>
                    <textarea
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md"
                      placeholder="Listez les objectifs principaux..."
                      rows="3"
                      name="objectives"
                      value={form.objectives}
                      onChange={updateForm}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low">
              <button
                className="px-6 py-2 border border-outline-variant rounded-lg text-on-surface font-label-md hover:bg-surface-container-high transition-colors"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </button>
              <button
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md hover:bg-[#004494] transition-colors shadow-sm"
                type="button"
                onClick={handleSave}
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}