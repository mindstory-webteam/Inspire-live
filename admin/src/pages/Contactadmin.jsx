/**
 * ContactAdmin.jsx
 * Full admin panel for contact form submissions
 */
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/api';
import {
  Mail, Search, Trash2, Eye, X, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Phone, AtSign, MessageSquare,
  Archive, RefreshCw, Users, Clock, MailOpen, Send,
} from 'lucide-react';

/* ─── base styles ─────────────────────────────────────────────────────────── */
const IS = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db',
  borderRadius: 8, fontSize: 14, color: '#111827', background: '#fff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

function B(v, sm) {
  const base = {
    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    fontSize: sm ? 12 : 14, display: 'inline-flex', alignItems: 'center',
    gap: 6, padding: sm ? '5px 10px' : '9px 18px', whiteSpace: 'nowrap',
  };
  if (v === 'primary') return { ...base, background: 'linear-gradient(135deg,#1a598a,#015599)', color: '#fff' };
  if (v === 'danger')  return { ...base, background: '#ef4444', color: '#fff' };
  if (v === 'ghost')   return { ...base, background: '#f3f4f6', color: '#374151' };
  if (v === 'blue')    return { ...base, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' };
  if (v === 'green')   return { ...base, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
  if (v === 'amber')   return { ...base, background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' };
  if (v === 'red')     return { ...base, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
  if (v === 'purple')  return { ...base, background: '#faf5ff', color: '#7c3aed', border: '1px solid #ddd6fe' };
  return base;
}

/* ─── status config ───────────────────────────────────────────────────────── */
const SC = {
  new:      { bg: '#fefce8', color: '#854d0e', border: '#fde68a', label: 'New' },
  read:     { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Read' },
  replied:  { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Replied' },
  archived: { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb', label: 'Archived' },
};

const STATUS_ICON = {
  new:      <Clock size={14} />,
  read:     <MailOpen size={14} />,
  replied:  <Send size={14} />,
  archived: <Archive size={14} />,
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999, background: type === 'error' ? '#ef4444' : '#22c55e', color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,.2)', maxWidth: 380 }}>
      {type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function Modal({ title, onClose, children, size = 'md' }) {
  const maxW = { lg: 720, md: 560, sm: 420 }[size] || 560;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div onMouseDown={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: maxW, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}><X size={15} /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Confirm ────────────────────────────────────────────────────────────── */
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel} size="sm">
      <p style={{ color: '#374151', margin: '0 0 20px' }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={B('ghost')}>Cancel</button>
        <button onClick={onConfirm} style={B('danger')}>Delete</button>
      </div>
    </Modal>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── StatusBadge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const sc = SC[status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb', label: status };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {STATUS_ICON[status]}{sc.label}
    </span>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────────── */
function ContactDetail({ contact, onStatusChange, onClose }) {
  const sc = SC[contact.status] || SC.new;

  return (
    <Modal title="Contact Details" onClose={onClose} size="lg">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#1a598a,#015599)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
            {contact.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111827', fontSize: 17 }}>{contact.fullName}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{formatDate(contact.createdAt)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <StatusBadge status={contact.status} />
          <select
            value={contact.status}
            onChange={e => onStatusChange(contact._id, e.target.value)}
            style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            {Object.entries(SC).map(([v, c]) => (
              <option key={v} value={v}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <AtSign size={11} /> Email
          </div>
          <a href={`mailto:${contact.email}`} style={{ fontSize: 14, color: '#1a598a', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>{contact.email}</a>
        </div>
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Phone size={11} /> Phone
          </div>
          {contact.phone
            ? <a href={`tel:${contact.phone}`} style={{ fontSize: 14, color: '#374151', fontWeight: 600, textDecoration: 'none' }}>{contact.phone}</a>
            : <span style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>}
        </div>
        {contact.service && (
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Service Interested In</div>
            <span style={{ fontSize: 13, color: '#111827', fontWeight: 600 }}>{contact.service}</span>
          </div>
        )}
      </div>

      {/* Message */}
      <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <MessageSquare size={11} /> Message
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{contact.message}</p>
      </div>

      {/* Quick reply */}
      <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10 }}>
        <a href={`mailto:${contact.email}?subject=Re: Your enquiry`}
          style={{ ...B('primary'), textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
          <Mail size={14} /> Reply via Email
        </a>
        <button onClick={onClose} style={{ ...B('ghost') }}>Close</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function ContactAdmin() {
  const [contacts,    setContacts]    = useState([]);
  const [stats,       setStats]       = useState(null);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [selected,    setSelected]    = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [toast,       setToast]       = useState(null);
  const [bulkIds,     setBulkIds]     = useState([]);

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  const loadStats = useCallback(async () => {
    try { const r = await contactService.getStats(); if (r.data?.success) setStats(r.data.data); } catch { /**/ }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (filter !== 'all') params.status = filter;
      const r = await contactService.getAll(params);
      if (r.data?.success) {
        setContacts(r.data.data);
        setTotalPages(r.data.pagination?.totalPages || 1);
        setTotal(r.data.pagination?.total || 0);
      }
    } catch { /**/ }
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { loadStats(); },    [loadStats]);
  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleOpen = async (contact) => {
    try {
      const r = await contactService.getById(contact._id);
      if (r.data?.success) {
        setSelected(r.data.data);
        // update local list if status changed to 'read'
        setContacts(prev => prev.map(c => c._id === contact._id && c.status === 'new' ? { ...c, status: 'read' } : c));
        loadStats();
      }
    } catch { showToast('Failed to load contact', 'error'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const r = await contactService.updateStatus(id, status);
      if (r.data?.success) {
        showToast('Status updated');
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
        loadStats();
      }
    } catch { showToast('Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      const r = await contactService.delete(id);
      if (r.data?.success) {
        showToast('Deleted');
        if (selected?._id === id) setSelected(null);
        loadContacts(); loadStats();
      }
    } catch { showToast('Delete failed', 'error'); }
    setConfirm(null);
  };

  const handleBulkDelete = async () => {
    try {
      const r = await contactService.bulkDelete(bulkIds);
      if (r.data?.success) {
        showToast(r.data.message);
        setBulkIds([]);
        loadContacts(); loadStats();
      }
    } catch { showToast('Bulk delete failed', 'error'); }
    setConfirm(null);
  };

  const toggleBulk = (id) => setBulkIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAllBulk = () => setBulkIds(bulkIds.length === contacts.length ? [] : contacts.map(c => c._id));

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Contact Messages</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Manage enquiries from your contact form</p>
        </div>
        <button onClick={() => { loadContacts(); loadStats(); }} style={B('ghost')}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 12, marginBottom: 22 }}>
          <StatCard label="Total"      value={stats.total}      color="#2563eb" icon={<Users size={19} color="#2563eb" />} />
          <StatCard label="New"        value={stats.new}        color="#f59e0b" icon={<Clock size={19} color="#f59e0b" />} />
          <StatCard label="Read"       value={stats.read}       color="#3b82f6" icon={<MailOpen size={19} color="#3b82f6" />} />
          <StatCard label="Replied"    value={stats.replied}    color="#22c55e" icon={<Send size={19} color="#22c55e" />} />
          <StatCard label="Last 30d"   value={stats.last30Days} color="#7c3aed" icon={<Mail size={19} color="#7c3aed" />} />
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input style={{ ...IS, paddingLeft: 32, width: 230 }} placeholder="Search name, email, message…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['new', 'New'], ['read', 'Read'], ['replied', 'Replied'], ['archived', 'Archived']].map(([v, l]) => (
            <button key={v} onClick={() => { setFilter(v); setPage(1); }}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: filter === v ? '#1a598a' : '#f3f4f6', color: filter === v ? '#fff' : '#374151' }}>
              {l}
              {v !== 'all' && stats?.[v] > 0 && (
                <span style={{ marginLeft: 5, background: filter === v ? 'rgba(255,255,255,.25)' : '#e5e7eb', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                  {stats[v]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {bulkIds.length > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{bulkIds.length} selected</span>
            <button onClick={() => setConfirm({ type: 'bulk' })} style={B('danger', true)}>
              <Trash2 size={13} /> Delete Selected
            </button>
            <button onClick={() => setBulkIds([])} style={B('ghost', true)}>Clear</button>
          </div>
        )}
        {bulkIds.length === 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af' }}>{total} message{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#1a598a', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
            <Mail size={38} style={{ marginBottom: 10, opacity: 0.35 }} />
            <div style={{ fontWeight: 600, fontSize: 15 }}>No messages found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Messages from your contact form will appear here</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '10px 14px', width: 40 }}>
                    <input type="checkbox" checked={bulkIds.length === contacts.length && contacts.length > 0}
                      onChange={toggleAllBulk} style={{ cursor: 'pointer' }} />
                  </th>
                  {['Sender', 'Service', 'Message Preview', 'Status', 'Received', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c._id}
                    style={{ borderBottom: i < contacts.length - 1 ? '1px solid #f3f4f6' : 'none', background: c.status === 'new' ? '#fffbf0' : '' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = c.status === 'new' ? '#fffbf0' : ''}>
                    <td style={{ padding: '12px 14px' }}>
                      <input type="checkbox" checked={bulkIds.includes(c._id)} onChange={() => toggleBulk(c._id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#1a598a,#015599)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                          {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: c.status === 'new' ? 700 : 600, color: '#111827', fontSize: 14 }}>{c.fullName}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>
                      {c.service
                        ? <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{c.service}</span>
                        : <span style={{ color: '#d1d5db', fontStyle: 'italic', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: 260 }}>
                      <div style={{ fontSize: 13, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.message}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={c.status} />
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {timeAgo(c.createdAt)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button title="View" onClick={() => handleOpen(c)} style={B('blue', true)}><Eye size={12} /></button>
                        <select title="Change status" value={c.status} onChange={e => handleStatusChange(c._id, e.target.value)}
                          style={{ padding: '4px 6px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                          {Object.entries(SC).map(([v, sc]) => (
                            <option key={v} value={v}>{sc.label}</option>
                          ))}
                        </select>
                        <button title="Delete" onClick={() => setConfirm({ type: 'single', id: c._id, name: c.fullName })} style={B('red', true)}>
                          <Trash2 size={12} />
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
        {totalPages > 1 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: p === page ? '#1a598a' : '#f3f4f6', color: p === page ? '#fff' : '#374151' }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ContactDetail
          contact={selected}
          onStatusChange={handleStatusChange}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Confirm delete */}
      {confirm?.type === 'single' && (
        <Confirm
          message={`Delete message from "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'bulk' && (
        <Confirm
          message={`Delete ${bulkIds.length} selected message(s)? This cannot be undone.`}
          onConfirm={handleBulkDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}