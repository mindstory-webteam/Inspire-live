"use client";
import { useState, useRef } from "react";
import contactApi from "@/utils/contactApi";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

var EMPTY_FORM = { fullName: "", email: "", phone: "", subject: "", message: "" };

var PERSON_IMAGE = "/enquiry-form/p-2.webp";

var FLOAT_IMAGES = [
  { src: "/enquiry-form/f-1.webp",          alt: "Academic",     top: "8%",  left: "-30px", size: 90, delay: "0s",   dur: "6s"   },
  { src: "/enquiry-form/f-2.webp",  alt: "Research",     top: "35%", left: "5%",    size: 75, delay: "1.2s", dur: "5.5s" },
  { src: "/enquiry-form/f-4.webp",                      alt: "Team",         top: "62%", left: "-20px", size: 82, delay: "0.6s", dur: "7s"   },
  { src: "/enquiry-form/f-3.webp",  alt: "Consultation", top: "18%", right: "0px",  size: 70, delay: "1.8s", dur: "6.5s" },
 
];

export default function Contact3() {
  var [form, setForm]     = useState(EMPTY_FORM);
  var [status, setStatus] = useState("idle");
  var [errMsg, setErrMsg] = useState("");
  var submitting          = useRef(false);

  function handleChange(e) {
    var n = e.target.name, v = e.target.value;
    setForm(function(p) { var x = Object.assign({}, p); x[n] = v; return x; });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting.current) return;
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg("Please fill in all required fields."); setStatus("error"); return;
    }
    submitting.current = true; setStatus("loading"); setErrMsg("");
    contactApi
      .submit({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        subject:  form.subject.trim(),
        message:  form.message.trim(),
        source:   'Enquiry Form',  
      })
      .then(function(res) {
        if (res.data && res.data.success) { setStatus("success"); setForm(EMPTY_FORM); }
        else { setErrMsg((res.data && res.data.message) || "Something went wrong."); setStatus("error"); }
      })
      .catch(function(err) {
        setErrMsg((err.response && err.response.data && err.response.data.message) || "Network error.");
        setStatus("error");
      })
      .finally(function() { submitting.current = false; });
  }

  var isLoading = status === "loading";

  return (
    <>
      <section className="c3-wrap">
        <div className="c3-blob c3-blob-1" />
        <div className="c3-blob c3-blob-2" />

        <div className="c3-container">

          {/* ════ LEFT — Person + floating images ════ */}
          <div className="c3-person-col">
            <div className="c3-person-wrap">
              {FLOAT_IMAGES.map(function(img, i) {
                var style = {
                  top: img.top, width: img.size + "px", height: img.size + "px",
                  animationDelay: img.delay, animationDuration: img.dur,
                };
                if (img.left  !== undefined) style.left  = img.left;
                if (img.right !== undefined) style.right = img.right;
                return (
                  <div key={i} className="c3-fimg" style={style}>
                    <img src={img.src} alt={img.alt} />
                  </div>
                );
              })}
              <img src={PERSON_IMAGE} alt="Contact" className="c3-person-img" />
            </div>
          </div>

          {/* ════ RIGHT — Form card ════ */}
          <div className="c3-card-col">
            <div className="c3-card">

              <div className="c3-eyebrow-wrap">
                <span className="c3-eyebrow">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  GET IN TOUCH
                </span>
              </div>
              <h2 className="c3-title">Drop us a Line Here.</h2>

              {status === "success" && (
                <div className="c3-alert c3-ok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                    <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Message sent! We&apos;ll be in touch soon.
                </div>
              )}
              {status === "error" && (
                <div className="c3-alert c3-err">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#ef4444"/>
                    <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {errMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Row 1 — Full Name + Email */}
                <div className="c3-grid2">
                  <div className="c3-field">
                    <label className="c3-label">Full Name <span className="c3-req">*</span></label>
                    <input className="c3-input" type="text" name="fullName"
                      value={form.fullName} onChange={handleChange} placeholder="Full Name*" />
                  </div>
                  <div className="c3-field">
                    <label className="c3-label">Email Address <span className="c3-req">*</span></label>
                    <input className="c3-input" type="email" name="email"
                      value={form.email} onChange={handleChange} placeholder="Email Address*" />
                  </div>
                </div>

                {/* Row 2 — Phone + Subject (text input, was dropdown) */}
                <div className="c3-grid2">
                  <div className="c3-field">
                    <label className="c3-label">Phone number</label>
                    <input className="c3-input" type="tel" name="phone"
                      value={form.phone} onChange={handleChange} placeholder="Phone number" />
                  </div>
                  <div className="c3-field">
                    <label className="c3-label">Subject</label>
                    <input className="c3-input" type="text" name="subject"
                      value={form.subject} onChange={handleChange} placeholder="Enter subject" />
                  </div>
                </div>

                {/* Row 3 — Message */}
                <div className="c3-field c3-mb20">
                  <label className="c3-label">Message here... <span className="c3-req">*</span></label>
                  <textarea className="c3-input c3-ta" name="message"
                    value={form.message} onChange={handleChange} placeholder="Type message*" />
                </div>

                <div className={"c3-btn-wrap" + (isLoading ? " c3-btn-loading" : "")}>
                  <ButtonPrimary
                    type="submit"
                    text={isLoading ? "Sending…" : "Send Message"}
                    disabled={isLoading}
                  />
                  {isLoading && <span className="c3-spinner" />}
                </div>

              </form>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .c3-wrap {
          position: relative;
          background: linear-gradient(160deg, #90cee8 0%, #7dc0e0 40%, #6ab4d8 100%);
          padding: 60px 40px 0;
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow: hidden;
          min-height: 660px;
        }
        .c3-blob { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; opacity: .35; }
        .c3-blob-1 { width: 320px; height: 320px; background: #aad8f0; top: -80px; right: 35%; }
        .c3-blob-2 { width: 220px; height: 220px; background: #5aa8cc; bottom: 0; right: 15%; }

        .c3-container {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; align-items: flex-end; position: relative; z-index: 1;
        }

        .c3-person-col { display: flex; align-items: flex-end; justify-content: center; }
        .c3-person-wrap { position: relative; display: inline-block; width: 100%; max-width: 480px; }
        .c3-person-img {
          display: block; width: 100%; height: auto;
          object-fit: contain; object-position: bottom;
          filter: drop-shadow(0 16px 36px rgba(0,0,0,.18));
          position: relative; z-index: 2;
        }

        .c3-fimg {
          position: absolute; z-index: 3; border-radius: 50%; overflow: hidden;
          border: 3px solid rgba(255,255,255,.85);
          box-shadow: 0 8px 28px rgba(11,38,64,.22);
          animation: c3-drift linear infinite;
        }
        .c3-fimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @keyframes c3-drift {
          0%   { transform: translateX(-14px) translateY(0px)   rotate(-2deg); }
          25%  { transform: translateX(8px)   translateY(-8px)  rotate(1deg);  }
          50%  { transform: translateX(18px)  translateY(0px)   rotate(2deg);  }
          75%  { transform: translateX(6px)   translateY(8px)   rotate(-1deg); }
          100% { transform: translateX(-14px) translateY(0px)   rotate(-2deg); }
        }

        .c3-card-col { display: flex; align-items: center; padding: 40px 0 40px 16px; }
        .c3-card {
          background: rgba(255,255,255,.22); border: 1.5px solid rgba(255,255,255,.45);
          border-radius: 22px; padding: 34px 34px 38px; width: 100%;
          box-shadow: 0 8px 32px rgba(26,80,120,.12);
        }

        .c3-eyebrow-wrap { margin-bottom: 10px; }
        .c3-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1.5px dashed #1a4f72; color: #1a4f72;
          font-size: 11px; font-weight: 700; letter-spacing: .13em;
          text-transform: uppercase; padding: 5px 13px; border-radius: 6px;
        }
        .c3-title {
          font-size: clamp(22px, 3.2vw, 34px); font-weight: 800;
          color: #0b2640; margin: 0 0 22px; line-height: 1.1;
        }

        .c3-alert {
          display: flex; align-items: center; gap: 9px;
          border-radius: 9px; padding: 11px 14px; margin-bottom: 16px;
          font-size: 13px; font-weight: 600;
        }
        .c3-ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .c3-err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        .c3-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .c3-field  { display: flex; flex-direction: column; }
        .c3-mb20   { margin-bottom: 18px; }

        .c3-label { font-size: 13px; font-weight: 600; color: #0b2640; margin-bottom: 6px; }
        .c3-req   { color: #0b2640; }

        .c3-input {
          width: 100%; background: #ffffff; border: none; border-radius: 10px;
          padding: 13px 15px; font-size: 14px; color: #0b2640; outline: none;
          box-sizing: border-box; font-family: inherit; transition: box-shadow .2s;
          appearance: none; -webkit-appearance: none;
          box-shadow: 0 1px 4px rgba(26,80,120,.08);
        }
        .c3-input::placeholder { color: #a8c4d4; }
        .c3-input:focus { box-shadow: 0 0 0 2.5px rgba(26,80,120,.25), 0 1px 4px rgba(26,80,120,.08); }
        .c3-ta { min-height: 130px; resize: vertical; padding-top: 12px; }

        .c3-btn-wrap    { display: inline-flex; align-items: center; gap: 10px; }
        .c3-btn-loading { opacity: .65; pointer-events: none; }

        .c3-spinner {
          display: inline-block; width: 18px; height: 18px;
          border: 2.5px solid rgba(11,38,64,.2); border-top-color: #0b2640;
          border-radius: 50%; animation: c3-spin .7s linear infinite; flex-shrink: 0;
        }
        @keyframes c3-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .c3-container  { grid-template-columns: 1fr; }
          .c3-person-col { display: none; }
          .c3-card-col   { padding: 0; }
          .c3-wrap       { padding: 40px 20px; }
        }
        @media (max-width: 560px) {
          .c3-grid2 { grid-template-columns: 1fr; }
          .c3-card  { padding: 22px 18px 26px; }
        }
      `}</style>
    </>
  );
}