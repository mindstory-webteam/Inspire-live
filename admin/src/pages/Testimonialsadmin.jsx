/**
 * src/pages/Testimonialsadmin.jsx
 * Testimonials admin page — uses testimonialService from src/services/api.js
 */

import { useEffect, useRef, useState } from 'react';
import { testimonialService } from '../services/api';

// ── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, readOnly = false }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        onClick={() => !readOnly && onChange(s)}
        style={{
          fontSize: readOnly ? 14 : 22,
          color: s <= value ? '#f59e0b' : '#d1d5db',
          cursor: readOnly ? 'default' : 'pointer',
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
      >★</span>
    ))}
  </div>
);

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY = {
  authorName: '', authorDesig: '', desc2: '',
  rating: 5, isActive: true, order: 0,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function TestimonialsAdmin() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [imgPrev,       setImgPrev]       = useState(null);
  const [logoPrev,      setLogoPrev]      = useState(null);
  const [logoLightPrev, setLogoLightPrev] = useState(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const imgRef       = useRef();
  const logoRef      = useRef();
  const logoLightRef = useRef();

  // Auto-clear success
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const res = await testimonialService.getAll({ search, status });
      setItems(res.data?.data || []);
    } catch {
      setError('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, status]);

  // ── Open / close form ─────────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null); setForm(EMPTY);
    setImgPrev(null); setLogoPrev(null); setLogoLightPrev(null);
    [imgRef, logoRef, logoLightRef].forEach(r => { if (r.current) r.current.value = ''; });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      authorName:  item.authorName  || '',
      authorDesig: item.authorDesig || '',
      desc2:       item.desc2       || '',
      rating:      item.rating      || 5,
      isActive:    item.isActive    ?? true,
      order:       item.order       ?? 0,
    });
    setImgPrev(item.img           || null);
    setLogoPrev(item.logoImg      || null);
    setLogoLightPrev(item.logoImgLight || null);
    [imgRef, logoRef, logoLightRef].forEach(r => { if (r.current) r.current.value = ''; });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditId(null); };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.desc2.trim()) {
      setError('Author name and testimonial text are required.');
      return;
    }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgRef.current?.files[0])       fd.append('img',          imgRef.current.files[0]);
      if (logoRef.current?.files[0])      fd.append('logoImg',      logoRef.current.files[0]);
      if (logoLightRef.current?.files[0]) fd.append('logoImgLight', logoLightRef.current.files[0]);

      if (editId) {
        await testimonialService.update(editId, fd);
        setSuccess('Testimonial updated!');
      } else {
        await testimonialService.create(fd);
        setSuccess('Testimonial created!');
      }
      closeForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle / Delete ───────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try { await testimonialService.toggle(id); load(); }
    catch { setError('Toggle failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this testimonial?')) return;
    setDeleting(id);
    try {
      await testimonialService.delete(id);
      setSuccess('Testimonial deleted.');
      load();
    } catch { setError('Delete failed.'); }
    finally { setDeleting(null); }
  };

  // ── File preview ──────────────────────────────────────────────────────────
  const preview = (e, set) => {
    const f = e.target.files[0];
    if (f) set(URL.createObjectURL(f));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Testimonials</h1>
          <p style={S.subtitle}>{items.length} testimonial{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} style={S.btnPrimary}>+ Add Testimonial</button>
      </div>

      {/* Alerts */}
      {error && (
        <div style={S.alertErr}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={S.closeBtn}>×</button>
        </div>
      )}
      {success && (
        <div style={S.alertOk}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={S.closeBtn}>×</button>
        </div>
      )}

      {/* Filters */}
      <div style={S.filters}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, designation, text…"
          style={S.searchInput}
        />
        <select value={status} onChange={e => setStatus(e.target.value)} style={S.select}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={S.center}><div style={S.spinner} /></div>
      ) : items.length === 0 ? (
        <div style={S.empty}>
          <p style={{ color: '#94a3b8', marginBottom: 16 }}>No testimonials found.</p>
          <button onClick={openCreate} style={S.btnPrimary}>Add first testimonial</button>
        </div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Photo', 'Author', 'Designation', 'Review', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} style={S.tr}>
                  {/* Photo */}
                  <td style={S.td}>
                    {item.img ? (
                      <img
                        src={item.img} alt=""
                        style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.authorName)}&background=1a598a&color=fff`; }}
                      />
                    ) : (
                      <div style={S.avatar}>{item.authorName?.[0]?.toUpperCase() || '?'}</div>
                    )}
                  </td>
                  {/* Author */}
                  <td style={{ ...S.td, fontWeight: 600, color: '#0f2942' }}>{item.authorName}</td>
                  {/* Designation */}
                  <td style={{ ...S.td, color: '#64748b', fontSize: 13 }}>{item.authorDesig || '—'}</td>
                  {/* Review */}
                  <td style={{ ...S.td, maxWidth: 260 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 13, color: '#374151' }}>
                      {item.desc2}
                    </span>
                  </td>
                  {/* Rating */}
                  <td style={S.td}>
                    <StarRating value={item.rating || 5} readOnly />
                  </td>
                  {/* Status */}
                  <td style={S.td}>
                    <button
                      onClick={() => handleToggle(item._id)}
                      style={item.isActive ? S.badgeActive : S.badgeInactive}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  {/* Actions */}
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(item)} style={S.btnEdit}>Edit</button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting === item._id}
                        style={S.btnDelete}
                      >
                        {deleting === item._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Form ── */}
      {showForm && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div style={S.modal}>
            {/* Modal header */}
            <div style={S.modalHeader}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f2942' }}>
                {editId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={closeForm} style={S.modalClose}>×</button>
            </div>

            {error && (
              <div style={{ ...S.alertErr, margin: '0 24px 16px' }}>
                <span>{error}</span>
                <button onClick={() => setError('')} style={S.closeBtn}>×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={S.form}>

              {/* Author Name */}
              <div style={S.field}>
                <label style={S.label}>Author Name *</label>
                <input
                  required
                  value={form.authorName}
                  onChange={e => setForm({ ...form, authorName: e.target.value })}
                  placeholder="e.g. Dr. Sarah Johnson"
                  style={S.input}
                />
              </div>

              {/* Designation */}
              <div style={S.field}>
                <label style={S.label}>Designation</label>
                <input
                  value={form.authorDesig}
                  onChange={e => setForm({ ...form, authorDesig: e.target.value })}
                  placeholder="e.g. CEO, Acme Corp"
                  style={S.input}
                />
              </div>

              {/* Testimonial text */}
              <div style={S.field}>
                <label style={S.label}>Testimonial Text *</label>
                <textarea
                  required
                  rows={4}
                  value={form.desc2}
                  onChange={e => setForm({ ...form, desc2: e.target.value })}
                  placeholder="Write the testimonial here…"
                  style={{ ...S.input, resize: 'vertical' }}
                />
              </div>

              {/* Rating */}
              <div style={S.field}>
                <label style={S.label}>Rating</label>
                <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
              </div>

              {/* Author photo */}
              <div style={S.field}>
                <label style={S.label}>Author Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {imgPrev && (
                    <img src={imgPrev} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  )}
                  <input type="file" accept="image/*" ref={imgRef} onChange={e => preview(e, setImgPrev)} style={S.fileInput} />
                </div>
              </div>

              {/* Company Logo */}
              <div style={S.field}>
                <label style={S.label}>Company Logo (Dark)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {logoPrev && (
                    <img src={logoPrev} alt="" style={{ height: 32, objectFit: 'contain', border: '1px solid #e2e8f0', padding: 4, borderRadius: 6 }} />
                  )}
                  <input type="file" accept="image/*" ref={logoRef} onChange={e => preview(e, setLogoPrev)} style={S.fileInput} />
                </div>
              </div>

              {/* Company Logo Light */}
              <div style={S.field}>
                <label style={S.label}>Company Logo (Light)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {logoLightPrev && (
                    <img src={logoLightPrev} alt="" style={{ height: 32, objectFit: 'contain', background: '#1e293b', padding: '4px 8px', borderRadius: 6 }} />
                  )}
                  <input type="file" accept="image/*" ref={logoLightRef} onChange={e => preview(e, setLogoLightPrev)} style={S.fileInput} />
                </div>
              </div>

              {/* Order + Active row */}
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                <div style={{ ...S.field, flex: 'none' }}>
                  <label style={S.label}>Display Order</label>
                  <input
                    type="number" min={0}
                    value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })}
                    style={{ ...S.input, width: 90 }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', paddingBottom: 9 }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Active</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9', marginTop: 4 }}>
                <button type="submit" disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeForm} style={S.btnCancel}>Cancel</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page:        { padding: '32px', fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 1200, margin: '0 auto' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:       { margin: 0, fontSize: 26, fontWeight: 700, color: '#0f2942' },
  subtitle:    { margin: '4px 0 0', color: '#64748b', fontSize: 14 },
  filters:     { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 220, padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', color: '#0f2942' },
  select:      { padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer', color: '#374151' },
  tableWrap:   { overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0' },
  tr:          { borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s' },
  td:          { padding: '13px 16px', verticalAlign: 'middle', fontSize: 14 },
  avatar:      { width: 46, height: 46, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a598a', fontSize: 17 },
  badgeActive: { padding: '3px 11px', borderRadius: 20, border: 'none', cursor: 'pointer', background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600 },
  badgeInactive:{ padding: '3px 11px', borderRadius: 20, border: 'none', cursor: 'pointer', background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 600 },
  btnEdit:     { padding: '6px 14px', borderRadius: 6, border: '1px solid #1a598a', background: '#fff', color: '#1a598a', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  btnDelete:   { padding: '6px 14px', borderRadius: 6, border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  btnPrimary:  { padding: '10px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#1a598a,#015599)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnCancel:   { padding: '10px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: 14, cursor: 'pointer' },
  alertErr:    { background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  alertOk:     { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  closeBtn:    { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', lineHeight: 1, color: 'inherit', flexShrink: 0 },
  center:      { display: 'flex', justifyContent: 'center', padding: 60 },
  spinner:     { width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1a598a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  empty:       { textAlign: 'center', padding: '60px 0' },
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal:       { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' },
  modalClose:  { background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 },
  form:        { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
  field:       { display: 'flex', flexDirection: 'column', gap: 6 },
  label:       { fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input:       { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', color: '#0f2942' },
  fileInput:   { fontSize: 13, color: '#374151' },
};