import { useState, useEffect, useCallback } from "react";
import { newsletterService } from "../services/api";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—";

const StatusBadge = ({ status }) => (
  <span
    style={{
      display:      "inline-block",
      padding:      "2px 10px",
      borderRadius: "999px",
      fontSize:     "12px",
      fontWeight:   "600",
      background:   status === "active" ? "#dcfce7" : "#fee2e2",
      color:        status === "active" ? "#15803d" : "#b91c1c",
    }}
  >
    {status === "active" ? "Active" : "Unsubscribed"}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function NewsletterPage() {
  // ── data ──────────────────────────────────────────────────────────────────
  const [subscribers, setSubscribers]   = useState([]);
  const [stats,       setStats]         = useState(null);
  const [pagination,  setPagination]    = useState({ total: 0, page: 1, totalPages: 1 });

  // ── ui state ──────────────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState([]); // selected ids for bulk
  const [toast,        setToast]        = useState(null); // { type, text }

  // ── fetch ─────────────────────────────────────────────────────────────────
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

  // ── helpers ───────────────────────────────────────────────────────────────
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelected(
      selected.length === subscribers.length ? [] : subscribers.map((s) => s._id)
    );

  // ── actions ───────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await newsletterService.toggle(id);
      showToast("success", "Status updated.");
      fetchData();
    } catch {
      showToast("error", "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;
    try {
      await newsletterService.delete(id);
      showToast("success", "Subscriber deleted.");
      fetchData();
    } catch {
      showToast("error", "Failed to delete.");
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} subscriber(s)?`)) return;
    try {
      await newsletterService.bulkDelete(selected);
      showToast("success", `${selected.length} subscriber(s) deleted.`);
      fetchData();
    } catch {
      showToast("error", "Bulk delete failed.");
    }
  };

  const handleExport = async () => {
    try {
      const res  = await newsletterService.exportCSV({ status: statusFilter || "active" });
      const url  = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href     = url;
      link.download = "newsletter_subscribers.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("error", "Export failed.");
    }
  };

  // ── search debounce ───────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position:     "fixed",
          top:          "20px",
          right:        "20px",
          zIndex:       9999,
          padding:      "12px 20px",
          borderRadius: "8px",
          fontSize:     "14px",
          fontWeight:   "500",
          color:        "#fff",
          background:   toast.type === "success" ? "#16a34a" : "#dc2626",
          boxShadow:    "0 4px 12px rgba(0,0,0,.15)",
        }}>
          {toast.text}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="tj-breadcrumb-area" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Newsletter Subscribers</h4>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
              Manage all email subscribers from the website footer
            </p>
          </div>
          <button
            onClick={handleExport}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "6px",
              padding:      "9px 18px",
              borderRadius: "8px",
              border:       "none",
              background:   "#2563eb",
              color:        "#fff",
              fontWeight:   "600",
              fontSize:     "13px",
              cursor:       "pointer",
            }}
          >
            <i className="fa-solid fa-download" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total",         value: stats.total,        color: "#2563eb", icon: "fa-users" },
            { label: "Active",        value: stats.active,       color: "#16a34a", icon: "fa-circle-check" },
            { label: "Unsubscribed",  value: stats.unsubscribed, color: "#dc2626", icon: "fa-circle-xmark" },
            { label: "Today",         value: stats.todayCount,   color: "#d97706", icon: "fa-calendar-day" },
            { label: "This Month",    value: stats.thisMonthCount, color: "#7c3aed", icon: "fa-calendar-check" },
          ].map((s) => (
            <div key={s.label} style={{
              background:   "#fff",
              borderRadius: "12px",
              padding:      "18px 20px",
              boxShadow:    "0 1px 4px rgba(0,0,0,.08)",
              borderTop:    `3px solid ${s.color}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{s.label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "26px", fontWeight: 700, color: "#111827" }}>{s.value}</p>
                </div>
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: "22px", color: s.color, opacity: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{
        background:   "#fff",
        borderRadius: "12px",
        padding:      "16px 20px",
        boxShadow:    "0 1px 4px rgba(0,0,0,.08)",
        marginBottom: "16px",
        display:      "flex",
        gap:          "12px",
        flexWrap:     "wrap",
        alignItems:   "center",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <i className="fa-solid fa-search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "13px" }} />
          <input
            type="text"
            placeholder="Search email…"
            value={search}
            onChange={handleSearchChange}
            style={{
              width:        "100%",
              paddingLeft:  "34px",
              paddingRight: "12px",
              height:       "38px",
              borderRadius: "8px",
              border:       "1px solid #e5e7eb",
              fontSize:     "14px",
              outline:      "none",
              boxSizing:    "border-box",
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            height:       "38px",
            padding:      "0 12px",
            borderRadius: "8px",
            border:       "1px solid #e5e7eb",
            fontSize:     "14px",
            background:   "#fff",
            cursor:       "pointer",
            outline:      "none",
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
              height:       "38px",
              padding:      "0 16px",
              borderRadius: "8px",
              border:       "none",
              background:   "#fee2e2",
              color:        "#b91c1c",
              fontWeight:   "600",
              fontSize:     "13px",
              cursor:       "pointer",
              display:      "flex",
              alignItems:   "center",
              gap:          "6px",
            }}
          >
            <i className="fa-solid fa-trash" />
            Delete ({selected.length})
          </button>
        )}

        <span style={{ marginLeft: "auto", fontSize: "13px", color: "#6b7280" }}>
          {pagination.total} total subscriber{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{
        background:   "#fff",
        borderRadius: "12px",
        boxShadow:    "0 1px 4px rgba(0,0,0,.08)",
        overflow:     "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selected.length === subscribers.length && subscribers.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                {["Email", "Status", "Source", "Subscribed On", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding:    "12px 16px",
                    textAlign:  "left",
                    fontWeight: "600",
                    color:      "#374151",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }} />
                    Loading…
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: "32px", display: "block", marginBottom: "8px", opacity: 0.4 }} />
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((s, i) => (
                  <tr
                    key={s._id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background:   selected.includes(s._id) ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#fafafa",
                      transition:   "background .15s",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <input
                        type="checkbox"
                        checked={selected.includes(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>

                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width:        "32px",
                          height:       "32px",
                          borderRadius: "50%",
                          background:   "#dbeafe",
                          color:        "#2563eb",
                          display:      "flex",
                          alignItems:   "center",
                          justifyContent: "center",
                          fontWeight:   700,
                          fontSize:     "13px",
                          flexShrink:   0,
                        }}>
                          {s.email[0].toUpperCase()}
                        </div>
                        {s.email}
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <StatusBadge status={s.status} />
                    </td>

                    <td style={{ padding: "12px 16px", color: "#6b7280", textTransform: "capitalize" }}>
                      {s.source || "footer"}
                    </td>

                    <td style={{ padding: "12px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {formatDate(s.subscribedAt || s.createdAt)}
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* Toggle active/unsubscribed */}
                        <button
                          onClick={() => handleToggle(s._id)}
                          title={s.status === "active" ? "Deactivate" : "Activate"}
                          style={{
                            width:        "32px",
                            height:       "32px",
                            borderRadius: "6px",
                            border:       "none",
                            cursor:       "pointer",
                            display:      "flex",
                            alignItems:   "center",
                            justifyContent: "center",
                            background:   s.status === "active" ? "#fef3c7" : "#dcfce7",
                            color:        s.status === "active" ? "#d97706" : "#16a34a",
                          }}
                        >
                          <i className={`fa-solid ${s.status === "active" ? "fa-ban" : "fa-circle-check"}`} style={{ fontSize: "13px" }} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(s._id)}
                          title="Delete"
                          style={{
                            width:        "32px",
                            height:       "32px",
                            borderRadius: "6px",
                            border:       "none",
                            cursor:       "pointer",
                            display:      "flex",
                            alignItems:   "center",
                            justifyContent: "center",
                            background:   "#fee2e2",
                            color:        "#b91c1c",
                          }}
                        >
                          <i className="fa-solid fa-trash" style={{ fontSize: "12px" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "14px 20px",
            borderTop:      "1px solid #e5e7eb",
            flexWrap:       "wrap",
            gap:            "10px",
          }}>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding:      "6px 14px",
                  borderRadius: "6px",
                  border:       "1px solid #e5e7eb",
                  background:   page <= 1 ? "#f9fafb" : "#fff",
                  cursor:       page <= 1 ? "not-allowed" : "pointer",
                  fontSize:     "13px",
                  color:        page <= 1 ? "#9ca3af" : "#374151",
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width:        "34px",
                      height:       "34px",
                      borderRadius: "6px",
                      border:       "1px solid",
                      borderColor:  page === p ? "#2563eb" : "#e5e7eb",
                      background:   page === p ? "#2563eb" : "#fff",
                      color:        page === p ? "#fff" : "#374151",
                      cursor:       "pointer",
                      fontSize:     "13px",
                      fontWeight:   page === p ? 700 : 400,
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
                  padding:      "6px 14px",
                  borderRadius: "6px",
                  border:       "1px solid #e5e7eb",
                  background:   page >= pagination.totalPages ? "#f9fafb" : "#fff",
                  cursor:       page >= pagination.totalPages ? "not-allowed" : "pointer",
                  fontSize:     "13px",
                  color:        page >= pagination.totalPages ? "#9ca3af" : "#374151",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}