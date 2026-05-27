"use client";

import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqData = [
  {
    question: "Who is eligible to apply for PhD guidance?",
    answer:
      "Any candidate who has completed a Master's degree (with 50% or above) in any discipline is eligible to apply for our PhD Guidance Program. For PhD Abroad, candidates additionally need English proficiency scores (IELTS/TOEFL). There is no upper age limit for any of our programs.",
  },
  {
    question: "How long does the PhD guidance program take?",
    answer:
      "The duration depends on the university and program. Typically, a PhD in India takes 3–5 years, while international PhD programs take 3–4 years. Our guidance and support continue throughout the entire duration — from enrolment to thesis submission and viva voce.",
  },
  {
    question: "What documents are required for the application?",
    answer:
      "You will need your academic certificates (SSLC, Plus Two, Degree, Master's), a valid ID proof, passport-size photographs, and for PhD Abroad — a valid passport and English proficiency score certificate. Our team guides you through the complete documentation process step by step.",
  },
  {
    question: "Do you help with research paper publication?",
    answer:
      "Yes, we provide comprehensive support for research paper publication in Scopus, SCI, and UGC-listed journals. This includes manuscript writing and editing, journal selection, peer-review response, plagiarism correction, and follow-up until your paper is published.",
  },
  {
    question: "Is online guidance available?",
    answer:
      "Absolutely. All our programs are available in both online and offline modes. Online sessions are conducted via video calls, with shared documents and dedicated communication channels for each scholar. You can be located anywhere in the world and still receive full guidance.",
  },
  {
    question: "How do I apply and what is the fee?",
    answer:
      "You can apply by filling out our Application Form online. Once submitted, our counselling team will contact you within 24 hours to discuss your profile, program options, and fee structure. Fees vary based on the program and level of support required — contact us for a personalized quote.",
  },
];

// ─── Key Features ─────────────────────────────────────────────────────────────
const keyFeatures = [
  "PhD Guidance (India & Abroad)",
  "Synopsis & Research Proposal Writing",
  "Chapter-wise Thesis Support",
  "Scopus / SCI / UGC Journal Publication",
  "Statistical Analysis & Data Interpretation",
  "Plagiarism Check & Correction",
  "Viva Voce & Defense Preparation",
  "Post-Doctoral Fellowship Assistance",
];

// ─── Benefits ─────────────────────────────────────────────────────────────────
const benefits = [
  {
    number: "01",
    title: "End-to-End<br/>Research Support",
    description:
      "From the moment you enrol, our dedicated mentors guide you through every phase of your research — topic identification, proposal writing, chapter development, publication, and viva preparation — ensuring a smooth and successful PhD journey.",
  },
  {
    number: "02",
    title: "Expert Mentor<br/>Assignment",
    description:
      "Every scholar is assigned a subject-specific expert mentor with proven experience in their discipline. Our mentors are active researchers and academics who bring real-world insight and domain expertise to every guidance session.",
  },
  {
    number: "03",
    title: "International<br/>University Access",
    description:
      "For scholars seeking PhD opportunities abroad, we provide access to our global university network across the USA, UK, Canada, Australia, Germany, and more — with full support for admissions, scholarships, SOP writing, and visa documentation.",
  },
];

