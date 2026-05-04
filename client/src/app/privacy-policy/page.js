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
  title: "Contact Us",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "Get in touch with the inspirePhD team for research support.",
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
