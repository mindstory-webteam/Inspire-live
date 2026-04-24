"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SHARED_CSS, ArrowIcon, CubeIcon } from "@/components/landing/InspireShared";

export default function ServicesSection() {
  var [services, setServices] = useState([]);
  var [loading, setLoading]   = useState(true);
  var [error, setError]       = useState(null);

  useEffect(function() {
    fetch("/api/services")
      .then(function(r) { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(function(d) { setServices(Array.isArray(d) ? d : d.services ?? d.data ?? []); })
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }, []);

  return (
    <>
      <section className="srv-wrap">
        <div className="inspire-container">

          {/* ── Header ── */}
          <div className="inspire-header">
            <div className="inspire-header-left">
              <span className="inspire-eyebrow">
                <CubeIcon />
                OUR SOLUTIONS
              </span>
              <h2 className="inspire-title">
                From Aspirations to<br />Achievements We Guide Every Step
              </h2>
            </div>
            <Link href="/services" className="inspire-pill-btn">
              Explore More
              <span className="inspire-icon"><ArrowIcon /></span>
            </Link>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="srv-grid">
              {[...Array(6)].map(function(_, i) {
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

      <style>{SHARED_CSS + `
        .srv-wrap {
          background: #edf0f4;
          padding: 80px 24px 88px;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .srv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        /* Card */
        .srv-card {
          background: #fff; border-radius: 14px; border: 1.5px solid #dce3ef;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform .25s, box-shadow .25s, border-color .25s;
          animation: srv-in .45s ease both;
        }
        .srv-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(11,38,64,.12);
          border-color: #1a3c6e;
        }
        @keyframes srv-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .srv-img {
          position: relative; width: 100%; height: 196px;
          overflow: hidden; background: #e5eaf4; flex-shrink: 0;
        }
        .srv-img img { object-fit: cover; transition: transform .4s ease; }
        .srv-card:hover .srv-img img { transform: scale(1.05); }

        .srv-placeholder {
          width: 100%; height: 100%; display: flex;
          align-items: center; justify-content: center;
          background: linear-gradient(135deg, #dce6f7, #e8eff9);
        }
        .srv-placeholder svg { width: 44px; height: 44px; color: #1a3c6e; opacity: .3; }

        .srv-badge {
          position: absolute; top: 12px; left: 12px;
          background: #e8a020; color: #fff; font-size: 10.5px; font-weight: 700;
          letter-spacing: .07em; padding: 4px 10px; border-radius: 20px;
          text-transform: uppercase;
        }

        .srv-body { padding: 22px 22px 26px; display: flex; flex-direction: column; flex: 1; }
        .srv-num  { font-size: 11px; font-weight: 700; color: #e8a020; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 7px; }
        .srv-name { font-size: 18px; font-weight: 800; color: #0b2640; margin: 0 0 9px; line-height: 1.25; }
        .srv-desc {
          font-size: 13.5px; color: #5a7080; line-height: 1.65; margin: 0 0 18px; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .srv-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 700; color: #1a3c6e;
          text-decoration: none; transition: gap .2s, color .2s;
        }
        .srv-link svg { width: 15px; height: 15px; transition: transform .2s; }
        .srv-card:hover .srv-link { color: #e8a020; gap: 10px; }
        .srv-card:hover .srv-link svg { transform: translateX(3px); }

        /* Skeleton */
        .srv-sk-card {
          background: #fff; border-radius: 14px;
          border: 1.5px solid #dce3ef; overflow: hidden;
        }
        .srv-sk-img  { width: 100%; height: 196px; }
        .srv-sk-line { height: 13px; border-radius: 4px; margin: 14px 20px 0; }
        .srv-sk-s    { width: 38%; margin-top: 18px; }
        .srv-sk-l    { width: 78%; }
        .srv-sk-m    { width: 55%; margin-bottom: 22px; }
        .srv-sk-img, .srv-sk-line {
          background: linear-gradient(90deg, #e4e8f0 25%, #d4dae6 50%, #e4e8f0 75%);
          background-size: 200% 100%;
          animation: srv-sh 1.4s infinite;
        }
        @keyframes srv-sh {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

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

function ServiceCard({ service, index }) {
  var slug   = service.slug || service._id;
  var imgSrc = service.image || service.img || service.thumbnail || null;

  return (
    <article className="srv-card" style={{ animationDelay: index * 70 + "ms" }}>
      <div className="srv-img">
        {imgSrc
          ? <Image src={imgSrc} alt={service.title || service.name} fill sizes="(max-width:640px)100vw,360px" />
          : <div className="srv-placeholder">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
        }
        {service.category && <span className="srv-badge">{service.category}</span>}
      </div>
      <div className="srv-body">
        <span className="srv-num">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="srv-name">{service.title || service.name}</h3>
        {(service.shortDescription || service.description) &&
          <p className="srv-desc">{service.shortDescription || service.description}</p>
        }
        {slug && (
          <Link href={"/services/" + slug} className="srv-link">
            Learn More
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}