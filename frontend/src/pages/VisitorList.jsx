import { useEffect, useState } from "react";
import api from "../services/api";
import TopBar from "../components/TopBar";

function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors/");
      setVisitors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async (visitId) => {
    try {
      await api.put(`/visitors/checkout/${visitId}`);
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  return (
    <div className="app-shell p-8">
      <div className="max-w-6xl mx-auto">
        <TopBar title="Visitor Log" />
        <div className="glass-card p-6 overflow-x-auto">
          {loading ? (
            <p className="text-sm" style={{ color: "#64748B" }}>Loading...</p>
          ) : visitors.length === 0 ? (
            <p className="text-sm" style={{ color: "#64748B" }}>No visitors registered yet</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <tr>{["Name", "Mobile", "Purpose", "Host", "Check-In", "Check-Out", "Status", "Action"].map((h) => <th key={h} className="th-label py-2 pr-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v.visit_id} style={{ borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{v.name}</td>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{v.mobile_number}</td>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{v.purpose || "-"}</td>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{v.host_person || "-"}</td>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{new Date(v.check_in_time).toLocaleString()}</td>
                    <td className="py-2 pr-3" style={{ color: "#F1F5F9" }}>{v.check_out_time ? new Date(v.check_out_time).toLocaleString() : "-"}</td>
                    <td className="py-2 pr-3"><span className={`px-2 py-1 rounded text-xs ${v.status === "Inside" ? "status-inside" : "status-out"}`}>{v.status}</span></td>
                    <td className="py-2">
                      {v.status === "Inside" && (
                        <button onClick={() => handleCheckout(v.visit_id)} className="text-xs uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FB7185" }}>
                          Check Out
                        </button>
                      )}
                    </td>
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

export default VisitorList;