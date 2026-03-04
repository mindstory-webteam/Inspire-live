"use client";
import TestimonialsCard2 from "@/components/shared/cards/TestimonialsCard2";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import contactApi from "@/utils/contactApi";
import { getTestimonialsClient } from "@/utils/testimonialApi";

// ── Service options ───────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  { value: "",                           optionName: "Choose a Service"          },
  { value: "Business Strategy",          optionName: "Business Strategy"         },
  { value: "Customer Experience",        optionName: "Customer Experience"       },
  { value: "Sustainability and ESG",     optionName: "Sustainability and ESG"    },
  { value: "Training and Development",   optionName: "Training and Development"  },
  { value: "IT Support & Maintenance",   optionName: "IT Support & Maintenance"  },
  { value: "Marketing Strategy",         optionName: "Marketing Strategy"        },
];

const EMPTY_FORM = { fullName: "", email: "", phone: "", service: "", message: "" };

// ─────────────────────────────────────────────────────────────────────────────
const Testimonials4 = () => {
  // ── Testimonials state ────────────────────────────────────────────────────
  const [testimonials, setTestimonials] = useState([]);

  // ── Contact form state ────────────────────────────────────────────────────
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const submitting = useRef(false);

  // ── Fetch testimonials ────────────────────────────────────────────────────
  useEffect(() => {
    getTestimonialsClient()
      .then(res => setTestimonials(res.data?.data ?? []))
      .catch(() => setTestimonials([]));
  }, []);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleServiceChange = (option) =>
    setForm(prev => ({ ...prev, service: option?.value || "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;

    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg("Please fill in all required fields (Name, Email, Message).");
      setStatus("error");
      return;
    }

    submitting.current = true;
    setStatus("loading");
    setErrMsg("");

    try {
      const res = await contactApi.submit({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        service:  form.service,
        message:  form.message.trim(),
      });

      if (res.data?.success) {
        setStatus("success");
        setForm(EMPTY_FORM);
      } else {
        setErrMsg(res.data?.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrMsg(
        err.response?.data?.message ||
        "Network error. Please check your connection and try again."
      );
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  };

  const displayTestimonials = testimonials.slice(0, 3);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="tj-contact-section h4-contact-section section-gap section-gap-x">
      <div className="container">
        <div className="row">

          {/* ── LEFT: Contact Form ── */}
          <div className="col-lg-6">
            <div className="contact-form style-3 wow fadeInUp" data-wow-delay=".4s">

              <div className="sec-heading style-4">
                <span className="sub-title">
                  <i className="tji-box"></i>Get in Touch
                </span>
                <h2 className="sec-title title-anim">Drop us a Line Here.</h2>
              </div>

              {/* Success banner */}
              {status === "success" && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: "14px 18px", marginBottom: 20,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#22c55e" />
                    <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: "#15803d", fontWeight: 600, fontSize: 14 }}>
                    Thank you! Your message has been sent. We&apos;ll be in touch soon.
                  </span>
                </div>
              )}

              {/* Error banner */}
              {status === "error" && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 10, padding: "14px 18px", marginBottom: 20,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#ef4444" />
                    <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2"
                      strokeLinecap="round" />
                  </svg>
                  <span style={{ color: "#dc2626", fontWeight: 600, fontSize: 14 }}>
                    {errMsg}
                  </span>
                </div>
              )}

              <form id="contact-form-3" onSubmit={handleSubmit}>
                <div className="row wow fadeInUp" data-wow-delay=".5s">

                  <div className="col-sm-6">
                    <div className="form-input">
                      <label className="cf-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name*"
						style={{ color: "#ffffff " }}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <label className="cf-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address*"
						style={{ color: "#ffffff " }}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <label className="cf-label">Phone number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
						style={{ color: "#ffffff " }}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <div className="tj-nice-select-box">
                        <div className="tj-select">
                          <label className="cf-label">Choose a option</label>
                          <ReactNiceSelect
                            selectedIndex={0}
                            options={SERVICE_OPTIONS}
                            getSelectedOption={handleServiceChange}
							style={{ color: "#ffffff " }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-input message-input">
                      <label className="cf-label">Message here... *</label>
                      <textarea
                        name="message"
                        id="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Type message*"
						style={{ color: "#ffffff " }}
                      />
                    </div>
                  </div>

                  <div className="submit-btn">
                    <ButtonPrimary
                      type="submit"
                      text={status === "loading" ? "Sending…" : "Send Message"}
                      disabled={status === "loading"}
                    />
                  </div>

                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Testimonials Slider ── */}
          <div className="col-lg-6">
            <div
              className="testimonial-wrapper-3 h4-testimonial-wrapper wow fadeInUp"
              data-wow-delay=".5s"
            >
              <h3 className="tes-title">
                Client Feedback <span>(4.8 / out of 200)</span>
              </h3>

              {displayTestimonials.length > 0 ? (
                <Swiper
                  spaceBetween={28}
                  slidesPerView={1}
                  loop={true}
                  speed={1500}
                  autoplay={{ delay: 3000 }}
                  navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
                  modules={[Autoplay, Navigation]}
                  className="testimonial-slider-2 h4-testimonial"
                >
                  {displayTestimonials.map((testimonial, idx) => (
                    <SwiperSlide key={testimonial._id || idx}>
                      <TestimonialsCard2 testimonial={testimonial} />
                    </SwiperSlide>
                  ))}
                  <div className="testimonial-navigation d-flex">
                    <div className="slider-prev" role="button">
                      <span className="anim-icon">
                        <i className="tji-arrow-left"></i>
                        <i className="tji-arrow-left"></i>
                      </span>
                    </div>
                    <div className="slider-next" role="button">
                      <span className="anim-icon">
                        <i className="tji-arrow-right"></i>
                        <i className="tji-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Swiper>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 24 }}>
                  No testimonials available yet.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials4;