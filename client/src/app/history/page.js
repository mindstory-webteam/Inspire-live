import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import About12 from "@/components/sections/about/About12";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import History1 from "@/components/sections/history/History1";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";



export const metadata = {
  title: "Our History | How Inspire Became Kerala's Leading PhD Guidance Centre",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "From a small initiative in Palakkad, Kerala to India's No.1 PhD assistance platform - discover the journey of Inspire Education Service",
     alternates: {
    canonical: "/history",
  },
};

export default function Histor() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={"Company History"} text={"Company History"}   backgroundImage="/new-imges/heroinner-image/history-inner.png" />
						<About12 />
						<History1 />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
