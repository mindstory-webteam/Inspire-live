import Script from "next/script";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import BackToTop from "@/components/shared/others/BackToTop";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import Cta from "@/components/sections/cta/Cta";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import TestimonialPopup from "@/components/sections/testimonials/TestimonialPopup";
import Contact3 from "@/components/landing/ContactForm";
import ServicesSection from "@/components/landing/ServicesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export const metadata = {
  title: "Enquiry Form",
  description: "Get in touch with the inspirePhD team for research support.",
  alternates: {
    canonical: "/enquiry-form",
  },
};

export default function Home2() {
  return (
    <div>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-16901949499"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16901949499');
        `}
      </Script>

      <BackToTop />
      <Header headerType={2} />
      <Header headerType={2} isStickyHeader={true} />
      <TestimonialPopup />
      <FloatingSocialButtons />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <div className="top-space-15"></div>

            <Contact3 />
            <ServicesSection />
            <TestimonialsSection />

            <Cta />
          </main>
          <Footer />
        </div>
      </div>

      <ClientWrapper />
    </div>
  );
}