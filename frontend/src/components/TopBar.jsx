import { useNavigate } from "react-router-dom";
import { getCurrentUser, hasRole, logout } from "../utils/auth";

function TopBar({ title }) {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mb-10">
      <div className="flex justify-end items-center gap-3 flex-wrap mb-6">
        {hasRole("receptionist", "guard") && (
          <button className="btn-outline" onClick={() => navigate("/register-visitor")}>Register Visitor</button>
        )}
        <button className="btn-outline" onClick={() => navigate("/visitors")}>Visitors</button>
        {hasRole("admin") && (
          <button className="btn-outline" onClick={() => navigate("/user-management")}>Manage Staff</button>
        )}
        <button className="btn-outline" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={handleLogout} className="text-xs uppercase tracking-widest px-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FB7185" }}>
          Logout
        </button>
      </div>

      <div className="text-center mb-6">
        <h1
          className="gradient-text leading-none mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "48px" }}
        >
          {user?.organization_name || "AI InOutHub"}
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="role-pill">{user?.role}</span>
          <span className="text-sm" style={{ color: "#64748B" }}>Welcome, {user?.name}</span>
        </div>
      </div>

      <div className="text-center">
        <h2
          className="text-lg uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8" }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

export default TopBar;