import React from 'react';
import Icon from '../../components/common/Icon';

const GLASS_CARD = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid #E9ECEF'
};

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLtPAPFXuUp-vSNo0IVaWzrlLJ0YKQocHQPH6NJw1wlnvUI5ztf9wG2_VerYhtHODlvEJFS5O4EaT91dhVavvUzyXm5H0EUtlKmK7aOr1bsh-FvCjs1CovnwPPP6RZfP79U9vYQ1seQ79lEzvQ1k3Yw';

const SCREENSHOTS = [
  {
    key: 1,
    alt: 'Dashboard Interface',
    title: 'Dashboard Analytique',
    caption: 'Vue consolidée des métriques de formation.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7hukl6KXIrCZv4vY13OzZZdDRi0iyknP8cIkhFoyZe2eL5a8AdLHEL8sLwL-NVvp6CBT8xFThfJ_-LzU1TvcTdQW_eBGKyZ9bUSsCvMGqJJz_hVs-jJPNMJolRlMA6SNoytttcUSB3lr9zdoQEkA-DBTetVrJuuv3K0Vog473CN0MDGSbCgt6RLmbw3czTcGM6CfEgSUGzOuYcH2Jlyw7x9KCMSvD8tzKO9bwFP7rCv2B2_OUrx9rcw'
  },
  {
    key: 2,
    alt: 'Catalogue Interface',
    title: 'Gestion du Catalogue',
    caption: 'Liste détaillée et filtres avancés des programmes.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBJMzi8JFu4exizJC_kbRPJ6V_wh5T8If2thwAqsnbS0ank4yXXF8N-mowHlNo8K8CYpsMpaVb6iba6Smy2i-msSK70CmRlDNVVvv2CAV4o9lzj0NY3dX1wYGILiq__LzodDlFW4UCVv_MVPJjfZTSa6Y6iKV5j7MqJbspWtKIOtVFvg9Igj0Y8Kv0XrQKSEe5emdGC6cPp5m-FpeTQWcDxEBXFWRceoFxe_bXKEV7fVAPL41WMS1duQ'
  },
  {
    key: 3,
    alt: 'Planning Interface',
    title: 'Calendrier & Planning',
    caption: 'Interface de planification par glisser-déposer.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj-YaGUbKjJMV59Ww6s3LQxyP6-ktyi1xkVUnYQz6LfIvrklQ7twXq_Azz_tmIVrr1NoVRSxVYH0AmkOcJdotcdjc1fFBpQZk8Gt8ziVNsLR7pQbZBcgfRHHM7ekfzts3gIIrpYoXUJPFbLMb5VRboI5ZgRGZvzbyIX1mBbnUYO_q-yUhVp9RJzsyRcUFvyLPicj9kwqZkkdYIkJH2g6OrVHSo9gj4wOIQzVJK0T4FpuUBV1Fd-xQAMm0WCL9B13cM9'  },
  {
    key: 4,
    alt: 'Roles Management Interface',
    title: 'Administration des Habilitations',
    caption: 'Configuration des accès par profil métier.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZn7oVQ-8U9zVbFh9HhRbME7ZnfHfErG2B0Y7hcyh0v2p-kxh7Z0Z_uGiDEHM_9ipWkUXjyQihdXc9E1_KPOp8ZlZgUzJKFRdOLUKBmz4vYXiH_o-CHdqJvqCWnCF_yLkQubrQxp13YsHrAj2UUNPoVfVEiNRnQx5WeK29mlfHezyjt5an6n9iWM6yo7VbY41q8vEJlO7YUphk0zNnVXnJcbwWlY-oJRWfGjndFocjQxFuEWUdv0R-8PwE1vvd1_lBGF7bhwwz8QeWkvg'
  }
];

