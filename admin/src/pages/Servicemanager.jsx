import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ServiceManager = () => {
  const { api } = useAuth();
  const navigate = useNavigate();

  const [services, setServices]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [deleteId, setDeleteId]       = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]             = useState({ show: false, message: "", type: "" });
  const [search, setSearch]           = useState("");

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

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = services.filter(s => s.isActive).length;
  const inactiveCount = services.filter(s => !s.isActive).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sm-root">

      {/* ── Toast ── */}
      {toast.show && (
        <div className={"sm-toast sm-toast--" + toast.type}>
          <span className="sm-toast__icon">{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div className="sm-modal-backdrop" onClick={() => !deleteLoading && setDeleteId(null)}>
          <div className="sm-modal" onClick={e => e.stopPropagation()}>
            <div className="sm-modal__icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
          <div className="sm-header__eyebrow">Management</div>
          <h1 className="sm-header__title">Services</h1>
        </div>
        <button className="sm-btn sm-btn--primary" onClick={() => navigate("/services/new")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Add New Service
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="sm-stats">
        <div className="sm-stat">
          <div className="sm-stat__value">{services.length}</div>
          <div className="sm-stat__label">Total Services</div>
          <div className="sm-stat__bar sm-stat__bar--total"></div>
        </div>
        <div className="sm-stat">
          <div className="sm-stat__value sm-stat__value--green">{activeCount}</div>
          <div className="sm-stat__label">Active</div>
          <div className="sm-stat__bar sm-stat__bar--active"></div>
        </div>
        <div className="sm-stat">
          <div className="sm-stat__value sm-stat__value--red">{inactiveCount}</div>
          <div className="sm-stat__label">Inactive</div>
          <div className="sm-stat__bar sm-stat__bar--inactive"></div>
        </div>
        <div className="sm-stat">
          <div className="sm-stat__value sm-stat__value--blue">
            {services.reduce((a, s) => a + (s.faqs?.length || 0), 0)}
          </div>
          <div className="sm-stat__label">Total FAQs</div>
          <div className="sm-stat__bar sm-stat__bar--blue"></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sm-toolbar">
        <div className="sm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="sm-search__input"
            placeholder="Search services…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="sm-search__clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <span className="sm-toolbar__count">
          {filtered.length} of {services.length} services
        </span>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="sm-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            {[1,2,3,4].map(i => (
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
              {search ? (
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <h3 className="sm-empty__title">
              {search ? `No results for "${search}"` : "No services yet"}
            </h3>
            <p className="sm-empty__sub">
              {search ? "Try a different search term." : "Add your first service to get started."}
            </p>
            {!search && (
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
                {filtered.map((service, idx) => (
                  <tr key={service._id} className="sm-tr" style={{ animationDelay: idx * 40 + "ms" }}>

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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M3 9l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <div className="sm-thumb__fallback" style={{ display: "flex" }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 9l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="sm-service-info">
                          <span className="sm-service-name">{service.title}</span>
                          {service.subtitle && (
                            <span className="sm-service-sub">
                              {service.subtitle.length > 55 ? service.subtitle.slice(0, 55) + "…" : service.subtitle}
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
                      <span className="sm-count">{service.faqs?.length || 0}</span>
                    </td>

                    {/* Benefits */}
                    <td className="sm-td sm-td--center">
                      <span className="sm-count">{service.benefits?.length || 0}</span>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                        <button
                          className="sm-icon-btn sm-icon-btn--edit"
                          title="Edit"
                          onClick={() => navigate("/services/edit/" + service._id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <button
                          className="sm-icon-btn sm-icon-btn--delete"
                          title="Delete"
                          onClick={() => setDeleteId(service._id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* ─ Root ─ */
        .sm-root {
          padding: 0;
          position: relative;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ─ Toast ─ */
        .sm-toast {
          position: fixed; bottom: 24px; right: 24px;
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; border-radius: 10px;
          font-size: 13.5px; font-weight: 600;
          z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,.18);
          animation: smSlideUp .22s ease;
        }
        .sm-toast--success { background: #052e16; color: #86efac; border: 1px solid #166534; }
        .sm-toast--error   { background: #450a0a; color: #fca5a5; border: 1px solid #991b1b; }
        .sm-toast__icon    { font-size: 15px; }
        @keyframes smSlideUp {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* ─ Modal ─ */
        .sm-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 9998; backdrop-filter: blur(4px);
        }
        .sm-modal {
          background: #fff; border-radius: 16px;
          padding: 40px 32px; max-width: 400px; width: 90%;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,.22);
          animation: smPop .2s ease;
        }
        @keyframes smPop {
          from { transform: scale(.96); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .sm-modal__icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          background: #fee2e2; color: #ef4444;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .sm-modal__title { font-size: 18px; font-weight: 800; color: #111827; margin: 0 0 8px; }
        .sm-modal__body  { font-size: 14px; color: #6b7280; line-height: 1.65; margin: 0 0 24px; }
        .sm-modal__actions { display: flex; gap: 10px; justify-content: center; }

        /* ─ Buttons ─ */
        .sm-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px;
          font-size: 13.5px; font-weight: 700;
          border: none; cursor: pointer;
          transition: all .16s; white-space: nowrap; flex-shrink: 0;
          letter-spacing: .01em;
        }
        .sm-btn:disabled { opacity: .55; cursor: not-allowed; }
        .sm-btn--primary {
          background: #1d4ed8; color: #fff;
          box-shadow: 0 2px 8px rgba(29,78,216,.3);
        }
        .sm-btn--primary:hover:not(:disabled) { background: #1e40af; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(29,78,216,.35); }
        .sm-btn--ghost   { background: #f3f4f6; color: #374151; }
        .sm-btn--ghost:hover:not(:disabled)   { background: #e5e7eb; }
        .sm-btn--danger  { background: #ef4444; color: #fff; }
        .sm-btn--danger:hover:not(:disabled)  { background: #dc2626; }

        .sm-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: #fff; border-radius: 50%;
          animation: smSpin .65s linear infinite; display: inline-block;
        }
        @keyframes smSpin { to { transform: rotate(360deg); } }

        /* ─ Page Header ─ */
        .sm-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 22px;
          flex-wrap: wrap; gap: 12px;
        }
        .sm-header__eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: #1d4ed8; margin-bottom: 2px;
        }
        .sm-header__title {
          font-size: 24px; font-weight: 800; color: #0f172a; margin: 0;
          letter-spacing: -.02em;
        }

        /* ─ Stat Cards ─ */
        .sm-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .sm-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .sm-stat {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 18px 14px;
          position: relative;
          overflow: hidden;
        }
        .sm-stat__value {
          font-size: 28px; font-weight: 800; color: #0f172a;
          letter-spacing: -.03em; line-height: 1;
        }
        .sm-stat__value--green { color: #16a34a; }
        .sm-stat__value--red   { color: #dc2626; }
        .sm-stat__value--blue  { color: #1d4ed8; }
        .sm-stat__label {
          font-size: 12px; font-weight: 600; color: #9ca3af;
          margin-top: 4px; text-transform: uppercase; letter-spacing: .06em;
        }
        .sm-stat__bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px;
        }
        .sm-stat__bar--total    { background: linear-gradient(90deg, #64748b, #94a3b8); }
        .sm-stat__bar--active   { background: linear-gradient(90deg, #16a34a, #4ade80); }
        .sm-stat__bar--inactive { background: linear-gradient(90deg, #dc2626, #f87171); }
        .sm-stat__bar--blue     { background: linear-gradient(90deg, #1d4ed8, #60a5fa); }

        /* ─ Toolbar ─ */
        .sm-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .sm-search {
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e5e7eb;
          border-radius: 9px; padding: 0 12px;
          flex: 1; max-width: 340px;
          transition: border .15s, box-shadow .15s;
        }
        .sm-search:focus-within {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,.1);
        }
        .sm-search svg { color: #9ca3af; flex-shrink: 0; }
        .sm-search__input {
          flex: 1; border: none; outline: none;
          font-size: 13.5px; color: #111827;
          padding: 9px 0; background: transparent;
        }
        .sm-search__clear {
          border: none; background: none; cursor: pointer;
          color: #9ca3af; font-size: 12px; padding: 2px 4px;
        }
        .sm-search__clear:hover { color: #374151; }
        .sm-toolbar__count {
          font-size: 12.5px; color: #9ca3af; font-weight: 500; white-space: nowrap;
        }

        /* ─ Error ─ */
        .sm-error {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 16px; border-radius: 9px; font-size: 14px;
          margin-bottom: 16px;
          background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;
        }

        /* ─ Card ─ */
        .sm-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
        }

        /* ─ Skeleton ─ */
        .sm-skeleton-list { padding: 0 20px; }
        .sm-skeleton-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 0; border-bottom: 1px solid #f3f4f6;
        }
        .sm-skeleton-row:last-child { border-bottom: none; }
        .sm-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: smShimmer 1.5s ease-in-out infinite;
        }
        @keyframes smShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sm-skel--thumb   { width: 46px; height: 34px; border-radius: 7px; flex-shrink: 0; }
        .sm-skel-group    { flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .sm-skel--title   { height: 13px; width: 50%; }
        .sm-skel--sub     { height: 11px; width: 30%; }
        .sm-skel--badge   { height: 20px; width: 60px; border-radius: 20px; }
        .sm-skel--status  { height: 24px; width: 72px; border-radius: 20px; }
        .sm-skel--actions { height: 28px; width: 88px; border-radius: 8px; }

        /* ─ Empty ─ */
        .sm-empty {
          padding: 64px 32px; text-align: center;
        }
        .sm-empty__icon {
          width: 72px; height: 72px; border-radius: 18px;
          background: #f8fafc; border: 1px solid #e5e7eb;
          color: #cbd5e1;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .sm-empty__title { font-size: 16px; font-weight: 700; color: #374151; margin: 0 0 6px; }
        .sm-empty__sub   { font-size: 13.5px; color: #9ca3af; margin: 0 0 22px; }

        /* ─ Table ─ */
        .sm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .sm-table {
          width: 100%; border-collapse: collapse;
          font-size: 13.5px; table-layout: auto;
        }
        .sm-th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11px; font-weight: 700;
          color: #9ca3af; text-transform: uppercase; letter-spacing: .07em;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }
        .sm-th--service { min-width: 220px; }
        .sm-th--center  { text-align: center !important; }
        .sm-th--right   { text-align: right !important; min-width: 110px; }

        .sm-tr {
          animation: smFadeIn .3s ease both;
          transition: background .12s;
        }
        .sm-tr:hover .sm-td { background: #f8fafc; }
        @keyframes smFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sm-td {
          padding: 13px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          transition: background .12s;
        }
        .sm-table tbody tr:last-child .sm-td { border-bottom: none; }
        .sm-td--center { text-align: center !important; }
        .sm-td--right  { text-align: right  !important; }

        /* ─ Service cell ─ */
        .sm-service-cell {
          display: flex; align-items: center; gap: 11px; min-width: 0;
        }
        .sm-thumb {
          width: 46px; height: 34px; border-radius: 7px;
          overflow: hidden; flex-shrink: 0;
          background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #e5e7eb;
        }
        .sm-thumb img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .sm-thumb__fallback {
          width: 100%; height: 100%;
          align-items: center; justify-content: center;
          color: #cbd5e1;
        }
        .sm-service-info {
          display: flex; flex-direction: column; gap: 2px; min-width: 0;
        }
        .sm-service-name {
          font-weight: 700; color: #0f172a; font-size: 13.5px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sm-service-sub {
          font-size: 12px; color: #94a3b8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ─ Slug ─ */
        .sm-slug {
          background: #f1f5f9; color: #475569;
          padding: 3px 8px; border-radius: 5px;
          font-size: 12px; font-family: 'Courier New', monospace;
          white-space: nowrap; border: 1px solid #e2e8f0;
        }

        /* ─ Count / Order ─ */
        .sm-count {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 26px; height: 22px;
          background: #eff6ff; color: #1d4ed8;
          padding: 0 8px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
        }
        .sm-order {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 26px; height: 22px;
          background: #f1f5f9; color: #64748b;
          padding: 0 8px; border-radius: 6px;
          font-size: 12px; font-weight: 700;
        }

        /* ─ Status ─ */
        .sm-status {
          display: inline-flex; align-items: center; gap: 5px;
          border: none; cursor: pointer;
          padding: 4px 11px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          transition: all .15s; white-space: nowrap;
        }
        .sm-status:hover { opacity: .8; transform: scale(.97); }
        .sm-status__dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .sm-status--on  { background: #dcfce7; color: #15803d; }
        .sm-status--on  .sm-status__dot { background: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.2); }
        .sm-status--off { background: #fee2e2; color: #b91c1c; }
        .sm-status--off .sm-status__dot { background: #dc2626; }

        /* ─ Action buttons ─ */
        .sm-actions {
          display: flex; align-items: center;
          gap: 4px; justify-content: flex-end; flex-wrap: nowrap;
        }
        .sm-icon-btn {
          width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 7px; border: 1px solid #e5e7eb;
          background: #fff; cursor: pointer;
          transition: all .14s; text-decoration: none;
          color: #94a3b8; flex-shrink: 0;
        }
        .sm-icon-btn:hover { transform: translateY(-1px); }
        .sm-icon-btn--view:hover   { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .sm-icon-btn--edit:hover   { background: #fefce8; color: #a16207; border-color: #fde68a; }
        .sm-icon-btn--delete:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }
      `}</style>
    </div>
  );
};

export default ServiceManager;