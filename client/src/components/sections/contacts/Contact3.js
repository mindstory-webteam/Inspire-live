"use client";
import { useState, useRef, useEffect } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import contactApi from "@/utils/contactApi";
import { getAllServices } from "@/utils/serviceApi";

var EMPTY_FORM = { fullName: "", email: "", phone: "", service: "", message: "" };

var Contact3 = function () {
  var formState           = useState(EMPTY_FORM);
  var form                = formState[0];
  var setForm             = formState[1];

  var statusState         = useState("idle");
  var status              = statusState[0];
  var setStatus           = statusState[1];

  var errMsgState         = useState("");
  var errMsg              = errMsgState[0];
  var setErrMsg           = errMsgState[1];

  var serviceOptionsState = useState([{ value: "", optionName: "Choose a Service" }]);
  var serviceOptions      = serviceOptionsState[0];
  var setServiceOptions   = serviceOptionsState[1];

  var submitting = useRef(false);

  useEffect(function () {
    getAllServices()
      .then(function (services) {
        // Guard: must be a real array of service objects
        if (!Array.isArray(services)) return;

        var opts = [{ value: "", optionName: "Choose a Service" }].concat(
          services
            .filter(function (s) {
              return (
                s &&
                typeof s === "object" &&
                typeof s.title === "string" &&
                s.title.trim() !== "" &&
                s.isActive
              );
            })
            .map(function (s) {
              return { value: s.title, optionName: s.title };
            })
        );
        setServiceOptions(opts);
      })
      .catch(function () {
        // keep default placeholder on error
      });
  }, []);

  function handleChange(e) {
    var name  = e.target.name;
    var value = e.target.value;
    setForm(function (prev) {
      var next = Object.assign({}, prev);
      next[name] = value;
      return next;
    });
  }

  function handleServiceChange(val) {
    setForm(function (prev) {
      return Object.assign({}, prev, { service: val });
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
        service:  form.service,
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

                  <div className="col-sm-6">
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

                  <div className="col-sm-6">
                    <div className="form-input">
                      <div className="tj-nice-select-box tj-select-constrained">
                        <div className="tj-select">
                          <ReactNiceSelect
                            key={serviceOptions.length}
                            selectedIndex={0}
                            options={serviceOptions}
                            onChange={handleServiceChange}
                          />
                        </div>
                      </div>
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
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d316440.5712687838!2d-74.01091796224334!3d40.67186885683901!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1745918398047!5m2!1sen!2sbd"
                title="Office Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fix dropdown width overflow */}
      <style>{`
        .tj-select-constrained,
        .tj-select-constrained .tj-select {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .tj-select-constrained .nice-select {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .tj-select-constrained .nice-select .list {
          width: 100% !important;
          max-width: 100% !important;
          left: 0 !important;
          right: 0 !important;
          box-sizing: border-box !important;
        }
        .tj-select-constrained .nice-select .list .option {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </section>
  );
};

export default Contact3;