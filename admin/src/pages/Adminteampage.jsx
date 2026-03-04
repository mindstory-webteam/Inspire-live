import { useEffect, useRef, useState } from "react";

// ✅ Vite uses import.meta.env — NOT process.env
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── helpers ──────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  // ✅ Match the key your login saves — adminToken OR token
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  return { Authorization: `Bearer ${token}` };
}

function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  return API_BASE.replace("/api", "") + src;
}

const EMPTY_FORM = {
  name: "", desig: "", email: "",
  facebook: "", instagram: "", twitter: "", linkedin: "",
  order: 0, isActive: true, img: "",
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function AdminTeamPage() {
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [preview,  setPreview]  = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  // Auto-dismiss success
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3500);
    return () => clearTimeout(t);
  }, [success]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/admin/team`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setMembers(data.data || []);
    } catch (e) {
      setError(e.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setError(""); setSuccess("");
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditId(m._id);
    setForm({
      name:      m.name      || "",
      desig:     m.desig     || "",
      email:     m.email     || "",
      facebook:  m.facebook  || "",
      instagram: m.instagram || "",
      twitter:   m.twitter   || "",
      linkedin:  m.linkedin  || "",
      order:     m.order     ?? 0,
      isActive:  m.isActive  ?? true,
      img:       m.img       || "",
    });
    setPreview(resolveImage(m.img));
    if (fileRef.current) fileRef.current.value = "";
    setError(""); setSuccess("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");

    const fd = new FormData();
    // Append all form fields EXCEPT img (img is sent via file input)
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "img") fd.append(k, v);
    });
    if (fileRef.current?.files[0]) fd.append("img", fileRef.current.files[0]);

    try {
      const url    = editId ? `${API_BASE}/admin/team/${editId}` : `${API_BASE}/admin/team`;
      const method = editId ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: getAuthHeaders(), body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");
      setSuccess(editId ? "Member updated!" : "Member created!");
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res  = await fetch(`${API_BASE}/admin/team/${deleteId}`, {
        method: "DELETE", headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSuccess("Member deleted.");
      setDeleteId(null);
      fetchMembers();
    } catch (err) {
      setError(err.message);
      setDeleteId(null);
    }
  };

  // ── Toggle ────────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/team/${id}/toggle`, {
        method: "PATCH", headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      fetchMembers();
    } catch (e) {
      setError(e.message || "Toggle failed.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.topBar}>
        <div>
          <h1 style={s.pageTitle}>Team Members</h1>
          <p style={s.pageSubtitle}>{members.length} member{members.length !== 1 ? "s" : ""}</p>
        </div>
        <button style={s.btnPrimary} onClick={openCreate}>+ Add Member</button>
      </div>

      {/* ── Alerts ── */}
      {error   && (
        <div style={s.alertErr}>
          <span>{error}</span>
          <button style={s.closeBtn} onClick={() => setError("")}>×</button>
        </div>
      )}
      {success && (
        <div style={s.alertOk}>
          <span>{success}</span>
          <button style={s.closeBtn} onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div style={s.center}><div style={s.spinner} /></div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                {["Photo","Name","Designation","Order","Status","Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 48, color: "#a9b8b8" }}>
                    No team members yet. Click "+ Add Member" to create one.
                  </td>
                </tr>
              )}
              {members.map((m) => (
                <tr key={m._id} style={s.tr}>
                  {/* Photo */}
                  <td style={s.td}>
                    <img
                      src={resolveImage(m.img) || "https://ui-avatars.com/api/?name=" + encodeURIComponent(m.name)}
                      alt={m.name}
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1a598a&color=fff`; }}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #ecf0f0" }}
                    />
                  </td>
                  {/* Name */}
                  <td style={s.td}>
                    <strong style={{ color: "#0c1e21" }}>{m.name}</strong>
                    {m.email && <div style={{ fontSize: 12, color: "#a9b8b8", marginTop: 2 }}>{m.email}</div>}
                  </td>
                  {/* Designation */}
                  <td style={s.td}>{m.desig}</td>
                  {/* Order */}
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>{m.order}</span>
                  </td>
                  {/* Status */}
                  <td style={s.td}>
                    <span
                      onClick={() => handleToggle(m._id)}
                      title="Click to toggle"
                      style={{
                        display: "inline-block", padding: "3px 12px", borderRadius: 20,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: m.isActive ? "#d1fae5" : "#fee2e2",
                        color:      m.isActive ? "#065f46" : "#991b1b",
                      }}
                    >
                      {m.isActive ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={s.td}>
                    <button style={s.btnEdit}   onClick={() => openEdit(m)}>Edit</button>
                    <button style={s.btnDelete} onClick={() => setDeleteId(m._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={{ margin: 0, fontSize: 20, color: "#0c1e21" }}>
                {editId ? "Edit Member" : "Add New Member"}
              </h2>
              <button style={s.closeBtn2} onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Photo upload */}
              <div style={s.photoUpload}>
                <img
                  src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "Team")}&background=1a598a&color=fff`}
                  alt="preview"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=Team&background=1a598a&color=fff`; }}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #1a598a", flexShrink: 0 }}
                />
                <div>
                  <label style={s.uploadLabel}>
                    {preview ? "Change Photo" : "Upload Photo"}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
                  </label>
                  <p style={{ fontSize: 12, color: "#a9b8b8", marginTop: 6 }}>JPG, PNG, WEBP · max 5 MB</p>
                </div>
              </div>

              {/* Error inside modal */}
              {error && (
                <div style={{ ...s.alertErr, marginBottom: 16 }}>
                  <span>{error}</span>
                  <button style={s.closeBtn} onClick={() => setError("")}>×</button>
                </div>
              )}

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Full Name *</label>
                  <input style={s.input} name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Smith" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Designation *</label>
                  <input style={s.input} name="desig" value={form.desig} onChange={handleChange} required placeholder="e.g. Senior Developer" />
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Email</label>
                  <input style={s.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Display Order</label>
                  <input style={s.input} name="order" type="number" value={form.order} onChange={handleChange} min={0} />
                </div>
              </div>

              <p style={{ fontWeight: 600, fontSize: 13, color: "#67787a", marginBottom: 8, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Social Links</p>
              <div style={s.grid2}>
                {["facebook","instagram","twitter","linkedin"].map((soc) => (
                  <div key={soc} style={s.field}>
                    <label style={s.label}>{soc.charAt(0).toUpperCase() + soc.slice(1)}</label>
                    <input style={s.input} name={soc} value={form[soc]} onChange={handleChange} placeholder={`https://${soc}.com/...`} />
                  </div>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                <span style={{ fontSize: 14, color: "#374151" }}>Visible on website</span>
              </label>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid #ecf0f0", paddingTop: 20 }}>
                <button type="button" style={s.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" style={{ ...s.btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Saving…" : editId ? "Update Member" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: 420 }}>
            <h2 style={{ marginTop: 0, fontSize: 20, color: "#0c1e21" }}>Delete Team Member?</h2>
            <p style={{ color: "#67787a" }}>This action cannot be undone. The member and their photo will be permanently removed.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button style={s.btnSecondary} onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                style={{ background: "#be123c", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:        { padding: "32px", fontFamily: "'Inter', sans-serif", maxWidth: 1100, margin: "0 auto" },
  topBar:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  pageTitle:   { margin: 0, fontSize: 26, fontWeight: 700, color: "#0c1e21" },
  pageSubtitle:{ margin: "4px 0 0", color: "#67787a", fontSize: 14 },
  btnPrimary:  { background: "linear-gradient(135deg,#1a598a,#015599)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  btnSecondary:{ background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 22px", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  btnEdit:     { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, marginRight: 6, fontWeight: 500 },
  btnDelete:   { background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500 },
  alertErr:    { background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  alertOk:     { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  closeBtn:    { background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1, flexShrink: 0 },
  tableWrap:   { overflowX: "auto", borderRadius: 12, border: "1px solid #ecf0f0" },
  table:       { width: "100%", borderCollapse: "collapse", background: "#fff" },
  thead:       { background: "#f8fafb" },
  th:          { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#67787a", borderBottom: "1px solid #ecf0f0", textTransform: "uppercase", letterSpacing: "0.05em" },
  tr:          { borderBottom: "1px solid #f1f5f9" },
  td:          { padding: "12px 16px", fontSize: 14, color: "#374151", verticalAlign: "middle" },
  center:      { display: "flex", justifyContent: "center", padding: 60 },
  spinner:     { width: 36, height: 36, border: "3px solid #ecf0f0", borderTopColor: "#1a598a", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 },
  modal:       { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 700, maxHeight: "92vh", overflowY: "auto", padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #ecf0f0" },
  closeBtn2:   { background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#a9b8b8", lineHeight: 1 },
  photoUpload: { display: "flex", alignItems: "center", gap: 20, marginBottom: 20, padding: 16, background: "#f8fafb", borderRadius: 10, border: "1px solid #ecf0f0" },
  uploadLabel: { display: "inline-block", background: "linear-gradient(135deg,#1a598a,#015599)", color: "#fff", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  grid2:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field:       { display: "flex", flexDirection: "column", gap: 5 },
  label:       { fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em" },
  input:       { padding: "9px 13px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", color: "#0c1e21" },
};