/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;