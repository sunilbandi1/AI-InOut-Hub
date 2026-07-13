import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { key: "admin", label: "Admin" },
  { key: "receptionist", label: "Receptionist" },
  { key: "guard", label: "Security" },
];

function Login() {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const loggedInRole = res.data.user.role;

      if (loggedInRole !== selectedRole) {
        const label = ROLES.find((r) => r.key === loggedInRole)?.label || loggedInRole;
        setError(`This account is registered as ${label}. Select the correct tab.`);
        return;
      }

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Access denied — check your credentials");
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4">
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: floatIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <div className="login-card glass-card w-full max-w-sm overflow-hidden">
        <div style={{ height: "3px", backgroundImage: "linear-gradient(90deg, #22D3B8, #8B5CF6)" }} />

        <div className="p-8">
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#64748B" }}>
            Visitor Access System
          </span>
          <h1 className="gradient-text text-4xl leading-none mt-2 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
            AI InOutHub
          </h1>
          <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>Select your access level to sign in</p>

          <div className="flex rounded-lg overflow-hidden mb-6" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => { setSelectedRole(r.key); setError(""); }}
                className="flex-1 text-[11px] uppercase tracking-wide py-2.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundImage: selectedRole === r.key ? "linear-gradient(135deg, #22D3B8, #8B5CF6)" : "none",
                  color: selectedRole === r.key ? "#06070B" : "#94A3B8",
                  fontWeight: selectedRole === r.key ? 600 : 400,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 px-3 py-2 rounded text-xs" style={{ backgroundColor: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", color: "#FB7185", fontFamily: "'JetBrains Mono', monospace" }}>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="field-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourorg.com" required className="field-input" />
            </div>

            <div className="mb-6">
              <label className="field-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="field-input" />
            </div>

            <button type="submit" className="btn-gradient w-full py-3">
              Sign in as {ROLES.find((r) => r.key === selectedRole)?.label}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#64748B" }}>
            New organization? <a href="/signup" className="underline" style={{ color: "#22D3B8" }}>Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;