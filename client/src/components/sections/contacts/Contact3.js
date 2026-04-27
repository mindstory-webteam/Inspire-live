"use client";
import { useState, useRef } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import contactApi from "@/utils/contactApi";

var EMPTY_FORM = { fullName: "", email: "", phone: "", message: "", subject: "" };

var Contact3 = function () {
  var formState   = useState(EMPTY_FORM);
  var form        = formState[0];
  var setForm     = formState[1];

  var statusState = useState("idle");
  var status      = statusState[0];
  var setStatus   = statusState[1];

  var errMsgState = useState("");
  var errMsg      = errMsgState[0];
  var setErrMsg   = errMsgState[1];

  var submitting = useRef(false);

  function handleChange(e) {
    var name  = e.target.name;
    var value = e.target.value;
    setForm(function (prev) {
      var next = Object.assign({}, prev);
      next[name] = value;
      return next;
    });
  }

  function handleSubmit(e) {
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

    contactApi
      .submit({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
         subject:  form.subject.trim(),
        message:  form.message.trim(),
      })
      .then(function (res) {
        if (res.data && res.data.success) {
          setStatus("success");
          setForm(EMPTY_FORM);
        } else {
          setErrMsg(
            (res.data && res.data.message) ||
            "Something went wrong. Please try again."
          );
          setStatus("error");
        }
      })
      .catch(function (err) {
        setErrMsg(
          (err.response && err.response.data && err.response.data.message) ||
          "Network error. Please check your connection and try again."
        );
        setStatus("error");
      })
      .finally(function () {
        submitting.current = false;
      });
  }

  return (
    <section className="tj-contact-section-2 section-bottom-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="contact-form wow fadeInUp" data-wow-delay=".1s">
              <h3 className="title">
                Feel Free to Get in Touch or Visit our Location.
              </h3>

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
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name*"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-input">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address*"
                      />
                    </div>
                  </div>
                  <div className="col-sm-12">
  <div className="form-input">
    <input
      type="text"
      name="subject"
      value={form.subject}
      onChange={handleChange}
      placeholder="Subject"
    />
  </div>
</div>

                  <div className="col-sm-12">
                    <div className="form-input">
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-input message-input">
                      <textarea
                        name="message"
                        id="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Type message*"
                      />
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.542481756926!2d76.6592754750418!3d10.769700389378642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba86de3f032c3bf%3A0x9748913a691cbde4!2sINSPIRE%20EDUCATION%20SERVICE%20Study%20Abroad%20%26%20PhD%20consultants!5e0!3m2!1sen!2sin!4v1775810312618!5m2!1sen!2sin"
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