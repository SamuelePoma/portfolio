import localFont from "next/font/local";

/**
 * Geist and Geist Mono from the `geist` package, cut down to the Latin range by
 * `pnpm fonts` (scripts/subset-fonts.mjs): about a third of the full variable files,
 * with every weight and OpenType feature kept. Self-hosted, so the page makes no
 * request to a font service. Only the sans is preloaded; the mono is for small
 * labels, so it can arrive a moment later without holding up the first paint.
 */
export const geistSans = localFont({
  src: "../fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const geistMono = localFont({
  src: "../fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
