import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import CareerDetails1 from "@/components/sections/careers/CareerDetails1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://inspireeducationservice.com/api";

const RESERVED_SLUGS = ["new", "create", "edit", "delete", "undefined", "null", "favicon.ico"];

async function getAllCareers() {
  try {
    const res  = await fetch(`${API_BASE}/careers?limit=100`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

async function getCareer(id) {
  try {
    const res  = await fetch(`${API_BASE}/careers/${id}`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!id || RESERVED_SLUGS.includes(id.toLowerCase())) {
    return {
      title: "Career Not Found",
      description: "The career listing you are looking for does not exist.",
    };
  }

  const career = await getCareer(id);

  if (!career) {
    return {
      title: "Career Not Found",
      description: "The career listing you are looking for does not exist.",
    };
  }

  const title       = career.title || "Career Opportunity";
  const description = career.shortDescription
    || career.description?.slice(0, 160)
    || `Join inspirePhD as ${title}. Apply now for this exciting opportunity.`;
  const pageUrl = `https://inspireeducationservice.com/careers/${career.slug || id}`;
  const ogImage     = career.image || "https://inspirephd.com/og-default.jpg";

  return {
    title,
    description,
    keywords: [
      "PhD careers",
      "research jobs",
      "academic jobs",
      title,
      career.location || "",
      career.department || "",
    ].filter(Boolean),
    openGraph: {
      title:         `${title} | inspirePhD`,
      description,
      url:           pageUrl,
      siteName:      "inspirePhD",
      type:          "article",
      publishedTime: career.createdAt,
      modifiedTime:  career.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${title} | inspirePhD`,
      description,
      images:      [ogImage],
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function CareerDetails({ params }) {
  const { id } = await params;

  if (!id || RESERVED_SLUGS.includes(id.toLowerCase())) notFound();

  const [career, allCareers] = await Promise.all([
    getCareer(id),
    getAllCareers(),
  ]);

  if (!career) notFound();

  const idx      = allCareers.findIndex(
    (c) => c.slug === id || c._id === id || c._id?.toString() === id
  );
  const prevItem = idx > 0 ? allCareers[idx - 1] : null;
  const nextItem = idx < allCareers.length - 1 ? allCareers[idx + 1] : null;

  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSpace />
            <HeroInner title={career.title} text={career.title} />
            <CareerDetails1
              career={career}
              prevId={prevItem?.slug || prevItem?._id}
              nextId={nextItem?.slug || nextItem?._id}
              isPrevItem={!!prevItem}
              isNextItem={!!nextItem}
            />
            <Cta />
          </main>
          <Footer />
        </div>
      </div>
      <ClientWrapper />
    </div>
  );
}

export const dynamic = "force-dynamic";