// ─── Programs Overview ────────────────────────────────────────────────────────
const programs = [
  {
    icon: "🎓",
    title: "PhD Guidance Program",
    desc: "Full doctoral support for Indian universities — from topic selection to thesis submission.",
    duration: "3–5 Years",
    mode: "Online / Offline",
  },
  {
    icon: "✈️",
    title: "PhD Abroad Program",
    desc: "International doctoral admissions with scholarship, SOP, and visa support.",
    duration: "3–4 Years",
    mode: "International",
  },
  {
    icon: "🔬",
    title: "Post-Doctoral Fellowship",
    desc: "High-impact research, Q1/Q2 journal publications, and academic career building.",
    duration: "1–2 Years",
    mode: "Online / Institute",
  },
  {
    icon: "📄",
    title: "Research Paper Publication",
    desc: "Scopus, SCI & UGC journal publications with end-to-end editorial support.",
    duration: "1–6 Months",
    mode: "Online",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const CourseDetails = () => {
  return (
    <section className="tj-service-area section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="post-details-wrapper">

              {/* ── Hero Image ─────────────────────────────────────────────── */}
              <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                <Image
                  src="/new-imges/heroinner-image/about-inner.png"
                  alt="Course Details — Inspire Education Service"
                  width={1170}
                  height={500}
                  style={{ height: "auto", width: "100%" }}
                />
              </div>

              {/* ── Main Title ─────────────────────────────────────────────── */}
              <h2 className="title title-anim">
                India's No.1 PhD Guidance Platform — Explore Our Programs & Apply Today
              </h2>

              <div className="blog-text">

                {/* ── Intro Paragraphs ───────────────────────────────────── */}
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  Inspire Education Service is a premier research guidance institution dedicated to supporting
                  doctoral scholars at every stage of their academic journey. With over 1,000 scholars guided
                  across 17+ countries, we bring unmatched expertise, personalized mentoring, and a proven
                  track record of success in PhD admissions, thesis writing, and research publication.
                </p>
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  Whether you are beginning your PhD journey in India, planning to pursue a doctorate abroad,
                  or looking to publish your research in reputed international journals, our team of subject
                  experts and research consultants are here to support you every step of the way. Our programs
                  are designed to be flexible, accessible, and outcome-focused — tailored to your unique
                  academic profile and career goals.
                </p>

                {/* ── Key Features List ──────────────────────────────────── */}
                <ul className="wow fadeInUp" data-wow-delay=".3s">
                  {keyFeatures.map((feature, index) => (
                    <li key={index}>
                      <span><i className="tji-check"></i></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* ── Two Images ─────────────────────────────────────────── */}
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
                          alt="PhD Guidance India"
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
                          alt="PhD Abroad Guidance"
                          fill
                          sizes="(max-width: 576px) 100vw, 50vw"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Programs Overview ──────────────────────────────────── */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Our Programs at a Glance
                </h3>
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  We offer four core programs designed to cover every stage of a researcher's academic career.
                  Each program is built around personalized mentoring, structured milestones, and measurable
                  outcomes — ensuring you get the most value from your investment in education.
                </p>

                {/* Programs Grid */}
                <div
                  className="row wow fadeInUp"
                  data-wow-delay=".3s"
                  style={{ marginBottom: 32 }}
                >
                  {programs.map((prog, i) => (
                    <div key={i} className="col-md-6" style={{ marginBottom: 20 }}>
                      <div style={{
                        background: "#f4f7fb", borderRadius: 12,
                        padding: "22px 24px", height: "100%",
                        borderLeft: "4px solid #1a5276",
                      }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{prog.icon}</div>
                        <h6 style={{ color: "#1a2e4a", fontWeight: 700, marginBottom: 6, fontSize: 16 }}>
                          {prog.title}
                        </h6>
                        <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 10px" }}>
                          {prog.desc}
                        </p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ background: "#1a5276", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4 }}>
                            ⏱ {prog.duration}
                          </span>
                          <span style={{ background: "#e8f0f8", color: "#1a5276", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4 }}>
                            📍 {prog.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Why Choose Us ──────────────────────────────────────── */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Why Choose Inspire Education Service?
                </h3>
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  With a decade of experience and a team of 50+ subject experts, Inspire Education Service
                  stands as India's most trusted PhD guidance institution. Our scholars have successfully
                  completed their doctorates at leading universities across India and abroad, published in
                  Scopus and SCI journals, and secured prestigious academic and industry positions. We do not
                  just guide — we walk the journey with you.
                </p>

                {/* ── Benefits ───────────────────────────────────────────── */}
                <div className="details-content-box">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="service-details-item wow fadeInUp"
                      data-wow-delay={`.${(index + 1) * 2}s`}
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
                  ))}
                </div>

                {/* ── FAQ ────────────────────────────────────────────────── */}
                <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Frequently Asked Questions
                </h3>
                <BootstrapWrapper>
                  <div className="accordion tj-faq style-2" id="faqCourseDetails">
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
                          data-bs-target={`#faq-course-${index + 1}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                        >
                          {faq.question}
                        </button>
                        <div
                          id={`faq-course-${index + 1}`}
                          className={`collapse ${index === 0 ? "show" : ""}`}
                          data-bs-parent="#faqCourseDetails"
                        >
                          <div className="accordion-body faq-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </BootstrapWrapper>

              </div>{/* end blog-text */}

              {/* ── Navigation ─────────────────────────────────────────────── */}
              <div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
                <div className="tj-nav__post previous">
                  <div className="tj-nav-post__nav prev_post">
                    <Link href="/services">
                      <span><i className="tji-arrow-left"></i></span>
                      Our Services
                    </Link>
                  </div>
                </div>
                <Link href="/application-form" className="tj-nav-post__grid">
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

            </div>{/* end post-details-wrapper */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;