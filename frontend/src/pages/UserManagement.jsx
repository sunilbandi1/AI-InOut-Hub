import { useState } from "react";
import api from "../services/api";
import TopBar from "../components/TopBar";

function UserManagement() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "receptionist" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", form);
      setSuccess(`User "${form.name}" created successfully as ${form.role}`);
      setForm({ name: "", email: "", password: "", role: "receptionist" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  };

  return (
    <div className="app-shell p-8">
      <div className="max-w-lg mx-auto">
        <TopBar title="Create Staff Account" />
        <div className="glass-card p-8">
          {error && <p className="text-sm mb-4" style={{ color: "#FB7185" }}>{error}</p>}
          {success && <p className="text-sm mb-4" style={{ color: "#34D399" }}>{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="field-label">Full Name</label><input name="name" value={form.name} onChange={handleChange} className="field-input" required /></div>
            <div><label className="field-label">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="field-input" required /></div>
            <div><label className="field-label">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} className="field-input" required /></div>
            <div>
              <label className="field-label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="field-select">
                <option value="receptionist">Receptionist</option>
                <option value="guard">Security Guard</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-gradient w-full py-3">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;