"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeNewsletter } from "../../../utils/newsletterApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const STATIC_SERVICES = [];

const FALLBACK_CONTACT = {
  phone: { value: "+91 9947 945 945", href: "tel:+919947945945" },
  email: { value: "inspireeduservice001@gmail.com", href: "mailto:inspireeduservice001@gmail.com" },
};

const Footer = () => {
  const [services,    setServices]    = useState([]);
  const [contact,     setContact]     = useState(FALLBACK_CONTACT);
  const [email,       setEmail]       = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);

    // ── Fetch services ──────────────────────────────────────────────
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

    // ── Fetch contact info ──────────────────────────────────────────
    fetch(API_BASE + "/contact-info")
      .then((res) => res.json())
      .then((res) => {
        if (!res.success || !res.data?.length) return;
        const map = {};
        res.data.forEach((card) => { map[card.type] = card; });

        setContact({
          phone: {
            value: map.phone?.lines?.[0]?.value || FALLBACK_CONTACT.phone.value,
            href:  map.phone?.lines?.[0]?.href  || FALLBACK_CONTACT.phone.href,
          },
          email: {
            value: map.email?.lines?.[0]?.value || FALLBACK_CONTACT.email.value,
            href:  map.email?.lines?.[0]?.href  || FALLBACK_CONTACT.email.href,
          },
        });
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    if (!email.trim()) {
      setFormMessage({ type: "error", text: "Please enter your email address." });
      return;
    }
    if (!agreed) {
      setFormMessage({ type: "error", text: "Please agree to the Terms & Conditions." });
      return;
    }

    setSubmitting(true);
    try {
      const data = await subscribeNewsletter({ email: email.trim(), agreedToTerms: agreed });
      if (data.success) {
        setFormMessage({ type: "success", text: data.message || "Subscribed successfully!" });
        setEmail("");
        setAgreed(false);
      } else {
        setFormMessage({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch {
      setFormMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const staticPaths     = new Set(STATIC_SERVICES.map((s) => s.path));
  const dynamicServices = services.filter((s) => !staticPaths.has(s.path));
  const allServices     = [...STATIC_SERVICES, ...dynamicServices];

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
                    <img src="/new-imges/logo/logo_inspire-03.png" alt="Logos" />
                  </Link>
                </div>
                <div className="footer-text">
                  <p>
                    Developing personalze our customer journeys to increase
                    satisfaction &amp; loyalty of our expansion.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Services ── */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget widget-nav-menu wow fadeInUp" data-wow-delay=".3s">
                <h5 className="title">Services</h5>
                <ul>
                  {allServices.map((service) => (
                    <li key={service.id}>
                      <Link href={service.path}>{service.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Resources ── */}
            <div className="col-xl-2 col-lg-4 col-md-6">
              <div className="footer-widget widget-nav-menu wow fadeInUp" data-wow-delay=".5s">
                <h5 className="title">Resources</h5>
                <ul>
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/team">Team Member</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                  <li><Link href="/blogs">Blog</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* ── Newsletter ── */}
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div className="footer-widget widget-subscribe wow fadeInUp" data-wow-delay=".7s">
                <h3 className="title">Subscribe to Our Newsletter.</h3>
                <div className="subscribe-form">
                  {mounted && (
                    <form onSubmit={handleSubscribe} noValidate>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={submitting}
                        autoComplete="email"
                      />
                      <button type="submit" disabled={submitting}>
                        {submitting ? (
                          <span style={{ fontSize: "11px" }}>...</span>
                        ) : (
                          <i className="tji-plane"></i>
                        )}
                      </button>
                      <label htmlFor="footer-agree">
                        <input
                          id="footer-agree"
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          disabled={submitting}
                        />
                        Agree to our{" "}
                        <Link href="/terms-and-conditions">Terms &amp; Condition?</Link>
                      </label>
                    </form>
                  )}
                  {formMessage && (
                    <p style={{
                      marginTop:  "8px",
                      fontSize:   "13px",
                      fontWeight: "500",
                      color: formMessage.type === "success" ? "#4ade80" : "#f87171",
                    }}>
                      {formMessage.text}
                    </p>
                  )}
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
                      <Link href={contact.phone.href}>
                        <span className="icon"><i className="tji-phone-2"></i></span>
                        <span className="text">{contact.phone.value}</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={contact.email.href}>
                        <span className="icon"><i className="tji-envelop-2"></i></span>
                        <span className="text">{contact.email.value}</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="social-links">
                  <ul>
                    <li>
                      <Link href="https://www.facebook.com/inspireeducationservice/#" target="_blank">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/inspireeducationservice" target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.youtube.com/channel/UCxdf2JpHcvAuGhVweQiy6GA?app=desktop" target="_blank">
                        <i className="fa-brands fa-youtube"></i>
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
                    &copy; 2026{" "}
                    <Link href="https://themeforest.net/user/theme-junction/portfolio" target="_blank">
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