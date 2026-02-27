"use client";

import { useState, useEffect, useCallback } from "react";
import { getEvents } from "@/utils/eventApi";

const EVENTS_PER_PAGE = 6;

const UniversityEventsMagazine = () => {
	const [activeCategory, setActiveCategory] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [allEvents, setAllEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// ─── Fetch via eventApi utility ──────────────────────────────────────────
	const fetchEvents = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// getEvents() handles BASE_URL + query params internally
			const raw = await getEvents(
				activeCategory !== "all" ? { type: activeCategory } : {}
			);

			// Sort newest first (backend already does this, but guard client-side too)
			const sorted = [...raw].sort((a, b) => {
				const da = a.createdAt ? new Date(a.createdAt) : 0;
				const db = b.createdAt ? new Date(b.createdAt) : 0;
				return db - da;
			});

			setAllEvents(sorted);
		} catch (err) {
			setError(err.message || "Failed to load events");
		} finally {
			setLoading(false);
		}
	}, [activeCategory]);

	useEffect(() => {
		fetchEvents();
		setCurrentPage(1);
	}, [fetchEvents]);

	// ─── Pagination ──────────────────────────────────────────────────────────
	const totalPages = Math.max(1, Math.ceil(allEvents.length / EVENTS_PER_PAGE));
	const safePage = Math.min(currentPage, totalPages);
	const pageStart = (safePage - 1) * EVENTS_PER_PAGE;
	const displayEvents = allEvents.slice(pageStart, pageStart + EVENTS_PER_PAGE);

	// ─── Category filters: fixed + dynamic from real data ────────────────────
	const fixedCategories = [
		{ categoryId: "all",        categoryLabel: "All Events"  },
		{ categoryId: "conference", categoryLabel: "Conferences" },
		{ categoryId: "festival",   categoryLabel: "Festivals"   },
		{ categoryId: "sports",     categoryLabel: "Sports"      },
		{ categoryId: "career",     categoryLabel: "Career"      },
	];

	const extraTypes = Array.from(
		new Set(allEvents.map((e) => e.eventType).filter(Boolean))
	).filter((t) => !fixedCategories.some((c) => c.categoryId === t));

	const categoryFilters = [
		...fixedCategories,
		...extraTypes.map((t) => ({
			categoryId: t,
			categoryLabel: t.charAt(0).toUpperCase() + t.slice(1),
		})),
	];

	const handleCategoryChange = (id) => {
		setActiveCategory(id);
		setCurrentPage(1);
	};

	// ─── Smart page number list ───────────────────────────────────────────────
	const buildPageNumbers = () => {
		const items = [];
		for (let pg = 1; pg <= totalPages; pg++) {
			const isEdge = pg === 1 || pg === totalPages;
			const isNear = Math.abs(pg - safePage) <= 1;
			if (isEdge || isNear) {
				items.push({ type: "page", pg });
			} else if (pg === 2 || pg === totalPages - 1) {
				items.push({ type: "ellipsis", pg });
			}
		}
		return items.filter(
			(item, i, arr) => !(item.type === "ellipsis" && arr[i - 1]?.type === "ellipsis")
		);
	};

	return (
		<>
			<style jsx>{`
				.magazine-wrapper {
					background: #ecf0f0;
					padding-bottom: 100px;
					margin-bottom: 100px;
					position: relative;
					padding-top: 60px;
					overflow: hidden;
				}

				.magazine-wrapper::before {
					content: '';
					position: absolute;
					top: -10%;
					right: -5%;
					width: 500px;
					height: 500px;
					background: radial-gradient(circle, rgba(158,211,251,0.15) 0%, transparent 70%);
					border-radius: 50%;
					pointer-events: none;
				}

				.magazine-wrapper::after {
					content: '';
					position: absolute;
					bottom: -10%;
					left: -5%;
					width: 600px;
					height: 600px;
					background: radial-gradient(circle, rgba(26,89,138,0.08) 0%, transparent 70%);
					border-radius: 50%;
					pointer-events: none;
				}

				.magazine-container {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 40px;
					position: relative;
					z-index: 1;
				}

				.filter-section {
					display: flex;
					justify-content: center;
					gap: 12px;
					margin-bottom: 60px;
					flex-wrap: wrap;
					animation: fadeInUp 0.8s ease-out 0.2s both;
				}

				.filter-button {
					padding: 12px 28px;
					background: #ffffff;
					border: 2px solid #ecf0f0;
					border-radius: 50px;
					font-size: 14px;
					font-weight: 600;
					color: #67787a;
					cursor: pointer;
					transition: all 0.3s ease;
					text-transform: uppercase;
					letter-spacing: 1px;
				}

				.filter-button:hover {
					border-color: #1a598a;
					color: #1a598a;
					background: rgba(158,211,251,0.1);
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(26,89,138,0.15);
				}

				.filter-button.active {
					background: #1a598a;
					color: #ffffff;
					border-color: #1a598a;
					box-shadow: 0 4px 16px rgba(26,89,138,0.3);
				}

				.state-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					min-height: 320px;
					gap: 16px;
				}

				.spinner {
					width: 48px;
					height: 48px;
					border: 4px solid #9ed3fb;
					border-top-color: #1a598a;
					border-radius: 50%;
					animation: spin 0.8s linear infinite;
				}

				.state-text {
					font-size: 18px;
					color: #1a425c;
					font-weight: 600;
				}

				.retry-btn {
					padding: 10px 28px;
					background: #1a598a;
					color: #fff;
					border: none;
					border-radius: 50px;
					font-size: 14px;
					font-weight: 700;
					cursor: pointer;
					letter-spacing: 1px;
					text-transform: uppercase;
					transition: background 0.3s;
				}

				.retry-btn:hover { background: #0c3a5e; }

				.events-masonry {
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					gap: 20px;
					grid-auto-rows: 280px;
				}

				.event-card {
					position: relative;
					border-radius: 16px;
					overflow: hidden;
					cursor: pointer;
					animation: fadeIn 0.8s ease-out both;
					box-shadow: 0 4px 20px rgba(12,30,33,0.08);
					transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
				}

				.event-card:hover {
					box-shadow: 0 12px 40px rgba(12,30,33,0.15);
					transform: translateY(-8px);
				}

				.event-card:nth-child(1) { grid-column: span 7; grid-row: span 2; }
				.event-card:nth-child(2) { grid-column: span 5; }
				.event-card:nth-child(3) { grid-column: span 5; }
				.event-card:nth-child(4) { grid-column: span 4; }
				.event-card:nth-child(5) { grid-column: span 4; }
				.event-card:nth-child(6) { grid-column: span 4; }

				.card-image-wrapper {
					position: relative;
					width: 100%;
					height: 100%;
					overflow: hidden;
					background: linear-gradient(135deg, #9ed3fb 0%, #1a598a 100%);
				}

				.card-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.8s cubic-bezier(0.4,0,0.2,1);
					opacity: 0.9;
				}

				.event-card:hover .card-image { transform: scale(1.1); opacity: 0.75; }

				.card-overlay {
					position: absolute;
					inset: 0;
					background: linear-gradient(to top, rgba(12,30,33,0.95) 0%, rgba(12,30,33,0.4) 50%, transparent 100%);
					padding: 32px;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					transition: all 0.5s ease;
				}

				.event-card:hover .card-overlay {
					background: linear-gradient(to top, rgba(12,30,33,0.98) 0%, rgba(12,30,33,0.6) 70%, rgba(12,30,33,0.2) 100%);
				}

				.event-card:nth-child(1) .card-overlay { padding: 40px; }

				.card-badges {
					position: absolute;
					top: 24px;
					left: 24px;
					display: flex;
					gap: 8px;
					z-index: 2;
				}

				.type-badge {
					padding: 6px 16px;
					background: #ffffff;
					color: #0c1e21;
					border-radius: 50px;
					font-size: 10px;
					font-weight: 800;
					text-transform: uppercase;
					letter-spacing: 1.2px;
					box-shadow: 0 4px 12px rgba(0,0,0,0.15);
				}

				.featured-badge {
					padding: 6px 16px;
					background: #1a598a;
					color: #ffffff;
					border-radius: 50px;
					font-size: 10px;
					font-weight: 800;
					text-transform: uppercase;
					letter-spacing: 1.2px;
					box-shadow: 0 4px 12px rgba(26,89,138,0.4);
					animation: pulse 2s ease-in-out infinite;
				}

				.card-content {
					transform: translateY(0);
					transition: transform 0.5s ease;
					position: relative;
					z-index: 1;
				}

				.event-card:hover .card-content { transform: translateY(-8px); }

				.card-tagline {
					font-size: 11px;
					color: #9ed3fb;
					font-weight: 700;
					margin-bottom: 8px;
					text-transform: uppercase;
					letter-spacing: 1.5px;
				}

				.card-title {
					font-size: 24px;
					font-weight: 900;
					color: #ffffff;
					margin-bottom: 10px;
					line-height: 1.2;
					letter-spacing: -0.5px;
				}

				.event-card:nth-child(1) .card-title { font-size: 42px; margin-bottom: 14px; }

				.card-description {
					font-size: 15px;
					color: rgba(255,255,255,0.85);
					line-height: 1.5;
					margin-bottom: 16px;
					opacity: 0;
					transform: translateY(10px);
					transition: all 0.5s ease 0.1s;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.event-card:nth-child(1) .card-description { -webkit-line-clamp: 3; max-width: 90%; }

				.event-card:hover .card-description { opacity: 1; transform: translateY(0); }

				.card-meta { display: flex; gap: 20px; flex-wrap: wrap; }

				.meta-item {
					display: flex;
					align-items: center;
					gap: 6px;
					font-size: 13px;
					color: rgba(255,255,255,0.8);
					font-weight: 600;
				}

				.meta-icon { width: 16px; height: 16px; color: #9ed3fb; flex-shrink: 0; }

				/* ── Pagination ──────────────────────────────── */
				.pagination {
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 8px;
					margin-top: 56px;
					flex-wrap: wrap;
					animation: fadeInUp 0.6s ease-out both;
				}

				.page-btn {
					width: 44px;
					height: 44px;
					border-radius: 50%;
					border: 2px solid #d4dfe0;
					background: #ffffff;
					color: #1a425c;
					font-size: 14px;
					font-weight: 700;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.25s ease;
					flex-shrink: 0;
				}

				.page-btn:hover:not(:disabled) {
					border-color: #1a598a;
					color: #1a598a;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(26,89,138,0.15);
				}

				.page-btn.active {
					background: #1a598a;
					border-color: #1a598a;
					color: #ffffff;
					box-shadow: 0 4px 16px rgba(26,89,138,0.3);
				}

				.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
				.page-btn.arrow { font-size: 20px; }

				.page-ellipsis {
					width: 44px;
					height: 44px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 16px;
					color: #67787a;
					font-weight: 700;
				}

				.page-info {
					font-size: 13px;
					color: #67787a;
					font-weight: 600;
					margin-left: 12px;
				}

				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(30px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(30px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes pulse {
					0%,100% { box-shadow: 0 4px 12px rgba(26,89,138,0.4); }
					50%     { box-shadow: 0 4px 20px rgba(26,89,138,0.6); }
				}
				@keyframes spin { to { transform: rotate(360deg); } }

				@media (max-width: 1200px) {
					.events-masonry { grid-template-columns: repeat(6, 1fr); grid-auto-rows: 260px; }
					.event-card:nth-child(1) { grid-column: span 6; grid-row: span 2; }
					.event-card:nth-child(2), .event-card:nth-child(3) { grid-column: span 3; }
					.event-card:nth-child(4), .event-card:nth-child(5), .event-card:nth-child(6) { grid-column: span 2; }
				}

				@media (max-width: 768px) {
					.magazine-container { padding: 0 20px; }
					.filter-section { margin-bottom: 40px; }
					.events-masonry { grid-template-columns: 1fr; gap: 16px; grid-auto-rows: auto; }
					.event-card:nth-child(n) { grid-column: span 1; grid-row: span 1; }
					.card-image-wrapper { min-height: 320px; }
					.card-title, .event-card:nth-child(1) .card-title { font-size: 24px; }
					.card-overlay, .event-card:nth-child(1) .card-overlay { padding: 24px; }
					.card-badges { top: 16px; left: 16px; }
					.card-description { -webkit-line-clamp: 2; }
					.event-card:nth-child(1) .card-description { max-width: 100%; }
				}

				@media (max-width: 480px) {
					.magazine-wrapper { padding-bottom: 60px; margin-bottom: 60px; }
					.filter-button { padding: 10px 20px; font-size: 12px; }
					.card-image-wrapper { min-height: 280px; }
					.card-title { font-size: 20px; }
					.page-btn { width: 38px; height: 38px; font-size: 13px; }
				}
			`}</style>

			<section className="magazine-wrapper">
				<div className="magazine-container">

					{/* Filters */}
					<div className="filter-section">
						{categoryFilters.map((filter) => (
							<button
								key={filter.categoryId}
								className={`filter-button ${activeCategory === filter.categoryId ? "active" : ""}`}
								onClick={() => handleCategoryChange(filter.categoryId)}
							>
								{filter.categoryLabel}
							</button>
						))}
					</div>

					{/* Loading */}
					{loading && (
						<div className="state-box">
							<div className="spinner" />
							<p className="state-text">Loading events…</p>
						</div>
					)}

					{/* Error */}
					{!loading && error && (
						<div className="state-box">
							<p className="state-text" style={{ color: "#c0392b" }}>{error}</p>
							<button className="retry-btn" onClick={fetchEvents}>Try Again</button>
						</div>
					)}

					{/* Empty */}
					{!loading && !error && allEvents.length === 0 && (
						<div className="state-box">
							<p className="state-text">No events found for this category.</p>
						</div>
					)}

					{/* Grid + Pagination */}
					{!loading && !error && displayEvents.length > 0 && (
						<>
							<div className="events-masonry">
								{displayEvents.map((event, index) => {
									const imgSrc =
										event.eventImage?.url ||
										(typeof event.eventImage === "string" ? event.eventImage : null) ||
										"/images/events/default-event.webp";

									return (
										<div
											key={event._id ?? event.id ?? index}
											className="event-card"
											style={{ animationDelay: `${index * 0.1}s` }}
										>
											<div className="card-image-wrapper">
												<img src={imgSrc} alt={event.eventTitle} className="card-image" />

												<div className="card-badges">
													<span className="type-badge">{event.eventType}</span>
													{event.eventStatus === "featured" && (
														<span className="featured-badge">Featured</span>
													)}
												</div>

												<div className="card-overlay">
													<div className="card-content">
														{event.tagline && <p className="card-tagline">{event.tagline}</p>}
														<h3 className="card-title">{event.eventTitle}</h3>
														<p className="card-description">{event.eventBrief}</p>
														<div className="card-meta">
															{event.eventDate && (
																<div className="meta-item">
																	<svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
																	</svg>
																	{event.eventDate}
																</div>
															)}
															{event.eventVenue && (
																<div className="meta-item">
																	<svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
																	</svg>
																	{event.eventVenue}
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="pagination">
									<button
										className="page-btn arrow"
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={safePage === 1}
										aria-label="Previous"
									>‹</button>

									{buildPageNumbers().map((item, i) =>
										item.type === "ellipsis" ? (
											<span key={`e${i}`} className="page-ellipsis">…</span>
										) : (
											<button
												key={item.pg}
												className={`page-btn ${safePage === item.pg ? "active" : ""}`}
												onClick={() => setCurrentPage(item.pg)}
											>
												{item.pg}
											</button>
										)
									)}

									<button
										className="page-btn arrow"
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
										disabled={safePage === totalPages}
										aria-label="Next"
									>›</button>

									<span className="page-info">{safePage} / {totalPages}</span>
								</div>
							)}
						</>
					)}

				</div>
			</section>
		</>
	);
};

export default UniversityEventsMagazine;