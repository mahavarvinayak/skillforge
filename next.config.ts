import type { NextConfig } from "next";
import path from "path";

/* Vercel-ready config: no standalone output, no custom server needed.
   The site is 100% static — zero API routes, zero database. */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  // Sandbox preview proxies (*.space-z.ai) request /_next/* assets cross-origin in dev
  allowedDevOrigins: ["*.space-z.ai"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
