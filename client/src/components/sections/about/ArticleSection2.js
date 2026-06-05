"use client";

import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ARTICLE_URL =
  "https://www.timesnownews.com/education/inspire-education-service-indias-premier-phd-guidance-platform-expands-global-footprint-article-112924264/amp";

const CAROUSEL_IMAGES = [
  { src: "/new-imges/about-images/img-1.png", alt: "INSPIRE Education Service" },
  { src: "/new-imges/about-images/img-1.png",            alt: "INSPIRE CEO" },
  { src: "/new-imges/about-images/img-1.png", alt: "INSPIRE Students" },
];

const ARTICLE_META = {
  title:
    "INSPIRE Education Service: India's Premier PhD Guidance Platform Expands Global Footprint",
  description:
    "Founded by Ahammed Farzin in Palakkad, Kerala, INSPIRE has grown from a small guidance initiative into India's No. 1 PhD platform, now trusted by aspiring researchers across 17+ countries — recognised by Times Now News for its outstanding contribution to doctoral education.",
  siteName: "Times Now News",
  publishedDate: "2024-07-15",
  logoUrl: "/new-imges/logo/TNeducation.svg",
};

// ── Source badge ──────────────────────────────────────────────────────────────
function SourceBadge({ siteName, date, logoUrl }) {
  const formatted = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "24px",
      }}
    >
      {/* Logo pill — white background so logo renders in original colors */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "6px",
          padding: "6px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={siteName}
            style={{
              height: "22px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#c0392b", letterSpacing: "0.04em" }}>
            {siteName}
          </span>
        )}
      </div>

      {/* Date chip — red pill */}
      {formatted && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#c0392b",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatted}
        </div>
      )}
    </div>
  );
}

// ── Auto Carousel ─────────────────────────────────────────────────────────────
// Uses a fixed pixel height so the image is always visible — no fill/stretch issues.
const CAROUSEL_HEIGHT = 780; // px — adjust to taste

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setCurrent(i);
    // restart auto-play after manual click
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3800);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3800);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  return (
    <div
      className="about-img-area style-2 wow fadeInRight"
      data-wow-delay=".3s"
      style={{ position: "relative" }}
    >
      {/* ── Carousel frame ── */}
      <div
        className="about-img "
        style={{
          position: "relative",
          width: "100%",
          height: `${CAROUSEL_HEIGHT}px`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(0,0,0,0.15)",
        }}
      >
        {/* Slides */}
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: current === i ? 1 : 0,
              transform: current === i ? "scale(1)" : "scale(1.06)",
              transition: "opacity 0.75s ease, transform 0.75s ease",
              zIndex: current === i ? 1 : 0,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={700}
              height={CAROUSEL_HEIGHT}
              priority={i === 0}
              style={{
                width: "100%",
                height: `${CAROUSEL_HEIGHT}px`,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}

        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Red left-edge accent */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: 0,
            width: "4px",
            height: "76%",
            background: "#1a598a",
            borderRadius: "0 4px 4px 0",
            zIndex: 4,
          }}
        />

        {/* Controls row */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 28px",
          }}
        >
          {/* Counter */}
          <span
            style={{
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {String(current + 1).padStart(2, "0")}
            <span style={{ opacity: 0.4, margin: "0 5px" }}>/</span>
            {String(images.length).padStart(2, "0")}
          </span>

          {/* Dots */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: current === i ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: current === i ? "#1a598a" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.38s ease, background 0.38s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {/* <div
        style={{
          marginTop: "10px",
          height: "3px",
          background: "rgba(0,0,0,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#c0392b",
            borderRadius: "2px",
            width: `${((current + 1) / images.length) * 100}%`,
            transition: "width 0.65s ease",
          }}
        />
      </div> */}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const ArticleSection2 = ({ type }) => {
  const meta = ARTICLE_META;

  return (
    <section className="tj-about-section-2 section-gap section-gap-x">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* ══ LEFT: Article content ══════════════════════════════════════ */}
          <div
            className="col-xl-6 col-lg-6 order-lg-1 order-2"
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
          >
            {/* Heading */}
            <div className={`sec-heading ${type === 2 ? "" : "style-3"}`}>
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i> IN THE NEWS
              </span>

              <h2
                className="sec-title title-anim"
                style={{ marginBottom: "20px" }}
              >
                {type === 2 ? (
                  <>
                    {meta.title.split("Expands")[0]}
                    <span>Expands{meta.title.split("Expands")[1]}</span>
                  </>
                ) : (
                  meta.title
                )}
              </h2>

              <SourceBadge siteName={meta.siteName} date={meta.publishedDate} logoUrl={meta.logoUrl} />

              <p
                className="desc wow fadeInUp"
                data-wow-delay=".4s"
                style={{ marginTop: "4px", marginBottom: 0, lineHeight: "1.9" }}
              >
                {meta.description}
              </p>
            </div>

            {/* Spacer */}
            {/* <div style={{ height: "40px" }} /> */}

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)",
                marginBottom: "40px",
              }}
            />

            {/* Mission / Vision boxes */}
            <div className="about-bottom-area">
              <div
                className="mission-vision-box wow fadeInLeft"
                data-wow-delay=".5s"
              >
                <h4 className="title">Featured In</h4>
                <p className="desc" style={{ lineHeight: "1.8" }}>
                  Times Now News — one of India&apos;s leading national news
                  networks — recognised INSPIRE for its outstanding impact on
                  doctoral education and global research mentorship.
                </p>
              </div>
              <div
                className="mission-vision-box wow fadeInRight"
                data-wow-delay=".55s"
              >
                <h4 className="title">Global Reach</h4>
                <p className="desc" style={{ lineHeight: "1.8" }}>
                  From Palakkad to 17+ countries — INSPIRE&apos;s expanding
                  global footprint speaks for itself, with 24+ batches completed
                  and researchers placed worldwide.
                </p>
              </div>
            </div>

            {/* Spacer */}
            <div style={{ height: "44px" }} />

            {/* Two inline buttons */}
            <div
              className="about-btn-area wow fadeInUp"
              data-wow-delay=".6s"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
                flexWrap: "nowrap",
              }}
            >
              <ButtonPrimary text={"Read Full Article"} url={ARTICLE_URL} />
              <ButtonPrimary text={"About Us"} url={"/about"} />
            </div>
          </div>

          {/* ══ RIGHT: Carousel ════════════════════════════════════════════ */}
          <div className="col-xl-6 col-lg-6 order-lg-2 order-1">
            {/* <ImageCarousel images={CAROUSEL_IMAGES} /> */}
            <div
                            className="about-img-area h10-about-banner wow bounceInRight"
                            data-wow-delay=".3s"
                        >
                            <div className="about-img overflow-hidden">
                                <img
                                    data-speed=".8"
                                    src="/new-imges/ceo/a-3.png"
                                    alt=""
                                />
                            </div>
                        </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArticleSection2;