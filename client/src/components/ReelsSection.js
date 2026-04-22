"use client";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const REELS_DATA = [
  {
    id: "1",
    embedUrl: "https://www.instagram.com/reel/DXa9iTHFxU-/embed",
    title: "Inspire Education Reel",
    tag: "Latest",
  },
  {
    id: "2",
    embedUrl: "https://www.instagram.com/reel/DWalgjYDbEt/embed",
    title: "Student Success Story",
    tag: "Success",
  },
  {
    id: "3",
    embedUrl: "https://www.instagram.com/reel/DV2ikj5idP9/embed",
    title: "Study Abroad Journey",
    tag: "Study Abroad",
  },
  {
    id: "4",
    embedUrl: "https://www.instagram.com/reel/DVK8ovmgF0w/embed",
    title: "PhD Guidance Tips",
    tag: "PhD",
  },
  {
    id: "5",
    embedUrl: "https://www.instagram.com/reel/DU5KKoTDOUJ/embed",
    title: "Research Support",
    tag: "Research",
  },
  {
    id: "6",
    embedUrl: "https://www.instagram.com/reel/DUGQuMvAToQ/embed",
    title: "Expert Insights",
    tag: "Insights",
  },
];

const ReelCard = ({ reel }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <style>{`
        @keyframes reel-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ig-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.12); opacity: .8; }
        }

        .reel-card-outer {
          position: relative;
          aspect-ratio: 9 / 14;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(10,37,64,.18);
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
          background: #0a1f36;
        }
        .reel-card-outer:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 20px 52px rgba(10,37,64,.28);
        }

        .reel-card-inner {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
          background: #0a1f36;
        }

        /* iframe fills card, pointer-events ON so native IG play works */
        .reel-card-inner iframe {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 220%;
          top: -20%;
          border: none;
          display: block;
          pointer-events: auto;   /* ← allows clicking native IG play button */
        }

        /* Covers IG header */
        .reel-crop-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5%;
          background: #0a1f36;
          z-index: 3;
          border-radius: 16px 16px 0 0;
          /* pointer-events none so clicks pass through to video area below */
          pointer-events: none;
        }

        /* Covers IG footer */
        .reel-crop-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 27%;
          background: #0a1f36;
          z-index: 3;
          border-radius: 0 0 16px 16px;
          pointer-events: none;
        }

        /* Shimmer */
        .reel-skeleton-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,#1a3a5c 25%,#1e4570 50%,#1a3a5c 75%);
          background-size: 200% 100%;
          animation: reel-shimmer 1.5s infinite;
          z-index: 5;
          border-radius: 16px;
          transition: opacity .5s ease;
          pointer-events: none;
        }
        .reel-skeleton-layer.hidden { opacity: 0; pointer-events: none; }

        /* IG loader */
        .reel-ig-loader {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 6;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          transition: opacity .4s ease;
          pointer-events: none;
        }
        .reel-ig-loader.hidden { opacity: 0; pointer-events: none; }
        .reel-ig-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          animation: ig-pulse 1.4s ease infinite;
        }
        .reel-ig-label {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,.65);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: .06em;
        }

        /* Bottom meta — fades in on hover, above crop overlay */
       .reel-meta-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 6;
          padding: 36px 14px 14px;
          background: linear-gradient(0deg, rgba(10,31,54,.92) 0%, transparent 100%);
          border-radius: 0 0 16px 16px;
          pointer-events: none;
          opacity: 1;              /* ← always visible */
        }

        .reel-tag-pill {
          display: inline-block;
          background: #1a6fc4;
          color: #fff;
          font-size: 9px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 20px;
          margin-bottom: 5px;
          font-family: 'DM Sans', sans-serif;
        }
        .reel-title-text {
          font-size: 12px; font-weight: 600;
          color: #fff; line-height: 1.4; margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* IG corner badge */
       .reel-ig-corner {
          position: absolute;
          top: 10px; right: 10px;
          z-index: 6;
          width: 28px; height: 28px;
          background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          opacity: 1; 
          display: hidden;            /* ← always visible */
          pointer-events: none;
        }
      `}</style>

      <div className="reel-card-outer">

        <div className="reel-card-inner">
          <div className="reel-crop-top" />
          <div className="reel-crop-bottom" />
          {/* ✅ pointer-events auto — Instagram's native play button works */}
          <iframe
            src={reel.embedUrl}
            title={reel.title}
            scrolling="no"
            allowTransparency="true"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Shimmer while loading */}
        <div className={`reel-skeleton-layer${loaded ? " hidden" : ""}`} />

        {/* IG loader icon */}
        <div className={`reel-ig-loader${loaded ? " hidden" : ""}`}>
          <div className="reel-ig-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8"/>
              <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
            </svg>
          </div>
          <span className="reel-ig-label">Loading Reel…</span>
        </div>

        {/* ✅ NO custom play button — Instagram's native one handles play */}

        {/* Hover meta bar */}
        <div className="reel-meta-bar">
          <span className="reel-tag-pill">{reel.tag}</span>
          <p className="reel-title-text">{reel.title}</p>
        </div>

        {/* IG corner badge */}
        <div className="reel-ig-corner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
          </svg>
        </div>

      </div>
    </>
  );
};

