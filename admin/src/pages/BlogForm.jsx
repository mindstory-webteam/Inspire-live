import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';

const CATEGORIES = ['Corporate', 'Business', 'Consulting', 'Innovations', 'Managements', 'Marketing'];
const STATUSES   = ['Tutorial', 'TIPS', 'FREEBIES', 'News', 'Draft'];
const ALL_TAGS   = ['Corporate', 'Business', 'Design', 'Marketing', 'Strategy'];

const inputStyle = {
  width: '100%', background: '#ffffff', border: '1.5px solid #ecf0f0',
  color: '#0c1e21', borderRadius: '12px', padding: '10px 14px',
  fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
};

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>{label}</label>
    {children}
    {hint && <p className="text-xs mt-1" style={{ color: '#a9b8b8' }}>{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', ...rest }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={inputStyle} {...rest}
    onFocus={e => e.target.style.borderColor = '#1a598a'}
    onBlur={e => e.target.style.borderColor = '#ecf0f0'}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3, mono }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ ...inputStyle, resize: 'none', fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? '13px' : '14px' }}
    onFocus={e => e.target.style.borderColor = '#1a598a'}
    onBlur={e => e.target.style.borderColor = '#ecf0f0'}
  />
);

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', category: 'Corporate', status: 'Tutorial', author: 'Admin',
    author_role: 'admin', tags: [], desc: '', desc1: '', desc2: '', body: '',
    videoUrl: '', isPublished: true, isFeatured: false,
    img: '', detailsImg: '', img1: '', img2: '', smallImg: '', videoImg: '',
  });
  const [files, setFiles]       = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    blogService.getById(id)
      .then(res => {
        const b = res.data.data;
        setForm(f => ({ ...f, ...b, tags: Array.isArray(b.tags) ? b.tags : [] }));
      })
      .catch(() => toast.error('Failed to load blog'))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleFile = (field, file) => {
    if (!file) return;
    setFiles(f => ({ ...f, [field]: file }));
    setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
  };

  const handleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const hasFiles = Object.keys(files).length > 0;
      if (hasFiles) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else if (v !== null && v !== undefined) fd.append(k, v);
        });
        Object.entries(files).forEach(([field, file]) => fd.append(field, file));
        isEdit ? await blogService.update(id, fd) : await blogService.create(fd);
      } else {
        isEdit ? await blogService.update(id, form) : await blogService.create(form);
      }
      toast.success(isEdit ? 'Blog updated!' : 'Blog created!');
      navigate('/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid #ecf0f0', borderTopColor: '#1a598a' }} />
    </div>
  );

  const ImageField = ({ field, label }) => (
    <Field label={label}>
      <div className="relative">
        {(previews[field] || form[field]) ? (
          <div className="relative rounded-xl overflow-hidden h-36">
            <img src={previews[field] || form[field]} alt="" className="w-full h-full object-cover"
              onError={e => e.target.style.display = 'none'} />
            <button type="button"
              onClick={() => {
                setFiles(f => { const n={...f}; delete n[field]; return n; });
                setPreviews(p => { const n={...p}; delete n[field]; return n; });
                set(field, '');
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.9)' }}>
              <X size={13} className="text-white" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-36 rounded-xl cursor-pointer transition-all"
            style={{ border: '2px dashed #a9b8b8', background: '#f8fafb' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a598a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#a9b8b8'}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: '#1a598a12' }}>
              <Upload size={18} style={{ color: '#1a598a' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: '#67787a' }}>Upload image</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(field, e.target.files[0])} />
          </label>
        )}
      </div>
      <input type="text" placeholder="Or paste image URL…" value={form[field] || ''}
        onChange={e => set(field, e.target.value)}
        style={{ ...inputStyle, marginTop: '8px' }}
        onFocus={e => e.target.style.borderColor = '#1a598a'}
        onBlur={e => e.target.style.borderColor = '#ecf0f0'}
      />
    </Field>
  );

  const card = { background: '#ffffff', border: '1px solid #ecf0f0', borderRadius: '16px', padding: '24px' };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-7">
        <button onClick={() => navigate('/blogs')}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: '#ecf0f0', color: '#67787a' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1a598a12'; e.currentTarget.style.color = '#1a598a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ecf0f0'; e.currentTarget.style.color = '#67787a'; }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>{isEdit ? 'Edit Blog' : 'New Blog Post'}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>{isEdit ? 'Update blog details' : 'Create a new post'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Main column */}
          <div className="xl:col-span-2 space-y-5">
            <div style={card} className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a9b8b8' }}>Content</h2>
              <Field label="Title *">
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter blog title…" required />
              </Field>
              <Field label="Short Description">
                <Textarea value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Short excerpt shown in listings…" />
              </Field>
              <Field label="Paragraph 1">
                <Textarea value={form.desc1} onChange={e => set('desc1', e.target.value)} placeholder="First content paragraph…" />
              </Field>
              <Field label="Paragraph 2">
                <Textarea value={form.desc2} onChange={e => set('desc2', e.target.value)} placeholder="Second content paragraph…" />
              </Field>
              <Field label="Full Body" hint="Supports Markdown or plain HTML.">
                <Textarea value={form.body} onChange={e => set('body', e.target.value)} placeholder="Full article content…" rows={10} mono />
              </Field>
            </div>

            {/* Images */}
            <div style={card}>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#a9b8b8' }}>Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ImageField field="img"        label="Main / Listing Image" />
                <ImageField field="detailsImg" label="Details Page Hero" />
                <ImageField field="img1"       label="Inline Grid Left" />
                <ImageField field="img2"       label="Inline Grid Right" />
                <ImageField field="smallImg"   label="Sidebar Thumbnail" />
                
              </div>
            </div>

            {/* Video */}
            <div style={card} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a9b8b8' }}>Video</h2>
              <Field label="Video URL">
                <Input type="url" value={form.videoUrl || ''} onChange={e => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              </Field>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish */}
            <div style={card} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a9b8b8' }}>Publish</h2>
              {[
                { key: 'isPublished', label: form.isPublished ? 'Published (Live)' : 'Draft (Hidden)', activeColor: '#1a598a' },
                { key: 'isFeatured', label: 'Featured Post', activeColor: '#d97706' },
              ].map(({ key, label, activeColor }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set(key, !form[key])}
                    className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                    style={{ background: form[key] ? activeColor : '#ecf0f0' }}>
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                      style={{ transform: form[key] ? 'translateX(20px)' : 'translateX(0)' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#1a425c' }}>{label}</span>
                </label>
              ))}
              <button type="submit" disabled={loading}
                className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none"
                style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : isEdit ? 'Update Blog' : 'Publish Blog'}
              </button>
            </div>

            {/* Meta */}
            <div style={card} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a9b8b8' }}>Meta</h2>
              {[
                { label: 'Category', key: 'category', options: CATEGORIES },
                { label: 'Status / Type', key: 'status', options: STATUSES },
              ].map(({ label, key, options }) => (
                <Field key={key} label={label}>
                  <select value={form[key]} onChange={e => set(key, e.target.value)} style={inputStyle}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              ))}
              <Field label="Author Name">
                <Input value={form.author} onChange={e => set('author', e.target.value)} />
              </Field>
              <Field label="Author Role">
                <Input value={form.author_role} onChange={e => set('author_role', e.target.value)} />
              </Field>
            </div>

            {/* Tags */}
            <div style={card}>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#a9b8b8' }}>Tags</h2>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map(tag => (
                  <button key={tag} type="button" onClick={() => handleTag(tag)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                    style={form.tags.includes(tag)
                      ? { background: '#1a598a', color: '#ffffff', border: '1.5px solid #1a598a' }
                      : { background: '#f8fafb', color: '#67787a', border: '1.5px solid #ecf0f0' }}>
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input type="text" placeholder="Add custom tag + Enter…" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1a598a'}
                  onBlur={e => e.target.style.borderColor = '#ecf0f0'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !form.tags.includes(val)) {
                        set('tags', [...form.tags, val]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: '#1a598a12', color: '#1a598a', border: '1px solid #1a598a30' }}>
                      {tag}
                      <button type="button" onClick={() => handleTag(tag)} className="hover:text-red-500 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}