"use client";
import Link from "next/link";

const ServiceCard4 = function ({ service, idx }) {
  const slug     = service.slug || service.id || service._id;
  const title    = service.title || service.titleLarge || "Service";
  const iconName = service.icon || service.iconName || "tji-settings";
  const href     = "/services/" + slug;

  // Backend selects: shortDescription, subtitle — try both
  const description = service.shortDescription || service.subtitle || "";

  // heroImage is a plain Cloudinary URL string from Cloudinary (req.file.path)
  const rawImage = service.heroImage || service.img || service.image;
  const imageSrc = typeof rawImage === "object" ? rawImage?.url : rawImage || null;

  return (
    <div className="sc4-card" style={cardStyle}>

      {/* Image */}
      <div style={imgWrapStyle}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            style={imgStyle}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div style={imgPlaceholderStyle}>
            <i className={iconName} style={{ fontSize: 40, color: "#1a598a", opacity: 0.25 }} />
          </div>
        )}
        <div style={overlayStyle} />
        {/* Icon badge */}
        <div style={badgeStyle}>
          <i className={iconName} style={{ fontSize: 17, color: "#fff" }} />
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h5 style={titleStyle}>
          <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>
            {title}
          </Link>
        </h5>

        <p style={descStyle}>
          {description || "Explore our expert guidance and comprehensive support tailored to your needs."}
        </p>

        <Link href={href} style={btnStyle} className="sc4-btn">
          Read More
          <i className="tji-arrow-right" style={{ marginLeft: 6, fontSize: 12 }} />
        </Link>
      </div>

    </div>
  );
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 2px 16px rgba(26,89,138,0.08)",
  transition: "transform 0.28s ease, box-shadow 0.28s ease",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  border: "1px solid rgba(26,89,138,0.07)",
};

const imgWrapStyle = {
  position: "relative",
  width: "100%",
  height: "200px",
  overflow: "hidden",
  background: "linear-gradient(135deg, #e8f0f7, #f5f8fb)",
  flexShrink: 0,
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.4s ease",
};

const imgPlaceholderStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(26,89,138,0.2) 0%, transparent 60%)",
  pointerEvents: "none",
};

const badgeStyle = {
  position: "absolute",
  bottom: 14,
  right: 14,
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#1a598a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(26,89,138,0.35)",
};

const contentStyle = {
  padding: "20px 22px 22px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "10px",
};

const titleStyle = {
  fontSize: "17px",
  fontWeight: 700,
  color: "#0f2942",
  margin: 0,
  lineHeight: 1.35,
};

const descStyle = {
  fontSize: "14px",
  color: "#5a6a7a",
  lineHeight: 1.7,
  margin: 0,
  flex: 1,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1a598a",
  textDecoration: "none",
  marginTop: "4px",
};

export default ServiceCard4;