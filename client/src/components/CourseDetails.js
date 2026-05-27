"use client";

import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const faqData = [
  {
    question: "Who is eligible to apply for the PhD program?",
    answer:
      "Any candidate with a Master's degree (50% or above) in any discipline is eligible. There is no upper age limit. Our counsellors will assess your profile and guide you to the most suitable university and research area.",
  },
  {
    question: "How long does the PhD program take?",
    answer:
      "A PhD in India typically takes 3–5 years depending on the university and research domain. Our team supports you throughout — from synopsis submission to final thesis defence and viva voce.",
  },
  {
    question: "What documents are required to apply?",
    answer:
      "You will need your SSLC, Plus Two, Degree, and Master's certificates, a valid ID proof, and passport-size photographs. Our team will guide you through the complete documentation checklist after your initial counselling session.",
  },
  {
    question: "Will I get support for research paper publication?",
    answer:
      "Yes. We provide complete support for publishing in Scopus, SCI, and UGC-listed journals — including manuscript writing, journal selection, peer-review responses, plagiarism correction, and follow-up until acceptance.",
  },
  {
    question: "Is online guidance available?",
    answer:
      "Yes. Our PhD guidance is available fully online. Sessions are conducted via video calls with shared documents, a dedicated mentor, and continuous support through our communication channels — no matter where you are located.",
  },
  {
    question: "What happens after I submit the application form?",
    answer:
      "Our counselling team will contact you within 24 hours of form submission. We will schedule a free consultation to discuss your academic profile, research interests, program options, and the next steps to enrolment.",
  },
];

const keyFeatures = [
  "Research Topic Identification & Gap Analysis",
  "Synopsis & Research Proposal Writing",
  "Chapter-wise Thesis Guidance",
  "Scopus / SCI / UGC Journal Publication Support",
  "Statistical Analysis & Data Interpretation",
  "Plagiarism Check & Correction",
  "Viva Voce & Defence Preparation",
  "University Liaison & Admission Support",
];

const benefits = [
  {
    number: "01",
    title: "Personalised<br/>Research Mentoring",
    description:
      "Each scholar is assigned a dedicated subject expert who provides one-on-one mentoring throughout the entire PhD journey. Our mentors are active academics with proven publication records in their respective fields.",
  },
  {
    number: "02",
    title: "Structured Milestone<br/>Based Guidance",
    description:
      "We break down the PhD process into clear, achievable milestones — topic selection, synopsis, literature review, data collection, analysis, writing, and submission — so you always know exactly where you stand and what comes next.",
  },
  {
    number: "03",
    title: "Publication &<br/>Journal Support",
    description:
      "Our editorial team assists in preparing and submitting research papers to reputed international journals. We have successfully guided scholars to publish in Scopus, SCI, and UGC Care-listed journals across all major disciplines.",
  },
];

