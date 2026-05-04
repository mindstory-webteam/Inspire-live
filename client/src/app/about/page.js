import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import About3 from "@/components/sections/about/About3";
import Brands1 from "@/components/sections/brands/Brands1";
import Cta from "@/components/sections/cta/Cta";
import Faq2 from "@/components/sections/faq/Faq2";
import Features from "@/components/sections/features/Features";
import HeroInner from "@/components/sections/hero/HeroInner";
import Testimonials2 from "@/components/sections/testimonials/Testimonials2";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import CeoSection from "@/components/sections/about/Ceosection";
import OurResourcePerson from "@/components/sections/teams/OurResourcePerson";


export const metadata = {
  title: "Contact Us",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "Get in touch with the inspirePhD team for research support.",
    alternates: {
    canonical: "/about",
  },
};

export default function About() {
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
       title={"About Us"} 
       text={"About Us"} 
       backgroundImage="/new-imges/heroinner-image/about-inner.png"
   />
						<About3 type={2} />
						<CeoSection />
						<Features type={2} />
						
						{/* <Brands1 type={2} /> */}
						<Testimonials2 type={2} />
						<OurResourcePerson  type={3}/>
						<Faq2 type={3} />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
