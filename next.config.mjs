/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: false
  },
};

export default nextConfig;
