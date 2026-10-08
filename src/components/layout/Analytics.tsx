import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import { publicEnv } from "@/lib/env/public";
import { UMAMI_SCRIPT_ORIGIN, UMAMI_SEND_ORIGIN } from "@/lib/security/headers";

/**
 * Cookieless measurement, as described on the privacy page:
 * - **Umami** counts page views in aggregate. It loads only when a website id is
 *   configured, respects Do Not Track, and counts only the site's own domain, so local
 *   builds and previews never add to the numbers. It loads after the page is
 *   interactive, so it never delays it.
 * - **Vercel Speed Insights** reports Core Web Vitals from real visits. Its script is
 *   served by Vercel itself, so it is rendered only in the production deployment there:
 *   previews would mix test visits into the numbers. (`VERCEL_ENV`, unlike `VERCEL`, is
 *   set while Vercel prerenders the pages.)
 */
export function Analytics() {
  const websiteId = publicEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const domain = new URL(publicEnv.NEXT_PUBLIC_SITE_URL).hostname;

  return (
    <>
      {websiteId && (
        <Script
          src={`${UMAMI_SCRIPT_ORIGIN}/script.js`}
          data-website-id={websiteId}
          data-host-url={UMAMI_SEND_ORIGIN}
          data-domains={domain}
          data-do-not-track="true"
          strategy="afterInteractive"
        />
      )}
      {process.env.VERCEL_ENV === "production" && <SpeedInsights />}
    </>
  );
}
