"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard11 from "@/components/shared/cards/ServiceCard11";

const API_BASE    = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";
const SERVER_BASE = API_BASE.replace(/\/api$/, "");
const INTERVAL_MS = 4000;

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  return `${SERVER_BASE}${src}`;
}

function normalize(s) {
  return {
    ...s,
    desc:      s.shortDescription || s.description1 || s.desc || "",
    heroImage: resolveImage(s.heroImage || s.iconImage || s.image || ""),
  };
}

export default function Services10() {
  const [services, setServices] = useState([]);
  const [current,  setCurrent]  = useState(0);
  const [perView,  setPerView]  = useState(3);
  const [mounted,  setMounted]  = useState(false);

  const timerRef     = useRef(null);
  const currentRef   = useRef(0);   // avoid stale closure in interval
  const isAnimating  = useRef(false);

  /* ── 1. Fetch ───────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/services`, { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((data) => {
        if (cancelled) return;
        const raw = Array.isArray(data) ? data : (data.data || data.services || []);
        setServices(raw.map(normalize));
      })
      .catch((e) => console.error("[Services10]", e));
    return () => { cancelled = true; };
  }, []);

  /* ── 2. Responsive columns — debounced to prevent mid-resize flicker ── */
  useEffect(() => {
    let rafId;
    function update() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;
        setPerView(w < 576 ? 1 : w < 992 ? 2 : 3);
      });
    }
    update();
    setMounted(true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── 3. Derived values — stable, no extra renders ───────────────── */
  const totalSlides = Math.max(1, services.length - perView + 1);

  /* ── 4. Auto-play — only restarts when totalSlides actually changes ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = currentRef.current + 1 >= totalSlides ? 0 : currentRef.current + 1;
      currentRef.current = next;
      // block new ticks while CSS transition is running (600ms)
      if (isAnimating.current) return;
      isAnimating.current = true;
      setCurrent(next);
      setTimeout(() => { isAnimating.current = false; }, 650);
    }, INTERVAL_MS);
  }, [totalSlides]);

  useEffect(() => {
    if (services.length === 0) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer, services.length]);

  /* ── 5. Clamp on resize ─────────────────────────────────────────── */
  useEffect(() => {
    setCurrent((c) => {
      const clamped = c >= totalSlides ? 0 : c;
      currentRef.current = clamped;
      return clamped;
    });
  }, [totalSlides]);

  const goTo = (i) => {
    if (isAnimating.current) return;          // ignore clicks mid-transition
    isAnimating.current = true;
    currentRef.current  = i;
    setCurrent(i);
    startTimer();
    setTimeout(() => { isAnimating.current = false; }, 650);
  };

  /* ── 6. Use px-based translation via CSS custom property ────────── */
  //   translateX in % causes layout recalculation every frame.
  //   We let CSS handle the math with a custom property instead.
  const pct        = 100 / perView;
  const translateX = -(current * pct);

  return (
    <section className="h5-service-section h10-service section-gap">
      <div className="container">

        {/* Heading */}
        <div className="row">
          <div className="col-12">
            <div className="sec-heading-wrap style-8">
              <div className="heading-wrap-content">
                <div className="sec-heading style-3">
                  <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                    <i className="tji-box" /> Our Solutions
                  </span>
                  <h2
                    className="sec-title text-anim"
                    style={{ color: "var(--tj-color-heading, #0a1e2e)" }}
                  >
                    Complete PhD Assistance in Kerala - Every Step, Every Stage
                  </h2>
                </div>
                <div className="btn-area wow fadeInUp" data-wow-delay=".8s">
                  <ButtonPrimary text="Explore More" url="/services" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        {mounted && services.length > 0 ? (
          <>
            <style>{`
              .s10-track {
                display: flex;
                align-items: stretch;
                /* GPU-composited — no layout recalc on every frame */
                will-change: transform;
                transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .s10-slide {
                flex-shrink: 0;
                box-sizing: border-box;
                padding: 0 12px;
                display: flex;
              }
            `}</style>

            <div style={{ marginTop: 40, overflow: "hidden" }}>
              <div
                className="s10-track"
                style={{ transform: `translateX(${translateX}%)` }}
              >
                {services.map((service, idx) => (
                  <div
                    key={service._id || service.slug || idx}
                    className="s10-slide"
                    style={{ width: `${pct}%` }}
                  >
                    <ServiceCard11 service={service} idx={idx} biggerCard />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {totalSlides > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
                {Array.from({ length: totalSlides }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      width:        i === current ? 24 : 8,
                      height:       8,
                      borderRadius: 4,
                      border:       "none",
                      cursor:       "pointer",
                      padding:      0,
                      background:   i === current
                        ? "var(--tj-color-theme-primary, #015599)"
                        : "#c0d5e8",
                      transition: "width 0.3s ease, background 0.3s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Skeleton */
          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={{
                flex:           "1 1 0",
                height:         360,
                borderRadius:   12,
                background:     "linear-gradient(90deg,#e8f0f7 25%,#d4e2ee 50%,#e8f0f7 75%)",
                backgroundSize: "200% 100%",
                animation:      "shimmer10 1.4s infinite",
              }} />
            ))}
            <style>{`
              @keyframes shimmer10 {
                0%   { background-position: 200% 0 }
                100% { background-position: -200% 0 }
              }
            `}</style>
          </div>
        )}

      </div>
    </section>
  );
}