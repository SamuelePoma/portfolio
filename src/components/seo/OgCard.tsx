import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The Open Graph card, rendered by `ImageResponse` (a subset of CSS): the title in
 * Geist 600 on the light canvas, the hero's mesh as soft radial gradients, and a mono
 * line with the context and the URL (DESIGN.md §3.2, §10).
 */

export const OG_SIZE = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

export async function ogFonts() {
  const [sans, mono] = await Promise.all([
    readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Geist", data: sans, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

interface OgCardProps {
  eyebrow: string;
  title: string;
  footer: string;
}

export function OgCard({ eyebrow, title, footer }: Readonly<OgCardProps>) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#fafafa",
        backgroundImage: [
          "radial-gradient(circle at 92% 6%, rgba(0,124,240,0.35), rgba(0,124,240,0) 42%)",
          "radial-gradient(circle at 70% 0%, rgba(0,223,216,0.30), rgba(0,223,216,0) 34%)",
          "radial-gradient(circle at 104% 46%, rgba(255,0,128,0.18), rgba(255,0,128,0) 32%)",
          "radial-gradient(circle at 58% -10%, rgba(249,203,40,0.28), rgba(249,203,40,0) 30%)",
        ].join(", "),
        color: "#171717",
      }}
    >
      <div
        style={{
          fontFamily: "Geist Mono",
          fontSize: 24,
          color: "#525252",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: "Geist",
          fontSize: title.length > 24 ? 84 : 112,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          maxWidth: 980,
        }}
      >
        {title}
      </div>
      <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#525252" }}>{footer}</div>
    </div>
  );
}
