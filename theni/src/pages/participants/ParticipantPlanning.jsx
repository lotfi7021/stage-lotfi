import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { INSCRIPTIONS, SESSIONS, FORMATIONS, UTILISATEURS } from '../../data/mock';

const MONTH_LABELS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const WEEKDAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

export default function ParticipantPlanning() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  // Build participant's sessions from their enrollments
  const participantSessions = INSCRIPTIONS
    .filter(inscription => inscription.participant_id === 1) // Assuming current user
    .map(inscription => {
      const session = SESSIONS.find(s => s.id === inscription.session_id);
      const formation = session ? FORMATIONS.find(f => f.id === session.formation_id) : null;
      const formateur = session ? UTILISATEURS.find(u => u.id === session.formateur_id) : null;

      return {
        id: session?.id || inscription.id,
        date: session?.date_debut,
        endDate: session?.date_fin,
        title: formation?.titre || 'Unknown Session',
        trainer: formateur ? `${formateur.prenom} ${formateur.nom}` : 'N/A',
        lieu: session?.lieu,
        statut: session?.statut,
        formation_id: session?.formation_id,
      };
    })
    .filter(s => s.date);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    else if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y);
  };

  const goToday = () => { setMonth(today.getMonth() + 1); setYear(today.getFullYear()); };

  const buildCells = () => {
    const first = new Date(year, month - 1, 1);
    const leading = (first.getDay() + 6) % 7;
    const days = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  // Map sessions to calendar days for current month/year
  const calendarEvents = {};
  participantSessions.forEach((s) => {
    const d = new Date(s.date);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      calendarEvents[d.getDate()] = s;
    }
  });

  const isWeekend = (day) => {
    const d = new Date(year, month - 1, day).getDay();
    return d === 0 || d === 6;
  };

  const isToday = (day) => {
    return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Completed': return 'bg-success-container text-on-success-container';
      case 'In Progress': return 'bg-tertiary-container text-on-tertiary-container';
      case 'Planned': return 'bg-secondary-container text-on-secondary-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const cells = buildCells();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end flex-col lg:flex-row gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background font-bold mb-2">
            My Schedule
          </h2>
          <p className="font-body-md text-on-surface-variant">
            View your enrolled training sessions on the calendar.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-grow w-full lg:w-3/4 min-w-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
            {/* Month nav */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant flex-wrap gap-3">
              <h3 className="font-headline-md text-on-surface">
                {MONTH_LABELS[month - 1]} {year}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant" type="button" onClick={() => changeMonth(-1)}>
                  <Icon name="chevron_left" />
                </button>
                <button className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-label-md text-on-surface" type="button" onClick={goToday}>
                  Today
                </button>
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant" type="button" onClick={() => changeMonth(1)}>
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-px bg-outline-variant/20">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center font-semibold py-2 bg-surface-container-low text-on-surface-variant text-label-sm">
                  {day}
                </div>
              ))}
              {cells.map((day, index) => {
                if (day === null) return <div key={`e-${index}`} className="min-h-[100px] bg-surface-container-lowest/50" />;
                const event = calendarEvents[day];
                return (
                  <div key={day} className={`min-h-[100px] p-2 text-label-sm text-on-surface transition-colors ${isToday(day) ? 'bg-primary/10 ring-1 ring-inset ring-primary' : isWeekend(day) ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                    <span className={`font-medium ${isToday(day) ? 'text-primary font-bold' : ''}`}>{day}</span>
                    {event && (
                      <div className="mt-1 p-1 bg-secondary-container text-on-secondary-container rounded text-xs truncate" title={event.title}>
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming sessions sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow p-5">
            <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
              <Icon name="view_week" className="text-primary" />
              My Upcoming Sessions
            </h3>
            <div className="flex flex-col gap-3">
              {participantSessions
                .filter(s => new Date(s.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((session) => (
                  <div key={session.id} className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className={`w-2 h-2 rounded-full bg-secondary mt-1 shrink-0`} />
                    </div>
                    <h4 className="font-label-md text-on-surface font-semibold truncate mt-1" title={session.title}>
                      {session.title}
                    </h4>
                    <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                      <Icon name="person" size={14} />{session.trainer}
                    </p>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(session.statut)}`}>
                        {session.statut}
                      </span>
                    </div>
                  </div>
                ))
              }
              {participantSessions.filter(s => new Date(s.date) >= new Date()).length === 0 && (
                <p className="text-body-sm text-on-surface-variant text-center py-4">No upcoming sessions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
