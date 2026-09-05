import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import trainerService from '../../services/trainers/trainerService';
import participantService from '../../services/participants/participantService';
import formationService from '../../services/formations/formationService';

const EVALUATION_TYPES = [
  { value: 'PRE', label: 'Pré-formation', icon: 'quiz' },
  { value: 'SATISFACTION', label: 'Satisfaction', icon: 'thumb_up' },
  { value: 'POST', label: 'Post-formation', icon: 'school' },
];

const STATUT_COLORS = {
  OPEN: 'text-on-surface-variant',
  SUBMITTED: 'text-primary',
  VALIDATED: 'text-green-600',
};

export default function FormateurEvaluations() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState('');
  const [evaluationData, setEvaluationData] = useState({});
  const [viewMode, setViewMode] = useState('entry');
  const [formateurSessions, setFormateurSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessionsRes = await trainerService.getTrainerSessions(currentUser.id);
        const sessions = sessionsRes.data || [];

        const formationsRes = await formationService.getAllFormations();
        const formations = formationsRes.data || [];
        const formationsMap = Object.fromEntries(formations.map(f => [f.id, f]));

        const enrichedSessions = await Promise.all(
          sessions.map(async (session) => {
            const inscriptionsRes = await participantService.getAllInscriptions({ sessionId: session.id });
            const inscriptions = inscriptionsRes.data || [];

            const participants = inscriptions.map((inscription) => ({
              participantId: inscription.participantId,
              inscriptionId: inscription.id,
              nom: inscription.participant?.nom || '',
              prenom: inscription.participant?.prenom || '',
              email: inscription.participant?.email || '',
              matricule: inscription.participant?.matricule || '',
            }));

            return {
              ...session,
              formation: formationsMap[session.formationId]?.titre || session.formation?.titre || 'Formation inconnue',
              participants,
            };
          })
        );

        setFormateurSessions(enrichedSessions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const initializeEvaluationData = async (session, type) => {
    const key = `${session.id}-${type}`;
    if (evaluationData[key]) return;

    try {
      const { data } = await import('../../services/config/api').then(m =>
        m.default.get('/evaluations', { params: { sessionId: session.id, type } })
      );
      const existingEvaluations = data.evaluations || [];
      const evalsMap = Object.fromEntries(
        existingEvaluations.map(e => [e.participantId, e])
      );

      const initialData = {};
      session.participants.forEach(participant => {
        const existing = evalsMap[participant.participantId];
        initialData[participant.participantId] = {
          score: existing?.score ?? '',
          commentaire: existing?.commentaire || '',
        };
      });

      setEvaluationData(prev => ({ ...prev, [key]: initialData }));
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setSelectedEvaluationType('');
  };

  const handleEvaluationTypeSelect = (type) => {
    setSelectedEvaluationType(type);
    if (selectedSession) initializeEvaluationData(selectedSession, type);
  };

  const updateEvaluation = (participantId, field, value) => {
    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    setEvaluationData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [participantId]: {
          ...prev[key]?.[participantId],
          [field]: value,
        },
      },
    }));
  };

  const saveEvaluations = async () => {
    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    const data = evaluationData[key];
    if (!data) return;

    const invalidGrades = Object.entries(data).filter(([_, evaluation]) => {
      const grade = parseFloat(evaluation.score);
      return evaluation.score !== '' && (isNaN(grade) || grade < 0 || grade > 20);
    });

    if (invalidGrades.length > 0) {
      alert('Les notes doivent être entre 0 et 20.');
      return;
    }

    try {
      setSaving(true);
      const api = (await import('../../services/config/api')).default;
      const today = new Date().toISOString().split('T')[0];

      const entries = Object.entries(data).filter(([_, e]) => e.score !== '');

      for (const [participantId, evaluation] of entries) {
        await api.post('/evaluations', {
          sessionId: selectedSession.id,
          participantId: parseInt(participantId),
          type: selectedEvaluationType,
          score: parseFloat(evaluation.score),
          commentaire: evaluation.commentaire || null,
          date: today,
        });
      }

      alert('Évaluations enregistrées avec succès !');
    } catch (error) {
      console.error('Error saving evaluations:', error);
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const calculateSessionStats = () => {
    if (!selectedSession || !selectedEvaluationType) return null;

    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    const data = evaluationData[key] || {};
    const grades = Object.values(data)
      .map(e => parseFloat(e.score))
      .filter(g => !isNaN(g));

    if (grades.length === 0) return null;

    const average = grades.reduce((sum, g) => sum + g, 0) / grades.length;
    const highest = Math.max(...grades);
    const lowest = Math.min(...grades);
    const passed = grades.filter(g => g >= 10).length;

    return { average, highest, lowest, passed, total: grades.length };
  };

  const currentEvaluationData = selectedSession && selectedEvaluationType
    ? evaluationData[`${selectedSession.id}-${selectedEvaluationType}`] || {}
    : {};

  const stats = calculateSessionStats();
  const gradesEntered = Object.values(currentEvaluationData).filter(e => e.score !== '').length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Saisie des Évaluations</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Saisissez les notes et commentaires pour vos sessions de formation.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('entry')}
            className={`px-4 py-2 rounded-lg text-label-sm transition-colors ${
              viewMode === 'entry'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Saisie des notes
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg text-label-sm transition-colors ${
              viewMode === 'history'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Historique
          </button>
        </div>
      </div>

      {viewMode === 'entry' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sélection session */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-on-surface">Sélectionner une Session</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Choisissez une session de formation</p>
              </div>
              <div className="p-6 space-y-3">
                {!loading && formateurSessions.length > 0 ? (
                  formateurSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSessionSelect(session)}
                      className={`w-full p-4 rounded-lg text-left transition-colors border ${
                        selectedSession?.id === session.id
                          ? 'bg-primary-container border-primary text-on-primary'
                          : 'bg-surface-container border-outline-variant hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      <div className="font-label-md font-semibold">{session.formation}</div>
                      <div className="text-body-sm opacity-80 mt-1">
                        {new Date(session.dateDebut).toLocaleDateString('fr-FR')} — {new Date(session.dateFin).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-body-sm opacity-80">
                        {session.participants.length} participants • {session.lieu}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon name="event_busy" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                    <p className="text-body-md text-on-surface-variant">{loading ? 'Chargement...' : 'Aucune session disponible'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Type d'évaluation */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-on-surface">Type d'Évaluation</h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  {selectedSession ? 'Choisissez le type' : 'Sélectionnez d\'abord une session'}
                </p>
              </div>
              <div className="p-6">
                {selectedSession ? (
                  <div className="space-y-3">
                    {EVALUATION_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleEvaluationTypeSelect(type.value)}
                        className={`w-full p-4 rounded-lg text-left transition-colors border flex items-center gap-3 ${
                          selectedEvaluationType === type.value
                            ? 'bg-secondary-container border-secondary text-on-secondary-container'
                            : 'bg-surface-container border-outline-variant hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <Icon name={type.icon} className="text-[24px]" />
                        <div>
                          <div className="font-label-md font-semibold">{type.label}</div>
                          <div className="text-body-sm opacity-80">{type.value}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="quiz" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                    <p className="text-body-md text-on-surface-variant">Sélectionnez une session</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.average.toFixed(1)}</div>
                <div className="text-label-sm text-on-surface-variant">Moyenne</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.highest}</div>
                <div className="text-label-sm text-on-surface-variant">Note max</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.lowest}</div>
                <div className="text-label-sm text-on-surface-variant">Note min</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.passed}</div>
                <div className="text-label-sm text-on-surface-variant">Admis (≥10)</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{((stats.passed / stats.total) * 100).toFixed(0)}%</div>
                <div className="text-label-sm text-on-surface-variant">Taux réussite</div>
              </div>
            </div>
          )}

          {/* Tableau de saisie */}
          {selectedSession && selectedEvaluationType && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {EVALUATION_TYPES.find(t => t.value === selectedEvaluationType)?.label}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mt-1">
                      {selectedSession.formation} • {selectedSession.participants.length} participants
                    </p>
                  </div>
                  <div className="text-body-sm text-on-surface-variant">
                    Notes sur 20
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Participant</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider w-32">Note (/20)</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    {selectedSession.participants.map((participant) => (
                      <tr key={participant.participantId} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center shrink-0">
                              <Icon name="person" className="text-on-tertiary-container text-[18px]" />
                            </div>
                            <div>
                              <div className="font-label-md text-on-surface font-semibold">
                                {participant.prenom} {participant.nom}
                              </div>
                              <div className="text-body-sm text-on-surface-variant">{participant.matricule}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={currentEvaluationData[participant.participantId]?.score ?? ''}
                            onChange={(e) => updateEvaluation(participant.participantId, 'score', e.target.value)}
                            className="w-20 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary text-center"
                            placeholder="0-20"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={currentEvaluationData[participant.participantId]?.commentaire || ''}
                            onChange={(e) => updateEvaluation(participant.participantId, 'commentaire', e.target.value)}
                            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary"
                            placeholder="Commentaire optionnel..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-outline-variant">
                <div className="flex justify-between items-center">
                  <div className="text-body-md text-on-surface-variant">
                    {gradesEntered} / {selectedSession.participants.length} notes saisies
                  </div>
                  <button
                    onClick={saveEvaluations}
                    disabled={saving}
                    className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2 disabled:opacity-60"
                  >
                    <Icon name="save" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === 'history' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface">Historique des Évaluations</h3>
            <p className="text-body-md text-on-surface-variant mt-1">Consultez les évaluations déjà saisies</p>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Icon name="history" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
              <h3 className="font-headline-sm text-on-surface-variant mb-2">Bientôt disponible</h3>
              <p className="text-body-sm text-on-surface-variant">
                Fonctionnalité en cours de développement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
