import { useState, useEffect, useCallback, useRef } from 'react';
import { careerService } from '../services/api';
import {
  Plus, Search, Pencil, Trash2,
  ToggleLeft, ToggleRight, Mail, ChevronLeft, ChevronRight, ImageIcon,
} from 'lucide-react';

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0',
  borderRadius: 8, fontSize: 14, color: '#0f172a', background: '#f8fafc',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
};

// ─── Badges ───────────────────────────────────────────────────────────────────
const Badge = ({ active }) => (
  <span style={{
    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    background: active ? '#dcfce7' : '#fee2e2', color: active ? '#16a34a' : '#dc2626',
  }}>{active ? 'ACTIVE' : 'INACTIVE'}</span>
);

const AppBadge = ({ status }) => {
  const map = {
    pending:     ['#fef3c7', '#b45309'],
    reviewed:    ['#dbeafe', '#1d4ed8'],
    shortlisted: ['#dcfce7', '#16a34a'],
    rejected:    ['#fee2e2', '#dc2626'],
  };
  const [bg, color] = map[status] || ['#f3f4f6', '#374151'];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: bg, color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{status}</span>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    background: type === 'error' ? '#dc2626' : '#16a34a',
    color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
    fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,.2)',
    display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
  }}>
    <span>{type === 'error' ? '✕' : '✓'}</span>
    {msg}
    <button onClick={onClose}
      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>✕</button>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div
    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)',
      backdropFilter: 'blur(4px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div style={{ background: '#fff', borderRadius: 16, width: '100%',
      maxWidth: wide ? 860 : 640, maxHeight: '90vh', overflow: 'auto',
      boxShadow: '0 25px 60px rgba(0,0,0,.25)' }}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{title}</h2>
        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8,
          width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>
      <div style={{ padding: 28 }}>{children}</div>
    </div>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, required, children, half }) => (
  <div style={{ gridColumn: half ? 'span 1' : 'span 2', marginBottom: 4 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
      {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    {children}
  </div>
);

// ─── ListEditor ───────────────────────────────────────────────────────────────
// IMPORTANT: defined OUTSIDE CareerForm so it is never re-created on each render.
// If defined inside, React unmounts/remounts the inputs on every keystroke,
// which causes the single-character-only bug.
const ListEditor = ({ label, items, onChange, onAdd, onRemove }) => (
  <Field label={label}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={item}
            placeholder={`Item ${i + 1}`}
            onChange={(e) => onChange(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            style={{ padding: '0 12px', background: '#fee2e2', border: 'none',
              borderRadius: 8, color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}
          >✕</button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        style={{ padding: '7px 14px', background: '#eff6ff', border: '1.5px dashed #93c5fd',
          borderRadius: 8, color: '#2563eb', cursor: 'pointer', fontSize: 13,
          fontWeight: 600, alignSelf: 'flex-start' }}
      >+ Add Item</button>
    </div>
  </Field>
);

// ─── Career Form ──────────────────────────────────────────────────────────────
const EMPTY = {
  title: '', category: '', need: 'Full Time', location: '',
  description: '', requirements: '', requirementsList: [''],
  responsibilities: '', responsibilitiesList: [''],
  jobNumber: '', company: '', website: '', salaryMin: '', salaryMax: '',
  salaryPeriod: 'month', vacancy: 1, applyDeadline: '', tags: '', isActive: true,
};

const CareerForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial ? {
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '',
    applyDeadline: initial.applyDeadline
      ? new Date(initial.applyDeadline).toISOString().split('T')[0] : '',
    requirementsList: initial.requirementsList?.length ? initial.requirementsList : [''],
    responsibilitiesList: initial.responsibilitiesList?.length ? initial.responsibilitiesList : [''],
  } : EMPTY);

  // ── image state ───────────────────────────────────────────────────────────
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.image?.url || '');
  const imageRef                        = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── list helpers (stable references — passed as props to ListEditor) ──────
  const handleListChange = useCallback((key, idx, val) =>
    setForm((p) => ({ ...p, [key]: p[key].map((item, i) => (i === idx ? val : item)) })),
  []);

  const handleListAdd = useCallback((key) =>
    setForm((p) => ({ ...p, [key]: [...p[key], ''] })),
  []);

  const handleListRemove = useCallback((key, idx) =>
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) })),
  []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append('title',            form.title);
    fd.append('category',         form.category);
    fd.append('need',             form.need);
    fd.append('location',         form.location);
    fd.append('description',      form.description);
    fd.append('requirements',     form.requirements     || '');
    fd.append('responsibilities', form.responsibilities || '');
    fd.append('jobNumber',        form.jobNumber  || '');
    fd.append('company',          form.company    || '');
    fd.append('website',          form.website    || '');
    fd.append('salaryMin',        form.salaryMin  || '');
    fd.append('salaryMax',        form.salaryMax  || '');
    fd.append('salaryPeriod',     form.salaryPeriod);
    fd.append('vacancy',          Number(form.vacancy));
    fd.append('applyDeadline',    form.applyDeadline || '');
    fd.append('isActive',         String(form.isActive));

    const tags  = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    fd.append('tags',                 JSON.stringify(tags));
    fd.append('requirementsList',     JSON.stringify(form.requirementsList.filter(Boolean)));
    fd.append('responsibilitiesList', JSON.stringify(form.responsibilitiesList.filter(Boolean)));

    if (imageFile) fd.append('careerImage', imageFile);

    onSubmit(fd);
  };

  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' };

  return (
    <form onSubmit={handleSubmit}>
      <div style={grid}>

        {/* ── Career Image Upload ─────────────────────────────────────────── */}
        <Field label="Career Image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {imagePreview ? (
              <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 10,
                overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
                <img src={imagePreview} alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    if (imageRef.current) imageRef.current.value = '';
                  }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.55)',
                    border: 'none', borderRadius: 6, color: '#fff', width: 28, height: 28,
                    cursor: 'pointer', fontSize: 14, display: 'flex',
                    alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => imageRef.current?.click()}
                style={{ width: '100%', height: 160, borderRadius: 10, border: '2px dashed #cbd5e1',
                  background: '#f8fafc', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a598a')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
              >
                <ImageIcon size={28} color="#94a3b8" />
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Click to upload image</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>JPG, PNG, WEBP — max 10 MB</span>
              </div>
            )}
            <input type="file" ref={imageRef} accept="image/*" style={{ display: 'none' }}
              onChange={handleImageChange} />
            {!imagePreview && (
              <button type="button" onClick={() => imageRef.current?.click()}
                style={{ ...inputStyle, background: '#f1f5f9', border: '1.5px solid #e2e8f0',
                  cursor: 'pointer', textAlign: 'left', color: '#64748b' }}>
                Browse file…
              </button>
            )}
          </div>
        </Field>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Job Title" required half>
            <input style={inputStyle} value={form.title}
              onChange={(e) => set('title', e.target.value)} required />
          </Field>
          <Field label="Category" required half>
            <input style={inputStyle} value={form.category}
              onChange={(e) => set('category', e.target.value)} required />
          </Field>
        </div>

        <Field label="Employment Type" half>
          <select style={inputStyle} value={form.need} onChange={(e) => set('need', e.target.value)}>
            {['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Location" required half>
          <input style={inputStyle} value={form.location}
            onChange={(e) => set('location', e.target.value)} required />
        </Field>

        <Field label="Job Description" required>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
            value={form.description} onChange={(e) => set('description', e.target.value)} required />
        </Field>

        <Field label="Requirements Intro Text">
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={form.requirements} onChange={(e) => set('requirements', e.target.value)} />
        </Field>

        {/* ListEditor is now a stable top-level component — no re-mount on each keystroke */}
        <ListEditor
          label="Requirements List"
          items={form.requirementsList}
          onChange={(idx, val) => handleListChange('requirementsList', idx, val)}
          onAdd={() => handleListAdd('requirementsList')}
          onRemove={(idx) => handleListRemove('requirementsList', idx)}
        />

        <Field label="Responsibilities Intro Text">
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} />
        </Field>

        <ListEditor
          label="Responsibilities List"
          items={form.responsibilitiesList}
          onChange={(idx, val) => handleListChange('responsibilitiesList', idx, val)}
          onAdd={() => handleListAdd('responsibilitiesList')}
          onRemove={(idx) => handleListRemove('responsibilitiesList', idx)}
        />

        {/* Job Information Sidebar */}
        <div style={{ gridColumn: 'span 2', borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 4 }}>
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: 1 }}>Job Information Sidebar</p>
          <div style={grid}>
            <Field label="Job Number" half>
              <input style={inputStyle} value={form.jobNumber} onChange={(e) => set('jobNumber', e.target.value)} />
            </Field>
            <Field label="Company" half>
              <input style={inputStyle} value={form.company} onChange={(e) => set('company', e.target.value)} />
            </Field>
            <Field label="Website" half>
              <input style={inputStyle} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="www.example.com" />
            </Field>
            <Field label="Vacancy" half>
              <input type="number" min={1} style={inputStyle} value={form.vacancy} onChange={(e) => set('vacancy', e.target.value)} />
            </Field>
            <Field label="Salary Min ($)" half>
              <input type="number" style={inputStyle} value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} />
            </Field>
            <Field label="Salary Max ($)" half>
              <input type="number" style={inputStyle} value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} />
            </Field>
            <Field label="Salary Period" half>
              <select style={inputStyle} value={form.salaryPeriod} onChange={(e) => set('salaryPeriod', e.target.value)}>
                {['hour', 'day', 'week', 'month', 'year'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Apply Deadline" half>
              <input type="date" style={inputStyle} value={form.applyDeadline} onChange={(e) => set('applyDeadline', e.target.value)} />
            </Field>
            <Field label="Tags (comma separated)">
              <input style={inputStyle} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Business, Consulting, Design" />
            </Field>
            <Field label="Status" half>
              <select style={inputStyle} value={form.isActive ? 'true' : 'false'} onChange={(e) => set('isActive', e.target.value === 'true')}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24,
        paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
        <button type="button" onClick={onCancel}
          style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none',
            borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          Cancel
        </button>
        <button type="submit" disabled={loading}
          style={{ padding: '10px 24px', background: loading ? '#93c5fd' : '#1a598a',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Career'}
        </button>
      </div>
    </form>
  );
};

// ─── Confirm ──────────────────────────────────────────────────────────────────
const Confirm = ({ msg, onConfirm, onCancel }) => (
  <Modal title="Confirm" onClose={onCancel}>
    <p style={{ color: '#374151', marginTop: 0 }}>{msg}</p>
    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
      <button onClick={onCancel}
        style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none',
          borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      <button onClick={onConfirm}
        style={{ padding: '9px 18px', background: '#dc2626', border: 'none',
          borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Delete</button>
    </div>
  </Modal>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '22',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function CareersAdmin() {
  const [careers, setCareers]           = useState([]);
  const [stats, setStats]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const [formLoading, setFormLoading]   = useState(false);
  const [search, setSearch]             = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const [modal, setModal]               = useState(null);
  const [selected, setSelected]         = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsTitle, setAppsTitle]       = useState('');
  const [confirm, setConfirm]           = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStats = useCallback(async () => {
    try {
      const res = await careerService.getStats();
      if (res.data?.success) setStats(res.data.data);
    } catch (e) { console.error('loadStats:', e); }
  }, []);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterActive !== 'all') params.isActive = filterActive;
      const res = await careerService.getAllAdmin(params);
      if (res.data?.success) {
        setCareers(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
      }
    } catch (e) { console.error('loadCareers:', e); }
    setLoading(false);
  }, [page, search, filterActive]);

  useEffect(() => { loadStats(); },   [loadStats]);
  useEffect(() => { loadCareers(); }, [loadCareers]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      const res = await careerService.create(formData);
      if (res.data?.success) {
        showToast('Career created successfully');
        setModal(null); loadCareers(); loadStats();
      } else showToast(res.data?.message || 'Failed to create', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Failed to create', 'error'); }
    setFormLoading(false);
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      const res = await careerService.update(selected._id, formData);
      if (res.data?.success) {
        showToast('Career updated successfully');
        setModal(null); setSelected(null); loadCareers();
      } else showToast(res.data?.message || 'Failed to update', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Failed to update', 'error'); }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await careerService.delete(id);
      if (res.data?.success) { showToast('Career deleted'); loadCareers(); loadStats(); }
      else showToast(res.data?.message || 'Failed to delete', 'error');
    } catch { showToast('Failed to delete', 'error'); }
    setConfirm(null);
  };

  const handleToggle = async (id) => {
    try {
      const res = await careerService.toggle(id);
      if (res.data?.success) {
        showToast(`Career ${res.data.data.isActive ? 'activated' : 'deactivated'}`);
        loadCareers(); loadStats();
      }
    } catch { showToast('Failed to toggle', 'error'); }
  };

  const openApplications = async (career) => {
    try {
      const res = await careerService.getApplications(career._id);
      if (res.data?.success) {
        setApplications(res.data.data);
        setAppsTitle(res.data.jobTitle || career.title);
        setSelected(career);
        setModal('apps');
      }
    } catch { showToast('Failed to load applications', 'error'); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      const res = await careerService.updateApplicationStatus(selected._id, appId, status);
      if (res.data?.success) {
        setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
        showToast('Application status updated');
      }
    } catch { showToast('Failed to update status', 'error'); }
  };

  const td = { padding: '14px 16px', fontSize: 13, color: '#374151' };

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>Careers</h1>
          <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>Manage job listings and applications</p>
        </div>
        <button onClick={() => { setSelected(null); setModal('create'); }}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #1a598a, #015599)', border: 'none', cursor: 'pointer' }}>
          <Plus size={15} /> New Career
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <StatCard label="Total Jobs"   value={stats.total}             color="#2563eb" icon="💼" />
          <StatCard label="Active"       value={stats.active}            color="#16a34a" icon="✅" />
          <StatCard label="Inactive"     value={stats.inactive}          color="#dc2626" icon="⏸" />
          <StatCard label="Applications" value={stats.totalApplications} color="#7c3aed" icon="📨" />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl p-4 flex flex-wrap gap-3 items-center"
        style={{ background: '#fff', border: '1px solid #ecf0f0' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)', color: '#a9b8b8' }} />
          <input style={{ ...inputStyle, paddingLeft: 32, width: 260, background: '#f8fafc',
            border: '1.5px solid #ecf0f0', color: '#0c1e21' }}
            placeholder="Search jobs…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All'],['true','Active'],['false','Inactive']].map(([v, l]) => (
            <button key={v} onClick={() => { setFilterActive(v); setPage(1); }}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 13,
                fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                background: filterActive === v ? '#1a598a' : '#f1f5f9',
                color: filterActive === v ? '#fff' : '#374151' }}>{l}</button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 13 }}>
          {total} job{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto',
              border: '3px solid #ecf0f0', borderTopColor: '#1a598a',
              animation: 'spin 1s linear infinite' }} />
          </div>
        ) : careers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
            <div style={{ fontWeight: 600 }}>No careers found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Create your first career listing</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Image','Title','Category','Type','Location','Vacancy','Status','Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12,
                      fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {careers.map((career, i) => (
                  <tr key={career._id}
                    style={{ borderBottom: i < careers.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition: 'background .1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}>

                    <td style={{ padding: '12px 16px' }}>
                      {career.image?.url ? (
                        <img src={career.image.url} alt={career.title}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover',
                            border: '1px solid #e2e8f0' }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={18} color="#94a3b8" />
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{career.title}</div>
                      {career.company && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{career.company}</div>
                      )}
                    </td>
                    <td style={td}>{career.category}</td>
                    <td style={td}>{career.need}</td>
                    <td style={td}>{career.location}</td>
                    <td style={td}>{String(career.vacancy || 1).padStart(2, '0')}</td>
                    <td style={{ padding: '14px 16px' }}><Badge active={career.isActive} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button title="Applications" onClick={() => openApplications(career)}
                          style={{ padding: '6px 10px', background: '#eff6ff', border: 'none',
                            borderRadius: 7, cursor: 'pointer', color: '#2563eb',
                            display: 'flex', alignItems: 'center' }}>
                          <Mail size={14} />
                        </button>
                        <button title="Edit" onClick={() => { setSelected(career); setModal('edit'); }}
                          style={{ padding: '6px 10px', background: '#f0fdf4', border: 'none',
                            borderRadius: 7, cursor: 'pointer', color: '#16a34a',
                            display: 'flex', alignItems: 'center' }}>
                          <Pencil size={14} />
                        </button>
                        <button title={career.isActive ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggle(career._id)}
                          style={{ padding: '6px 10px', background: '#fef9c3', border: 'none',
                            borderRadius: 7, cursor: 'pointer', color: '#854d0e',
                            display: 'flex', alignItems: 'center' }}>
                          {career.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button title="Delete"
                          onClick={() => setConfirm({ id: career._id, title: career.title })}
                          style={{ padding: '6px 10px', background: '#fff1f2', border: 'none',
                            borderRadius: 7, cursor: 'pointer', color: '#dc2626',
                            display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={14} />
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
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#f1f5f9', color: '#374151', display: 'flex', alignItems: 'center',
                justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  background: page === p ? '#1a598a' : '#f1f5f9',
                  color: page === p ? '#fff' : '#374151' }}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#f1f5f9', color: '#374151', display: 'flex', alignItems: 'center',
                justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'create' && (
        <Modal title="Create New Career" onClose={() => setModal(null)} wide>
          <CareerForm onSubmit={handleCreate} onCancel={() => setModal(null)} loading={formLoading} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title={`Edit: ${selected.title}`}
          onClose={() => { setModal(null); setSelected(null); }} wide>
          <CareerForm initial={selected} onSubmit={handleUpdate}
            onCancel={() => { setModal(null); setSelected(null); }} loading={formLoading} />
        </Modal>
      )}
      {modal === 'apps' && (
        <Modal title={`Applications — ${appsTitle}`} onClose={() => setModal(null)} wide>
          {applications.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>No applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {applications.map((app) => (
                <div key={app._id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{app.fullName}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {app.email} {app.phone && `· ${app.phone}`}
                    </div>
                    {app.coverLetter && (
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.5, maxWidth: 500 }}>
                        {app.coverLetter.slice(0, 200)}{app.coverLetter.length > 200 ? '…' : ''}
                      </p>
                    )}
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                        style={{ fontSize: 13, color: '#1a598a', fontWeight: 600,
                          marginTop: 6, display: 'inline-block' }}>
                        📄 View Resume
                      </a>
                    )}
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <AppBadge status={app.status} />
                    <select value={app.status} onChange={(e) => updateAppStatus(app._id, e.target.value)}
                      style={{ ...inputStyle, width: 'auto', fontSize: 12, padding: '5px 8px' }}>
                      {['pending','reviewed','shortlisted','rejected'].map((s) => (
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

      {confirm && (
        <Confirm
          msg={`Are you sure you want to delete "${confirm.title}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}