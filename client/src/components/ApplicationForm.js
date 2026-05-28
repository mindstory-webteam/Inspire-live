"use client";

import { useState, useRef, useEffect } from "react";

const BRAND     = "#1a5276";
const TEXT_DARK = "#1a2e4a";
const BORDER    = "#c8d4e6";
const BG_PAGE   = "#f4f7fb";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium",
  "Brazil","Canada","China","Colombia","Denmark","Egypt","Ethiopia","Finland","France",
  "Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Japan","Jordan","Kenya","Kuwait","Malaysia","Mexico","Morocco","Nepal",
  "Netherlands","New Zealand","Nigeria","Norway","Pakistan","Philippines","Poland",
  "Portugal","Qatar","Romania","Russia","Saudi Arabia","Singapore","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey","UAE",
  "Uganda","UK","USA","Ukraine","Vietnam","Zimbabwe",
];

const PAYMENT_METHODS = [
  "Credit Card / Debit Card",
  "Net Banking",
  "UPI (GPay / PhonePe / Paytm)",
  "Bank Transfer / NEFT / RTGS",
  "Demand Draft",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const S = {
  wrap: { background: BG_PAGE, padding: "64px 20px 80px", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "60vh" },
  center: { maxWidth: 720, margin: "0 auto" },
  heading: { textAlign: "center", marginBottom: 36 },
  eyebrow: { color: BRAND, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 },
  h1: { color: TEXT_DARK, fontSize: 30, fontWeight: 800, margin: "6px 0 0" },
  sub: { color: "#6b7280", fontSize: 14, marginTop: 6 },
  stepRow: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 },
  stepConnector: (done) => ({ width: 50, height: 2, background: done ? BRAND : "#d1d5db", transition: "background 0.4s" }),
  stepCircle: (active, done) => ({
    width: 36, height: 36, borderRadius: "50%",
    background: active || done ? BRAND : "#e5e7eb",
    color: active || done ? "#fff" : "#9ca3af",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700,
    boxShadow: active ? `0 0 0 4px ${BRAND}30` : "none",
    transform: active ? "scale(1.12)" : "scale(1)",
    transition: "all 0.3s", flexShrink: 0,
  }),
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 32px rgba(26,82,118,0.10)", padding: "40px 44px" },
  sectionTitle: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingBottom: 16, borderBottom: `2px solid ${BG_PAGE}` },
  sectionBadge: { width: 28, height: 28, borderRadius: "50%", background: BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  sectionTitleText: { color: BRAND, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 },
  subSection: { marginBottom: 32, paddingBottom: 28, borderBottom: `1px dashed ${BORDER}` },
  subSectionLast: { marginBottom: 8 },
  subTitle: { color: TEXT_DARK, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, marginTop: 0 },
  fieldWrap: { marginBottom: 18 },
  label: { display: "block", color: TEXT_DARK, fontSize: 13, fontWeight: 600, marginBottom: 6 },
  required: { color: "#ef4444", marginLeft: 2 },
  input: (err) => ({ width: "100%", border: `1.5px solid ${err ? "#ef4444" : BORDER}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TEXT_DARK, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }),
  select: (err) => ({ width: "100%", border: `1.5px solid ${err ? "#ef4444" : BORDER}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TEXT_DARK, background: "#fff", outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer", fontFamily: "inherit" }),
  textarea: (err) => ({ width: "100%", border: `1.5px solid ${err ? "#ef4444" : BORDER}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TEXT_DARK, background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 110, fontFamily: "inherit" }),
  radioRow: { display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 4 },
  radioLabel: { display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: TEXT_DARK, cursor: "pointer" },
  errorMsg: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: BRAND, color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 6 },
  uploadBtnDone: { display: "inline-flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 6 },
  uploadFileName: { fontSize: 12, color: "#6b7280", marginTop: 5, marginLeft: 2 },
  btnRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BG_PAGE}` },
  btnBack: { padding: "10px 24px", borderRadius: 8, border: `1.5px solid ${BRAND}`, background: "transparent", color: BRAND, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnNext: { padding: "11px 32px", borderRadius: 8, border: "none", background: BRAND, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 12px rgba(26,82,118,0.25)", fontFamily: "inherit" },
  progressText: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 },
  paymentOption: (selected) => ({ display: "flex", alignItems: "center", gap: 12, border: `2px solid ${selected ? BRAND : BORDER}`, borderRadius: 10, padding: "14px 18px", marginBottom: 12, cursor: "pointer", background: selected ? `${BRAND}08` : "#fff", transition: "all 0.2s" }),
  paymentRadio: { accentColor: BRAND, width: 18, height: 18, flexShrink: 0 },
  successWrap: { display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px", background: BG_PAGE, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  successCard: { background: "#fff", borderRadius: 20, boxShadow: "0 4px 40px rgba(26,82,118,0.12)", padding: "56px 48px", maxWidth: 440, width: "100%", textAlign: "center" },
  successIcon: { width: 72, height: 72, borderRadius: "50%", background: BRAND, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" },
  successH2: { color: TEXT_DARK, fontSize: 24, fontWeight: 800, marginBottom: 10 },
  successP: { color: "#6b7280", fontSize: 14, lineHeight: 1.7, marginBottom: 32 },
  homeLink: { display: "inline-block", background: BRAND, color: "#fff", padding: "12px 32px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" },
};

// ─── Custom Calendar Picker ───────────────────────────────────────────────────
function DatePicker({ value, onChange, error }) {
  const today      = new Date();
  const parsed     = value ? new Date(value) : null;
  const [open, setOpen]       = useState(false);
  const [view, setView]       = useState("day");   // "day" | "month" | "year"
  const [curYear,  setCurYear]  = useState(parsed ? parsed.getFullYear()  : today.getFullYear());
  const [curMonth, setCurMonth] = useState(parsed ? parsed.getMonth()     : today.getMonth());
  const wrapRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Format display
  const displayVal = parsed
    ? `${String(parsed.getDate()).padStart(2,"0")} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`
    : "";

  // Calendar grid
  const firstDay  = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(d) {
    const mm   = String(curMonth + 1).padStart(2,"0");
    const dd   = String(d).padStart(2,"0");
    onChange(`${curYear}-${mm}-${dd}`);
    setOpen(false);
  }

  function isSelected(d) {
    return parsed &&
      parsed.getFullYear() === curYear &&
      parsed.getMonth()    === curMonth &&
      parsed.getDate()     === d;
  }

  function isToday(d) {
    return today.getFullYear() === curYear &&
      today.getMonth()    === curMonth &&
      today.getDate()     === d;
  }

  // Year range (1950 → current)
  const minYear = 1950;
  const maxYear = today.getFullYear();
  const years   = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {/* Trigger input */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", border: `1.5px solid ${error ? "#ef4444" : open ? BRAND : BORDER}`,
          borderRadius: 8, padding: "10px 14px", fontSize: 14,
          color: displayVal ? TEXT_DARK : "#9ca3af",
          background: "#fff", cursor: "pointer", boxSizing: "border-box",
          fontFamily: "inherit", userSelect: "none",
          boxShadow: open ? `0 0 0 3px ${BRAND}18` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <span>{displayVal || "Select date of birth"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>

      {/* Dropdown calendar */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 999,
          background: "#fff", borderRadius: 14, width: 300,
          boxShadow: "0 8px 40px rgba(26,82,118,0.18)",
          border: `1px solid ${BORDER}`, overflow: "hidden",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>

          {/* ── DAY VIEW ── */}
          {view === "day" && (
            <>
              {/* Header */}
              <div style={{ background: BRAND, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => { curMonth === 0 ? (setCurYear(y => y-1), setCurMonth(11)) : setCurMonth(m => m-1); }}
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>‹</button>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setView("month")}
                    style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 10px", borderRadius: 6 }}>
                    {MONTHS[curMonth]}
                  </button>
                  <button onClick={() => setView("year")}
                    style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 10px", borderRadius: 6 }}>
                    {curYear}
                  </button>
                </div>
                <button onClick={() => { curMonth === 11 ? (setCurYear(y => y+1), setCurMonth(0)) : setCurMonth(m => m+1); }}
                  style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>›</button>
              </div>

              {/* Day names */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 12px 4px", gap: 2 }}>
                {DAYS.map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
                ))}
              </div>

              {/* Cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 14px", gap: 2 }}>
                {cells.map((d, i) => (
                  <div key={i} onClick={() => d && selectDay(d)}
                    style={{
                      textAlign: "center", fontSize: 13, padding: "7px 0",
                      borderRadius: 8, cursor: d ? "pointer" : "default",
                      fontWeight: isSelected(d) ? 700 : isToday(d) ? 600 : 400,
                      background: isSelected(d) ? BRAND : isToday(d) ? `${BRAND}15` : "transparent",
                      color: isSelected(d) ? "#fff" : isToday(d) ? BRAND : d ? TEXT_DARK : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (d && !isSelected(d)) e.currentTarget.style.background = `${BRAND}12`; }}
                    onMouseLeave={e => { if (d && !isSelected(d)) e.currentTarget.style.background = "transparent"; }}
                  >{d || ""}</div>
                ))}
              </div>

              {/* Today button */}
              <div style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 16px", textAlign: "center" }}>
                <button onClick={() => { setCurYear(today.getFullYear()); setCurMonth(today.getMonth()); selectDay(today.getDate()); }}
                  style={{ background: "none", border: `1.5px solid ${BRAND}`, color: BRAND, borderRadius: 6, padding: "5px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Today
                </button>
              </div>
            </>
          )}

          {/* ── MONTH VIEW ── */}
          {view === "month" && (
            <>
              <div style={{ background: BRAND, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => setCurYear(y => y - 1)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", padding: "0 4px" }}>‹</button>
                <button onClick={() => setView("year")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 12px", borderRadius: 6 }}>{curYear}</button>
                <button onClick={() => setCurYear(y => y + 1)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", padding: "0 4px" }}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, padding: 16 }}>
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => { setCurMonth(i); setView("day"); }}
                    style={{
                      padding: "10px 4px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: i === curMonth ? BRAND : `${BRAND}08`,
                      color: i === curMonth ? "#fff" : TEXT_DARK,
                    }}>{m.slice(0,3)}</button>
                ))}
              </div>
            </>
          )}

          {/* ── YEAR VIEW ── */}
          {view === "year" && (
            <>
              <div style={{ background: BRAND, padding: "14px 16px", textAlign: "center" }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Select Year</span>
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, padding: 14 }}>
                {years.map(y => (
                  <button key={y} onClick={() => { setCurYear(y); setView("month"); }}
                    style={{
                      padding: "8px 4px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: y === curYear ? BRAND : `${BRAND}08`,
                      color: y === curYear ? "#fff" : TEXT_DARK,
                    }}>{y}</button>
                ))}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initPersonal() {
  return { fullName: "", dob: "", gender: "", contactNumber: "", email: "", country: "", address: "", city: "", zip: "" };
}
function initEducation() {
  return { sslc_board: "", sslc_year: "", sslc_grade: "", sslc_file: null, plus2_board: "", plus2_year: "", plus2_grade: "", plus2_file: null, degree_course: "", degree_year: "", degree_grade: "", degree_file: null, masters_course: "", masters_year: "", masters_grade: "", masters_file: null, extra_details: "", extra_file: null };
}
function initWork() {
  return { company: "", position: "", duration: "", description: "", work_file: null };
}

function Field({ label, required, error, children }) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}{required && <span style={S.required}>*</span>}</label>
      {children}
      {error && <p style={S.errorMsg}>{error}</p>}
    </div>
  );
}
function TextInput({ value, onChange, placeholder, type = "text", error }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={S.input(error)} />;
}
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={S.radioRow}>
      {options.map(opt => (
        <label key={opt} style={S.radioLabel}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={e => onChange(e.target.value)} style={{ accentColor: BRAND, width: 16, height: 16 }} />
          {opt}
        </label>
      ))}
    </div>
  );
}
function UploadButton({ label, file, onChange }) {
  const ref = useRef();
  return (
    <div>
      <input type="file" ref={ref} style={{ display: "none" }} onChange={e => onChange(e.target.files[0] || null)} />
      <button onClick={() => ref.current.click()} style={file ? S.uploadBtnDone : S.uploadBtn}>
        <span style={{ fontSize: 16 }}>{file ? "✓" : "+"}</span>
        {file ? "File Selected" : label}
      </button>
      {file && <p style={S.uploadFileName}>📎 {file.name}</p>}
    </div>
  );
}

const STEP_LABELS = ["Personal", "Education", "Experience", "Payment"];
function StepIndicator({ current, total }) {
  return (
    <div style={S.stepRow}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1; const active = n === current; const done = n < current;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={S.stepCircle(active, done)}>
                {done ? <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> : n}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active||done ? BRAND : "#9ca3af", whiteSpace: "nowrap" }}>{STEP_LABELS[i]}</span>
            </div>
            {n < total && <div style={{ ...S.stepConnector(done), marginBottom: 18 }} />}
          </div>
        );
      })}
    </div>
  );
}

function PersonalStep({ data, onChange, errors }) {
  const f = name => ({ value: data[name], onChange: v => onChange(name, v), error: errors[name] });
  return (
    <>
      <Field label="Full Name" required error={errors.fullName}><TextInput {...f("fullName")} placeholder="Enter your full name" /></Field>

      {/* ── Custom Date Picker for DOB ── */}
      <Field label="Date of Birth" required error={errors.dob}>
        <DatePicker value={data.dob} onChange={v => onChange("dob", v)} error={errors.dob} />
      </Field>

      <Field label="Gender" required error={errors.gender}><RadioGroup name="gender" options={["Male","Female","Other"]} value={data.gender} onChange={v => onChange("gender", v)} /></Field>
      <Field label="Contact Number" required error={errors.contactNumber}><TextInput {...f("contactNumber")} type="tel" placeholder="Enter your 10-digit phone number" /></Field>
      <Field label="Email" required error={errors.email}><TextInput {...f("email")} type="email" placeholder="e.g., yourname@email.com" /></Field>
      <Field label="Country / Region" error={errors.country}>
        <div style={{ position: "relative" }}>
          <select value={data.country} onChange={e => onChange("country", e.target.value)} style={S.select(false)}>
            <option value="">— Select —</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BRAND, fontSize: 11 }}>▼</span>
        </div>
      </Field>
      <Field label="Address" error={errors.address}><TextInput {...f("address")} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="City" error={errors.city}><TextInput {...f("city")} /></Field>
        <Field label="Zip / Postal Code" error={errors.zip}><TextInput {...f("zip")} /></Field>
      </div>
    </>
  );
}

