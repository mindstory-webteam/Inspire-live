import EventsSection from "@/components/event/event";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";



export const metadata = {
  title: "PhD Webinars & Events in Kerala | Inspire Education Service",       // ✅ Renders as "Contact Us | inspirePhD"
  description: "PhD guidance webinars, workshops, and live events in Kerala. Get expert insights on research methodology, journal publication, thesis writing, and PhD admission support.",
     alternates: {
    canonical: "/events",
  },
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