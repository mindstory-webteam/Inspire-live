"use client";
import { useState, useEffect } from "react";
import CareerCard from "@/components/shared/cards/CareerCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const Careers1 = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch all active careers from the backend
		fetch(`${API_BASE}/careers?limit=100`)
			.then((r) => r.json())
			.then((res) => {
				if (res.success) {
					// Map MongoDB _id to id so CareerCard and navigation still work
					const mapped = (res.data || []).map((c) => ({ ...c, id: c._id }));
					setItems(mapped);
				}
			})
			.catch((err) => console.error("Failed to fetch careers:", err))
			.finally(() => setLoading(false));
	}, []);

	const limit = 6;
	const {
		currentItems,
		currentpage,
		setCurrentpage,
		paginationItems,
		currentPaginationItems,
		totalPages,
		handleCurrentPage,
		firstItem,
		lastItem,
	} = usePagination(items, limit);

	const totalPortfolios = items?.length;
	const totalPortfoliosToShow = currentItems?.length;

	if (loading) {
		return (
			<section className="tj-careers-section section-gap">
				<div className="container">
					<div style={{ textAlign: "center", padding: "60px 0", color: "#67787a" }}>
						Loading careers...
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="tj-careers-section section-gap">
			<div className="container">
				<div className="row rg-30">
					{currentItems?.length
						? currentItems?.map((careerSingle, idx) => (
								<div className="col-xl-4 col-md-6" key={careerSingle._id || idx}>
									<CareerCard careerSingle={careerSingle} idx={idx} />
								</div>
						  ))
						: (
							<div style={{ textAlign: "center", padding: "60px 0", width: "100%", color: "#67787a" }}>
								No career openings at the moment. Check back soon!
							</div>
						)}
				</div>
				{/* post pagination */}
				{totalPortfoliosToShow < totalPortfolios ? (
					<Paginations
						paginationDetails={{
							currentItems,
							currentpage,
							setCurrentpage,
							paginationItems,
							currentPaginationItems,
							totalPages,
							handleCurrentPage,
							firstItem,
							lastItem,
						}}
					/>
				) : ""}
			</div>
		</section>
	);
};

export default Careers1;