function EduSub({ title, fields, data, onChange, last }) {
  return (
    <div style={last ? S.subSectionLast : S.subSection}>
      <p style={S.subTitle}>{title}</p>
      {fields.map(f => (
        <Field key={f.name} label={f.label} required={f.required}>
          {f.type === "upload" ? <UploadButton label={f.uploadLabel} file={data[f.name]} onChange={v => onChange(f.name, v)} />
            : f.type === "textarea" ? <textarea value={data[f.name]} placeholder={f.placeholder} rows={3} onChange={e => onChange(f.name, e.target.value)} style={S.textarea(false)} />
            : <TextInput value={data[f.name]} placeholder={f.placeholder} onChange={v => onChange(f.name, v)} />}
        </Field>
      ))}
    </div>
  );
}

function EducationStep({ data, onChange }) {
  const sections = [
    { title: "A. SSLC (10th Standard)", fields: [{ name:"sslc_board", label:"Board/University", type:"text", placeholder:"[e.g., CBSE, ICSE, State Board]" },{ name:"sslc_year", label:"Year of Passing", type:"text", placeholder:"[e.g., 2015]" },{ name:"sslc_grade", label:"Percentage/Grade", type:"text", placeholder:"[e.g., 82.5% or B+]" },{ name:"sslc_file", label:"Upload Document", type:"upload", uploadLabel:"Upload SSLC Certificate" }] },
    { title: "B. PLUS TWO (12th Standard)", fields: [{ name:"plus2_board", label:"Board/University", type:"text", placeholder:"[e.g., CBSE, State Board]" },{ name:"plus2_year", label:"Year of Passing", type:"text", placeholder:"[e.g., 2017]" },{ name:"plus2_grade", label:"Percentage/Grade", type:"text", placeholder:"[e.g., 82.5% or B+]" },{ name:"plus2_file", label:"Upload Document", type:"upload", uploadLabel:"Upload Plus Two Cert. & Marklist" }] },
    { title: "C. DEGREE", fields: [{ name:"degree_course", label:"Course & University", type:"text", placeholder:"[e.g., B.Com – University of XYZ]" },{ name:"degree_year", label:"Year of Passing", type:"text", placeholder:"[e.g., 2020]" },{ name:"degree_grade", label:"Percentage/Grade", type:"text", placeholder:"[e.g., 75% or First Class]", required: true },{ name:"degree_file", label:"Upload Document", type:"upload", uploadLabel:"Upload DEGREE Cert. & Marklist" }] },
    { title: "D. MASTER'S CERTIFICATE", fields: [{ name:"masters_course", label:"Course & University", type:"text", placeholder:"[e.g., MBA – University of ABC]" },{ name:"masters_year", label:"Year of Passing", type:"text", placeholder:"[e.g., 2022]" },{ name:"masters_grade", label:"Percentage/Grade", type:"text", placeholder:"[e.g., 75% or First Class]" },{ name:"masters_file", label:"Upload Document", type:"upload", uploadLabel:"Upload MASTER'S Cert. & Marklist" }] },
    { title: "E. ADDITIONAL QUALIFICATIONS (if any)", fields: [{ name:"extra_details", label:"Course Details", type:"textarea", placeholder:"[Mention any diplomas, certifications, etc.]" },{ name:"extra_file", label:"Upload Document", type:"upload", uploadLabel:"Upload Additional Certificates" }] },
  ];
  return <>{sections.map((s, i) => <EduSub key={s.title} {...s} data={data} onChange={onChange} last={i === sections.length - 1} />)}</>;
}

