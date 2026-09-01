import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import dashboardService from '../../services/dashboard/dashboardService';
import authService from '../../services/auth/authService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const ACTIVITY_STYLES = {
  inscription: 'bg-primary-container text-on-primary',
  completed: 'bg-[#198754] text-white',
  reminder: 'bg-[#ffc107] text-[#664d03]'
};

const ACTIVITY_ICONS = {
  inscription: 'how_to_reg',
  completed: 'task_alt',
  reminder: 'notifications_active'
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#151c22',
      titleFont: { size: 14, family: 'Work Sans' },
      bodyFont: { size: 14, family: 'Work Sans' },
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#E9ECEF', drawBorder: false },
      ticks: { font: { size: 12 } }
    },
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { font: { size: 12 } }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, padding: 20, font: { size: 12, family: 'Work Sans' } }
    },
    tooltip: {
      backgroundColor: '#151c22',
      titleFont: { size: 14, family: 'Work Sans' },
      bodyFont: { size: 14, family: 'Work Sans' },
      padding: 12,
      cornerRadius: 8
    }
  }
};

export default function Dashboard() {
  const currentUser = authService.getCurrentUser();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes, activityRes, chartsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getUpcomingSessions(),
          dashboardService.getActivity(),
          dashboardService.getChartData(),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (sessionsRes.success) setSessions(sessionsRes.data);
        if (activityRes.success) setActivities(activityRes.data);
        if (chartsRes.success) setChartData(chartsRes.data);
      } catch {
        // API not available — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = stats
    ? [
        { label: 'Formations actives', icon: 'school', value: String(stats.activeFormations), badge: `${stats.totalFormations} total`, trend: true },
        { label: 'Participants', icon: 'group', value: String(stats.totalParticipants), badge: 'actifs', trend: true },
        { label: 'Sessions planifiées', icon: 'event', value: String(stats.plannedSessions), badge: `${stats.totalSessions} total`, trend: false },
        { label: 'Taux satisfaction', icon: 'sentiment_satisfied', value: `${stats.satisfactionRate}%`, badge: `${stats.totalPresences} présences`, trend: true },
      ]
    : [];

  const lineData = chartData
    ? {
        labels: chartData.participantsTrend.labels,
        datasets: [
          {
            label: 'Participants',
            data: chartData.participantsTrend.values,
            borderColor: '#0056b3',
            backgroundColor: 'rgba(0, 86, 179, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#0056b3',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#0056b3',
            fill: true,
            tension: 0.4
          }
        ]
      }
    : null;

  const doughnutData = chartData
    ? {
        labels: chartData.categoryBreakdown.labels,
        datasets: [
          {
            data: chartData.categoryBreakdown.values,
            backgroundColor: ['#0056b3', '#3a5f94', '#9fc2fe', '#c2c6d4'],
            borderWidth: 0,
            hoverOffset: 4
          }
        ]
      }
    : null;

  return (
    <div className="flex flex-col gap-8 md:gap-[64px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-headline-lg-mobile md:text-display-lg text-primary-container m-0">
            Tableau de Bord
          </h1>
          <p className="text-body-lg text-on-surface-variant m-0">
            Bonjour {currentUser?.prenom || ''}, bienvenue sur la plateforme de gestion des formations
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" icon="menu_book">
            Voir le catalogue
          </Button>
          <Button icon="add">Planifier une formation</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 bg-surface-container-lowest rounded-xl p-6 border border-[#E9ECEF] shadow-ambient-sm animate-pulse">
                <div className="h-4 bg-surface-container rounded w-24" />
                <div className="h-8 bg-surface-container rounded w-16" />
              </div>
            ))
          : kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-2 bg-surface-container-lowest rounded-xl p-6 border border-[#E9ECEF] shadow-ambient-sm"
          >
            <div className="flex justify-between items-center text-on-surface-variant mb-2">
              <span className="text-label-md">{kpi.label}</span>
              <Icon name={kpi.icon} className="text-primary-container" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-headline-lg text-on-background">{kpi.value}</span>
              <span
                className={`text-label-sm ${
                  kpi.trend
                    ? 'text-[#198754] bg-[#d1e7dd]'
                    : 'text-on-surface-variant bg-surface-container'
                } px-2 py-0.5 rounded-full flex items-center gap-1`}
              >
                {kpi.trend && <Icon name="trending_up" size={14} />} {kpi.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <Card className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md text-on-background m-0">Prochaines Sessions</h2>
              <button className="text-primary-container text-label-md hover:underline cursor-pointer">
                Voir tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant text-label-md">
                    <th className="py-3 px-4 font-medium">Formation</th>
                    <th className="py-3 px-4 font-medium">Formateur</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Participants</th>
                    <th className="py-3 px-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-body-md">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-on-background">
                        {session.formation}
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant">{session.formateur}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{new Date(session.dateDebut).toLocaleDateString('fr-TN')}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{session.participants}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={session.statut} />
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr>
                      <td className="py-4 px-4 text-on-surface-variant text-center" colSpan={5}>
                        Aucune session planifiée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6 flex flex-col">
            <h2 className="text-headline-md text-on-background m-0 mb-6">Activité Récente</h2>
            <ul className="flex flex-col gap-4">
              {activities.map((activity) => (
                <li key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`${ACTIVITY_STYLES[activity.type] || 'bg-surface-container text-on-surface-variant'} p-2 rounded-full`}
                  >
                    <Icon name={ACTIVITY_ICONS[activity.type] || 'info'} size={20} />
                  </div>
                  <div>
                    <p className="text-body-md text-on-background m-0">{activity.text}</p>
                    <span className="text-label-sm text-on-surface-variant">
                      {new Date(activity.date).toLocaleDateString('fr-TN')}
                    </span>
                  </div>
                </li>
              ))}
              {activities.length === 0 && (
                <li className="text-on-surface-variant text-body-md text-center py-4">
                  Aucune activité récente.
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <Card className="p-6 flex flex-col h-[350px]">
            <h2 className="text-label-md font-bold text-on-background m-0 mb-4">
              Évolution des Participants
            </h2>
            <div className="flex-1 relative w-full h-full">
              {lineData ? (
                <Line data={lineData} options={lineOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-on-surface-variant">
                  {loading ? 'Chargement...' : 'Aucune donnée disponible'}
                </div>
              )}
            </div>
          </Card>
          <Card className="p-6 flex flex-col h-[350px]">
            <h2 className="text-label-md font-bold text-on-background m-0 mb-4">
              Répartition par Catégorie
            </h2>
            <div className="flex-1 relative w-full h-full pb-4">
              {doughnutData ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-on-surface-variant">
                  {loading ? 'Chargement...' : 'Aucune donnée disponible'}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}