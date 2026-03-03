"use client";

import Link from "next/link";
import Image from "next/image";
import MobileMenuItem from "./MobileMenuItem";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER_BASE = API_BASE.replace("/api", "");

function getServiceImage(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/images")) return src;
  return SERVER_BASE + src;
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

const MobileNavbar = () => {
  const [services, setServices] = useState([]);

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
            image: getServiceImage(
              s.heroImage || s.image || s.thumbnail || s.img || s.icon || null
            ),
          }))
        );
      })
      .catch(() => {});
  }, []);

  const homeNav     = staticNavItems[0];
  const ourStoryNav = staticNavItems[1];
  const serviceNav  = { ...staticNavItems[2], submenu: services };
  const careersNav  = staticNavItems[3];
  const blogNav     = staticNavItems[4];
  const contactNav  = staticNavItems[5];

  return (
    <div className="hamburger_menu">
      <div className="mobile_menu mean-container">
        <div className="mean-bar">
          <Link href="#nav" className="meanmenu-reveal" style={{ right: 0, left: "auto" }}>
            <span><span><span></span></span></span>
          </Link>
          <nav className="mean-nav">
            <ul>

              {/* ── Home ───────────────────────────────────────────────── */}
              <li className="mean-last">
                <Link href={homeNav?.path || "/"}>{homeNav?.name}</Link>
              </li>

              {/* ── Our Story ──────────────────────────────────────────── */}
              <MobileMenuItem text={ourStoryNav?.name} url={ourStoryNav?.path}>
                {ourStoryNav?.submenu?.map((item, idx) => (
                  <li key={idx}>
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
              </MobileMenuItem>

              {/* ── Services (dynamic from API) ─────────────────────────── */}
              <MobileMenuItem
                text={serviceNav?.name || "Services"}
                url="/services"
                submenuClass="mega-menu-service"
              >
                {services.length === 0 ? (
                  <li>
                    <Link href="/services" className="mega-menu-service-single">
                      <span className="mega-menu-service-title">View All Services</span>
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
              </MobileMenuItem>

              {/* ── Careers ────────────────────────────────────────────── */}
              <li className="mean-last">
                <Link href={careersNav?.path || "/careers"}>
                  {careersNav?.name || "Careers"}
                </Link>
              </li>

              {/* ── Blog ───────────────────────────────────────────────── */}
              <li className="mean-last">
                <Link href={blogNav?.path || "/blogs"}>
                  {blogNav?.name || "Blog"}
                </Link>
              </li>

              {/* ── Contact ────────────────────────────────────────────── */}
              <li className="mean-last">
                <Link href={contactNav?.path || "/contact"}>
                  {contactNav?.name || "Contact"}
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;