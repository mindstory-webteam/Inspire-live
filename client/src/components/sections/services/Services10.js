"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard11 from "@/components/shared/cards/ServiceCard11";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const INTERVAL_MS = 4000;

const SERVER_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api$/, "");

function getImageSrc(src) {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  return `${SERVER_BASE}${src}`;
}

function normalizeService(s) {
  return {
    ...s,
    desc: s.shortDescription || s.description1 || s.desc || "",
    heroImage: getImageSrc(s.heroImage || s.iconImage || s.image || null) || "",
  };
}

const Services10 = () => {
  const [services, setServices] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [perView, setPerView]   = useState(3);
  const [ready, setReady]       = useState(false);
  const intervalRef             = useRef(null);

  // ── Fetch services directly — no getALlServices() ────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/services`, { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || data.services || [];
        setServices(list.map(normalizeService));
      })
      .catch((err) => console.error("[Services10]", err));
  }, []);

  // ── Responsive perView — only run client side ─────────────────────────────
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 576)      setPerView(1);
      else if (w < 992) setPerView(2);
      else              setPerView(3);
      setReady(true);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = Math.max(1, services.length - perView + 1);

  // ── Auto-play interval ────────────────────────────────────────────────────
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
    }, INTERVAL_MS);
  }, [totalSlides]);

  useEffect(() => {
    if (services.length === 0) return;
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval, services.length]);

  // ── Clamp current if slides shrink ───────────────────────────────────────
  useEffect(() => {
    if (current >= totalSlides) setCurrent(0);
  }, [totalSlides, current]);

  const goTo = (idx) => {
    setCurrent(idx);
    startInterval();
  };

  const cardWidthPct = 100 / perView;
  const translateX   = -(current * cardWidthPct);

  // Don't render carousel until client-side perView is known (prevents flash)
  if (!ready || services.length === 0) return null;

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
                    <i className="tji-box"></i> Our Solutions
                  </span>
                  <h2 className="sec-title text-anim">
                    Tailor Business Solutions for Corporates.
                  </h2>
                </div>
                <div className="btn-area wow fadeInUp" data-wow-delay=".8s">
                  <ButtonPrimary text={"Explore More"} url={"/services"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel — will-change prevents repaint glitch */}
        <div style={{ marginTop: 40, overflow: "hidden" }}>
          <div
            style={{
              display:        "flex",
              alignItems:     "stretch",
              transition:     "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
              transform:      `translateX(${translateX}%)`,
              willChange:     "transform",
            }}
          >
            {services.map((service, idx) => (
              <div
                key={service._id || service.slug || idx}
                style={{
                  flex:      `0 0 ${cardWidthPct}%`,
                  width:     `${cardWidthPct}%`,
                  maxWidth:  `${cardWidthPct}%`,
                  padding:   "0 12px",
                  boxSizing: "border-box",
                  display:   "flex",
                }}
              >
                <ServiceCard11 service={service} idx={idx} biggerCard={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {totalSlides > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
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

      </div>
    </section>
  );
};

export default Services10;