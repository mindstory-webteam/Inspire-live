import { useState, useEffect, useCallback } from "react";
import { newsletterService } from "../services/api";

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—";

// ── Icons (inline SVG — no dependency on FA loading) ─────────────────────────
const IconUsers       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconCheck       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconX           = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IconCalDay      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconCalMonth    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>;
const IconDownload    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconSearch      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconTrash       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconBan         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
const IconActivate    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconMail        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconChevronLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span style={{
    display:       "inline-flex",
    alignItems:    "center",
    gap:           "5px",
    padding:       "3px 10px",
    borderRadius:  "999px",
    fontSize:      "12px",
    fontWeight:    "600",
    letterSpacing: "0.02em",
    background:    status === "active" ? "#f0fdf4" : "#fef2f2",
    color:         status === "active" ? "#15803d" : "#b91c1c",
    border:        `1px solid ${status === "active" ? "#bbf7d0" : "#fecaca"}`,
  }}>
    <span style={{
      width: "6px", height: "6px", borderRadius: "50%",
      background: status === "active" ? "#22c55e" : "#ef4444",
      flexShrink: 0,
    }} />
    {status === "active" ? "Active" : "Unsubscribed"}
  </span>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ email }) => {
  const colors = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444","#06b6d4"];
  const color  = colors[email.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: "34px", height: "34px", borderRadius: "50%",
      background: `${color}18`, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: "13px", flexShrink: 0,
      border: `1.5px solid ${color}30`,
    }}>
      {email[0].toUpperCase()}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export default function NewsletterPage() {
  const [subscribers,  setSubscribers]  = useState([]);
  const [stats,        setStats]        = useState(null);
  const [pagination,   setPagination]   = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState([]);
  const [toast,        setToast]        = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        newsletterService.getAll({ page, limit: 15, search, status: statusFilter }),
        newsletterService.getStats(),
      ]);
      setSubscribers(listRes.data.data       || []);
      setPagination( listRes.data.pagination || { total: 0, page: 1, totalPages: 1 });
      setStats(      statsRes.data.data      || null);
      setSelected([]);
    } catch {
      showToast("error", "Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleSelect    = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleSelectAll = () => setSelected(selected.length === subscribers.length ? [] : subscribers.map((s) => s._id));

  const handleToggle = async (id) => {
    try { await newsletterService.toggle(id); showToast("success", "Status updated."); fetchData(); }
    catch { showToast("error", "Failed to update status."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;
    try { await newsletterService.delete(id); showToast("success", "Subscriber deleted."); fetchData(); }
    catch { showToast("error", "Failed to delete."); }
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} subscriber(s)?`)) return;
    try { await newsletterService.bulkDelete(selected); showToast("success", `${selected.length} deleted.`); fetchData(); }
    catch { showToast("error", "Bulk delete failed."); }
  };

  const handleExport = async () => {
    try {
      const res  = await newsletterService.exportCSV({ status: statusFilter || "active" });
      const url  = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url; link.download = "newsletter_subscribers.csv"; link.click();
      URL.revokeObjectURL(url);
    } catch { showToast("error", "Export failed."); }
  };

  const statCards = [
    { label: "Total",        value: stats?.total,          Icon: IconUsers,    color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    { label: "Active",       value: stats?.active,         Icon: IconCheck,    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Unsubscribed", value: stats?.unsubscribed,   Icon: IconX,        color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    { label: "Today",        value: stats?.todayCount,     Icon: IconCalDay,   color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    { label: "This Month",   value: stats?.thisMonthCount, Icon: IconCalMonth, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  ];

  return (
    <div style={{ padding: "28px 32px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          padding: "12px 20px", borderRadius: "10px", fontSize: "13.5px", fontWeight: "500",
          color: "#fff", background: toast.type === "success" ? "#16a34a" : "#dc2626",
          boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          display: "flex", alignItems: "center", gap: "8px",
          animation: "slideIn .25s ease",
        }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.text}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px)  } to { opacity:1; transform:translateY(0) } }
        .nl-row:hover { background: #f8fafc !important; }
        .nl-row-selected { background: #eff6ff !important; }
        .action-btn:hover { transform: scale(1.08); }
        .nl-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px #3b82f620 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "13px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px #3b82f640",
          }}>
            <IconMail />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Newsletter Subscribers
            </h1>
            <p style={{ margin: "3px 0 0", fontSize: "13.5px", color: "#64748b" }}>
              Manage all email subscribers from the website footer
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "#fff", fontWeight: "600", fontSize: "13.5px",
            cursor: "pointer", boxShadow: "0 4px 12px #3b82f640",
            transition: "all .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <IconDownload />
          Export CSV
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {stats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "16px", marginBottom: "24px",
          animation: "fadeIn .35s ease",
        }}>
          {statCards.map(({ label, value, Icon, color, bg, border }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: "14px",
              padding: "20px", border: `1px solid #e2e8f0`,
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              display: "flex", alignItems: "center", gap: "14px",
              transition: "box-shadow .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.06)"}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "11px",
                background: bg, border: `1px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color, flexShrink: 0,
              }}>
                <Icon />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                  {value ?? "—"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "#64748b", fontWeight: 500 }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{
        background: "#fff", borderRadius: "14px", padding: "14px 18px",
        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        marginBottom: "14px", display: "flex", gap: "10px",
        flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}>
            <IconSearch />
          </span>
          <input
            className="nl-input"
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: "100%", paddingLeft: "36px", paddingRight: "14px",
              height: "38px", borderRadius: "9px", border: "1.5px solid #e2e8f0",
              fontSize: "13.5px", outline: "none", boxSizing: "border-box",
              color: "#0f172a", background: "#f8fafc", transition: "all .2s",
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            height: "38px", padding: "0 14px", borderRadius: "9px",
            border: "1.5px solid #e2e8f0", fontSize: "13.5px",
            background: "#f8fafc", cursor: "pointer", outline: "none",
            color: "#374151", fontWeight: 500,
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>

        {/* Bulk delete */}
        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            style={{
              height: "38px", padding: "0 16px", borderRadius: "9px",
              border: "1.5px solid #fecaca", background: "#fef2f2",
              color: "#dc2626", fontWeight: "600", fontSize: "13px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "all .15s",
            }}
          >
            <IconTrash /> Delete ({selected.length})
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            background: "#f1f5f9", borderRadius: "7px", padding: "4px 10px",
            fontSize: "12.5px", fontWeight: "600", color: "#475569",
          }}>
            {pagination.total} subscriber{pagination.total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: "#fff", borderRadius: "14px",
        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        overflow: "hidden", animation: "fadeIn .4s ease",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>

            {/* Head */}
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                <th style={{ padding: "13px 18px", width: "44px" }}>
                  <input
                    type="checkbox"
                    checked={selected.length === subscribers.length && subscribers.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer", width: "15px", height: "15px", accentColor: "#3b82f6" }}
                  />
                </th>
                {[
                  { label: "Email",         width: "auto" },
                  { label: "Status",        width: "130px" },
                  { label: "Source",        width: "120px" },
                  { label: "Subscribed On", width: "140px" },
                  { label: "Actions",       width: "100px" },
                ].map(({ label, width }) => (
                  <th key={label} style={{
                    padding: "13px 18px", textAlign: "left",
                    fontWeight: 600, fontSize: "12px", color: "#64748b",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    width,
                  }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "60px 16px", color: "#94a3b8" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%", margin: "0 auto 12px",
                      border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite",
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    Loading subscribers…
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "60px 16px", color: "#94a3b8" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px", opacity: 0.4 }}>📭</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>No subscribers found</p>
                    <p style={{ margin: "4px 0 0", fontSize: "13px" }}>Try changing your filters</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => {
                  const isSelected = selected.includes(s._id);
                  return (
                    <tr
                      key={s._id}
                      className={`nl-row${isSelected ? " nl-row-selected" : ""}`}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: isSelected ? "#eff6ff" : "#fff",
                        transition: "background .12s",
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "14px 18px" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(s._id)}
                          style={{ cursor: "pointer", width: "15px", height: "15px", accentColor: "#3b82f6" }}
                        />
                      </td>

                      {/* Email */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Avatar email={s.email} />
                          <span style={{ fontWeight: 500, color: "#0f172a" }}>{s.email}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Source */}
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          background: "#f1f5f9", borderRadius: "6px", padding: "3px 10px",
                          fontSize: "12.5px", fontWeight: 500, color: "#475569", textTransform: "capitalize",
                        }}>
                          {s.source || "footer"}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 18px", color: "#64748b", whiteSpace: "nowrap", fontSize: "13px" }}>
                        {formatDate(s.subscribedAt || s.createdAt)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {/* Toggle */}
                          <button
                            className="action-btn"
                            onClick={() => handleToggle(s._id)}
                            title={s.status === "active" ? "Deactivate" : "Activate"}
                            style={{
                              width: "32px", height: "32px", borderRadius: "8px", border: "none",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              background:   s.status === "active" ? "#fffbeb" : "#f0fdf4",
                              color:        s.status === "active" ? "#d97706" : "#16a34a",
                              border:       `1px solid ${s.status === "active" ? "#fde68a" : "#bbf7d0"}`,
                              transition:   "all .15s",
                            }}
                          >
                            {s.status === "active" ? <IconBan /> : <IconActivate />}
                          </button>

                          {/* Delete */}
                          <button
                            className="action-btn"
                            onClick={() => handleDelete(s._id)}
                            title="Delete subscriber"
                            style={{
                              width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #fecaca",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              background: "#fef2f2", color: "#dc2626", transition: "all .15s",
                            }}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderTop: "1.5px solid #f1f5f9",
            flexWrap: "wrap", gap: "10px", background: "#fafafa",
          }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Page <strong style={{ color: "#0f172a" }}>{pagination.page}</strong> of <strong style={{ color: "#0f172a" }}>{pagination.totalPages}</strong>
            </span>

            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  border: "1.5px solid #e2e8f0", background: page <= 1 ? "#f8fafc" : "#fff",
                  cursor: page <= 1 ? "not-allowed" : "pointer", color: page <= 1 ? "#cbd5e1" : "#374151",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
                }}
              >
                <IconChevronLeft />
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: "34px", height: "34px", borderRadius: "8px",
                      border: `1.5px solid ${page === p ? "#3b82f6" : "#e2e8f0"}`,
                      background: page === p ? "#3b82f6" : "#fff",
                      color: page === p ? "#fff" : "#374151",
                      cursor: "pointer", fontSize: "13px", fontWeight: page === p ? 700 : 400,
                      transition: "all .15s",
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  background: page >= pagination.totalPages ? "#f8fafc" : "#fff",
                  cursor: page >= pagination.totalPages ? "not-allowed" : "pointer",
                  color: page >= pagination.totalPages ? "#cbd5e1" : "#374151",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
                }}
              >
                <IconChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}