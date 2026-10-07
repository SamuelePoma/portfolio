import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { LazyToaster } from "@/components/ui/LazyToaster";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";
import { isIndexable, rootMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils/cn";

import { geistMono, geistSans } from "./fonts";

export const metadata: Metadata = rootMetadata({
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  description: site.seoDescription,
  indexable: isIndexable(),
});

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

/**
 * Scroll-driven pieces are rendered in their starting state (hidden, offset, clipped)
 * and brought in by JavaScript. Without it they would stay that way, so everything
 * marked `data-reveal` is simply shown: the page reads in full with no script at all.
 */
const noScriptReveal =
  "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}";

export default function RootLayout({ children }: Readonly<LayoutProps<"/">>) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable)}>
      <head>
        <noscript>
          <style>{noScriptReveal}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-ink focus:px-5 focus:text-small focus:font-medium focus:text-canvas"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Nav />
          {/* tabIndex lets the skip link move focus here in every browser. */}
          <main id="main" tabIndex={-1} className="outline-hidden">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <LazyToaster />
        <SmoothScroll />
      </body>
    </html>
  );
}
