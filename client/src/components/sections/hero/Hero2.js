"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { useEffect, useRef, useState } from "react";
import { EffectFade, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";

const Hero2 = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [controlledMainSwiper, setControlledMainSwiper] = useState(null);
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);
  const imageTimerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/banner`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.slides) {
          setHeroSlides(res.data.slides.filter((s) => s.isActive));
        }
      })
      .catch((err) => console.error("Failed to fetch banner slides:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.play().catch(() => {});
    });
    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, [heroSlides]);

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const serverBase = (process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com").replace("/api", "");
    return `${serverBase}${url}`;
  };

  if (loading) return null;
  if (!heroSlides.length) return null;

  return (
    <section className="tj-slider-section">
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        slidesPerView={1}
        spaceBetween={0}
        loop={heroSlides.length > 1}
        effect="fade"
        speed={1400}
        modules={[Navigation, EffectFade, Thumbs]}
        thumbs={{ swiper: controlledMainSwiper && !controlledMainSwiper.destroyed ? controlledMainSwiper : null }}
        navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
        className="hero-slider"
        style={{ height: "100vh" }}
        onSlideChange={(swiper) => {
          if (imageTimerRef.current) {
            clearTimeout(imageTimerRef.current);
            imageTimerRef.current = null;
          }
          const realIndex = swiper.realIndex;
          const currentSlide = heroSlides[realIndex];
          if (!currentSlide) return;
          const activeSlide = swiper.slides[swiper.activeIndex];
          if (currentSlide.type === "video") {
            const video = activeSlide?.querySelector("video");
            if (video) { video.currentTime = 0; video.play().catch(() => {}); }
          } else {
            imageTimerRef.current = setTimeout(() => {
              if (swiperRef.current) swiperRef.current.slideNext();
            }, 5000);
          }
        }}
      >
        {heroSlides.map((slide, idx) => (
          <SwiperSlide key={slide._id || idx} className="tj-slider-item" style={{ height: "auto" }}>
            {slide.type === "video" ? (
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                autoPlay muted loop={false} playsInline preload="auto"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                onLoadedData={(e) => e.target.play().catch(() => {})}
                onEnded={() => { if (swiperRef.current) swiperRef.current.slideNext(); }}
              >
                <source src={resolveUrl(slide.mediaUrl)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="slider-bg-image"
                style={{ backgroundImage: `url('${resolveUrl(slide.mediaUrl)}')` }}
              />
            )}

            <div className="container">
              <div className="slider-wrapper">
                <div className="slider-content">
                  {slide.subtitle && (
                    <p className="slider-subtitle" style={{ color: "#ffffff" }}>
                      {slide.subtitle}
                    </p>
                  )}
                  <h1 className="slider-title">{slide.title}</h1>
                  {slide.description && (
                    <div className="slider-desc">{slide.description}</div>
                  )}
                  {slide.buttonText && (
                    <div className="slider-btn">
                      <ButtonPrimary text={slide.buttonText} url={slide.buttonUrl || "/contact"} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="hero-navigation d-inline-flex wow fadeIn" data-wow-delay="1.5s">
          <div className="slider-prev" role="button">
            <span className="anim-icon">
              <i className="tji-arrow-left" /><i className="tji-arrow-left" />
            </span>
          </div>
          <div className="slider-next" role="button">
            <span className="anim-icon">
              <i className="tji-arrow-right" /><i className="tji-arrow-right" />
            </span>
          </div>
        </div>
      </Swiper>

      {heroSlides.length > 1 && (
        <Swiper
          onSwiper={setControlledMainSwiper}
          slidesPerView={3}
          spaceBetween={15}
          loop={false}
          freeMode
          watchSlidesProgress
          modules={[Thumbs]}
          className="hero-thumb wow fadeIn"
          data-wow-delay="2s"
        >
          {heroSlides.map((slide, idx) => {
            const thumbUrl = resolveUrl(slide.thumbUrl || slide.mediaUrl);
            return (
              <SwiperSlide key={slide._id || idx} className="thumb-item">
                {slide.type === "video" ? (
                  <video
                    src={thumbUrl} muted loop playsInline autoPlay
                    style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "80px",
                    backgroundImage: `url('${thumbUrl}')`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    backgroundRepeat: "no-repeat", borderRadius: "4px",
                  }} />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default Hero2;