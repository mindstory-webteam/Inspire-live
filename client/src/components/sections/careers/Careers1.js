"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CareerCard = ({ career }) => {
	const { _id, slug, title, iconName, image, category, need, location, salaryMin, salaryMax, salaryPeriod } = career;

	// Use slug for clean URL, fall back to _id for backwards compat
	const href = `/careers/${slug || _id}`;

	const salaryDisplay = salaryMin && salaryMax
		? `$${salaryMin}–$${salaryMax} / ${salaryPeriod}`
		: salaryMin  ? `From $${salaryMin} / ${salaryPeriod}`
		: salaryMax  ? `Up to $${salaryMax} / ${salaryPeriod}`
		: null;

	return (
		<div className="col-lg-6 col-md-6">
			<div className="tj-careers-item wow fadeInUp" data-wow-delay="0.1s">
				<div className="tj-careers-item-header">
					{/* Icon / Image */}
					<div
						className="tj-careers-item-icon"
						style={{
							width: "56px",
							height: "56px",
							minWidth: "56px",
							borderRadius: "10px",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "#f1f5f9",
							flexShrink: 0,
						}}
					>
						{image?.url ? (
							<img
								src={image.url}
								alt={title || "Career"}
								style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
							/>
						) : (
							<i className={iconName || "tji-manage"} style={{ fontSize: "24px" }}></i>
						)}
					</div>

					{/* Tags */}
					<div className="tj-careers-tag">
						{category && <span>{category}</span>}
						{need     && <span>{need}</span>}
					</div>
				</div>

				<div className="tj-careers-item-content">
					<h4 className="tj-careers-item-title">
						<Link href={href}>{title}</Link>
					</h4>

					<div className="tj-careers-item-meta">
						{location && (
							<span className="location">
								<i className="tji-location"></i> {location}
							</span>
						)}
						{salaryDisplay && (
							<span className="salary">
								<i className="tji-dollar"></i> {salaryDisplay}
							</span>
						)}
					</div>
				</div>

				<div className="tj-careers-item-footer">
					<Link href={href} className="tj-careers-item-btn">
						Apply Now <i className="tji-arrow-right"></i>
					</Link>
				</div>
			</div>
		</div>
	);
};

const Careers1 = () => {
	const [careers, setCareers]   = useState([]);
	const [loading, setLoading]   = useState(true);
	const [error, setError]       = useState("");

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const res  = await fetch(`${API_BASE}/careers`, { cache: "no-store" });
				const data = await res.json();
				if (data.success && Array.isArray(data.data)) {
					setCareers(data.data);
				} else {
					setError("Could not load job listings.");
				}
			} catch {
				setError("Network error. Could not load jobs.");
			} finally {
				setLoading(false);
			}
		};
		fetchCareers();
	}, []);

	return (
		<section className="tj-careers-section section-gap">
			<div className="container">

				{loading && (
					<div style={{ textAlign: "center", padding: "60px 0", color: "#67787a", fontSize: 16 }}>
						Loading job listings…
					</div>
				)}

				{!loading && error && (
					<div style={{ textAlign: "center", padding: "60px 0", color: "#dc2626", fontSize: 16 }}>
						{error}
					</div>
				)}

				{!loading && !error && careers.length === 0 && (
					<div style={{ textAlign: "center", padding: "60px 0", color: "#67787a", fontSize: 16 }}>
						No open positions at the moment. Please check back soon.
					</div>
				)}

				{!loading && !error && careers.length > 0 && (
					<div className="row rg-30">
						{careers.map((career) => (
							<CareerCard key={career._id} career={career} />
						))}
					</div>
				)}

			</div>
		</section>
	);
};

export default Careers1;