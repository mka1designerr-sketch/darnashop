import type { NextConfig } from "next";

// Use `as any` to allow the `turbopack` key which isn't in NextConfig's TS types yet
const nextConfig = {
  turbopack: {
    // Ensure Turbopack doesn't infer a parent directory as the workspace root
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
} as any as NextConfig;

export default nextConfig;
