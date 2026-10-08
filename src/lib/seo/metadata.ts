import type { Metadata } from "next";

export const SITE_NAME = "Samuele Poma";
export const HOME_TITLE = "Samuele Poma | Software Engineer, Go & React";
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/**
 * Proves to Google Search Console that Samuele owns the site (the URL-prefix property
 * https://samuelepoma.vercel.app/). Public by design: it only works for the site whose
 * pages carry it. A custom domain would be a new property with a new code.
 */
export const GOOGLE_SITE_VERIFICATION = "sUgSwedNzB46bG5UwxYO-9qr-mTjZMFtWvgENu-l4Vk";

/**
 * Only production may be indexed: previews and local builds ask search engines to stay
 * away, in the metadata and in an `X-Robots-Tag` header (next.config.ts).
 */
export function isIndexable(vercelEnv: string | undefined = process.env.VERCEL_ENV): boolean {
  return vercelEnv === "production";
}

/** An absolute URL on the site, e.g. for JSON-LD, where relative URLs aren't allowed. */
export function absoluteUrl(path: string, siteUrl: string): string {
  return new URL(path, siteUrl).toString();
}

interface RootMetadataInput {
  siteUrl: string;
  description: string;
  indexable: boolean;
}

/** Defaults for every page: the base URL, the title template, robots and social cards. */
export function rootMetadata({ siteUrl, description, indexable }: RootMetadataInput): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: { default: HOME_TITLE, template: TITLE_TEMPLATE },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    // Mobile Safari would otherwise turn digit runs into phone links.
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
    twitter: { card: "summary_large_image" },
    verification: { google: GOOGLE_SITE_VERIFICATION },
  };
}

interface PageMetadataInput {
  /** The page's own title; the template appends the site name unless `absoluteTitle`. */
  title: string;
  description: string;
  /** Path for the canonical URL, resolved against `metadataBase`. */
  path: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
}

/**
 * A page's title, description, canonical URL and social cards. Open Graph is set in full
 * because Next.js replaces, rather than merges, a parent's `openGraph`; the image comes
 * from the nearest `opengraph-image` file.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : TITLE_TEMPLATE.replace("%s", title);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
