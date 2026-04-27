"use client";
import { useState, useRef, useCallback } from "react";
import contactApi from "@/utils/contactApi";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

var EMPTY_FORM = { fullName: "", email: "", phone: "", subject: "", message: "" };

var FLOAT_IMAGES = [
  { src: "/enquiry-form/f-1.webp", alt: "Academic",     top: "8%",  left: "-30px", size: 90, delay: "0s",   dur: "6s"   },
  { src: "/enquiry-form/f-2.webp", alt: "Research",     top: "35%", left: "5%",    size: 75, delay: "1.2s", dur: "5.5s" },
  { src: "/enquiry-form/f-4.webp", alt: "Team",         top: "62%", left: "-20px", size: 82, delay: "0.6s", dur: "7s"   },
  { src: "/enquiry-form/f-3.webp", alt: "Consultation", top: "18%", right: "0px",  size: 70, delay: "1.8s", dur: "6.5s" },
];

/* ── Animated SVG Character ── */
function AnimatedCharacter({ charState }) {
  var isThinking = charState === "thinking";
  var isTyping   = charState === "typing";
  var isHappy    = charState === "happy";

  return (
    <svg
      viewBox="0 0 160 290"
      xmlns="http://www.w3.org/2000/svg"
      className={
        "c3-char-svg" +
        (isThinking ? " c3-char-thinking" : "") +
        (isHappy    ? " c3-char-happy"    : "")
      }
    >
      {/* Shadow */}
      <ellipse cx="80" cy="283" rx="40" ry="6" fill="rgba(0,0,0,.15)" />

      {/* Body group — bobs up/down */}
      <g className="c3-char-body">

        {/* Legs */}
        <rect x="58" y="200" width="19" height="65" rx="9.5" fill="#2c5f8a" />
        <rect x="83" y="200" width="19" height="65" rx="9.5" fill="#2c5f8a" />
        {/* Feet */}
        <ellipse cx="67"  cy="265" rx="14" ry="7" fill="#1a3d5c" />
        <ellipse cx="92"  cy="265" rx="14" ry="7" fill="#1a3d5c" />

        {/* Torso */}
        <rect x="46" y="118" width="68" height="92" rx="20" fill="#4a9fd4" />
        {/* Shirt collar V */}
        <path d="M73 118 L80 132 L87 118" fill="white" opacity=".9" />
        {/* Button strip */}
        <rect x="77" y="133" width="6" height="55" rx="2" fill="rgba(255,255,255,.18)" />

        {/* Left arm (idle) */}
        <rect x="30" y="122" width="16" height="52" rx="8" fill="#4a9fd4" />
        <ellipse cx="38" cy="174" rx="9" ry="9" fill="#f5c5a3" />

        {/* Right arm — waves when happy */}
        <g
          className={"c3-arm-right" + (isHappy ? " c3-arm-wave" : "")}
          style={{ transformOrigin: "112px 122px" }}
        >
          <rect x="114" y="122" width="16" height="52" rx="8" fill="#4a9fd4" />
          <ellipse cx="122" cy="174" rx="9" ry="9" fill="#f5c5a3" />
        </g>

        {/* Neck */}
        <rect x="71" y="103" width="18" height="20" rx="7" fill="#f5c5a3" />

        {/* Head */}
        <ellipse cx="80" cy="84" rx="35" ry="37" fill="#f5c5a3" />

        {/* Hair */}
        <path d="M45 74 Q47 43 80 41 Q113 43 115 74 Q106 56 80 56 Q54 56 45 74Z" fill="#3d2b1f" />
        <path d="M45 74 Q43 61 47 53" stroke="#3d2b1f" strokeWidth="9" fill="none" strokeLinecap="round" />

        {/* Ears */}
        <ellipse cx="45"  cy="84" rx="7" ry="9" fill="#f0b899" />
        <ellipse cx="115" cy="84" rx="7" ry="9" fill="#f0b899" />

        {/* Eyebrows — arch up when thinking */}
        <path
          d="M59 71 Q67 67 75 71"
          stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round"
          className={"c3-brow" + (isThinking ? " c3-brow-up" : "")}
          style={{ transformOrigin: "67px 69px" }}
        />
        <path
          d="M85 71 Q93 67 101 71"
          stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round"
          className={"c3-brow" + (isThinking ? " c3-brow-up" : "")}
          style={{ transformOrigin: "93px 69px" }}
        />

        {/* Eye whites */}
        <ellipse cx="67" cy="82" rx="8.5" ry="9" fill="white" />
        <ellipse cx="93" cy="82" rx="8.5" ry="9" fill="white" />

        {/* Pupils — blink */}
        <g className="c3-eye c3-eye1">
          <ellipse cx="68" cy="83" rx="5" ry="5.5" fill="#2c1810" />
          <circle  cx="70" cy="81" r="1.5" fill="white" />
        </g>
        <g className="c3-eye c3-eye2">
          <ellipse cx="94" cy="83" rx="5" ry="5.5" fill="#2c1810" />
          <circle  cx="96" cy="81" r="1.5" fill="white" />
        </g>

        {/* Cheeks */}
        <ellipse cx="56"  cy="95" rx="9" ry="5.5" fill="rgba(255,140,110,.28)" />
        <ellipse cx="104" cy="95" rx="9" ry="5.5" fill="rgba(255,140,110,.28)" />

        {/* Mouth — neutral / smile / open */}
        <path
          d="M72 100 Q80 105 88 100"
          stroke="#c0785a" strokeWidth="2.5" fill="none" strokeLinecap="round"
          style={{ opacity: (!isTyping && !isHappy) ? 1 : 0, transition: "opacity .25s" }}
        />
        <path
          d="M69 98 Q80 110 91 98"
          stroke="#c0785a" strokeWidth="2.5" fill="none" strokeLinecap="round"
          style={{ opacity: isHappy ? 1 : 0, transition: "opacity .25s" }}
        />
        <ellipse
          cx="80" cy="101" rx="7" ry="5"
          fill="#b06040"
          style={{ opacity: isTyping ? 1 : 0, transition: "opacity .25s" }}
        />
      </g>

      {/* Thinking bubble */}
      <g style={{ opacity: isThinking ? 1 : 0, transition: "opacity .4s" }}>
        <circle cx="102" cy="38" r="3.5" fill="rgba(255,255,255,.82)" />
        <circle cx="110" cy="28" r="5.5" fill="rgba(255,255,255,.88)" />
        <circle cx="122" cy="18" r="9"   fill="rgba(255,255,255,.93)" />
        <text x="122" y="22" textAnchor="middle" fontSize="10" fill="#3d96c2" fontFamily="sans-serif">...</text>
      </g>
    </svg>
  );
}

