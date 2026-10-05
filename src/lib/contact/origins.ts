interface OriginSources {
  /** The canonical site URL (NEXT_PUBLIC_SITE_URL). */
  siteUrl: string;
  /** Vercel's VERCEL_ENV: "production", "preview" or "development". */
  vercelEnv?: string | undefined;
  /** Vercel's deployment and branch hosts, without a scheme. */
  vercelUrl?: string | undefined;
  vercelBranchUrl?: string | undefined;
}

/**
 * Where the form may be posted from, and the hostnames the Turnstile widget may run
 * on: the site itself, plus the deployment's own URLs on preview deployments, never
 * on production.
 */
export function contactOrigins({ siteUrl, vercelEnv, vercelUrl, vercelBranchUrl }: OriginSources): {
  origins: string[];
  hostnames: string[];
} {
  const urls = [new URL(siteUrl)];
  if (vercelEnv === "preview") {
    for (const host of [vercelUrl, vercelBranchUrl]) {
      if (host) urls.push(new URL(`https://${host}`));
    }
  }
  return {
    origins: [...new Set(urls.map((url) => url.origin))],
    hostnames: [...new Set(urls.map((url) => url.hostname))],
  };
}
