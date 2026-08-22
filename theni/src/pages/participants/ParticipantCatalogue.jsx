import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { FORMATIONS, SESSIONS, INSCRIPTIONS, UTILISATEURS, CURRENT_USER } from '../../data/mock';

const CATEGORIES = [
  'All',
  'Safety',
  'Management', 
  'Technical Skills',
  'Leadership',
  'Digital Transformation',
  'Quality Management'
];

const DURATION_FILTERS = [
  { label: 'All Durations', value: 'all' },
  { label: '1-3 days', value: '1-3' },
  { label: '4-5 days', value: '4-5' },
  { label: '6+ days', value: '6+' }
];

export default function ParticipantCatalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [enrollModal, setEnrollModal] = useState(false);

  // Récupérer les formations avec leurs sessions disponibles
  const formationsWithSessions = FORMATIONS.map(formation => {
    const availableSessions = SESSIONS.filter(session => 
      session.formation_id === formation.id && 
      session.statut === 'Planned'
    ).map(session => {
      const formateur = UTILISATEURS.find(u => u.id === session.formateur_id);
      const inscriptions = INSCRIPTIONS.filter(i => i.session_id === session.id);
      const userEnrolled = inscriptions.some(i => i.participant_id === CURRENT_USER.id);
      
      return {
        ...session,
        formateur,
        enrolledCount: inscriptions.length,
        userEnrolled
      };
    });

    return {
      ...formation,
      availableSessions,
      hasAvailableSessions: availableSessions.length > 0
    };
  });

  // Filtrer les formations
  const filteredFormations = formationsWithSessions.filter(formation => {
    const matchesSearch = 
      formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.objectifs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.prerequis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || formation.categorie === selectedCategory;

    const matchesDuration = 
      selectedDuration === 'all' ||
      (selectedDuration === '1-3' && formation.duree_jours >= 1 && formation.duree_jours <= 3) ||
      (selectedDuration === '4-5' && formation.duree_jours >= 4 && formation.duree_jours <= 5) ||
      (selectedDuration === '6+' && formation.duree_jours >= 6);

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const handleEnroll = (sessionId) => {
    console.log('Enrolling in session:', sessionId);
    // Ici vous ajouteriez l'appel API pour l'inscription
    alert('Successfully enrolled in the training session!');
    setEnrollModal(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Safety': 'bg-error-container text-on-error-container',
      'Management': 'bg-primary-container text-on-primary',
      'Technical Skills': 'bg-secondary-container text-on-secondary-container',
      'Leadership': 'bg-tertiary-container text-on-tertiary-container',
      'Digital Transformation': 'bg-surface-variant text-on-surface-variant',
      'Quality Management': 'bg-success-container text-on-success-container'
    };
    return colors[category] || 'bg-surface-variant text-on-surface-variant';
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Training Catalog</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Discover and enroll in professional development training programs offered by STEG.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-[20px]" />
            <input
              type="text"
              placeholder="Search training programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary min-w-[180px]"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary min-w-[150px]"
          >
            {DURATION_FILTERS.map(duration => (
              <option key={duration.value} value={duration.value}>{duration.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-body-md text-on-surface-variant">
        {filteredFormations.length} training program{filteredFormations.length !== 1 ? 's' : ''} found
      </div>

      {/* Training Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFormations.length > 0 ? (
          filteredFormations.map((formation) => (
            <div key={formation.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(formation.categorie)}`}>
                      {formation.categorie}
                    </span>
                    <span className="text-label-sm text-on-surface-variant">
                      {formation.duree_jours} day{formation.duree_jours !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">
                    {formation.titre}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-label-md text-on-surface font-bold">
                    {formation.prix_base.toFixed(2)} TND
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Objectives</div>
                  <p className="text-body-sm text-on-surface line-clamp-2">{formation.objectifs}</p>
                </div>

                {formation.prerequis && (
                  <div>
                    <div className="text-label-sm text-on-surface-variant mb-1">Prerequisites</div>
                    <p className="text-body-sm text-on-surface">{formation.prerequis}</p>
                  </div>
                )}
              </div>

              {/* Available Sessions */}
              {formation.hasAvailableSessions ? (
                <div className="border-t border-outline-variant pt-4">
                  <div className="text-label-sm text-on-surface-variant mb-2">
                    Available Sessions ({formation.availableSessions.length})
                  </div>
                  <div className="space-y-2">
                    {formation.availableSessions.slice(0, 2).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                        <div className="flex-1">
                          <div className="text-body-sm text-on-surface font-semibold">
                            {new Date(session.date_debut).toLocaleDateString()} - {new Date(session.date_fin).toLocaleDateString()}
                          </div>
                          <div className="text-body-sm text-on-surface-variant">
                            {session.lieu} • {session.type_session} • {session.formateur?.prenom} {session.formateur?.nom}
                          </div>
                          <div className="text-body-sm text-on-surface-variant">
                            {session.enrolledCount} enrolled
                          </div>
                        </div>
                        <div>
                          {session.userEnrolled ? (
                            <span className="px-3 py-1 rounded-full text-label-sm font-medium bg-success-container text-on-success-container">
                              Enrolled
                            </span>
                          ) : (
                            <button
                              onClick={() => {setSelectedFormation(formation); setEnrollModal(true);}}
                              className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-3 py-1 text-label-sm"
                            >
                              Enroll
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {formation.availableSessions.length > 2 && (
                      <button
                        onClick={() => setSelectedFormation(formation)}
                        className="w-full text-primary hover:bg-surface-container rounded-lg py-2 text-label-sm transition-colors"
                      >
                        View all {formation.availableSessions.length} sessions
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-t border-outline-variant pt-4">
                  <div className="text-center py-3 text-on-surface-variant">
                    <Icon name="event_busy" className="text-[24px] mb-1" />
                    <div className="text-body-sm">No sessions currently available</div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Icon name="search_off" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
            <h3 className="font-headline-sm text-on-surface-variant mb-2">No training programs found</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {enrollModal && selectedFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setEnrollModal(false)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Enroll in Training</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setEnrollModal(false)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-headline-sm text-on-surface mb-2">{selectedFormation.titre}</h4>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(selectedFormation.categorie)}`}>
                  {selectedFormation.categorie}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  {selectedFormation.duree_jours} days • {selectedFormation.prix_base.toFixed(2)} TND
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">{selectedFormation.objectifs}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-headline-sm text-on-surface mb-3">Choose a Session</h4>
              <div className="space-y-3">
                {selectedFormation.availableSessions.map((session) => (
                  <div key={session.id} className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    session.userEnrolled 
                      ? 'border-success bg-success-container/20 cursor-not-allowed'
                      : 'border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-primary'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-label-md text-on-surface font-semibold mb-1">
                          {new Date(session.date_debut).toLocaleDateString()} - {new Date(session.date_fin).toLocaleDateString()}
                        </div>
                        <div className="text-body-sm text-on-surface-variant mb-1">
                          📍 {session.lieu} • {session.type_session}
                        </div>
                        <div className="text-body-sm text-on-surface-variant">
                          👨‍🏫 {session.formateur?.prenom} {session.formateur?.nom} • {session.enrolledCount} enrolled
                        </div>
                      </div>
                      <div>
                        {session.userEnrolled ? (
                          <span className="px-3 py-1 rounded-full text-label-sm font-medium bg-success-container text-on-success-container">
                            Already Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnroll(session.id)}
                            className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-4 py-2 text-label-sm"
                          >
                            Select This Session
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                type="button"
                className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                onClick={() => setEnrollModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}