# ADR 0006 — Images: a typed registry and build-time fallbacks

- **Status:** accepted
- **Date:** 2026-10-07

## Context

The case studies need screenshots, photos and designs that arrive one by one, some of them long after the page exists. Every image needs alt text and a fixed shape, so the layout never jumps, and a missing file must never break a page or show a broken image.

## Decision

- **One registry.** `src/content/media.ts` lists every image slot with its id, file name, ratio, alt text and optional caption. Projects refer to slots by id, a union type, so a missing slot fails the type check; unit tests check that ids and files are unique, ratios are known and alt text is there.
- **Fixed shapes.** `MediaFrame` reserves the slot's ratio (16:10, 16:9, 2:1, 4:5 or 9:19.5) before the image loads, so nothing shifts. The image covers the frame; UI screenshots can be anchored to the top so their navigation stays in view, and a design that has to be seen whole is padded to the ratio before it is added.
- **`next/image` with honest `sizes`.** Files are WebP in `public/images/`, served in the sizes each layout needs. Only the image that is a page's largest paint is preloaded.
- **Fallbacks decided at build time.** `MediaSlot` checks whether the file exists while the page is prerendered. Without it, the slot shows a drawn stand-in when it has one (the D&D character sheet) or a neutral placeholder. Pages are static, so the check costs nothing at runtime.
- Originals and source files stay out of the repository; only the optimised WebP files are committed.

## Consequences

- Adding an image is dropping a file with the registered name into `public/images/` and rebuilding.
- Alt text lives next to the file name, where it is hard to forget, and is reviewed with the content.
- A slot without its file still renders a page that looks intended, never an empty box.
