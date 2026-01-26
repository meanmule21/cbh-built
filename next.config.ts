import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  // Note: Vercel handles image optimization automatically
  images: {
    unoptimized: false, // Let Vercel handle optimization
  },
  // Ensure proper TypeScript handling
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude nested cbh-built-main directory from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Note: ESLint config moved to eslint.config.mjs (Next.js 16+)
};

export default nextConfig;
