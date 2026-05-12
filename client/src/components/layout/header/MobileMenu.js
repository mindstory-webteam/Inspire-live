"use client";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const FALLBACK = {
  phone:    { value: "+91 9947 945 945",                        href: "tel:+919947945945" },
  email:    { value: "inspireeduservice001@gmail.com",           href: "mailto:inspireeduservice001@gmail.com" },
  location: { value: "INSPIRE EDUCATION SERVICE, floor aazra arcade, near central excise office, mettupalayam, Palakkad - 678001" },
};

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [info, setInfo] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API_BASE}/contact-info`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success || !res.data?.length) return;

        const map = {};
        res.data.forEach((card) => {
          map[card.type] = card;
        });

        setInfo({
          phone: {
            value: map.phone?.lines?.[0]?.value || FALLBACK.phone.value,
            href:  map.phone?.lines?.[0]?.href  || FALLBACK.phone.href,
          },
          email: {
            value: map.email?.lines?.[0]?.value || FALLBACK.email.value,
            href:  map.email?.lines?.[0]?.href  || FALLBACK.email.href,
          },
          location: {
            value: map.location?.lines?.[0]?.value || FALLBACK.location.value,
          },
        });
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const handleClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div
        className={`body-overlay ${isMobileMenuOpen ? "opened" : ""}`}
        onClick={handleClick}
      />

      <div
        className={`hamburger-area d-lg-none ${isMobileMenuOpen ? "opened" : ""}`}
      >
        <div className="hamburger_bg" />
        <div className="hamburger_wrapper">
          <div className="hamburger_inner">

            {/* ── Top bar ── */}
            <div className="hamburger_top d-flex align-items-center justify-content-between">
              <div className="hamburger_logo">
                <Link href="/" className="mobile_logo">
                  <img src="/new-imges/logo/logo_inspire-03.png" alt="Logo" />
                </Link>
              </div>
              <div className="hamburger_close">
                <button className="hamburger_close_btn" onClick={handleClick}>
                  <i className="fa-thin fa-times" />
                </button>
              </div>
            </div>

            <MobileNavbar />

            {/* ── Contact info ── */}
            <div className="hamburger-infos">
              <h5 className="hamburger-title">Contact Info</h5>
              <div className="contact-info">

                <div className="contact-item">
                  <span className="subtitle">Phone</span>
                  <Link className="contact-link" href={info.phone.href}>
                    {info.phone.value}
                  </Link>
                </div>

                <div className="contact-item">
                  <span className="subtitle">Email</span>
                  <Link className="contact-link" href={info.email.href}>
                    {info.email.value}
                  </Link>
                </div>

                <div className="contact-item">
                  <span className="subtitle">Location</span>
                  <span className="contact-link">{info.location.value}</span>
                </div>

              </div>
            </div>
          </div>

          {/* ── Social links ── */}
          <div className="hamburger-socials">
            <h5 className="hamburger-title">Follow Us</h5>
            <div className="social-links style-3">
              <ul>
                <li>
                  <Link href="https://www.facebook.com/inspireeducationservice/" target="_blank">
                    <i className="fa-brands fa-facebook-f" />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/inspireeducationservice/" target="_blank">
                    <i className="fa-brands fa-instagram" />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/channel/UCxdf2JpHcvAuGhVweQiy6GA?app=desktop" target="_blank">
                    <i className="fa-brands fa-youtube" />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/" target="_blank">
                    <i className="fa-brands fa-linkedin-in" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MobileMenu;