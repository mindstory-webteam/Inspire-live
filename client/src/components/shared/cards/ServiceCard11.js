import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";

const ServiceCard11 = ({ service, idx, biggerCard = false }) => {
  const {
    title,
    desc,
    description1,
    shortDescription,
    slug,
    id,
    heroImage,
  } = service || {};

  const imageUrl = heroImage || null;

  const cardDesc =
    desc ||
    shortDescription ||
    description1 ||
    "Through a combination of data-driven insights and innovative approaches business.";

  const href = `/services/${slug || id}`;

  return (
    <div
      className={`service-item style-4 ${biggerCard ? "service-item-bigger" : ""}`}
      style={{
        display:       "flex",
        flexDirection: "column",
        width:         "100%",
        height:        "100%",
        overflow:      "hidden",
        boxSizing:     "border-box",
      }}
    >
      {/* Banner image */}
      <div
        style={{
          width:        "100%",
          height:       220,
          flexShrink:   0,
          overflow:     "hidden",
          borderRadius: "12px 12px 0 0",
          background:   "#dce8f5",
          position:     "relative",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "service image"}
            style={{
              position:       "absolute",
              inset:          0,
              width:          "100%",
              height:         "100%",
              objectFit:      "cover",
              objectPosition: "center",
              display:        "block",
            }}
          />
        ) : (
          <div style={{
            width:          "100%",
            height:         "100%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "#93b8d4",
            fontSize:       13,
            letterSpacing:  "0.04em",
          }}>
            No image
          </div>
        )}
      </div>

      {/* Card body */}
      <div
        className="service-content"
        style={{
          padding:       "20px 24px 24px",
          display:       "flex",
          flexDirection: "column",
          flexGrow:      1,
        }}
      >
        <h6 className="h10-service-sln">{modifyNumber(idx + 1)}.</h6>
        <h4 className="title">
          <Link href={href}>{title}</Link>
        </h4>
        <p className="desc" style={{ flexGrow: 1 }}>{cardDesc}</p>
        <Link className="text-btn" href={href}>
          <span className="btn-text"><span>Learn More</span></span>
          <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard11;