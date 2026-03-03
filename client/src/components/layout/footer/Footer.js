"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const Footer = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "/services")
      .then((res) => res.json())
      .then((data) => {
        const items = data.data || [];
        setServices(
          items.map((s) => ({
            id:   s._id,
            name: s.title,
            path: "/services/" + (s.slug || s._id),
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="tj-footer-section footer-1 section-gap-x">
      <div className="footer-main-area">
        <div className="container">
          <div className="row justify-content-between">

            {/* ── Brand / About ── */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget wow fadeInUp" data-wow-delay=".1s">
                <div className="footer-logo">
                  <Link href="/">
                    <img src="/new-imges/logo/logo_inspire-01.png" alt="Logos" />
                  </Link>
                </div>
                <div className="footer-text">
                  <p>
                    Developing personalze our customer journeys to increase
                    satisfaction &amp; loyalty of our expansion.
                  </p>
                </div>
                <div className="award-logo-area">
                  <div className="award-logo">
                    <img src="/images/footer/award-logo-1.webp" alt="" />
                  </div>
                  <div className="award-logo">
                    <img src="/images/footer/award-logo-2.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Services (dynamic from API) ── */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="footer-widget widget-nav-menu wow fadeInUp"
                data-wow-delay=".3s"
              >
                <h5 className="title">Services</h5>
                <ul>
                  {services.length === 0 ? (
                    /* Fallback static links while loading or if API fails */
                    <>
                      <li><Link href="/services/phd-india">PhD India</Link></li>
                      <li><Link href="/services/study-abroad">Study Abroad</Link></li>
                      <li><Link href="/services/phd-abroad">PhD Abroad</Link></li>
                    </>
                  ) : (
                    services.map((service) => (
                      <li key={service.id}>
                        <Link href={service.path}>{service.name}</Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* ── Resources ── */}
            <div className="col-xl-2 col-lg-4 col-md-6">
              <div
                className="footer-widget widget-nav-menu wow fadeInUp"
                data-wow-delay=".5s"
              >
                <h5 className="title">Resources</h5>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/history">Our history</Link></li>
                  <li><Link href="/events">Events</Link></li>
                  <li><Link href="/team">Team Member</Link></li>
                  <li>
                    <Link href="/careers">
                      Careers <span className="badge">New</span>
                    </Link>
                  </li>
                  <li><Link href="/blog-grid">Blog</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* ── Newsletter ── */}
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div
                className="footer-widget widget-subscribe wow fadeInUp"
                data-wow-delay=".7s"
              >
                <h3 className="title">Subscribe to Our Newsletter.</h3>
                <div className="subscribe-form">
                  <form action="#">
                    <input type="email" name="email" placeholder="Enter email" />
                    <button type="submit">
                      <i className="tji-plane"></i>
                    </button>
                    <label htmlFor="agree">
                      <input id="agree" type="checkbox" />
                      Agree to our{" "}
                      <Link href="/terms-and-conditions">Terms &amp; Condition?</Link>
                    </label>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="tj-copyright-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="copyright-content-area">
                <div className="footer-contact">
                  <ul>
                    <li>
                      <Link href="tel:10095447818">
                        <span className="icon"><i className="tji-phone-2"></i></span>
                        <span className="text">+1 (009) 544-7818</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="mailto:info@bexon.com">
                        <span className="icon"><i className="tji-envelop-2"></i></span>
                        <span className="text">info@bexon.com</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="social-links">
                  <ul>
                    <li>
                      <Link href="https://www.facebook.com/" target="_blank">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/" target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://x.com/" target="_blank">
                        <i className="fa-brands fa-x-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.linkedin.com/" target="_blank">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="copyright-text">
                  <p>
                    &copy; 2025{" "}
                    <Link
                      href="https://themeforest.net/user/theme-junction/portfolio"
                      target="_blank"
                    >
                      Inspire
                    </Link>{" "}
                    All right reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;