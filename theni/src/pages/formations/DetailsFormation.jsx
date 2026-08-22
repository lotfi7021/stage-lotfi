import React from 'react';
import Icon from '../../components/common/Icon';

const OBJECTIVES = [
  'Appliquer rigoureusement les prescriptions de sécurité (norme NFC 18-510).',
  'Réaliser des opérations de consignation et déconsignation HT complexes.',
  'Utiliser correctement les EPI et matériels de sécurité spécifiques (perches, détecteurs, gants isolants).'
];

const MODULES = [
  {
    id: 1,
    title: 'Module 1 : Cadre réglementaire et risques HT',
    tag: 'Jour 1',
    description:
      "Étude des normes, analyse des accidents typiques, et identification des zones de danger."
  },
  {
    id: 2,
    title: "Module 2 : Procédures d'intervention",
    tag: 'Jour 2',
    description:
      "Les étapes de la consignation, autorisations de travail, et gestion documentaire."
  }
];

const INFO = [
  { icon: 'schedule', label: 'Durée', value: '3 Jours (24 heures)' },
  { icon: 'group', label: 'Capacité Max', value: '12 Participants / session' },
  { icon: 'location_on', label: 'Lieu Standard', value: 'Centre de Formation, Tunis' }
];

export default function DetailsFormation() {
  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <a
            className="text-secondary hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-1"
            href="#"
          >
            <Icon name="arrow_back" size={16} />
            Retour aux Formations
          </a>
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                Technique
              </span>
              <span className="bg-[#e2f0d9] text-[#2e7d32] px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                Actif
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Sécurité Réseaux Électriques HT
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Maîtriser les protocoles de sécurité, d'intervention et de maintenance sur les
              réseaux électriques Haute Tension pour garantir la sécurité des agents et la
              continuité du service.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              className="bg-primary hover:bg-[#004494] text-white px-6 py-3 rounded-xl font-label-md text-label-md transition-colors flex items-center gap-2 shadow-sm"
              type="button"
            >
              <Icon name="edit" />
              Modifier la formation
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <Icon name="description" className="text-primary" />
              Description Détaillée
            </h2>
            <div className="max-w-none text-on-surface font-body-md text-body-md space-y-4 mb-8">
              <p>
                Cette formation intensive est conçue spécifiquement pour les techniciens et
                ingénieurs intervenant sur les infrastructures Haute Tension (HT) de la STEG. Elle
                aborde les dernières normes de sécurité, les équipements de protection individuelle
                (EPI) spécifiques à la HT, et les procédures de consignation.
              </p>
              <p>
                Les participants apprendront à identifier les risques électriques majeurs, à
                planifier une intervention sécurisée, et à réagir efficacement en cas d'incident.
                Une part importante du programme est dédiée à des exercices pratiques sur
                simulateur et sur installation réelles déconsignées.
              </p>
            </div>
            <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-4 mt-8 flex items-center gap-2">
              <Icon name="flag" className="text-secondary" />
              Objectifs Pédagogiques
            </h3>
            <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              {OBJECTIVES.map((objective) => (
                <li key={objective} className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary mt-0.5" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <Icon name="view_timeline" className="text-primary" />
              Programme de la Formation
            </h2>
            <div className="space-y-4">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="border border-surface-variant rounded-lg p-4 bg-surface hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-label-md text-[16px] font-semibold text-on-surface">
                      {module.title}
                    </h3>
                    <span className="text-on-surface-variant font-label-sm text-label-sm bg-surface-variant px-2 py-1 rounded">
                      {module.tag}
                    </span>
                  </div>
                  <p className="text-on-surface-variant font-body-md text-[14px]">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6">
            <h3 className="font-label-md text-[16px] font-semibold text-on-surface mb-4 uppercase tracking-wide">
              Informations Clés
            </h3>
            <div className="space-y-4">
              {INFO.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 py-2 border-b border-surface-variant last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <Icon name={item.icon} />
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.label}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6">
            <h3 className="font-label-md text-[16px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Icon name="badge" className="text-primary" />
              Formateurs Qualifiés
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-surface-variant">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                    KB
                  </div>
                  <div>
                    <p className="font-label-md text-[14px] font-medium text-on-surface">
                      Karim Ben Ali
                    </p>
                    <p className="font-label-sm text-[12px] text-on-surface-variant">
                      Expert Sécurité HT
                    </p>
                  </div>
                </div>
                <button className="text-secondary hover:text-primary transition-colors" type="button">
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>
            <button
              className="w-full mt-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-primary hover:bg-surface-container-low transition-colors"
              type="button"
            >
              Gérer les formateurs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}