import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS, INSCRIPTIONS, UTILISATEURS, EVALUATIONS, CURRENT_USER } from '../../data/mock';

const EVALUATION_TYPES = [
  { value: 'Pre-training', label: 'Pre-Training Assessment', icon: 'quiz' },
  { value: 'Mid-training', label: 'Mid-Training Evaluation', icon: 'assignment' },
  { value: 'Post-training', label: 'Post-Training Assessment', icon: 'school' },
  { value: 'Final', label: 'Final Examination', icon: 'workspace_premium' }
];

export default function FormateurEvaluations() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState('');
  const [evaluationData, setEvaluationData] = useState({});
  const [viewMode, setViewMode] = useState('entry'); // 'entry' ou 'history'

  // Récupérer les sessions du formateur
  const formateurSessions = SESSIONS
    .filter(session => session.formateur_id === CURRENT_USER.id)
    .map(session => {
      const formation = FORMATIONS.find(f => f.id === session.formation_id);
      const inscriptions = INSCRIPTIONS.filter(i => i.session_id === session.id);
      return {
        ...session,
        formation: formation?.titre || 'Unknown Formation',
        participants: inscriptions.map(inscription => {
          const user = UTILISATEURS.find(u => u.id === inscription.participant_id);
          return {
            ...inscription,
            ...user
          };
        })
      };
    });

  // Initialiser les données d'évaluation
  const initializeEvaluationData = (session, type) => {
    const key = `${session.id}-${type}`;
    if (!evaluationData[key]) {
      const initialData = {};
      session.participants.forEach(participant => {
        // Vérifier si une évaluation existe déjà
        const existingEval = EVALUATIONS.find(e => 
          e.inscription_id === participant.id && 
          e.type_evaluation === type
        );
        
        initialData[participant.id] = {
          note: existingEval?.note || '',
          commentaires: existingEval?.commentaires || ''
        };
      });
      
      setEvaluationData(prev => ({
        ...prev,
        [key]: initialData
      }));
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setSelectedEvaluationType('');
  };

  const handleEvaluationTypeSelect = (type) => {
    setSelectedEvaluationType(type);
    if (selectedSession) {
      initializeEvaluationData(selectedSession, type);
    }
  };

  const updateEvaluation = (participantId, field, value) => {
    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    setEvaluationData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [participantId]: {
          ...prev[key]?.[participantId],
          [field]: value
        }
      }
    }));
  };

  const saveEvaluations = () => {
    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    const data = evaluationData[key];
    
    if (!data) return;

    // Validation : vérifier que toutes les notes sont entre 0 et 20
    const invalidGrades = Object.entries(data).filter(([_, evaluation]) => {
      const grade = parseFloat(evaluation.note);
      return evaluation.note !== '' && (isNaN(grade) || grade < 0 || grade > 20);
    });

    if (invalidGrades.length > 0) {
      alert('Please ensure all grades are between 0 and 20.');
      return;
    }

    console.log('Saving evaluations for', selectedEvaluationType, ':', data);
    
    // Ici vous ajouteriez l'appel API pour sauvegarder
    alert('Evaluations saved successfully!');
  };

  const calculateSessionStats = () => {
    if (!selectedSession || !selectedEvaluationType) return null;
    
    const key = `${selectedSession.id}-${selectedEvaluationType}`;
    const data = evaluationData[key] || {};
    const grades = Object.values(data)
      .map(evaluation => parseFloat(evaluation.note))
      .filter(grade => !isNaN(grade));

    if (grades.length === 0) return null;

    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const highest = Math.max(...grades);
    const lowest = Math.min(...grades);
    const passed = grades.filter(grade => grade >= 10).length;

    return { average, highest, lowest, passed, total: grades.length };
  };

  const currentEvaluationData = selectedSession && selectedEvaluationType 
    ? evaluationData[`${selectedSession.id}-${selectedEvaluationType}`] || {}
    : {};

  const stats = calculateSessionStats();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Evaluations Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Enter and manage participant evaluations for your training sessions.
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
            Grade Entry
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg text-label-sm transition-colors ${
              viewMode === 'history' 
                ? 'bg-primary-container text-on-primary' 
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Evaluation History
          </button>
        </div>
      </div>

      {viewMode === 'entry' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Selection */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-on-surface">Select Session</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Choose a training session</p>
              </div>
              <div className="p-6 space-y-3">
                {formateurSessions.length > 0 ? (
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
                        {new Date(session.date_debut).toLocaleDateString()} - {new Date(session.date_fin).toLocaleDateString()}
                      </div>
                      <div className="text-body-sm opacity-80">
                        {session.participants.length} participants • {session.lieu}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon name="event_busy" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                    <p className="text-body-md text-on-surface-variant">No sessions available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation Type Selection */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-on-surface">Evaluation Type</h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  {selectedSession ? 'Choose evaluation type' : 'Select a session first'}
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
                    <p className="text-body-md text-on-surface-variant">Select a session to view evaluation types</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.average.toFixed(1)}</div>
                <div className="text-label-sm text-on-surface-variant">Average Grade</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.highest}</div>
                <div className="text-label-sm text-on-surface-variant">Highest Grade</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.lowest}</div>
                <div className="text-label-sm text-on-surface-variant">Lowest Grade</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{stats.passed}</div>
                <div className="text-label-sm text-on-surface-variant">Passed (≥10)</div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 ambient-shadow">
                <div className="text-display-sm font-bold text-on-surface">{((stats.passed / stats.total) * 100).toFixed(0)}%</div>
                <div className="text-label-sm text-on-surface-variant">Success Rate</div>
              </div>
            </div>
          )}

          {/* Evaluation Table */}
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
                    Grades should be between 0 and 20
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Participant</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider w-32">Grade (/20)</th>
                      <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    {selectedSession.participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-surface-container-low transition-colors">
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
                            value={currentEvaluationData[participant.id]?.note || ''}
                            onChange={(e) => updateEvaluation(participant.id, 'note', e.target.value)}
                            className="w-20 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary text-center"
                            placeholder="0-20"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={currentEvaluationData[participant.id]?.commentaires || ''}
                            onChange={(e) => updateEvaluation(participant.id, 'commentaires', e.target.value)}
                            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary"
                            placeholder="Optional comments..."
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
                    {Object.values(currentEvaluationData).filter(evaluation => evaluation.note !== '').length} / {selectedSession.participants.length} grades entered
                  </div>
                  <button
                    onClick={saveEvaluations}
                    className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
                  >
                    <Icon name="save" />
                    Save Evaluations
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
            <h3 className="font-headline-md text-headline-md text-on-surface">Evaluation History</h3>
            <p className="text-body-md text-on-surface-variant mt-1">View previously entered evaluations</p>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Icon name="history" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
              <h3 className="font-headline-sm text-on-surface-variant mb-2">Evaluation History</h3>
              <p className="text-body-sm text-on-surface-variant">
                Feature coming soon - view and export evaluation reports
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}