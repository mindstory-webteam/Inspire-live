"use client";

import { useEffect, useState } from "react";
import TestimonialsCard2 from "@/components/shared/cards/TestimonialsCard2";
import Ratings1 from "@/components/shared/ratings/Ratings1";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Testimonials2 = ({ type }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ BASE already contains /api — only append /testimonials
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/testimonials`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        setTestimonials((json?.data ?? []).slice(0, 3));
      } catch (err) {
        console.error("Testimonials fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      className={`tj-testimonial-section-2 ${
        type === 2 ? "section-bottom-gap" : "section-gap"
      }`}
    >
      <div className="container">
        <div className="row row-gap-3">

          {/* ── LEFT ── */}
          <div className={`col-lg-6 ${type === 2 ? "order-lg-2" : ""}`}>
            <div className="testimonial-img-area wow fadeInUp" data-wow-delay=".3s">
              <div className="testimonial-img">
                <img data-speed=".8" src="/new-imges/about-images/review-img.png" alt="" />
                <div className="sec-heading style-2">
                  <h2 className={`sec-title ${type === 2 ? "title-anim" : "text-anim"}`}>
                    Hear from Our{" "}
                    <span style={{ color: "white" }}>Customer.</span>
                  </h2>
                </div>
              </div>
              <div className="box-area">
                <div className="rating-box wow fadeInUp" data-wow-delay=".3s">
                  <h2 className="title">4.9</h2>
                  <div className="rating-area"><Ratings1 /></div>
                  <span className="rating-text">(80+ Clients Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className={`col-lg-6 ${type === 2 ? "order-lg-1" : ""}`}>
            <div className="testimonial-wrapper wow fadeInUp" data-wow-delay=".5s">

              {/* Loading */}
              {loading && (
                <div style={{ padding: "40px 0" }}>
                  <style>{`
                    @keyframes shimmer {
                      0%   { background-position: 200% 0 }
                      100% { background-position: -200% 0 }
                    }
                    .sh { height:14px; border-radius:8px; margin-bottom:14px;
                      background: linear-gradient(90deg,#e2e8f0 25%,#cbd5e1 50%,#e2e8f0 75%);
                      background-size:200% 100%; animation:shimmer 1.5s infinite; }
                  `}</style>
                  <div className="sh" style={{ width: "80%" }} />
                  <div className="sh" style={{ width: "95%" }} />
                  <div className="sh" style={{ width: "60%" }} />
                  <div className="sh" style={{ width: "75%", marginTop: 24 }} />
                  <div className="sh" style={{ width: "40%" }} />
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div style={{
                  padding: "16px 20px", marginTop: 24,
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
                }}>
                  <p style={{ color: "#dc2626", fontSize: 13, margin: 0, fontWeight: 600 }}>
                    ⚠ Could not load testimonials.
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: 11, margin: "4px 0 0" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Swiper */}
              {!loading && !error && testimonials.length > 0 && (
                <Swiper
                  spaceBetween={28}
                  slidesPerView={1}
                  loop={true}
                  speed={1500}
                  autoplay={{ delay: 3000 }}
                  pagination={{ el: ".swiper-pagination-area", clickable: true }}
                  navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="testimonial-slider-2"
                >
                  {testimonials.map((testimonial, idx) => (
                    <SwiperSlide key={testimonial._id || idx}>
                      <TestimonialsCard2 testimonial={testimonial} />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-pagination-area"></div>
                </Swiper>
              )}

              {/* Empty */}
              {!loading && !error && testimonials.length === 0 && (
                <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 24 }}>
                  No testimonials available yet.
                </p>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials2;