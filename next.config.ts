import type { NextConfig } from "next";

const nextConfig = {
  images: { remotePatterns: [{ protocol:"https", hostname:"images.unsplash.com" }] },
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
};
export default nextConfig;

