import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import CareerDetails1 from "@/components/sections/careers/CareerDetails1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fetch all careers for prev/next navigation
async function getAllCareers() {
	try {
		const res = await fetch(`${API_BASE}/careers?limit=100`, { cache: "no-store" });
		const data = await res.json();
		return data.success ? data.data : [];
	} catch { return []; }
}

// Fetch single career by MongoDB _id
async function getCareer(id) {
	try {
		const res = await fetch(`${API_BASE}/careers/${id}`, { cache: "no-store" });
		const data = await res.json();
		return data.success ? data.data : null;
	} catch { return null; }
}

export default async function CareerDetails({ params }) {
	const { id } = await params;

	const [career, allCareers] = await Promise.all([
		getCareer(id),
		getAllCareers(),
	]);

	if (!career) notFound();

	// Build prev/next from full list
	const idx      = allCareers.findIndex((c) => c._id === id || c._id?.toString() === id);
	const prevItem = idx > 0 ? allCareers[idx - 1] : null;
	const nextItem = idx < allCareers.length - 1 ? allCareers[idx + 1] : null;

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={"Career Details"} text={"Career Details"} />
						<CareerDetails1
							career={career}
							prevId={prevItem?._id}
							nextId={nextItem?._id}
							isPrevItem={!!prevItem}
							isNextItem={!!nextItem}
						/>
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}

// Dynamic rendering — careers come from DB so no static params
export const dynamic = "force-dynamic";