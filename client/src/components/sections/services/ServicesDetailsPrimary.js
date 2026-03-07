"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

// Fix: always provide a fallback so getImageSrc never builds "undefined/uploads/..."
const SERVER_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api$/, "");

function getImageSrc(src) {
  if (!src) return "/images/service/service-1.webp";
  // Already an absolute URL (Cloudinary, https://, or local /images/...)
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  // Relative path like /uploads/services/foo.jpg
  return `${SERVER_BASE}${src}`;
}

const ServicesDetailsPrimary = ({ option }) => {
  const {
    currentItem,
    isPrevItem,
    isNextItem,
    prevId,
    nextId,
  } = option || {};

  const service = currentItem || {};

  const title            = service.title            || "";
  const subtitle         = service.subtitle         || "";
  const heroImage        = service.heroImage        || "";
  const detailImage1     = service.detailImage1     || "";
  const detailImage2     = service.detailImage2     || "";
  const description1     = service.description1     || "";
  const description2     = service.description2     || "";
  const keyFeatures      = service.keyFeatures      || [];
  const whyChooseHeading = service.whyChooseHeading || "";
  const whyChooseText    = service.whyChooseText    || "";
  const benefits         = service.benefits         || [];
  const faqs             = service.faqs             || [];

  // Build prev/next links using slug (prevId / nextId are slugs in ServicePage)
  const prevLink = isPrevItem && prevId ? `/services/${prevId}` : "#";
  const nextLink = isNextItem && nextId ? `/services/${nextId}` : "#";

  return (
    <section className="tj-service-area section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="post-details-wrapper">

              {/* ── Hero image — full width ── */}
              {heroImage && (
                <div
                  className="blog-images wow fadeInUp"
                  data-wow-delay=".1s"
                  style={{ marginBottom: "32px" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "520px",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={getImageSrc(heroImage)}
                      alt={title}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      priority
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  </div>
                </div>
              )}

              {/* ── Main heading ── */}
              {(subtitle || title) && (
                <h2 className="title title-anim">{subtitle || title}</h2>
              )}

              <div className="blog-text">

                {description1 && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    {description1}
                  </p>
                )}

                {description2 && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    {description2}
                  </p>
                )}

                {/* ── Key features list ── */}
                {keyFeatures.length > 0 && (
                  <ul className="wow fadeInUp" data-wow-delay=".3s">
                    {keyFeatures.map(function (feature, index) {
                      return (
                        <li key={index}>
                          <span><i className="tji-check" /></span>
                          {feature}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* ── Detail images ── */}
                {(detailImage1 || detailImage2) && (
                  <div className="images-wrap">
                    <div className="row">
                      {detailImage1 && (
                        <div className="col-sm-6">
                          <div className="image-box wow fadeInUp" data-wow-delay=".3s">
                            <Image
                              src={getImageSrc(detailImage1)}
                              alt={`${title} - Detail 1`}
                              width={420}
                              height={420}
                              style={{ height: "auto" }}
                            />
                          </div>
                        </div>
                      )}
                      {detailImage2 && (
                        <div className="col-sm-6">
                          <div className="image-box wow fadeInUp" data-wow-delay=".5s">
                            <Image
                              src={getImageSrc(detailImage2)}
                              alt={`${title} - Detail 2`}
                              width={420}
                              height={420}
                              style={{ height: "auto" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Why choose ── */}
                {whyChooseHeading && (
                  <h3 className="wow fadeInUp" data-wow-delay=".3s">
                    {whyChooseHeading}
                  </h3>
                )}
                {whyChooseText && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    {whyChooseText}
                  </p>
                )}

                {/* ── Benefits ── */}
                {benefits.length > 0 && (
                  <div className="details-content-box">
                    {benefits.map(function (benefit, index) {
                      return (
                        <div
                          key={index}
                          className="service-details-item wow fadeInUp"
                          data-wow-delay={`${(index + 1) * 0.2}s`}
                        >
                          <span className="number">{benefit.number}.</span>
                          <h6
                            className="title"
                            dangerouslySetInnerHTML={{ __html: benefit.title }}
                          />
                          <div className="desc">
                            <p>{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── FAQs ── */}
                {faqs.length > 0 && (
                  <>
                    <h3 className="wow fadeInUp" data-wow-delay=".3s">
                      Frequently asked questions
                    </h3>
                    <BootstrapWrapper>
                      <div className="accordion tj-faq style-2" id="faqOne">
                        {faqs.map(function (faq, index) {
                          const isFirst = index === 0;
                          return (
                            <div
                              key={index}
                              className={`accordion-item${isFirst ? " active" : ""} wow fadeInUp`}
                              data-wow-delay=".3s"
                            >
                              <button
                                className={`faq-title${isFirst ? "" : " collapsed"}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#faq-${index + 1}`}
                                aria-expanded={isFirst ? "true" : "false"}
                              >
                                {faq.question}
                              </button>
                              <div
                                id={`faq-${index + 1}`}
                                className={`collapse${isFirst ? " show" : ""}`}
                                data-bs-parent="#faqOne"
                              >
                                <div className="accordion-body faq-text">
                                  <p>{faq.answer}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </BootstrapWrapper>
                  </>
                )}

              </div>

              {/* ── Prev / Next navigation ── */}
              <div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
                <div
                  className="tj-nav__post previous"
                  style={{ visibility: isPrevItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav prev_post">
                    <Link href={prevLink}>
                      <span><i className="tji-arrow-left" /></span>
                      Previous
                    </Link>
                  </div>
                </div>

                <Link href="/services" className="tj-nav-post__grid">
                  <i className="tji-window" />
                </Link>

                <div
                  className="tj-nav__post next"
                  style={{ visibility: isNextItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav next_post">
                    <Link href={nextLink}>
                      Next
                      <span><i className="tji-arrow-right" /></span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesDetailsPrimary;