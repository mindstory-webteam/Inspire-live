/**
 * ContactInfoAdmin.jsx
 * Admin panel for managing the 4 contact info cards (Location, Email, Phone, Live Chat)
 * shown in ContactTop.jsx on the public site.
 *
 * Place in: admin/src/pages/ContactInfoAdmin.jsx  (or pages/ folder of your choice)
 * Import contactInfoService from your api.js (see contactInfoService.js snippet)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Mail, Phone, MessageCircle,
  Plus, Trash2, Save, RotateCcw, Eye, EyeOff,
  CheckCircle, XCircle, X, ChevronUp, ChevronDown,
  RefreshCw, AlertTriangle, GripVertical,
} from 'lucide-react';
import { contactInfoService } from '../services/api';

/* ─── icon map ────────────────────────────────────────────────────────────── */
const ICON = {
  location: <MapPin size={20} />,
  email:    <Mail size={20} />,
  phone:    <Phone size={20} />,
  livechat: <MessageCircle size={20} />,
};

const TYPE_COLOR = {
  location: { bg: '#eff6ff', icon: '#2563eb', border: '#bfdbfe' },
  email:    { bg: '#f0fdf4', icon: '#16a34a', border: '#bbf7d0' },
  phone:    { bg: '#fff7ed', icon: '#ea580c', border: '#fed7aa' },
  livechat: { bg: '#faf5ff', icon: '#7c3aed', border: '#ddd6fe' },
};

const TYPE_LABEL = {
  location: 'Location',
  email:    'Email',
  phone:    'Phone',
  livechat: 'Live Chat',
};

/* ─── base styles ─────────────────────────────────────────────────────────── */
const INPUT = {
  width: '100%', padding: '8px 12px', border: '1.5px solid #d1d5db',
  borderRadius: 8, fontSize: 14, color: '#111827', background: '#fff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color .15s',
};

