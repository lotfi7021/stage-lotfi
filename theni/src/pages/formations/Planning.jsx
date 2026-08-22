import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS } from '../../data/mock';
import api from '../../services/config/api';

const MONTH_LABELS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const WEEKDAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const trainerName = (formateur) =>
  formateur ? `${formateur.prenom} ${formateur.nom}` : 'N/A';

export default function Planning() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessions, setSessions] = useState(() =>
    SESSIONS.map((s) => {
      const formation = FORMATIONS.find((f) => f.id === s.formation_id);
      return {
        id: s.id,
        date: s.date_debut,
        title: formation ? formation.titre : 'N/A',
        trainer: 'N/A',
        dot: 'bg-primary',
        formation_id: s.formation_id,
        formateur_id: s.formateur_id,
      };
    })
  );
  const [form, setForm] = useState({ title: '', trainer_id: '', date: '' });
  const [formateurs, setFormateurs] = useState([]);

  // Charger les vrais formateurs depuis l'API
  const fetchFormateurs = useCallback(async () => {
    try {
      const { data } = await api.get('/formateurs');
      setFormateurs(data.formateurs || []);
    } catch (err) {
      console.error('Erreur lors du chargement des formateurs:', err);
    }
  }, []);

  useEffect(() => {
    fetchFormateurs();
  }, [fetchFormateurs]);

  // Enrichir les sessions avec le nom réel du formateur
  useEffect(() => {
    if (!formateurs.length) return;
    setSessions((prev) =>
      prev.map((s) => {
        const formateur = formateurs.find((f) => f.id === s.formateur_id);
        return { ...s, trainer: trainerName(formateur) };
      })
    );
  }, [formateurs]);

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
  const calendarEvents = useMemo(() => {
    const events = {};
    sessions.forEach((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        events[d.getDate()] = s;
      }
    });
    return events;
  }, [sessions, year, month]);

  const isWeekend = (day) => {
    const d = new Date(year, month - 1, day).getDay();
    return d === 0 || d === 6;
  };

  const isToday = (day) => {
    return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const selectedTrainer = formateurs.find(f => f.id === parseInt(form.trainer_id));

    setSessions((prev) => [...prev, {
      id: Date.now(),
      date: form.date || new Date().toISOString().split('T')[0],
      title: form.title,
      trainer: trainerName(selectedTrainer),
      dot: 'bg-secondary',
    }]);
    setForm({ title: '', trainer_id: '', date: '' });
    setModalOpen(false);
  };

  const cells = buildCells();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end flex-col lg:flex-row gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background font-bold mb-2">
            Session Planning
          </h2>
          <p className="font-body-md text-on-surface-variant">
            View and manage the STEG training session calendar.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-on-primary rounded-xl font-label-md hover:bg-[#004494] transition-colors shadow-sm"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="add" />
          New Session
        </button>
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
                      <div className="mt-1 p-1 bg-primary-container text-on-primary rounded text-xs truncate" title={event.title}>
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
              Upcoming Sessions
            </h3>
            <div className="flex flex-col gap-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{session.date}</span>
                    <span className={`w-2 h-2 rounded-full ${session.dot} mt-1 shrink-0`} />
                  </div>
                  <h4 className="font-label-md text-on-surface font-semibold truncate mt-1" title={session.title}>{session.title}</h4>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <Icon name="person" size={14} />{session.trainer}
                  </p>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-body-sm text-on-surface-variant text-center py-4">No sessions scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Session Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-background">New Session</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Session Title <span className="text-error">*</span></label>
                <input
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="text" placeholder="e.g. Electrical Safety BR"
                  value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Trainer</label>
                <select
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  value={form.trainer_id}
                  onChange={(e) => setForm((f) => ({ ...f, trainer_id: e.target.value }))}
                >
                  <option value="">Select a trainer</option>
                  {formateurs.map((formateur) => (
                    <option key={formateur.id} value={formateur.id}>
                      {trainerName(formateur)} - {formateur.specialite || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Date</label>
                <input
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2">
                  <Icon name="add" /> Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}