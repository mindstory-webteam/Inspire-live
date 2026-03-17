import Footer2 from "@/components/layout/footer/Footer2";
import Header from "@/components/layout/header/Header";
import About3 from "@/components/sections/about/About3";
import Blogs2 from "@/components/sections/blogs/Blogs2";

import Hero2 from "@/components/sections/hero/Hero2";


import Funfact2 from "@/components/sections/funfacts/Funfact2";

import Process from "@/components/sections/process/Process";
import Services3 from "@/components/sections/services/Services3";
import Team1 from "@/components/sections/teams/Team1";
import Testimonials2 from "@/components/sections/testimonials/Testimonials2";
import Testimonials4 from "@/components/sections/testimonials/Testimonials4";
import Footer from "@/components/layout/footer/Footer";
import BackToTop from "@/components/shared/others/BackToTop";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import Cta from "@/components/sections/cta/Cta";
import About2 from "@/components/sections/about/About2";
import About4 from "@/components/sections/about/About4";
import About5 from "@/components/sections/about/About5";
import About6 from "@/components/sections/about/About6";
import About7 from "@/components/sections/about/About7";
import About8 from "@/components/sections/about/About8";
import About9 from "@/components/sections/about/About9";
import About12 from "@/components/sections/about/About12";
import Events4 from "@/components/sections/eventCards/EventCard";
import Services4 from "@/components/sections/services/Services4";
import Services5 from "@/components/sections/services/Services5";
import Services6 from "@/components/sections/services/Services6";
import Services7 from "@/components/sections/services/Services7";
import Services8 from "@/components/sections/services/Services8";
import Services9 from "@/components/sections/services/Services9";
import Services10 from "@/components/sections/services/Services10";
import Hero10 from "@/components/sections/hero/Hero10";
import Funfact1 from "@/components/sections/funfacts/Funfact1";
import Funfact3 from "@/components/sections/funfacts/Funfact3";
import Process2 from "@/components/sections/process/Process2";

export default function Home2() {
	return (
		<div>
			<BackToTop />
			<Header headerType={2} />
			<Header headerType={2} isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<div className="top-space-15"></div>
						<Hero10 />
						{/* <About3 type={2} /> */}
						
						
						<About9 />
						
						
						<Services10 />
						<Funfact2 />
						{/* <Portfolios2 /> */}
						{/* <Portfolios4 /> */}
						{/* <Events4 /> */}
						<Process />
						<Team1 />

						{/* <Testimonials2 /> */}
							<Testimonials4 />
						

					
						<Blogs2 />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