export default function Contact3() {
  var [form, setForm]       = useState(EMPTY_FORM);
  var [status, setStatus]   = useState("idle");
  var [errMsg, setErrMsg]   = useState("");
  var [charState, setChar]  = useState("idle");
  var submitting            = useRef(false);

  function handleChange(e) {
    var n = e.target.name, v = e.target.value;
    setForm(function(p) { var x = Object.assign({}, p); x[n] = v; return x; });
    setChar("typing");
  }

  var handleFocus = useCallback(function() { setChar("thinking"); }, []);
  var handleBlur  = useCallback(function() { setChar("idle"); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting.current) return;
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg("Please fill in all required fields."); setStatus("error"); setChar("idle"); return;
    }
    submitting.current = true; setStatus("loading"); setErrMsg(""); setChar("thinking");
    contactApi
      .submit({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        subject:  form.subject.trim(),
        message:  form.message.trim(),
      })
      .then(function(res) {
        if (res.data && res.data.success) {
          setStatus("success"); setForm(EMPTY_FORM); setChar("happy");
          setTimeout(function() { setChar("idle"); }, 4000);
        } else {
          setErrMsg((res.data && res.data.message) || "Something went wrong."); setStatus("error"); setChar("idle");
        }
      })
      .catch(function(err) {
        setErrMsg((err.response && err.response.data && err.response.data.message) || "Network error.");
        setStatus("error"); setChar("idle");
      })
      .finally(function() { submitting.current = false; });
  }

  var isLoading = status === "loading";

  /* Shared input event props */
  var inputEvents = { onFocus: handleFocus, onBlur: handleBlur, onChange: handleChange };

  return (
    <>
      <section className="c3-wrap">
        <div className="c3-blob c3-blob-1" />
        <div className="c3-blob c3-blob-2" />

        <div className="c3-container">

          {/* ════ LEFT — Animated character + floating images ════ */}
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

              {/* ── Animated SVG character (replaces static PERSON_IMAGE) ── */}
              <AnimatedCharacter charState={charState} />
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

                {/* Row 1 */}
                <div className="c3-grid2">
                  <div className="c3-field">
                    <label className="c3-label">Full Name <span className="c3-req">*</span></label>
                    <input className="c3-input" type="text" name="fullName"
                      value={form.fullName} placeholder="Full Name*" {...inputEvents} />
                  </div>
                  <div className="c3-field">
                    <label className="c3-label">Email Address <span className="c3-req">*</span></label>
                    <input className="c3-input" type="email" name="email"
                      value={form.email} placeholder="Email Address*" {...inputEvents} />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="c3-grid2">
                  <div className="c3-field">
                    <label className="c3-label">Phone number</label>
                    <input className="c3-input" type="tel" name="phone"
                      value={form.phone} placeholder="Phone number" {...inputEvents} />
                  </div>
                  <div className="c3-field">
                    <label className="c3-label">Subject</label>
                    <input className="c3-input" type="text" name="subject"
                      value={form.subject} placeholder="Enter subject" {...inputEvents} />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="c3-field c3-mb20">
                  <label className="c3-label">Message here... <span className="c3-req">*</span></label>
                  <textarea className="c3-input c3-ta" name="message"
                    value={form.message} placeholder="Type message*" {...inputEvents} />
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
        /* ── existing styles (unchanged) ── */
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

        /* ── NEW: Animated character styles ── */
        .c3-char-svg {
          display: block;
          width: 100%;
          max-width: 300px;
          height: auto;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 16px 36px rgba(0,0,0,.18));
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .c3-char-svg.c3-char-thinking {
          transform: rotate(-4deg) translateX(-6px);
        }
        .c3-char-svg.c3-char-happy {
          transform: translateY(-10px) scale(1.04);
        }

        /* Body bob */
        .c3-char-body {
          animation: c3-char-bob 3.2s ease-in-out infinite;
        }
        @keyframes c3-char-bob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }

        /* Eye blink */
        .c3-eye { animation: c3-blink 4.5s ease-in-out infinite; }
        .c3-eye2 { animation: c3-blink 4.5s ease-in-out 1.8s infinite; }
        @keyframes c3-blink {
          0%,88%,100% { transform: scaleY(1); }
          92%          { transform: scaleY(0.08); }
        }

        /* Eyebrow raise on thinking */
        .c3-brow {
          transition: transform .3s ease;
        }
        .c3-brow.c3-brow-up {
          transform: translateY(-4px);
        }

        /* Arm idle sway */
        .c3-arm-right {
          animation: c3-arm-idle 3.2s ease-in-out infinite;
        }
        @keyframes c3-arm-idle {
          0%,100% { transform: rotate(0deg); }
          50%      { transform: rotate(7deg); }
        }

        /* Arm wave on happy */
        .c3-arm-right.c3-arm-wave {
          animation: c3-arm-wave .7s ease-in-out 4;
        }
        @keyframes c3-arm-wave {
          0%   { transform: rotate(0deg);   }
          25%  { transform: rotate(-35deg); }
          75%  { transform: rotate(25deg);  }
          100% { transform: rotate(0deg);   }
        }

        /* Responsive */
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