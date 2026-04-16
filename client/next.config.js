/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "inspireeducationservice.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "187.127.151.100",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
