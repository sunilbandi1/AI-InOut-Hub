import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const ORG_TYPES = ["Hotel", "School", "College", "Hospital", "Office", "Apartment", "Lodge/Guest House", "Government Institution"];

function OrganizationSignup() {
  const [form, setForm] = useState({ organization_name: "", organization_type: "Hotel", admin_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register-organization", form);
      setSuccess("Organization created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-md overflow-hidden">
        <div style={{ height: "3px", backgroundImage: "linear-gradient(90deg, #22D3B8, #8B5CF6)" }} />
        <div className="p-8">
          <h1 className="gradient-text text-3xl mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
            Register Your Organization
          </h1>
          <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>Set up AI InOutHub for your hotel, school, hospital, or office</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded text-xs" style={{ backgroundColor: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", color: "#FB7185", fontFamily: "'JetBrains Mono', monospace" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 rounded text-xs" style={{ backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399", fontFamily: "'JetBrains Mono', monospace" }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="field-label">Organization Name</label><input name="organization_name" value={form.organization_name} onChange={handleChange} required className="field-input" /></div>
            <div>
              <label className="field-label">Organization Type</label>
              <select name="organization_type" value={form.organization_type} onChange={handleChange} className="field-select">
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="field-label">Your Name (becomes Admin)</label><input name="admin_name" value={form.admin_name} onChange={handleChange} required className="field-input" /></div>
            <div><label className="field-label">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required className="field-input" /></div>
            <div><label className="field-label">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required className="field-input" /></div>
            <button type="submit" className="btn-gradient w-full py-3">Create Organization</button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#64748B" }}>
            Already registered? <Link to="/login" className="underline" style={{ color: "#22D3B8" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSignup;