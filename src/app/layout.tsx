import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samuele Poma | Software Engineer",
  description: "Portfolio of Samuele Poma, software engineer based in Middelburg, Netherlands.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
