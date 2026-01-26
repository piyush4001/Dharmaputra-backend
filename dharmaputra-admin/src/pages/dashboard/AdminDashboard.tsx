import { useEffect, useState } from "react";
import StatsCards from "./StatsCards";
import RecentSOS from "../../components/dashboard/RecentSOS";
import ChartsSection from "./ChartsSection";
import {
  fetchDashboardStatsAPI,
  fetchRecentSOSAPI,
  fetchDashboardChartsAPI,
} from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentSOS, setRecentSOS] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ async function INSIDE useEffect
    const loadDashboard = async () => {
      try {
        const [statsData, sosData, chartData] = await Promise.all([
          fetchDashboardStatsAPI(),
          fetchRecentSOSAPI(),
          fetchDashboardChartsAPI(),
        ]);

        setStats(statsData);
        setRecentSOS(sosData);
        setCharts(chartData);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard(); // ✅ call it
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {stats && (
        <StatsCards
          totalUsers={stats.totalUsers}
          totalSeniors={stats.totalSeniors}
          activeHelpers={stats.activeHelpers}
          sosLast24h={stats.sosLast24h}
          totalSOS={stats.totalSOS}
        />
      )}
      <RecentSOS sos={recentSOS} />
      {charts && (
        <ChartsSection
          sosTrend={charts.sosTrend}
          userGrowth={charts.userGrowth}
        />
      )}
    </div>
  );
}
