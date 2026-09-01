import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import trainerService from '../../services/trainers/trainerService';
import participantService from '../../services/participants/participantService';
import formationService from '../../services/formations/formationService';

export default function FormateurPresences() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [presenceData, setPresenceData] = useState({});
  const [formateurSessions, setFormateurSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

            const participants = await Promise.all(
              inscriptions.map(async (inscription) => {
                const userRes = await import('../../services/auth/userService').then(m => m.default.getUserById(inscription.participant_id));
                return { ...inscription, ...userRes.data };
              })
            );

            return {
              ...session,
              formation: formationsMap[session.formation_id]?.titre || 'Unknown Formation',
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

  // Générer les dates d'une session
  const getSessionDates = (session) => {
    if (!session) return [];
    const startDate = new Date(session.date_debut);
    const endDate = new Date(session.date_fin);
    const dates = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    return dates;
  };

  // Initialiser les données de présence
  const initializePresenceData = async (session, date) => {
    const key = `${session.id}-${date}`;
    if (!presenceData[key]) {
      try {
        const presencesRes = await trainerService.getSessionPresences(session.id, date);
        const existingPresences = presencesRes.data || [];
        const presencesMap = Object.fromEntries(
          existingPresences.map(p => [p.inscription_id, p])
        );

        const initialData = {};
        session.participants.forEach(participant => {
          const existingPresence = presencesMap[participant.id];
          initialData[participant.id] = {
            present_cours: existingPresence?.present_cours || false,
            present_cantine: existingPresence?.present_cantine || false
          };
        });
        
        setPresenceData(prev => ({
          ...prev,
          [key]: initialData
        }));
      } catch (error) {
        console.error('Error fetching presences:', error);
      }
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setSelectedDate('');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedSession) {
      initializePresenceData(selectedSession, date);
    }
  };

  const updatePresence = (participantId, field, value) => {
    const key = `${selectedSession.id}-${selectedDate}`;
    setPresenceData(prev => ({
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

  const savePresences = async () => {
    const key = `${selectedSession.id}-${selectedDate}`;
    const data = presenceData[key];
    
    if (!data) return;

    try {
      const attendanceData = Object.entries(data).map(([participantId, presence]) => ({
        inscription_id: parseInt(participantId),
        present_cours: presence.present_cours,
        present_cantine: presence.present_cantine,
      }));

      await trainerService.markAttendance(selectedSession.id, selectedDate, attendanceData);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving presences:', error);
      alert('Error saving attendance. Please try again.');
    }
  };

  const markAllPresent = (field) => {
    if (!selectedSession || !selectedDate) return;
    
    const key = `${selectedSession.id}-${selectedDate}`;
    const updatedData = {};
    
    selectedSession.participants.forEach(participant => {
      updatedData[participant.id] = {
        ...presenceData[key]?.[participant.id],
        [field]: true
      };
    });
    
    setPresenceData(prev => ({
      ...prev,
      [key]: updatedData
    }));
  };

  const currentPresenceData = selectedSession && selectedDate 
    ? presenceData[`${selectedSession.id}-${selectedDate}`] || {}
    : {};

  const sessionDates = selectedSession ? getSessionDates(selectedSession) : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Attendance Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Mark attendance for your training sessions and manage participant presence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Selection */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface">Select Session</h3>
            <p className="text-body-md text-on-surface-variant mt-1">Choose a training session</p>
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
                <p className="text-body-md text-on-surface-variant">{loading ? 'Loading sessions...' : 'No sessions available'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface">Select Date</h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              {selectedSession ? 'Choose training day' : 'Select a session first'}
            </p>
          </div>
          <div className="p-6">
            {selectedSession ? (
              <div className="space-y-3">
                {sessionDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`w-full p-4 rounded-lg text-left transition-colors border ${
                      selectedDate === date
                        ? 'bg-secondary-container border-secondary text-on-secondary-container'
                        : 'bg-surface-container border-outline-variant hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <div className="font-label-md font-semibold">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-body-sm opacity-80 mt-1">Training Day</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="calendar_today" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                <p className="text-body-md text-on-surface-variant">Select a session to view dates</p>
              </div>
            )}
          </div>
        </div>

        {/* Session Info */}
        {selectedSession && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-surface">Session Info</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-label-sm text-on-surface-variant">Formation</div>
                <div className="text-body-md text-on-surface font-semibold">{selectedSession.formation}</div>
              </div>
              <div>
                <div className="text-label-sm text-on-surface-variant">Location</div>
                <div className="text-body-md text-on-surface">{selectedSession.lieu}</div>
              </div>
              <div>
                <div className="text-label-sm text-on-surface-variant">Type</div>
                <div className="text-body-md text-on-surface">{selectedSession.type_session}</div>
              </div>
              <div>
                <div className="text-label-sm text-on-surface-variant">Participants</div>
                <div className="text-body-md text-on-surface">{selectedSession.participants.length} enrolled</div>
              </div>
              <div>
                <div className="text-label-sm text-on-surface-variant">Status</div>
                <span className={`px-3 py-1 rounded-full text-label-sm font-medium ${
                  selectedSession.statut === 'Planned' 
                    ? 'bg-secondary-container text-on-secondary-container'
                    : selectedSession.statut === 'In Progress'
                    ? 'bg-tertiary-container text-on-tertiary-container'
                    : 'bg-success-container text-on-success-container'
                }`}>
                  {selectedSession.statut}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      {selectedSession && selectedDate && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  {selectedSession.formation} • {selectedSession.participants.length} participants
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markAllPresent('present_cours')}
                  className="text-primary hover:bg-surface-container rounded-lg px-3 py-2 text-label-sm transition-colors"
                >
                  Mark All Training
                </button>
                <button
                  onClick={() => markAllPresent('present_cantine')}
                  className="text-primary hover:bg-surface-container rounded-lg px-3 py-2 text-label-sm transition-colors"
                >
                  Mark All Cafeteria
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Participant</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Training</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Cafeteria</th>
                  <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Employee ID</th>
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
                          <div className="text-body-sm text-on-surface-variant">{participant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={currentPresenceData[participant.id]?.present_cours || false}
                        onChange={(e) => updatePresence(participant.id, 'present_cours', e.target.checked)}
                        className="w-5 h-5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={currentPresenceData[participant.id]?.present_cantine || false}
                        onChange={(e) => updatePresence(participant.id, 'present_cantine', e.target.checked)}
                        className="w-5 h-5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-body-md text-on-surface">{participant.matricule}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-outline-variant">
            <div className="flex justify-between items-center">
              <div className="text-body-md text-on-surface-variant">
                {Object.values(currentPresenceData).filter(p => p.present_cours).length} / {selectedSession.participants.length} present for training
              </div>
              <button
                onClick={savePresences}
                className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
              >
                <Icon name="save" />
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
