import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Initial blank state ──────────────────────────────────────────────────────
const blankForm = {
  title: "",
  slug: "",
  subtitle: "",
  description1: "",
  description2: "",
  keyFeatures: [""],
  whyChooseHeading: "",
  whyChooseText: "",
  benefits: [{ number: "01", title: "", description: "" }],
  faqs: [{ question: "", answer: "" }],
  order: 0,
  isActive: true,
};

// Default all sections enabled
const blankSections = {
  description: true,
  keyFeatures: true,
  whyChoose: true,
  benefits: true,
  faqs: true,
  images: true,
};

// ─── Slugify helper ───────────────────────────────────────────────────────────
const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// ─── Section Toggle Button ────────────────────────────────────────────────────
const SectionToggle = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={"sf-section-toggle " + (enabled ? "sf-section-toggle--on" : "sf-section-toggle--off")}
    title={enabled ? "Click to disable this section" : "Click to enable this section"}
  >
    {enabled ? (
      <>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Included
      </>
    ) : (
      <>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        Skipped
      </>
    )}
  </button>
);

const ServiceForm = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // ─── State ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState(blankForm);
  const [sections, setSections] = useState(blankSections);
  const [images, setImages] = useState({
    heroImage: null,
    detailImage1: null,
    detailImage2: null,
  });
  const [previews, setPreviews] = useState({
    heroImage: "",
    detailImage1: "",
    detailImage2: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  const heroRef    = useRef();
  const detail1Ref = useRef();
  const detail2Ref = useRef();

  // ─── Load existing data when editing ─────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await api.get("/services/" + id);
        const s = res.data.data;
        setForm({
          title: s.title || "",
          slug: s.slug || "",
          subtitle: s.subtitle || "",
          description1: s.description1 || "",
          description2: s.description2 || "",
          keyFeatures: s.keyFeatures?.length ? s.keyFeatures : [""],
          whyChooseHeading: s.whyChooseHeading || "",
          whyChooseText: s.whyChooseText || "",
          benefits: s.benefits?.length
            ? s.benefits
            : [{ number: "01", title: "", description: "" }],
          faqs: s.faqs?.length ? s.faqs : [{ question: "", answer: "" }],
          order: s.order ?? 0,
          isActive: s.isActive ?? true,
        });
        setPreviews({
          heroImage:    s.heroImage    || "",
          detailImage1: s.detailImage1 || "",
          detailImage2: s.detailImage2 || "",
        });
        // Auto-detect which sections have content when editing
        setSections({
          description: !!(s.description1 || s.description2),
          keyFeatures: !!(s.keyFeatures?.length),
          whyChoose:   !!(s.whyChooseHeading || s.whyChooseText),
          benefits:    !!(s.benefits?.length),
          faqs:        !!(s.faqs?.length),
          images:      !!(s.heroImage || s.detailImage1 || s.detailImage2),
        });
        setSlugManual(true);
      } catch (err) {
        setError("Failed to load service data.");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, isEdit, api]);

  // ─── Field helpers ────────────────────────────────────────────────────────
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleSection = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const handleTitleChange = (val) => {
    set("title", val);
    if (!slugManual) set("slug", toSlug(val));
  };

  const handleSlugChange = (val) => {
    set("slug", toSlug(val));
    setSlugManual(true);
  };

  // ─── Image helpers ────────────────────────────────────────────────────────
  const handleImage = (field, file) => {
    if (!file) return;
    setImages((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const clearImage = (field, inputRef) => {
    setImages((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: "" }));
    if (inputRef.current) inputRef.current.value = "";
  };

  // ─── Dynamic list helpers ─────────────────────────────────────────────────
  const addFeature    = () => set("keyFeatures", [...form.keyFeatures, ""]);
  const removeFeature = (i) => set("keyFeatures", form.keyFeatures.filter((_, idx) => idx !== i));
  const updateFeature = (i, val) => {
    const arr = [...form.keyFeatures]; arr[i] = val; set("keyFeatures", arr);
  };

  const addBenefit = () =>
    set("benefits", [...form.benefits, {
      number: String(form.benefits.length + 1).padStart(2, "0"), title: "", description: "",
    }]);
  const removeBenefit = (i) => set("benefits", form.benefits.filter((_, idx) => idx !== i));
  const updateBenefit = (i, field, val) => {
    const arr = [...form.benefits]; arr[i] = { ...arr[i], [field]: val }; set("benefits", arr);
  };

  const addFaq    = () => set("faqs", [...form.faqs, { question: "", answer: "" }]);
  const removeFaq = (i) => set("faqs", form.faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i, field, val) => {
    const arr = [...form.faqs]; arr[i] = { ...arr[i], [field]: val }; set("faqs", arr);
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim())  { setError("Slug is required."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title",   form.title);
      fd.append("slug",    form.slug);
      fd.append("subtitle", form.subtitle);
      fd.append("order",   form.order);
      fd.append("isActive", form.isActive);

      // Only append section data if section is enabled
      if (sections.description) {
        fd.append("description1", form.description1);
        fd.append("description2", form.description2);
      } else {
        fd.append("description1", "");
        fd.append("description2", "");
      }

      if (sections.keyFeatures) {
        fd.append("keyFeatures", JSON.stringify(form.keyFeatures.filter(Boolean)));
      } else {
        fd.append("keyFeatures", JSON.stringify([]));
      }

      if (sections.whyChoose) {
        fd.append("whyChooseHeading", form.whyChooseHeading);
        fd.append("whyChooseText",    form.whyChooseText);
      } else {
        fd.append("whyChooseHeading", "");
        fd.append("whyChooseText",    "");
      }

      if (sections.benefits) {
        fd.append("benefits", JSON.stringify(form.benefits));
      } else {
        fd.append("benefits", JSON.stringify([]));
      }

      if (sections.faqs) {
        fd.append("faqs", JSON.stringify(form.faqs));
      } else {
        fd.append("faqs", JSON.stringify([]));
      }

      if (sections.images) {
        if (images.heroImage)    fd.append("heroImage",    images.heroImage);
        if (images.detailImage1) fd.append("detailImage1", images.detailImage1);
        if (images.detailImage2) fd.append("detailImage2", images.detailImage2);
      }

      if (isEdit) { await api.put("/services/" + id, fd); }
      else        { await api.post("/services", fd); }
      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="sf-loading">
        <div className="sf-spinner-lg"></div>
        <p>Loading service data…</p>
      </div>
    );
  }

  const imageFields = [
    { field: "heroImage",    label: "Hero / Banner Image", ref: heroRef,    hint: "Top of page · Recommended 1170×500px" },
    { field: "detailImage1", label: "Detail Image 1",      ref: detail1Ref, hint: "Left image in detail section · 570×400px" },
    { field: "detailImage2", label: "Detail Image 2",      ref: detail2Ref, hint: "Right image in detail section · 570×400px" },
  ];

  const enabledSectionsCount = Object.values(sections).filter(Boolean).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sf-root">

      {/* ── Header ── */}
      <div className="sf-header">
        <div className="sf-header-left">
          <button className="sf-back-btn" onClick={() => navigate("/services")} type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div>
            <h1 className="sf-page-title">{isEdit ? "Update Service" : "Add New Service"}</h1>
            <p className="sf-page-sub">
              {isEdit ? "Update service details and content" : "Fill in the details for the new service"}
            </p>
          </div>
        </div>
        <div className="sf-header-actions">
          <button type="button" className="sf-btn sf-btn--ghost" onClick={() => navigate("/services")}>
            Cancel
          </button>
          <button type="button" className="sf-btn sf-btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><span className="sf-spin"></span>Saving…</>
              : isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="sf-alert">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Section Visibility Banner ── */}
      <div className="sf-sections-bar">
        <div className="sf-sections-bar__label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Sections
        </div>
        <div className="sf-sections-bar__pills">
          {[
            { key: "description", label: "Description" },
            { key: "keyFeatures", label: "Key Features" },
            { key: "whyChoose",   label: "Why Choose" },
            { key: "benefits",    label: "Benefits" },
            { key: "faqs",        label: "FAQs" },
            { key: "images",      label: "Images" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={"sf-section-pill " + (sections[key] ? "sf-section-pill--on" : "sf-section-pill--off")}
              onClick={() => toggleSection(key)}
            >
              {sections[key] ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
              {label}
            </button>
          ))}
        </div>
        <span className="sf-sections-bar__count">{enabledSectionsCount}/6 active</span>
      </div>

      <form onSubmit={handleSubmit} className="sf-form">
        <div className="sf-grid">

          {/* ════ LEFT COLUMN ════ */}
          <div className="sf-col-main">

            {/* Basic Info — always shown */}
            <div className="sf-card">
              <div className="sf-card-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12h8M8 8h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Basic Information
                <span className="sf-required-badge">Required</span>
              </div>

              <div className="sf-field">
                <label className="sf-label">Title <span className="sf-req">*</span></label>
                <input
                  className="sf-input"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Continuous Mentorship Program"
                />
              </div>

              <div className="sf-field">
                <label className="sf-label">
                  Slug <span className="sf-req">*</span>
                  <span className="sf-hint-inline">— used in URL</span>
                </label>
                <div className="sf-slug-row">
                  <span className="sf-slug-prefix">/services/</span>
                  <input
                    className="sf-input sf-slug-inp"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="your-service-slug"
                  />
                </div>
              </div>

              <div className="sf-field">
                <label className="sf-label">
                  Subtitle
                  <span className="sf-hint-inline">— main heading on detail page</span>
                </label>
                <input
                  className="sf-input"
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="e.g. Your dedicated research mentor from admission to graduation"
                />
              </div>

              <div className="sf-row2">
                <div className="sf-field">
                  <label className="sf-label">Display Order</label>
                  <input
                    className="sf-input"
                    type="number" min="0"
                    value={form.order}
                    onChange={(e) => set("order", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="sf-field">
                  <label className="sf-label">Status</label>
                  <div className="sf-toggle-row">
                    <label className="sf-toggle">
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => set("isActive", e.target.checked)} />
                      <span className="sf-toggle-track"></span>
                    </label>
                    <span className={"sf-toggle-txt " + (form.isActive ? "sf-toggle-txt--on" : "sf-toggle-txt--off")}>
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={"sf-card sf-card--toggleable " + (!sections.description ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Description
                </div>
                <SectionToggle enabled={sections.description} onToggle={() => toggleSection("description")} />
              </div>
              {sections.description ? (
                <div className="sf-card-body">
                  <div className="sf-field">
                    <label className="sf-label">Paragraph 1</label>
                    <textarea className="sf-textarea" rows={4} value={form.description1}
                      onChange={(e) => set("description1", e.target.value)}
                      placeholder="Main introductory paragraph about this service…"/>
                  </div>
                  <div className="sf-field">
                    <label className="sf-label">Paragraph 2</label>
                    <textarea className="sf-textarea" rows={4} value={form.description2}
                      onChange={(e) => set("description2", e.target.value)}
                      placeholder="Second paragraph with additional details…"/>
                  </div>
                </div>
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  This section is skipped and won't be saved
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className={"sf-card sf-card--toggleable " + (!sections.keyFeatures ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Key Features
                </div>
                <div className="sf-card-header-right">
                  {sections.keyFeatures && (
                    <button type="button" className="sf-add-btn" onClick={addFeature}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      Add Feature
                    </button>
                  )}
                  <SectionToggle enabled={sections.keyFeatures} onToggle={() => toggleSection("keyFeatures")} />
                </div>
              </div>
              {sections.keyFeatures ? (
                <div className="sf-feature-list">
                  {form.keyFeatures.map((feat, i) => (
                    <div key={i} className="sf-feature-row">
                      <span className="sf-list-num">{i + 1}</span>
                      <input className="sf-input" value={feat}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        placeholder="e.g. Personalized One-on-One Sessions"/>
                      <button type="button" className="sf-rm-btn" onClick={() => removeFeature(i)}
                        disabled={form.keyFeatures.length === 1}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  This section is skipped and won't be saved
                </div>
              )}
            </div>

            {/* Why Choose */}
            <div className={"sf-card sf-card--toggleable " + (!sections.whyChoose ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Why Choose Section
                </div>
                <SectionToggle enabled={sections.whyChoose} onToggle={() => toggleSection("whyChoose")} />
              </div>
              {sections.whyChoose ? (
                <div className="sf-card-body">
                  <div className="sf-field">
                    <label className="sf-label">Section Heading</label>
                    <input className="sf-input" value={form.whyChooseHeading}
                      onChange={(e) => set("whyChooseHeading", e.target.value)}
                      placeholder="e.g. Why Choose Our Continuous Mentorship Program?"/>
                  </div>
                  <div className="sf-field">
                    <label className="sf-label">Section Text</label>
                    <textarea className="sf-textarea" rows={4} value={form.whyChooseText}
                      onChange={(e) => set("whyChooseText", e.target.value)}
                      placeholder="Compelling paragraph explaining why students should choose this service…"/>
                  </div>
                </div>
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  This section is skipped and won't be saved
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className={"sf-card sf-card--toggleable " + (!sections.benefits ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Benefits
                </div>
                <div className="sf-card-header-right">
                  {sections.benefits && (
                    <button type="button" className="sf-add-btn" onClick={addBenefit}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      Add Benefit
                    </button>
                  )}
                  <SectionToggle enabled={sections.benefits} onToggle={() => toggleSection("benefits")} />
                </div>
              </div>
              {sections.benefits ? (
                <div className="sf-benefit-list">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="sf-benefit-card">
                      <div className="sf-benefit-top">
                        <div className="sf-benefit-badge">{b.number}</div>
                        <button type="button" className="sf-rm-btn" onClick={() => removeBenefit(i)}
                          disabled={form.benefits.length === 1}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                      <div className="sf-row2">
                        <div className="sf-field">
                          <label className="sf-label">Number Label</label>
                          <input className="sf-input" value={b.number}
                            onChange={(e) => updateBenefit(i, "number", e.target.value)} placeholder="01"/>
                        </div>
                        <div className="sf-field">
                          <label className="sf-label">
                            Title <span className="sf-hint-inline">use &lt;br/&gt; for break</span>
                          </label>
                          <input className="sf-input" value={b.title}
                            onChange={(e) => updateBenefit(i, "title", e.target.value)}
                            placeholder="End-to-End Support"/>
                        </div>
                      </div>
                      <div className="sf-field">
                        <label className="sf-label">Description</label>
                        <textarea className="sf-textarea" rows={3} value={b.description}
                          onChange={(e) => updateBenefit(i, "description", e.target.value)}
                          placeholder="Describe this benefit in 1–2 sentences…"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  This section is skipped and won't be saved
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className={"sf-card sf-card--toggleable " + (!sections.faqs ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M9 9a3 3 0 116 0c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  FAQs
                </div>
                <div className="sf-card-header-right">
                  {sections.faqs && (
                    <button type="button" className="sf-add-btn" onClick={addFaq}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      Add FAQ
                    </button>
                  )}
                  <SectionToggle enabled={sections.faqs} onToggle={() => toggleSection("faqs")} />
                </div>
              </div>
              {sections.faqs ? (
                <div className="sf-faq-list">
                  {form.faqs.map((faq, i) => (
                    <div key={i} className="sf-faq-card">
                      <div className="sf-faq-index">Q{i + 1}</div>
                      <div className="sf-faq-body">
                        <div className="sf-field">
                          <label className="sf-label">Question</label>
                          <input className="sf-input" value={faq.question}
                            onChange={(e) => updateFaq(i, "question", e.target.value)}
                            placeholder="e.g. What does this service include?"/>
                        </div>
                        <div className="sf-field">
                          <label className="sf-label">Answer</label>
                          <textarea className="sf-textarea" rows={3} value={faq.answer}
                            onChange={(e) => updateFaq(i, "answer", e.target.value)}
                            placeholder="Provide a clear, helpful answer…"/>
                        </div>
                      </div>
                      <button type="button" className="sf-rm-btn sf-rm-abs" onClick={() => removeFaq(i)}
                        disabled={form.faqs.length === 1}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  This section is skipped and won't be saved
                </div>
              )}
            </div>

          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="sf-col-side">

            {/* Images */}
            <div className={"sf-card sf-card--toggleable " + (!sections.images ? "sf-card--disabled" : "")}>
              <div className="sf-card-header">
                <div className="sf-card-label" style={{marginBottom:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 15l5-5 4 4 3-3 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  </svg>
                  Images
                </div>
                <SectionToggle enabled={sections.images} onToggle={() => toggleSection("images")} />
              </div>

              {sections.images ? (
                imageFields.map(({ field, label, ref, hint }) => (
                  <div key={field} className="sf-img-block">
                    <label className="sf-label">{label}</label>
                    <p className="sf-img-hint">{hint}</p>
                    {previews[field] ? (
                      <div className="sf-preview-wrap">
                        <img src={previews[field]} alt={label} className="sf-preview-img"/>
                        <div className="sf-preview-overlay">
                          <button type="button" className="sf-prev-btn sf-prev-btn--change"
                            onClick={() => ref.current?.click()}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Change
                          </button>
                          <button type="button" className="sf-prev-btn sf-prev-btn--remove"
                            onClick={() => clearImage(field, ref)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="sf-drop" onClick={() => ref.current?.click()}>
                        <div className="sf-drop-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M3 15l5-5 4 4 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="sf-drop-text">Click to upload</p>
                        <p className="sf-drop-sub">JPG, PNG, WebP · Max 10MB</p>
                      </div>
                    )}
                    <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      style={{ display: "none" }}
                      onChange={(e) => handleImage(field, e.target.files[0])}/>
                  </div>
                ))
              ) : (
                <div className="sf-skipped-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Images section is skipped
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="sf-card sf-summary-card">
              <div className="sf-card-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Summary
              </div>

              <div className="sf-url-box">
                <span className="sf-url-base">yoursite.com/services/</span>
                <span className="sf-url-slug">{form.slug || "your-slug"}</span>
              </div>

              <div className="sf-meta-list">
                {[
                  { label: "Title",     value: form.title || "—" },
                  { label: "Features",  value: sections.keyFeatures ? form.keyFeatures.filter(Boolean).length : "—" },
                  { label: "Benefits",  value: sections.benefits ? form.benefits.length : "—" },
                  { label: "FAQs",      value: sections.faqs ? form.faqs.length : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="sf-meta-row">
                    <span className="sf-meta-key">{label}</span>
                    <span className="sf-meta-val">{value}</span>
                  </div>
                ))}
                <div className="sf-meta-row">
                  <span className="sf-meta-key">Status</span>
                  <span className={"sf-status-pill " + (form.isActive ? "sf-status-pill--on" : "sf-status-pill--off")}>
                    <span className="sf-status-dot"></span>
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="sf-meta-row">
                  <span className="sf-meta-key">Sections</span>
                  <span className="sf-meta-val">{enabledSectionsCount}/6</span>
                </div>
              </div>

              <button type="submit" className="sf-btn sf-btn--primary sf-btn--full" disabled={loading}>
                {loading
                  ? <><span className="sf-spin"></span>Saving…</>
                  : isEdit ? "Update Service" : "Create Service"}
              </button>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="sf-footer">
          <button type="button" className="sf-btn sf-btn--ghost" onClick={() => navigate("/services")}>
            Cancel
          </button>
          <button type="submit" className="sf-btn sf-btn--primary" disabled={loading}>
            {loading
              ? <><span className="sf-spin"></span>Saving…</>
              : isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>

      {/* ══════════════════════ STYLES ══════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        /* ─ Root ─ */
        .sf-root {
          padding: 32px 28px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          background: #f5f6fa;
          min-height: 100vh;
          color: #0c1e21;
        }

        /* ─ Loading ─ */
        .sf-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 320px; gap: 16px;
          color: #67787a; font-size: 14px;
        }
        .sf-spinner-lg {
          width: 38px; height: 38px;
          border: 3px solid #e8ecf0;
          border-top-color: #1a598a;
          border-radius: 50%;
          animation: sfSpin .7s linear infinite;
        }

        /* ─ Header ─ */
        .sf-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; flex-wrap: wrap; gap: 16px;
          margin-bottom: 18px;
        }
        .sf-header-left  { display: flex; align-items: flex-start; gap: 14px; }
        .sf-header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

        .sf-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          border: 1.5px solid #e8ecf0; background: #fff;
          color: #67787a; font-size: 13px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          cursor: pointer; transition: all .15s; white-space: nowrap;
          margin-top: 4px;
        }
        .sf-back-btn:hover { background: #f5f6fa; color: #1a425c; border-color: #c8d0d0; }

        .sf-page-title {
          font-size: 26px; font-weight: 800; color: #0c1e21;
          margin: 0 0 4px; letter-spacing: -.03em; line-height: 1.1;
        }
        .sf-page-sub {
          font-size: 13.5px; color: #67787a; margin: 0;
        }

        /* ─ Alert ─ */
        .sf-alert {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px; border-radius: 10px; font-size: 13.5px; font-weight: 500;
          margin-bottom: 16px;
          background: #fff1f2; color: #be123c;
          border: 1px solid #fecdd3;
        }

        /* ─ Sections Bar ─ */
        .sf-sections-bar {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          background: #fff; border: 1px solid #e8ecf0; border-radius: 12px;
          padding: 12px 18px; margin-bottom: 20px;
        }
        .sf-sections-bar__label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 800; letter-spacing: .08em;
          text-transform: uppercase; color: #a9b8b8; white-space: nowrap;
          flex-shrink: 0;
        }
        .sf-sections-bar__label svg { color: #1a598a; }
        .sf-sections-bar__pills {
          display: flex; gap: 7px; flex-wrap: wrap; flex: 1;
        }
        .sf-sections-bar__count {
          font-size: 11.5px; color: #a9b8b8; font-weight: 700;
          white-space: nowrap; margin-left: auto;
        }
        .sf-section-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 20px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          border: 1.5px solid; transition: all .15s;
          white-space: nowrap;
        }
        .sf-section-pill--on {
          background: #f0fdf4; color: #15803d; border-color: #bbf7d0;
        }
        .sf-section-pill--on:hover { background: #dcfce7; }
        .sf-section-pill--off {
          background: #f5f6fa; color: #a9b8b8; border-color: #e8ecf0;
        }
        .sf-section-pill--off:hover { background: #e8ecf0; color: #67787a; }

        /* ─ Section Toggle Button (inside card) ─ */
        .sf-section-toggle {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          border: 1.5px solid; transition: all .15s;
          white-space: nowrap;
        }
        .sf-section-toggle--on {
          background: #f0fdf4; color: #15803d; border-color: #bbf7d0;
        }
        .sf-section-toggle--on:hover { background: #dcfce7; }
        .sf-section-toggle--off {
          background: #fff7ed; color: #c2410c; border-color: #fed7aa;
        }
        .sf-section-toggle--off:hover { background: #ffedd5; }

        /* ─ Skipped message ─ */
        .sf-skipped-msg {
          display: flex; align-items: center; gap: 9px;
          padding: 14px 16px; border-radius: 10px; margin-top: 14px;
          background: #fafbfc; border: 1.5px dashed #e8ecf0;
          font-size: 13px; color: #a9b8b8; font-weight: 600;
        }

        /* ─ Disabled card overlay ─ */
        .sf-card--disabled {
          opacity: .7;
        }
        .sf-card--disabled .sf-card-body,
        .sf-card--disabled .sf-feature-list,
        .sf-card--disabled .sf-benefit-list,
        .sf-card--disabled .sf-faq-list {
          pointer-events: none;
        }

        /* ─ Required badge ─ */
        .sf-required-badge {
          margin-left: 8px; padding: 2px 8px; border-radius: 20px;
          font-size: 10px; font-weight: 700;
          background: #eff6ff; color: #1d4ed8;
          border: 1px solid #dbeafe;
          text-transform: uppercase; letter-spacing: .06em;
        }

        /* ─ Buttons ─ */
        .sf-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 10px;
          font-size: 13.5px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          border: none; cursor: pointer;
          transition: all .18s cubic-bezier(.4,0,.2,1);
          white-space: nowrap; letter-spacing: -.01em;
        }
        .sf-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
        .sf-btn--primary {
          background: linear-gradient(135deg, #1a598a, #015599);
          color: #fff; box-shadow: 0 2px 12px rgba(26,89,138,.32);
        }
        .sf-btn--primary:hover:not(:disabled) {
          transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,89,138,.38);
        }
        .sf-btn--ghost {
          background: #f0f2f5; color: #1a425c; border: 1.5px solid #e2e8f0;
        }
        .sf-btn--ghost:hover:not(:disabled) { background: #e8ecf0; transform: translateY(-1px); }
        .sf-btn--full { width: 100%; justify-content: center; margin-top: 16px; }

        .sf-spin {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff; border-radius: 50%;
          animation: sfSpin .65s linear infinite; display: inline-block;
        }
        @keyframes sfSpin { to { transform: rotate(360deg); } }

        /* ─ Form / Grid ─ */
        .sf-form { display: flex; flex-direction: column; }
        .sf-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }
        .sf-col-main { display: flex; flex-direction: column; gap: 18px; }
        .sf-col-side {
          display: flex; flex-direction: column; gap: 18px;
          position: sticky; top: 20px;
        }
        @media (max-width: 960px) {
          .sf-grid { grid-template-columns: 1fr; }
          .sf-col-side { position: static; }
        }

        /* ─ Cards ─ */
        .sf-card {
          background: #fff;
          border: 1px solid #e8ecf0;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
          transition: opacity .2s;
        }
        .sf-card-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 10.5px; font-weight: 800; letter-spacing: .09em;
          text-transform: uppercase; color: #a9b8b8;
          margin-bottom: 18px;
        }
        .sf-card-label svg { color: #1a598a; flex-shrink: 0; }
        .sf-card-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 16px;
        }
        .sf-card-header-right {
          display: flex; align-items: center; gap: 8px;
        }
        .sf-card-body { margin-top: 0; }

        /* ─ Fields ─ */
        .sf-field { margin-bottom: 14px; }
        .sf-field:last-child { margin-bottom: 0; }
        .sf-label {
          display: block; margin-bottom: 6px;
          font-size: 12.5px; font-weight: 700; color: #1a425c;
          letter-spacing: -.01em;
        }
        .sf-req { color: #e11d48; margin-left: 2px; }
        .sf-hint-inline {
          font-size: 11px; color: #a9b8b8; font-weight: 400; margin-left: 6px;
        }

        .sf-input, .sf-textarea {
          width: 100%; padding: 10px 13px;
          border: 1.5px solid #e8ecf0; border-radius: 10px;
          font-size: 13.5px; color: #0c1e21;
          background: #fff; outline: none;
          transition: border .15s, box-shadow .15s;
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 500;
        }
        .sf-input::placeholder, .sf-textarea::placeholder { color: #c8d0d0; }
        .sf-input:focus, .sf-textarea:focus {
          border-color: #1a598a;
          box-shadow: 0 0 0 3px rgba(26,89,138,.1);
        }
        .sf-textarea { resize: vertical; line-height: 1.65; }
        .sf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* ─ Slug ─ */
        .sf-slug-row {
          display: flex; align-items: center;
          border: 1.5px solid #e8ecf0; border-radius: 10px;
          overflow: hidden;
          transition: border .15s, box-shadow .15s;
          background: #fff;
        }
        .sf-slug-row:focus-within {
          border-color: #1a598a;
          box-shadow: 0 0 0 3px rgba(26,89,138,.1);
        }
        .sf-slug-prefix {
          padding: 10px 10px 10px 13px;
          background: #f5f6fa; color: #a9b8b8;
          font-size: 12.5px; white-space: nowrap;
          border-right: 1.5px solid #e8ecf0;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }
        .sf-slug-inp {
          border: none !important; border-radius: 0 !important;
          box-shadow: none !important; background: transparent;
          font-family: 'JetBrains Mono', monospace !important;
          font-weight: 500 !important;
        }

        /* ─ Toggle ─ */
        .sf-toggle-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
        .sf-toggle {
          position: relative; display: inline-block;
          width: 42px; height: 24px; cursor: pointer; flex-shrink: 0;
        }
        .sf-toggle input { opacity: 0; width: 0; height: 0; }
        .sf-toggle-track {
          position: absolute; inset: 0;
          background: #e8ecf0; border-radius: 12px;
          transition: background .2s;
        }
        .sf-toggle-track::after {
          content: ""; position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          background: #fff; border-radius: 50%;
          transition: transform .2s;
          box-shadow: 0 1px 4px rgba(0,0,0,.18);
        }
        .sf-toggle input:checked + .sf-toggle-track { background: #1a598a; }
        .sf-toggle input:checked + .sf-toggle-track::after { transform: translateX(18px); }
        .sf-toggle-txt { font-size: 13px; font-weight: 600; }
        .sf-toggle-txt--on  { color: #1a598a; }
        .sf-toggle-txt--off { color: #a9b8b8; }

        /* ─ Add / Remove buttons ─ */
        .sf-add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 8px;
          background: #eff6ff; color: #1a598a;
          border: 1.5px solid #bfdbfe;
          font-size: 12.5px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .sf-add-btn:hover { background: #dbeafe; border-color: #93c5fd; }

        .sf-rm-btn {
          width: 30px; height: 30px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 8px; border: 1.5px solid #fecdd3;
          background: #fff; color: #e11d48; cursor: pointer;
          transition: all .15s;
        }
        .sf-rm-btn:hover:not(:disabled) { background: #fff1f2; }
        .sf-rm-btn:disabled { opacity: .3; cursor: not-allowed; }
        .sf-rm-abs { position: absolute; top: 14px; right: 14px; }

        /* ─ Key Features ─ */
        .sf-feature-list { display: flex; flex-direction: column; gap: 10px; }
        .sf-feature-row { display: flex; align-items: center; gap: 10px; }
        .sf-list-num {
          width: 26px; height: 26px; flex-shrink: 0;
          background: #eff6ff; color: #1a598a;
          border: 1px solid #dbeafe;
          border-radius: 50%; display: flex;
          align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 800;
        }

        /* ─ Benefits ─ */
        .sf-benefit-list { display: flex; flex-direction: column; gap: 14px; }
        .sf-benefit-card {
          border: 1.5px solid #e8ecf0; border-radius: 12px;
          padding: 16px 18px; background: #fafbfc;
          transition: border .15s;
        }
        .sf-benefit-card:focus-within { border-color: #bfdbfe; }
        .sf-benefit-top {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 14px;
        }
        .sf-benefit-badge {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #1a598a, #015599);
          color: #fff; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          box-shadow: 0 2px 8px rgba(26,89,138,.3);
        }

        /* ─ FAQs ─ */
        .sf-faq-list { display: flex; flex-direction: column; gap: 14px; }
        .sf-faq-card {
          display: flex; gap: 12px;
          border: 1.5px solid #e8ecf0; border-radius: 12px;
          padding: 16px 18px; background: #fafbfc;
          position: relative;
          transition: border .15s;
        }
        .sf-faq-card:focus-within { border-color: #bfdbfe; }
        .sf-faq-index {
          width: 32px; height: 32px; flex-shrink: 0;
          background: #f5f6fa; color: #67787a;
          border: 1px solid #e8ecf0;
          border-radius: 8px; display: flex;
          align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 800; margin-top: 1px;
        }
        .sf-faq-body { flex: 1; padding-right: 36px; }

        /* ─ Images ─ */
        .sf-img-block {
          padding-bottom: 18px; margin-bottom: 18px;
          border-bottom: 1px solid #f0f2f5;
        }
        .sf-img-block:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }
        .sf-img-hint { font-size: 11px; color: #a9b8b8; margin: 3px 0 10px; font-weight: 500; }

        .sf-drop {
          border: 2px dashed #e8ecf0; border-radius: 12px;
          padding: 22px 16px; text-align: center;
          cursor: pointer; transition: all .18s;
          background: #fafbfc;
        }
        .sf-drop:hover { border-color: #1a598a; background: #f0f7ff; }
        .sf-drop-icon { color: #c8d0d0; margin-bottom: 8px; transition: color .18s; }
        .sf-drop:hover .sf-drop-icon { color: #1a598a; }
        .sf-drop-text { font-size: 13px; font-weight: 700; color: #1a425c; margin: 0 0 4px; }
        .sf-drop-sub  { font-size: 11px; color: #a9b8b8; margin: 0; }

        .sf-preview-wrap {
          border-radius: 10px; overflow: hidden;
          border: 1.5px solid #e8ecf0; position: relative;
        }
        .sf-preview-img { width: 100%; height: 110px; object-fit: cover; display: block; }
        .sf-preview-overlay {
          display: flex; gap: 8px; padding: 8px;
          background: #fafbfc; border-top: 1px solid #e8ecf0;
        }
        .sf-prev-btn {
          flex: 1; padding: 7px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          border: 1.5px solid; display: flex; align-items: center;
          justify-content: center; gap: 5px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          transition: all .15s;
        }
        .sf-prev-btn--change { background: #fff; color: #1a425c; border-color: #e8ecf0; }
        .sf-prev-btn--change:hover { background: #f5f6fa; }
        .sf-prev-btn--remove { background: #fff; color: #e11d48; border-color: #fecdd3; }
        .sf-prev-btn--remove:hover { background: #fff1f2; }

        /* ─ Summary card ─ */
        .sf-url-box {
          background: #f5f6fa; border: 1px solid #e8ecf0;
          border-radius: 9px; padding: 10px 13px;
          font-size: 12.5px; margin-bottom: 16px;
          word-break: break-all;
          font-family: 'JetBrains Mono', monospace;
        }
        .sf-url-base { color: #a9b8b8; }
        .sf-url-slug { color: #1a598a; font-weight: 700; }

        .sf-meta-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 4px; }
        .sf-meta-row {
          display: flex; justify-content: space-between;
          align-items: center; font-size: 13px;
          padding-bottom: 10px; border-bottom: 1px solid #f0f2f5;
        }
        .sf-meta-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sf-meta-key { color: #a9b8b8; font-weight: 600; }
        .sf-meta-val { font-weight: 700; color: #1a425c; }

        .sf-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
        }
        .sf-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .sf-status-pill--on  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .sf-status-pill--on  .sf-status-dot { background: #16a34a; }
        .sf-status-pill--off { background: #fff1f2; color: #b91c1c; border: 1px solid #fecdd3; }
        .sf-status-pill--off .sf-status-dot { background: #dc2626; }

        /* ─ Footer ─ */
        .sf-footer {
          display: flex; justify-content: flex-end; gap: 12px;
          margin-top: 28px; padding-top: 24px;
          border-top: 1px solid #e8ecf0;
        }

        /* ─ Responsive ─ */
        @media (max-width: 640px) {
          .sf-root { padding: 20px 16px; }
          .sf-page-title { font-size: 22px; }
          .sf-row2 { grid-template-columns: 1fr; }
          .sf-header { flex-direction: column; }
          .sf-header-actions { width: 100%; }
          .sf-btn--full { margin-top: 12px; }
          .sf-sections-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default ServiceForm;