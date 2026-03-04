"use client";
import EventCard4 from "@/components/shared/cards/EventCard4";
import { getEvents } from "@/utils/eventApi";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Events4 = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getEvents()
			.then((data) => setEvents(data))
			.catch(() => setEvents([]))
			.finally(() => setLoading(false));
	}, []);

	const eventsToShow = events.slice(0, 3);
	const loopedEvents = [...eventsToShow, ...eventsToShow];

	return (
		<section className="tj-project-section-4 section-gap">
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-4 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>Campus Events
							</span>
							<h2 className="sec-title title-anim">
								Breaking Boundaries, Building Dreams.
							</h2>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<div className="project-wrapper wow fadeInUp" data-wow-delay=".5s">

							{/* Loading skeleton */}
							{loading && (
								<div style={{ display: "flex", gap: 24, overflow: "hidden" }}>
									{[...Array(3)].map((_, i) => (
										<div
											key={i}
											style={{
												minWidth: 340,
												height: 420,
												borderRadius: 12,
												background: "#e9ecef",
												animation: "pulse 1.5s ease-in-out infinite",
												flex: "0 0 340px",
											}}
										/>
									))}
								</div>
							)}

							{/* Empty state */}
							{!loading && events.length === 0 && (
								<p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
									No events found.
								</p>
							)}

							{/* Swiper */}
							{!loading && loopedEvents.length > 0 && (
								<Swiper
									slidesPerView={1.2}
									spaceBetween={15}
									loop={true}
									speed={1500}
									centeredSlides={false}
									autoplay={{ delay: 6000 }}
									pagination={{
										el: ".swiper-pagination-area",
										clickable: true,
									}}
									breakpoints={{
										576: { slidesPerView: 1.5, spaceBetween: 20 },
										768: { slidesPerView: 2, spaceBetween: 20 },
										992: { slidesPerView: 2.4, spaceBetween: 30 },
										1200: { slidesPerView: 3, spaceBetween: 30 },
									}}
									modules={[Pagination, Autoplay]}
									className="project-slider-3"
								>
									{loopedEvents.map((event, idx) => (
										<SwiperSlide key={idx}>
											<EventCard4 event={event} />
										</SwiperSlide>
									))}
									<div className="swiper-pagination-area"></div>
								</Swiper>
							)}

						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Events4;