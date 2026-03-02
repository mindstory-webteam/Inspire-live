"use client";
import { useState, useRef } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import contactApi from "@/utils/contactApi";

const SERVICE_OPTIONS = [
  { value: "",                         optionName: "Choose a Service" },
  { value: "Business Strategy",        optionName: "Business Strategy" },
  { value: "Customer Experience",      optionName: "Customer Experience" },
  { value: "Sustainability and ESG",   optionName: "Sustainability and ESG" },
  { value: "Training and Development", optionName: "Training and Development" },
  { value: "IT Support & Maintenance", optionName: "IT Support & Maintenance" },
  { value: "Marketing Strategy",       optionName: "Marketing Strategy" },
];

const EMPTY_FORM = { fullName: "", email: "", phone: "", service: "", message: "" };

const Contact3 = () => {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const submitting = useRef(false); // ← prevents double-submit

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleServiceChange = (val) =>
    setForm((prev) => ({ ...prev, service: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block if already in-flight
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

  return (
    <section className="tj-contact-section-2 section-bottom-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="contact-form wow fadeInUp" data-wow-delay=".1s">
              <h3 className="title">
                Feel Free to Get in Touch or Visit our Location.
              </h3>

              {/* ── Success Banner ── */}
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

              {/* ── Error Banner ── */}
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

              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-sm-6">
                    <div className="form-input">
                      <input type="text" name="fullName" value={form.fullName}
                        onChange={handleChange} placeholder="Full Name*" />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <input type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder="Email Address*" />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <input type="tel" name="phone" value={form.phone}
                        onChange={handleChange} placeholder="Phone number" />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <div className="tj-nice-select-box">
                        <div className="tj-select">
                          <ReactNiceSelect
                            selectedIndex={0}
                            options={SERVICE_OPTIONS}
                            onChange={handleServiceChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-input message-input">
                      <textarea name="message" id="message" value={form.message}
                        onChange={handleChange} placeholder="Type message*" />
                    </div>
                  </div>

                  <div className="submit-btn">
                    <ButtonPrimary
                      type="submit"
                      text={status === "loading" ? "Sending…" : "Submit Now"}
                      disabled={status === "loading"}
                    />
                  </div>

                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="map-area wow fadeInUp" data-wow-delay=".3s">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d316440.5712687838!2d-74.01091796224334!3d40.67186885683901!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1745918398047!5m2!1sen!2sbd"
                title="Office Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact3;