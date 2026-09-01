import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import participantService from '../../services/participants/participantService';

export default function ParticipantDashboard() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await participantService.getParticipantInscriptions(currentUser.id);
        setInscriptions(res.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const totalInscriptions = inscriptions.length;
  const formationsCompleted = inscriptions.filter(i => i.session?.statut === 'COMPLETED').length;
  const formationsInProgress = inscriptions.filter(i => i.session?.statut === 'ONGOING' || i.session?.statut === 'IN_PROGRESS').length;

  const prochainesFormations = inscriptions
    .filter(i => i.session?.statut === 'PENDING' || i.session?.statut === 'CONFIRMED')
    .sort((a, b) => new Date(a.session?.dateDebut) - new Date(b.session?.dateDebut))
    .slice(0, 3);

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
              Welcome, {currentUser.prenom} {currentUser.nom}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Learning Dashboard — Continue your professional development journey
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Icon name="badge" className="text-on-surface-variant text-[16px]" />
              <span className="text-body-sm text-on-surface-variant">
                {currentUser.matricule}
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
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-secondary-container text-on-secondary-container">Rate</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-secondary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">
            {totalInscriptions > 0 ? Math.round((formationsCompleted / totalInscriptions) * 100) : 0}%
          </p>
          <p className="font-label-sm text-on-surface-variant">Completion Rate</p>
        </div>
      </div>

      {/* Upcoming Trainings */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Trainings</h3>
          <p className="text-body-md text-on-surface-variant mt-1">Your scheduled learning sessions</p>
        </div>
        <div className="p-6">
          {!loading && prochainesFormations.length > 0 ? (
            <div className="space-y-4">
              {prochainesFormations.map((inscription) => (
                <div key={inscription.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                  <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                    <Icon name="school" className="text-on-secondary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-on-surface font-semibold truncate">
                      {inscription.session?.formation?.titre || '—'}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {inscription.session?.dateDebut ? new Date(inscription.session.dateDebut).toLocaleDateString('fr-TN') : '—'} — {inscription.session?.dateFin ? new Date(inscription.session.dateFin).toLocaleDateString('fr-TN') : '—'} • {inscription.session?.lieu || '—'}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Trainer: {inscription.session?.formateur?.utilisateur?.prenom} {inscription.session?.formateur?.utilisateur?.nom}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded-full text-label-sm font-medium bg-secondary-container text-on-secondary-container">
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
            </div>
          )}
        </div>
      </div>

      {/* All Enrolled Trainings */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-surface">My Enrollments</h3>
          <p className="text-body-md text-on-surface-variant mt-1">All your training enrollments</p>
        </div>
        <div className="p-6">
          {!loading && inscriptions.length > 0 ? (
            <div className="space-y-3">
              {inscriptions.map((inscription) => (
                <div key={inscription.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg">
                  <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                    <Icon name="menu_book" className="text-on-primary-container text-[20px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-on-surface font-semibold truncate">
                      {inscription.session?.formation?.titre || '—'}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {inscription.session?.formation?.categorie || '—'} • {inscription.session?.formation?.duree || '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-label-sm font-medium ${
                      inscription.statut === 'ATTENDED'
                        ? 'bg-success-container text-on-success-container'
                        : inscription.statut === 'CANCELLED'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary-container text-on-primary'
                    }`}>
                      {inscription.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="school" className="text-on-surface-variant/40 text-[48px] mx-auto mb-3" />
              <p className="text-body-md text-on-surface-variant">No enrollments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
