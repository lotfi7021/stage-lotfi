import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const SESSIONS = [
  {
    id: 1,
    formation: 'Sécurité Réseaux HTA',
    date_debut: '2026-06-12',
    date_fin: '2026-06-16',
    formateur: 'Ahmed Trabelsi',
    lieu: 'Centre de Formation - Radès',
  },
  {
    id: 2,
    formation: 'Habilitation Électrique BR',
    date_debut: '2026-07-01',
    date_fin: '2026-07-06',
    formateur: 'Karim Belhadj',
    lieu: 'Centre de Formation - Tunis',
  },
];

const COURS_OPTIONS = [
  { value: 'present', label: 'Présent' },
  { value: 'absent', label: 'Absent' },
  { value: 'retard', label: 'Retardataire' },
];

const AGENTS = [
  { inscriptionId: 1, matricule: 'STEG-4021', nom: 'Ben Salah Ahmed', defaultCours: 'present', defaultCantine: true },
  { inscriptionId: 2, matricule: 'STEG-5188', nom: 'Trabelsi Leila', defaultCours: 'present', defaultCantine: true },
  { inscriptionId: 3, matricule: 'STEG-6204', nom: 'Khemiri Mohamed', defaultCours: 'absent', defaultCantine: false },
  { inscriptionId: 4, matricule: 'STEG-7310', nom: 'Gharbi Mariem', defaultCours: 'present', defaultCantine: true },
];

const COURS_STYLE = {
  present: 'bg-primary-container/20 text-primary',
  absent: 'bg-error-container/10 text-error',
  retard: 'bg-secondary-container/30 text-secondary',
};

const formatDateFR = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const localToday = () => {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
};

