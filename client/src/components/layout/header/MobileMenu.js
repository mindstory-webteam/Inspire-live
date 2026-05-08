import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { useState, useEffect } from "react";

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch("/api/contact-info");
        const data = await res.json();
        setContactInfo(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Helper: find a contact item by type
  const getItem = (type) =>
    contactInfo.find(
      (item) => item.type?.toLowerCase() === type.toLowerCase() && item.isActive !== false
    );

  const phone    = getItem("phone");
  const email    = getItem("email");
  const location = getItem("location");

  // Social items — adjust type names to match your DB seed
  const socialTypes = ["facebook", "instagram", "youtube", "linkedin"];
  const socials = socialTypes
    .map((type) => getItem(type))
    .filter(Boolean);

  // Icon map for social platforms
  const socialIconMap = {
    facebook:  "fa-brands fa-facebook-f",
    instagram: "fa-brands fa-instagram",
    youtube:   "fa-brands fa-youtube",
    linkedin:  "fa-brands fa-linkedin-in",
    twitter:   "fa-brands fa-x-twitter",
    tiktok:    "fa-brands fa-tiktok",
  };

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

              {loading ? (
                <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>Loading…</p>
              ) : (
                <div className="contact-info">

                  {phone && (
                    <div className="contact-item">
                      <span className="subtitle">Phone</span>
                      <Link
                        className="contact-link"
                        href={`tel:${phone.value}`}
                      >
                        {phone.label ?? phone.value}
                      </Link>
                    </div>
                  )}

                  {email && (
                    <div className="contact-item">
                      <span className="subtitle">Email</span>
                      <Link
                        className="contact-link"
                        href={`mailto:${email.value}`}
                      >
                        {email.label ?? email.value}
                      </Link>
                    </div>
                  )}

                  {location && (
                    <div className="contact-item">
                      <span className="subtitle">Location</span>
                      <span className="contact-link">
                        {location.label ?? location.value}
                      </span>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* ── Social links ── */}
          <div className="hamburger-socials">
            <h5 className="hamburger-title">Follow Us</h5>
            <div className="social-links style-3">
              <ul>
                {loading ? (
                  <li style={{ fontSize: "0.85rem", opacity: 0.6 }}>Loading…</li>
                ) : socials.length > 0 ? (
                  socials.map((item) => (
                    <li key={item.type}>
                      <Link href={item.value} target="_blank" rel="noreferrer">
                        <i
                          className={
                            socialIconMap[item.type.toLowerCase()] ??
                            "fa-brands fa-globe"
                          }
                        />
                      </Link>
                    </li>
                  ))
                ) : (
                  // Fallback hardcoded socials if none returned from API
                  <>
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
                      <Link href="https://www.youtube.com/channel/UCxdf2JpHcvAuGhVweQiy6GA" target="_blank">
                        <i className="fa-brands fa-youtube" />
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.linkedin.com/" target="_blank">
                        <i className="fa-brands fa-linkedin-in" />
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MobileMenu;