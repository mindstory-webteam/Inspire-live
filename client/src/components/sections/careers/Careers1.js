"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── helper: resolve image src ─────────────────────────────────────────── */
function resolveImg(src) {
  if (!src || typeof src !== "string" || src.trim() === "") return null;
  if (src.startsWith("http")) return src;
  const base = API_BASE.replace(/\/api\/?$/, "");
  return base + (src.startsWith("/") ? src : "/" + src);
}

/* ─── CareerCard ─────────────────────────────────────────────────────────── */
const CareerCard = ({ career }) => {
  const {
    _id, slug, title, iconName, image, category, need,
    location, salaryMin, salaryMax, salaryPeriod, description,
  } = career;

  const href = `/careers/${slug || _id}`;

  const salaryDisplay = salaryMin && salaryMax
    ? `$${salaryMin}–$${salaryMax} / ${salaryPeriod}`
    : salaryMin  ? `From $${salaryMin} / ${salaryPeriod}`
    : salaryMax  ? `Up to $${salaryMax} / ${salaryPeriod}`
    : null;

  const imgSrc = resolveImg(image?.url || image);
  const initial = (title || category || "J").charAt(0).toUpperCase();

  return (
    <div className="col-lg-4 col-md-6">
      <div className="cj-card">

        {/* ── Image area ── */}
        <div className="cj-card-img">
          {imgSrc ? (
            <img src={imgSrc} alt={title || "Career"} />
          ) : (
            /* gradient placeholder matching the screenshot's light-blue fade */
            <div className="cj-card-img-placeholder" />
          )}

          {/* ── Circular icon badge (bottom-right of image) ── */}
          <div className="cj-card-badge">
            {iconName
              ? <i className={iconName} style={{ fontSize: "20px", color: "#fff" }} />
              : <span className="cj-card-badge-letter">{initial}</span>
            }
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="cj-card-body">

          {/* tags row */}
          {(category || need) && (
            <div className="cj-card-tags">
              {category && <span className="cj-tag">{category}</span>}
              {need     && <span className="cj-tag cj-tag-outline">{need}</span>}
            </div>
          )}

          {/* title */}
          <h4 className="cj-card-title">
            <Link href={href}>{title}</Link>
          </h4>

          {/* short description */}
          {description && (
            <p className="cj-card-desc">
              {description.length > 90 ? description.slice(0, 90) + "…" : description}
            </p>
          )}

          {/* meta: location + salary */}
          {(location || salaryDisplay) && (
            <div className="cj-card-meta">
              {location && (
                <span className="cj-meta-item">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {location}
                </span>
              )}
              {salaryDisplay && (
                <span className="cj-meta-item">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  {salaryDisplay}
                </span>
              )}
            </div>
          )}

          {/* Read More */}
          <Link href={href} className="cj-readmore">
            Read More
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

        </div>
      </div>

      <style jsx>{`
        /* ── Card shell ── */
        .cj-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26, 89, 138, 0.10);
          transition: transform 0.3s cubic-bezier(.22,.61,.36,1),
                      box-shadow 0.3s;
          margin-bottom: 28px;
          border: 1px solid rgba(26, 89, 138, 0.07);
        }
        .cj-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(26, 89, 138, 0.16);
        }

        /* ── Image area ── */
        .cj-card-img {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: linear-gradient(160deg, #d6e8f7 0%, #c3d9ee 50%, #a8c8e4 100%);
        }
        .cj-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(.22,.61,.36,1);
        }
        .cj-card:hover .cj-card-img img {
          transform: scale(1.05);
        }
        .cj-card-img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, #d6e8f7 0%, #c3d9ee 50%, #a8c8e4 100%);
        }

        /* ── Circular badge (bottom-right of image) ── */
        .cj-card-badge {
          position: absolute;
          bottom: 14px;
          right: 14px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1a598a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(26, 89, 138, 0.4);
          flex-shrink: 0;
        }
        .cj-card-badge-letter {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        /* ── Content body ── */
        .cj-card-body {
          padding: 22px 24px 24px;
        }

        /* tags */
        .cj-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .cj-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(26, 89, 138, 0.09);
          color: #1a598a;
        }
        .cj-tag-outline {
          background: transparent;
          border: 1.5px solid #a9b8b8;
          color: #67787a;
        }

        /* title */
        .cj-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0c1e21;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        .cj-card-title a {
          text-decoration: none;
          color: inherit;
          transition: color 0.2s;
        }
        .cj-card-title a:hover { color: #1a598a; }

        /* description */
        .cj-card-desc {
          font-size: 0.87rem;
          color: #67787a;
          line-height: 1.65;
          margin: 0 0 12px;
        }

        /* meta */
        .cj-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }
        .cj-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #67787a;
        }
        .cj-meta-item svg { color: #a9b8b8; flex-shrink: 0; }

        /* Read More */
        .cj-readmore {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a598a;
          text-decoration: none;
          transition: gap 0.2s, color 0.2s;
        }
        .cj-readmore:hover {
          gap: 10px;
          color: #015599;
        }
        .cj-readmore svg { transition: transform 0.2s; }
        .cj-readmore:hover svg { transform: translateX(3px); }
      `}</style>
    </div>
  );
};

/* ─── Careers1 ───────────────────────────────────────────────────────────── */
const Careers1 = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res  = await fetch(`${API_BASE}/careers`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCareers(data.data);
        } else {
          setError("Could not load job listings.");
        }
      } catch {
        setError("Network error. Could not load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  return (
    <section className="tj-careers-section section-gap">
      <div className="container">

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#67787a", fontSize: 16 }}>
            Loading job listings…
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#dc2626", fontSize: 16 }}>
            {error}
          </div>
        )}

        {!loading && !error && careers.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#67787a", fontSize: 16 }}>
            No open positions at the moment. Please check back soon.
          </div>
        )}

        {!loading && !error && careers.length > 0 && (
          <div className="row">
            {careers.map((career) => (
              <CareerCard key={career._id} career={career} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Careers1;