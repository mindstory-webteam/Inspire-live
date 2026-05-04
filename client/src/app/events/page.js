import EventsSection from "@/components/event/event";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";



export const metadata = {
  title: "Contact Us",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "Get in touch with the inspirePhD team for research support.",
};


export default function EventsPage() {
  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSpace />
            {/* FIX: was "Company History" — corrected to "Events" */}
            <HeroInner title={"Events"} text={"Events"} />
            <EventsSection />
            <Cta />
          </main>
          <Footer />
        </div>
      </div>
      <ClientWrapper />
    </div>
  );
}