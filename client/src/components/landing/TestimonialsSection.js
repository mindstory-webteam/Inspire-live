"use client";
import { useEffect, useState, useRef } from "react";

export default function TestimonialsSection() {
  var [testimonials, setTestimonials] = useState([]);
  var [loading, setLoading]           = useState(true);
  var [error, setError]               = useState(null);
  var [active, setActive]             = useState(0);
  var autoRef                         = useRef(null);

  useEffect(function() {
    fetch("/api/testimonials")
      .then(function(r) { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(function(d) {
        var list = Array.isArray(d) ? d : d.testimonials ?? d.data ?? [];
        setTestimonials(list.filter(function(t) { return t.isActive !== false; }));
      })
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }, []);

  useEffect(function() {
    if (testimonials.length < 2) return;
    autoRef.current = setInterval(function() {
      setActive(function(p) { return (p + 1) % testimonials.length; });
    }, 5000);
    return function() { clearInterval(autoRef.current); };
  }, [testimonials.length]);

  function goTo(i) { setActive(i); clearInterval(autoRef.current); }
  function prev()  { goTo((active - 1 + testimonials.length) % testimonials.length); }
  function next()  { goTo((active + 1) % testimonials.length); }

  var avg = testimonials.length
    ? (testimonials.reduce(function(s, t) { return s + (t.rating || 5); }, 0) / testimonials.length).toFixed(1)
    : "5.0";

  return (
    <>
      <section className="tm-wrap">
        <div className="tm-container">

          {/* ── Header ── */}
          <div className="tm-header">
            <div className="tm-header-left">
              <span className="tm-eyebrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                CLIENT FEEDBACK
              </span>
              <h2 className="tm-title">What Our Students Say</h2>
            </div>

            {!loading && testimonials.length > 0 && (
              <div className="tm-rating-pill">
                <span className="tm-stars-row">{"★★★★★"}</span>
                <span className="tm-avg">{avg}</span>
                <span className="tm-of">/ out of {testimonials.length}</span>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          {loading ? (
            <SkeletonCard />
          ) : error ? (
            <div className="tm-state">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#6b8caa" strokeWidth="1.5"/>
                <path d="M12 7v6M12 17h.01" stroke="#6b8caa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="tm-empty">No testimonials available yet.</p>
          ) : (
            <>
              <div className="tm-carousel">
                <button className="tm-arrow" onClick={prev} aria-label="Previous">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div className="tm-track-outer">
                  <div className="tm-track" style={{ transform: "translateX(-" + (active * 100) + "%)" }}>
                    {testimonials.map(function(t, i) {
                      return <TmCard key={t._id || i} t={t} />;
                    })}
                  </div>
                </div>

                <button className="tm-arrow" onClick={next} aria-label="Next">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="tm-dots">
                {testimonials.map(function(_, i) {
                  return (
                    <button key={i} onClick={function() { goTo(i); }}
                      className={"tm-dot" + (i === active ? " tm-dot-on" : "")}
                      aria-label={"Slide " + (i + 1)} />
                  );
                })}
              </div>

              {testimonials.length > 3 && (
                <div className="tm-thumbs">
                  {testimonials.slice(0, 6).map(function(t, i) {
                    return (
                      <button key={t._id || i} onClick={function() { goTo(i); }}
                        className={"tm-thumb" + (i === active ? " tm-thumb-on" : "")}>
                        <Avatar t={t} size={42} />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <style>{`
        .tm-wrap      { background: #edf0f4; padding: 80px 24px 88px; font-family: 'Segoe UI', system-ui, sans-serif; }
        .tm-container { max-width: 1160px; margin: 0 auto; }

        .tm-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 20px; margin-bottom: 44px; flex-wrap: wrap;
        }
        .tm-header-left { display: flex; flex-direction: column; gap: 10px; }
        .tm-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11.5px; font-weight: 700; letter-spacing: .15em;
          text-transform: uppercase; color: #1a3c6e;
        }
        .tm-title {
          font-size: clamp(28px, 4vw, 46px); font-weight: 800;
          color: #0b2640; margin: 0; line-height: 1.1; letter-spacing: -.025em;
        }

        .tm-rating-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; border: 1.5px solid #dce3ef; border-radius: 50px;
          padding: 9px 20px; box-shadow: 0 2px 10px rgba(11,38,64,.07); flex-shrink: 0;
        }
        .tm-stars-row { color: #f59e0b; font-size: 15px; letter-spacing: 1px; }
        .tm-avg { font-size: 17px; font-weight: 800; color: #0b2640; }
        .tm-of  { font-size: 13px; color: #6b8caa; }

        .tm-carousel    { display: flex; align-items: center; gap: 14px; }
        .tm-track-outer { flex: 1; overflow: hidden; border-radius: 16px; }
        .tm-track       { display: flex; transition: transform .5s cubic-bezier(.4,0,.2,1); }

        .tm-arrow {
          flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%;
          border: 1.5px solid #dce3ef; background: #fff; color: #1a3c6e;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s, border-color .2s, transform .15s;
          box-shadow: 0 2px 8px rgba(11,38,64,.07);
        }
        .tm-arrow svg { width: 18px; height: 18px; }
        .tm-arrow:hover { background: #0d2f4a; border-color: #0d2f4a; color: #fff; transform: scale(1.06); }

        /* Card */
        .tm-card {
          min-width: 100%; background: #fff; border-radius: 16px;
          border: 1.5px solid #dce3ef; box-shadow: 0 4px 28px rgba(11,38,64,.08);
          box-sizing: border-box; overflow: hidden;
          display: grid; grid-template-columns: 1fr auto;
        }

        .tm-card-left {
          padding: 40px 44px; position: relative;
          border-right: 1.5px solid #dce3ef;
        }
        .tm-card-left::before {
          content: '"'; position: absolute; top: 12px; right: 24px;
          font-size: 110px; line-height: 1; color: #0b2640; opacity: .04;
          font-family: Georgia, serif; pointer-events: none;
        }

        .tm-card-right {
          padding: 32px 28px; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 18px; min-width: 200px; background: #fafbff;
        }

        .tm-card-stars { margin-bottom: 16px; display: flex; gap: 3px; }
        .tm-star   { color: #f59e0b; font-size: 16px; }
        .tm-star-e { color: #d1d5db; }

        .tm-quote {
          font-size: clamp(14.5px, 1.8vw, 17px); color: #1a2a3a;
          line-height: 1.75; margin: 0 0 28px; font-style: italic;
        }

        .tm-author { display: flex; align-items: center; gap: 14px; }

        /* Avatar — plain img version */
        .tm-avatar {
          flex-shrink: 0; border-radius: 50%; overflow: hidden;
          background: linear-gradient(135deg, #c5d5ee, #a8c0e5);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; color: #1a3c6e;
        }
        /* The img inside avatar fills it completely */
        .tm-avatar img {
          width: 100%; height: 100%;
          object-fit: cover; display: block; border-radius: 50%;
        }

        .tm-info     { flex: 1; }
        .tm-name     { font-size: 15px; font-weight: 700; color: #0b2640; margin: 0 0 3px; }
        .tm-role     { font-size: 12.5px; color: #6b8caa; margin: 0; }

        /* Right panel */
        .tm-right-logo {
          width: 72px; height: 72px; border-radius: 50%;
          overflow: hidden; border: 2px solid #dce3ef;
          background: #fff; display: flex; align-items: center; justify-content: center;
        }
        /* Plain img inside right logo */
        .tm-right-logo img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        .tm-right-stars  { display: flex; gap: 3px; }
        .tm-right-star   { color: #f59e0b; font-size: 18px; }
        .tm-right-star-e { color: #d1d5db; }

        .tm-right-name  { font-size: 13px; font-weight: 700; color: #0b2640; text-align: center; }
        .tm-right-desig { font-size: 11.5px; color: #6b8caa; text-align: center; margin-top: 2px; }

        .tm-dots { display: flex; justify-content: center; gap: 8px; margin-top: 26px; }
        .tm-dot  { width: 8px; height: 8px; border-radius: 50%; border: none; background: #cdd5e0; cursor: pointer; padding: 0; transition: background .2s, width .3s; }
        .tm-dot-on { background: #0d2f4a; width: 22px; border-radius: 4px; }

        .tm-thumbs   { display: flex; justify-content: center; gap: 10px; margin-top: 28px; }
        .tm-thumb    { padding: 0; background: none; border: 2.5px solid transparent; border-radius: 50%; cursor: pointer; transition: border-color .2s, transform .15s; }
        .tm-thumb-on { border-color: #0d2f4a; transform: scale(1.12); }

        .tm-state { text-align: center; padding: 56px 20px; color: #6b8caa; }
        .tm-state svg { margin: 0 auto 14px; display: block; }
        .tm-empty { text-align: center; color: #6b8caa; padding: 56px 20px; font-size: 15px; }

        .tm-sk { background: #fff; border-radius: 16px; padding: 40px 44px; border: 1.5px solid #dce3ef; }
        .tm-sk-line {
          height: 13px; border-radius: 4px; margin-bottom: 13px;
          background: linear-gradient(90deg, #e4e8f0 25%, #d4dae6 50%, #e4e8f0 75%);
          background-size: 200% 100%; animation: tm-sh 1.4s infinite;
        }
        @keyframes tm-sh { from { background-position: 200% 0; } to { background-position: -200% 0; } }

        @media (max-width: 700px) {
          .tm-wrap  { padding: 56px 16px 64px; }
          .tm-card  { grid-template-columns: 1fr; }
          .tm-card-left { padding: 26px 20px; border-right: none; border-bottom: 1.5px solid #dce3ef; }
          .tm-card-left::before { display: none; }
          .tm-card-right { padding: 20px; flex-direction: row; flex-wrap: wrap; justify-content: flex-start; min-width: unset; }
          .tm-arrow { display: none; }
        }
      `}</style>
    </>
  );
}

/* ── Stars ── */
function Stars({ rating, cls }) {
  return [1, 2, 3, 4, 5].map(function(n) {
    var base = cls || "tm-star";
    return (
      <span key={n} className={base + (n > rating ? " " + base + "-e" : "")}>★</span>
    );
  });
}

/* ── Avatar — plain <img>, no Next.js Image ── */
function Avatar({ t, size }) {
  var [failed, setFailed] = useState(false);
  // schema field: img (Cloudinary URL)
  var src      = t.img || null;
  var initials = (t.authorName || "U").split(" ").map(function(w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  var showImg  = src && !failed;

  return (
    <div className="tm-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {showImg
        ? <img
            src={src}
            alt={t.authorName || "Reviewer"}
            onError={function() { setFailed(true); }}
          />
        : initials
      }
    </div>
  );
}

/* ── TmCard ── */
function TmCard({ t }) {
  var [logoFailed, setLogoFailed] = useState(false);
  // schema fields: logoImg (dark), logoImgLight (light)
  var logoSrc  = t.logoImg || t.logoImgLight || null;
  var showLogo = logoSrc && !logoFailed;

  return (
    <div className="tm-card">

      {/* LEFT — quote + author */}
      <div className="tm-card-left">
        <div className="tm-card-stars">
          <Stars rating={t.rating || 5} cls="tm-star" />
        </div>
        {/* schema field: desc2 */}
        <p className="tm-quote">{t.desc2 || ""}</p>
        <div className="tm-author">
          <Avatar t={t} size={50} />
          <div className="tm-info">
            {/* schema field: authorName */}
            <p className="tm-name">{t.authorName || ""}</p>
            {/* schema field: authorDesig */}
            {t.authorDesig && <p className="tm-role">{t.authorDesig}</p>}
          </div>
        </div>
      </div>

      {/* RIGHT — logo/avatar + stars + name */}
      <div className="tm-card-right">
        <div className="tm-right-stars">
          <Stars rating={t.rating || 5} cls="tm-right-star" />
        </div>

        {/* Logo (plain img) or avatar fallback */}
        <div className="tm-right-logo">
          {showLogo
            ? <img
                src={logoSrc}
                alt={t.authorName || "logo"}
                onError={function() { setLogoFailed(true); }}
              />
            : <Avatar t={t} size={68} />
          }
        </div>

        <div>
          <p className="tm-right-name">{t.authorName || ""}</p>
          {t.authorDesig && <p className="tm-right-desig">{t.authorDesig}</p>}
        </div>
      </div>

    </div>
  );
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="tm-sk">
      <div className="tm-sk-line" style={{ width: "90px", marginBottom: "22px" }} />
      <div className="tm-sk-line" style={{ width: "100%" }} />
      <div className="tm-sk-line" style={{ width: "75%" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#e4e8f0", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="tm-sk-line" style={{ width: 130 }} />
          <div className="tm-sk-line" style={{ width: 90 }} />
        </div>
      </div>
    </div>
  );
}