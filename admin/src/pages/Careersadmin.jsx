/**
 * CareersAdmin.jsx
 * - Slug column in table
 * - Slug shown in edit modal (read-only)
 * - Fixed PDF viewer: uses Google Docs for preview, clean URL for download
 * - Fixed filter buttons: All / Active / Inactive now work correctly
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { careerService } from '../services/api';
import {
  Plus, Search, Pencil, Trash2, Eye, Download, FileText,
  ToggleLeft, ToggleRight, Mail, ChevronLeft, ChevronRight,
  ImageIcon, Phone, AtSign, MessageSquare, X, Briefcase,
  MapPin, Users, CheckCircle, XCircle, Link, ExternalLink,
} from 'lucide-react';

/* ─── base styles ─────────────────────────────────────────────────────────── */
const IS = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db',
  borderRadius: 8, fontSize: 14, color: '#111827', background: '#fff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
const G2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' };

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
  return base;
}

function F({ label, required, err, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {err && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>⚠ {err}</p>}
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function cleanPdfUrl(url) {
  if (!url) return url;
  return url
    .replace(/[?&]fl_attachment=true/g, '')
    .replace(/\?&/, '?')
    .replace(/[?&]$/, '');
}

function downloadUrl(url) {
  if (!url) return url;
  const base = cleanPdfUrl(url);
  return base + (base.includes('?') ? '&' : '?') + 'fl_attachment=true';
}

function getFilename(url) {
  if (!url) return 'resume.pdf';
  try {
    return decodeURIComponent(url.split('/').pop().split('?')[0])
      .replace(/^resume_\d+_/, '') || 'resume.pdf';
  } catch { return 'resume.pdf'; }
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
  const maxW = { xl: 1100, lg: 820, md: 620, sm: 440 }[size] || 620;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: maxW, maxHeight: '95vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{title}</h2>
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

/* ─── PDF Viewer ─────────────────────────────────────────────────────────── */
function PdfViewer({ url, filename, onClose }) {
  const [mode, setMode] = useState('direct'); // 'direct' | 'gdocs' | 'failed'
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const viewUrl = cleanPdfUrl(url);
  const dlUrl   = downloadUrl(url);
  const gdocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`;

  const currentSrc = mode === 'gdocs' ? gdocsUrl : viewUrl;

  const handleError = () => {
    setLoading(false);
    if (mode === 'direct') {
      setMode('gdocs');
      setLoading(true);
      setIframeKey(k => k + 1);
    } else {
      setMode('failed');
    }
  };

  const handleLoad = () => setLoading(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.9)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: '#1e293b', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <FileText size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
          <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filename}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <a href={viewUrl} target="_blank" rel="noreferrer"
            style={{ ...B('ghost', true), background: '#334155', color: '#94a3b8', textDecoration: 'none' }}>
            <ExternalLink size={13} /> Open
          </a>
          <a href={dlUrl} download={filename} target="_blank" rel="noreferrer"
            style={{ ...B('primary', true), textDecoration: 'none' }}>
            <Download size={13} /> Download
          </a>
          <button onClick={onClose} style={{ ...B('ghost', true), background: '#334155', color: '#fff' }}>
            <X size={13} /> Close
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#94a3b8', fontSize: 14, textAlign: 'center', zIndex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#60a5fa', animation: 'spin .8s linear infinite', margin: '0 auto 12px' }} />
          {mode === 'gdocs' ? 'Trying Google Docs viewer…' : 'Loading preview…'}
        </div>
      )}

      {/* Failed state */}
      {mode === 'failed' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#94a3b8', fontSize: 14, textAlign: 'center', zIndex: 1 }}>
          <FileText size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ marginBottom: 8, fontWeight: 600, color: '#f1f5f9' }}>Preview unavailable</div>
          <div style={{ marginBottom: 20, fontSize: 13 }}>Open directly or download the file.</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a href={viewUrl} target="_blank" rel="noreferrer"
              style={{ ...B('ghost', true), textDecoration: 'none', background: '#334155', color: '#f1f5f9' }}>
              <ExternalLink size={13} /> Open directly
            </a>
            <a href={dlUrl} download={filename} target="_blank" rel="noreferrer"
              style={{ ...B('primary', true), textDecoration: 'none' }}>
              <Download size={13} /> Download
            </a>
          </div>
        </div>
      )}

      {/* iframe — hidden when failed */}
      {mode !== 'failed' && (
        <iframe
          key={iframeKey}
          src={currentSrc}
          style={{ flex: 1, border: 'none', background: '#fff', opacity: loading ? 0 : 1 }}
          title={filename}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

/* ─── Application Card ───────────────────────────────────────────────────── */
const SC = {
  pending:     { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  reviewed:    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  shortlisted: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  rejected:    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

function AppCard({ app, onStatusChange, onViewPdf }) {
  const sc    = SC[app.status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  const fname = getFilename(app.resumeUrl);
  const viewableUrl  = cleanPdfUrl(app.resumeUrl);
  const forceDownUrl = downloadUrl(app.resumeUrl);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <div style={{ padding: '14px 18px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#1a598a,#015599)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 17, fontWeight: 700, flexShrink: 0 }}>
            {app.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{app.fullName}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: 'uppercase' }}>{app.status}</span>
          <select value={app.status} onChange={e => onStatusChange(app._id, e.target.value)}
            style={{ padding: '5px 8px', borderRadius: 7, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            {['pending', 'reviewed', 'shortlisted', 'rejected'].map(s => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <a href={`mailto:${app.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#1a598a', textDecoration: 'none' }}>
            <AtSign size={13} color="#6b7280" />{app.email}
          </a>
          {app.phone && (
            <a href={`tel:${app.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#374151', textDecoration: 'none' }}>
              <Phone size={13} color="#6b7280" />{app.phone}
            </a>
          )}
        </div>

        {app.coverLetter && (
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <MessageSquare size={11} color="#9ca3af" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cover Letter</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
          </div>
        )}

        {app.resumeUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={15} color="#dc2626" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{fname}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>Resume</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onViewPdf(viewableUrl, fname)} style={B('blue', true)}>
                <Eye size={13} /> View
              </button>
              <a href={forceDownUrl} download={fname} target="_blank" rel="noreferrer" style={{ ...B('primary', true), textDecoration: 'none' }}>
                <Download size={13} /> Download
              </a>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>No resume uploaded</div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAREER FORM
═══════════════════════════════════════════════════════════════════════════ */
function CareerForm({ initial, onSubmit, onCancel, saving }) {
  const [errors,     setErrors]     = useState({});
  const [imgPreview, setImgPreview] = useState(initial?.image?.url || '');
  const [reqList,    setReqList]    = useState(
    initial?.requirementsList?.length ? [...initial.requirementsList] : ['']
  );
  const [respList, setRespList] = useState(
    initial?.responsibilitiesList?.length ? [...initial.responsibilitiesList] : ['']
  );
  const fileInputRef = useRef(null);

  const defaultDeadline = initial?.applyDeadline
    ? new Date(initial.applyDeadline).toISOString().split('T')[0] : '';
  const defaultTags = Array.isArray(initial?.tags)
    ? initial.tags.join(', ') : (initial?.tags || '');

  function handleSubmit(e) {
    e.preventDefault();
    const raw         = new FormData(e.target);
    const title       = (raw.get('title')       || '').trim();
    const category    = (raw.get('category')    || '').trim();
    const location    = (raw.get('location')    || '').trim();
    const description = (raw.get('description') || '').trim();

    const errs = {};
    if (!title)       errs.title       = 'Job title is required';
    if (!category)    errs.category    = 'Category is required';
    if (!location)    errs.location    = 'Location is required';
    if (!description) errs.description = 'Job description is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append('title',            title);
    fd.append('category',         category);
    fd.append('need',             raw.get('need')              || 'Full Time');
    fd.append('location',         location);
    fd.append('description',      description);
    fd.append('requirements',     (raw.get('requirements')     || '').trim());
    fd.append('responsibilities', (raw.get('responsibilities') || '').trim());
    fd.append('jobNumber',        (raw.get('jobNumber')        || '').trim());
    fd.append('company',          (raw.get('company')          || '').trim());
    fd.append('website',          (raw.get('website')          || '').trim());
    fd.append('salaryMin',        raw.get('salaryMin')         || '');
    fd.append('salaryMax',        raw.get('salaryMax')         || '');
    fd.append('salaryPeriod',     raw.get('salaryPeriod')      || 'month');
    fd.append('vacancy',          raw.get('vacancy')           || '1');
    fd.append('applyDeadline',    raw.get('applyDeadline')     || '');
    fd.append('isActive',         raw.get('isActive')          || 'true');
    fd.append('tags', JSON.stringify(
      (raw.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean)
    ));
    fd.append('requirementsList',     JSON.stringify(reqList.filter(Boolean)));
    fd.append('responsibilitiesList', JSON.stringify(respList.filter(Boolean)));

    const imgFile = fileInputRef.current?.files?.[0];
    if (imgFile) fd.append('careerImage', imgFile);

    onSubmit(fd);
  }

  const border = k => errors[k] ? '#ef4444' : '#d1d5db';

  return (
    <form onSubmit={handleSubmit} noValidate>

      {Object.keys(errors).length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#dc2626', fontSize: 13 }}>Please fix:</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#b91c1c', fontSize: 13, lineHeight: 1.8 }}>
            {Object.values(errors).map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {initial?.slug && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link size={13} color="#15803d" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>URL Slug (auto-generated)</div>
            <div style={{ fontSize: 13, color: '#166534', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              /careers/<strong>{initial.slug}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(initial.slug)}
            style={{ padding: '4px 10px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 11, color: '#15803d', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}
          >
            Copy
          </button>
        </div>
      )}

      <F label="Cover Image (optional)">
        {imgPreview ? (
          <div style={{ position: 'relative', height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <img src={imgPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button type="button"
              onClick={() => { setImgPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.6)', border: 'none', borderRadius: 6, color: '#fff', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ height: 90, borderRadius: 8, border: '2px dashed #d1d5db', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a598a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}>
            <ImageIcon size={20} color="#9ca3af" />
            <span style={{ fontSize: 13, color: '#6b7280' }}>Click to upload image</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; if (f) setImgPreview(URL.createObjectURL(f)); }} />
      </F>

      <div style={G2}>
        <F label="Job Title" required err={errors.title}>
          <input name="title" style={{ ...IS, borderColor: border('title') }}
            defaultValue={initial?.title || ''} placeholder="e.g. Frontend Developer" />
        </F>
        <F label="Employment Type">
          <select name="need" style={IS} defaultValue={initial?.need || 'Full Time'}>
            {['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'].map(o => <option key={o}>{o}</option>)}
          </select>
        </F>
      </div>

      <div style={G2}>
        <F label="Category" required err={errors.category}>
          <input name="category" style={{ ...IS, borderColor: border('category') }}
            defaultValue={initial?.category || ''} placeholder="e.g. Engineering" />
        </F>
        <F label="Location" required err={errors.location}>
          <input name="location" style={{ ...IS, borderColor: border('location') }}
            defaultValue={initial?.location || ''} placeholder="e.g. New York, NY" />
        </F>
      </div>

      <F label="Job Description" required err={errors.description}>
        <textarea name="description" style={{ ...IS, minHeight: 100, resize: 'vertical', borderColor: border('description') }}
          defaultValue={initial?.description || ''} placeholder="Describe the role…" />
      </F>

      <F label="Requirements (intro paragraph)">
        <textarea name="requirements" style={{ ...IS, minHeight: 70, resize: 'vertical' }} defaultValue={initial?.requirements || ''} />
      </F>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Requirements List</label>
        {reqList.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input style={{ ...IS, flex: 1 }} value={item} placeholder={`Requirement ${i + 1}`}
              onChange={e => setReqList(p => p.map((x, j) => j === i ? e.target.value : x))} />
            <button type="button" onClick={() => setReqList(p => p.filter((_, j) => j !== i))}
              style={{ padding: '0 10px', background: '#fef2f2', border: 'none', borderRadius: 8, color: '#dc2626', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setReqList(p => [...p, ''])}
          style={{ fontSize: 13, color: '#2563eb', background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 600 }}>+ Add</button>
      </div>

      <F label="Responsibilities (intro paragraph)">
        <textarea name="responsibilities" style={{ ...IS, minHeight: 70, resize: 'vertical' }} defaultValue={initial?.responsibilities || ''} />
      </F>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Responsibilities List</label>
        {respList.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input style={{ ...IS, flex: 1 }} value={item} placeholder={`Responsibility ${i + 1}`}
              onChange={e => setRespList(p => p.map((x, j) => j === i ? e.target.value : x))} />
            <button type="button" onClick={() => setRespList(p => p.filter((_, j) => j !== i))}
              style={{ padding: '0 10px', background: '#fef2f2', border: 'none', borderRadius: 8, color: '#dc2626', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setRespList(p => [...p, ''])}
          style={{ fontSize: 13, color: '#2563eb', background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 600 }}>+ Add</button>
      </div>

      <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
      <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Sidebar Info</p>

      <div style={G2}>
        <F label="Job Number"><input name="jobNumber" style={IS} defaultValue={initial?.jobNumber || ''} /></F>
        <F label="Company"><input name="company" style={IS} defaultValue={initial?.company || ''} /></F>
        <F label="Website"><input name="website" style={IS} defaultValue={initial?.website || ''} placeholder="www.example.com" /></F>
        <F label="Vacancy"><input name="vacancy" type="number" min={1} style={IS} defaultValue={initial?.vacancy || 1} /></F>
        <F label="Salary Min"><input name="salaryMin" type="number" style={IS} defaultValue={initial?.salaryMin || ''} /></F>
        <F label="Salary Max"><input name="salaryMax" type="number" style={IS} defaultValue={initial?.salaryMax || ''} /></F>
        <F label="Salary Period">
          <select name="salaryPeriod" style={IS} defaultValue={initial?.salaryPeriod || 'month'}>
            {['hour', 'day', 'week', 'month', 'year'].map(o => <option key={o}>{o}</option>)}
          </select>
        </F>
        <F label="Apply Deadline"><input name="applyDeadline" type="date" style={IS} defaultValue={defaultDeadline} /></F>
      </div>

      <F label="Tags (comma separated)">
        <input name="tags" style={IS} defaultValue={defaultTags} placeholder="React, Remote, Senior" />
      </F>

      <F label="Status">
        <select name="isActive" style={{ ...IS, width: 'auto', minWidth: 140 }} defaultValue={initial?.isActive === false ? 'false' : 'true'}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </F>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #e5e7eb', marginTop: 8 }}>
        <button type="button" onClick={onCancel} style={B('ghost')}>Cancel</button>
        <button type="submit" disabled={saving} style={{ ...B('primary'), opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function CareersAdmin() {
  const [careers,      setCareers]      = useState([]);
  const [stats,        setStats]        = useState(null);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('all');
  const [modal,        setModal]        = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsTitle,    setAppsTitle]    = useState('');
  const [confirm,      setConfirm]      = useState(null);
  const [toast,        setToast]        = useState(null);
  const [pdfViewer,    setPdfViewer]    = useState(null);

  const showToast  = useCallback((msg, type = 'success') => setToast({ msg, type }), []);
  const closeModal = useCallback(() => { setModal(null); setSelected(null); }, []);

  const loadStats = useCallback(async () => {
    try { const r = await careerService.getStats(); if (r.data?.success) setStats(r.data.data); } catch { /**/ }
  }, []);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      // ✅ FIX: send proper boolean values for isActive filter
      if (filter === 'active')   params.isActive = true;
      if (filter === 'inactive') params.isActive = false;
      const r = await careerService.getAllAdmin(params);
      if (r.data?.success) {
        setCareers(r.data.data);
        setTotalPages(r.data.pagination?.totalPages || 1);
        setTotal(r.data.pagination?.total || 0);
      }
    } catch { /**/ }
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { loadStats(); },   [loadStats]);
  useEffect(() => { loadCareers(); }, [loadCareers]);

  const handleCreate = async (fd) => {
    setSaving(true);
    try {
      const r = await careerService.create(fd);
      if (r.data?.success) { showToast('Job created!'); closeModal(); loadCareers(); loadStats(); }
      else showToast(r.data?.message || 'Create failed', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Create failed', 'error'); }
    setSaving(false);
  };

  const handleUpdate = async (fd) => {
    setSaving(true);
    try {
      const r = await careerService.update(selected._id, fd);
      if (r.data?.success) { showToast('Job updated!'); closeModal(); loadCareers(); }
      else showToast(r.data?.message || 'Update failed', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Update failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      const r = await careerService.delete(id);
      if (r.data?.success) { showToast('Job deleted'); loadCareers(); loadStats(); }
      else showToast('Delete failed', 'error');
    } catch { showToast('Delete failed', 'error'); }
    setConfirm(null);
  };

  const handleToggle = async (id) => {
    try {
      const r = await careerService.toggle(id);
      if (r.data?.success) { showToast(r.data.data?.isActive ? 'Activated' : 'Deactivated'); loadCareers(); loadStats(); }
    } catch { showToast('Toggle failed', 'error'); }
  };

  const openApps = async (career) => {
    try {
      const r = await careerService.getApplications(career._id);
      if (r.data?.success) {
        setApplications(r.data.data);
        setAppsTitle(r.data.jobTitle || career.title);
        setSelected(career);
        setModal('apps');
      }
    } catch { showToast('Failed to load applications', 'error'); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      const r = await careerService.updateApplicationStatus(selected._id, appId, status);
      if (r.data?.success) {
        setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
        showToast('Status updated');
      }
    } catch { showToast('Failed', 'error'); }
  };

  const careerUrl = (c) => `/careers/${c.slug || c._id}`;

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', background: '#f8fafc' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Careers</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Manage job listings and applications</p>
        </div>
        <button onClick={() => { setSelected(null); setModal('create'); }} style={B('primary')}>
          <Plus size={15} /> New Job
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: 12, marginBottom: 22 }}>
          <StatCard label="Total Jobs"   value={stats.total}             color="#2563eb" icon={<Briefcase size={19} color="#2563eb" />} />
          <StatCard label="Active"       value={stats.active}            color="#16a34a" icon={<CheckCircle size={19} color="#16a34a" />} />
          <StatCard label="Inactive"     value={stats.inactive}          color="#dc2626" icon={<XCircle size={19} color="#dc2626" />} />
          <StatCard label="Applications" value={stats.totalApplications} color="#7c3aed" icon={<Users size={19} color="#7c3aed" />} />
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input style={{ ...IS, paddingLeft: 32, width: 230 }} placeholder="Search jobs…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {/* ✅ FIX: changed filter values from 'true'/'false' strings to 'active'/'inactive' */}
          {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => (
            <button key={v} onClick={() => { setFilter(v); setPage(1); }}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: filter === v ? '#1a598a' : '#f3f4f6', color: filter === v ? '#fff' : '#374151' }}>
              {l}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af' }}>{total} job{total !== 1 ? 's' : ''}</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#1a598a', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : careers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
            <Briefcase size={38} style={{ marginBottom: 10, opacity: 0.35 }} />
            <div style={{ fontWeight: 600, fontSize: 15 }}>No jobs found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Click "New Job" to create your first listing</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Image', 'Title / Company', 'Slug', 'Category', 'Type', 'Location', 'Qty', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {careers.map((c, i) => (
                  <tr key={c._id} style={{ borderBottom: i < careers.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '12px 14px' }}>
                      {c.image?.url
                        ? <img src={c.image.url} alt={c.title} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                        : <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={15} color="#d1d5db" /></div>
                      }
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{c.title}</div>
                      {c.company && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{c.company}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: 180 }}>
                      {c.slug ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <code style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', padding: '2px 7px', borderRadius: 5, border: '1px solid #bbf7d0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130, display: 'block' }}>
                            {c.slug}
                          </code>
                          <a href={careerUrl(c)} target="_blank" rel="noreferrer" title="Open page" style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>
                            <Eye size={12} />
                          </a>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#f59e0b', fontStyle: 'italic' }}>no slug yet</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{c.category}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{c.need}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} color="#9ca3af" />{c.location}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', textAlign: 'center' }}>{String(c.vacancy || 1).padStart(2, '0')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.isActive ? '#f0fdf4' : '#fef2f2', color: c.isActive ? '#16a34a' : '#dc2626' }}>
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button title="Applications" onClick={() => openApps(c)} style={B('blue', true)}><Mail size={12} /></button>
                        <button title="Edit" onClick={() => { setSelected(c); setModal('edit'); }} style={B('green', true)}><Pencil size={12} /></button>
                        <button title={c.isActive ? 'Deactivate' : 'Activate'} onClick={() => handleToggle(c._id)} style={B('amber', true)}>
                          {c.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        </button>
                        <button title="Delete" onClick={() => setConfirm({ id: c._id, title: c.title })} style={B('red', true)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

      {modal === 'create' && (
        <Modal title="Create New Job" onClose={closeModal} size="lg">
          <CareerForm key="create-form" onSubmit={handleCreate} onCancel={closeModal} saving={saving} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title={`Edit: ${selected.title}`} onClose={closeModal} size="lg">
          <CareerForm key={`edit-${selected._id}`} initial={selected} onSubmit={handleUpdate} onCancel={closeModal} saving={saving} />
        </Modal>
      )}
      {modal === 'apps' && (
        <Modal title={`Applications — ${appsTitle} (${applications.length})`} onClose={closeModal} size="xl">
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
              <Mail size={40} style={{ marginBottom: 10, opacity: 0.3 }} />
              <div style={{ fontWeight: 600, fontSize: 15 }}>No applications yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['pending', 'reviewed', 'shortlisted', 'rejected'].map(s => {
                  const sc = SC[s]; const count = applications.filter(a => a.status === s).length;
                  return <span key={s} style={{ padding: '4px 12px', borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{s}: {count}</span>;
                })}
              </div>
              {applications.map(app => (
                <AppCard key={app._id} app={app} onStatusChange={updateAppStatus}
                  onViewPdf={(url, filename) => setPdfViewer({ url, filename })} />
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirm && <Confirm message={`Delete "${confirm.title}"? This cannot be undone.`} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {pdfViewer && <PdfViewer url={pdfViewer.url} filename={pdfViewer.filename} onClose={() => setPdfViewer(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}