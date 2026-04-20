"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeNewsletter } from "../../../utils/newsletterApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";

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
  <style>{`
    .mindstory-logo-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      margin-left: 4px;
    }
    .mindstory-logo-wrap svg {
      filter: grayscale(1) brightness(0.5);
      transition: filter 0.3s ease;
    }
    .mindstory-logo-wrap:hover svg {
      filter: none;
    }
  `}</style>
  <p>
    &copy; 2026{" "}
    <Link href="https://themeforest.net/user/theme-junction/portfolio" target="_blank">
      Inspire
    </Link>{" "}
    All right reserved | Design By{""}
    
     <a href="https://mindstory.in"
      target="_blank"
      rel="noopener noreferrer"
      className="mindstory-logo-wrap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 218.84 43.38"
        style={{ height: "22px", width: "auto" }}
      >
        <g>
          <path d="M12.82,27.86v-12.67h-2.38v-4.76h4.88v2.85h1.28c.62-1.01,1.42-1.79,2.41-2.34.99-.55,2.21-.83,3.66-.83s2.59.25,3.59.74c1,.49,1.8,1.23,2.4,2.19h.12c1.34-1.96,3.32-2.93,5.96-2.93,2.25,0,4.03.65,5.35,1.96,1.32,1.31,1.98,3.08,1.98,5.3v10.49h-4.82v-9.56c0-2.6-1.23-3.89-3.69-3.89s-3.69,1.3-3.69,3.89v9.56h-4.82v-9.56c0-2.6-1.25-3.89-3.75-3.89-1.2,0-2.11.32-2.72.96-.61.64-.92,1.62-.92,2.93v9.56h-4.82Z" style={{fill:"#95257b"}}/>
          <path d="M45.74,34.84v-3.86h3.83l1.37-3.25-7.52-17.29h5.11l4.88,11.74h.12l4.76-11.74h4.94l-7.47,17.43-1.42,3.37c-.48,1.14-1.05,2.03-1.69,2.66-.64.63-1.62.94-2.93.94h-3.98Z" style={{fill:"#95257b"}}/>
          <path d="M66.57,27.86v-12.67h-2.38v-4.76h4.88v2.85h1.22c.68-1.01,1.53-1.79,2.56-2.34,1.03-.55,2.3-.83,3.83-.83,2.42,0,4.29.66,5.62,1.99,1.33,1.33,1.99,3.1,1.99,5.33v10.43h-4.82v-9.53c0-1.28-.34-2.25-1.03-2.92-.69-.67-1.69-1-3.01-1s-2.32.33-3.01,1c-.69.67-1.03,1.64-1.03,2.92v9.53h-4.82Z" style={{fill:"#95257b"}}/>
          <path d="M95.36,28.21c-1.78,0-3.3-.38-4.55-1.13-1.25-.76-2.19-1.82-2.83-3.18-.64-1.37-.96-2.95-.96-4.75s.31-3.41.93-4.78c.62-1.37,1.53-2.42,2.72-3.17,1.19-.75,2.62-1.12,4.29-1.12,1.28,0,2.38.24,3.3.71.92.47,1.63,1.15,2.14,2.02h.12V3.46h4.82v19.64h2.38v4.76h-4.88v-2.85h-1.22c-.62,1.01-1.45,1.79-2.48,2.35-1.04.56-2.29.84-3.76.84ZM96.27,24.03c1.3,0,2.33-.36,3.09-1.09.76-.73,1.15-1.73,1.15-3.01v-1.57c0-1.28-.38-2.28-1.15-3.01-.77-.73-1.8-1.09-3.09-1.09-1.47,0-2.58.44-3.31,1.31-.74.87-1.1,2.06-1.1,3.57s.37,2.7,1.1,3.57c.74.87,1.84,1.31,3.31,1.31Z" style={{fill:"#95257b"}}/>
        </g>
        <g>
          <path d="M116.87,35.07V15.14h-2.42v-4.84h4.95v2.89h1.24c.63-1.02,1.47-1.82,2.52-2.39,1.05-.57,2.32-.86,3.82-.86,1.83,0,3.37.38,4.63,1.15,1.26.77,2.21,1.84,2.86,3.21.65,1.38.97,2.99.97,4.84s-.31,3.47-.94,4.85-1.54,2.46-2.74,3.21c-1.2.76-2.65,1.14-4.36,1.14-1.3,0-2.41-.24-3.33-.72-.92-.48-1.65-1.16-2.18-2.05h-.12v9.5h-4.9ZM126.07,24.1c1.49,0,2.61-.44,3.36-1.33s1.12-2.09,1.12-3.63-.37-2.74-1.12-3.63c-.75-.88-1.87-1.33-3.36-1.33-1.32,0-2.36.37-3.14,1.11-.78.74-1.17,1.75-1.17,3.05v1.59c0,1.3.39,2.32,1.17,3.05.78.74,1.82,1.11,3.14,1.11Z" style={{fill:"#95257b"}}/>
          <path d="M138.45,28V10.3h4.9v17.69h-4.9Z" style={{fill:"#95257b"}}/>
          <path d="M174.76,28.35c-1.91,0-3.57-.38-4.98-1.14-1.42-.76-2.51-1.83-3.27-3.21-.77-1.39-1.15-3.02-1.15-4.91s.37-3.51,1.12-4.88c.75-1.37,1.81-2.42,3.2-3.16,1.39-.74,3.02-1.11,4.91-1.11s3.44.35,4.76,1.06c1.33.71,2.34,1.72,3.05,3.04.71,1.32,1.06,2.89,1.06,4.72v1.65h-13.42c.2,1.32.7,2.32,1.5,3.01.81.69,1.87,1.03,3.18,1.03,1.04,0,1.87-.18,2.48-.53.61-.35,1.04-.89,1.3-1.62h4.9c-.39,1.89-1.35,3.37-2.86,4.44-1.51,1.07-3.44,1.61-5.78,1.61ZM170.16,17.17h8.61c-.16-1.12-.59-1.96-1.3-2.52-.71-.56-1.66-.84-2.86-.84s-2.18.29-2.93.86c-.76.57-1.26,1.41-1.52,2.51Z" style={{fill:"#95257b"}}/>
        </g>
        <path d="M185.41,28l6.55-24.77h4.9l-6.55,24.77h-4.9Z" style={{fill:"#95257b"}}/>
        <polygon points="206.86 22.35 209.55 18.79 206.84 15.49 202.98 10.3 197.5 10.3 204.04 18.94 197.14 28 202.57 28 206.84 22.33 206.86 22.35" style={{fill:"#f48220"}}/>
        <g>
          <polygon points="160.24 10.28 165.67 10.28 158.74 19.41 165.23 28.01 159.81 28.01 153.22 19.56 160.24 10.28" style={{fill:"#f48220"}}/>
          <polygon points="152.02 28.01 146.58 28.01 152.58 20.19 155.33 23.66 152.02 28.01" style={{fill:"#95257b"}}/>
          <polygon points="145.84 10.26 151.34 10.26 155.17 15.36 152.46 18.91 145.84 10.26" style={{fill:"#95257b"}}/>
        </g>


      </svg>
    </a>
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