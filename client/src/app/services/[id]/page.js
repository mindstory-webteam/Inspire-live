import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesDetailsPrimary from "@/components/sections/services/ServicesDetailsPrimary";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getServiceBySlug(slug) {
  try {
    const res = await fetch(API_BASE + "/services/slug/" + slug, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    return null;
  }
}

async function getAllServices() {
  try {
    const res = await fetch(API_BASE + "/services", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return { title: "Service Not Found" };
  }
  return {
    title: service.title + " - InspirePhD",
    description: service.description1
      ? service.description1.slice(0, 160)
      : service.title,
  };
}

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map(function (s) {
    return { slug: s.slug };
  });
}

export default async function ServicePage({ params }) {
  const slug = params.slug;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Fetch all services to compute prev/next index-based navigation
  const allServices = await getAllServices();
  const currentIndex = allServices.findIndex((s) => s.slug === slug);
  const isPrevItem = currentIndex > 0;
  const isNextItem = currentIndex < allServices.length - 1;
  const prevId = isPrevItem ? allServices[currentIndex - 1].slug : null;
  const nextId = isNextItem ? allServices[currentIndex + 1].slug : null;

  // Build the option object that ServicesDetailsPrimary expects
  const option = {
    currentItem: service,      // full service data from API
    items: allServices,
    currentId: service._id,
    isPrevItem,
    isNextItem,
    prevId,
    nextId,
  };

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
              title={service.title}
              text={service.title}
              breadcrums={[{ name: "Services", path: "/services" }]}
            />
            <ServicesDetailsPrimary option={option} />
            <Cta />
          </main>
          <Footer />
        </div>
      </div>
      <ClientWrapper />
    </div>
  );
}