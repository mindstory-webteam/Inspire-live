"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const SERVER_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api$/, "");

function getImageSrc(src) {
  if (!src) return "/images/service/service-1.webp";
  if (src.startsWith("http") || src.startsWith("/images")) return src;
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

  const prevLink = isPrevItem && prevId ? `/services/${prevId}` : "#";
  const nextLink = isNextItem && nextId ? `/services/${nextId}` : "#";

  return (
    <section className="tj-service-area section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="post-details-wrapper">

              {/* Hero image */}
              {heroImage && (
                <div className="blog-images wow fadeInUp" data-wow-delay=".1s" style={{ marginBottom: "32px" }}>
                  <div style={{ position: "relative", width: "100%", height: "520px", borderRadius: "12px", overflow: "hidden" }}>
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

              {(subtitle || title) && (
                <h2 className="title title-anim">{subtitle || title}</h2>
              )}

              <div className="blog-text">

                {description1 && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">{description1}</p>
                )}

                {description2 && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">{description2}</p>
                )}

                {keyFeatures.length > 0 && (
                  <ul className="wow fadeInUp" data-wow-delay=".3s">
                    {keyFeatures.map((feature, index) => (
                      <li key={index}>
                        <span><i className="tji-check" /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* ── Detail images — fixed equal height ── */}
                {(detailImage1 || detailImage2) && (
                  <div className="images-wrap">
                    <div className="row">
                      {detailImage1 && (
                        <div className="col-sm-6">
                          <div
                            className="image-box wow fadeInUp"
                            data-wow-delay=".3s"
                            style={{
                              position: "relative",
                              width: "100%",
                              height: 320,         /* ← fixed height */
                              borderRadius: 10,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={getImageSrc(detailImage1)}
                              alt={`${title} - Detail 1`}
                              fill
                              sizes="(max-width: 576px) 100vw, 50vw"
                              style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                          </div>
                        </div>
                      )}
                      {detailImage2 && (
                        <div className="col-sm-6">
                          <div
                            className="image-box wow fadeInUp"
                            data-wow-delay=".5s"
                            style={{
                              position: "relative",
                              width: "100%",
                              height: 320,         /* ← same fixed height */
                              borderRadius: 10,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={getImageSrc(detailImage2)}
                              alt={`${title} - Detail 2`}
                              fill
                              sizes="(max-width: 576px) 100vw, 50vw"
                              style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {whyChooseHeading && (
                  <h3 className="wow fadeInUp" data-wow-delay=".3s">{whyChooseHeading}</h3>
                )}
                {whyChooseText && (
                  <p className="wow fadeInUp" data-wow-delay=".3s">{whyChooseText}</p>
                )}

                {benefits.length > 0 && (
                  <div className="details-content-box">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="service-details-item wow fadeInUp"
                        data-wow-delay={`${(index + 1) * 0.2}s`}
                      >
                        <span className="number">{benefit.number}.</span>
                        <h6 className="title" dangerouslySetInnerHTML={{ __html: benefit.title }} />
                        <div className="desc">
                          <p>{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {faqs.length > 0 && (
                  <>
                    <h3 className="wow fadeInUp" data-wow-delay=".3s">Frequently asked questions</h3>
                    <BootstrapWrapper>
                      <div className="accordion tj-faq style-2" id="faqOne">
                        {faqs.map((faq, index) => {
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

              {/* Prev / Next navigation */}
              <div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
                <div className="tj-nav__post previous" style={{ visibility: isPrevItem ? "visible" : "hidden" }}>
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
                <div className="tj-nav__post next" style={{ visibility: isNextItem ? "visible" : "hidden" }}>
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