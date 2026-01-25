import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  output: 'standalone', // Enables standalone output for better Vercel performance
  // Enable image optimization (Vercel handles this automatically)
  images: {
    domains: [],
    remotePatterns: [],
  },
};

export default nextConfig;
