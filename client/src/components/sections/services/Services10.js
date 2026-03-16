"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import getALlServices from "@/libs/getALlServices";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard11 from "@/components/shared/cards/ServiceCard11";

const FALLBACK = [
  {
    _id: "phd-india",
    slug: "phd-india",
    title: "PhD India",
    shortDescription: "Complete assistance for PhD admissions in India, from university selection to application submission and interview preparation.",
    heroImage: "/new-imges/serives-image/icons/icon-4.png",
  },
  {
    _id: "phd-abroad",
    slug: "phd-abroad",
    title: "PhD Abroad",
    shortDescription: "Specialized guidance for PhD admissions abroad with support for research proposals, funding applications, and supervisor connections.",
    heroImage: "/new-imges/serives-image/icons/icon-5.png",
  },
];

function normalizeService(s) {
  return {
    ...s,
    // ── correct field names from your mongoose schema ──
    desc:      s.shortDescription || s.description1 || s.desc || "",
    heroImage: s.heroImage || "",   // plain Cloudinary URL string per schema
  };
}

const INTERVAL_MS = 4000;

const Services10 = () => {
  const [services, setServices] = useState(FALLBACK);
  const [current, setCurrent]   = useState(0);
  const [perView, setPerView]   = useState(2);
  const intervalRef             = useRef(null);

  /* ── fetch ALL services ── */
  useEffect(() => {
    getALlServices()
      .then((all) => {
        const list = Array.isArray(all) ? all : [];
        console.log("[Services10] raw first item:", list[0]); // debug — check heroImage
        const normalized = list.map(normalizeService);
        if (normalized.length > 0) setServices(normalized);
      })
      .catch((err) => console.error("[Services10]", err));
  }, []);

  /* ── responsive perView ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 576)      setPerView(1);
      else if (w < 992) setPerView(2);
      else              setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = Math.max(1, services.length - perView + 1);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
    }, INTERVAL_MS);
  }, [totalSlides]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  useEffect(() => {
    if (current >= totalSlides) setCurrent(0);
  }, [totalSlides, current]);

  const goTo = (idx) => {
    setCurrent(idx);
    startInterval();
  };

  const cardWidthPct = 100 / perView;
  const translateX   = -(current * cardWidthPct);

  return (
    <section className="h5-service-section h10-service section-gap">
      <div className="container">

        {/* heading */}
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

        {/* carousel track */}
        <div style={{ marginTop: 40, overflow: "hidden" }}>
          <div
            style={{
              display:    "flex",
              alignItems: "stretch",
              transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
              transform:  `translateX(${translateX}%)`,
            }}
          >
            {services.map((service, idx) => (
              <div
                key={service._id || service.slug || idx}
                style={{
                  flex:       `0 0 ${cardWidthPct}%`,
                  width:      `${cardWidthPct}%`,
                  maxWidth:   `${cardWidthPct}%`,
                  padding:    "0 12px",
                  boxSizing:  "border-box",
                  display:    "flex",
                }}
              >
                <ServiceCard11
                  service={service}
                  idx={idx}
                  biggerCard={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
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