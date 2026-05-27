"use client";

import Link from "next/link";

// ─── Course Data ──────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 1,
    badge: "Most Popular",
    badgeColor: "#1a5276",
    title: "PhD Guidance Program",
    subtitle: "Full Doctoral Support",
    duration: "3 – 5 Years",
    mode: "Online / Offline",
    eligibility: "Master's Degree (any discipline)",
    fee: "Contact Us",
    description:
      "Our flagship PhD Guidance Program provides end-to-end support for doctoral scholars — from topic selection and synopsis writing to thesis submission and viva preparation. Guided by experienced research mentors across all major disciplines.",
    highlights: [
      "Topic identification & research gap analysis",
      "Synopsis & research proposal writing",
      "Chapter-wise thesis guidance",
      "Journal paper publication support (Scopus / UGC)",
      "Statistical analysis & data interpretation",
      "Plagiarism check & correction",
      "Viva voce preparation",
      "University liaison support",
    ],
    disciplines: ["Science", "Arts", "Commerce", "Engineering", "Management", "Education", "Law", "Social Sciences"],
    icon: "🎓",
  },
  {
    id: 2,
    badge: "Fast Track",
    badgeColor: "#117a65",
    title: "PhD Abroad Program",
    subtitle: "International Doctoral Admission",
    duration: "3 – 4 Years",
    mode: "International Universities",
    eligibility: "Master's Degree + IELTS/TOEFL",
    fee: "Contact Us",
    description:
      "Realize your dream of studying abroad with our PhD Abroad Program. We assist scholars in identifying the right international universities, preparing research proposals, securing admissions, and handling visa documentation.",
    highlights: [
      "University shortlisting (USA, UK, Canada, Australia, Germany)",
      "Statement of Purpose (SOP) writing",
      "Research proposal preparation",
      "Scholarship & funding guidance",
      "Visa documentation support",
      "Pre-departure orientation",
      "Post-arrival academic support",
      "English proficiency coaching",
    ],
    disciplines: ["Engineering", "Management", "Science", "Technology", "Arts", "Medicine"],
    icon: "✈️",
  },
  {
    id: 3,
    badge: "New",
    badgeColor: "#6c3483",
    title: "Post-Doctoral Fellowship",
    subtitle: "Research Excellence Program",
    duration: "1 – 2 Years",
    mode: "Online / Research Institute",
    eligibility: "PhD Completed",
    fee: "Contact Us",
    description:
      "Elevate your research career with our Post-Doctoral Fellowship program. Designed for PhD graduates who wish to publish high-impact research, secure academic positions, and build an international research profile.",
    highlights: [
      "High-impact journal publication (Q1/Q2 journals)",
      "Research project development",
      "Grant writing & funding applications",
      "Conference presentation support",
      "Academic profile building",
      "Networking with global researchers",
      "Career counselling for academia",
      "Teaching & research portfolio development",
    ],
    disciplines: ["All Disciplines"],
    icon: "🔬",
  },
  {
    id: 4,
    badge: "Specialized",
    badgeColor: "#b7950b",
    title: "Research Paper Publication",
    subtitle: "Scopus / UGC / SCI Journals",
    duration: "1 – 6 Months",
    mode: "Online",
    eligibility: "Any Research Scholar / Academic",
    fee: "Contact Us",
    description:
      "Get your research published in reputed international journals. Our expert editorial team assists in manuscript preparation, journal selection, peer-review response, and final publication — ensuring high-quality, indexed publications.",
    highlights: [
      "Manuscript writing & editing",
      "Scopus / SCI / UGC journal selection",
      "Peer-review response assistance",
      "Plagiarism removal & formatting",
      "Research methodology improvement",
      "Literature review writing",
      "Data analysis & result presentation",
      "Fast-track publication support",
    ],
    disciplines: ["All Disciplines"],
    icon: "📄",
  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────
const PROCESS = [
  { step: "01", title: "Enquiry & Counselling", desc: "Submit your enquiry and get a free counselling session with our expert advisors." },
  { step: "02", title: "Program Selection", desc: "Choose the right program based on your qualification, goals, and timeline." },
  { step: "03", title: "Enrolment & Payment", desc: "Complete your enrolment with our simple online payment and documentation process." },
  { step: "04", title: "Mentor Assignment", desc: "Get assigned a dedicated subject expert mentor for your research journey." },
  { step: "05", title: "Guided Research", desc: "Work closely with your mentor through each phase of your research with regular reviews." },
  { step: "06", title: "Successful Completion", desc: "Submit your thesis, publish papers, and achieve your doctoral dream with our support." },
];

// ─── Eligibility Table ────────────────────────────────────────────────────────
const ELIGIBILITY = [
  { program: "PhD Guidance Program", qualification: "Master's Degree (50% & above)", age: "No limit", universities: "Indian Universities" },
  { program: "PhD Abroad Program", qualification: "Master's Degree + IELTS/TOEFL", age: "No limit", universities: "USA, UK, Canada, Australia, Germany, France" },
  { program: "Post-Doctoral Fellowship", qualification: "PhD Completed", age: "No limit", universities: "Research Institutes & Universities" },
  { program: "Research Paper Publication", qualification: "Any Scholar / Academic", age: "No limit", universities: "Scopus, SCI, UGC Indexed Journals" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  // Section
  section: { padding: "80px 0", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sectionGray: { padding: "80px 0", background: "#f4f7fb", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },

  // Section header
  sectionHead: { textAlign: "center", marginBottom: 56 },
  eyebrow: {
    display: "inline-block", color: "#1a5276", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.2em", textTransform: "uppercase",
    borderBottom: "2px solid #1a5276", paddingBottom: 4, marginBottom: 14,
  },
  h2: { color: "#1a2e4a", fontSize: 36, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.2 },
  subText: { color: "#6b7280", fontSize: 16, maxWidth: 600, margin: "0 auto" },

  // Course cards grid
  courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 32 },
  card: {
    background: "#fff", borderRadius: 16,
    boxShadow: "0 4px 32px rgba(26,82,118,0.09)",
    overflow: "hidden", display: "flex", flexDirection: "column",
    border: "1px solid #e8f0f8",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardTop: { padding: "28px 32px 20px", borderBottom: "1px solid #f0f4f8" },
  cardIcon: { fontSize: 36, marginBottom: 12 },
  cardBadge: (color) => ({
    display: "inline-block", background: color + "15", color,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", padding: "4px 12px", borderRadius: 20,
    border: `1px solid ${color}30`, marginBottom: 10,
  }),
  cardTitle: { color: "#1a2e4a", fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  cardSubtitle: { color: "#1a5276", fontSize: 13, fontWeight: 600, margin: "0 0 14px" },
  cardMeta: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 },
  metaChip: {
    background: "#f4f7fb", color: "#1a2e4a", fontSize: 12, fontWeight: 600,
    padding: "5px 12px", borderRadius: 6, display: "flex", alignItems: "center", gap: 5,
  },
  cardBody: { padding: "20px 32px", flex: 1 },
  cardDesc: { color: "#4b5563", fontSize: 14, lineHeight: 1.7, marginBottom: 18 },
  highlightList: { margin: 0, padding: 0, listStyle: "none" },
  highlightItem: {
    color: "#374151", fontSize: 13, padding: "5px 0",
    display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5,
  },
  checkIcon: { color: "#1a5276", fontWeight: 700, flexShrink: 0, marginTop: 1 },
  disciplineWrap: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 },
  disciplineTag: {
    background: "#1a5276", color: "#fff", fontSize: 11, fontWeight: 600,
    padding: "3px 10px", borderRadius: 4,
  },
  cardFooter: { padding: "16px 32px 24px", borderTop: "1px solid #f0f4f8" },
  applyBtn: {
    display: "block", background: "#1a5276", color: "#fff",
    textAlign: "center", padding: "12px 24px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, textDecoration: "none",
    transition: "background 0.2s",
  },

  // Process
  processGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 },
  processCard: {
    background: "#fff", borderRadius: 12, padding: "28px 24px",
    boxShadow: "0 2px 16px rgba(26,82,118,0.07)",
    borderTop: "3px solid #1a5276",
  },
  stepNum: { color: "#1a5276", fontSize: 36, fontWeight: 900, lineHeight: 1, marginBottom: 10, opacity: 0.15 },
  stepTitle: { color: "#1a2e4a", fontSize: 16, fontWeight: 700, marginBottom: 8 },
  stepDesc: { color: "#6b7280", fontSize: 13, lineHeight: 1.6 },

  // Eligibility table
  tableWrap: { overflowX: "auto", borderRadius: 12, boxShadow: "0 2px 16px rgba(26,82,118,0.07)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    background: "#1a5276", color: "#fff", padding: "14px 20px",
    textAlign: "left", fontWeight: 700, fontSize: 12,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  td: { padding: "14px 20px", borderBottom: "1px solid #f0f4f8", color: "#374151", background: "#fff" },
  tdAlt: { padding: "14px 20px", borderBottom: "1px solid #f0f4f8", color: "#374151", background: "#f9fafb" },

  // CTA banner
  ctaBanner: {
    background: "linear-gradient(135deg, #1a5276 0%, #0e3460 100%)",
    borderRadius: 16, padding: "56px 48px", textAlign: "center",
    color: "#fff",
  },
  ctaTitle: { fontSize: 32, fontWeight: 800, margin: "0 0 12px" },
  ctaSub: { fontSize: 16, opacity: 0.85, margin: "0 0 32px" },
  ctaBtnRow: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  ctaBtnPrimary: {
    display: "inline-block", background: "#fff", color: "#1a5276",
    padding: "14px 36px", borderRadius: 8, fontSize: 15, fontWeight: 700,
    textDecoration: "none",
  },
  ctaBtnOutline: {
    display: "inline-block", border: "2px solid #fff", color: "#fff",
    padding: "14px 36px", borderRadius: 8, fontSize: 15, fontWeight: 700,
    textDecoration: "none",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CourseDetails() {
  return (
    <>
      {/* ── Course Cards ──────────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <span style={S.eyebrow}>Our Programs</span>
            <h2 style={S.h2}>Choose Your Research Path</h2>
            <p style={S.subText}>
              Comprehensive guidance programs designed to support scholars at every stage of their academic journey.
            </p>
          </div>

          <div style={S.courseGrid}>
            {COURSES.map((course) => (
              <div key={course.id} style={S.card}>
                {/* Top */}
                <div style={S.cardTop}>
                  <div style={S.cardIcon}>{course.icon}</div>
                  <span style={S.cardBadge(course.badgeColor)}>{course.badge}</span>
                  <h3 style={S.cardTitle}>{course.title}</h3>
                  <p style={S.cardSubtitle}>{course.subtitle}</p>
                  <div style={S.cardMeta}>
                    <span style={S.metaChip}>⏱ {course.duration}</span>
                    <span style={S.metaChip}>📍 {course.mode}</span>
                    <span style={S.metaChip}>🎓 {course.eligibility}</span>
                  </div>
                </div>

                {/* Body */}
                <div style={S.cardBody}>
                  <p style={S.cardDesc}>{course.description}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1a5276", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    What's Included
                  </p>
                  <ul style={S.highlightList}>
                    {course.highlights.map((h, i) => (
                      <li key={i} style={S.highlightItem}>
                        <span style={S.checkIcon}>✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div style={S.disciplineWrap}>
                    {course.disciplines.map((d) => (
                      <span key={d} style={S.disciplineTag}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={S.cardFooter}>
                  <Link href="/application-form" style={S.applyBtn}>
                    Apply for This Program →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Apply Process ──────────────────────────────────────────── */}
      <section style={S.sectionGray}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <span style={S.eyebrow}>Application Process</span>
            <h2 style={S.h2}>How to Apply</h2>
            <p style={S.subText}>
              A simple 6-step process to get you started on your research journey with Inspire Education Service.
            </p>
          </div>

          <div style={S.processGrid}>
            {PROCESS.map((p) => (
              <div key={p.step} style={S.processCard}>
                <div style={S.stepNum}>{p.step}</div>
                <h4 style={S.stepTitle}>{p.title}</h4>
                <p style={S.stepDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility Table ─────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <span style={S.eyebrow}>Eligibility</span>
            <h2 style={S.h2}>Who Can Apply?</h2>
            <p style={S.subText}>
              Check the eligibility criteria for each of our programs below.
            </p>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Program</th>
                  <th style={S.th}>Qualification</th>
                  <th style={S.th}>Age Limit</th>
                  <th style={S.th}>Target Universities / Journals</th>
                </tr>
              </thead>
              <tbody>
                {ELIGIBILITY.map((row, i) => {
                  const td = i % 2 === 0 ? S.td : S.tdAlt;
                  return (
                    <tr key={i}>
                      <td style={{ ...td, fontWeight: 700, color: "#1a5276" }}>{row.program}</td>
                      <td style={td}>{row.qualification}</td>
                      <td style={td}>{row.age}</td>
                      <td style={td}>{row.universities}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Apply CTA Banner ──────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={S.container}>
          <div style={S.ctaBanner}>
            <h2 style={S.ctaTitle}>Ready to Begin Your Research Journey?</h2>
            <p style={S.ctaSub}>
              Join 1000+ scholars across 17+ countries who have trusted Inspire Education Service for their PhD guidance.
            </p>
            <div style={S.ctaBtnRow}>
              <Link href="/application-form" style={S.ctaBtnPrimary}>
                Apply Now
              </Link>
              <Link href="/contact" style={S.ctaBtnOutline}>
                Talk to a Counsellor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}