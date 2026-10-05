import "./globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { site } from "@/content/site";
import { publicEnv } from "@/lib/env/public";
import { isIndexable, rootMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = rootMetadata({
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  description: site.seoDescription,
  indexable: isIndexable(),
});

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<LayoutProps<"/">>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
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
        <Toaster position="bottom-center" offset={24} mobileOffset={16} />
      </body>
    </html>
  );
}
