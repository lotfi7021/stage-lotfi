import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS, INSCRIPTIONS, UTILISATEURS, CERTIFICATIONS, EVALUATIONS, CURRENT_USER } from '../../data/mock';

export default function ParticipantDashboard() {
  // Récupérer les inscriptions du participant connecté
  const participantInscriptions = INSCRIPTIONS
    .filter(inscription => inscription.participant_id === CURRENT_USER.id)
    .map(inscription => {
      const session = SESSIONS.find(s => s.id === inscription.session_id);
      const formation = FORMATIONS.find(f => f.id === session?.formation_id);
      const certification = CERTIFICATIONS.find(c => c.inscription_id === inscription.id);
      const evaluation = EVALUATIONS.find(e => e.inscription_id === inscription.id);
      const formateur = UTILISATEURS.find(u => u.id === session?.formateur_id);
      
      return {
        ...inscription,
        session,
        formation,
        certification,
        evaluation,
        formateur
      };
    });

  // Calculer les statistiques
  const totalInscriptions = participantInscriptions.length;
  const formationsCompleted = participantInscriptions.filter(i => i.session?.statut === 'Completed').length;
  const formationsInProgress = participantInscriptions.filter(i => i.session?.statut === 'In Progress').length;
  const certificationsObtained = participantInscriptions.filter(i => i.certification).length;

  // Prochaines sessions
  const prochainesFormations = participantInscriptions
    .filter(inscription => 
      inscription.session?.statut === 'Planned' || 
      inscription.session?.statut === 'In Progress'
    )
    .sort((a, b) => new Date(a.session.date_debut) - new Date(b.session.date_debut))
    .slice(0, 3);

  // Certifications récentes
  const certificationsRecentes = participantInscriptions
    .filter(inscription => inscription.certification)
    .sort((a, b) => new Date(b.certification.date_obtention) - new Date(a.certification.date_obtention))
    .slice(0, 3);

  // Activité récente
  const activiteRecente = [
    {
      id: 1,
      type: 'evaluation',
      text: 'Evaluation completed for Electrical Safety Certification BR',
      time: '2 days ago',
      icon: 'assignment_turned_in'
    },
    {
      id: 2,
      type: 'certification',
      text: 'Certificate obtained for Project Management training',
      time: '1 week ago',
      icon: 'workspace_premium'
    },
    {
      id: 3,
      type: 'inscription',
      text: 'Successfully enrolled in upcoming Electrical Safety training',
      time: '2 weeks ago',
      icon: 'how_to_reg'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center">
            <Icon name="person" className="text-on-tertiary-container text-[32px]" />
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">
              Welcome, {CURRENT_USER.prenom} {CURRENT_USER.nom}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Learning Dashboard • Continue your professional development journey
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Icon name="badge" className="text-on-surface-variant text-[16px]" />
              <span className="text-body-sm text-on-surface-variant">
                {CURRENT_USER.matricule}
              </span>
            </div>
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
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{totalInscriptions}</p>
          <p className="font-label-sm text-on-surface-variant">Enrolled Trainings</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-success-container text-on-success-container">Complete</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-success" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{formationsCompleted}</p>
          <p className="font-label-sm text-on-surface-variant">Completed Trainings</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-tertiary-container text-on-tertiary-container">Active</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-tertiary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{formationsInProgress}</p>
          <p className="font-label-sm text-on-surface-variant">Active Trainings</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-secondary-container text-on-secondary-container">Certs</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-secondary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{certificationsObtained}</p>
          <p className="font-label-sm text-on-surface-variant">Certificates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Trainings */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Trainings</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Your scheduled learning sessions</p>
              </div>
              <button className="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                <Icon name="calendar_today" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {prochainesFormations.length > 0 ? (
              <div className="space-y-4">
                {prochainesFormations.map((inscription) => (
                  <div key={inscription.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                    <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                      <Icon name="school" className="text-on-secondary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-on-surface font-semibold truncate">
                        {inscription.formation?.titre}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        {new Date(inscription.session?.date_debut).toLocaleDateString()} • {inscription.session?.lieu}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Trainer: {inscription.formateur?.prenom} {inscription.formateur?.nom}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-label-sm font-medium ${
                        inscription.session?.statut === 'Planned' 
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-container text-on-tertiary-container'
                      }`}>
                        {inscription.session?.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="event_available" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                <p className="text-body-md text-on-surface-variant mb-3">No upcoming trainings</p>
                <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-4 py-2 text-label-sm">
                  Browse Catalog
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">My Certificates</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Your latest achievements</p>
              </div>
              <button className="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                <Icon name="workspace_premium" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {certificationsRecentes.length > 0 ? (
              <div className="space-y-4">
                {certificationsRecentes.map((inscription) => (
                  <div key={inscription.certification.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                    <div className="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center">
                      <Icon name="workspace_premium" className="text-on-tertiary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-on-surface font-semibold truncate">
                        {inscription.formation?.titre}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        Obtained: {new Date(inscription.certification.date_obtention).toLocaleDateString()}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Valid until: {new Date(inscription.certification.date_expiration).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors" title="Download Certificate">
                      <Icon name="download" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="workspace_premium" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
                <p className="text-body-md text-on-surface-variant">No certificates yet</p>
                <p className="text-body-sm text-on-surface-variant mt-1">Complete trainings to earn certificates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Learning Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-primary-container rounded-full flex items-center justify-center mb-3">
              <span className="text-display-sm font-bold text-on-primary">
                {totalInscriptions > 0 ? Math.round((formationsCompleted / totalInscriptions) * 100) : 0}%
              </span>
            </div>
            <div className="font-label-md text-on-surface">Completion Rate</div>
            <div className="text-body-sm text-on-surface-variant mt-1">
              {formationsCompleted} of {totalInscriptions} trainings
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-secondary-container rounded-full flex items-center justify-center mb-3">
              <span className="text-display-sm font-bold text-on-secondary-container">
                {participantInscriptions.filter(i => i.evaluation && parseFloat(i.evaluation.note) >= 10).length}
              </span>
            </div>
            <div className="font-label-md text-on-surface">Passed Assessments</div>
            <div className="text-body-sm text-on-surface-variant mt-1">
              Grade ≥ 10/20
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-tertiary-container rounded-full flex items-center justify-center mb-3">
              <span className="text-display-sm font-bold text-on-tertiary-container">
                {certificationsObtained}
              </span>
            </div>
            <div className="font-label-md text-on-surface">Active Certificates</div>
            <div className="text-body-sm text-on-surface-variant mt-1">
              Valid certifications
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="library_books" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">Browse Catalog</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="calendar_view_week" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">My Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="workspace_premium" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">My Certificates</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
            <Icon name="feedback" className="text-primary text-[32px]" />
            <span className="text-label-md text-on-surface">Give Feedback</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h3>
          <p className="text-body-md text-on-surface-variant mt-1">Your latest learning activities</p>
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
  );
}