import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000/api/admin/careers";

// ─── API helpers ──────────────────────────────────────────────────────────────
const api = {
  get: (url) => fetch(url).then((r) => r.json()),
  post: (url, data) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  put: (url, data) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  del: (url) => fetch(url, { method: "DELETE" }).then((r) => r.json()),
  patch: (url, data) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const Badge = ({ active }) => (
  <span
    style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      background: active ? "#dcfce7" : "#fee2e2",
      color: active ? "#16a34a" : "#dc2626",
    }}
  >
    {active ? "ACTIVE" : "INACTIVE"}
  </span>
);

// ─── Application Status Badge ─────────────────────────────────────────────────
const AppBadge = ({ status }) => {
  const map = {
    pending: ["#fef3c7", "#b45309"],
    reviewed: ["#dbeafe", "#1d4ed8"],
    shortlisted: ["#dcfce7", "#16a34a"],
    rejected: ["#fee2e2", "#dc2626"],
  };
  const [bg, color] = map[status] || ["#f3f4f6", "#374151"];
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: bg,
        color,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {status}
    </span>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div
    style={{
      position: "fixed",
      bottom: 28,
      right: 28,
      background: type === "error" ? "#dc2626" : "#16a34a",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      zIndex: 9999,
      boxShadow: "0 8px 30px rgba(0,0,0,.2)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      maxWidth: 360,
    }}
  >
    <span>{type === "error" ? "✕" : "✓"}</span>
    {msg}
    <button
      onClick={onClose}
      style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 8 }}
    >
      ✕
    </button>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,.6)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        maxWidth: wide ? 860 : 640,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          padding: "20px 28px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{title}</h2>
        <button
          onClick={onClose}
          style={{
            background: "#f1f5f9",
            border: "none",
            borderRadius: 8,
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: 28 }}>{children}</div>
    </div>
  </div>
);

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, required, children, half }) => (
  <div style={{ gridColumn: half ? "span 1" : "span 2", marginBottom: 4 }}>
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#374151",
        marginBottom: 6,
      }}
    >
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 14,
  color: "#0f172a",
  background: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .15s",
};

// ─── Career Form ──────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  category: "",
  need: "Full Time",
  location: "",
  iconName: "tji-manage",
  description: "",
  requirements: "",
  requirementsList: [""],
  responsibilities: "",
  responsibilitiesList: [""],
  jobNumber: "",
  company: "",
  website: "",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "month",
  vacancy: 1,
  applyDeadline: "",
  tags: "",
  isActive: true,
};

const CareerForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags || "",
          applyDeadline: initial.applyDeadline
            ? new Date(initial.applyDeadline).toISOString().split("T")[0]
            : "",
          requirementsList: initial.requirementsList?.length
            ? initial.requirementsList
            : [""],
          responsibilitiesList: initial.responsibilitiesList?.length
            ? initial.responsibilitiesList
            : [""],
        }
      : EMPTY_FORM
  );

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const listChange = (key, idx, val) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].map((item, i) => (i === idx ? val : item)),
    }));

  const addListItem = (key) => setForm((p) => ({ ...p, [key]: [...p[key], ""] }));
  const removeListItem = (key, idx) =>
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      requirementsList: form.requirementsList.filter(Boolean),
      responsibilitiesList: form.responsibilitiesList.filter(Boolean),
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      vacancy: Number(form.vacancy),
    };
    onSubmit(payload);
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 20px",
  };

  const ListEditor = ({ label, fieldKey }) => (
    <Field label={label}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {form[fieldKey].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={item}
              onChange={(e) => listChange(fieldKey, i, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeListItem(fieldKey, i)}
              style={{
                padding: "0 12px",
                background: "#fee2e2",
                border: "none",
                borderRadius: 8,
                color: "#dc2626",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(fieldKey)}
          style={{
            padding: "7px 14px",
            background: "#eff6ff",
            border: "1.5px dashed #93c5fd",
            borderRadius: 8,
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          + Add Item
        </button>
      </div>
    </Field>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={gridStyle}>
        <Field label="Job Title" required>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </Field>
        <Field label="Category" required half>
          <input
            style={inputStyle}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          />
        </Field>
        <Field label="Employment Type" half>
          <select
            style={inputStyle}
            value={form.need}
            onChange={(e) => set("need", e.target.value)}
          >
            {["Full Time", "Part Time", "Contract", "Internship", "Remote"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Location" required half>
          <input
            style={inputStyle}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            required
          />
        </Field>
        <Field label="Icon Class" half>
          <input
            style={inputStyle}
            value={form.iconName}
            onChange={(e) => set("iconName", e.target.value)}
            placeholder="tji-manage"
          />
        </Field>
        <Field label="Job Description" required>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </Field>
        <Field label="Requirements Intro Text">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            value={form.requirements}
            onChange={(e) => set("requirements", e.target.value)}
          />
        </Field>
        <ListEditor label="Requirements List" fieldKey="requirementsList" />
        <Field label="Responsibilities Intro Text">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            value={form.responsibilities}
            onChange={(e) => set("responsibilities", e.target.value)}
          />
        </Field>
        <ListEditor label="Responsibilities List" fieldKey="responsibilitiesList" />

        <div
          style={{
            gridColumn: "span 2",
            borderTop: "1px solid #e2e8f0",
            paddingTop: 16,
            marginTop: 4,
          }}
        >
          <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>
            Job Information Sidebar
          </p>
          <div style={gridStyle}>
            <Field label="Job Number" half>
              <input style={inputStyle} value={form.jobNumber} onChange={(e) => set("jobNumber", e.target.value)} />
            </Field>
            <Field label="Company" half>
              <input style={inputStyle} value={form.company} onChange={(e) => set("company", e.target.value)} />
            </Field>
            <Field label="Website" half>
              <input style={inputStyle} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="www.example.com" />
            </Field>
            <Field label="Vacancy" half>
              <input type="number" style={inputStyle} value={form.vacancy} min={1} onChange={(e) => set("vacancy", e.target.value)} />
            </Field>
            <Field label="Salary Min ($)" half>
              <input type="number" style={inputStyle} value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
            </Field>
            <Field label="Salary Max ($)" half>
              <input type="number" style={inputStyle} value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
            </Field>
            <Field label="Salary Period" half>
              <select style={inputStyle} value={form.salaryPeriod} onChange={(e) => set("salaryPeriod", e.target.value)}>
                {["hour", "day", "week", "month", "year"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Apply Deadline" half>
              <input type="date" style={inputStyle} value={form.applyDeadline} onChange={(e) => set("applyDeadline", e.target.value)} />
            </Field>
            <Field label="Tags (comma separated)">
              <input style={inputStyle} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Business, Consulting, Design" />
            </Field>
            <Field label="Status" half>
              <select
                style={inputStyle}
                value={form.isActive ? "true" : "false"}
                onChange={(e) => set("isActive", e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 24px",
            background: loading ? "#93c5fd" : "#2563eb",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background .15s",
          }}
        >
          {loading ? "Saving…" : initial ? "Save Changes" : "Create Career"}
        </button>
      </div>
    </form>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const Confirm = ({ msg, onConfirm, onCancel }) => (
  <Modal title="Confirm" onClose={onCancel}>
    <p style={{ color: "#374151", marginTop: 0 }}>{msg}</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
      <button
        onClick={onCancel}
        style={{ padding: "9px 18px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        style={{ padding: "9px 18px", background: "#dc2626", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 700 }}
      >
        Delete
      </button>
    </div>
  </Modal>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export default function CareersAdmin() {
  const [careers, setCareers] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const [modal, setModal] = useState(null); // null | "create" | "edit" | "apps"
  const [selected, setSelected] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsTitle, setAppsTitle] = useState("");

  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStats = useCallback(async () => {
    const res = await api.get(`${API_BASE}/stats`);
    if (res.success) setStats(res.data);
  }, []);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    let url = `${API_BASE}?page=${page}&limit=10`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (filterActive !== "all") url += `&isActive=${filterActive}`;
    const res = await api.get(url);
    setLoading(false);
    if (res.success) {
      setCareers(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    }
  }, [page, search, filterActive]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    const res = await api.post(API_BASE, data);
    setFormLoading(false);
    if (res.success) {
      showToast("Career created successfully");
      setModal(null);
      loadCareers();
      loadStats();
    } else {
      showToast(res.message || "Failed to create", "error");
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    const res = await api.put(`${API_BASE}/${selected._id}`, data);
    setFormLoading(false);
    if (res.success) {
      showToast("Career updated successfully");
      setModal(null);
      setSelected(null);
      loadCareers();
    } else {
      showToast(res.message || "Failed to update", "error");
    }
  };

  const handleDelete = async (id) => {
    const res = await api.del(`${API_BASE}/${id}`);
    setConfirm(null);
    if (res.success) {
      showToast("Career deleted");
      loadCareers();
      loadStats();
    } else {
      showToast(res.message || "Failed to delete", "error");
    }
  };

  const handleToggle = async (id) => {
    const res = await api.patch(`${API_BASE}/${id}/toggle`, {});
    if (res.success) {
      showToast(`Career ${res.data.isActive ? "activated" : "deactivated"}`);
      loadCareers();
      loadStats();
    }
  };

  const openApplications = async (career) => {
    const res = await api.get(`${API_BASE}/${career._id}/applications`);
    if (res.success) {
      setApplications(res.data);
      setAppsTitle(res.jobTitle);
      setModal("apps");
    }
  };

  const updateAppStatus = async (careerId, appId, status) => {
    const res = await api.patch(`${API_BASE}/${careerId}/applications/${appId}`, { status });
    if (res.success) {
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      showToast("Application status updated");
    }
  };

  // ─── Stat Card ───────────────────────────────────────────────────────────────
  const StatCard = ({ label, value, color, icon }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,.08)",
        border: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{value ?? "—"}</div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            C
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>Careers Admin</span>
        </div>
        <button
          onClick={() => { setSelected(null); setModal("create"); }}
          style={{
            padding: "9px 18px",
            background: "#2563eb",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Career
        </button>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Stats */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard label="Total Jobs" value={stats.total} color="#2563eb" icon="💼" />
            <StatCard label="Active" value={stats.active} color="#16a34a" icon="✅" />
            <StatCard label="Inactive" value={stats.inactive} color="#dc2626" icon="⏸" />
            <StatCard label="Applications" value={stats.totalApplications} color="#7c3aed" icon="📨" />
          </div>
        )}

        {/* Filters */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            border: "1px solid #f1f5f9",
          }}
        >
          <input
            style={{ ...inputStyle, maxWidth: 300, margin: 0 }}
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            {[["all", "All"], ["true", "Active"], ["false", "Inactive"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setFilterActive(val); setPage(1); }}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: filterActive === val ? "#2563eb" : "#f1f5f9",
                  color: filterActive === val ? "#fff" : "#374151",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: "auto", color: "#64748b", fontSize: 13 }}>
            {total} job{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            border: "1px solid #f1f5f9",
          }}
        >
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#64748b" }}>Loading…</div>
          ) : careers.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
              <div style={{ fontWeight: 600 }}>No careers found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Create your first career listing</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["Title", "Category", "Type", "Location", "Vacancy", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {careers.map((career, i) => (
                  <tr
                    key={career._id}
                    style={{
                      borderBottom: i < careers.length - 1 ? "1px solid #f1f5f9" : "none",
                      transition: "background .1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{career.title}</div>
                      {career.company && (
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{career.company}</div>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{career.category}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{career.need}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{career.location}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                      {String(career.vacancy || 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge active={career.isActive} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          title="View Applications"
                          onClick={() => openApplications(career)}
                          style={{ padding: "6px 10px", background: "#eff6ff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#2563eb" }}
                        >
                          📨
                        </button>
                        <button
                          title="Edit"
                          onClick={() => { setSelected(career); setModal("edit"); }}
                          style={{ padding: "6px 10px", background: "#f0fdf4", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#16a34a" }}
                        >
                          ✏️
                        </button>
                        <button
                          title={career.isActive ? "Deactivate" : "Activate"}
                          onClick={() => handleToggle(career._id)}
                          style={{ padding: "6px 10px", background: "#fef9c3", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#854d0e" }}
                        >
                          {career.isActive ? "⏸" : "▶️"}
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setConfirm({ id: career._id, title: career.title })}
                          style={{ padding: "6px 10px", background: "#fff1f2", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#dc2626" }}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                    background: page === p ? "#2563eb" : "#f1f5f9",
                    color: page === p ? "#fff" : "#374151",
                    transition: "all .15s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {modal === "create" && (
        <Modal title="Create New Career" onClose={() => setModal(null)} wide>
          <CareerForm onSubmit={handleCreate} onCancel={() => setModal(null)} loading={formLoading} />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal title={`Edit: ${selected.title}`} onClose={() => { setModal(null); setSelected(null); }} wide>
          <CareerForm
            initial={selected}
            onSubmit={handleUpdate}
            onCancel={() => { setModal(null); setSelected(null); }}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Applications Modal */}
      {modal === "apps" && (
        <Modal title={`Applications — ${appsTitle}`} onClose={() => setModal(null)} wide>
          {applications.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>No applications yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {applications.map((app) => (
                <div
                  key={app._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{app.fullName}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{app.email} {app.phone && `· ${app.phone}`}</div>
                    {app.coverLetter && (
                      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#374151", lineHeight: 1.5, maxWidth: 500 }}>
                        {app.coverLetter.slice(0, 200)}{app.coverLetter.length > 200 ? "…" : ""}
                      </p>
                    )}
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, marginTop: 6, display: "inline-block" }}
                      >
                        📄 View Resume
                      </a>
                    )}
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <AppBadge status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => updateAppStatus(selected?._id || applications[0]?.careerId, app._id, e.target.value)}
                      style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "5px 8px" }}
                    >
                      {["pending", "reviewed", "shortlisted", "rejected"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirm && (
        <Confirm
          msg={`Are you sure you want to delete "${confirm.title}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}