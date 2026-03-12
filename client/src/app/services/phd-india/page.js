import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import HeroInner from "@/components/sections/hero/HeroInner";
import PhdIndiaDetails from "@/components/sections/services/PhdIndiaDetails";
import ServicesCarousel from "@/components/sections/services/Servicescarousel";

export const metadata = {
	title: "PhD India - Expert Guidance for PhD Programs in India",
	description: "Complete assistance for PhD admissions in India, from university selection to application submission and interview preparation.",
};

export default function PhdIndiaPage() {
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
							title="PhD India"
							text="PhD India"
							breadcrums={[{ name: "Services", path: "/services" }]}
						/>
						<PhdIndiaDetails />
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