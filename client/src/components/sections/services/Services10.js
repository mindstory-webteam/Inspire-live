"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard11 from "@/components/shared/cards/ServiceCard11";

const API_BASE    = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
  const timerRef = useRef(null);

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

  /* ── 2. Responsive columns ──────────────────────────────────────── */
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setPerView(w < 576 ? 1 : w < 992 ? 2 : 3);
    }
    update();
    setMounted(true);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── 3. Auto-play ───────────────────────────────────────────────── */
  const totalSlides = Math.max(1, services.length - perView + 1);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1 >= totalSlides ? 0 : p + 1)),
      INTERVAL_MS
    );
  }, [totalSlides]);

  useEffect(() => {
    if (services.length === 0) return;
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer, services.length]);

  /* ── 4. Clamp ───────────────────────────────────────────────────── */
  useEffect(() => {
    setCurrent((c) => (c >= totalSlides ? 0 : c));
  }, [totalSlides]);

  const goTo = (i) => { setCurrent(i); resetTimer(); };

  const pct        = 100 / perView;
  const translateX = -(current * pct);

  return (
    <section className="h5-service-section h10-service section-gap">
      <div className="container">

        {/* ── Heading row ── */}
        <div className="row">
          <div className="col-12">
            <div className="sec-heading-wrap style-8">
              <div className="heading-wrap-content">
                <div className="sec-heading style-3">
                  <span
                    className="sub-title wow fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <i className="tji-box" /> Our Solutions
                  </span>
                  {/* force dark colour so it shows on any background */}
                  <h2
                    className="sec-title text-anim"
                    style={{ color: "var(--tj-color-heading, #0a1e2e)" }}
                  >
                    Tailor Business Solutions for Corporates.
                  </h2>
                </div>
                <div className="btn-area wow fadeInUp" data-wow-delay=".8s">
                  <ButtonPrimary text="Explore More" url="/services" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Carousel (only after mount so SSR/hydration match) ── */}
        {mounted && services.length > 0 ? (
          <>
            <div style={{ marginTop: 40, overflow: "hidden" }}>
              <div
                style={{
                  display:    "flex",
                  alignItems: "stretch",
                  willChange: "transform",
                  transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  transform:  `translateX(${translateX}%)`,
                }}
              >
                {services.map((service, idx) => (
                  <div
                    key={service._id || service.slug || idx}
                    style={{
                      flex:      `0 0 ${pct}%`,
                      width:     `${pct}%`,
                      maxWidth:  `${pct}%`,
                      padding:   "0 12px",
                      boxSizing: "border-box",
                      display:   "flex",
                    }}
                  >
                    <ServiceCard11 service={service} idx={idx} biggerCard />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {totalSlides > 1 && (
              <div style={{
                display:        "flex",
                justifyContent: "center",
                gap:            8,
                marginTop:      32,
              }}>
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
          /* Skeleton placeholders — same height as cards, no layout shift */
          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={{
                flex:         "1 1 0",
                height:       360,
                borderRadius: 12,
                background:   "linear-gradient(90deg,#e8f0f7 25%,#d4e2ee 50%,#e8f0f7 75%)",
                backgroundSize: "200% 100%",
                animation:    "shimmer10 1.4s infinite",
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