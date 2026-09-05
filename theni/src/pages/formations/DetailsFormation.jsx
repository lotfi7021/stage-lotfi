import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import formationService from '../../services/formations/formationService';

const CATEGORY_BADGE = {
  'Sécurité':    'bg-error-container text-on-error-container',
  'Management':  'bg-surface-container-highest text-on-surface',
  'Technique':   'bg-secondary-container text-on-secondary-container',
  'Informatique':'bg-primary-container text-on-primary-container',
  default:       'bg-surface-container-high text-on-surface-variant',
};

const STATUT_BADGE = {
  PLANNED:     'bg-blue-100 text-blue-700',
  ACTIVE:      'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED:   'bg-gray-100 text-gray-600',
  CANCELLED:   'bg-red-100 text-red-700',
};

const STATUT_LABEL = {
  PLANNED: 'Planifiée',
  ACTIVE: 'Active',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

export default function DetailsFormation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [formRes, sessRes] = await Promise.allSettled([
          formationService.getFormationById(id),
          formationService.getFormationSessions(id),
        ]);
        if (formRes.status === 'fulfilled') {
          setFormation(formRes.value.data);
        } else {
          setError(formRes.reason?.response?.data?.error || 'Formation introuvable.');
        }
        if (sessRes.status === 'fulfilled') {
          setSessions(sessRes.value.data || []);
        }
      } catch {
        setError('Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-on-surface-variant">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div className="bg-error-container text-on-error-container px-6 py-4 rounded-xl text-body-md">{error}</div>
        <button onClick={() => navigate('/formations')} className="text-primary hover:underline font-label-md flex items-center gap-1">
          <Icon name="arrow_back" size={16} /> Retour aux formations
        </button>
      </div>
    );
  }

  if (!formation) return null;

  const objectifsList = formation.objectifs ? formation.objectifs.split('\n').filter(Boolean) : [];
  const modulesList = formation.modules ? formation.modules.split('\n').filter(Boolean) : [];
  const prerequisList = formation.prerequis ? formation.prerequis.split('\n').filter(Boolean) : [];

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <button
            className="text-secondary hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-1"
            onClick={() => navigate('/formations')}
          >
            <Icon name="arrow_back" size={16} />
            Retour aux Formations
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${CATEGORY_BADGE[formation.categorie] || CATEGORY_BADGE.default}`}>
                {formation.categorie}
              </span>
              <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${STATUT_BADGE[formation.statut] || ''}`}>
                {STATUT_LABEL[formation.statut] || formation.statut}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              {formation.titre}
            </h2>
            {formation.objectifs && (
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                {formation.objectifs.split('\n')[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-8">
          {formation.objectifs && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <Icon name="flag" className="text-secondary" />
                Objectifs Pédagogiques
              </h2>
              <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                {objectifsList.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon name="check_circle" className="text-secondary mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formation.prerequis && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <Icon name="assignment" className="text-primary" />
                Prérequis
              </h2>
              <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                {prerequisList.map((pr, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon name="chevron_right" className="text-primary mt-0.5" />
                    {pr}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {modulesList.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <Icon name="view_timeline" className="text-primary" />
                Programme de la Formation
              </h2>
              <div className="space-y-4">
                {modulesList.map((mod, i) => (
                  <div
                    key={i}
                    className="border border-surface-variant rounded-lg p-4 bg-surface hover:bg-surface-container-low transition-colors"
                  >
                    <p className="text-on-surface-variant font-body-md text-[14px]">{mod}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6 md:p-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <Icon name="event" className="text-primary" />
                Sessions associées ({sessions.length})
              </h2>
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-surface-variant">
                    <div className="flex items-center gap-3">
                      <Icon name="calendar_today" className="text-primary" />
                      <div>
                        <p className="font-label-md text-[14px] text-on-surface">
                          {new Date(s.dateDebut).toLocaleDateString('fr-FR')} — {new Date(s.dateFin).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-label-sm text-[12px] text-on-surface-variant">{s.lieu}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUT_BADGE[s.statut] || ''}`}>
                      {s.statut}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-6">
            <h3 className="font-label-md text-[16px] font-semibold text-on-surface mb-4 uppercase tracking-wide">
              Informations Clés
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2 border-b border-surface-variant">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <Icon name="schedule" />
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Durée</p>
                  <p className="font-label-md text-label-md text-on-surface">{formation.duree}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-2 border-b border-surface-variant">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <Icon name="group" />
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Capacité Max</p>
                  <p className="font-label-md text-label-md text-on-surface">{formation.maxParticipants} Participants / session</p>
                </div>
              </div>
              {formation.prix && (
                <div className="flex items-center gap-4 py-2 border-b border-surface-variant">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="payments" />
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Prix</p>
                    <p className="font-label-md text-label-md text-on-surface">{Number(formation.prix).toFixed(2)} TND</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 py-2 border-b border-surface-variant">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <Icon name="tag" />
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Référence</p>
                  <p className="font-label-md text-label-md text-on-surface font-mono">{formation.reference}</p>
                </div>
              </div>
              {formation._count && (
                <div className="flex items-center gap-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="event" />
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Sessions</p>
                    <p className="font-label-md text-label-md text-on-surface">{formation._count.sessions} session(s)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
