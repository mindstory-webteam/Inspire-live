import { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon, Video, Trash2, Plus, GripVertical,
  Edit2, Eye, EyeOff, ToggleLeft, ToggleRight, Upload, X, Save,
} from 'lucide-react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const token = () => localStorage.getItem('adminToken') || localStorage.getItem('token');
const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

const api = {
  getBanner: () =>
    fetch(`${BASE}/banner/admin`, { headers: authHeaders() }).then((r) => r.json()),
  addSlide: (formData) =>
    fetch(`${BASE}/banner/admin/slides`, { method: 'POST', headers: authHeaders(), body: formData }).then((r) => r.json()),
  updateSlide: (slideId, formData) =>
    fetch(`${BASE}/banner/admin/slides/${slideId}`, { method: 'PUT', headers: authHeaders(), body: formData }).then((r) => r.json()),
  deleteSlide: (slideId) =>
    fetch(`${BASE}/banner/admin/slides/${slideId}`, { method: 'DELETE', headers: authHeaders() }).then((r) => r.json()),
  reorderSlides: (order) =>
    fetch(`${BASE}/banner/admin/slides/reorder`, { method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) }).then((r) => r.json()),
  toggleBanner: () =>
    fetch(`${BASE}/banner/admin/toggle`, { method: 'PUT', headers: authHeaders() }).then((r) => r.json()),
};

const emptySlide = () => ({
  title: '', subtitle: '', description: '', type: 'image',
  mediaUrl: '', thumbUrl: '', buttonText: 'Get Started', buttonUrl: '/contact', isActive: true,
});

const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all duration-200";
const inputStyle = { background: '#ffffff', border: '1.5px solid #ecf0f0', color: '#0c1e21' };
const inputFocusStyle = { borderColor: '#1a598a' };

