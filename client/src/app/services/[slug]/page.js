// app/services/[slug]/page.js
//
// BUG FIXED:
//   generateStaticParams() was pre-rendering pages at BUILD TIME.
//   After you edit a service in the admin the static HTML file on disk
//   never changed, so the user always saw the old content.
//
//   FIX: Export `dynamic = "force-dynamic"` so Next.js renders this page
//   on every request (SSR), meaning it always fetches fresh data from the
//   backend. generateStaticParams is removed for the same reason.
//
//   If you want static pages + instant revalidation in future, replace
//   `dynamic = "force-dynamic"` with `revalidate = 0` or use On-Demand
//   Revalidation (calling `revalidatePath("/services/[slug]")` from the
//   admin save API route).

export const dynamic = "force-dynamic"; // ← THE MAIN FIX

import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesDetailsPrimary from "@/components/sections/services/ServicesDetailsPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";
import { getAllServices, getServiceBySlug } from "@/libs/services";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} - InspirePhD`,
    description: service.description1
      ? service.description1.slice(0, 160)
      : service.title,
  };
}

// generateStaticParams intentionally removed — static pages don't update
// after edits. With dynamic = "force-dynamic" every request is server-rendered.

export default async function ServicePage({ params }) {
  const { slug } = await params;

  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices(),
  ]);

  if (!service) notFound();

  const currentIndex = allServices.findIndex(s => s.slug === slug);
  const isPrevItem   = currentIndex > 0;
  const isNextItem   = currentIndex < allServices.length - 1;
  const prevId       = isPrevItem ? allServices[currentIndex - 1].slug : null;
  const nextId       = isNextItem ? allServices[currentIndex + 1].slug : null;

  const option = {
    currentItem: service,
    items:       allServices,
    currentId:   service._id,
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