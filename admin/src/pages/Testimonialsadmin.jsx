/**
 * Admin Panel — Testimonials Management
 * src/pages/Testimonials.jsx  (or wherever your admin routes live)
 *
 * Uses: testimonialApi.js  +  your existing axios `api` instance from api.js
 * Add to api.js:
 *   export const testimonialService = {
 *     getAll:    (params)      => api.get('/admin/testimonials', { params }),
 *     create:    (formData)    => api.post('/admin/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
 *     update:    (id, formData)=> api.put(`/admin/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
 *     toggle:    (id)          => api.patch(`/admin/testimonials/${id}/toggle`),
 *     reorder:   (data)        => api.patch('/admin/testimonials/reorder', data),
 *     delete:    (id)          => api.delete(`/admin/testimonials/${id}`),
 *   };
 */

import { useEffect, useRef, useState } from 'react';
import { testimonialService } from '../services/api'; // Adjust the import path as needed

// ── helpers ───────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  authorName:  '',
  authorDesig: '',
  desc2:       '',
  rating:      5,
  isActive:    true,
  order:       0,
};

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 22, color: s <= value ? '#f59e0b' : '#d1d5db', padding: 0,
        }}
      >★</button>
    ))}
  </div>
);

// ── component ─────────────────────────────────────────────────────────────────
export default function TestimonialsAdmin() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null); // null = create
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [imgPreview,       setImgPreview]       = useState(null);
  const [logoPreview,      setLogoPreview]      = useState(null);
  const [logoLightPreview, setLogoLightPreview] = useState(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const imgRef       = useRef();
  const logoRef      = useRef();
  const logoLightRef = useRef();

  // ── fetch ──────────────────────────────────────────────────────────────────
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

  // ── open form ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImgPreview(null); setLogoPreview(null); setLogoLightPreview(null);
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      authorName:  item.authorName  || '',
      authorDesig: item.authorDesig || '',
      desc2:       item.desc2       || '',
      rating:      item.rating      || 5,
      isActive:    item.isActive    ?? true,
      order:       item.order       ?? 0,
    });
    setImgPreview(item.img             || null);
    setLogoPreview(item.logoImg        || null);
    setLogoLightPreview(item.logoImgLight || null);
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.desc2.trim()) {
      setError('Author name and testimonial text are required.');
      return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgRef.current?.files[0])       fd.append('img',          imgRef.current.files[0]);
      if (logoRef.current?.files[0])      fd.append('logoImg',      logoRef.current.files[0]);
      if (logoLightRef.current?.files[0]) fd.append('logoImgLight', logoLightRef.current.files[0]);

      if (editing) {
        await testimonialService.update(editing, fd);
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

  // ── toggle ─────────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await testimonialService.toggle(id);
      load();
    } catch { setError('Toggle failed.'); }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    setDeleting(id);
    try {
      await testimonialService.delete(id);
      setSuccess('Deleted successfully.');
      load();
    } catch { setError('Delete failed.'); }
    finally { setDeleting(null); }
  };

  // ── file preview helper ────────────────────────────────────────────────────
  const previewFile = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f2942' }}>
            Testimonials
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {items.length} testimonial{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} style={primaryBtn}>+ Add Testimonial</button>
      </div>

      {/* Alerts */}
      {error   && <div style={alertStyle('#fee2e2','#991b1b')}>{error}   <button onClick={() => setError('')}   style={closeAlertBtn}>×</button></div>}
      {success && <div style={alertStyle('#dcfce7','#166534')}>{success} <button onClick={() => setSuccess('')} style={closeAlertBtn}>×</button></div>}

      {/* Filters */}
      <div style={filtersRow}>
        <input
          placeholder="Search by name, designation, text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          No testimonials found.{' '}
          <button onClick={openCreate} style={{ ...primaryBtn, marginLeft: 8 }}>Add one</button>
        </div>
      ) : (
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Photo', 'Author', 'Designation', 'Review', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} style={trStyle}>
                  <td style={tdStyle}>
                    {item.img ? (
                      <img src={item.img} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={avatarPlaceholder}>{item.authorName?.[0] || '?'}</div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#0f2942' }}>{item.authorName}</td>
                  <td style={{ ...tdStyle, color: '#64748b', fontSize: 13 }}>{item.authorDesig || '—'}</td>
                  <td style={{ ...tdStyle, maxWidth: 260, color: '#374151', fontSize: 13 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.desc2}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#f59e0b', fontSize: 15 }}>{'★'.repeat(item.rating || 5)}</span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleToggle(item._id)}
                      style={item.isActive ? activeBadge : inactiveBadge}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(item)} style={editBtn}>Edit</button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting === item._id}
                        style={deleteBtn}
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

      {/* Modal form */}
      {showForm && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f2942' }}>
                {editing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={closeForm} style={modalClose}>×</button>
            </div>

            {error && <div style={alertStyle('#fee2e2','#991b1b')}>{error}</div>}

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={formRow}>
                <label style={labelStyle}>Author Name *</label>
                <input
                  required
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Dr. Sarah Johnson"
                />
              </div>

              <div style={formRow}>
                <label style={labelStyle}>Designation</label>
                <input
                  value={form.authorDesig}
                  onChange={(e) => setForm({ ...form, authorDesig: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. PhD, University of Cambridge"
                />
              </div>

              <div style={formRow}>
                <label style={labelStyle}>Testimonial Text *</label>
                <textarea
                  required
                  rows={4}
                  value={form.desc2}
                  onChange={(e) => setForm({ ...form, desc2: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Write the testimonial here…"
                />
              </div>

              <div style={formRow}>
                <label style={labelStyle}>Rating</label>
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>

              {/* Author photo */}
              <div style={formRow}>
                <label style={labelStyle}>Author Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {imgPreview && (
                    <img src={imgPreview} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={imgRef}
                    onChange={(e) => previewFile(e, setImgPreview)}
                    style={fileInput}
                  />
                </div>
              </div>

              {/* Logo */}
              <div style={formRow}>
                <label style={labelStyle}>Company Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {logoPreview && (
                    <img src={logoPreview} alt="" style={{ height: 32, objectFit: 'contain' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoRef}
                    onChange={(e) => previewFile(e, setLogoPreview)}
                    style={fileInput}
                  />
                </div>
              </div>

              {/* Logo light */}
              <div style={formRow}>
                <label style={labelStyle}>Company Logo (Light)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {logoLightPreview && (
                    <img src={logoLightPreview} alt="" style={{ height: 32, objectFit: 'contain', background: '#1e293b', padding: '4px 8px', borderRadius: 4 }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoLightRef}
                    onChange={(e) => previewFile(e, setLogoLightPreview)}
                    style={fileInput}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={formRow}>
                  <label style={labelStyle}>Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    style={{ ...inputStyle, width: 80 }}
                  />
                </div>
                <div style={{ ...formRow, flex: 'none' }}>
                  <label style={labelStyle}>Active</label>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={saving} style={primaryBtn}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeForm} style={cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const pageStyle    = { padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto' };
const headerStyle  = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 };
const filtersRow   = { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' };
const searchInput  = { flex: 1, minWidth: 220, padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' };
const selectStyle  = { padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' };
const tableWrap    = { overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' };
const tableStyle   = { width: '100%', borderCollapse: 'collapse' };
const thStyle      = { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' };
const tdStyle      = { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };
const trStyle      = { transition: 'background 0.15s' };
const avatarPlaceholder = { width: 48, height: 48, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a598a', fontSize: 18 };
const activeBadge  = { padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600 };
const inactiveBadge = { padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 600 };
const editBtn      = { padding: '6px 14px', borderRadius: 6, border: '1px solid #1a598a', background: '#fff', color: '#1a598a', fontSize: 13, cursor: 'pointer', fontWeight: 500 };
const deleteBtn    = { padding: '6px 14px', borderRadius: 6, border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontSize: 13, cursor: 'pointer', fontWeight: 500 };
const primaryBtn   = { padding: '10px 22px', borderRadius: 8, border: 'none', background: '#1a598a', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' };
const cancelBtn    = { padding: '10px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: 14, cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const modalBox     = { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' };
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' };
const modalClose   = { background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 };
const formStyle    = { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 };
const formRow      = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelStyle   = { fontSize: 13, fontWeight: 600, color: '#374151' };
const inputStyle   = { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' };
const fileInput    = { fontSize: 13, color: '#374151' };
const alertStyle   = (bg, color) => ({ padding: '10px 16px', borderRadius: 8, background: bg, color, fontSize: 14, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
const closeAlertBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: 'inherit' };