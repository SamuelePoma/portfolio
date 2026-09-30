import "./globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Samuele Poma | Software Engineer",
  description: "Portfolio of Samuele Poma, software engineer based in Middelburg, Netherlands.",
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>{children}</body>
    </html>
  );
}