function WorkStep({ data, onChange, errors }) {
  const f = name => ({ value: data[name], onChange: v => onChange(name, v), error: errors[name] });
  return (
    <>
      <Field label="Company Name" error={errors.company}><TextInput {...f("company")} placeholder="[e.g., ABC Pvt. Ltd.]" /></Field>
      <Field label="Position" error={errors.position}><TextInput {...f("position")} placeholder="[e.g., Marketing Manager]" /></Field>
      <Field label="Duration" error={errors.duration}><TextInput {...f("duration")} placeholder="[e.g., Jan 2021 – June 2023]" /></Field>
      <Field label="Description of Role">
        <textarea value={data.description} placeholder="[Briefly describe your responsibilities and achievements]" rows={5} onChange={e => onChange("description", e.target.value)} style={S.textarea(false)} />
      </Field>
      <Field label="Upload Documents">
        <UploadButton label="Upload Experience Certificate" file={data.work_file} onChange={v => onChange("work_file", v)} />
      </Field>
    </>
  );
}

function PaymentStep({ data, onChange, errors }) {
  return (
    <>
      <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #0e3460 100%)`, borderRadius: 12, padding: "24px 28px", marginBottom: 28, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.75 }}>PhD Guidance Program</p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>Full doctoral support — topic to viva voce</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>Program Fee</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>₹35,500</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.65 }}>Inclusive of all taxes</p>
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "18px 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
          {["Topic & Synopsis Guidance","Chapter-wise Thesis Support","Journal Publication Help","Plagiarism Check & Correction","Statistical Analysis Support","Viva Voce Preparation"].map((item, i) => (
            <p key={i} style={{ margin: 0, fontSize: 12, opacity: 0.88, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 13 }}>✓</span> {item}
            </p>
          ))}
        </div>
      </div>

      <p style={{ color: TEXT_DARK, fontSize: 13, fontWeight: 700, marginBottom: 14, marginTop: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Choose Your Payment Method</p>
      {PAYMENT_METHODS.map(method => {
        const selected = data.paymentMethod === method;
        return (
          <div key={method} style={S.paymentOption(selected)} onClick={() => onChange("paymentMethod", method)}>
            <input type="radio" name="paymentMethod" value={method} checked={selected} onChange={() => onChange("paymentMethod", method)} style={S.paymentRadio} />
            <span style={{ color: TEXT_DARK, fontSize: 14, fontWeight: selected ? 700 : 400 }}>{method}</span>
          </div>
        );
      })}
      {errors.paymentMethod && <p style={S.errorMsg}>{errors.paymentMethod}</p>}

      <div style={{ background: `${BRAND}08`, border: `1px solid ${BRAND}30`, borderRadius: 10, padding: "14px 18px", marginTop: 20 }}>
        <p style={{ margin: 0, color: BRAND, fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
          📌 Payment of <strong>₹35,500</strong> is to be completed after your application is reviewed. Our counsellor will share payment details within 24 hours.
        </p>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 10, padding: "16px 18px", marginTop: 16, border: `1px solid ${BORDER}` }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: TEXT_DARK, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order Summary</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>PhD Guidance Program</span>
          <span style={{ fontSize: 13, color: TEXT_DARK, fontWeight: 600 }}>₹35,500</span>
        </div>
        <div style={{ height: 1, background: BORDER, margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: BRAND }}>₹35,500</span>
        </div>
      </div>
    </>
  );
}

export default function ApplicationForm() {
  const [step, setStep]     = useState(1);
  const [submitted, setSub] = useState(false);
  const [errors, setErrors] = useState({});
  const [personal,  setPersonal]  = useState(initPersonal);
  const [education, setEducation] = useState(initEducation);
  const [work,      setWork]      = useState(initWork);
  const [payment,   setPayment]   = useState({ paymentMethod: "" });

  function updatePersonal(n, v)  { setPersonal(p  => ({ ...p, [n]: v })); setErrors(e => ({ ...e, [n]: "" })); }
  function updateEducation(n, v) { setEducation(p => ({ ...p, [n]: v })); }
  function updateWork(n, v)      { setWork(p      => ({ ...p, [n]: v })); setErrors(e => ({ ...e, [n]: "" })); }
  function updatePayment(n, v)   { setPayment(p   => ({ ...p, [n]: v })); setErrors(e => ({ ...e, [n]: "" })); }

  function validate() {
    const errs = {};
    if (step === 1) {
      if (!personal.fullName)      errs.fullName      = "Required";
      if (!personal.dob)           errs.dob           = "Required";
      if (!personal.gender)        errs.gender        = "Required";
      if (!personal.contactNumber) errs.contactNumber = "Required";
      if (!personal.email)         errs.email         = "Required";
    }
    if (step === 4 && !payment.paymentMethod) errs.paymentMethod = "Please select a payment method.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    if (step < 4) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else setSub(true);
  }
  function handleBack() {
    if (step > 1) { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }

  const TITLES = ["Personal Details", "Educational Details", "Work Experience", "Payment & Submission"];

  if (submitted) {
    return (
      <div style={S.successWrap}>
        <div style={S.successCard}>
          <div style={S.successIcon}>
            <svg width="34" height="34" fill="none" stroke="#fff" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={S.successH2}>Application Submitted!</h2>
          <p style={S.successP}>
            Thank you, <strong>{personal.fullName || "Applicant"}</strong>. We have received your application.
            Our counsellors will contact you within 24 hours with payment details for the <strong>₹35,500</strong> program fee.
          </p>
          <a href="/" style={S.homeLink}>Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.center}>
        <div style={S.heading}>
          <p style={S.eyebrow}>Inspire Education Service</p>
          <h1 style={S.h1}>Application Form</h1>
          <p style={S.sub}>Complete all steps to submit your application.</p>
        </div>
        <StepIndicator current={step} total={4} />
        <div style={S.card}>
          <div style={S.sectionTitle}>
            <div style={S.sectionBadge}>{step}</div>
            <h2 style={S.sectionTitleText}>{TITLES[step - 1]}</h2>
          </div>
          {step === 1 && <PersonalStep  data={personal}  onChange={updatePersonal}  errors={errors} />}
          {step === 2 && <EducationStep data={education} onChange={updateEducation} />}
          {step === 3 && <WorkStep      data={work}      onChange={updateWork}      errors={errors} />}
          {step === 4 && <PaymentStep   data={payment}   onChange={updatePayment}   errors={errors} />}
          <div style={S.btnRow}>
            {step > 1 ? <button onClick={handleBack} style={S.btnBack}>← Back</button> : <div />}
            <button onClick={handleNext} style={S.btnNext}>
              {step === 4 ? "Submit Application ✓" : "Next →"}
            </button>
          </div>
        </div>
        <p style={S.progressText}>Step {step} of 4</p>
      </div>
    </div>
  );
}