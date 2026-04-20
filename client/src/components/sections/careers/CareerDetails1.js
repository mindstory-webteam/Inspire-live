"use client";
import { useState, useRef } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const JobIcon = ({ image, iconName, title, size = 80 }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = image?.url && !imgFailed;

  return (
    <div style={{
      width: size, height: size, minWidth: size,
      borderRadius: 12, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: showImage ? "transparent" : "linear-gradient(135deg, #1a598a, #015599)",
      flexShrink: 0,
    }}>
      {showImage ? (
        <img
          src={image.url}
          alt={title || "Career"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={() => setImgFailed(true)}
        />
      ) : iconName ? (
        <i className={iconName} style={{ fontSize: size * 0.4, color: "#fff" }}></i>
      ) : (
        <span style={{ fontSize: size * 0.35, fontWeight: 700, color: "#fff" }}>
          {(title || "J").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const CareerDetails1 = ({ career, prevId, nextId, isPrevItem, isNextItem }) => {
  const {
    _id, slug, title, iconName, image, category, need, location,
    description, requirements, requirementsList,
    responsibilities, responsibilitiesList,
    tags, jobNumber, company, website,
    salaryMin, salaryMax, salaryPeriod,
    vacancy, applyDeadline,
  } = career || {};

  const [form, setForm]       = useState({ fullName: "", email: "", phone: "", coverLetter: "" });
  const [file, setFile]       = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const fileRef               = useRef(null);

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) { setError("Full name and email are required."); return; }
    setSending(true); setError("");
    try {
      const fd = new FormData();
      fd.append("fullName",    form.fullName);
      fd.append("email",       form.email);
      fd.append("phone",       form.phone);
      fd.append("coverLetter", form.coverLetter);
      if (file) fd.append("resume", file);

      const identifier = slug || _id;
      const res  = await fetch(`${API_BASE}/careers/${identifier}/apply`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
        setFile(null);
      } else {
        setError(data.message || "Submission failed. Please try again.");
      }
    } catch { setError("Network error. Please try again."); }
    setSending(false);
  };

  const salaryDisplay = salaryMin && salaryMax
    ? `$${salaryMin}–$${salaryMax} / ${salaryPeriod}`
    : salaryMin ? `From $${salaryMin} / ${salaryPeriod}`
    : salaryMax ? `Up to $${salaryMax} / ${salaryPeriod}`
    : null;

  const deadlineDisplay = applyDeadline
    ? new Date(applyDeadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
    : null;

  const vacancyDisplay = vacancy ? `${String(vacancy).padStart(2, "0")} Available` : null;

  return (
    <section className="tj-careers-details section-gap">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {/* ── Job Header ── */}
            <div className="tj-careers-top mb-40 wow fadeInUp" data-wow-delay="0.1s" style={{
              display: "flex", alignItems: "center", gap: 24,
              background: "#fff", borderRadius: 16, padding: "28px 32px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            }}>
              <JobIcon image={image} iconName={iconName} title={title} size={80} />
              <div className="tj-careers-top-content">
                <div className="tj-careers-tag" style={{ marginBottom: 8 }}>
                  {category && <span>{category}</span>}
                  {need     && <span>{need}</span>}
                </div>
                <h3 className="tj-careers-top-title text-anim" style={{ margin: "0 0 8px" }}>{title}</h3>
                {location && (
                  <span className="location">
                    <i className="tji-location"></i> {location}
                  </span>
                )}
              </div>
            </div>

            {/* ── Job Info Pills ── */}
            {(category || jobNumber || company || website || salaryDisplay || vacancyDisplay || deadlineDisplay) && (
              <div className="wow fadeInUp" data-wow-delay="0.15s" style={{
                display: "flex", flexWrap: "wrap", gap: 12,
                marginBottom: 36,
              }}>
                {[
                  category       && { label: "Category",  value: category },
                  jobNumber      && { label: "Job No.",    value: jobNumber },
                  company        && { label: "Company",    value: company },
                  website        && { label: "Website",    value: website },
                  salaryDisplay  && { label: "Salary",     value: salaryDisplay },
                  vacancyDisplay && { label: "Vacancy",    value: vacancyDisplay },
                  deadlineDisplay && { label: "Deadline",  value: deadlineDisplay },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} style={{
                    background: "#f0f6ff",
                    borderRadius: 10,
                    padding: "10px 18px",
                    display: "flex", flexDirection: "column", gap: 2,
                  }}>
                    <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Job Content ── */}
            <div className="tj-entry-content wow fadeInUp" data-wow-delay="0.2s">
              {description && (
                <>
                  <h4 className="text-anim">Job Description</h4>
                  <p>{description}</p>
                </>
              )}

              {(requirements || requirementsList?.length > 0) && (
                <div className="tj-check-list">
                  <h4 className="text-anim">Requirements</h4>
                  {requirements && <p>{requirements}</p>}
                  {requirementsList?.length > 0 && (
                    <div className="team-details__experience__list service-check-list mt-4 mb-4">
                      <ul>
                        {requirementsList.map((item, i) => (
                          <li key={i}><i className="tji-check"></i><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {(responsibilities || responsibilitiesList?.length > 0) && (
                <div className="tj-check-list">
                  <h4 className="text-anim">Responsibilities</h4>
                  {responsibilities && <p>{responsibilities}</p>}
                  {responsibilitiesList?.length > 0 && (
                    <ul>
                      {responsibilitiesList.map((item, i) => (
                        <li key={i}><span><i className="tji-check"></i></span> {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* ── Tags & Share ── */}
            {tags?.length > 0 && (
              <div className="tj-tags-post tj-post-details_tags_share wow fadeInUp" data-wow-delay=".1s">
                <div className="tagcloud">
                  <span>Tags:</span>
                  {tags.map((tag, i) => <Link key={i} href="/careers">{tag}</Link>)}
                </div>
                <div className="post-share">
                  <ul>
                    <li>Share:</li>
                    <li><Link href="https://www.facebook.com/" title="Facebook"><i className="fa-brands fa-facebook-f"></i></Link></li>
                    <li><Link href="https://x.com/" title="Twitter"><i className="fab fa-x-twitter"></i></Link></li>
                    <li><Link href="https://www.linkedin.com/" title="Linkedin"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                    <li><Link href="https://www.pinterest.com/" title="Pinterest"><i className="fa-brands fa-pinterest-p"></i></Link></li>
                  </ul>
                </div>
              </div>
            )}

            {/* ── Apply Online ── */}
            <div className="wow fadeInUp" data-wow-delay="0.3s" style={{
              background: "#fff", borderRadius: 16, padding: "36px 40px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginTop: 40,
            }}>
              <h4 className="widget-title" style={{ marginBottom: 28 }}>Apply Online</h4>
              <div className="tj-careers-form">
                {sent ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#16a34a", fontWeight: 600, fontSize: 16 }}>
                    ✓ Application submitted! We'll be in touch soon.
                  </div>
                ) : (
                  <form onSubmit={handleApply}>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-input">
                          <input type="text" placeholder="Full name*"
                            value={form.fullName} onChange={(e) => setF("fullName", e.target.value)} required />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-input">
                          <input type="email" placeholder="Enter email*"
                            value={form.email} onChange={(e) => setF("email", e.target.value)} required />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-input">
                          <input type="text" placeholder="Phone number"
                            value={form.phone} onChange={(e) => setF("phone", e.target.value)} />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-input message-input">
                          <textarea placeholder="Cover letter"
                            value={form.coverLetter} onChange={(e) => setF("coverLetter", e.target.value)} />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-input reduce">
                          <label className="label" htmlFor="inputFile">Attach resume (PDF/DOC)</label>
                          <input type="file" id="inputFile" ref={fileRef} accept=".pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files[0])} />
                          {file && <p style={{ fontSize: 12, color: "#67787a", marginTop: 4 }}>Selected: {file.name}</p>}
                        </div>
                      </div>
                    </div>
                    {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}
                    <div className="tj-careers-button">
                      <ButtonPrimary text={sending ? "Submitting…" : "Submit now"} type="submit" disabled={sending} />
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ── Navigation ── */}
            <div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s" style={{ marginTop: 40 }}>
              <div className="tj-nav__post previous" style={{ visibility: isPrevItem ? "visible" : "hidden" }}>
                <div className="tj-nav-post__nav prev_post">
                  <Link href={isPrevItem ? `/careers/${prevId}` : "#"}>
                    <span><i className="tji-arrow-left"></i></span> Previous
                  </Link>
                </div>
              </div>
              <Link href="/careers" className="tj-nav-post__grid">
                <i className="tji-window"></i>
              </Link>
              <div className="tj-nav__post next" style={{ visibility: isNextItem ? "visible" : "hidden" }}>
                <div className="tj-nav-post__nav next_post">
                  <Link href={isNextItem ? `/careers/${nextId}` : "#"}>
                    Next <span><i className="tji-arrow-right"></i></span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerDetails1;