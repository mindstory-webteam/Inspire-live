"use client";
import { useEffect, useState } from "react";
import getALlServices from "@/libs/getALlServices";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard11 from "../cards/ServiceCard11";

/**
 * Map DB service fields → what ServiceCard11 expects:
 *   title      ✓ same
 *   slug       ✓ same
 *   desc       ← shortDesc | description1 | excerpt
 *   iconImage  ← iconImage.url | icon.url | iconImg (string)
 *   iconName   ← iconName (CSS class, e.g. "tji-mortarboard")
 */
function normalizeService(s) {
	return {
		...s,
		desc: s.desc || s.shortDesc || s.description1 || s.excerpt || "",
		iconImage:
			(typeof s.iconImage === "object" ? s.iconImage?.url : s.iconImage) ||
			s.icon?.url ||
			s.iconImg ||
			null,
		iconName: s.iconName || "",
	};
}

const ServicesSlider4 = ({ showOnlyPhD = false, biggerCards = false }) => {
	const [services, setServices] = useState([]);

	useEffect(() => {
		getALlServices()
			.then((all) => {
				const list = Array.isArray(all) ? all : [];
				let filtered;
				if (showOnlyPhD) {
					filtered = list.filter(
						(s) => s.slug === "phd-india" || s.slug === "phd-abroad"
					);
				} else {
					filtered = list.slice(0, 6);
				}
				setServices(filtered.map(normalizeService));
			})
			.catch((err) => console.error("[ServicesSlider4]", err));
	}, [showOnlyPhD]);

	return (
		<Swiper
			slidesPerView={1}
			spaceBetween={15}
			loop={services.length > 1}
			speed={1500}
			autoplay={{ delay: 5000, disableOnInteraction: false }}
			pagination={{ el: ".swiper-pagination-area", clickable: true }}
			breakpoints={{
				768:  { slidesPerView: 1, spaceBetween: 20 },
				992:  { slidesPerView: biggerCards ? 2 : 2, spaceBetween: 30 },
				1200: { slidesPerView: biggerCards ? 2 : 3, spaceBetween: 30 },
				1400: { slidesPerView: biggerCards ? 2 : 3, spaceBetween: biggerCards ? 40 : 30 },
			}}
			modules={[Pagination, Autoplay]}
			className={`h10-service-slider ${biggerCards ? "h10-service-slider-bigger" : ""}`}
		>
			{services.length > 0
				? services.map((service, idx) => (
						<SwiperSlide key={service._id || idx}>
							<ServiceCard11
								service={service}
								idx={idx}
								biggerCard={biggerCards}
							/>
						</SwiperSlide>
				  ))
				: null}
			<div className="swiper-pagination-area"></div>
		</Swiper>
	);
};

export default ServicesSlider4;