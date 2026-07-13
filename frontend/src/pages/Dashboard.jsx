import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import api from "../services/api";
import TopBar from "../components/TopBar";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      api.get("/dashboard/stats").then((res) => setStats(res.data)).catch((err) => console.error(err)).finally(() => setLoading(false));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="app-shell p-8"><p style={{ color: "#64748B" }}>Loading dashboard...</p></div>;
  }

  const trendData = {
    labels: stats.trend.map((t) => new Date(t.date).toLocaleDateString("en-US", { weekday: "short" })),
    datasets: [{
      label: "Visitors", data: stats.trend.map((t) => t.count),
      borderColor: "#22D3B8", backgroundColor: "rgba(34,211,184,0.12)",
      tension: 0.4, fill: true, pointBackgroundColor: "#22D3B8",
    }],
  };

  const deptData = {
    labels: stats.department_breakdown.map((d) => d.department),
    datasets: [{ label: "Visits", data: stats.department_breakdown.map((d) => d.count), backgroundColor: "#8B5CF6", borderRadius: 6 }],
  };

  const gridOptions = { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94A3B8" } };
  const chartOptions = { plugins: { legend: { display: false } }, scales: { x: gridOptions, y: gridOptions } };

  return (
    <div className="app-shell p-8">
      <div className="max-w-6xl mx-auto">
        <TopBar title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Visitors Today" value={stats.visitors_today} />
          <StatCard label="Currently Inside" value={stats.visitors_inside} accent />
          <StatCard label="Total Visitors" value={stats.total_visitors} />
          <StatCard label="Total Visits" value={stats.total_visits} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6">
            <h2 className="field-label mb-4">Visitor Trend — Last 7 Days</h2>
            <Line data={trendData} options={chartOptions} />
          </div>
          <div className="glass-card p-6">
            <h2 className="field-label mb-4">Department-wise Visits</h2>
            {stats.department_breakdown.length === 0 ? (
              <p className="text-sm" style={{ color: "#64748B" }}>No department data yet</p>
            ) : (
              <Bar data={deptData} options={chartOptions} />
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="field-label mb-4">Recent Visitors</h2>
          {stats.recent_visitors.length === 0 ? (
            <p className="text-sm" style={{ color: "#64748B" }}>No visitors yet</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <tr>{["Name", "Purpose", "Check-In", "Status"].map((h) => <th key={h} className="th-label py-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {stats.recent_visitors.map((v, i) => (
                  <tr key={i} style={{ borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                    <td className="py-2" style={{ color: "#F1F5F9" }}>{v.name}</td>
                    <td className="py-2" style={{ color: "#F1F5F9" }}>{v.purpose || "-"}</td>
                    <td className="py-2" style={{ color: "#F1F5F9" }}>{new Date(v.check_in_time).toLocaleString()}</td>
                    <td className="py-2"><span className={`px-2 py-1 rounded text-xs ${v.status === "Inside" ? "status-inside" : "status-out"}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="glass-card p-5">
      <p className={accent ? "gradient-text text-3xl mb-1" : "text-3xl mb-1"} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: accent ? undefined : "#F1F5F9" }}>
        {value}
      </p>
      <p className="field-label">{label}</p>
    </div>
  );
}

export default Dashboard;