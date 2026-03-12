"use client";
import { useEffect, useState } from "react";
import getALlServices from "@/libs/getALlServices";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard11 from "@/components/shared/cards/ServiceCard11";

// Hardcoded fallback — cards always render before API responds
// iconImage path must be relative to /public  e.g. /images/service/xxx.webp
const FALLBACK = [
	{
		_id: "phd-india",
		slug: "phd-india",
		title: "PhD India",
		desc: "Complete assistance for PhD admissions in India, from university selection to application submission and interview preparation.",
		iconImage: "/new-imges/serives-image/icons/icon-2.jpg",  // ← correct Next.js public path
		iconName: "",
	},
	{
		_id: "phd-abroad",
		slug: "phd-abroad",
		title: "PhD Abroad",
		desc: "Specialized guidance for PhD admissions abroad with support for research proposals, funding applications, and supervisor connections.",
		iconImage: "/new-imges/serives-image/icons/icon-3.jpg",  // ← change to whichever image you want
		iconName: "",
	},
];

function normalizeService(s) {
	return {
		...s,
		desc: s.desc || s.shortDesc || s.description1 || s.excerpt || "",
		// iconImage can come as an object {url, publicId} from DB or a plain string
		iconImage:
			(typeof s.iconImage === "object" ? s.iconImage?.url : s.iconImage) ||
			s.icon?.url ||
			s.iconImg ||
			null,
		iconName: s.iconName || "",
	};
}

const Services10 = () => {
	const [phdServices, setPhdServices] = useState(FALLBACK);

	useEffect(() => {
		getALlServices()
			.then((all) => {
				const list = Array.isArray(all) ? all : [];
				console.log("[Services10] slugs:", list.map((s) => s.slug));

				const india  = list.find((s) => s.slug === "phd-india");
				const abroad = list.find((s) => s.slug === "phd-abroad");
				const found  = [india, abroad].filter(Boolean).map(normalizeService);

				// If DB services have no icon set, keep the fallback icon
				const merged = found.map((s, i) => ({
					...s,
					iconImage: s.iconImage || FALLBACK[i]?.iconImage || null,
				}));

				if (merged.length > 0) setPhdServices(merged);
			})
			.catch((err) => console.error("[Services10]", err));
	}, []);

	return (
		<section className="h5-service-section h10-service section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap style-8">
							<div className="heading-wrap-content">
								<div className="sec-heading style-3">
									<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
										<i className="tji-box"></i> Our Solutions
									</span>
									<h2 className="sec-title text-anim">
										Tailor Business Solutions for Corporates.
									</h2>
								</div>
								<div className="btn-area wow fadeInUp" data-wow-delay=".8s">
									<ButtonPrimary text={"Explore More"} url={"/services"} />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="row" style={{ marginTop: 40 }}>
					{phdServices.map((service, idx) => (
						<div
							key={service._id || service.slug}
							className="col-12 col-md-6 wow fadeInUp"
							data-wow-delay={`.${idx * 2 + 3}s`}
							style={{ marginBottom: 30 }}
						>
							<ServiceCard11
								service={service}
								idx={idx}
								biggerCard={true}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Services10;