"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Fake brand data inline (replace getBrands import)
const fakeBrands = [
  { img: "/new-imges/flags/f-1.jpg", name: "TechNova" },
  { img: "/new-imges/flags/f-2.jpg", name: "Axiom" },
  { img: "/new-imges/flags/f-3.jpg", name: "Luminary" },
  { img: "/new-imges/flags/f-4.jpg", name: "Vortex" },
  { img: "/new-imges/flags/f-5.jpg", name: "Pinnacle" },
  { img: "/new-imges/flags/f-1.jpg", name: "Nexus" },
  { img: "/new-imges/flags/f-2.jpg", name: "Orbis" },
  { img: "/new-imges/flags/f-3.jpg", name: "Stratix" },
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