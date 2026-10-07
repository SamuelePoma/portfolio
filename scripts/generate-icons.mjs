/**
 * Generates the site icons from the "SP" monogram in Geist Mono: icon.svg with a
 * light/dark swap, apple-icon.png, favicon.ico and the manifest icons. The letters become vector paths, so no icon depends on a font
 * being installed. Run with `pnpm icons` after changing the monogram; the output is
 * committed.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { createElement } from "react";
import satori from "satori";

const root = process.cwd();
const INK = "#171717";
const CANVAS = "#fafafa";
const NIGHT = "#0a0a0a";
const NIGHT_INK = "#ededed";

const font = await readFile(
  path.join(root, "node_modules/geist/dist/fonts/geist-mono/GeistMono-SemiBold.ttf"),
);
const fonts = [{ name: "Geist Mono", data: font, weight: 600, style: "normal" }];

/** The monogram on a square; `inset` keeps it inside a maskable icon's safe zone. */
function monogram({ size, radius = 0, scale = 0.46 }) {
  return createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: CANVAS,
        borderRadius: radius,
        color: INK,
        fontFamily: "Geist Mono",
        fontWeight: 600,
        fontSize: Math.round(size * scale),
        letterSpacing: `${String(-0.04 * size * scale)}px`,
      },
    },
    "SP",
  );
}

async function png(size, options = {}) {
  const response = new ImageResponse(monogram({ size, ...options }), {
    width: size,
    height: size,
    fonts,
  });
  return Buffer.from(await response.arrayBuffer());
}

/** An .ico holding one PNG image, which every current browser reads. */
function ico(pngData, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngData.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);
  return Buffer.concat([header, entry, pngData]);
}

// icon.svg: vector letters; colours swap with the visitor's colour scheme.
const svg = await satori(monogram({ size: 64, radius: 14 }), { width: 64, height: 64, fonts });
const themedSvg = svg
  .replaceAll(`fill="${CANVAS}"`, 'class="bg"')
  .replaceAll(`fill="${INK}"`, 'class="fg"')
  .replace(
    /^<svg([^>]*)>/,
    `<svg$1><style>.bg{fill:${CANVAS}}.fg{fill:${INK}}@media (prefers-color-scheme:dark){.bg{fill:${NIGHT}}.fg{fill:${NIGHT_INK}}}</style>`,
  );

await mkdir(path.join(root, "public/icons"), { recursive: true });
await writeFile(path.join(root, "src/app/icon.svg"), `${themedSvg}\n`);
await writeFile(path.join(root, "src/app/apple-icon.png"), await png(180));
await writeFile(path.join(root, "src/app/favicon.ico"), ico(await png(32, { radius: 7 }), 32));
await writeFile(path.join(root, "public/icons/icon-192.png"), await png(192));
await writeFile(path.join(root, "public/icons/icon-512.png"), await png(512));
// Maskable: launchers crop to a circle or squircle, so the letters stay in the middle 60%.
await writeFile(
  path.join(root, "public/icons/icon-maskable-512.png"),
  await png(512, { scale: 0.32 }),
);

console.log("Icons written: src/app/icon.svg, apple-icon.png, favicon.ico, public/icons/*");
