import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const CERTIFICATIONS = [
  {
    ref: 'CERT-2023-001',
    participant: 'Amine Ben Salah',
    formation: 'Habilitation Électrique B1V',
    emission: '15/09/2023',
    status: 'Valide',
    badge: 'bg-green-100 text-green-800'
  },
  {
    ref: 'CERT-2023-002',
    participant: 'Sonia Trabelsi',
    formation: 'Maintenance Photovoltaïque',
    emission: '10/01/2021',
    status: 'Expiré',
    badge: 'bg-red-100 text-red-800'
  },
  {
    ref: 'CERT-2023-003',
    participant: 'Karim Jendoubi',
    formation: 'Sécurité Incendie Base',
    emission: '20/11/2022',
    status: 'Renouvellement',
    badge: 'bg-orange-100 text-orange-800'
  }
];

const EMPTY_FORM = {
  participant: '',
  formation: '',
  emission: ''
};

export default function Certifications() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Certificat créé pour : ${form.participant || 'Sans participant'}`);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const query = search.trim().toLowerCase();
  const filtered = CERTIFICATIONS.filter((item) => {
    const matchesSearch =
      query === '' ||
      item.participant.toLowerCase().includes(query) ||
      item.formation.toLowerCase().includes(query) ||
      item.ref.toLowerCase().includes(query);
    const matchesDate = date === '' || item.emission.endsWith(date);
    return matchesSearch && matchesDate;
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
            <form className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
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
                className="bg-surface-container text-on-surface-variant px-4 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-outline-variant py-1.5"
                type="button"
              >
                <Icon name="filter_list" />
                Filtres
              </button>
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
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Réf.
                    </th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Formation
                    </th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Émission
                    </th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest font-body-md text-body-md text-on-surface">
                  {filtered.map((cert) => (
                    <tr key={cert.ref} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-label-md text-label-md text-primary">{cert.ref}</td>
                      <td className="p-4">{cert.participant}</td>
                      <td className="p-4">{cert.formation}</td>
                      <td className="p-4">{cert.emission}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm ${cert.badge}`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                            title="Voir"
                          >
                            <Icon name="visibility" size={20} />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                            title="Télécharger"
                          >
                            <Icon name="download" size={20} />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                            title="Envoyer"
                          >
                            <Icon name="mail" size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Affichage 1-3 sur 156
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="p-1 text-outline hover:bg-surface-container rounded"
                >
                  <Icon name="chevron_left" />
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-primary-container text-on-primary rounded font-label-md text-label-md"
                >
                  1
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-on-surface hover:bg-surface-container rounded font-label-md text-label-md"
                >
                  2
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-on-surface hover:bg-surface-container rounded font-label-md text-label-md"
                >
                  3
                </button>
                <button
                  type="button"
                  className="p-1 text-outline hover:bg-surface-container rounded"
                >
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
              <h3 className="font-label-md text-label-md mb-1 opacity-90 uppercase tracking-wide">
                Émis cette année
              </h3>
              <div className="font-display-lg text-display-lg font-bold">1,452</div>
              <p className="font-label-sm text-label-sm mt-2 opacity-80">+12% vs l'année dernière</p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#fff3e0] text-[#e65100] rounded-lg">
                <Icon name="update" />
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">
                  Renouvellements en attente
                </h3>
                <div className="font-headline-md text-headline-md text-on-surface mt-1">84</div>
              </div>
            </div>
            <button
              type="button"
              className="w-full py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-primary hover:bg-surface-container-low transition-colors"
            >
              Gérer les renouvellements
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">
                Taux de réussite global
              </h3>
              <span className="font-headline-md text-headline-md text-on-surface">92%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-container h-full rounded-full"
                style={{ width: '92%' }}
              />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">
              Moyenne annuelle
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
              Générer Rapide
            </h3>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">
                Nouveau Certificat
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
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-participant">
                  Participant
                </label>
                <input
                  id="cert-participant"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Amine Ben Salah"
                  name="participant"
                  value={form.participant}
                  onChange={updateForm}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-formation">
                  Formation
                </label>
                <input
                  id="cert-formation"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="text"
                  placeholder="Ex : Habilitation Électrique B1V"
                  name="formation"
                  value={form.formation}
                  onChange={updateForm}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface" htmlFor="cert-emission">
                  Date d'émission
                </label>
                <input
                  id="cert-emission"
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all w-full"
                  type="date"
                  name="emission"
                  value={form.emission}
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
                  <Icon name="add_circle" />
                  Créer le certificat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}