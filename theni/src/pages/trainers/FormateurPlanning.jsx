import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS, INSCRIPTIONS, CURRENT_USER } from '../../data/mock';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FormateurPlanning() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' ou 'week'
  const [selectedSession, setSelectedSession] = useState(null);

  // Récupérer les sessions du formateur
  const formateurSessions = SESSIONS
    .filter(session => session.formateur_id === CURRENT_USER.id)
    .map(session => {
      const formation = FORMATIONS.find(f => f.id === session.formation_id);
      const inscriptions = INSCRIPTIONS.filter(i => i.session_id === session.id);
      return {
        ...session,
        formation: formation?.titre || 'Unknown Formation',
        participantsCount: inscriptions.length
      };
    });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent pour remplir la première semaine
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        sessions: []
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dayStr = currentDay.toISOString().split('T')[0];
      
      const sessionsForDay = formateurSessions.filter(session => {
        const startDate = new Date(session.date_debut);
        const endDate = new Date(session.date_fin);
        return currentDay >= startDate && currentDay <= endDate;
      });

      days.push({
        date: currentDay,
        isCurrentMonth: true,
        sessions: sessionsForDay
      });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      const nextDate = new Date(year, month + 1, nextMonthDay);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        sessions: []
      });
      nextMonthDay++;
    }

    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const dayStr = currentDay.toISOString().split('T')[0];
      
      const sessionsForDay = formateurSessions.filter(session => {
        const startDate = new Date(session.date_debut);
        const endDate = new Date(session.date_fin);
        return currentDay >= startDate && currentDay <= endDate;
      });

      days.push({
        date: currentDay,
        isCurrentMonth: currentDay.getMonth() === date.getMonth(),
        sessions: sessionsForDay
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction * 7));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned':
        return 'bg-secondary-container text-on-secondary-container border-secondary';
      case 'In Progress':
        return 'bg-tertiary-container text-on-tertiary-container border-tertiary';
      case 'Completed':
        return 'bg-success-container text-on-success-container border-success';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline';
    }
  };

  const days = viewMode === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">My Training Schedule</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            View and manage your training session calendar.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-outline-variant overflow-hidden">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-label-sm transition-colors ${
                viewMode === 'month' 
                  ? 'bg-primary-container text-on-primary' 
                  : 'bg-surface text-on-surface hover:bg-surface-container'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-label-sm transition-colors ${
                viewMode === 'week' 
                  ? 'bg-primary-container text-on-primary' 
                  : 'bg-surface text-on-surface hover:bg-surface-container'
              }`}
            >
              Week
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg text-label-sm transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <Icon name="chevron_left" />
          </button>
          
          <h3 className="font-headline-md text-headline-md text-on-surface min-w-[200px] text-center">
            {viewMode === 'month' 
              ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            }
          </h3>
          
          <button
            onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <Icon name="chevron_right" />
          </button>
        </div>

        <div className="text-body-sm text-on-surface-variant">
          {formateurSessions.length} sessions total
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-outline-variant">
          {DAYS.map((day) => (
            <div key={day} className="p-4 bg-surface-container-low text-center">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-outline-variant/50 ${
                !day.isCurrentMonth ? 'bg-surface-container/50' : 'bg-surface'
              } ${
                day.date.toDateString() === new Date().toDateString() 
                  ? 'bg-primary-container/20' 
                  : ''
              }`}
            >
              <div className={`text-label-sm mb-2 ${
                !day.isCurrentMonth 
                  ? 'text-on-surface-variant/50' 
                  : day.date.toDateString() === new Date().toDateString()
                  ? 'text-primary font-semibold'
                  : 'text-on-surface'
              }`}>
                {day.date.getDate()}
              </div>

              <div className="space-y-1">
                {day.sessions.slice(0, 2).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-1.5 rounded text-xs leading-tight border transition-colors hover:opacity-80 ${getStatusColor(session.statut)}`}
                  >
                    <div className="font-medium truncate">{session.formation}</div>
                    <div className="opacity-80">{session.participantsCount}p • {session.lieu}</div>
                  </button>
                ))}
                
                {day.sessions.length > 2 && (
                  <div className="text-xs text-on-surface-variant text-center py-1">
                    +{day.sessions.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-label-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-container border border-secondary"></div>
          <span className="text-on-surface-variant">Planned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-tertiary-container border border-tertiary"></div>
          <span className="text-on-surface-variant">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success-container border border-success"></div>
          <span className="text-on-surface-variant">Completed</span>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setSelectedSession(null)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Session Details</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setSelectedSession(null)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Formation</div>
                  <div className="text-body-md text-on-surface font-semibold">{selectedSession.formation}</div>
                </div>
                
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Duration</div>
                  <div className="text-body-md text-on-surface">
                    {new Date(selectedSession.date_debut).toLocaleDateString()} - {new Date(selectedSession.date_fin).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Location</div>
                  <div className="text-body-md text-on-surface">{selectedSession.lieu}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Session Type</div>
                  <div className="text-body-md text-on-surface">{selectedSession.type_session}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Participants</div>
                  <div className="text-body-md text-on-surface">{selectedSession.participantsCount} enrolled</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Status</div>
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

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-outline-variant">
              <button
                type="button"
                className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md"
                onClick={() => setSelectedSession(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
              >
                <Icon name="open_in_new" />
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}