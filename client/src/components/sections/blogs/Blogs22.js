"use client";
import { useEffect, useState } from "react";
import BlogCard2 from "@/components/shared/cards/BlogCard2";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";

var Blogs22 = function () {
  var blogsState = useState([]);
  var blogs = blogsState[0];
  var setBlogs = blogsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  useEffect(function () {
    fetch(API_BASE_URL + "/blogs?limit=4&isPublished=true", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var list = Array.isArray(d) ? d : (d.blogs || d.data || []);
        setBlogs(list.slice(0, 4));
      })
      .catch(function () {})
      .finally(function () { setLoading(false); });
  }, []);

  return (
    <section className="tj-blog-section-2 section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-heading-wrap">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                Read Blogs
              </span>
              <div className="heading-wrap-content">
                <div className="sec-heading style-2">
                  <h2 className="sec-title text-anim">
                    Strategies and <span>Insights.</span>
                  </h2>
                </div>
                <div className="wow fadeInUp" data-wow-delay=".5s">
                  <p className="desc">
                    Developing personalized customer journeys to increase
                    satisfaction and loyalty.
                  </p>
                </div>
                <div
                  className="slider-navigation d-none d-md-inline-flex wow fadeInUp"
                  data-wow-delay=".7s"
                >
                  <div className="slider-prev" role="button">
                    <span className="anim-icon">
                      <i className="tji-arrow-left"></i>
                      <i className="tji-arrow-left"></i>
                    </span>
                  </div>
                  <div className="slider-next" role="button">
                    <span className="anim-icon">
                      <i className="tji-arrow-right"></i>
                      <i className="tji-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="blog-wrapper wow fadeIn" data-wow-delay=".5s">

              {loading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
                  {[1, 2].map(function (i) {
                    return (
                      <div key={i} style={{
                        height: 340,
                        borderRadius: 16,
                        background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                      }} />
                    );
                  })}
                  <style>{"@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}"}</style>
                </div>
              )}

              {!loading && blogs.length > 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={15}
                  loop={true}
                  speed={1500}
                  loopAdditionalSlides={1}
                  autoplay={{ delay: 5000 }}
                  pagination={{ el: ".swiper-pagination-area", clickable: true }}
                  navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
                  breakpoints={{
                    768: { spaceBetween: 20, slidesPerView: 1 },
                    992: { slidesPerView: 2, spaceBetween: 20 },
                    1200: { slidesPerView: 2, spaceBetween: 30 },
                  }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="blog-slider"
                >
                  {blogs.map(function (blog, idx) {
                    return (
                      <SwiperSlide key={blog._id || idx}>
                        <BlogCard2 blog={blog} idx={idx} />
                      </SwiperSlide>
                    );
                  })}
                  <div className="swiper-pagination-area"></div>
                </Swiper>
              )}

              {!loading && blogs.length === 0 && (
                <p style={{ textAlign: "center", color: "#67787a", padding: "40px 0" }}>
                  No blog posts found.
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs22;