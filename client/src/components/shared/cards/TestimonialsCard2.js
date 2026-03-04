import Image from "next/image";

const TestimonialsCard2 = ({ testimonial }) => {
  const { authorName, authorDesig, desc2, img, rating } =
    testimonial ? testimonial : {};

  const avatarSrc =
    img && img.startsWith("http")
      ? img
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          authorName || "Client"
        )}&background=1a598a&color=fff&size=89`;

  return (
    <div className="testimonial-item">
      <span className="quote-icon">
        <i className="tji-quote"></i>
      </span>

      {rating && (
        <div className="testimonial-rating" style={{ marginBottom: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{ color: i < rating ? "#f59e0b" : "#d1d5db", fontSize: 14 }}
            >★</span>
          ))}
        </div>
      )}

      <div className="desc">
        <p>{desc2}</p>
      </div>

      <div className="testimonial-author">
        <div className="author-inner">
          <div className="author-img">
            {img && img.startsWith("http") ? (
              <Image
                src={avatarSrc}
                alt={authorName || "Client"}
                width={89}
                height={89}
                style={{ height: "auto", borderRadius: "50%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authorName || "Client"
                  )}&background=1a598a&color=fff&size=89`;
                }}
              />
            ) : (
              <Image
                src="/images/testimonial/client-1.webp"
                alt={authorName || "Client"}
                width={89}
                height={89}
                style={{ height: "auto" }}
              />
            )}
          </div>
          <div className="author-header">
            <h4 className="title">{authorName}</h4>
            <span className="designation">{authorDesig}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCard2;