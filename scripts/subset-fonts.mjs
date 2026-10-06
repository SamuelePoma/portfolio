/**
 * Cuts Geist and Geist Mono (the variable fonts from the `geist` package) down to the
 * Latin range the site is written in: the same characters as Google Fonts' "latin"
 * subset. That takes each file from about 70 KB to about a third of it, and keeps every
 * weight and every OpenType feature (`ss01`, tabular figures). Run with `pnpm fonts`
 * after upgrading `geist`; the output in `src/fonts/` is committed.
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import subsetFont from "subset-font";

const root = process.cwd();
const source = path.join(root, "node_modules/geist/dist/fonts");
const target = path.join(root, "src/fonts");

/** Basic Latin, Latin-1, general punctuation, and the few extras of Google's "latin". */
const LATIN = [
  [0x0020, 0x007e],
  [0x00a0, 0x00ff],
  [0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6],
  [0x02da],
  [0x02dc],
  [0x0304],
  [0x0308],
  [0x0329],
  [0x2000, 0x206f],
  [0x20ac],
  [0x2122],
  [0x2191],
  [0x2193],
  [0x2212],
  [0x2215],
  [0xfeff],
  [0xfffd],
];

const text = LATIN.flatMap(([from, to = from]) =>
  Array.from({ length: to - from + 1 }, (_, offset) => String.fromCodePoint(from + offset)),
).join("");

const fonts = [
  ["geist-sans/Geist-Variable.woff2", "geist-latin.woff2"],
  ["geist-mono/GeistMono-Variable.woff2", "geist-mono-latin.woff2"],
];

await mkdir(target, { recursive: true });
// The SIL Open Font License travels with the fonts.
await copyFile(path.join(root, "node_modules/geist/LICENSE.txt"), path.join(target, "OFL.txt"));
for (const [from, to] of fonts) {
  const input = await readFile(path.join(source, from));
  const output = await subsetFont(input, text, { targetFormat: "woff2" });
  await writeFile(path.join(target, to), output);
  console.log(
    `${to}: ${(input.length / 1024).toFixed(1)} KB → ${(output.length / 1024).toFixed(1)} KB`,
  );
}
