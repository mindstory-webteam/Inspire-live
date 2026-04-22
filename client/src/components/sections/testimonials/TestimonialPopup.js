// components/shared/TestimonialPopup.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { getTestimonialsClient } from "@/utils/testimonialApi";

const StarRating = ({ rating = 5 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < rating ? "#1a6fc4" : "#d0d9e8"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const TestimonialPopup = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent]           = useState(0);
  const [visible, setVisible]           = useState(false);
  const [dismissed, setDismissed]       = useState(false);
  const [animating, setAnimating]       = useState(false);
  const intervalRef  = useRef(null);
  const showTimerRef = useRef(null);

  // ── Fetch from backend ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res  = await getTestimonialsClient();
        // handleResponse wraps server JSON as { data: serverJson }
        // serverJson: { success, data: [...] } | { success, testimonials: [...] } | plain array
        const json = res?.data;
        const list = Array.isArray(json)
          ? json
          : (json?.data ?? json?.testimonials ?? []);

        if (list.length) setTestimonials(list);
        // if list is empty, testimonials stays [] → popup simply won't show
      } catch (err) {
        console.error("TestimonialPopup fetch error:", err.message);
        // no fallback — popup stays hidden if backend is unreachable
      }
    };
    fetchTestimonials();
  }, []);

  // ── Auto-rotate ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!testimonials.length || dismissed) return;

    showTimerRef.current = setTimeout(() => setVisible(true), 800);

    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % testimonials.length);
        setAnimating(false);
        setVisible(true);
      }, 350);
    }, 6000);

    return () => {
      clearTimeout(showTimerRef.current);
      clearInterval(intervalRef.current);
    };
  }, [testimonials, dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    clearInterval(intervalRef.current);
    clearTimeout(showTimerRef.current);
  };

  // Don't render at all if no data or dismissed
  if (!testimonials.length || dismissed) return null;

  const t        = testimonials[current];
  const name     = t.clientName  || t.name        || "Anonymous";
  const message  = t.review      || t.message     || "";
  const rating   = t.rating      || 5;
  const avatar   = t.clientImage || t.avatar      || null;
  const role     = t.clientRole  || t.designation || "";
  const initial  = name.charAt(0).toUpperCase();
  const avatarColors = ["#0a2540","#1a4a7a","#0d3560","#163d6e","#0f2d50"];
  const avatarBg     = avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes tp-enter {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes tp-exit {
          from { opacity: 1; transform: translateY(0)     scale(1);   }
          to   { opacity: 0; transform: translateY(-14px) scale(.97); }
        }
        @keyframes tp-pulse {
          0%,100% { opacity: 1;  transform: scale(1);   }
          50%      { opacity: .4; transform: scale(1.5); }
        }
        @keyframes tp-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .tp-wrap * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .tp-wrap {
          position: fixed;
          bottom: 22px;
          right: 22px;
          z-index: 99999;
          width: 265px;
        }
        .tp-card {
          background: #fff;
          border-radius: 11px;
          overflow: hidden;
          box-shadow:
            0 2px 4px rgba(10,37,64,.06),
            0 6px 20px rgba(10,37,64,.11),
            0 0 0 1px rgba(10,37,64,.06);
          animation: tp-enter .45s cubic-bezier(.22,1,.36,1) forwards;
        }
        .tp-card.tp-out { animation: tp-exit .3s ease forwards; }

        .tp-topbar {
          background: #0a2540;
          padding: 7px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tp-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .09em;
          text-transform: uppercase;
          color: #eef1f5;
        }
        .tp-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: tp-pulse 1.5s ease infinite;
        }
        .tp-close {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,.12);
          color: #eef1f5;
          font-size: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
          line-height: 1;
        }
        .tp-close:hover { background: rgba(255,255,255,.22); }

        .tp-body {
          background: #f7f9fc;
          padding: 11px 13px 10px;
        }
        .tp-quote-icon {
          font-size: 26px;
          line-height: 1;
          color: #d0d9e8;
          font-family: Georgia, serif;
          margin-bottom: 2px;
          display: block;
        }
        .tp-message {
          font-size: 11.5px;
          line-height: 1.6;
          color: #2d4a6e;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 400;
        }
        .tp-author {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 9px;
          border-top: 1px solid #e4eaf2;
        }
        .tp-avatar-img {
          width: 32px; height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #eef1f5;
          flex-shrink: 0;
        }
        .tp-avatar-initial {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #eef1f5;
          flex-shrink: 0;
        }
        .tp-name {
          font-size: 11.5px;
          font-weight: 700;
          color: #0a2540;
          line-height: 1.2;
        }
        .tp-role {
          font-size: 10px;
          color: #7a92b0;
          margin-top: 1px;
        }
        .tp-stars { margin-top: 3px; }

        .tp-progress-track {
          height: 2px;
          background: #d0d9e8;
          overflow: hidden;
        }
        .tp-progress-bar {
          height: 100%;
          background: #1a6fc4;
          animation: tp-progress 6s linear forwards;
        }

        .tp-footer {
          background: #eef1f5;
          padding: 7px 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tp-dots { display: flex; gap: 4px; }
        .tp-d {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #c2cfe0;
          transition: background .3s, transform .3s;
        }
        .tp-d.active { background: #1a6fc4; transform: scale(1.5); }
        .tp-counter {
          font-size: 9.5px;
          font-weight: 600;
          color: #7a92b0;
          letter-spacing: .04em;
        }

        @media (max-width: 480px) {
          .tp-wrap { width: calc(100vw - 24px); right: 12px; bottom: 12px; }
        }
      `}</style>

      {(visible || animating) && (
        <div className="tp-wrap">
          <div className={`tp-card${animating ? " tp-out" : ""}`} role="status" aria-live="polite">

            <div className="tp-topbar">
              <div className="tp-badge">
                <span className="tp-dot" />
                Recent Review
              </div>
              <button className="tp-close" onClick={handleDismiss} aria-label="Close">✕</button>
            </div>

            <div className="tp-body">
              <span className="tp-quote-icon">"</span>
              <p className="tp-message">{message}"</p>
              <div className="tp-author">
                {avatar ? (
                  <img src={avatar} alt={name} className="tp-avatar-img" />
                ) : (
                  <div className="tp-avatar-initial" style={{ background: avatarBg }}>
                    {initial}
                  </div>
                )}
                <div>
                  <div className="tp-name">{name}</div>
                  {role && <div className="tp-role">{role}</div>}
                  <div className="tp-stars"><StarRating rating={rating} /></div>
                </div>
              </div>
            </div>

            <div className="tp-progress-track">
              <div className="tp-progress-bar" key={current} />
            </div>

            <div className="tp-footer">
              <div className="tp-dots">
                {testimonials.map((_, i) => (
                  <div key={i} className={`tp-d${i === current ? " active" : ""}`} />
                ))}
              </div>
              <span className="tp-counter">{current + 1} / {testimonials.length}</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialPopup;