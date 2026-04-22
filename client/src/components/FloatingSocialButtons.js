"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const SOCIAL_LINKS = [
  {
    icon: "fab fa-whatsapp",
    url: "https://wa.me/919876543210",
    label: "WhatsApp",
    color: "#25d366"
  },
  {
    icon: "fas fa-phone-alt",
    url: "tel:+919876543210",
    label: "Call",
    color: "#0a66c2"
  },
  {
    icon: "fas fa-envelope",
    url: "mailto:info@inspireeducationservice.com",
    label: "Email",
    color: "#ea4335"
  }
];

const FloatingSocialButtons = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(80px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(0,0,0, 0.25); }
          70%  { box-shadow: 0 0 0 8px rgba(0,0,0, 0);    }
          100% { box-shadow: 0 0 0 0   rgba(0,0,0, 0);    }
        }

        .fsb-wrapper {
          position: fixed;
          right: 0;
          top: 30%;
          transform: translateY(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Each social item row */
        .fsb-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
        }

        /* Label tooltip */
        .fsb-label {
          color: #fff;
          font-size: 11.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          padding: 0 10px 0 12px;
          height: 36px;
          display: flex;
          align-items: center;
          border-radius: 6px 0 0 6px;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          pointer-events: none;
          transition:
            max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            opacity   0.25s ease,
            padding   0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fsb-item:hover .fsb-label,
        .fsb-item.hovered .fsb-label {
          max-width: 120px;
          opacity: 1;
          padding: 0 10px 0 12px;
        }

        /* Icon button */
        .fsb-btn {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px 0 0 6px;
          text-decoration: none;
          flex-shrink: 0;
          position: relative;
          transition:
            width       0.3s cubic-bezier(0.4, 0, 0.2, 1),
            height      0.3s cubic-bezier(0.4, 0, 0.2, 1),
            border-radius 0.3s ease,
            box-shadow  0.3s ease,
            transform   0.2s ease;
        }

        /* Scrolled: shrink to small pill */
        .fsb-btn.scrolled {
          width: 32px;
          height: 32px;
          border-radius: 4px 0 0 4px;
          animation: pulse-ring 2.5s ease-out infinite;
        }

        .fsb-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(0,0,0,.22);
          animation: none !important;
        }

        .fsb-btn i {
          color: #fff;
          font-size: 15px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fsb-btn.scrolled i {
          font-size: 13px;
        }

        .fsb-btn:hover i {
          transform: scale(1.15) rotate(-8deg);
        }

        /* Right edge accent line */
        .fsb-btn::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: rgba(255,255,255,.35);
          border-radius: 2px;
          transition: opacity 0.2s;
        }
        .fsb-btn:hover::after { opacity: 0; }

        @media (max-width: 480px) {
          .fsb-btn        { width: 34px; height: 34px; }
          .fsb-btn.scrolled { width: 28px; height: 28px; }
          .fsb-btn i      { font-size: 13px; }
        }
      `}</style>

      <div className="fsb-wrapper">
        {SOCIAL_LINKS.map((social, i) => (
          <div
            key={i}
            className={`fsb-item${hoveredIndex === i ? " hovered" : ""}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Slide-out label */}
            <span
              className="fsb-label"
              style={{ background: social.color }}
            >
              {social.label}
            </span>

            {/* Icon */}
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`fsb-btn${isScrolled ? " scrolled" : ""}`}
              style={{ background: social.color }}
            >
              <i className={social.icon} />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default FloatingSocialButtons;