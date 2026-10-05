import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

import { assertProductionEnv } from "./src/lib/env/schema";

// Fail the production build early if a secret is missing (or is a test key), instead
// of failing at runtime when the first visitor submits the contact form.
if (process.env.VERCEL_ENV === "production") {
  assertProductionEnv(process.env);
}

const defaultPageExtensions = ["tsx", "ts", "jsx", "js"];

export default function config(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    poweredByHeader: false,
    reactStrictMode: true,
    // `*.dev.tsx` routes (the styleguide) exist only on the dev server and are
    // left out of production builds entirely.
    pageExtensions: isDevServer ? ["dev.tsx", ...defaultPageExtensions] : defaultPageExtensions,
  };
}
