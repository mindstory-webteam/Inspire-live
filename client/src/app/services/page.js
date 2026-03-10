


import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Brands1 from "@/components/sections/brands/Brands1";
import Contact2 from "@/components/sections/contacts/Contact2";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesPrimary from "@/components/sections/services/ServicesPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

export const metadata = {
  title: "Services - InspirePhD",
  description: "Explore our comprehensive PhD guidance and support services.",
};

export default function Services() {
  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSpace />
            <HeroInner title={"Services"} text={"Services"} />
            <ServicesPrimary />
            <Contact2 />
            <Brands1 type={2} />
            <Cta />
          </main>
          <Footer />
        </div>
      </div>
      <ClientWrapper />
    </div>
  );
}