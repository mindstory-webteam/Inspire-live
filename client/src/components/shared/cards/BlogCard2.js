"use client";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";

function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  var base = API_BASE_URL.replace(/\/api\/?$/, "");
  return base + (src.startsWith("/") ? src : "/" + src);
}

function pad(n) {
  return String(n != null ? n : "").padStart(2, "0");
}

var BlogCard2 = function (props) {
  var blog = props.blog;
  var idx = props.idx;

  var _id = blog ? blog._id : null;
  var slug = blog ? blog.slug : null;
  var title = blog ? blog.title : null;
  var img = blog ? blog.img : null;
  var img1 = blog ? blog.img1 : null;
  var smallImg = blog ? blog.smallImg : null;
  var category = blog ? blog.category : null;
  var day = blog ? blog.day : null;
  var month = blog ? blog.month : null;
  var createdAt = blog ? blog.createdAt : null;
  var author = blog ? blog.author : null;

  var href = "/blogs/" + (slug || _id);
  var imgSrc = resolveImg(img1 || img || smallImg);

  var d = createdAt ? new Date(createdAt) : new Date();
  var dispDay = day != null ? day : d.getDate();
  var dispMon = month || d.toLocaleString("en", { month: "short" }).toUpperCase();

  return (
    <div className="blog-item style-2">
      <div className="blog-thumb">
        <Link href={href}>
          <img
            src={imgSrc || "/images/blog/blog-4.webp"}
            alt={title || "Blog post"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
        <div className="blog-date">
          <span className="date">{pad(dispDay)}</span>
          <span className="month">{dispMon}</span>
        </div>
      </div>

      <div className="blog-content">
        <div className="title-area">
          <div className="blog-meta">
            {category && (
              <span className="categories">
                <Link href={"/blogs?category=" + encodeURIComponent(category)}>
                  {category}
                </Link>
              </span>
            )}
            <span>
              By <Link href={href}>{author || "Admin"}</Link>
            </span>
          </div>
          <h4 className="title">
            <Link href={href}>{title}.</Link>
          </h4>
        </div>
        <ButtonPrimary text={"Read More"} url={href} isTextBtn={true} />
      </div>
    </div>
  );
};

export default BlogCard2;