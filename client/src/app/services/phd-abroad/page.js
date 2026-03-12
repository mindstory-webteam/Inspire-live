import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import HeroInner from "@/components/sections/hero/HeroInner";
import PhdAbroadDetails from "@/components/sections/services/Phdabroaddetails";
import ServicesCarousel from "@/components/sections/services/Servicescarousel";

export const metadata = {
	title: "PhD Abroad - Pursue Your Doctoral Dreams Internationally",
	description: "Specialized guidance for PhD admissions abroad with support for research proposals, funding applications, and supervisor connections.",
};

export default function PhdAbroadPage() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner
							title="PhD Abroad"
							text="PhD Abroad"
							breadcrums={[{ name: "Services", path: "/services" }]}
						/>
						<PhdAbroadDetails />
						<ServicesCarousel/>
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}