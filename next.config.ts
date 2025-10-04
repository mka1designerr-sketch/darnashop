import type { NextConfig } from "next";

// Use `as any` to allow the `turbopack` key which isn't in NextConfig's TS types yet
const nextConfig = {
  turbopack: {
    // Ensure Turbopack doesn't infer a parent directory as the workspace root
    root: __dirname,
  },
} as any as NextConfig;

export default nextConfig;
