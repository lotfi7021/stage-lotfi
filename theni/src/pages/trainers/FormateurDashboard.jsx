import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS, INSCRIPTIONS, UTILISATEURS, PRESENCES, CURRENT_USER } from '../../data/mock';

export default function FormateurDashboard() {
  // Récupérer les sessions du formateur connecté
  const formateurSessions = SESSIONS.filter(session => session.formateur_id === CURRENT_USER.id);
  
  // Calculer les statistiques
  const totalSessions = formateurSessions.length;
  const sessionsEnCours = formateurSessions.filter(s => s.statut === 'In Progress').length;
  const sessionsPlanifiees = formateurSessions.filter(s => s.statut === 'Planned').length;
  const sessionsTerminees = formateurSessions.filter(s => s.statut === 'Completed').length;

  // Prochaines sessions (les 3 plus proches)
  const prochainesSessions = formateurSessions
    .filter(s => s.statut === 'Planned')
    .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
    .slice(0, 3)
    .map(session => {
      const formation = FORMATIONS.find(f => f.id === session.formation_id);
      const inscriptions = INSCRIPTIONS.filter(i => i.session_id === session.id);
      return {
        ...session,
        formation: formation?.titre || 'Unknown Formation',
        participantsCount: inscriptions.length
      };
    });

  // Activité récente
  const activiteRecente = [
    {
      id: 1,
      type: 'presence',
      text: 'Attendance marked for Electrical Safety session',
      time: '2 hours ago',
      icon: 'fact_check'
    },
    {
      id: 2, 
      type: 'evaluation',
      text: 'Grades submitted for Project Management participants',
      time: '1 day ago',
      icon: 'grade'
    },
    {
      id: 3,
      type: 'planning',
      text: 'New session scheduled for next week',
      time: '2 days ago',
      icon: 'calendar_today'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center">
            <Icon name="psychology" className="text-on-primary-container text-[32px]" />
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">
              Welcome, {CURRENT_USER.prenom} {CURRENT_USER.nom}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Trainer Dashboard • Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-primary-container text-on-primary">Total</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-primary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{totalSessions}</p>
          <p className="font-label-sm text-on-surface-variant">Total Sessions</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-tertiary-container text-on-tertiary-container">Active</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-tertiary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{sessionsEnCours}</p>
          <p className="font-label-sm text-on-surface-variant">Active Sessions</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-secondary-container text-on-secondary-container">Planned</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-secondary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{sessionsPlanifiees}</p>
          <p className="font-label-sm text-on-surface-variant">Planned Sessions</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-success-container text-on-success-container">Complete</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-success" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{sessionsTerminees}</p>
          <p className="font-label-sm text-on-surface-variant">Completed Sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Sessions</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Your next training sessions</p>
              </div>
              <button className="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                <Icon name="calendar_today" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {prochainesSessions.length > 0 ? (
              <div className="space-y-4">
                {prochainesSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                    <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                      <Icon name="school" className="text-on-secondary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-on-surface font-semibold truncate">
                        {session.formation}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        {new Date(session.date_debut).toLocaleDateString()} • {session.lieu}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-label-sm text-on-surface font-semibold">
                        {session.participantsCount} participants
                      </div>
                      <div className="text-body-sm text-on-surface-variant">
                        {session.type_session}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="event_busy" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                <p className="text-body-md text-on-surface-variant">No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Your latest actions</p>
              </div>
              <button className="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                <Icon name="history" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activiteRecente.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Icon name={item.icon} className="text-on-primary-container text-[16px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-on-surface">{item.text}</p>
                    <p className="text-body-sm text-on-surface-variant mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="fact_check" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">Mark Attendance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="grade" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">Enter Grades</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="calendar_view_week" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">View Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="assessment" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">Session Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}