function SlideForm({ initial = emptySlide(), onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial.mediaUrl || '');
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));


 const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    const detectedType = f.type.startsWith('video') ? 'video' : 'image';
    // FIX: clear stale mediaUrl/thumbUrl so the server uses req.file instead
    setForm((prev) => ({ ...prev, type: detectedType, mediaUrl: '', thumbUrl: '' }));
  };
 
  const handleSubmit = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      // Don't send empty mediaUrl/thumbUrl when a file is being uploaded —
      // the server will derive both from req.file
      if (file && (k === 'mediaUrl' || k === 'thumbUrl')) return;
      fd.append(k, v);
    });
    if (file) fd.append('media', file);
    onSave(fd);
  };

  return (
    <div className="space-y-5">
      {/* Media upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#67787a' }}>Media (Image or Video)</label>
        <div
          className="relative rounded-2xl h-48 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200"
          style={{ border: '2px dashed #a9b8b8', background: '#f8fafb' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#1a598a'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#a9b8b8'}
          onClick={() => fileRef.current.click()}
        >
          {preview ? (
            form.type === 'video' || (file && file.type?.startsWith('video')) ? (
              <video src={preview} className="absolute inset-0 w-full h-full object-cover" muted />
            ) : (
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )
          ) : (
            <div className="flex flex-col items-center gap-2" style={{ color: '#a9b8b8' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#1a598a12' }}>
                <Upload size={22} style={{ color: '#1a598a' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#67787a' }}>Click to upload image or video</span>
              <span className="text-xs" style={{ color: '#a9b8b8' }}>JPG, PNG, WebP, MP4 up to 100MB</span>
            </div>
          )}
          {preview && (
            <button
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10 transition-colors"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={(e) => { e.stopPropagation(); setPreview(''); setFile(null); set('mediaUrl', ''); }}
            >
              <X size={13} className="text-white" />
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        <div className="mt-2.5">
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="Or paste media URL (https://...)"
            value={file ? '' : form.mediaUrl}
            onChange={(e) => { setFile(null); setPreview(e.target.value); set('mediaUrl', e.target.value); }}
            onFocus={e => e.target.style.borderColor = '#1a598a'}
            onBlur={e => e.target.style.borderColor = '#ecf0f0'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'title', label: 'Title *', placeholder: 'Slide title' },
          { key: 'subtitle', label: 'Subtitle', placeholder: 'Subtitle text' },
          { key: 'buttonText', label: 'Button Text', placeholder: 'Get Started' },
          { key: 'buttonUrl', label: 'Button URL', placeholder: '/contact' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>{label}</label>
            <input className={inputCls} style={inputStyle} value={form[key]} placeholder={placeholder}
              onChange={(e) => set(key, e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1a598a'}
              onBlur={e => e.target.style.borderColor = '#ecf0f0'}
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>Description</label>
          <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }} rows={2} value={form.description}
            onChange={(e) => set('description', e.target.value)} placeholder="Short description"
            onFocus={e => e.target.style.borderColor = '#1a598a'}
            onBlur={e => e.target.style.borderColor = '#ecf0f0'}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>Type</label>
          <select className={inputCls} style={inputStyle} value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <label className="text-sm font-medium" style={{ color: '#1a425c' }}>Active</label>
          <button
            type="button"
            onClick={() => set('isActive', !form.isActive)}
            className="relative w-11 h-6 rounded-full transition-all duration-300"
            style={{ background: form.isActive ? '#1a598a' : '#ecf0f0' }}
          >
            <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
              style={{ transform: form.isActive ? 'translateX(20px)' : 'translateX(0)' }} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || (!form.mediaUrl && !file)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
        >
          <Save size={14} /> {loading ? 'Saving…' : 'Save Slide'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: '#67787a', background: '#ecf0f0', border: 'none' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function SlideCard({ slide, onEdit, onDelete, onToggleActive, index }) {
  const mediaBase = 'http://localhost:5000';
  const src = slide.mediaUrl?.startsWith('http') ? slide.mediaUrl : `${mediaBase}${slide.mediaUrl}`;

  return (
    <div className="rounded-2xl overflow-hidden flex gap-4 p-4 transition-all duration-200 hover:shadow-md"
      style={{ background: '#ffffff', border: '1px solid #ecf0f0', opacity: slide.isActive ? 1 : 0.55 }}>
      <div className="flex flex-col justify-center cursor-grab" style={{ color: '#a9b8b8' }}>
        <GripVertical size={18} />
      </div>

      {/* Thumbnail */}
      <div className="w-24 h-16 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: '#ecf0f0' }}>
        {slide.type === 'video' ? (
          <video src={src} className="w-full h-full object-cover" muted />
        ) : (
          <img src={src} alt={slide.title} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {slide.type === 'video'
            ? <Video size={12} style={{ color: '#1a598a' }} />
            : <ImageIcon size={12} style={{ color: '#1e8a8a' }} />}
          <span className="font-semibold text-sm truncate" style={{ color: '#0c1e21' }}>{slide.title}</span>
        </div>
        <p className="text-xs truncate" style={{ color: '#a9b8b8' }}>{slide.subtitle}</p>
        <p className="text-xs truncate mt-0.5" style={{ color: '#a9b8b8' }}>{slide.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={slide.isActive ? { background: '#1e8a8a15', color: '#1e8a8a' } : { background: '#ecf0f0', color: '#67787a' }}>
            {slide.isActive ? 'Active' : 'Hidden'}
          </span>
          <span className="text-xs" style={{ color: '#a9b8b8' }}>Slide #{index + 1}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        {[
          { onClick: () => onEdit(slide), icon: <Edit2 size={13} />, hoverColor: '#1a598a', title: 'Edit' },
          { onClick: () => onToggleActive(slide), icon: slide.isActive ? <EyeOff size={13} /> : <Eye size={13} />, hoverColor: '#d97706', title: 'Toggle' },
          { onClick: () => onDelete(slide._id), icon: <Trash2 size={13} />, hoverColor: '#ef4444', title: 'Delete' },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick} title={btn.title}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#f8fafb', color: '#a9b8b8', border: '1px solid #ecf0f0' }}
            onMouseEnter={e => { e.currentTarget.style.color = btn.hoverColor; e.currentTarget.style.borderColor = btn.hoverColor + '40'; e.currentTarget.style.background = btn.hoverColor + '10'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#a9b8b8'; e.currentTarget.style.borderColor = '#ecf0f0'; e.currentTarget.style.background = '#f8fafb'; }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BannerManager() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getBanner();
      if (res.success) setBanner(res.data);
    } catch { setError('Failed to load banner'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const res = mode === 'add' ? await api.addSlide(formData) : await api.updateSlide(mode.slide._id, formData);
      if (res.success) { setBanner(res.data); setMode(null); }
      else setError(res.message || 'Save failed');
    } catch { setError('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Delete this slide?')) return;
    const res = await api.deleteSlide(slideId);
    if (res.success) setBanner(res.data);
  };

  const handleToggleActive = async (slide) => {
    const fd = new FormData();
    fd.append('isActive', !slide.isActive);
    fd.append('title', slide.title);
    fd.append('type', slide.type);
    fd.append('mediaUrl', slide.mediaUrl);
    const res = await api.updateSlide(slide._id, fd);
    if (res.success) setBanner(res.data);
  };

  const handleToggleBanner = async () => {
    const res = await api.toggleBanner();
    if (res.success) setBanner(res.data);
  };

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-64">
      <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid #ecf0f0', borderTopColor: '#1a598a' }} />
    </div>
  );

  const slides = [...(banner?.slides || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>Banner Manager</h1>
          <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>Manage your hero slider slides</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleBanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={banner?.isActive
              ? { background: '#1e8a8a12', color: '#1e8a8a', border: '1.5px solid #1e8a8a40' }
              : { background: '#ecf0f0', color: '#67787a', border: '1.5px solid #ecf0f0' }}
          >
            {banner?.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            Banner {banner?.isActive ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setMode('add')}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
          >
            <Plus size={15} /> Add Slide
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-3.5 flex items-center justify-between text-sm" style={{ background: '#ef444415', border: '1px solid #ef444440', color: '#dc2626' }}>
          {error}
          <button onClick={() => setError('')} className="ml-3"><X size={14} /></button>
        </div>
      )}

      {/* Form */}
      {mode && (
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1.5px solid #1a598a30' }}>
          <h2 className="font-semibold mb-5" style={{ color: '#0c1e21' }}>
            {mode === 'add' ? '+ New Slide' : `Edit: ${mode.slide?.title}`}
          </h2>
          <SlideForm
            initial={mode === 'add' ? emptySlide() : mode.slide}
            onSave={handleSave}
            onCancel={() => setMode(null)}
            loading={saving}
          />
        </div>
      )}

      {/* Slides list */}
      <div className="space-y-3">
        {slides.length === 0 && !mode ? (
          <div className="rounded-2xl p-16 flex flex-col items-center gap-3 text-center" style={{ background: '#ffffff', border: '1px dashed #a9b8b8' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#ecf0f0' }}>
              <ImageIcon size={28} style={{ color: '#a9b8b8' }} />
            </div>
            <p className="font-medium" style={{ color: '#67787a' }}>No slides yet</p>
            <p className="text-sm" style={{ color: '#a9b8b8' }}>Add your first slide to get started</p>
          </div>
        ) : (
          slides.map((slide, i) => (
            <SlideCard key={slide._id} slide={slide} index={i}
              onEdit={(s) => setMode({ slide: s })}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))
        )}
      </div>

      <p className="text-xs" style={{ color: '#a9b8b8' }}>
        {slides.length} slide{slides.length !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}