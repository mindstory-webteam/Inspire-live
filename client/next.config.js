/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — where your uploaded service images are stored
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Your backend server (local dev)
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      // Your backend server (production — replace with your actual domain)
      {
        protocol: "https",
        hostname: "your-backend-domain.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;