function btn(variant, sm) {
  const base = {
    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    fontSize: sm ? 12 : 14, display: 'inline-flex', alignItems: 'center',
    gap: 6, padding: sm ? '5px 10px' : '9px 18px', transition: 'opacity .15s',
    whiteSpace: 'nowrap',
  };
  const map = {
    primary: { ...base, background: 'linear-gradient(135deg,#1a598a,#015599)', color: '#fff' },
    danger:  { ...base, background: '#ef4444', color: '#fff' },
    ghost:   { ...base, background: '#f3f4f6', color: '#374151' },
    success: { ...base, background: '#22c55e', color: '#fff' },
    amber:   { ...base, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
    outline: { ...base, background: '#fff', color: '#374151', border: '1.5px solid #d1d5db' },
  };
  return map[variant] || base;
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
      background: type === 'error' ? '#ef4444' : '#22c55e',
      color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 14,
      fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,.2)', maxWidth: 380,
    }}>
      {type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
        <X size={14} />
      </button>
    </div>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────────────── */
function Confirm({ message, onConfirm, onCancel, danger }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.45)',
      backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onMouseDown={e => e.target === e.currentTarget && onCancel()}>
      <div onMouseDown={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420,
        padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,.25)',
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <p style={{ margin: 0, fontSize: 15, color: '#374151', lineHeight: 1.5 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btn('ghost')}>Cancel</button>
          <button onClick={onConfirm} style={btn(danger ? 'danger' : 'primary')}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Line Editor ────────────────────────────────────────────────────────── */
function LineEditor({ lines, onChange, type }) {
  const add = () => onChange([...lines, { label: '', value: '', href: '' }]);

  const update = (i, field, val) => {
    const next = lines.map((l, idx) => idx === i ? { ...l, [field]: val } : l);
    onChange(next);
  };

  const remove = (i) => onChange(lines.filter((_, idx) => idx !== i));

  const move = (i, dir) => {
    const next = [...lines];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const hrefPlaceholder = {
    location: '',
    email:    'mailto:example@email.com',
    phone:    'tel:+91XXXXXXXXXX',
    livechat: 'mailto:example@email.com or /contact',
  }[type] || '';

  return (
    <div>
      {lines.map((line, i) => (
        <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <GripVertical size={14} color="#9ca3af" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Line {i + 1}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={{ ...btn('ghost', true), padding: '3px 6px', opacity: i === 0 ? 0.35 : 1 }}>
                <ChevronUp size={12} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === lines.length - 1} style={{ ...btn('ghost', true), padding: '3px 6px', opacity: i === lines.length - 1 ? 0.35 : 1 }}>
                <ChevronDown size={12} />
              </button>
              <button onClick={() => remove(i)} disabled={lines.length === 1} style={{ ...btn('danger', true), padding: '3px 6px', opacity: lines.length === 1 ? 0.35 : 1 }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Value */}
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Display Text *
          </label>
          <input
            style={{ ...INPUT, marginBottom: 8 }}
            value={line.value}
            onChange={e => update(i, 'value', e.target.value)}
            placeholder={type === 'location' ? 'Full address...' : 'Display text'}
          />

          {/* Href (not needed for location) */}
          {type !== 'location' && (
            <>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                Link (href)
              </label>
              <input
                style={{ ...INPUT, marginBottom: 8 }}
                value={line.href}
                onChange={e => update(i, 'href', e.target.value)}
                placeholder={hrefPlaceholder}
              />
            </>
          )}

          {/* Label (optional flag, e.g. "active") */}
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Label / CSS Class (optional)
          </label>
          <input
            style={INPUT}
            value={line.label}
            onChange={e => update(i, 'label', e.target.value)}
            placeholder='e.g. "active" for highlighted link'
          />
        </div>
      ))}

      <button onClick={add} style={{ ...btn('outline', true), width: '100%', justifyContent: 'center', marginTop: 2 }}>
        <Plus size={13} /> Add Line
      </button>
    </div>
  );
}

/* ─── Card Editor ────────────────────────────────────────────────────────── */
function CardEditor({ card, onSave, onToggle, saving }) {
  const [form, setForm] = useState({ title: card.title, lines: card.lines, isActive: card.isActive });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({ title: card.title, lines: card.lines, isActive: card.isActive });
    setDirty(false);
  }, [card]);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setDirty(true); };
  const c = TYPE_COLOR[card.type];

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: `1.5px solid ${dirty ? '#f59e0b' : '#e5e7eb'}`,
      overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* Card Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 12, background: c.bg }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: `1.5px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.icon, flexShrink: 0 }}>
          {ICON[card.type]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{TYPE_LABEL[card.type]}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
            {card.lines.length} line{card.lines.length !== 1 ? 's' : ''} · {card.isActive ? 'Visible' : 'Hidden'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dirty && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: 6, border: '1px solid #fde68a' }}>
              Unsaved
            </span>
          )}
          <button
            onClick={() => onToggle(card.type)}
            style={btn(card.isActive ? 'ghost' : 'amber', true)}
            title={card.isActive ? 'Hide card' : 'Show card'}
          >
            {card.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
            {card.isActive ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div style={{ padding: '18px' }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
          Card Title *
        </label>
        <input
          style={{ ...INPUT, marginBottom: 18 }}
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Card title shown to visitors"
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
          Content Lines *
        </label>
        <LineEditor
          type={card.type}
          lines={form.lines}
          onChange={val => set('lines', val)}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={() => onSave(card.type, form)}
            disabled={saving || !dirty}
            style={{ ...btn('primary'), opacity: saving || !dirty ? 0.55 : 1, flex: 1, justifyContent: 'center' }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            onClick={() => { setForm({ title: card.title, lines: card.lines, isActive: card.isActive }); setDirty(false); }}
            disabled={!dirty}
            style={{ ...btn('ghost'), opacity: !dirty ? 0.4 : 1 }}
            title="Discard changes"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Panel ──────────────────────────────────────────────────────── */
function PreviewPanel({ cards }) {
  const active = cards.filter(c => c.isActive);
  return (
    <div style={{ background: '#f8fafc', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
        Live Preview — Contact Info Cards
      </div>
      {active.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 14 }}>
          <EyeOff size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
          <div>All cards are hidden</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {active.map(card => {
            const c = TYPE_COLOR[card.type];
            return (
              <div key={card.type} style={{
                background: '#fff', borderRadius: 12, border: `1px solid ${c.border}`,
                padding: '18px 16px', textAlign: 'center',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.icon, margin: '0 auto 10px' }}>
                  {ICON[card.type]}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{card.title}</div>
                {card.lines.map((l, i) => (
                  <div key={i} style={{ fontSize: 11, color: l.label === 'active' ? '#1a598a' : '#6b7280', marginBottom: 3, wordBreak: 'break-all' }}>
                    {l.href ? (
                      <span style={{ color: '#1a598a', textDecoration: 'underline' }}>{l.value}</span>
                    ) : l.value}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function ContactInfoAdmin() {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(null); // type being saved
  const [toast,   setToast]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const r = await contactInfoService.getAll();
      if (r.data?.success) setCards(r.data.data);
    } catch {
      showToast('Failed to load contact info', 'error');
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { loadCards(); }, [loadCards]);

  const handleSave = async (type, form) => {
    setSaving(type);
    try {
      const r = await contactInfoService.update(type, form);
      if (r.data?.success) {
        showToast('Saved successfully');
        setCards(prev => prev.map(c => c.type === type ? r.data.data : c));
      }
    } catch (e) {
      showToast(e.response?.data?.message || 'Save failed', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (type) => {
    try {
      const r = await contactInfoService.toggle(type);
      if (r.data?.success) {
        showToast(r.data.message);
        setCards(prev => prev.map(c => c.type === type ? r.data.data : c));
      }
    } catch {
      showToast('Toggle failed', 'error');
    }
  };

  const handleSeedReset = async () => {
    try {
      const r = await contactInfoService.seed();
      if (r.data?.success) {
        showToast('Reset to defaults');
        setCards(r.data.data);
      }
    } catch {
      showToast('Reset failed', 'error');
    }
    setConfirm(null);
  };

  /* ordered list for display */
  const ordered = [...cards].sort((a, b) => a.order - b.order);

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Contact Info Cards</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Manage the 4 info cards displayed in the "Reach Out to Us" section of your contact page
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadCards} style={btn('ghost')}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => setConfirm({ type: 'seed' })}
            style={btn('amber')}
            title="Reset all cards to original factory defaults"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
          Changes here update the <strong>Location, Email, Phone</strong> and <strong>Live Chat</strong> cards visible to all visitors on the Contact page. Save each card individually. Toggle visibility without saving to temporarily hide a card.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 80, textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#1a598a', animation: 'spin .8s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading contact info…</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>

          {/* ── Left column: cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ordered.map(card => (
              <CardEditor
                key={card.type}
                card={card}
                onSave={handleSave}
                onToggle={handleToggle}
                saving={saving === card.type}
              />
            ))}
          </div>

          {/* ── Right column: preview + tips ── */}
          <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PreviewPanel cards={ordered} />

            {/* Tips */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Tips
              </div>
              {[
                { icon: '📍', text: 'Location uses plain text — no link needed.' },
                { icon: '📧', text: 'Email href should start with mailto:' },
                { icon: '📞', text: 'Phone href should start with tel:' },
                { icon: '💬', text: 'Live Chat can mix mailto: links and page paths like /contact' },
                { icon: '👁', text: 'Toggle "Visible/Hidden" to hide a card without deleting it.' },
                { icon: '↩️', text: '"Reset Defaults" restores original address, email, and phone.' },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Card status summary */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Card Status
              </div>
              {ordered.map(card => {
                const c = TYPE_COLOR[card.type];
                return (
                  <div key={card.type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.icon, flexShrink: 0 }}>
                      {ICON[card.type]}
                    </div>
                    <span style={{ fontSize: 13, color: '#374151', flex: 1, fontWeight: 500 }}>{TYPE_LABEL[card.type]}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: card.isActive ? '#f0fdf4' : '#f3f4f6',
                      color: card.isActive ? '#15803d' : '#9ca3af',
                      border: `1px solid ${card.isActive ? '#bbf7d0' : '#e5e7eb'}`,
                    }}>
                      {card.isActive ? '● Visible' : '○ Hidden'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset */}
      {confirm?.type === 'seed' && (
        <Confirm
          message="This will reset all 4 contact info cards to their original default values. Any custom changes will be lost."
          onConfirm={handleSeedReset}
          onCancel={() => setConfirm(null)}
          danger
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}