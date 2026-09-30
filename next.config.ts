import type { NextConfig } from "next";

import { parseServerEnv } from "./src/lib/env/schema";

// Fail the production build early if a secret is missing, instead of failing
// at runtime when the first visitor submits the contact form.
if (process.env.VERCEL_ENV === "production") {
  parseServerEnv(process.env);
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
