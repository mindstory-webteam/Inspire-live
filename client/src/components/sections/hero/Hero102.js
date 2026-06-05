"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";
const SLIDE_DURATION = 5000;
const MEDIA_HEIGHT = "520px"; // ← single source of truth for both image & video height

const Hero102 = () => {
  const [slides, setSlides]                 = useState([]);
  const [activeIndex, setActiveIndex]       = useState(0);
  const [nextIndex, setNextIndex]           = useState(null); // pending slide during crossfade
  const [contentVisible, setContentVisible] = useState(true);
  const [mediaFading, setMediaFading]       = useState(false); // drives media crossfade

  const videoRef       = useRef(null);
  const timerRef       = useRef(null);
  const progressRef    = useRef(null);
  const activeIndexRef = useRef(0);
  const transitioning  = useRef(false);

  // ── Fetch slides ──────────────────────────────────────────────────────────
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

  // ── Progress bar ──────────────────────────────────────────────────────────
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

  // ── Navigate with crossfade — no flash ───────────────────────────────────
  const goTo = (idx) => {
    const total = slides.length;
    if (!total || transitioning.current) return;
    const next = ((idx % total) + total) % total;
    if (next === activeIndexRef.current) return;

    transitioning.current = true;
    clearTimeout(timerRef.current);

    // 1. Fade out content
    setContentVisible(false);
    // 2. Start media fade-out
    setMediaFading(true);
    // 3. After fade, swap slide
    setNextIndex(next);

    setTimeout(() => {
      activeIndexRef.current = next;
      setActiveIndex(next);
      setNextIndex(null);
      setMediaFading(false);

      setTimeout(() => {
        setContentVisible(true);
        transitioning.current = false;
      }, 50);
    }, 350); // matches CSS transition duration
  };

  const goNext = () => goTo(activeIndexRef.current + 1);
  const goPrev = () => goTo(activeIndexRef.current - 1);

  // ── On slide change ───────────────────────────────────────────────────────
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

  // ── Active slide data ─────────────────────────────────────────────────────
  const active      = slides[activeIndex] || null;
  const title       = active?.title       || "Ideas That Change the World Start Here";
  const description = active?.description || active?.subtitle || "Recognized by industry leaders, our award-winning team has a proven record of delivering excellence across projects.";
  const subtitle    = active?.subtitle    || "Recognized by industry leaders,";
  const buttonText  = active?.buttonText  || "Get Started";
  const buttonUrl   = active?.buttonUrl   || "/contact";
  const mediaUrl    = active ? resolveUrl(active.mediaUrl) : "";
  const isVideo     = isVideoSlide(active);

  // Shared style for both image & video so they're always the same size
  const mediaStyle = {
    width: "100%",
    height: MEDIA_HEIGHT,
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
        .h10-media-wrap {
          position: relative;
          width: 100%;
          height: ${MEDIA_HEIGHT};
          overflow: hidden;
          background: #0c1e21;
        }
        .h10-media-wrap > .h10-media-item {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.35s ease;
        }
        .h10-media-wrap > .h10-media-item.fade-out {
          opacity: 0;
        }
        .h10-media-wrap > .h10-media-item.fade-in {
          opacity: 1;
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
                    fontSize: "clamp(16px, 4vw, 30px)",
                  }}
                >
                  {subtitle}
                </p>

                <h1
                  className={`banner-title text-anim h10-content-fade ${contentVisible ? "visible" : "hidden"}`}
                  key={activeIndex}
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

                {/* Fixed-height wrapper — image & video fill it identically */}
                <div className="h10-media-wrap">

                  {/* Current slide — fades out during transition */}
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

                  {/* ── Navigation overlay (2+ slides only) ── */}
                  {slides.length > 1 && (
                    <div style={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0,
                      zIndex: 10,
                      padding: "16px 24px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                    }}>

                      {/* Thumbnail strip */}
                      <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                        {slides.map((slide, idx) => {
                          const thumbUrl = resolveUrl(slide.mediaUrl || slide.thumbUrl);
                          const isActive = idx === activeIndex;
                          return (
                            <div
                              key={slide._id || idx}
                              onClick={() => goTo(idx)}
                              style={{
                                position: "relative",
                                width: "110px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                overflow: "hidden",
                                border: isActive ? "2px solid #ffffff" : "2px solid rgba(255,255,255,0.3)",
                                transition: "border-color 0.3s ease",
                                flexShrink: 0,
                              }}
                            >
                              {isVideoSlide(slide) ? (
                                <video
                                  src={thumbUrl} muted loop playsInline autoPlay
                                  style={{ width: "100%", height: "68px", objectFit: "cover", display: "block" }}
                                />
                              ) : (
                                <div style={{
                                  width: "100%",
                                  height: "68px",
                                  backgroundImage: `url('${thumbUrl}')`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }} />
                              )}

                              <div style={{
                                position: "absolute", top: "4px", left: "6px",
                                fontSize: "10px", fontWeight: 600, color: "#fff",
                                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                              }}>
                                {String(idx + 1).padStart(2, "0")}
                              </div>

                              {/* Progress bar — callback ref keeps it live */}
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

                      {/* Prev / Next buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {[
                          { fn: goPrev, icon: "tji-arrow-left",  label: "Previous" },
                          { fn: goNext, icon: "tji-arrow-right", label: "Next"     },
                        ].map(({ fn, icon, label }) => (
                          <button
                            key={label}
                            onClick={fn}
                            aria-label={`${label} slide`}
                            style={{
                              width: "40px", height: "40px", borderRadius: "50%",
                              border: "1px solid rgba(255,255,255,0.5)",
                              background: "rgba(0,0,0,0.35)", color: "#fff",
                              cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center",
                              backdropFilter: "blur(4px)", transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.35)"}
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

export default Hero102;