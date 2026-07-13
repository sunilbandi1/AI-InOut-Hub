import { useState } from "react";
import api from "../services/api";
import TopBar from "../components/TopBar";

function RegisterVisitor() {
  const [form, setForm] = useState({ name: "", mobile_number: "", email: "", purpose: "", department: "", host_person: "", id_type: "", id_number: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanInfo, setScanInfo] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setScanInfo(null);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/ocr/scan", formData);
      const data = res.data;
      setForm((prev) => ({ ...prev, name: data.name || prev.name, id_type: data.id_type || prev.id_type, id_number: data.id_number || prev.id_number }));
      setScanInfo({ dob: data.dob, gender: data.gender, matched: !!(data.name || data.id_number) });
    } catch (err) {
      setError(err.response?.data?.error || "ID scan failed");
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/visitors/register", form);
      setSuccess("Visitor registered and checked in successfully");
      setForm({ name: "", mobile_number: "", email: "", purpose: "", department: "", host_person: "", id_type: "", id_number: "" });
      setScanInfo(null);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="app-shell p-8">
      <div className="max-w-2xl mx-auto">
        <TopBar title="Register Visitor" />
        <div className="glass-card p-8">
          <div className="mb-6 p-4 rounded-lg" style={{ border: "1px dashed rgba(34,211,184,0.4)", backgroundColor: "rgba(34,211,184,0.05)" }}>
            <label className="field-label mb-2">Scan ID Card — auto-fills fields below</label>
            <input type="file" accept="image/png, image/jpeg" onChange={handleScan} className="text-sm" disabled={scanning} style={{ color: "#CBD5E1" }} />
            {scanning && <p className="text-sm mt-2" style={{ color: "#22D3B8" }}>Scanning ID card... this may take up to 30 seconds on first use.</p>}
            {scanInfo && !scanning && (
              <div className="text-sm mt-2" style={{ color: "#CBD5E1" }}>
                {scanInfo.matched ? (
                  <p>Detected fields filled in below.{scanInfo.dob && ` DOB: ${scanInfo.dob}.`}{scanInfo.gender && ` Gender: ${scanInfo.gender}.`} Please verify before submitting.</p>
                ) : (
                  <p style={{ color: "#FBBF24" }}>Couldn't confidently detect name/ID number — please fill manually.</p>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-sm mb-4" style={{ color: "#FB7185" }}>{error}</p>}
          {success && <p className="text-sm mb-4" style={{ color: "#34D399" }}>{success}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="field-label">Full Name *</label><input name="name" value={form.name} onChange={handleChange} className="field-input" required /></div>
            <div><label className="field-label">Mobile Number *</label><input name="mobile_number" value={form.mobile_number} onChange={handleChange} className="field-input" required /></div>
            <div><label className="field-label">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="field-input" /></div>
            <div><label className="field-label">Purpose of Visit</label><input name="purpose" value={form.purpose} onChange={handleChange} className="field-input" /></div>
            <div><label className="field-label">Department</label><input name="department" value={form.department} onChange={handleChange} className="field-input" /></div>
            <div><label className="field-label">Host Person</label><input name="host_person" value={form.host_person} onChange={handleChange} className="field-input" /></div>
            <div>
              <label className="field-label">ID Type</label>
              <select name="id_type" value={form.id_type} onChange={handleChange} className="field-select">
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Driving License">Driving License</option>
                <option value="College ID">College ID</option>
                <option value="Employee ID">Employee ID</option>
              </select>
            </div>
            <div><label className="field-label">ID Number</label><input name="id_number" value={form.id_number} onChange={handleChange} className="field-input" /></div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="btn-gradient w-full py-3">Register & Check In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterVisitor;