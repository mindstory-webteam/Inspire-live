"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Fake brand data inline (replace getBrands import)
const fakeBrands = [
  { img: "/images/brands/brand-1.webp", name: "TechNova" },
  { img: "/images/brands/brand-2.webp", name: "Axiom" },
  { img: "/images/brands/brand-3.webp", name: "Luminary" },
  { img: "/images/brands/brand-4.webp", name: "Vortex" },
  { img: "/images/brands/brand-5.webp", name: "Pinnacle" },
  { img: "/images/brands/brand-6.webp", name: "Nexus" },
  { img: "/images/brands/brand-7.webp", name: "Orbis" },
  { img: "/images/brands/brand-8.webp", name: "Stratix" },
];

const BrandSlider1 = ({ className, brands: propBrands }) => {
  // Use passed brands prop, else fall back to fake data
  const brands = propBrands?.length ? propBrands : fakeBrands;

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={0}
      freeMode={true}
      centeredSlides={true}
      loop={true}
      speed={5000}
      allowTouchMove={false}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      className={`client-slider ${className ? className : "client-slider-1"}`}
      modules={[Autoplay]}
    >
      {brands.map(({ img, name }, idx) => (
        <SwiperSlide key={idx} className="client-item">
          <div className="client-logo">
            <img
              src={img ? img : "/images/brands/brand-1.webp"}
              alt={name || "Brand"}
              title={name || "Brand"}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BrandSlider1;