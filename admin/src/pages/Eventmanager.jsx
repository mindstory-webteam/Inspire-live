import { useState, useEffect, useRef } from "react";
// Uses your shared axios instance — token attached automatically via interceptor
import { eventService } from "../services/api";

// ── If your api.js is at a different relative path, update the import above ──
// e.g. import { eventService } from "../../src/services/api";

const EVENT_TYPES    = ["conference","orientation","symposium","festival","career","sports","other"];
const EVENT_STATUSES = ["upcoming","featured","past","draft"];

const EMPTY_FORM = {
  eventTitle: "", tagline: "", eventBrief: "",
  eventDate: "", eventVenue: "", eventType: "conference",
  participantCount: "", eventStatus: "upcoming", order: 0,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position:"fixed", top:24, right:24, zIndex:9999,
    background: type === "success" ? "#16a34a" : "#dc2626",
    color:"#fff", padding:"14px 22px", borderRadius:10,
    fontWeight:600, fontSize:14, boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
    display:"flex", alignItems:"center", gap:10, maxWidth:380,
    animation:"slideIn 0.3s ease",
  }}>
    {type === "success" ? "✅" : "❌"} {message}
    <button onClick={onClose}
      style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginLeft:8,fontSize:18}}>
      ×
    </button>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    featured: { bg:"#dbeafe", color:"#1d4ed8" },
    upcoming:  { bg:"#d1fae5", color:"#065f46" },
    past:      { bg:"#f3f4f6", color:"#6b7280" },
    draft:     { bg:"#fef3c7", color:"#92400e" },
  };
  const c = colors[status] || colors.draft;
  return (
    <span style={{
      padding:"3px 10px", borderRadius:20, fontSize:11,
      fontWeight:700, textTransform:"uppercase",
      background:c.bg, color:c.color, letterSpacing:"0.5px",
    }}>{status}</span>
  );
};

