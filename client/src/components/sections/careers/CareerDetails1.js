"use client";
import { useState, useRef } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CareerDetails1 = ({ career, prevId, nextId, isPrevItem, isNextItem }) => {
	const {
		_id, title, iconName, category, need, location,
		description, requirements, requirementsList,
		responsibilities, responsibilitiesList,
		tags, jobNumber, company, website,
		salaryMin, salaryMax, salaryPeriod,
		vacancy, applyDeadline,
	} = career || {};

	// ── Apply form state ─────────────────────────────────────────────────────
	const [form, setForm]     = useState({ fullName: "", email: "", phone: "", coverLetter: "" });
	const [file, setFile]     = useState(null);
	const [sending, setSending] = useState(false);
	const [sent, setSent]     = useState(false);
	const [error, setError]   = useState("");
	const fileRef             = useRef(null);

	const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

	const handleApply = async (e) => {
		e.preventDefault();
		if (!form.fullName || !form.email) {
			setError("Full name and email are required.");
			return;
		}
		setSending(true);
		setError("");
		try {
			const fd = new FormData();
			fd.append("fullName",    form.fullName);
			fd.append("email",       form.email);
			fd.append("phone",       form.phone);
			fd.append("coverLetter", form.coverLetter);
			if (file) fd.append("resume", file);

			const res = await fetch(`${API_BASE}/careers/${_id}/apply`, {
				method: "POST",
				body: fd,
			});
			const data = await res.json();
			if (data.success) {
				setSent(true);
				setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
				setFile(null);
			} else {
				setError(data.message || "Submission failed. Please try again.");
			}
		} catch {
			setError("Network error. Please try again.");
		}
		setSending(false);
	};

	// ── Salary display ───────────────────────────────────────────────────────
	const salaryDisplay = salaryMin && salaryMax
		? `$${salaryMin}–$${salaryMax} / ${salaryPeriod}`
		: salaryMin
		? `From $${salaryMin} / ${salaryPeriod}`
		: salaryMax
		? `Up to $${salaryMax} / ${salaryPeriod}`
		: null;

	// ── Deadline display ─────────────────────────────────────────────────────
	const deadlineDisplay = applyDeadline
		? new Date(applyDeadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
		: null;

	// ── Vacancy display ──────────────────────────────────────────────────────
	const vacancyDisplay = vacancy ? `${String(vacancy).padStart(2, "0")} Available` : null;

	return (
		<section className="tj-careers-details section-gap">
			<div className="container">
				<div className="row rg-50">
					<div className="col-lg-8">
						<div className="tj-post-wrapper">
							<div className="tj-post-single-post">

								{/* Top */}
								<div className="tj-careers-top mb-30">
									<div className="tj-careers-top-icon">
										<i className={iconName || "tji-manage"}></i>
									</div>
									<div className="tj-careers-top-content">
										<div className="tj-careers-tag">
											{category && <span>{category}</span>}
											{need && <span>{need}</span>}
										</div>
										<h3 className="tj-careers-top-title text-anim">{title}</h3>
										{location && (
											<span className="location">
												<i className="tji-location"></i>
												{location}
											</span>
										)}
									</div>
								</div>

								{/* Content */}
								<div className="tj-entry-content">

									{/* Description */}
									{description && (
										<>
											<h4 className="text-anim">Job Description</h4>
											<p className="wow fadeInUp" data-wow-delay="0.1s">{description}</p>
										</>
									)}

									{/* Requirements */}
									{(requirements || (requirementsList && requirementsList.length > 0)) && (
										<div className="tj-check-list">
											<h4 className="text-anim">Requirements</h4>
											{requirements && (
												<p className="wow fadeInUp" data-wow-delay="0.1s">{requirements}</p>
											)}
											{requirementsList && requirementsList.length > 0 && (
												<div className="team-details__experience__list service-check-list mt-4 mb-4 wow fadeInUp"
													data-wow-delay="0.3s">
													<ul>
														{requirementsList.map((item, i) => (
															<li key={i}>
																<i className="tji-check"></i>
																<span>{item}</span>
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
									)}

									{/* Responsibilities */}
									{(responsibilities || (responsibilitiesList && responsibilitiesList.length > 0)) && (
										<div className="tj-check-list">
											<h4 className="text-anim">Responsibilities</h4>
											{responsibilities && (
												<p className="wow fadeInUp" data-wow-delay="0.1s">{responsibilities}</p>
											)}
											{responsibilitiesList && responsibilitiesList.length > 0 && (
												<ul className="wow fadeInUp" data-wow-delay="0.3s">
													{responsibilitiesList.map((item, i) => (
														<li key={i}>
															<span><i className="tji-check"></i></span> {item}
														</li>
													))}
												</ul>
											)}
										</div>
									)}
								</div>

								{/* Tags & Share */}
								{tags && tags.length > 0 && (
									<div className="tj-tags-post tj-post-details_tags_share wow fadeInUp" data-wow-delay=".1s">
										<div className="tagcloud">
											<span>Tags:</span>
											{tags.map((tag, i) => (
												<Link key={i} href="/careers">{tag}</Link>
											))}
										</div>
										<div className="post-share">
											<ul>
												<li>Share:</li>
												<li><Link href="https://www.facebook.com/" title="Facebook"><i className="fa-brands fa-facebook-f"></i></Link></li>
												<li><Link href="https://x.com/" title="Twitter"><i className="fab fa-x-twitter"></i></Link></li>
												<li><Link href="https://www.linkedin.com/" title="Linkedin"><i className="fa-brands fa-linkedin-in"></i></Link></li>
												<li><Link href="https://www.pinterest.com/" title="Pinterest"><i className="fa-brands fa-pinterest-p"></i></Link></li>
											</ul>
										</div>
									</div>
								)}
							</div>

							{/* Navigation */}
							<div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
								<div className="tj-nav__post previous"
									style={{ visibility: isPrevItem ? "visible" : "hidden" }}>
									<div className="tj-nav-post__nav prev_post">
										<Link href={isPrevItem ? `/careers/${prevId}` : "#"}>
											<span><i className="tji-arrow-left"></i></span>
											Previous
										</Link>
									</div>
								</div>
								<Link href="/careers" className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								<div className="tj-nav__post next"
									style={{ visibility: isNextItem ? "visible" : "hidden" }}>
									<div className="tj-nav-post__nav next_post">
										<Link href={isNextItem ? `/careers/${nextId}` : "#"}>
											Next
											<span><i className="tji-arrow-right"></i></span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="col-lg-4">
						<aside className="tj-blog-sidebar">

							{/* Job Information */}
							<div className="tj-sidebar-widget wow fadeInUp" data-wow-delay="0.1s">
								<h4 className="widget-title">Job Information</h4>
								<div className="project_catagory">
									<ul>
										{category && <li><span className="first-child">Category</span><span>{category}</span></li>}
										{jobNumber && <li><span className="first-child">Number</span><span>{jobNumber}</span></li>}
										{company && <li><span className="first-child">Company</span><span>{company}</span></li>}
										{website && <li><span className="first-child">Website</span><span>{website}</span></li>}
										{salaryDisplay && <li><span className="first-child">Salary</span><span>{salaryDisplay}</span></li>}
										{vacancyDisplay && <li><span className="first-child">Vacancy</span><span>{vacancyDisplay}</span></li>}
										{deadlineDisplay && <li><span className="first-child">Apply on</span><span>{deadlineDisplay}</span></li>}
									</ul>
								</div>
							</div>

							{/* Apply Online */}
							<div className="tj-sidebar-widget wow fadeInUp" data-wow-delay="0.3s">
								<h4 className="widget-title">Apply Online</h4>
								<div className="tj-careers-form">
									{sent ? (
										<div style={{ textAlign: "center", padding: "24px 0", color: "#16a34a", fontWeight: 600 }}>
											✓ Application submitted! We'll be in touch soon.
										</div>
									) : (
										<form onSubmit={handleApply}>
											<div className="form-input">
												<input type="text" name="cr_name" placeholder="Full name*"
													value={form.fullName}
													onChange={(e) => setF("fullName", e.target.value)}
													required />
											</div>
											<div className="form-input">
												<input type="email" name="cr_email" placeholder="Enter email*"
													value={form.email}
													onChange={(e) => setF("email", e.target.value)}
													required />
											</div>
											<div className="form-input">
												<input type="text" name="cr_phone" placeholder="Phone number"
													value={form.phone}
													onChange={(e) => setF("phone", e.target.value)} />
											</div>
											<div className="form-input">
												<textarea name="cr_cover_letter" placeholder="Cover letter"
													value={form.coverLetter}
													onChange={(e) => setF("coverLetter", e.target.value)}></textarea>
											</div>
											<div className="form-input reduce">
												<label className="label" htmlFor="inputFile">
													Attach resume (PDF/DOC)
												</label>
												<input type="file" id="inputFile" ref={fileRef}
													accept=".pdf,.doc,.docx"
													onChange={(e) => setFile(e.target.files[0])} />
												{file && (
													<p style={{ fontSize: 12, color: "#67787a", marginTop: 4 }}>
														Selected: {file.name}
													</p>
												)}
											</div>
											{error && (
												<p style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>{error}</p>
											)}
											<div className="tj-careers-button">
												<ButtonPrimary
													text={sending ? "Submitting…" : "Submit now"}
													type="submit"
													disabled={sending}
												/>
											</div>
										</form>
									)}
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CareerDetails1;