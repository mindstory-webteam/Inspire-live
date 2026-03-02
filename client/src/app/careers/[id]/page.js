import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import CareerDetails1 from "@/components/sections/careers/CareerDetails1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";

const API_BASE =
	process.env.API_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"http://localhost:5000/api";

async function getAllCareers() {
	try {
		const res = await fetch(`${API_BASE}/careers?limit=100`, { cache: "no-store" });
		const data = await res.json();
		return data.success ? data.data : [];
	} catch { return []; }
}

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
						{/* ── Use actual job title in the hero ── */}
						<HeroInner title={career.title} text={career.title} />
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

export const dynamic = "force-dynamic";