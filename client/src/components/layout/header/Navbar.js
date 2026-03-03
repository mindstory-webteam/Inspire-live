"use client";

import useActiveLink from "@/hooks/useActiveLink";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER_BASE = API_BASE.replace("/api", "");

// Resolves any image URL — Cloudinary, absolute, relative, or local fallback
function getServiceImage(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src; // Cloudinary or external
  if (src.startsWith("/images")) return src;                                // local public folder
  return SERVER_BASE + src;                                                 // relative server path
}

const staticNavItems = [
  { id: 1, name: "Home",      path: "/" },
  {
    id: 2, name: "Our Story", path: "/about",
    submenu: [
      { id: 1, name: "About us",    path: "/about"   },
      { id: 2, name: "Our history", path: "/history" },
      { id: 3, name: "Events",      path: "/events"  },
    ],
  },
  { id: 3, name: "Services", path: "/services", submenu: [] },
  { id: 4, name: "Careers",  path: "/careers"  },
  { id: 5, name: "Blog",     path: "/blogs"    },
  { id: 6, name: "Contact",  path: "/contact"  },
];

const Navbar = () => {
  const [services, setServices] = useState([]);
  const makeActiveLink = useActiveLink();

  useEffect(() => {
    fetch(API_BASE + "/services")
      .then((res) => res.json())
      .then((data) => {
        const items = data.data || [];
        setServices(
          items.map((s) => ({
            id:    s._id,
            name:  s.title,
            path:  "/services/" + (s.slug || s._id),
            // Check all possible image field names from your backend
            image: getServiceImage(
              s.heroImage || s.image || s.thumbnail || s.img || s.icon || null
            ),
          }))
        );
      })
      .catch(() => {});
  }, []);

  const navItems = staticNavItems.map((item) =>
    item.id === 3 ? { ...item, submenu: services } : item
  );

  const homeNav     = makeActiveLink(navItems[0]);
  const ourStoryNav = makeActiveLink(navItems[1]);
  const serviceNav  = makeActiveLink(navItems[2]);
  const careersNav  = makeActiveLink(navItems[3]);
  const blogNav     = makeActiveLink(navItems[4]);
  const contactNav  = makeActiveLink(navItems[5]);

  return (
    <div className="menu-area d-none d-lg-inline-flex align-items-center">
      <nav id="mobile-menu" className="mainmenu">
        <ul>

          {/* ── Home ─────────────────────────────────────────────────────── */}
          <li className={homeNav?.isActive ? "current-menu-ancestor" : ""}>
            <Link href={homeNav?.path || "/"}>{homeNav?.name}</Link>
          </li>

          {/* ── Our Story ────────────────────────────────────────────────── */}
          <li className={`has-dropdown ${ourStoryNav?.isActive ? "current-menu-ancestor" : ""}`}>
            <Link href={ourStoryNav?.path || "/about"}>{ourStoryNav?.name}</Link>
            <ul className="sub-menu">
              {ourStoryNav?.submenu?.map((item, idx) => (
                <li key={idx} className={item?.isActive ? "current-menu-item" : ""}>
                  <Link href={item?.path || "/"}>
                    {item?.name}
                    {item?.badge && (
                      <span className={`mega-menu-badge tj-zoom-in-out-anim ${item.badge === "HOT" ? "mega-menu-badge-hot" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* ── Services (dynamic from API) ───────────────────────────────── */}
          <li className={`has-dropdown ${serviceNav?.isActive ? "current-menu-ancestor" : ""}`}>
            <Link href="/services">{serviceNav?.name || "Services"}</Link>
            <ul className="sub-menu mega-menu-service">
              {services.length === 0 ? (
                <li>
                  <Link href="/services" className="mega-menu-service-single">
                    <span className="mega-menu-service-title">View All Services</span>
                    <span className="mega-menu-service-nav">
                      <i className="tji-arrow-right-long"></i>
                      <i className="tji-arrow-right-long"></i>
                    </span>
                  </Link>
                </li>
              ) : (
                services.map((item) => (
                  <li key={item.id}>
                    <Link className="mega-menu-service-single" href={item.path}>
                      <span className="mega-menu-service-icon">
                        {item.image ? (
                          // ✅ FIX: circle wrapper with overflow:hidden clips image into a circle
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "#1a598a18",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "#1a598a18",
                            }}
                          >
                            <i className="tji-settings" style={{ fontSize: 18, color: "#1a598a" }}></i>
                          </span>
                        )}
                      </span>
                      <span className="mega-menu-service-title">{item.name}</span>
                      <span className="mega-menu-service-nav">
                        <i className="tji-arrow-right-long"></i>
                        <i className="tji-arrow-right-long"></i>
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </li>

          {/* ── Careers ──────────────────────────────────────────────────── */}
          <li className={careersNav?.isActive ? "current-menu-ancestor" : ""}>
            <Link href={careersNav?.path || "/careers"}>{careersNav?.name || "Careers"}</Link>
          </li>

          {/* ── Blog ─────────────────────────────────────────────────────── */}
          <li className={blogNav?.isActive ? "current-menu-ancestor" : ""}>
            <Link href={blogNav?.path || "/blogs"}>{blogNav?.name || "Blog"}</Link>
          </li>

          {/* ── Contact ──────────────────────────────────────────────────── */}
          <li className={contactNav?.isActive ? "current-menu-ancestor" : ""}>
            <Link href={contactNav?.path || "/contact"}>{contactNav?.name || "Contact"}</Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Navbar;