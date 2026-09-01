import api from '../config/api';

class DashboardService {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    return { success: true, data: data.stats };
  }

  async getUpcomingSessions() {
    const { data } = await api.get('/dashboard/upcoming-sessions');
    return { success: true, data: data.sessions || [] };
  }

  async getActivity() {
    const { data } = await api.get('/dashboard/activity');
    return { success: true, data: data.activities || [] };
  }

  async getChartData() {
    const { data } = await api.get('/dashboard/charts');
    return { success: true, data: data.chartData };
  }
}

export default new DashboardService();
