import { useState, useEffect, useCallback } from 'react';
import {
  Eye, Trash2, CheckCircle, XCircle, Clock, Search,
  RefreshCw, FileText, Download, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:      { label: 'Pending',      color: '#f59e0b', bg: '#fef3c7', icon: Clock        },
  under_review: { label: 'Under Review', color: '#3b82f6', bg: '#dbeafe', icon: RefreshCw    },
  approved:     { label: 'Approved',     color: '#10b981', bg: '#d1fae5', icon: CheckCircle  },
  rejected:     { label: 'Rejected',     color: '#ef4444', bg: '#fee2e2', icon: XCircle      },
};

const BRAND = '#1a598a';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
    }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function StatCard({ label, value, color, bg }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '18px 22px',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', flex: 1, minWidth: 120,
    }}>
      <p style={{ margin: 0, fontSize: 12, color: '#67787a', fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color }}>{value}</p>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ app, onClose, onStatusChange }) {
  const [status, setStatus]     = useState(app.status);
  const [notes,  setNotes]      = useState(app.adminNotes || '');
  const [saving, setSaving]     = useState(false);
  const [msg,    setMsg]        = useState('');

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/applications/${app._id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('✅ Status updated!');
        onStatusChange(app._id, status, notes);
      } else setMsg('❌ ' + data.message);
    } catch { setMsg('❌ Network error'); }
    setSaving(false);
  }

  const backendBase = API.replace('/api', '');

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 22 }}>
      <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 800, color: BRAND, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {title}
      </p>
      <div style={{ background: '#f8fafb', borderRadius: 10, padding: '14px 16px' }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
      <span style={{ minWidth: 160, fontSize: 12, color: '#67787a', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0c1e21', fontWeight: 500, flex: 1 }}>{value || '—'}</span>
    </div>
  );

  const DocLink = ({ label, url }) =>
    url ? (
      <a href={`${backendBase}${url}`} target="_blank" rel="noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
          color: BRAND, fontSize: 12, fontWeight: 600, textDecoration: 'none',
          background: '#e8f0f8', padding: '5px 12px', borderRadius: 6, marginTop: 4 }}>
        <Download size={12} /> {label}
      </a>
    ) : <span style={{ fontSize: 12, color: '#9ca3af' }}>No file uploaded</span>;

  const edu = app.education || {};
  const work = app.workExperience || {};

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center', padding: '20px 16px', overflowY: 'auto',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', padding: '32px 36px',
        marginTop: 20, position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0c1e21' }}>{app.fullName}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#67787a' }}>{app.email} · {app.contactNumber}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#67787a' }}>
            <X size={22} />
          </button>
        </div>

        {/* Personal */}
        <Section title="Personal Details">
          <Row label="Full Name"    value={app.fullName} />
          <Row label="Date of Birth" value={app.dob} />
          <Row label="Gender"       value={app.gender} />
          <Row label="Contact"      value={app.contactNumber} />
          <Row label="Email"        value={app.email} />
          <Row label="Country"      value={app.country} />
          <Row label="Address"      value={[app.address, app.city, app.zip].filter(Boolean).join(', ')} />
        </Section>

        {/* Education */}
        <Section title="Educational Details">
          {[
            { label: 'SSLC',       data: edu.sslc,    fileKey: 'document', isBoard: true },
            { label: 'Plus Two',   data: edu.plusTwo,  fileKey: 'document', isBoard: true },
            { label: 'Degree',     data: edu.degree,   fileKey: 'document', isBoard: false },
            { label: "Master's",   data: edu.masters,  fileKey: 'document', isBoard: false },
          ].map(({ label, data, isBoard }) => data && (
            <div key={label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed #ecf0f0' }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#0c1e21' }}>{label}</p>
              <Row label={isBoard ? 'Board'  : 'Course'} value={isBoard ? data.board : data.course} />
              <Row label="Year"                           value={data.year} />
              <Row label="Grade"                          value={data.grade} />
              <DocLink label={`${label} Certificate`}    url={data.document} />
            </div>
          ))}
          {edu.additional && (
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#0c1e21' }}>Additional Qualifications</p>
              <Row label="Details" value={edu.additional.details} />
              <DocLink label="Additional Cert" url={edu.additional.document} />
            </div>
          )}
        </Section>

        {/* Work */}
        <Section title="Work Experience">
          <Row label="Company"     value={work.company} />
          <Row label="Position"    value={work.position} />
          <Row label="Duration"    value={work.duration} />
          <Row label="Description" value={work.description} />
          <DocLink label="Experience Certificate" url={work.document} />
        </Section>

        {/* Payment */}
        <Section title="Payment">
          <Row label="Payment Method" value={app.paymentMethod} />
        </Section>

        {/* Admin controls */}
        <div style={{ background: '#f8fafb', borderRadius: 12, padding: '18px 20px', marginTop: 8 }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: BRAND, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Admin Actions
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setStatus(key)}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: '2px solid',
                  borderColor: status === key ? cfg.color : '#e5e7eb',
                  background: status === key ? cfg.bg : '#fff',
                  color: status === key ? cfg.color : '#67787a',
                  transition: 'all 0.2s',
                }}>
                {cfg.label}
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Admin notes (optional)…"
            rows={3}
            style={{
              width: '100%', borderRadius: 8, border: '1.5px solid #ecf0f0',
              padding: '10px 14px', fontSize: 13, fontFamily: 'inherit',
              resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handleSave} disabled={saving}
              style={{
                background: BRAND, color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {msg && <span style={{ fontSize: 13, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [stats,        setStats]        = useState({ total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0 });
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);
  const [filter,       setFilter]       = useState('all');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const [pagination,   setPagination]   = useState({ total: 0, pages: 1 });
  const [deleteId,     setDeleteId]     = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/admin/applications/stats`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {}
  }, []);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, status: filter });
      if (search) params.set('search', search);
      const res  = await fetch(`${API}/admin/applications?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
        setPagination(data.pagination);
      }
    } catch {}
    setLoading(false);
  }, [page, filter, search]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Reset page when filter/search changes
  useEffect(() => { setPage(1); }, [filter, search]);

  function handleStatusChange(id, newStatus, notes) {
    setApplications(prev =>
      prev.map(a => a._id === id ? { ...a, status: newStatus, adminNotes: notes } : a)
    );
    fetchStats();
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/admin/applications/${id}`, { method: 'DELETE', headers: authHeaders() });
      setApplications(prev => prev.filter(a => a._id !== id));
      setDeleteId(null);
      fetchStats();
    } catch {}
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', background: '#f8fafb', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0c1e21' }}>Applications</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#67787a' }}>Manage student application submissions</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard label="Total"        value={stats.total}        color="#0c1e21" />
        <StatCard label="Pending"      value={stats.pending}      color="#f59e0b" bg="#fef3c7" />
        <StatCard label="Under Review" value={stats.under_review} color="#3b82f6" bg="#dbeafe" />
        <StatCard label="Approved"     value={stats.approved}     color="#10b981" bg="#d1fae5" />
        <StatCard label="Rejected"     value={stats.rejected}     color="#ef4444" bg="#fee2e2" />
      </div>

      {/* Filters + search */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '16px 20px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                borderColor: filter === s ? BRAND : '#e5e7eb',
                background: filter === s ? BRAND : '#fff',
                color: filter === s ? '#fff' : '#67787a',
                transition: 'all 0.2s', textTransform: 'capitalize',
              }}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafb', borderRadius: 8, padding: '8px 14px', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={15} style={{ color: '#a9b8b8', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#0c1e21', width: '100%', fontFamily: 'inherit' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a9b8b8' }}><X size={13} /></button>}
        </div>

        <button onClick={fetchApplications} style={{ marginLeft: 'auto', background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: '#67787a', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#a9b8b8', fontSize: 14 }}>Loading…</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FileText size={40} style={{ color: '#e5e7eb', marginBottom: 12 }} />
            <p style={{ color: '#a9b8b8', fontSize: 14 }}>No applications found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ecf0f0', background: '#f8fafb' }}>
                  {['#', 'Name', 'Email', 'Phone', 'Country', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#67787a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '13px 16px', color: '#a9b8b8', fontSize: 12 }}>
                      {(page - 1) * 15 + idx + 1}
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: '#0c1e21', whiteSpace: 'nowrap' }}>{app.fullName}</td>
                    <td style={{ padding: '13px 16px', color: '#67787a' }}>{app.email}</td>
                    <td style={{ padding: '13px 16px', color: '#67787a', whiteSpace: 'nowrap' }}>{app.contactNumber}</td>
                    <td style={{ padding: '13px 16px', color: '#67787a' }}>{app.country || '—'}</td>
                    <td style={{ padding: '13px 16px', color: '#67787a', whiteSpace: 'nowrap' }}>{app.paymentMethod || '—'}</td>
                    <td style={{ padding: '13px 16px' }}><StatusBadge status={app.status} /></td>
                    <td style={{ padding: '13px 16px', color: '#a9b8b8', whiteSpace: 'nowrap', fontSize: 12 }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelected(app)}
                          style={{ background: '#e8f0f8', border: 'none', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: BRAND, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                          <Eye size={13} /> View
                        </button>
                        <button onClick={() => setDeleteId(app._id)}
                          style={{ background: '#fee2e2', border: 'none', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #ecf0f0' }}>
            <span style={{ fontSize: 12, color: '#67787a' }}>
              Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', cursor: page === 1 ? 'default' : 'pointer', background: '#fff', color: '#67787a', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ border: '1.5px solid', borderColor: page === p ? BRAND : '#e5e7eb', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', background: page === p ? BRAND : '#fff', color: page === p ? '#fff' : '#67787a', fontWeight: page === p ? 700 : 400, fontSize: 13 }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', cursor: page === pagination.pages ? 'default' : 'pointer', background: '#fff', color: '#67787a', opacity: page === pagination.pages ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, status, notes) => {
            handleStatusChange(id, status, notes);
            setSelected(prev => ({ ...prev, status, adminNotes: notes }));
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#0c1e21' }}>Delete Application?</h3>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#67787a' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ padding: '9px 24px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#67787a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}