// ── Main section ──────────────────────────────────────────────────────────────
const ReelsSection = () => {
  const [loading, setLoading] = useState(true);
  const [reels, setReels]     = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setReels(REELS_DATA);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');

        .reels-section * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        .reels-section .swiper-slide {
          height: auto;
          overflow: visible !important;
        }
        .reels-section .swiper {
          overflow: visible !important;
          padding-bottom: 40px !important;
        }
        .reels-section .swiper-wrapper { overflow: visible !important; }

        .reels-section .swiper-pagination-bullet {
          background: #c2cfe0; opacity: 1;
          width: 7px; height: 7px;
          transition: background .3s, transform .3s;
        }
        .reels-section .swiper-pagination-bullet-active {
          background: #1a6fc4;
          transform: scale(1.4);
        }
        .reels-section .swiper-pagination-area {
          margin-top: 8px;
          text-align: center;
        }

        @keyframes reel-load-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .reel-load-skeleton {
          border-radius: 16px;
          aspect-ratio: 9 / 14;
          background: linear-gradient(90deg,#e2e8f0 25%,#cbd5e1 50%,#e2e8f0 75%);
          background-size: 200% 100%;
          animation: reel-load-shimmer 1.5s infinite;
        }
      `}</style>

      <section className="reels-section tj-project-section-4 section-gap">
        <div className="container-fluid">

          <div className="row">
            <div className="col-12">
              <div className="sec-heading style-4 text-center">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box"></i> Reels &amp; Shorts
                </span>
                <h2 className="sec-title title-anim">
                  Real Stories, Real Impact.
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="project-wrapper wow fadeInUp" data-wow-delay=".5s">

                {loading && (
                  <div style={{ display: "flex", gap: 20, overflow: "hidden" }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="reel-load-skeleton"
                        style={{ minWidth: 180, flex: "0 0 180px" }} />
                    ))}
                  </div>
                )}

                {!loading && reels.length === 0 && (
                  <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
                    No reels available yet.
                  </p>
                )}

                {!loading && reels.length > 0 && (
                  <Swiper
                    slidesPerView={1.3}
                    spaceBetween={14}
                    loop={true}
                    speed={1200}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ el: ".swiper-pagination-area", clickable: true }}
                    breakpoints={{
                      480:  { slidesPerView: 2,   spaceBetween: 16 },
                      768:  { slidesPerView: 3,   spaceBetween: 20 },
                      992:  { slidesPerView: 4,   spaceBetween: 22 },
                      1200: { slidesPerView: 4.5, spaceBetween: 24 },
                      1400: { slidesPerView: 5,   spaceBetween: 24 },
                    }}
                    modules={[Pagination, Autoplay]}
                    className="project-slider-3"
                  >
                    {reels.map((reel, idx) => (
                      <SwiperSlide key={idx}>
                        <ReelCard reel={reel} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-area" />
                  </Swiper>
                )}

              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default ReelsSection;