// ─── Event Form Modal ─────────────────────────────────────────────────────────
const EventModal = ({ event, onClose, onSave }) => {
  const [form, setForm]         = useState(event ? { ...event } : { ...EMPTY_FORM });
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(event?.eventImage?.url || "");
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState({});
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.eventTitle.trim())  errs.eventTitle  = "Title is required";
    if (!form.eventBrief.trim())  errs.eventBrief  = "Description is required";
    if (!form.eventDate.trim())   errs.eventDate   = "Date is required";
    if (!form.eventVenue.trim())  errs.eventVenue  = "Venue is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      // Build FormData so image file is sent correctly
      const fd = new FormData();
      const skip = new Set(["eventImage","_id","__v","createdAt","updatedAt","isActive"]);
      Object.entries(form).forEach(([k, v]) => {
        if (!skip.has(k)) fd.append(k, v);
      });
      if (imageFile) fd.append("eventImage", imageFile);

      // eventService uses your axios instance (token auto-attached)
      const res = event?._id
        ? await eventService.update(event._id, fd)
        : await eventService.create(fd);

      onSave(res.data.data, !!event?._id);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save event";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const inp = (hasErr) => ({
    width:"100%", padding:"10px 14px",
    border:`2px solid ${hasErr ? "#dc2626" : "#e5e7eb"}`,
    borderRadius:8, fontSize:14, outline:"none",
    transition:"border-color 0.2s", boxSizing:"border-box",
  });

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(12,30,33,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{
        background:"#fff", borderRadius:16, width:"100%",
        maxWidth:680, maxHeight:"90vh", overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{
          padding:"20px 28px", borderBottom:"1px solid #f3f4f6",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"sticky", top:0, background:"#fff", zIndex:1,
        }}>
          <h2 style={{margin:0, fontSize:20, fontWeight:700, color:"#0c1e21"}}>
            {event?._id ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose}
            style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#6b7280"}}>
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{padding:28}}>

          {/* Image Upload */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
              Event Image
            </label>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border:"2px dashed #d1d5db", borderRadius:12, cursor:"pointer",
                background:"#f9fafb", position:"relative", height:160, overflow:"hidden",
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview"
                    style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} />
                  <div style={{
                    position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    opacity:0,transition:"opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1}
                    onMouseLeave={e => e.currentTarget.style.opacity=0}
                  >
                    <span style={{color:"#fff",fontWeight:600,fontSize:14}}>Change Image</span>
                  </div>
                </>
              ) : (
                <div style={{color:"#6b7280",textAlign:"center",paddingTop:36}}>
                  <div style={{fontSize:36,marginBottom:8}}>🖼️</div>
                  <div style={{fontWeight:600,fontSize:14}}>Click to upload image</div>
                  <div style={{fontSize:12,marginTop:4}}>JPG, PNG, WebP up to 10MB</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              onChange={handleImageChange} style={{display:"none"}} />
          </div>

          {/* Title + Tagline */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
                Event Title *
              </label>
              <input name="eventTitle" value={form.eventTitle} onChange={handleChange}
                placeholder="e.g. Annual Academic Conference" style={inp(errors.eventTitle)} />
              {errors.eventTitle && <p style={{color:"#dc2626",fontSize:12,marginTop:4}}>{errors.eventTitle}</p>}
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
                Tagline
              </label>
              <input name="tagline" value={form.tagline} onChange={handleChange}
                placeholder="e.g. Advancing Research & Innovation" style={inp(false)} />
            </div>
          </div>

          {/* Brief */}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
              Event Brief *
            </label>
            <textarea name="eventBrief" value={form.eventBrief} onChange={handleChange}
              rows={3} placeholder="Short description of the event..."
              style={{...inp(errors.eventBrief), resize:"vertical"}} />
            {errors.eventBrief && <p style={{color:"#dc2626",fontSize:12,marginTop:4}}>{errors.eventBrief}</p>}
          </div>

          {/* Date + Venue */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
                Event Date *
              </label>
              <input name="eventDate" value={form.eventDate} onChange={handleChange}
                placeholder="e.g. March 15-17, 2024" style={inp(errors.eventDate)} />
              {errors.eventDate && <p style={{color:"#dc2626",fontSize:12,marginTop:4}}>{errors.eventDate}</p>}
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
                Venue *
              </label>
              <input name="eventVenue" value={form.eventVenue} onChange={handleChange}
                placeholder="e.g. Main Auditorium" style={inp(errors.eventVenue)} />
              {errors.eventVenue && <p style={{color:"#dc2626",fontSize:12,marginTop:4}}>{errors.eventVenue}</p>}
            </div>
          </div>

          {/* Type / Status / Participants / Order */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Type *</label>
              <select name="eventType" value={form.eventType} onChange={handleChange} style={inp(false)}>
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Status</label>
              <select name="eventStatus" value={form.eventStatus} onChange={handleChange} style={inp(false)}>
                {EVENT_STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Participants</label>
              <input name="participantCount" value={form.participantCount} onChange={handleChange}
                placeholder="e.g. 500+" style={inp(false)} />
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Order</label>
              <input name="order" type="number" value={form.order} onChange={handleChange}
                placeholder="0" style={inp(false)} />
            </div>
          </div>

          {/* Footer */}
          <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
            <button type="button" onClick={onClose}
              style={{padding:"10px 24px",background:"#f3f4f6",border:"none",
                borderRadius:8,fontSize:14,fontWeight:600,color:"#374151",cursor:"pointer"}}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{padding:"10px 28px",
                background: saving ? "#9ca3af" : "#1a598a",
                border:"none",borderRadius:8,fontSize:14,fontWeight:600,
                color:"#fff",cursor: saving ? "not-allowed" : "pointer",
                transition:"background 0.2s"}}>
              {saving ? "Saving…" : event?._id ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Dialog ────────────────────────────────────────────────────────────
const DeleteDialog = ({ event, onConfirm, onCancel, deleting }) => (
  <div style={{
    position:"fixed",inset:0,zIndex:1001,
    background:"rgba(12,30,33,0.7)",
    display:"flex",alignItems:"center",justifyContent:"center",padding:20,
  }}>
    <div style={{
      background:"#fff",borderRadius:16,padding:32,
      maxWidth:400,width:"100%",textAlign:"center",
      boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
    }}>
      <div style={{fontSize:48,marginBottom:16}}>🗑️</div>
      <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:700,color:"#0c1e21"}}>Delete Event</h3>
      <p style={{color:"#6b7280",margin:"0 0 24px",fontSize:14}}>
        Are you sure you want to delete <strong>"{event.eventTitle}"</strong>? This cannot be undone.
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <button onClick={onCancel}
          style={{padding:"10px 24px",background:"#f3f4f6",border:"none",
            borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          style={{padding:"10px 24px",
            background: deleting ? "#9ca3af" : "#dc2626",
            border:"none",borderRadius:8,fontSize:14,fontWeight:600,
            color:"#fff",cursor: deleting ? "not-allowed" : "pointer"}}>
          {deleting ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main EventManager ────────────────────────────────────────────────────────
const EventManager = () => {
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal]   = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [toggling, setToggling]     = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== "all")   params.type   = filterType;
      if (filterStatus !== "all") params.status = filterStatus;
      if (search.trim())          params.search = search.trim();

      // Token auto-attached by axios interceptor
      const res = await eventService.getAllAdmin(params);
      setEvents(res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [filterType, filterStatus]);

  const handleSearch = (e) => { e.preventDefault(); fetchEvents(); };

  const handleSave = (savedEvent, isEdit) => {
    if (isEdit) {
      setEvents(prev => prev.map(e => e._id === savedEvent._id ? savedEvent : e));
      showToast("Event updated successfully!");
    } else {
      setEvents(prev => [savedEvent, ...prev]);
      showToast("Event created successfully!");
    }
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await eventService.delete(deleteTarget._id);
      setEvents(prev => prev.filter(e => e._id !== deleteTarget._id));
      showToast("Event deleted successfully!");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (event) => {
    setToggling(event._id);
    try {
      const res = await eventService.toggle(event._id);
      setEvents(prev => prev.map(e => e._id === event._id ? res.data.data : e));
      showToast(`Event ${res.data.data.isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Toggle failed", "error");
    } finally {
      setToggling(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalActive   = events.filter(e => e.isActive).length;
  const totalFeatured = events.filter(e => e.eventStatus === "featured").length;
  const totalUpcoming = events.filter(e => e.eventStatus === "upcoming").length;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    wrapper:  { padding:"28px 32px", background:"#f9fafb", minHeight:"100vh" },
    header:   { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 },
    title:    { fontSize:26, fontWeight:800, color:"#0c1e21", margin:0 },
    subtitle: { fontSize:14, color:"#6b7280", marginTop:4 },
    addBtn:   {
      padding:"11px 24px", background:"#1a598a", color:"#fff",
      border:"none", borderRadius:10, fontSize:14, fontWeight:700,
      cursor:"pointer", display:"flex", alignItems:"center", gap:8,
    },
    toolbar:  {
      background:"#fff", borderRadius:12, padding:"16px 20px",
      display:"flex", gap:12, marginBottom:20,
      boxShadow:"0 1px 4px rgba(0,0,0,0.06)", flexWrap:"wrap", alignItems:"center",
    },
    searchForm: { display:"flex", gap:8, flex:1, minWidth:200 },
    searchInput: {
      flex:1, padding:"9px 14px",
      border:"2px solid #e5e7eb", borderRadius:8, fontSize:14, outline:"none",
    },
    searchBtn: {
      padding:"9px 18px", background:"#1a598a", color:"#fff",
      border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer",
    },
    resetBtn: {
      padding:"9px 18px", background:"#f3f4f6", color:"#374151",
      border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer",
    },
    select: {
      padding:"9px 14px", border:"2px solid #e5e7eb", borderRadius:8,
      fontSize:14, outline:"none", background:"#fff", cursor:"pointer",
    },
    tableWrap: {
      background:"#fff", borderRadius:12,
      boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden",
    },
    table: { width:"100%", borderCollapse:"collapse" },
    th: {
      padding:"14px 16px", textAlign:"left", fontSize:12,
      fontWeight:700, color:"#6b7280", textTransform:"uppercase",
      letterSpacing:"0.5px", background:"#f9fafb", borderBottom:"1px solid #f3f4f6",
    },
    td: {
      padding:"14px 16px", fontSize:14, color:"#374151",
      borderBottom:"1px solid #f9fafb", verticalAlign:"middle",
    },
    statsRow: { display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" },
    statCard: (color) => ({
      flex:1, minWidth:150, background:"#fff", borderRadius:12,
      padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
      borderLeft:`4px solid ${color}`,
    }),
    emptyState: { textAlign:"center", padding:"60px 20px", color:"#6b7280" },
  };

  return (
    <div style={S.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          event={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Events Manager</h1>
          <p style={S.subtitle}>{events.length} total event{events.length !== 1 ? "s" : ""}</p>
        </div>
        <button style={S.addBtn} onClick={() => { setEditingEvent(null); setShowModal(true); }}>
          + Add Event
        </button>
      </div>

      {/* Stats */}
      <div style={S.statsRow}>
        {[
          { label:"Total Events",  value: events.length,  color:"#1a598a" },
          { label:"Active",        value: totalActive,    color:"#16a34a" },
          { label:"Featured",      value: totalFeatured,  color:"#d97706" },
          { label:"Upcoming",      value: totalUpcoming,  color:"#7c3aed" },
        ].map(({ label, value, color }) => (
          <div key={label} style={S.statCard(color)}>
            <div style={{fontSize:28,fontWeight:800,color:"#0c1e21"}}>{value}</div>
            <div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={S.toolbar}>
        <form onSubmit={handleSearch} style={S.searchForm}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events…" style={S.searchInput} />
          <button type="submit" style={S.searchBtn}>Search</button>
        </form>

        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={S.select}>
          <option value="all">All Types</option>
          {EVENT_TYPES.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={S.select}>
          <option value="all">All Statuses</option>
          {EVENT_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>

        <button style={S.resetBtn} onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); }}>
          Reset
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrap}>
        {loading ? (
          <div style={S.emptyState}>
            <div style={{fontSize:36,marginBottom:12}}>⏳</div>
            <p style={{fontWeight:600}}>Loading events…</p>
          </div>
        ) : events.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <h3 style={{fontSize:18,fontWeight:700,color:"#0c1e21",marginBottom:8}}>No events found</h3>
            <p>Try adjusting your filters or add your first event.</p>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                {["Image","Event","Type","Date","Status","Active","Actions"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}
                  onMouseEnter={e => e.currentTarget.style.background="#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={S.td}>
                    <img
                      src={event.eventImage?.url || "/images/events/default-event.webp"}
                      alt={event.eventTitle}
                      style={{width:60,height:44,objectFit:"cover",borderRadius:8,display:"block"}}
                    />
                  </td>
                  <td style={S.td}>
                    <div style={{fontWeight:700,color:"#0c1e21",marginBottom:2,maxWidth:220}}>
                      {event.eventTitle}
                    </div>
                    <div style={{fontSize:12,color:"#6b7280"}}>{event.tagline}</div>
                    <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>📍 {event.eventVenue}</div>
                  </td>
                  <td style={S.td}>
                    <span style={{
                      background:"#e0f2fe",color:"#0284c7",
                      padding:"3px 10px",borderRadius:20,fontSize:11,
                      fontWeight:700,textTransform:"uppercase",
                    }}>
                      {event.eventType}
                    </span>
                  </td>
                  <td style={{...S.td,fontSize:13,whiteSpace:"nowrap"}}>{event.eventDate}</td>
                  <td style={S.td}><StatusBadge status={event.eventStatus} /></td>
                  <td style={S.td}>
                    <button
                      onClick={() => handleToggle(event)}
                      disabled={toggling === event._id}
                      style={{
                        padding:"6px 14px",
                        background: event.isActive ? "#d1fae5" : "#fee2e2",
                        color:      event.isActive ? "#065f46" : "#991b1b",
                        border:"none", borderRadius:20, fontSize:11,
                        fontWeight:700, cursor:"pointer", transition:"all 0.2s",
                      }}
                    >
                      {toggling === event._id ? "…" : event.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={S.td}>
                    <div style={{display:"flex",gap:6}}>
                      <button
                        onClick={() => { setEditingEvent(event); setShowModal(true); }}
                        style={{
                          padding:"6px 12px",background:"#eff6ff",color:"#1d4ed8",
                          border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        style={{
                          padding:"6px 12px",background:"#fef2f2",color:"#dc2626",
                          border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default EventManager;