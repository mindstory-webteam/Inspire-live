import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import CourseDetails from "@/components/CourseDetails";

export const metadata = {
  title: "Course Details & Apply | Inspire Education Service",
  description:
    "Explore our PhD guidance programs, course details, eligibility criteria, and apply now. Inspire Education Service — India's No.1 PhD guidance platform.",
  alternates: {
    canonical: "/applying",
  },
};

export default function Applying() {
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
              title={"Course Details"}
              text={"Apply Now"}
              backgroundImage="/new-imges/heroinner-image/about-inner.png"
            />
            <CourseDetails />
            <Cta />
          </main>
          <Footer />
        </div>
      </div>
      <ClientWrapper />
    </div>
  );
}