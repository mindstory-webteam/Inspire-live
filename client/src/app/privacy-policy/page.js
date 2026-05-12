import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import TermsAndConditionsPrimary from "@/components/sections/registration/TermsAndConditionsPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import PrivacyPolicyPrimary from "@/components/sections/registration/PrivacyPolicyPrimary";




export const metadata = {
  title: "Privacy Policy | Inspire Education Service",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "Read the Privacy Policy of Inspire Education Service. Understand how we collect, use, and protect your personal data when you use our PhD guidance and assistance services in Kerala.",
     alternates: {
    canonical: "/privacy-policy",
  },
};
export default function TermsAndConditions() {
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
							title={"Privacy Policy"}
							text={"Privacy Policy"}
						/>
						<PrivacyPolicyPrimary />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}
