/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/application-forms',       destination: '/contact',            permanent: true },
      { source: '/services-for-students',   destination: '/services',           permanent: true },
      { source: '/terms-and-conditions-1',  destination: '/terms-and-conditions', permanent: true },
      { source: '/m/create-account',        destination: '/contact',            permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com",        pathname: "/**" },
      { protocol: "http",  hostname: "localhost", port: "5000",   pathname: "/**" },
      { protocol: "https", hostname: "your-backend-domain.com",   pathname: "/**" },
    ],
  },
};
module.exports = nextConfig;