export default function DocumentationFinale() {
  return (
    <div className="w-full flex flex-col items-center gap-16 md:gap-24 py-4 md:py-8 max-w-container-max mx-auto">
      <section
        className="w-full min-h-[80vh] flex flex-col justify-center items-center text-center relative gap-8"
        id="accueil"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-container-low to-background opacity-50 rounded-3xl"></div>
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex items-center justify-center bg-white mb-6">
          <img alt="STEG Logo" className="w-full h-full object-contain p-4" src={LOGO_URL} />
        </div>
        <div className="space-y-4 max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-container/10 text-primary font-label-md text-label-md uppercase tracking-widest">
            Documentation Finale
          </span>
          <h1 className="font-display-lg text-display-lg text-primary md:leading-[1.1]">
            Rapport de Finalisation de Projet
          </h1>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface-variant">
            STEG Formation
          </h2>
        </div>
        <div
          className="flex flex-col md:flex-row gap-6 md:gap-12 mt-8 text-left bg-white/60 p-6 md:p-8 rounded-2xl ambient-shadow w-full max-w-lx"
          style={GLASS_CARD}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="person" />
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Présenté par
              </p>
              <p className="font-body-lg text-body-lg font-semibold">Étudiant Chercheur</p>
            </div>
          </div>
          <div className="w-px bg-outline-variant hidden md:block"></div>
          <div className="h-px bg-outline-variant md:hidden w-full"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Icon name="calendar_month" />
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Période de stage
              </p>
              <p className="font-body-lg text-body-lg font-semibold">Février - Juillet 2024</p>
            </div>
          </div>
        </div>
        <a
          className="mt-12 animate-bounce flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
          href="#sommaire"
        >
          <Icon name="arrow_downward" />
        </a>
      </section>

      <nav
        className="w-full max-w-3xl ambient-shadow rounded-2xl p-8 sticky top-6 z-30 self-start lg:mx-auto"
        id="sommaire"
        style={GLASS_CARD}
      >
        <h3 className="font-headline-md text-headline-md mb-6 text-primary flex items-center gap-2">
          <Icon name="list_alt" /> Sommaire
        </h3>
        <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
          {[
            { href: '#resume', label: '1. Résumé du projet' },
            { href: '#architecture', label: "2. Architecture de l'application" },
            { href: '#interfaces', label: '3. Interfaces Clés' },
            { href: '#stack', label: '4. Stack Technique' },
            { href: '#conclusion', label: '5. Conclusion' }
          ].map((item, index) => (
            <li key={item.href}>
              <a
                className={`flex items-center justify-between hover:text-primary transition-colors py-2 ${
                  index < 4 ? 'border-b border-outline-variant/30' : ''
                }`}
                href={item.href}
              >
                <span>{item.label}</span> <Icon name="chevron_right" className="text-sm" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="w-full scroll-mt-32" id="resume">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md">
            1
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-background">Résumé du projet</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl ambient-shadow border border-outline-variant/50">
            <div className="text-primary mb-4">
              <Icon name="rocket_launch" className="text-4xl" />
            </div>
            <h4 className="font-headline-md text-headline-md mb-4">Objectif Principal</h4>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Conception et développement d'une plateforme unifiée de gestion de formation
              digitalisée pour la STEG. Ce projet vise à moderniser les processus administratifs,
              centraliser le catalogue de formation, et offrir un suivi précis des sessions et des
              plannings pour l'ensemble des collaborateurs.
            </p>
          </div>
          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
            <h4 className="font-headline-md text-headline-md mb-4 text-primary">Enjeux</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-secondary mt-1" />
                <span>Dématérialisation complète des dossiers de formation.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-secondary mt-1" />
                <span>Automatisation de la gestion des plannings et des présences.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-secondary mt-1" />
                <span>Mise en place d'un tableau de bord décisionnel (Dashboard).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full scroll-mt-32" id="architecture">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md">
            2
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-background">
            Architecture Modulaire
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl ambient-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform cursor-default">
            <Icon name="dashboard" className="text-3xl text-secondary mb-4 block" />
            <h5 className="font-label-md text-label-md font-bold mb-2">Dashboard</h5>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Indicateurs clés de performance (KPIs), suivi global des sessions et statistiques
              d'engagement.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl ambient-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform cursor-default">
            <Icon name="menu_book" className="text-3xl text-secondary mb-4 block" />
            <h5 className="font-label-md text-label-md font-bold mb-2">Catalogue</h5>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Référentiel centralisé des formations disponibles, structuré par domaines de
              compétences.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl ambient-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform cursor-default">
            <Icon name="calendar_month" className="text-3xl text-secondary mb-4 block" />
            <h5 className="font-label-md text-label-md font-bold mb-2">Planning</h5>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Outil de planification interactive, allocation des ressources matérielles et humaines.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl ambient-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform cursor-default">
            <Icon name="payments" className="text-3xl text-secondary mb-4 block" />
            <h5 className="font-label-md text-label-md font-bold mb-2">Finance</h5>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Suivi budgétaire des plans de formation, gestion des coûts et facturation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl ambient-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform cursor-default md:col-span-2">
            <Icon name="admin_panel_settings" className="text-3xl text-secondary mb-4 block" />
            <h5 className="font-label-md text-label-md font-bold mb-2">Administration & Rôles</h5>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Gestion fine des habilitations (RBAC), configuration système et annuaire des
              utilisateurs.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full scroll-mt-32" id="interfaces">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md">
            3
          </div>
          <h3 className="font-headline-lg text-headline-ling text-on-background">Interfaces Clés</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SCREENSHOTS.map((screen) => (
            <div className="flex flex-col gap-4 group" key={screen.key}>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-outline-variant ambient-shadow bg-surface-container">
                <img
                  alt={screen.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={screen.src}
                />
              </div>
              <div>
                <h5 className="font-label-md text-label-md font-bold">{screen.title}</h5>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                  {screen.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full scroll-mt-32" id="stack">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md">
            4
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-background">Stack Technique</h3>
        </div>
        <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30">
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white rounded-full border border-outline-variant/50 flex items-center gap-2 font-label-md text-label-md text-on-background ambient-shadow">
              <Icon name="code" className="text-primary text-xl" /> React
            </div>
            <div className="px-4 py-2 bg-white rounded-full border border-outline-variant/50 flex items-center gap-2 font-label-md text-label-md text-on-background ambient-shadow">
              <Icon name="palette" className="text-secondary text-xl" /> Tailwind CSS
            </div>
            <div className="px-4 py-2 bg-white rounded-full border border-outline-variant/50 flex items-center gap-2 font-label-md text-label-md text-on-background ambient-shadow">
              <Icon name="design_services" className="text-tertiary text-xl" /> Design System
              Institutionnel
            </div>
            <div className="px-4 py-2 bg-white rounded-full border border-outline-variant/50 flex items-center gap-2 font-label-md text-label-md text-on-background ambient-shadow">
              <Icon name="api" className="text-primary text-xl" /> REST APIs
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-6 max-w-4xl">
            Le choix de ces technologies permet de garantir une interface réactive (SPA),
            maintenable et parfaitement alignée avec la charte graphique stricte de la STEG.
            L'utilisation d'un Design System basé sur Tailwind CSS assure une cohérence visuelle sur
            l'ensemble des modules.
          </p>
        </div>
      </section>

      <section className="w-full scroll-mt-32 mb-12" id="conclusion">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md">
            5
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-background">
            Conclusion et Perspectives
          </h3>
        </div>
        <div className="bg-primary-container text-on-primary p-8 md:p-12 rounded-3xl ambient-shadow">
          <p className="font-body-lg text-body-lg mb-6 text-primary-fixed">
            Ce projet de stage a permis de concevoir une solution robuste répondant aux besoins
            complexes de la gestion de formation d'une entité nationale. L'application développée
            pose les bases d'une digitalisation complète des processus RH liés à la formation.
          </p>
          <div className="border-t border-primary-fixed/20 pt-6 mt-6">
            <h5 className="font-label-md text-label-md font-bold mb-4 text-white uppercase tracking-wider">
              Perspectives d'évolution
            </h5>
            <ul className="space-y-3 font-body-md text-body-md text-primary-fixed">
              <li className="flex items-center gap-3">
                <Icon name="trending_up" /> Intégration d'un module d'évaluation à chaud et à froid.
              </li>
              <li className="flex items-center gap-3">
                <Icon name="sync" /> Interfaçage avec le système SIRH global de la STEG.
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone_iphone" /> Développement d'une version mobile pour les formateurs
                sur site.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}