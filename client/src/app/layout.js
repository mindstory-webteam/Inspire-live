import { Mona_Sans } from "next/font/google";
import Script from "next/script"; // ✅ import this
import "react-range-slider-input/dist/style.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./assets/css/animate.min.css";
import "./assets/css/bexon-icons.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome-pro.min.css";
import "./assets/css/glightbox.min.css";
import "./assets/css/meanmenu.css";
import "./assets/css/nice-select2.css";
import "./assets/css/odometer-theme-default.css";
import "./globals.scss";

const bodyFont = Mona_Sans({
  variable: "--tj-ff-body",
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
  display: "swap",
});

const headingFont = Mona_Sans({
  variable: "--tj-ff-heading",
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
  display: "swap",
});

// app/layout.jsx
export const metadata = {
  // ✅ Title template: child pages set their own title, " | inspirePhD" is appended automatically
  title: {
    template: "",
    default: "inspirePhD - Research and Publication Support Services",
  },
  description: "inspirePhD - Research and Publication Support Services",
  metadataBase: new URL("https://inspireeducationservice.com/"), // ✅ Required for absolute OG image URLs
  icons: {
    icon: "/new-imges/logo/inspire_icon.jpg.jpeg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" dir="ltr">
      
      {/* ✅ GTM Script (HEAD) */}
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id=GTM-NJ4QVPRL'+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NJ4QVPRL');`,
          }}
        />
      </head>

      <body className={`${bodyFont.variable} ${headingFont.variable}`}>

        {/* ✅ GTM NoScript (BODY) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJ4QVPRL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}