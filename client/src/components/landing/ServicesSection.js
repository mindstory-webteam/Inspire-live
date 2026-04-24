"use client";
import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

export default function ServicesSection() {
  var [services, setServices] = useState([]);
  var [loading, setLoading]   = useState(true);
  var [error, setError]       = useState(null);

  useEffect(function() {
    fetch("/api/services")
      .then(function(r) { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(function(d) {
        var list = Array.isArray(d) ? d : d.services ?? d.data ?? [];
        setServices(list.filter(function(s) {
          return s.isActive !== false && s.isHidden !== true;
        }));
      })
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }, []);

  return (
    <>
      <section className="srv-wrap">
        <div className="srv-container">

          {/* ── Header ── */}
          <div className="srv-header">
            <div className="srv-header-left">
              <span className="srv-eyebrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                OUR SOLUTIONS
              </span>
              <h2 className="srv-title">
                From Aspirations to<br />Achievements We Guide Every Step
              </h2>
            </div>
            <ButtonPrimary text="Explore More" url="/services" />
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="srv-grid">
              {[0,1,2,3,4,5].map(function(i) {
                return (
                  <div key={i} className="srv-sk-card">
                    <div className="srv-sk-img" />
                    <div className="srv-sk-line srv-sk-s" />
                    <div className="srv-sk-line srv-sk-l" />
                    <div className="srv-sk-line srv-sk-m" />
                  </div>
                );
              })}
            </div>
          ) : error ? (
            <div className="srv-state">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#6b8caa" strokeWidth="1.5"/>
                <path d="M12 7v6M12 17h.01" stroke="#6b8caa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
            </div>
          ) : services.length === 0 ? (
            <p className="srv-empty">No services available at the moment.</p>
          ) : (
            <div className="srv-grid">
              {services.map(function(s, i) {
                return <ServiceCard key={s._id || i} service={s} index={i} />;
              })}
            </div>
          )}

        </div>
      </section>

      <style>{`
        .srv-wrap      { background: #edf0f4; padding: 80px 24px 88px; font-family: 'Segoe UI', system-ui, sans-serif; }
        .srv-container { max-width: 1160px; margin: 0 auto; }

        .srv-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 20px; margin-bottom: 44px; flex-wrap: wrap;
        }
        .srv-header-left { display: flex; flex-direction: column; gap: 10px; }
        .srv-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11.5px; font-weight: 700; letter-spacing: .15em;
          text-transform: uppercase; color: #1a3c6e;
        }
        .srv-title {
          font-size: clamp(28px, 4vw, 46px); font-weight: 800;
          color: #0b2640; margin: 0; line-height: 1.1; letter-spacing: -.025em;
        }

        /* Grid */
        .srv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

        /* Card */
        .srv-card {
          background: #fff; border-radius: 14px; border: 1.5px solid #dce3ef;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform .25s, box-shadow .25s, border-color .25s;
          animation: srv-in .45s ease both;
        }
        .srv-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(11,38,64,.12); border-color: #1a3c6e; }
        @keyframes srv-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        /* Image area — uses plain <img> not Next Image */
        .srv-img-wrap {
          position: relative; width: 100%; height: 196px;
          overflow: hidden; background: #e5eaf4; flex-shrink: 0;
        }
        .srv-hero-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform .4s ease;
        }
        .srv-card:hover .srv-hero-img { transform: scale(1.05); }

        /* Placeholder — shown when no image */
        .srv-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; flex-direction: column; gap: 10px;
          background: linear-gradient(135deg, #dce6f7, #e8eff9);
        }
        .srv-placeholder svg { width: 44px; height: 44px; color: #1a3c6e; opacity: .3; }

        /* Icon overlay (shown over heroImage, bottom-right) */
        .srv-icon-overlay {
          position: absolute; bottom: 12px; right: 12px;
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(255,255,255,.92); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 12px rgba(11,38,64,.15); overflow: hidden;
        }
        .srv-icon-overlay img { width: 28px; height: 28px; object-fit: contain; }

        /* Icon badge in placeholder (center) */
        .srv-icon-badge {
          width: 60px; height: 60px; border-radius: 14px;
          background: #fff; box-shadow: 0 4px 16px rgba(11,38,64,.12);
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .srv-icon-badge img { width: 38px; height: 38px; object-fit: contain; }

        /* Category badge */
        .srv-badge {
          position: absolute; top: 12px; left: 12px; background: #e8a020; color: #fff;
          font-size: 10.5px; font-weight: 700; letter-spacing: .07em;
          padding: 4px 10px; border-radius: 20px; text-transform: uppercase;
        }

        /* Card body */
        .srv-body     { padding: 22px 22px 26px; display: flex; flex-direction: column; flex: 1; }
        .srv-num      { font-size: 11px; font-weight: 700; color: #e8a020; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
        .srv-name     { font-size: 18px; font-weight: 800; color: #0b2640; margin: 0 0 4px; line-height: 1.25; }
        .srv-subtitle { font-size: 12.5px; color: #3a7ca5; font-weight: 600; margin: 0 0 8px; }
        .srv-desc     { font-size: 13.5px; color: #5a7080; line-height: 1.65; margin: 0 0 14px; flex: 1;
                        display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        /* Feature chips */
        .srv-features  { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .srv-feat-chip {
          font-size: 11px; font-weight: 600; color: #1a3c6e;
          background: #eef2fb; border: 1px solid #d0dbf0;
          border-radius: 20px; padding: 3px 10px; white-space: nowrap;
        }

        /* Skeleton */
        .srv-sk-card { background: #fff; border-radius: 14px; border: 1.5px solid #dce3ef; overflow: hidden; }
        .srv-sk-img  { width: 100%; height: 196px; }
        .srv-sk-line { height: 13px; border-radius: 4px; margin: 14px 20px 0; }
        .srv-sk-s    { width: 38%; margin-top: 18px; }
        .srv-sk-l    { width: 78%; }
        .srv-sk-m    { width: 55%; margin-bottom: 22px; }
        .srv-sk-img,.srv-sk-line {
          background: linear-gradient(90deg, #e4e8f0 25%, #d4dae6 50%, #e4e8f0 75%);
          background-size: 200% 100%; animation: srv-sh 1.4s infinite;
        }
        @keyframes srv-sh { from { background-position: 200% 0; } to { background-position: -200% 0; } }

        .srv-state { text-align: center; padding: 56px 20px; color: #6b8caa; }
        .srv-state svg { margin: 0 auto 14px; display: block; }
        .srv-empty { text-align: center; color: #6b8caa; padding: 56px 20px; font-size: 15px; }

        @media (max-width: 640px) {
          .srv-wrap { padding: 56px 16px 64px; }
          .srv-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ServiceCard
   Uses plain <img> tags — no Next.js Image component.
   This avoids remotePatterns / domain config issues entirely.
───────────────────────────────────────────────────────── */
function ServiceCard({ service, index }) {
  var [imgFailed, setImgFailed] = useState(false);

  var slug     = service.slug || service._id;
  var heroSrc  = service.heroImage || service.detailImage1 || service.detailImage2 || null;
  var iconSrc  = service.icon || null;
  var title    = service.title || service.name || "";
  var subtitle = service.subtitle || "";
  var desc     = service.shortDescription || service.description1 || service.description || "";
  var features = Array.isArray(service.keyFeatures) ? service.keyFeatures.slice(0, 3) : [];

  /* Show placeholder if: no URL, or URL failed to load */
  var showImage = heroSrc && !imgFailed;

  return (
    <article className="srv-card" style={{ animationDelay: index * 70 + "ms" }}>

      {/* ── Image area ── */}
      <div className="srv-img-wrap">
        {showImage ? (
          <>
            {/* Plain <img> — works with any domain, no Next.js config needed */}
            <img
              className="srv-hero-img"
              src={heroSrc}
              alt={title}
              onError={function() { setImgFailed(true); }}
            />
            {/* Icon badge overlaid on image */}
            {iconSrc && (
              <div className="srv-icon-overlay">
                <img src={iconSrc} alt={title + " icon"} onError={function(e){ e.target.style.display="none"; }} />
              </div>
            )}
          </>
        ) : (
          /* Placeholder — icon badge or generic SVG */
          <div className="srv-placeholder">
            {iconSrc ? (
              <div className="srv-icon-badge">
                <img src={iconSrc} alt={title + " icon"} onError={function(e){ e.target.style.display="none"; }} />
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        )}

        {service.category && <span className="srv-badge">{service.category}</span>}
      </div>

      {/* ── Body ── */}
      <div className="srv-body">
        <span className="srv-num">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="srv-name">{title}</h3>
        {subtitle && <p className="srv-subtitle">{subtitle}</p>}
        {desc     && <p className="srv-desc">{desc}</p>}
        {features.length > 0 && (
          <div className="srv-features">
            {features.map(function(f, i) {
              return <span key={i} className="srv-feat-chip">{f}</span>;
            })}
          </div>
        )}
        {slug && <ButtonPrimary text="Learn More" url={"/services/" + slug} />}
      </div>

    </article>
  );
}