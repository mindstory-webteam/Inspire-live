"use client";
import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { useEffect, useState, useCallback } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ServicesCarousel = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res  = await fetch(API_BASE + "/services", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed: " + res.status);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error("ServicesCarousel:", err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchServices();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchServices]);

  return (
    <div className="tj-service-section service-4 section-gap">
      <style>{`
        /* ── equal height slides ── */
        .services-carousel .swiper-wrapper {
          align-items: stretch;
        }
        .services-carousel .swiper-slide {
          height: auto !important;
          display: flex;
        }
        /* make ServiceCard4 fill full slide height */
        .services-carousel .swiper-slide > * {
          width: 100%;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        /* push Read More to bottom inside cards */
        .services-carousel .swiper-slide .sc4-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .services-carousel .swiper-slide .sc4-card .service-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .services-carousel .swiper-slide .sc4-card .sc4-btn {
          margin-top: auto;
        }

        /* ── pagination dots ── */
        .services-carousel .swiper-pagination {
          position: relative;
          margin-top: 32px;
          bottom: auto;
        }
        .services-carousel .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          transition: all .25s;
        }
        .services-carousel .swiper-pagination-bullet-active {
          background: #1a598a;
          width: 28px;
          border-radius: 5px;
        }

        /* ── card hover ── */
        .sc4-card { transition: transform .25s ease, box-shadow .25s ease; }
        .sc4-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(26,89,138,.14) !important; }
        .sc4-card:hover img { transform: scale(1.05); }
        .sc4-btn:hover { gap: 6px; color: #0f3d62 !important; }

        /* ── skeleton ── */
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skeleton {
          background: linear-gradient(90deg,#f0f4f8 25%,#e8eef4 50%,#f0f4f8 75%);
          background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 16px; height: 340px;
        }
      `}</style>

      <div className="container">

        {/* ── Heading row ── */}
        <div className="row align-items-center" style={{ marginBottom: 40 }}>
          <div className="col-lg-8 col-md-7">
            <div className="sec-heading style-3">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i> Our Solutions
              </span>
              <h2 className="sec-title text-anim wow fadeInUp" data-wow-delay=".4s">
                Tailor Business Solutions<br />for Corporates.
              </h2>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-5 d-flex justify-content-md-end justify-content-start mt-3 mt-md-0 wow fadeInUp"
            data-wow-delay=".5s"
          >
            <ButtonPrimary text="Explore More" url="/services" />
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="row row-gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <p style={{ textAlign: "center", color: "#e53e3e", padding: "60px 0" }}>{error}</p>
        )}

        {/* ── Empty ── */}
        {!loading && !error && items.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", padding: "60px 0" }}>No services found.</p>
        )}

        {/* ── Carousel ── */}
        {!loading && !error && items.length > 0 && (
          <Swiper
            className="services-carousel"
            slidesPerView={1}
            spaceBetween={24}
            loop={items.length > 3}
            speed={800}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            breakpoints={{
              576:  { slidesPerView: 1, spaceBetween: 20 },
              768:  { slidesPerView: 2, spaceBetween: 24 },
              1200: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {items.map((item, idx) => (
              <SwiperSlide key={item._id || item.id}>
                <ServiceCard4 service={item} idx={idx} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </div>
  );
};

export default ServicesCarousel;