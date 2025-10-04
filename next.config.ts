import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Prevent Turbopack from inferring a wrong workspace root when user has multiple lockfiles
    turbopack: {
      root: __dirname,
    },
  },
};

export default nextConfig;
