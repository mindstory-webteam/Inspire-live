import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Contact3 from "@/components/sections/contacts/Contact3";
import ContactTop from "@/components/sections/contacts/ContactTop";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";




export const metadata = {
  title: "Contact Now | Inspire Education Service",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "Get in touch with Inspire Education Service for PhD guidance and assistance in Kerala. Call or WhatsApp +91 9947 945 945, email research@inspireeducationservice.com",
      alternates: {
    canonical: "/contact",
  },
};
export default function Contact() {

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={"Contact Us"} text={"Contact Us"} />
						<ContactTop />
						<Contact3 />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}
