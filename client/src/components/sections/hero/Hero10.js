"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";
const SLIDE_DURATION = 5000;

const Hero10 = () => {
  const [slides, setSlides]                 = useState([]);
  const [activeIndex, setActiveIndex]       = useState(0);
  const [nextIndex, setNextIndex]           = useState(null);
  const [contentVisible, setContentVisible] = useState(true);
  const [mediaFading, setMediaFading]       = useState(false);

  const videoRef       = useRef(null);
  const timerRef       = useRef(null);
  const progressRef    = useRef(null);
  const activeIndexRef = useRef(0);
  const transitioning  = useRef(false);
  const thumbStripRef  = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/banner`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((res) => {
        if (res.success && res.data?.slides) {
          const active = res.data.slides.filter((s) => s.isActive);
          setSlides(active);
        }
      })
      .catch((err) => console.error("Failed to fetch banner:", err));
  }, []);

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com").replace("/api", "");
    return `${base}${url}`;
  };

  const isVideoSlide = (slide) => {
    if (!slide) return false;
    if (slide.type === "video" || slide.mediaType === "video") return true;
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(slide.mediaUrl || "");
  };

  const startProgress = (duration) => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    void el.offsetWidth;
    el.style.transition = `width ${duration}ms linear`;
    el.style.width = "100%";
    timerRef.current = setTimeout(goNext, duration);
  };

  const goTo = (idx) => {
    const total = slides.length;
    if (!total || transitioning.current) return;
    const next = ((idx % total) + total) % total;
    if (next === activeIndexRef.current) return;

    transitioning.current = true;
    clearTimeout(timerRef.current);

    setContentVisible(false);
    setMediaFading(true);
    setNextIndex(next);

    setTimeout(() => {
      activeIndexRef.current = next;
      setActiveIndex(next);
      setNextIndex(null);
      setMediaFading(false);

      // keep active thumbnail scrolled into view on mobile
      const strip = thumbStripRef.current;
      if (strip) {
        const activeEl = strip.children[next];
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }

      requestAnimationFrame(() => {
        setContentVisible(true);
        transitioning.current = false;
      });
    }, 400);
  };

  const goNext = () => goTo(activeIndexRef.current + 1);
  const goPrev = () => goTo(activeIndexRef.current - 1);

  useEffect(() => {
    if (!slides.length) return;
    const current = slides[activeIndex];
    clearTimeout(timerRef.current);

    if (isVideoSlide(current)) {
      const el = progressRef.current;
      if (el) { el.style.transition = "none"; el.style.width = "0%"; }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      const raf = requestAnimationFrame(() => startProgress(SLIDE_DURATION));
      return () => { cancelAnimationFrame(raf); clearTimeout(timerRef.current); };
    }

    return () => clearTimeout(timerRef.current);
  }, [activeIndex, slides]);

  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    startProgress(video.duration * 1000);
  };

  const active      = slides[activeIndex] || null;
  const title       = active?.title       || "Ideas That Change the World Start Here";
  const description = active?.description || active?.subtitle || "Recognized by industry leaders, our award-winning team has a proven record of delivering excellence across projects.";
  const subtitle    = active?.subtitle    || "Recognized by industry leaders,";
  const buttonText  = active?.buttonText  || "Get Started";
  const buttonUrl   = active?.buttonUrl   || "/contact";
  const mediaUrl    = active ? resolveUrl(active.mediaUrl) : "";
  const isVideo     = isVideoSlide(active);

  // NOTE: height is now 100% — the actual height comes from .h10-hero-banner
  // (set below in the <style> block / overridden by your external media queries).
  // Width always stays 100% regardless of height.
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  return (
    <>
      <style>{`
        .h10-content-fade {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .h10-content-fade.hidden {
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
        }
        .h10-content-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Single source of truth for banner height ──
           Change height here (or override via external media queries
           on .h10-hero-banner) — width always stays 100% independently. */
        .h10-hero-banner {
          position: relative;
          width: 100%;
          height: clamp(220px, 45vw, 520px);
          overflow: hidden;
        }

        .h10-media-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #0c1e21;
        }
        .h10-media-wrap > .h10-media-item {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.4s ease, transform 0.4s ease;
          will-change: opacity, transform;
          backface-visibility: hidden;
          transform: translateZ(0) scale(1);
        }
        .h10-media-wrap > .h10-media-item.fade-out {
          opacity: 0;
          transform: translateZ(0) scale(1.02);
        }
        .h10-media-wrap > .h10-media-item.fade-in {
          opacity: 1;
          transform: translateZ(0) scale(1);
        }

        /* ── Nav overlay: desktop default ── */
        .h10-nav-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 10;
          padding: 16px 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
        }
        .h10-thumb-strip {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1 1 auto;
          min-width: 0;
        }
        .h10-thumb-strip::-webkit-scrollbar { display: none; }
        .h10-thumb {
          position: relative;
          width: 110px;
          cursor: pointer;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          transition: border-color 0.3s ease;
        }
        .h10-thumb-media {
          width: 100%;
          height: 68px;
          object-fit: cover;
          display: block;
          background-size: cover;
          background-position: center;
        }
        .h10-nav-buttons {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .h10-nav-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.35); color: #fff;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(4px); transition: background 0.2s;
          flex-shrink: 0;
        }
        .h10-nav-btn:hover { background: rgba(0,0,0,0.6); }

        /* ── Remove blue/white gap below the media card ──
           zoom-on-scroll-wrapper / zoom-on-scroll in the theme often reserve
           extra space (via padding or a scale transform on an outer box) to
           allow the image to "zoom" without clipping. We pin that scaling to
           the inner wrap only, and strip every layout-affecting side effect
           from the outer wrapper and the section itself. */
        .tj-banner-section-2.h10-hero {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
        .zoom-on-scroll-wrapper {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
        .h10-hero-banner.zoom-on-scroll {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          transform: none !important; /* stop theme JS from resizing this box on scroll */
        }
        .container-fluid.gap-0,
        .container-fluid.gap-0 .row,
        .container-fluid.gap-0 .col-12 {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }

        /* ── Smoother entrance: fade+slide via transform/opacity only,
           so it never shifts layout of elements below it ── */
        .h6-hero-history.wow {
          will-change: opacity, transform;
        }

        /* ── Tablet ── */
        @media (max-width: 991px) {
          .h10-nav-overlay { padding: 12px 16px; }
          .h10-thumb { width: 84px; }
          .h10-thumb-media { height: 52px; }
          .h10-nav-btn { width: 34px; height: 34px; }
        }

        /* ── Mobile / small tablet ── */
        @media only screen and (min-width: 576px) and (max-width: 767px), (max-width: 575px) {
          .h10-hero-banner {
            height: 300px;
            margin-top: 70px;
          }
        }

        /* ── Mobile nav overlay layout ── */
        @media (max-width: 575px) {
          .h10-nav-overlay {
            flex-direction: column;
            align-items: stretch;
            padding: 10px 10px 12px;
            gap: 8px;
          }
          .h10-thumb-strip {
            width: 100%;
            padding-bottom: 2px;
          }
          .h10-thumb { width: 64px; }
          .h10-thumb-media { height: 40px; }
          .h10-nav-buttons {
            align-self: flex-end;
          }
          .h10-nav-btn { width: 30px; height: 30px; }
          .h10-nav-btn i { font-size: 12px; }
        }
      `}</style>

      <section className="tj-banner-section-2 h10-hero section-gap-x zoom-on-scroll-wrapper">

        {/* ── TOP: Text content ── */}
        <div className="container">
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-4 col-xl-3">
              <div className="h10-hero-award-wrapper">
                <div className="h6-hero-history wow fadeInUp" data-wow-delay=".3s">
                  <div className="h6-hero-history-title"></div>
                  <p className={`h6-hero-history-desc h10-content-fade ${contentVisible ? "visible" : "hidden"}`}>
                    {description}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-xl-9">
              <div className="banner-content-2">
                <p
                  className={`slider-subtitle h10-content-fade ${contentVisible ? "visible" : "hidden"}`}
                  style={{
                    color: "#ffffff",
                    minHeight: "1.5em",
                    fontSize: "clamp(14px, 4vw, 30px)",
                  }}
                >
                  {subtitle}
                </p>

                <h1
                  className={`banner-title text-anim h10-content-fade ${contentVisible ? "visible" : "hidden"}`}
                  key={activeIndex}
                  style={{ fontSize: "clamp(28px, 6vw, 64px)", lineHeight: 1.15 }}
                >
                  {title}{" "}
                  <i className="tji-curve-arrow" />
                </h1>

                <div className={`banner-desc-area h10-content-fade ${contentVisible ? "visible" : "hidden"}`}>
                  <ButtonPrimary text={buttonText} url={buttonUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: Media banner ── */}
        <div className="container-fluid gap-0">
          <div className="row">
            <div className="col-12">
              <div className="h10-hero-banner zoom-on-scroll">

                <div className="h10-media-wrap">

                  <div className={`h10-media-item ${mediaFading ? "fade-out" : "fade-in"}`}>
                    {isVideo ? (
                      <video
                        ref={videoRef}
                        key={mediaUrl}
                        autoPlay muted playsInline
                        data-wf-ignore="true"
                        data-object-fit="cover"
                        style={mediaStyle}
                        onLoadedMetadata={handleVideoLoaded}
                        onEnded={goNext}
                      >
                        <source src={mediaUrl} type="video/mp4" />
                        <source src={mediaUrl} type="video/webm" />
                      </video>
                    ) : mediaUrl ? (
                      <img
                        key={mediaUrl}
                        src={mediaUrl}
                        alt={title}
                        style={mediaStyle}
                      />
                    ) : (
                      <div style={{ ...mediaStyle, background: "#0c1e21" }} />
                    )}
                  </div>

                  {slides.length > 1 && (
                    <div className="h10-nav-overlay">

                      <div className="h10-thumb-strip" ref={thumbStripRef}>
                        {slides.map((slide, idx) => {
                          const thumbUrl = resolveUrl(slide.mediaUrl || slide.thumbUrl);
                          const isActive = idx === activeIndex;
                          return (
                            <div
                              key={slide._id || idx}
                              onClick={() => goTo(idx)}
                              className="h10-thumb"
                              style={{
                                border: isActive ? "2px solid #ffffff" : "2px solid rgba(255,255,255,0.3)",
                              }}
                            >
                              {isVideoSlide(slide) ? (
                                <video
                                  src={thumbUrl} muted loop playsInline autoPlay
                                  className="h10-thumb-media"
                                />
                              ) : (
                                <div
                                  className="h10-thumb-media"
                                  style={{ backgroundImage: `url('${thumbUrl}')` }}
                                />
                              )}

                              <div style={{
                                position: "absolute", top: "4px", left: "6px",
                                fontSize: "10px", fontWeight: 600, color: "#fff",
                                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                              }}>
                                {String(idx + 1).padStart(2, "0")}
                              </div>

                              {isActive && (
                                <div style={{
                                  position: "absolute", bottom: 0, left: 0, right: 0,
                                  height: "3px", background: "rgba(255,255,255,0.25)",
                                }}>
                                  <div
                                    ref={(el) => { if (el) progressRef.current = el; }}
                                    style={{ height: "100%", width: "0%", background: "#ffffff" }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="h10-nav-buttons">
                        {[
                          { fn: goPrev, icon: "tji-arrow-left",  label: "Previous" },
                          { fn: goNext, icon: "tji-arrow-right", label: "Next"     },
                        ].map(({ fn, icon, label }) => (
                          <button
                            key={label}
                            onClick={fn}
                            aria-label={`${label} slide`}
                            className="h10-nav-btn"
                          >
                            <i className={icon} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Hero10;