const CourseDetails = () => {
  return (
    <section className="tj-service-area section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="post-details-wrapper">

              {/* Hero Image */}
              <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                <Image
                  src="/new-imges/heroinner-image/about-inner.png"
                  alt="PhD Guidance Program — Inspire Education Service"
                  width={1170}
                  height={500}
                  style={{ height: "auto", width: "100%" }}
                />
              </div>

              {/* Title */}
              <h2 className="title title-anim">
                PhD Guidance Program — Complete Doctoral Support from Enrolment to Degree
              </h2>

              <div className="blog-text">

                {/* Intro */}
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  The PhD Guidance Program at Inspire Education Service is a comprehensive, scholar-focused
                  support system designed to help you complete your doctoral degree successfully. Whether you
                  are just beginning your research journey or are midway through your PhD, our team of
                  experienced research mentors, statisticians, and editorial experts are here to guide you
                  at every step — from selecting a research topic to defending your thesis.
                </p>
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  With over 1,000 scholars guided across 17+ countries and partnerships with universities
                  across India and abroad, we bring a structured, outcome-driven approach to PhD guidance.
                  Our program is open to scholars from all disciplines — Science, Arts, Commerce,
                  Engineering, Management, Education, Law, and Social Sciences.
                </p>

                {/* Features List */}
                <ul className="wow fadeInUp" data-wow-delay=".3s">
                  {keyFeatures.map((feature, index) => (
                    <li key={index}>
                      <span><i className="tji-check"></i></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Dual Images */}
                <div className="images-wrap">
                  <div className="row">
                    <div className="col-sm-6">
                      <div
                        className="image-box wow fadeInUp"
                        data-wow-delay=".3s"
                        style={{ position: "relative", width: "100%", height: 320, borderRadius: 10, overflow: "hidden" }}
                      >
                        <Image
                          src="/new-imges/about-images/img-1.png"
                          alt="PhD Research Guidance"
                          fill
                          sizes="(max-width: 576px) 100vw, 50vw"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div
                        className="image-box wow fadeInUp"
                        data-wow-delay=".5s"
                        style={{ position: "relative", width: "100%", height: 320, borderRadius: 10, overflow: "hidden" }}
                      >
                        <Image
                          src="/new-imges/home-about/home-about-img-1.png"
                          alt="Doctoral Thesis Support"
                          fill
                          sizes="(max-width: 576px) 100vw, 50vw"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Choose */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Why Choose Our PhD Guidance Program?
                </h3>
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  Unlike generic coaching centres, Inspire Education Service provides truly personalised,
                  discipline-specific research mentoring. Our scholars benefit from the collective expertise
                  of 50+ research professionals, a proven milestone-based guidance framework, and a strong
                  record of successful PhD completions and journal publications. We work with you — not for
                  you — ensuring that every part of your thesis reflects your own original contribution to
                  knowledge.
                </p>

                {/* Benefits */}
                <div className="details-content-box">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="service-details-item wow fadeInUp"
                      data-wow-delay={`.${(index + 1) * 2}s`}
                    >
                      <span className="number">{benefit.number}.</span>
                      <h6 className="title" dangerouslySetInnerHTML={{ __html: benefit.title }} />
                      <div className="desc">
                        <p>{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Program Details Box */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Program Details
                </h3>
                <div
                  className="wow fadeInUp"
                  data-wow-delay=".3s"
                  style={{
                    background: "#f4f7fb",
                    borderRadius: 12,
                    padding: "28px 32px",
                    marginBottom: 32,
                    borderLeft: "4px solid #1a5276",
                  }}
                >
                  <div className="row">
                    {[
                      { label: "Duration", value: "3 – 5 Years" },
                      { label: "Mode", value: "Online & Offline" },
                      { label: "Eligibility", value: "Master's Degree (50% & above)" },
                      { label: "Disciplines", value: "All Major Disciplines" },
                      { label: "Universities", value: "Indian & International" },
                      { label: "Fee", value: "Contact Us for Details" },
                    ].map((item, i) => (
                      <div key={i} className="col-sm-6" style={{ marginBottom: 16 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1a5276", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {item.label}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: "#1a2e4a" }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Link
                      href="/application-form"
                      style={{
                        display: "inline-block",
                        background: "#1a5276",
                        color: "#fff",
                        padding: "14px 48px",
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>

                {/* FAQ */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Frequently Asked Questions
                </h3>
                <BootstrapWrapper>
                  <div className="accordion tj-faq style-2" id="faqPhd">
                    {faqData.map((faq, index) => (
                      <div
                        key={index}
                        className={`accordion-item ${index === 0 ? "active" : ""} wow fadeInUp`}
                        data-wow-delay=".3s"
                      >
                        <button
                          className={`faq-title ${index !== 0 ? "collapsed" : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-phd-${index + 1}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                        >
                          {faq.question}
                        </button>
                        <div
                          id={`faq-phd-${index + 1}`}
                          className={`collapse ${index === 0 ? "show" : ""}`}
                          data-bs-parent="#faqPhd"
                        >
                          <div className="accordion-body faq-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </BootstrapWrapper>

              </div>

              {/* Navigation */}
              <div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
                <div className="tj-nav__post previous">
                  <div className="tj-nav-post__nav prev_post">
                    <Link href="/services">
                      <span><i className="tji-arrow-left"></i></span>
                      Our Services
                    </Link>
                  </div>
                </div>
                <Link href="/services" className="tj-nav-post__grid">
                  <i className="tji-window"></i>
                </Link>
                <div className="tj-nav__post next">
                  <div className="tj-nav-post__nav next_post">
                    <Link href="/application-form">
                      Apply Now
                      <span><i className="tji-arrow-right"></i></span>
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

export default CourseDetails;