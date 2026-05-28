"use client";

import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

const highlights = [
  "Research Topic Identification & Gap Analysis",
  "Synopsis & Research Proposal Writing",
  "Chapter-wise Thesis Guidance",
  "Scopus / SCI / UGC Journal Publication Support",
  "Statistical Analysis & Data Interpretation",
  "Plagiarism Check & Correction",
  "Viva Voce & Defence Preparation",
  "University Liaison & Admission Support",
];

const programDetails = [
  { label: "Duration",      value: "3 – 5 Years" },
  { label: "Mode",          value: "Online & Offline" },
  { label: "Eligibility",   value: "Master's Degree (50% & above)" },
  { label: "Disciplines",   value: "All Major Disciplines" },
  { label: "Universities",  value: "Indian & International" },
  { label: "Fee",           value: "Contact Us" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CourseDetails = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Course Overview  (image LEFT, content RIGHT)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="tj-about-section-2 section-gap section-gap-x">
        <div className="container">
          <div className="row align-items-center g-5">

            {/* LEFT — Image */}
            <div className="col-xl-6 col-lg-6 order-lg-1 order-2">
              <div
                className="about-img-area h10-about-banner wow bounceInLeft"
                data-wow-delay=".3s"
              >
                <div className="about-img overflow-hidden" style={{ borderRadius: 20 }}>
                  <Image
                    src="/new-imges/about-images/img-1.png"
                    alt="PhD Guidance Program"
                    width={650}
                    height={560}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Content */}
            <div className="col-xl-6 col-lg-6 order-lg-2 order-1" style={{ display: "flex", flexDirection: "column" }}>
              <div className="sec-heading">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box"></i> OUR PROGRAM
                </span>
                <h2 className="sec-title title-anim">
                  PhD Guidance Program — <span>Complete Doctoral Support</span>
                </h2>
                <p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ lineHeight: "1.9" }}>
                  The PhD Guidance Program at Inspire Education Service is a comprehensive,
                  scholar-focused support system designed to help you complete your doctoral degree
                  successfully. From research topic selection to thesis submission and viva voce,
                  our team of 50+ expert mentors walks every step of the journey with you.
                </p>
              </div>

              <div style={{ height: 1, background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)", margin: "28px 0" }} />

              {/* Checklist */}
              <ul className="wow fadeInUp" data-wow-delay=".4s" style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {highlights.map((h, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#1a5276", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      <i className="tji-check"></i>
                    </span>
                    <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="about-btn-area wow fadeInUp" data-wow-delay=".5s"
                style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <ButtonPrimary text={"Apply Now"} url={"/application-form"} />
               <ButtonPrimary text={"Talk to a Counsellor"} url={"/contact"} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Program Details + Stats  (content LEFT, image RIGHT)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="tj-about-section-2 section-gap section-gap-x" style={{ background: "#f4f7fb" }}>
        <div className="container">
          <div className="row align-items-center g-5">

            {/* LEFT — Details */}
            <div className="col-xl-6 col-lg-6 order-lg-1 order-2" style={{ display: "flex", flexDirection: "column" }}>
              <div className="sec-heading">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box"></i> PROGRAM DETAILS
                </span>
                <h2 className="sec-title title-anim">
                  Everything You Need to <span>Know Before Applying</span>
                </h2>
                <p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ lineHeight: "1.9" }}>
                  Our PhD Guidance Program is open to scholars across all disciplines and is available
                  in both online and offline modes. Below are the key details to help you decide if
                  this program is right for you.
                </p>
              </div>

              <div style={{ height: 1, background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)", margin: "24px 0" }} />

              {/* Details grid */}
              <div className="row wow fadeInUp" data-wow-delay=".4s" style={{ marginBottom: 32 }}>
                {programDetails.map((item, i) => (
                  <div key={i} className="col-6" style={{ marginBottom: 20 }}>
                    <div style={{ borderLeft: "3px solid #1a5276", paddingLeft: 14 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#1a5276", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {item.label}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700, color: "#1a2e4a" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mission / Vision boxes — same as ArticleSection */}
              <div className="about-bottom-area">
                <div className="mission-vision-box wow fadeInLeft" data-wow-delay=".5s">
                  <h4 className="title">1000+ Scholars</h4>
                  <p className="desc" style={{ lineHeight: "1.8" }}>
                    Over a thousand doctoral scholars have successfully completed their PhD journey
                    with our guidance across Indian and international universities.
                  </p>
                </div>
                <div className="mission-vision-box wow fadeInRight" data-wow-delay=".55s">
                  <h4 className="title">17+ Countries</h4>
                  <p className="desc" style={{ lineHeight: "1.8" }}>
                    Inspire Education Service has a global presence, supporting PhD scholars across
                    17+ countries including the USA, UK, Canada, Australia, and the UAE.
                  </p>
                </div>
              </div>

              <div style={{ height: 36 }} />

              <div className="about-btn-area wow fadeInUp" data-wow-delay=".6s"
                style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                
                
              </div>
            </div>

            {/* RIGHT — Image */}
            <div className="col-xl-6 col-lg-6 order-lg-2 order-1">
              <div
                className="about-img-area h10-about-banner wow bounceInRight"
                data-wow-delay=".3s"
              >
                <div className="about-img overflow-hidden" style={{ borderRadius: 20 }}>
                  <Image
                    src="/new-imges/home-about/home-about-img-1.png"
                    alt="PhD Program Details"
                    width={650}
                    height={560}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="tj-about-section-2 section-gap section-gap-x">
        <div className="container">
          <div className="row align-items-start g-5">

            {/* LEFT — Heading + apply CTA */}
            <div className="col-xl-5 col-lg-5" style={{ display: "flex", flexDirection: "column" }}>
              <div className="sec-heading">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box"></i> FAQ
                </span>
                <h2 className="sec-title title-anim">
                  Common Questions <span>Answered</span>
                </h2>
                <p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ lineHeight: "1.9" }}>
                  Have questions about our PhD Guidance Program? Find answers to the most
                  frequently asked questions below. If you need more information, our counselling
                  team is always available for a free consultation.
                </p>
              </div>

              <div style={{ height: 1, background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)", margin: "28px 0" }} />

              {/* Quick stats */}
              <div className="about-bottom-area">
                <div className="mission-vision-box wow fadeInLeft" data-wow-delay=".5s">
                  <h4 className="title">Free Counselling</h4>
                  <p className="desc" style={{ lineHeight: "1.8" }}>
                    Get a free 1-on-1 counselling session with our research advisors before
                    you commit to any program. No obligation, no pressure.
                  </p>
                </div>
                <div className="mission-vision-box wow fadeInRight" data-wow-delay=".55s">
                  <h4 className="title">24 Hr Response</h4>
                  <p className="desc" style={{ lineHeight: "1.8" }}>
                    Submit your application form and our team will get back to you within
                    24 hours to schedule your counselling session.
                  </p>
                </div>
              </div>

              <div style={{ height: 36 }} />

              <div className="about-btn-area wow fadeInUp" data-wow-delay=".6s"
                style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                
              </div>
            </div>

            {/* RIGHT — FAQ accordion */}
            <div className="col-xl-7 col-lg-7">
              <BootstrapWrapper>
                <div className="accordion tj-faq style-2 wow fadeInRight" data-wow-delay=".3s" id="faqPhd">
                  {faqData.map((faq, index) => (
                    <div
                      key={index}
                      className={`accordion-item ${index === 0 ? "active" : ""}`}
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

          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetails;