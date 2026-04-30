import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'gpu.id'
      },
      {
        protocol: 'https',
        hostname: 'qbtwufqjrsjybekeahdt.supabase.co'
      },
    ],
  },
};

export default nextConfig;
