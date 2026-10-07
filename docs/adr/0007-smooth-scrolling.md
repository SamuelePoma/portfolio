# ADR 0007 — Smooth scrolling only where it helps

- **Status:** accepted
- **Date:** 2026-10-07

## Context

The pinned scenes play as the page scrolls. A mouse wheel moves the page in steps of about 100 px, so on a desktop the scenes advanced in visible jumps. Touch screens, trackpads and keyboards already scroll smoothly, and smooth-scroll libraries that take over the page are known for making touch scrolling feel wrong and for fighting assistive technology.

## Decision

- **Lenis smooths the mouse wheel, and nothing else.** It is loaded only on devices with a fine pointer that can hover (`(hover: hover) and (pointer: fine)`) and never with reduced motion. It loads once the browser is idle, as a separate chunk, so it is not part of the first load. It interpolates towards the wheel's target (`lerp: 0.12`) and stops when a link to another page is clicked, so the next page opens still.
- **Touch, keyboard, scrollbar and anchor links stay native.** The page keeps the browser's own scrolling; Lenis drives it through the normal scroll position, so focus, find-in-page and assistive technology behave as usual.
- **The scenes add their own spring.** Each scene follows the scroll on a critically damped spring (`SCROLL_SPRING`), which rounds off keyboard and scrollbar jumps without trailing the page by more than about 50 ms.

## Consequences

- Wheel scrolling plays the scenes like a film, and every other way of scrolling is untouched.
- A few kilobytes of JavaScript, loaded after the page is ready and only on desktop.
- If the scenes move to CSS scroll-driven animations one day, the spring goes and Lenis stays.
