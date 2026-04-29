"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [visible, setVisible] = useState(false);
  const [count, setCount]     = useState(5);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Countdown then redirect to home
    if (count <= 0) {
      window.location.href = "/";
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      <div className={`ty-wrap ${visible ? "ty-visible" : ""}`}>
        {/* Ambient blobs */}
        <div className="ty-blob ty-b1" />
        <div className="ty-blob ty-b2" />
        <div className="ty-blob ty-b3" />

        {/* Floating rings */}
        <div className="ty-ring ty-r1" />
        <div className="ty-ring ty-r2" />

        <div className="ty-card">
          {/* Animated checkmark */}
          <div className="ty-icon-wrap">
            <svg className="ty-check" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="ty-circle" cx="40" cy="40" r="36" stroke="white" strokeWidth="3" />
              <path  className="ty-tick"   d="M24 41l11 11 21-23" stroke="white" strokeWidth="3.5"
                     strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="ty-pulse" />
          </div>

          <p className="ty-eyebrow">Message Received</p>
          <h1 className="ty-heading">Thank You!</h1>
          <p className="ty-body">
            We've received your message and will get back to you as soon as possible.
            Our team typically responds within <strong>24 hours</strong>.
          </p>

          <div className="ty-divider" />

          <div className="ty-actions">
            <Link href="/" className="ty-btn-primary">
              Back to Home
            </Link>
           
          </div>

          <p className="ty-redirect">
            Redirecting you home in{" "}
            <span className="ty-count">{count}</span>s…
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ty-wrap {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(145deg, #90cee8 0%, #6ab4d8 45%, #4a9dc7 100%);
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family: "Mona Sans","Mona Sans Fallback";
          opacity: 0;
          transition: opacity .5s ease;
        }
        .ty-wrap.ty-visible { opacity: 1; }

        /* Blobs */
        .ty-blob {
          position: absolute; border-radius: 50%;
          filter: blur(60px); pointer-events: none; opacity: .35;
        }
        .ty-b1 { width: 350px; height: 350px; background: #aad8f0; top: -80px;  left: -60px;  }
        .ty-b2 { width: 250px; height: 250px; background: #5aa8cc; bottom: -60px; right: -40px; }
        .ty-b3 { width: 180px; height: 180px; background: #b8e4f9; top: 40%;    right: 10%;   animation: ty-float 8s ease-in-out infinite; }

        /* Rings */
        .ty-ring {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,.2);
          pointer-events: none; animation: ty-expand 7s ease-out infinite;
        }
        .ty-r1 { width: 500px; height: 500px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .ty-r2 { width: 700px; height: 700px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-delay: 3.5s; }

        @keyframes ty-expand {
          0%   { transform: translate(-50%,-50%) scale(.6); opacity: .5; }
          100% { transform: translate(-50%,-50%) scale(1.2); opacity: 0; }
        }
        @keyframes ty-float {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-18px); }
        }

        /* Card */
        .ty-card {
          position: relative; z-index: 2;
          background: rgba(255,255,255,.22);
          border: 1.5px solid rgba(255,255,255,.5);
          border-radius: 28px;
          padding: 52px 48px 44px;
          max-width: 520px; width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(11,38,64,.18), 0 1px 0 rgba(255,255,255,.5) inset;
          backdrop-filter: blur(12px);
          transform: translateY(30px);
          transition: transform .6s cubic-bezier(.22,1,.36,1) .1s, opacity .5s ease .1s;
          opacity: 0;
        }
        .ty-visible .ty-card {
          transform: translateY(0);
          opacity: 1;
        }

        /* Icon */
        .ty-icon-wrap {
          position: relative; display: inline-flex;
          align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .ty-check { width: 80px; height: 80px; position: relative; z-index: 1; }

        .ty-circle {
          stroke-dasharray: 226;
          stroke-dashoffset: 226;
          animation: ty-draw-circle .7s cubic-bezier(.65,0,.35,1) .3s forwards;
        }
        .ty-tick {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: ty-draw-tick .45s cubic-bezier(.65,0,.35,1) .95s forwards;
        }
        @keyframes ty-draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ty-draw-tick {
          to { stroke-dashoffset: 0; }
        }

        .ty-pulse {
          position: absolute; inset: -12px;
          border-radius: 50%;
          background: rgba(255,255,255,.15);
          animation: ty-pulse 2.2s ease-out 1.4s infinite;
        }
        @keyframes ty-pulse {
          0%   { transform: scale(.85); opacity: .7; }
          70%  { transform: scale(1.3);  opacity: 0;  }
          100% { transform: scale(1.3);  opacity: 0;  }
        }

        /* Text */
        .ty-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: rgba(11,38,64,.65);
          margin-bottom: 8px;
          opacity: 0; animation: ty-fade-up .5s ease .8s forwards;
        }
        .ty-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 52px);
          font-weight: 800; color: #0b2640;
          line-height: 1.05; margin-bottom: 16px;
          opacity: 0; animation: ty-fade-up .5s ease .95s forwards;
        }
        .ty-body {
          font-size: 15px; line-height: 1.7; color: rgba(11,38,64,.75);
          margin-bottom: 28px;
          opacity: 0; animation: ty-fade-up .5s ease 1.1s forwards;
        }
        .ty-body strong { color: #0b2640; font-weight: 600; }

        .ty-divider {
          width: 48px; height: 2px;
          background: rgba(11,38,64,.2);
          border-radius: 2px; margin: 0 auto 28px;
          opacity: 0; animation: ty-fade-up .5s ease 1.2s forwards;
        }

        /* Buttons */
        .ty-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 24px;
          opacity: 0; animation: ty-fade-up .5s ease 1.3s forwards;
        }
        .ty-btn-primary, .ty-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 13px 28px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
          cursor: pointer;
        }
        .ty-btn-primary {
          background: #0b2640; color: #fff;
          box-shadow: 0 4px 18px rgba(11,38,64,.28);
        }
        .ty-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(11,38,64,.36);
        }
        .ty-btn-ghost {
          background: rgba(255,255,255,.35);
          border: 1.5px solid rgba(255,255,255,.6);
          color: #0b2640;
        }
        .ty-btn-ghost:hover {
          background: rgba(255,255,255,.55);
          transform: translateY(-2px);
        }

        /* Countdown */
        .ty-redirect {
          font-size: 12px; color: rgba(11,38,64,.5);
          opacity: 0; animation: ty-fade-up .5s ease 1.5s forwards;
        }
        .ty-count {
          display: inline-block; font-weight: 700; color: #0b2640;
          min-width: 14px; text-align: center;
        }

        @keyframes ty-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @media (max-width: 560px) {
          .ty-card { padding: 36px 24px 32px; }
          .ty-actions { flex-direction: column; }
          .ty-btn-primary, .ty-btn-ghost { width: 100%; }
        }
      `}</style>
    </>
  );
}