export default function Presences() {
  const [session, setSession] = useState('');
  const [date, setDate] = useState(localToday());
  const [listLoaded, setListLoaded] = useState(false);
  const [rows, setRows] = useState(() =>
    Object.fromEntries(
      AGENTS.map((a) => [
        a.inscriptionId,
        { cours: a.defaultCours, cantine: a.defaultCantine, saved: false },
      ])
    )
  );
  const [validated, setValidated] = useState(false);

  const selectedSession = SESSIONS.find((s) => String(s.id) === String(session));

  const handleCoursChange = (id, value) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], cours: value, saved: false } }));
  };

  const handleCantineChange = (id, checked) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], cantine: checked, saved: false } }));
  };

  const handleRowSave = (id) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], saved: true } }));
  };

  const handleLoadList = () => {
    if (!session) {
      alert('Veuillez sélectionner une session.');
      return;
    }
    setListLoaded(true);
    setValidated(false);
    setRows((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, row]) => [id, { ...row, saved: false }])
      )
    );
  };

  const handleMarkAllPresent = () => {
    setRows((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, row]) => [
          id,
          { ...row, cours: 'present', cantine: row.cantine, saved: false },
        ])
      )
    );
    setValidated(false);
  };

  const handleValidate = () => {
    const entries = Object.values(rows);
    const present = entries.filter((r) => r.cours === 'present').length;
    const absent = entries.filter((r) => r.cours === 'absent').length;
    const retard = entries.filter((r) => r.cours === 'retard').length;
    const cantine = entries.filter((r) => r.cantine).length;
    setValidated(true);
    alert(
      `Feuille de présence validée pour ${formatDateFR(date)}.\n\n` +
        `Présents : ${present}\nRetardataires : ${retard}\nAbsents : ${absent}\n` +
        `Repas cantine : ${cantine}`
    );
  };

  const summary = {
    present: Object.values(rows).filter((r) => r.cours === 'present').length,
    retard: Object.values(rows).filter((r) => r.cours === 'retard').length,
    absent: Object.values(rows).filter((r) => r.cours === 'absent').length,
    cantine: Object.values(rows).filter((r) => r.cantine).length,
  };

  return (
    <div className="max-w-[container-max] w-full mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
          Gestion des Présences
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Pointage journalier des agents inscrits aux sessions : assiduité aux cours et passage à la cantine.
        </p>
      </div>

      <section className="bg-surface rounded-xl border border-outline-variant ambient-shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-gutter items-end">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="sessionSelect">
              Session sélectionnée
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                id="sessionSelect"
                value={session}
                onChange={(e) => {
                  setSession(e.target.value);
                  setListLoaded(false);
                  setValidated(false);
                }}
              >
                <option disabled value="">
                  Choisir une session...
                </option>
                {SESSIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.formation} (Du {formatDateFR(option.date_debut)} au {formatDateFR(option.date_fin)})
                  </option>
                ))}
              </select>
              <Icon
                name="expand_more"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="dateJour">
              Date du jour
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              id="dateJour"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setValidated(false);
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLoadList}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 ambient-shadow"
          >
            <Icon name="download" />
            Charger la liste
          </button>
        </div>
      </section>

      {listLoaded && selectedSession && (
        <div className="space-y-6 mt-8">
          {validated && (
            <div className="bg-primary-container/15 border border-primary-container rounded-xl px-5 py-4 flex items-center gap-3">
              <Icon name="check_circle" className="text-primary" />
              <span className="font-body-md text-body-md text-on-surface">
                Feuille de la journée validée — la table <strong>presences</strong> a été mise à jour pour le {formatDateFR(date)}.
              </span>
            </div>
          )}

          <section className="bg-surface rounded-xl border border-outline-variant ambient-shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-2 py-1 rounded">
                  EN COURS
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {selectedSession.formation}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-background">
                {selectedSession.formation}
              </h3>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-on-surface-variant font-body-md text-body-md">
                <div className="flex items-center gap-2">
                  <Icon name="event" className="text-outline" />
                  {formatDateFR(selectedSession.date_debut)} — {formatDateFR(selectedSession.date_fin)}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="person" className="text-outline" />
                  Formateur : {selectedSession.formateur}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="location_on" className="text-outline" />
                  {selectedSession.lieu}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant text-center">
                <div className="font-headline-md text-headline-md text-primary">{summary.present}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Présents</div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant text-center">
                <div className="font-headline-md text-headline-md text-secondary">{summary.retard}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Retards</div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant text-center">
                <div className="font-headline-md text-headline-md text-error">{summary.absent}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Absents</div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant text-center">
                <div className="font-headline-md text-headline-md text-on-background">{summary.cantine}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Cantine</div>
              </div>
            </div>
          </section>

          <section className="bg-surface rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h4 className="font-headline-md text-headline-md text-on-background">Liste des inscrits</h4>
              <div className="font-label-md text-label-md text-on-surface-variant">
                {formatDateFR(date)}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                    <th className="py-4 px-6 font-medium">Matricule</th>
                    <th className="py-4 px-6 font-medium">Nom &amp; Prénom</th>
                    <th className="py-4 px-6 font-medium">Cours</th>
                    <th className="py-4 px-6 font-medium text-center">Cantine</th>
                    <th className="py-4 px-6 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md divide-y divide-outline-variant">
                  {AGENTS.map((agent) => {
                    const row = rows[agent.inscriptionId];
                    return (
                      <tr key={agent.inscriptionId} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-mono text-on-surface-variant">{agent.matricule}</td>
                        <td className="py-4 px-6 font-medium text-on-background">{agent.nom}</td>
                        <td className="py-4 px-6">
                          <div className="relative inline-block">
                            <select
                              className={`appearance-none pr-9 pl-4 py-2 rounded-lg border border-outline-variant font-label-md text-label-md outline-none focus:ring-1 focus:ring-primary transition-colors ${COURS_STYLE[row.cours]}`}
                              value={row.cours}
                              onChange={(e) => handleCoursChange(agent.inscriptionId, e.target.value)}
                            >
                              {COURS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <Icon
                              name="expand_more"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 rounded border-outline text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
                              checked={row.cantine}
                              onChange={(e) => handleCantineChange(agent.inscriptionId, e.target.checked)}
                            />
                          </label>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {row.saved ? (
                            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
                              <Icon name="check_circle" />
                              Enregistré
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRowSave(agent.inscriptionId)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                            >
                              <Icon name="save" />
                              Enregistrer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pb-12">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-6 py-3 rounded-xl border border-primary text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="done_all" />
              Tout marquer Présent
            </button>
            <button
              type="button"
              onClick={handleValidate}
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 ambient-shadow"
            >
              <Icon name="check_circle" />
              Valider la feuille de la journée
            </button>
          </div>
        </div>
      )}

      {!listLoaded && (
        <section className="bg-surface rounded-xl border border-outline-variant ambient-shadow p-10 mt-8 text-center">
          <Icon name="fact_check" className="text-outline text-4xl mx-auto mb-4" />
          <h3 className="font-headline-md text-headline-md text-on-background">Aucune feuille chargée</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl mx-auto">
            Sélectionnez la session encadrée puis la date du jour, et cliquez sur «&nbsp;Charger la liste&nbsp;»
            pour afficher la liste des inscrits.
          </p>
        </section>
      )}
    </div>
  );
}