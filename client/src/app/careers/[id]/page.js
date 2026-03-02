import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import CareerDetails1 from "@/components/sections/careers/CareerDetails1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";

// ── In server components, use the internal API URL (not the public one) ───────
// NEXT_PUBLIC_API_URL is for client-side. For SSR fetches, use the direct URL.
const API_BASE =
	process.env.API_URL ||                          // server-only env var (preferred)
	process.env.NEXT_PUBLIC_API_URL ||              // fallback to public one
	"http://localhost:5000/api";                    // hardcoded fallback

// Fetch all careers for prev/next navigation
async function getAllCareers() {
	try {
		const url = `${API_BASE}/careers?limit=100`;
		console.log("[getAllCareers] fetching:", url);
		const res = await fetch(url, { cache: "no-store" });
		const data = await res.json();
		return data.success ? data.data : [];
	} catch (err) {
		console.error("[getAllCareers] error:", err.message);
		return [];
	}
}

// Fetch single career by slug (or _id for backwards compat)
async function getCareer(id) {
	try {
		const url = `${API_BASE}/careers/${id}`;
		console.log("[getCareer] fetching:", url);
		const res = await fetch(url, { cache: "no-store" });
		console.log("[getCareer] status:", res.status);
		const data = await res.json();
		console.log("[getCareer] success:", data.success, "| slug:", data.data?.slug);
		return data.success ? data.data : null;
	} catch (err) {
		console.error("[getCareer] error:", err.message);
		return null;
	}
}

export default async function CareerDetails({ params }) {
	const { id } = await params;
	console.log("[CareerDetails] id from params:", id);

	const [career, allCareers] = await Promise.all([
		getCareer(id),
		getAllCareers(),
	]);

	if (!career) {
		console.log("[CareerDetails] career not found for id:", id);
		notFound();
	}

	// Build prev/next using slug for clean URLs
	const idx      = allCareers.findIndex((c) => c.slug === id || c._id === id || c._id?.toString() === id);
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
							prevId={prevItem?.slug || prevItem?._id}
							nextId={nextItem?.slug || nextItem?._id}
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