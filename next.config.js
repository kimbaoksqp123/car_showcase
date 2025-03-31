/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.imagin.studio",
      },
    ],
  },
  // Explicitly set src directory as the root
  reactStrictMode: true,
};

module.exports = nextConfig; 