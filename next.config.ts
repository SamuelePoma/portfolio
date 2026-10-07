import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

import { assertProductionEnv } from "./src/lib/env/schema";
import { securityHeaders } from "./src/lib/security/headers";

// Fail the production build early if the canonical URL is missing, instead of
// publishing canonical links, a sitemap and social cards that point at localhost.
if (process.env.VERCEL_ENV === "production") {
  assertProductionEnv(process.env);
}

const defaultPageExtensions = ["tsx", "ts", "jsx", "js"];

export default function config(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    poweredByHeader: false,
    // The résumé has a short, shareable address.
    redirects() {
      return Promise.resolve([
        { source: "/cv", destination: "/cv/samuele-poma-cv.pdf", permanent: true },
      ]);
    },
    // Security headers on every route; previews and local builds are also kept out of
    // search engines, even through a shared link.
    headers() {
      // Most of the policy is a <meta> tag that scripts/csp-hashes.mjs writes into each
      // page after the build, with the hashes of its inline scripts.
      const security = securityHeaders({
        https: process.env.VERCEL_ENV !== undefined,
        enforce: process.env.CSP_REPORT_ONLY !== "1",
      });
      const noindex =
        process.env.VERCEL_ENV === "production"
          ? []
          : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
      return Promise.resolve([{ source: "/:path*", headers: [...security, ...noindex] }]);
    },
    reactStrictMode: true,
    // `*.dev.tsx` routes (the styleguide) exist only on the dev server and are
    // left out of production builds entirely.
    pageExtensions: isDevServer ? ["dev.tsx", ...defaultPageExtensions] : defaultPageExtensions,
  };
}
