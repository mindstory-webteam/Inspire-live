import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ServiceManager = () => {
  const { api } = useAuth();
  const navigate = useNavigate();

  const [services, setServices]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [deleteId, setDeleteId]           = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]                 = useState({ show: false, message: "", type: "" });
  const [search, setSearch]               = useState("");
  // "all" | "visible" | "hidden"
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  // Set of service IDs hidden locally (persisted in localStorage)
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("sm_hidden_services") || "[]"));
    } catch { return new Set(); }
  });

  // ─── Persist hidden IDs ───────────────────────────────────────────────────
  const saveHidden = (set) => {
    localStorage.setItem("sm_hidden_services", JSON.stringify([...set]));
  };

  const toggleHidden = (id) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Service is now visible in the list.", "success"); }
      else              { next.add(id);    showToast("Service hidden from the list.", "info"); }
      saveHidden(next);
      return next;
    });
  };

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/services/admin/all");
      setServices(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete("/services/" + deleteId);
      showToast("Service deleted successfully.", "success");
      setDeleteId(null);
      // Also remove from hidden set if present
      setHiddenIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteId);
        saveHidden(next);
        return next;
      });
      fetchServices();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete service.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Toggle Active ────────────────────────────────────────────────────────
  const handleToggleActive = async (service) => {
    try {
      const formData = new FormData();
      formData.append("isActive", !service.isActive);
      await api.put("/services/" + service._id, formData);
      showToast("Service " + (service.isActive ? "deactivated" : "activated") + ".", "success");
      fetchServices();
    } catch (err) {
      showToast("Failed to update service status.", "error");
    }
  };

  // ─── Filtered list ────────────────────────────────────────────────────────
  const searchFiltered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const filtered = searchFiltered.filter(s => {
    if (visibilityFilter === "hidden")  return hiddenIds.has(s._id);
    if (visibilityFilter === "visible") return !hiddenIds.has(s._id);
    return true;
  });

  const activeCount   = services.filter(s => s.isActive).length;
  const inactiveCount = services.filter(s => !s.isActive).length;
  const hiddenCount   = services.filter(s => hiddenIds.has(s._id)).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sm-root">

      {/* ── Toast ── */}
      {toast.show && (
        <div className={"sm-toast sm-toast--" + toast.type}>
          <span className="sm-toast__icon">
            {toast.type === "success" ? "✓" : toast.type === "info" ? "●" : "✕"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div className="sm-modal-backdrop" onClick={() => !deleteLoading && setDeleteId(null)}>
          <div className="sm-modal" onClick={e => e.stopPropagation()}>
            <div className="sm-modal__icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="sm-modal__title">Delete Service?</h3>
            <p className="sm-modal__body">
              This will permanently remove the service and all associated Cloudinary images. This cannot be undone.
            </p>
            <div className="sm-modal__actions">
              <button className="sm-btn sm-btn--ghost" onClick={() => setDeleteId(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="sm-btn sm-btn--danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading
                  ? <><span className="sm-spinner"></span>Deleting…</>
                  : "Delete Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="sm-header">
        <div className="sm-header__left">
          <h1 className="sm-header__title">Services</h1>
          <p className="sm-header__sub">Manage and monitor all your service offerings</p>
        </div>
        <button className="sm-btn sm-btn--primary" onClick={() => navigate("/services/new")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Add New Service
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="sm-stats">
        <div className="sm-stat sm-stat--total">
          <div className="sm-stat__icon-wrap sm-stat__icon-wrap--gray">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sm-stat__body">
            <div className="sm-stat__value">{services.length}</div>
            <div className="sm-stat__label">Total Services</div>
          </div>
          <div className="sm-stat__bar sm-stat__bar--total"></div>
        </div>

        <div className="sm-stat sm-stat--active">
          <div className="sm-stat__icon-wrap sm-stat__icon-wrap--green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sm-stat__body">
            <div className="sm-stat__value sm-stat__value--green">{activeCount}</div>
            <div className="sm-stat__label">Active</div>
          </div>
          <div className="sm-stat__bar sm-stat__bar--active"></div>
        </div>

        <div className="sm-stat sm-stat--inactive">
          <div className="sm-stat__icon-wrap sm-stat__icon-wrap--red">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sm-stat__body">
            <div className="sm-stat__value sm-stat__value--red">{inactiveCount}</div>
            <div className="sm-stat__label">Inactive</div>
          </div>
          <div className="sm-stat__bar sm-stat__bar--inactive"></div>
        </div>

        <div className="sm-stat sm-stat--hidden" style={{cursor:"pointer"}} onClick={() => setVisibilityFilter(v => v === "hidden" ? "all" : "hidden")}>
          <div className="sm-stat__icon-wrap sm-stat__icon-wrap--amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sm-stat__body">
            <div className="sm-stat__value sm-stat__value--amber">{hiddenCount}</div>
            <div className="sm-stat__label">Hidden</div>
          </div>
          <div className="sm-stat__bar sm-stat__bar--amber"></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sm-toolbar">
        <div className="sm-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="sm-search__input"
            placeholder="Search by name or slug…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="sm-search__clear" onClick={() => setSearch("")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Visibility filter tabs */}
        <div className="sm-vis-tabs">
          {[
            { key: "all",     label: "All" },
            { key: "visible", label: "Visible" },
            { key: "hidden",  label: "Hidden" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={"sm-vis-tab " + (visibilityFilter === key ? "sm-vis-tab--active" : "")}
              onClick={() => setVisibilityFilter(key)}
            >
              {label}
              {key === "hidden" && hiddenCount > 0 && (
                <span className="sm-vis-tab__badge">{hiddenCount}</span>
              )}
            </button>
          ))}
        </div>

        <span className="sm-toolbar__count">
          {filtered.length} of {services.length} services
        </span>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="sm-error">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="sm-card">
        {loading ? (
          <div className="sm-skeleton-list">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="sm-skeleton-row">
                <div className="sm-skel sm-skel--thumb"></div>
                <div className="sm-skel-group">
                  <div className="sm-skel sm-skel--title"></div>
                  <div className="sm-skel sm-skel--sub"></div>
                </div>
                <div className="sm-skel sm-skel--badge"></div>
                <div className="sm-skel sm-skel--badge"></div>
                <div className="sm-skel sm-skel--status"></div>
                <div className="sm-skel sm-skel--actions"></div>
              </div>
            ))}
          </div>

        ) : filtered.length === 0 ? (
          <div className="sm-empty">
            <div className="sm-empty__icon">
              {search || visibilityFilter !== "all" ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <h3 className="sm-empty__title">
              {search
                ? `No results for "${search}"`
                : visibilityFilter === "hidden"
                  ? "No hidden services"
                  : "No services yet"}
            </h3>
            <p className="sm-empty__sub">
              {search
                ? "Try a different search term."
                : visibilityFilter === "hidden"
                  ? "Hide services using the eye icon in the actions column."
                  : "Add your first service to get started."}
            </p>
            {!search && visibilityFilter === "all" && (
              <button className="sm-btn sm-btn--primary" onClick={() => navigate("/services/new")}>
                Add First Service
              </button>
            )}
          </div>

        ) : (
          <div className="sm-table-wrap">
            <table className="sm-table">
              <thead>
                <tr>
                  <th className="sm-th sm-th--service">Service</th>
                  <th className="sm-th">Slug</th>
                  <th className="sm-th sm-th--center">FAQs</th>
                  <th className="sm-th sm-th--center">Benefits</th>
                  <th className="sm-th sm-th--center">Order</th>
                  <th className="sm-th sm-th--center">Status</th>
                  <th className="sm-th sm-th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service, idx) => {
                  const isHidden = hiddenIds.has(service._id);
                  return (
                    <tr
                      key={service._id}
                      className={"sm-tr " + (isHidden ? "sm-tr--hidden" : "")}
                      style={{ animationDelay: idx * 35 + "ms" }}
                    >

                      {/* Service */}
                      <td className="sm-td">
                        <div className="sm-service-cell">
                          <div className="sm-thumb">
                            {service.heroImage ? (
                              <>
                                <img
                                  src={service.heroImage}
                                  alt={service.title}
                                  onError={e => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div className="sm-thumb__fallback" style={{ display: "none" }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M3 9l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </div>
                              </>
                            ) : (
                              <div className="sm-thumb__fallback" style={{ display: "flex" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M3 9l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="sm-service-info">
                            <span className="sm-service-name">
                              {service.title}
                              {isHidden && (
                                <span className="sm-hidden-badge">Hidden</span>
                              )}
                            </span>
                            {service.subtitle && (
                              <span className="sm-service-sub">
                                {service.subtitle.length > 52 ? service.subtitle.slice(0, 52) + "…" : service.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="sm-td">
                        <code className="sm-slug">{service.slug}</code>
                      </td>

                      {/* FAQs */}
                      <td className="sm-td sm-td--center">
                        <span className="sm-badge sm-badge--blue">{service.faqs?.length || 0}</span>
                      </td>

                      {/* Benefits */}
                      <td className="sm-td sm-td--center">
                        <span className="sm-badge sm-badge--purple">{service.benefits?.length || 0}</span>
                      </td>

                      {/* Order */}
                      <td className="sm-td sm-td--center">
                        <span className="sm-order">{service.order}</span>
                      </td>

                      {/* Status */}
                      <td className="sm-td sm-td--center">
                        <button
                          className={"sm-status " + (service.isActive ? "sm-status--on" : "sm-status--off")}
                          onClick={() => handleToggleActive(service)}
                          title="Click to toggle"
                        >
                          <span className="sm-status__dot"></span>
                          {service.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="sm-td sm-td--right">
                        <div className="sm-actions">
                          <a
                            href={"http://localhost:3000/services/" + service.slug}
                            target="_blank"
                            rel="noreferrer"
                            className="sm-icon-btn sm-icon-btn--view"
                            title="View live"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>

                          {/* Hide / Show toggle */}
                          <button
                            className={"sm-icon-btn " + (isHidden ? "sm-icon-btn--show" : "sm-icon-btn--hide")}
                            title={isHidden ? "Show in list" : "Hide from list"}
                            onClick={() => toggleHidden(service._id)}
                          >
                            {isHidden ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                          </button>

                          <button
                            className="sm-icon-btn sm-icon-btn--edit"
                            title="Edit"
                            onClick={() => navigate("/services/edit/" + service._id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                          <button
                            className="sm-icon-btn sm-icon-btn--delete"
                            title="Delete"
                            onClick={() => setDeleteId(service._id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .sm-root {
          padding: 32px 28px;
          position: relative;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          background: #f5f6fa;
          min-height: 100vh;
          color: #0c1e21;
        }

        /* ─ Toast ─ */
        .sm-toast {
          position: fixed; bottom: 28px; right: 28px;
          display: flex; align-items: center; gap: 10px;
          padding: 13px 20px; border-radius: 12px;
          font-size: 13.5px; font-weight: 600;
          z-index: 9999;
          box-shadow: 0 12px 40px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08);
          animation: smSlideUp .22s cubic-bezier(.34,1.56,.64,1);
          backdrop-filter: blur(10px);
        }
        .sm-toast--success { background: rgba(5,46,22,.92); color: #86efac; border: 1px solid rgba(22,163,74,.4); }
        .sm-toast--error   { background: rgba(69,10,10,.92); color: #fca5a5; border: 1px solid rgba(153,27,27,.4); }
        .sm-toast--info    { background: rgba(30,58,138,.92); color: #bfdbfe; border: 1px solid rgba(37,99,235,.4); }
        .sm-toast__icon { font-size: 15px; }
        @keyframes smSlideUp {
          from { transform: translateY(14px) scale(.96); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* ─ Modal ─ */
        .sm-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(12,30,33,.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 9998;
          backdrop-filter: blur(6px);
        }
        .sm-modal {
          background: #fff; border-radius: 20px; padding: 40px 36px;
          max-width: 400px; width: 90%; text-align: center;
          box-shadow: 0 32px 80px rgba(0,0,0,.2);
          animation: smPop .22s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes smPop {
          from { transform: scale(.93) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        .sm-modal__icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: #fff1f2; color: #e11d48;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; border: 1px solid #fecdd3;
        }
        .sm-modal__title { font-size: 18px; font-weight: 800; color: #0c1e21; margin: 0 0 8px; }
        .sm-modal__body  { font-size: 13.5px; color: #67787a; line-height: 1.7; margin: 0 0 28px; }
        .sm-modal__actions { display: flex; gap: 10px; justify-content: center; }

        /* ─ Buttons ─ */
        .sm-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 10px;
          font-size: 13.5px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          border: none; cursor: pointer;
          transition: all .18s cubic-bezier(.4,0,.2,1);
          white-space: nowrap; flex-shrink: 0; letter-spacing: -.01em;
        }
        .sm-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
        .sm-btn--primary {
          background: linear-gradient(135deg, #1a598a 0%, #015599 100%);
          color: #fff; box-shadow: 0 2px 12px rgba(26,89,138,.35);
        }
        .sm-btn--primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,89,138,.4); }
        .sm-btn--ghost { background: #f0f2f5; color: #1a425c; border: 1px solid #e2e8f0; }
        .sm-btn--ghost:hover:not(:disabled) { background: #e5eaf0; transform: translateY(-1px); }
        .sm-btn--danger {
          background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
          color: #fff; box-shadow: 0 2px 10px rgba(225,29,72,.3);
        }
        .sm-btn--danger:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(225,29,72,.35); }

        .sm-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff; border-radius: 50%;
          animation: smSpin .65s linear infinite; display: inline-block;
        }
        @keyframes smSpin { to { transform: rotate(360deg); } }

        /* ─ Page Header ─ */
        .sm-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 24px;
          flex-wrap: wrap; gap: 16px;
        }
        .sm-header__title { font-size: 26px; font-weight: 800; color: #0c1e21; margin: 0 0 4px; letter-spacing: -.03em; }
        .sm-header__sub   { font-size: 13.5px; color: #67787a; margin: 0; }

        /* ─ Stat Cards ─ */
        .sm-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 22px;
        }
        @media (max-width: 900px) { .sm-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .sm-stats { grid-template-columns: 1fr; } }

        .sm-stat {
          background: #fff; border: 1px solid #e8ecf0; border-radius: 14px;
          padding: 18px 20px 16px; position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 14px;
          transition: box-shadow .18s, transform .18s;
        }
        .sm-stat:hover { box-shadow: 0 6px 24px rgba(0,0,0,.07); transform: translateY(-1px); }

        .sm-stat__icon-wrap {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sm-stat__icon-wrap--gray  { background: #f0f2f5; color: #67787a; }
        .sm-stat__icon-wrap--green { background: #dcfce7; color: #16a34a; }
        .sm-stat__icon-wrap--red   { background: #fee2e2; color: #dc2626; }
        .sm-stat__icon-wrap--amber { background: #fef3c7; color: #d97706; }

        .sm-stat__body { flex: 1; min-width: 0; }
        .sm-stat__value {
          font-size: 26px; font-weight: 800; color: #0c1e21;
          letter-spacing: -.04em; line-height: 1;
        }
        .sm-stat__value--green { color: #16a34a; }
        .sm-stat__value--red   { color: #dc2626; }
        .sm-stat__value--amber { color: #d97706; }
        .sm-stat__label {
          font-size: 11.5px; font-weight: 600; color: #a9b8b8;
          margin-top: 3px; text-transform: uppercase; letter-spacing: .06em;
        }
        .sm-stat__bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 0 0 14px 14px; }
        .sm-stat__bar--total   { background: linear-gradient(90deg, #94a3b8, #cbd5e1); }
        .sm-stat__bar--active  { background: linear-gradient(90deg, #16a34a, #4ade80); }
        .sm-stat__bar--inactive{ background: linear-gradient(90deg, #dc2626, #f87171); }
        .sm-stat__bar--amber   { background: linear-gradient(90deg, #d97706, #fcd34d); }

        /* ─ Toolbar ─ */
        .sm-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .sm-search {
          display: flex; align-items: center; gap: 9px;
          background: #fff; border: 1.5px solid #e8ecf0; border-radius: 10px;
          padding: 0 14px; flex: 1; max-width: 300px;
          transition: border .15s, box-shadow .15s;
        }
        .sm-search:focus-within { border-color: #1a598a; box-shadow: 0 0 0 3px rgba(26,89,138,.1); }
        .sm-search svg { color: #a9b8b8; flex-shrink: 0; }
        .sm-search__input {
          flex: 1; border: none; outline: none;
          font-size: 13.5px; color: #0c1e21; padding: 10px 0;
          background: transparent;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 500;
        }
        .sm-search__input::placeholder { color: #a9b8b8; }
        .sm-search__clear {
          border: none; background: #f0f2f5; cursor: pointer;
          color: #67787a; width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background .14s;
        }
        .sm-search__clear:hover { background: #e2e8f0; }

        /* ─ Visibility tabs ─ */
        .sm-vis-tabs {
          display: flex; gap: 4px;
          background: #f0f2f5; border-radius: 10px; padding: 4px;
        }
        .sm-vis-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 7px; border: none;
          font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: #67787a; background: transparent;
          transition: all .15s;
        }
        .sm-vis-tab:hover { color: #1a425c; background: rgba(255,255,255,.6); }
        .sm-vis-tab--active { background: #fff; color: #1a598a; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
        .sm-vis-tab__badge {
          background: #fef3c7; color: #d97706; border: 1px solid #fde68a;
          padding: 1px 6px; border-radius: 20px; font-size: 10.5px; font-weight: 800;
        }

        .sm-toolbar__count { font-size: 12px; color: #a9b8b8; font-weight: 600; white-space: nowrap; }

        /* ─ Error ─ */
        .sm-error {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 16px; border-radius: 10px; font-size: 13.5px;
          margin-bottom: 16px; font-weight: 500;
          background: #fff1f2; color: #be123c; border: 1px solid #fecdd3;
        }

        /* ─ Card ─ */
        .sm-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8ecf0; overflow: hidden;
          box-shadow: 0 1px 6px rgba(0,0,0,.04);
        }

        /* ─ Skeleton ─ */
        .sm-skeleton-list { padding: 0 20px; }
        .sm-skeleton-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 0; border-bottom: 1px solid #f5f6fa;
        }
        .sm-skeleton-row:last-child { border-bottom: none; }
        .sm-skel {
          background: linear-gradient(90deg, #f5f6fa 25%, #eaecf0 50%, #f5f6fa 75%);
          background-size: 200% 100%; border-radius: 7px;
          animation: smShimmer 1.6s ease-in-out infinite;
        }
        @keyframes smShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sm-skel--thumb   { width: 48px; height: 36px; border-radius: 9px; flex-shrink: 0; }
        .sm-skel-group    { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .sm-skel--title   { height: 12px; width: 45%; }
        .sm-skel--sub     { height: 10px; width: 28%; }
        .sm-skel--badge   { height: 22px; width: 52px; border-radius: 20px; }
        .sm-skel--status  { height: 26px; width: 78px; border-radius: 20px; }
        .sm-skel--actions { height: 30px; width: 96px; border-radius: 9px; }

        /* ─ Empty ─ */
        .sm-empty { padding: 72px 32px; text-align: center; }
        .sm-empty__icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: #f5f6fa; border: 1.5px solid #e8ecf0; color: #c8d0d0;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .sm-empty__title { font-size: 16px; font-weight: 700; color: #1a425c; margin: 0 0 6px; }
        .sm-empty__sub   { font-size: 13.5px; color: #a9b8b8; margin: 0 0 24px; }

        /* ─ Table ─ */
        .sm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .sm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .sm-th {
          padding: 12px 18px; text-align: left;
          font-size: 10.5px; font-weight: 700; color: #a9b8b8;
          text-transform: uppercase; letter-spacing: .09em;
          background: #fafbfc; border-bottom: 1px solid #e8ecf0; white-space: nowrap;
        }
        .sm-th--service { min-width: 230px; }
        .sm-th--center  { text-align: center !important; }
        .sm-th--right   { text-align: right !important; min-width: 136px; }

        .sm-tr { animation: smFadeIn .3s ease both; transition: background .1s; }
        .sm-tr--hidden { opacity: .5; }
        .sm-tr--hidden:hover { opacity: .75; }
        .sm-tr:hover .sm-td { background: #fafbfd; }
        @keyframes smFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sm-tr--hidden { animation: none; }

        .sm-td {
          padding: 14px 18px; border-bottom: 1px solid #f0f2f5;
          vertical-align: middle; transition: background .1s;
        }
        .sm-table tbody tr:last-child .sm-td { border-bottom: none; }
        .sm-td--center { text-align: center !important; }
        .sm-td--right  { text-align: right !important; }

        /* ─ Service cell ─ */
        .sm-service-cell { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .sm-thumb {
          width: 48px; height: 36px; border-radius: 9px; overflow: hidden;
          flex-shrink: 0; background: #f0f2f5;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8ecf0;
        }
        .sm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sm-thumb__fallback {
          width: 100%; height: 100%;
          align-items: center; justify-content: center; color: #c8d0d0;
        }
        .sm-service-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sm-service-name {
          font-weight: 700; color: #0c1e21; font-size: 13.5px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -.01em;
          display: flex; align-items: center; gap: 7px;
        }
        .sm-service-sub {
          font-size: 12px; color: #a9b8b8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ─ Hidden badge ─ */
        .sm-hidden-badge {
          display: inline-flex; align-items: center;
          padding: 2px 7px; border-radius: 6px;
          font-size: 10px; font-weight: 700;
          background: #fef3c7; color: #d97706;
          border: 1px solid #fde68a;
          letter-spacing: .04em; text-transform: uppercase;
          flex-shrink: 0;
        }

        /* ─ Slug ─ */
        .sm-slug {
          background: #f5f6fa; color: #1a425c;
          padding: 4px 9px; border-radius: 6px;
          font-size: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 500;
          white-space: nowrap; border: 1px solid #e8ecf0;
        }

        /* ─ Badges ─ */
        .sm-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 24px; padding: 0 9px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
        }
        .sm-badge--blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
        .sm-badge--purple { background: #f5f3ff; color: #7c3aed; border: 1px solid #ede9fe; }

        /* ─ Order ─ */
        .sm-order {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 24px; background: #f5f6fa; color: #67787a;
          padding: 0 9px; border-radius: 7px; font-size: 12px; font-weight: 700;
          border: 1px solid #e8ecf0;
        }

        /* ─ Status ─ */
        .sm-status {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1.5px solid transparent; cursor: pointer;
          padding: 5px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          transition: all .16s; white-space: nowrap;
        }
        .sm-status:hover { transform: scale(.96); }
        .sm-status__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .sm-status--on  { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
        .sm-status--on  .sm-status__dot { background: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.2); }
        .sm-status--off { background: #fff1f2; color: #b91c1c; border-color: #fecdd3; }
        .sm-status--off .sm-status__dot { background: #dc2626; }

        /* ─ Action buttons ─ */
        .sm-actions {
          display: flex; align-items: center;
          gap: 5px; justify-content: flex-end; flex-wrap: nowrap;
        }
        .sm-icon-btn {
          width: 32px; height: 32px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 8px; border: 1px solid #e8ecf0;
          background: #fff; cursor: pointer;
          transition: all .15s cubic-bezier(.4,0,.2,1);
          text-decoration: none; color: #a9b8b8; flex-shrink: 0;
        }
        .sm-icon-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,.08); }
        .sm-icon-btn--view:hover   { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .sm-icon-btn--hide:hover   { background: #fef3c7; color: #d97706; border-color: #fde68a; }
        .sm-icon-btn--show         { background: #fef3c7; color: #d97706; border-color: #fde68a; }
        .sm-icon-btn--show:hover   { background: #fde68a; }
        .sm-icon-btn--edit:hover   { background: #fffbeb; color: #b45309; border-color: #fde68a; }
        .sm-icon-btn--delete:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }

        /* ─ Responsive ─ */
        @media (max-width: 640px) {
          .sm-root { padding: 20px 16px; }
          .sm-header__title { font-size: 22px; }
          .sm-search { max-width: 100%; }
          .sm-toolbar { flex-direction: column; align-items: flex-start; }
          .sm-vis-tabs { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ServiceManager;