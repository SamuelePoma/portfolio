# DESIGN.md — Samuele Poma Portfolio

> Design system for a personal project showcase. Read this before writing any UI.
> Direction: **Vercel precision + Apple rhythm**. Monochrome, engineered, generous whitespace, with a few carefully placed moments of motion.

---

## 1. Overview

**What the site is:** a showcase of the software projects Samuele Poma has built, meant to show what he can do. It is not a CV page. A résumé PDF is available to download, but there is no "hire me" or "looking for an internship" copy. The work does the talking.

**Audience:** engineers, tech leads and recruiters who spend 30–90 seconds on the page. They should come away thinking *"this person builds real things and cares about details."*

**Personality:** serious, precise, quietly confident. Cool in the way good engineering is cool: nothing extra, but every detail is considered.

**The blend:**

| Taken from Vercel | Taken from Apple |
|---|---|
| Near-black ink on near-white canvas, no decorative color | Huge whitespace, one idea per screen |
| Geist + Geist Mono, tight display tracking | Full-bleed bands alternating light / dark; the color change *is* the divider |
| Stacked hairline shadows ("card sits on the page") | Media presented like gallery pieces |
| Mesh gradient as the hero's only decoration | Pill CTAs, subtle press feedback |
| Mono for metadata (dates, stack, labels) | 17px body with a calm reading rhythm |

**Language:** English only. Sentence case everywhere. Headlines may end with a period.

---

## 2. Design principles

1. **Work first, chrome last.** The interface steps back so the projects stand out. When unsure, remove.
2. **One accent, used rarely.** The palette is grayscale. Blue appears only on links, focus rings and one or two small signals.
3. **Precision over decoration.** Hairlines, exact alignment, consistent spacing. No blobs, no glassmorphism panels, no emoji, no stock illustrations.
4. **Motion explains, never performs.** Every animation shows where something came from, what changed, or what can be clicked. Nothing moves just to be noticed.
5. **Show, don't claim.** No skill bars, no percentages, no "passionate developer". Real screenshots, real diagrams, real outcomes (for example *"Won the Dragons' Den grand prize"*).

---

## 3. Color

### 3.1 Tokens

```css
:root {
  /* Light surfaces (default) */
  --canvas:          #fafafa;  /* page background */
  --surface:         #ffffff;  /* cards, media frames */
  --surface-sunken:  #f2f2f2;  /* placeholders, code blocks on light */
  --ink:             #171717;  /* primary text, primary buttons */
  --ink-secondary:   #525252;  /* body copy that isn't primary (7.8:1 on canvas) */
  --ink-tertiary:    #6b6b6b;  /* metadata only, never body text (5.2:1 on canvas, 4.8:1 on sunken) */
  --hairline:        #eaeaea;  /* borders, dividers */
  --hairline-strong: #d4d4d4;  /* hovered borders */

  /* Dark bands (featured sections, footer) */
  --night:              #0a0a0a;
  --night-surface:      #111111;
  --night-ink:          #ededed;
  --night-ink-secondary:#a1a1a1;
  --night-ink-tertiary: #8a8a8a;
  --night-hairline:     rgba(255,255,255,0.10);

  /* The single accent */
  --accent:        #0062d1;  /* links, focus, signals on light (5.5:1 on canvas) */
  --accent-night:  #3291ff;  /* same role on dark bands (6.3:1 on night) */

  /* Hero mesh gradient: hero only, never elsewhere */
  --mesh-1: #00dfd8;  /* cyan    */
  --mesh-2: #007cf0;  /* blue    */
  --mesh-3: #ff0080;  /* magenta */
  --mesh-4: #f9cb28;  /* amber   */
}
```

### 3.2 Rules

- Most of the page is `--canvas` with `--ink`. Dark bands (`--night`) are the stages of the launch: the opening scene, the featured project (MuseTrail) and the contact/footer. Light sections sit between them, like Apple's alternating product pages.
- `--ink-tertiary` is for metadata (dates, file labels) at small sizes. Never for sentences.
- The mesh colours appear as **light** (since 2026-10-06, a **horizon**): on the dark opening and on the contact band they rise behind the rim of a dark planet, like first light, with a crisp lit rim and a faint grain so the gradients never band. They drift slowly; on the opening they lean towards the pointer. All gradients, no blur filters. The same horizon heads every other page (case studies, privacy, legal, 404) and the next-project tile, so every page opens in the same light. It never sits on a light section.
- No other colors. Project screenshots bring their own color, and that is enough.
- All text meets WCAG AA (4.5:1 body, 3:1 large text). Metadata is text too: the small mono labels need 4.5:1, which is why `--ink-tertiary` is `#6b6b6b` and not a lighter gray.

### 3.3 Theme

v1 is **light-first with dark bands** (the Apple alternation). There is no global dark-mode toggle, because a toggle would break the deliberate light/dark rhythm. The browser UI color (`<meta name="theme-color">`) is `#fafafa`.

---

## 4. Typography

### 4.1 Families

- **Geist** (variable, OFL): headlines, body, UI.
- **Geist Mono** (variable, OFL): metadata, tags, dates, labels, code, terminal.
- Self-hosted via the `geist` npm package or `@fontsource-variable/geist*`. No Google Fonts request, no SF Pro.

### 4.2 Scale

Fluid sizes use `clamp(min, preferred, max)`. Tracking is negative at display sizes (the "tight" signature of both Vercel and Apple).

| Token | Size | Weight | Line-height | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | clamp(48px, 9vw, 120px) | 600 | 0.95 | -0.045em | Hero name only |
| `display` | clamp(40px, 6vw, 72px) | 600 | 1.0 | -0.04em | Section openers, featured project title |
| `h1` | clamp(32px, 4vw, 48px) | 600 | 1.1 | -0.03em | Project titles |
| `h2` | clamp(24px, 2.6vw, 32px) | 600 | 1.2 | -0.02em | Sub-sections |
| `h3` | 20px | 600 | 1.3 | -0.01em | Card titles |
| `lead` | clamp(19px, 1.6vw, 22px) | 400 | 1.45 | -0.01em | Hero subline, section intros |
| `body` | 17px | 400 | 1.55 | 0 | Default text |
| `small` | 15px | 400 | 1.5 | 0 | Card descriptions |
| `mono-label` | 12px | 500 | 1.4 | 0.02em | UPPERCASE eyebrows, tags, dates |
| `mono` | 14px | 400 | 1.6 | 0 | Code, terminal, inline tech |

### 4.3 Rules

- Maximum weight is **600**. Never 700+.
- Headlines are sentence case, never all-caps. Only `mono-label` may be uppercase.
- Body copy never uses mono.
- Reading width is at most `65ch`.
- Use `font-feature-settings: "ss01"` for Geist, and `tabular-nums` for dates and numbers.
- `text-wrap: balance` on headlines, `text-wrap: pretty` on paragraphs.

---

## 5. Layout & spacing

### 5.1 Spacing scale (4px base)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160`

- **Section padding (vertical):** `clamp(96px, 12vw, 160px)`.
- **Inside cards:** 24px (mobile) / 32px (desktop).
- **Headline → paragraph:** 12–16px. **Paragraph → CTA group:** 32px.
- Rule of thumb: space *between* groups ≥ 2× space *within* groups.

### 5.2 Grid

- Container: `max-width: 1200px`, side gutter `24px` (≥ 768px) / `16px` (mobile).
- 12-column grid, 24px gap (16px on mobile).
- Wide media may break out to `1400px` or full-bleed.
- Breakpoints: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.
- Mobile-first. No horizontal scroll at 360px width.

---

## 6. Shape & elevation

### 6.1 Radius

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 6px | Nav buttons, tags, inputs |
| `radius-md` | 12px | Small cards, code blocks |
| `radius-lg` | 16px | Project cards, media frames |
| `radius-xl` | 24px | Featured media |
| `radius-pill` | 9999px | Marketing CTAs, chips |

Nested radii: inner radius = outer radius − padding.

### 6.2 Shadows: stacked, never single

```css
--shadow-card:
  0 0 0 1px rgba(0,0,0,0.08),
  0 2px 2px rgba(0,0,0,0.04),
  0 8px 16px -4px rgba(0,0,0,0.04);

--shadow-card-hover:
  0 0 0 1px rgba(0,0,0,0.10),
  0 4px 8px rgba(0,0,0,0.04),
  0 24px 48px -12px rgba(0,0,0,0.10);

--shadow-night: 0 0 0 1px rgba(255,255,255,0.10);  /* dark bands: ring only */
```

No heavy blur shadows, no colored glows.

---

## 7. Motion

**Direction (2026-10-05): a product launch.** Samuele asked for the site to move like Apple's iPhone and MacBook pages, not like a page that fades things in. The work is presented as products in **pinned, scroll-driven scenes**: a section several screens tall whose stage sticks to the viewport, so scrolling plays the scene forwards and backwards. Devices are drawn in **CSS 3D** (no WebGL; see the option recorded below) and animated with **Motion** (`motion/react`) scroll-linked values.

### 7.1 Tokens

```css
--ease-out:      cubic-bezier(0.23, 1, 0.32, 1);    /* default for entering / responding */
--ease-in-out:   cubic-bezier(0.77, 0, 0.175, 1);   /* things moving on-screen A → B */
--ease-drawer:   cubic-bezier(0.32, 0.72, 0, 1);    /* overlays, sheets */

--dur-instant: 120ms;  /* press, color */
--dur-fast:    200ms;  /* hover, small UI */
--dur-base:    300ms;  /* overlays, menus */
--dur-reveal:  700ms;  /* reveals */
```

Springs for interactive things: `{ type: "spring", duration: 0.5, bounce: 0.15 }`; the glow uses `{ duration: 0.9, bounce: 0 }`. Never bouncy above 0.2.

### 7.2 Rules

- Animate only `transform`, `opacity`, `filter` and `clip-path`. Never layout properties.
- **Wheel smoothing (2026-10-06, Samuele: "lo scorrimento non è fluido").** A mouse wheel moves the page in 100px steps; Lenis turns them into one glide, so scenes play like a film. Only the wheel, and only on devices with a mouse (`hover: hover` and `pointer: fine`): touch, keyboard, scrollbar and anchor links stay native, a click on a link to another page stops the glide, and with reduced motion Lenis never loads. It loads when the page is idle.
- Scroll-linked scenes follow the scroll through a critically damped spring (`SCROLL_SPRING`: stiffness 140, damping 14.5, mass 0.35): about 50ms behind, enough to round off a keyboard jump, never floating behind the page.
- UI responses (hover, press, menu) finish in **≤ 300ms**. Scenes may take as long as their scroll length.
- Hover effects only for a fine pointer.
- **Reduced motion:** every scene renders its final state, unpinned, as an ordinary section; the glow stops; the project rail becomes a row you scroll sideways yourself. A Playwright project checks this.
- **Accessibility:** text that waits for a scene starts fully transparent, never dimmed, so it never reads as low-contrast text; all text stays real text in the DOM. Decorative 3D pieces are `aria-hidden`.
- **Small screens:** the opening scene pins everywhere; scenes with a lot of text (MuseTrail, Progmatic) pin from `lg` only, and below that they play as they pass through the viewport, with their copy above in normal flow.
- **Technology option:** devices are CSS 3D for weight and speed. Real 3D models (three.js / WebGL) were considered and kept as a later option if the CSS devices ever feel too stylised.

### 7.3 Scenes

1. **Opening (dark).** The name, in brushed metal with one sweep of light as the page opens, stands over the horizon. Scrolling is a sunrise: the light climbs and swells while the horizon sinks away and the name drifts up. Then the light work section slides up over it as a sheet with rounded top corners, and the opening steps back into the dark. 2.6 screens, the last one shared with the sheet. (Until 2026-10-06 the laptop rose here; Samuele moved it into the work, §7.3.2.)
2. **Young DCC (light): a MacBook launch.** The first project in *Things I've built.*, on the light page: the headline centred at the top, and under it a closed laptop already peeking in, which rises into place, opens on the hinge (−88° to 8°), wakes up on the platform's home page and leans in a touch. The laptop has a camera in its bezel, a glare across the glass and a soft floor shadow; on a light section it has no glow. Its deck is as wide as the lid at the hinge. Sized by the room the text leaves (a size container), so it always fits the screen. Three screens, pinned everywhere.
3. **MuseTrail (dark), a tile.** The band is a dark tile on the light page, inset from the edges with large rounded corners, like Apple's product tiles. Two phones (with side buttons, glass sheen and a floor shadow) swing round in 3D to face the visitor, the back one starting far behind so they never pass through each other, part to either side, and the four artworks of the *My Museum* screen float out of the screen to different depths around them. The text column fades in at the start. Then the pitch photo opens up from a smaller window as it scrolls into view (clip-path inset to full, image settling from 1.18 to 1).
4. **Progmatic (light): exploded view.** The assistant's interface tilts into an isometric view, comes apart into four layers (workspace, sidebar, brief, header), each named in a legend that slides in as its layer lifts, then clicks back together.
5. **More work: horizontal rail.** The section pins and scrolling slides the remaining project cards sideways. Cards lean towards the pointer (≤ 6°) with a soft light following it. Inside them, the Stedin chart draws itself left to right and the chess pawn plays b7 to b5. Projects without a screenshot yet get a drawn stand-in instead of a placeholder (§10): the ability scores of a character sheet (D&D).
6. **Headings and lists.** Section openers rise into focus word by word as they scroll into place. Stack groups and timeline rows rise in, staggered, with CSS scroll-driven animations (no JavaScript; browsers without support just show them). Card screenshots lean in (1.04) on hover.
7. **Finale (dark).** *Let's talk.* over the same horizon as the opening, closing the page.
8. **Copy email.** Unchanged: a toast confirms the copy.

### 7.4 Micro-interactions

- Buttons: `:active` → `scale(0.97)`, 120ms.
- Arrow icons in CTAs nudge 2px on hover.
- Nav: frosted after 24px of scroll; it takes the tone of the band behind it (dark over the opening, MuseTrail and contact).

---

## 8. Components

### 8.1 Navigation
Sticky, 64px tall. Left: the **"SP"** monogram in Geist Mono (links to top). Right: `Work` · `About` · `Contact` in 15px ink-secondary (turning ink on hover), then a GitHub icon button (44px hit area, 18px mark from Simple Icons). **No collapsed mobile menu:** the three short links fit on one line down to 320px, so they stay visible (no extra tap, no JavaScript). Every link has a 44px tall hit area.
- **Surface:** transparent over the hero; the frosted surface (canvas 80% + `blur(12px)`) fades in over the first 24px of scroll with a CSS scroll-driven animation. Browsers without support and reduced-motion users get the frosted surface from the start.
- **Tone:** over a dark band the nav switches to the night tokens (an IntersectionObserver on a line under the nav), so it never shows a grey bar over black.

### 8.2 Buttons
- **Primary:** `--ink` background, white text, `radius-pill`, 44px tall, 20px horizontal padding, 15px/500. Hover: background `#383838`.
- **Secondary:** `--surface` background, `--ink` text, a 1px `--hairline` ring, `radius-pill`. Hover: `--hairline-strong` ring.
- **On dark bands:** primary becomes white-on-ink inverted; secondary gets a `--night-hairline` ring.
- Minimum touch target 44×44px. A visible focus ring: `2px solid var(--accent)`, `outline-offset: 2px`.

### 8.3 Mono label / eyebrow
`mono-label`, uppercase, `--ink-tertiary`. Used **sparingly**: at most one eyebrow per three sections (the hero has one; regular sections open with their headline alone). Never numbered (`01 / …`), never a decorative index. Mono labels that carry real metadata (dates, context, tags) are not eyebrows and are fine.

### 8.4 Tech tag
Geist Mono 12px, `--ink-secondary`, 1px `--hairline` ring, `radius-sm`, 4px × 8px padding. No fill colors, no per-technology colors.

### 8.5 Media frame
Every screenshot sits inside a frame, never loose:
- **Browser frame** (for web apps): `--surface` with `--shadow-card`, `radius-lg`, and a 36px top bar with three 8px gray dots (`--hairline-strong`, *not* traffic-light colors) plus an optional mono URL pill.
- **Plain frame** (for photos, such as the MuseTrail pitch): `radius-lg`, 1px inner ring `rgba(0,0,0,0.06)`.
- **Phone frame** (for mobile apps, such as MuseTrail): a dark body drawn in CSS around a 1170 × 2532 screen, with a bezel and corner radii in percentages so it scales from its parent's height, a hairline-strong ring for the edge and a dark island at the top. Always dark, even on a light section. Phones never rotate: two phones stand side by side, the second set back (smaller and lower), like a product shot.
- Images use `object-fit: cover` and are lazy-loaded (except the hero), in AVIF/WebP format with explicit width and height.

### 8.6 Image placeholder
Used until the real image exists. It must look intentional, not broken:
- Same size and radius as the final media (aspect-ratio locked).
- `--surface-sunken` background with a subtle 45° hatch pattern (1px lines, 4% ink, 12px apart).
- Centered in Geist Mono 12px `--ink-tertiary`: the **slot ID**, the **aspect ratio**, and a one-line description of what goes there. Example:
  `IMG-CONNEQTECH-01 · 16:10 · Dashboard main view with map`
- Every slot is listed in §10 so it can be swapped by dropping a file into `/public/images/`.

### 8.7 Project card
`--surface`, `--shadow-card`, `radius-lg`, overflow hidden.
Top: a **sunken tray** (`--surface-sunken`) with the visual. Windows (browser frame, terminal) rise from the tray's bottom edge, inset 20px (32px from md) on the other sides, with their bottom corners hidden. From md up all trays share one height (288px md, 352px lg), so titles line up across a row. Bottom (24–32px padding):
- Mono row: who, then when: `CONNEQTECH · 2024-25`, `STEDIN · UNIVERSITY PROJECT`, `JAVA · 2024-25`.
- `h3` title, plus a 1–2 line `small` description in `--ink-secondary`.
- A row of tech tags.
- An arrow icon at the top right that nudges on hover.
The whole card is one link (it opens the case study), with the card spotlight on hover (§7.3.5).

### 8.8 Terminal block
For ChessGame, and anywhere code is the product. `--night-surface`, `radius-md`, Geist Mono 14px, `--night-ink`. A 32px top bar with gray dots and a title such as `chess.java`. Content is the game's **real output**, copied from Samuele's terminal: the prompts, the `[LOG]` line, the board and the move history after 1. a4 b5 (a debug line in Italian is left out). The game prints Unicode pieces; each square is a fixed 2ch cell so the board stays aligned whatever font draws them, and every piece carries the text variation selector (U+FE0E) so phones don't turn the black pawn into an emoji. The square the last move landed on and the player's typed input are set in `--night-ink`, the rest in `--night-ink-secondary`. The card shows the last move and the board; the case study shows the whole turn. Exposed to screen readers as one image with a description. Optionally it types itself out once when it enters the viewport (respecting reduced motion).

### 8.9 Diagram
For Progmatic. **What the assistant is built around**, not a component diagram of the code: the four pieces of the solution (document retrieval, FileMaker integration, access control, data confidentiality) connected to a central ink node, "Knowledge assistant". (Until 2026-10-06 this was framed as a research map; Samuele clarified that IO is the solution his team is building, not only research.) Mono labels in `radius-sm` boxes, 1.5px `--hairline-strong` lines drawn behind them. Exposed to screen readers as one image listing the pieces. Lines draw in on scroll (`stroke-dashoffset`) in the motion pass.

### 8.10 Timeline row
For the background/experience list. A 3-column row: mono date (`2024-25`) · role and company (`h3` + `small`) · a one-line outcome. Rows are separated by 1px `--hairline`. No hover state: the rows aren't interactive, and a hover would suggest they are.

### 8.11 Toast
Bottom center, `--ink` background, white 14px text, `radius-pill`, `--shadow-card-hover`. Enters from `translateY(16px) opacity 0`, 300ms `--ease-drawer`, and auto-dismisses after 2s.

### 8.12 Contact form (removed 2026-10-06)
Samuele chose email only: no form, so there is nothing to fill in, nothing stored, and no mail service, rate limiter or captcha behind the site. The form, its API route and their tests are in the git history if it ever comes back.

---

## 9. Page structure

One long page plus a case-study view per project. Sections open with a `display` headline; only the hero has an eyebrow (§8.3). Spacing is one section unit between consecutive sections (top padding only), and top and bottom for dark bands and the section before one.

### 9.0 Nav (see §8.1)

### 9.1 Hero: the opening scene (dark)
- A pinned scene (§7.3.1) on `--night`, pulled up under the nav, over the horizon (§3.2).
- Eyebrow `SOFTWARE ENGINEER · MIDDELBURG, NL`, `display-xl` **Samuele Poma.** (two lines on mobile), the `lead` line, CTAs **View work ↓** and **GitHub ↗**, bottom-left like an editorial cover.
- Scrolling is a sunrise over the horizon, then the work slides over it (§7.3.1).

### 9.2 Selected work
**Since 2026-10-06:** Young DCC (on the laptop), MuseTrail and Progmatic are scenes (§7.3.2 to §7.3.4); every other project is a card on the horizontal rail (§7.3.5): the veterinary practice system (its component diagram as the card visual, drawn in CSS: lines draw themselves as it scrolls in), Conneqtech, Stedin, ChessGame, the D&D character sheet generator (placeholder until a screenshot arrives) and the tower defense game. Progmatic's case study adds the RAG flow from the project README: eight steps over two rows, each lighting up in turn with an accent ring.

Section opener: `display`, *"Things I've built."*

**a) Featured: MuseTrail (a full-bleed `--night` band)**
- Two columns on desktop (text 5 cols, media 7 cols); stacked on mobile.
- A mono label with the award signal: `GRAND PRIZE · DRAGONS' DEN` in `--accent-night`. This is one of the two places the accent appears as a "signal".
- Title `display`: *MuseTrail*. Description: a web app encouraging sustainable digital habits in young adults. Role: full-stack development and team lead.
- Tags: `SvelteKit` `Docker`.
- Media: MuseTrail is designed for phones, so the product is shown on **two phone frames** (§8.5): *My Museum* (`IMG-MUSETRAIL-01`) in front, the progress screen (`IMG-MUSETRAIL-03`) set back to its right. The stage is square on phones and 5:4 from `sm`.
- Below, a plain-frame photo of the team pitching MuseTrail to professors and investors (`IMG-MUSETRAIL-02`, 16:9) in the media columns, with its caption in the text column, level with the photo's bottom edge (under it on mobile). The caption says what the photo shows; it does not claim it is the Dragons' Den.

**b) Bento grid (light canvas), 12 columns**

| Row | Left | Right |
|---|---|---|
| 1 | **Progmatic**: span 7, browser frame | **Young DCC**: span 5, browser frame |
| 2 | **Conneqtech**: span 5, browser frame | **Stedin**: span 7, browser frame |
| 3 | **ChessGame**: span 7, terminal (§8.8) | **Tower defense**: span 5, browser frame |

On mobile each card spans full width, in the same order. The order is the featured project, then the most recent work first.

Card content (facts from the résumé and from Samuele; the copy lives in `src/content/projects.ts`):
- **Progmatic**: `PROGMATIC · SINCE 2026` plus an accent `IN PROGRESS` status with a small dot (it signals real status; the pulse comes with the motion pass). *AI knowledge assistant.* IO, the local AI assistant Samuele's team is building for Progmatic: answers from the company's own data with their sources, plus drafts of emails, code and quotations. Tags: `AI` `Document retrieval` `FileMaker`. The diagram of what it is built around (§8.9) is in the case study.
- **Young DCC**: `DELTA CLIMATE CENTER · 2026`. *Youth climate events platform.* An online platform, built with the Delta Climate Center, to promote and organise events on environmental themes for young people in Zeeland. No tags until the stack is confirmed.
- **Conneqtech**: `CONNEQTECH · 2024-25`. *GPS monitoring dashboard.* A dashboard to track cars and bicycles and see their GPS data and vehicle details in one place. Built end to end during the internship. Tags: `Go` `Frontend` `Backend`.
- **Stedin**: `STEDIN · UNIVERSITY PROJECT`. *Grid monitoring.* Software for visualising power usage and monitoring faulty transformers across regions of the Netherlands. Tags: `Laravel` `PHP` `MySQL`.
- **ChessGame**: `JAVA · 2024-25`. *Chess in the terminal.* A text-based chess game built with object-oriented programming and design patterns. Tags: `Java` `OOP` `Design patterns`.
- **Tower defense**: `TYPESCRIPT`. *Tower defense game.* A tower defense game built with object-oriented TypeScript. Tags: `TypeScript` `OOP`.

Why not the earlier wording: "live" GPS data, "detecting" transformers, a `RAG` tag and "chess engine" all claimed more than the résumé says.

### 9.3 Case-study view (one per project)
Opened from the cards (§7.3.5) and the scenes, at `/work/[slug]`. The structure is always the same, and **every part is optional**: a fact that isn't confirmed yet means a shorter page, never a guessed one.
1. **A dark header over the horizon** (since 2026-10-06), pulled up under the nav: breadcrumbs (`HOME / WORK / MUSETRAIL`, mono, 44px hit areas; `Work` leads back to `/#work`), the card's context line (`TEAM PROJECT · 2024-25`, plus the `IN PROGRESS` status where it applies), the `display-xl` title (the page's only `h1`) and the `lead` one-liner.
2. **The main visual floats over the header's edge**, half on the dark band and half on the page, like a product on a stage: the browser frame at the slot's ratio, the two phones for MuseTrail, the full terminal transcript for ChessGame. No tray. Preloaded: it is the page's LCP. Projects without one end the header plainly.
3. A meta row: **Role** · **Team** · **Timeline** (long form, `Nov 2024 to Jan 2025`) · **Stack**, mono labels over values in `body` ink. Unknown values are left out, not shown empty.
4. Sections in a 4 + 8 column grid (`h2` on the left, staying in view while its section is read on wide screens; `lead`-size prose on the right, at most 60ch), separated by hairlines: **Problem** (1 paragraph, set as a large statement that lights up as it is read), **Approach** (1–3 paragraphs, plus the research map for Progmatic), **Outcome** (1 paragraph, then highlights as accent mono labels), **What I learned** and **Links** (only public repos and demos).
5. Gallery: 1–3 extra images in the right 8 columns, each caption in the left 4, level with the image's bottom edge. Images whose file is missing are skipped (an optional image never gets a placeholder).
6. **Next project:** a dark rounded tile over the horizon, inset from the edges like the home tiles: an accent mono `NEXT PROJECT` and the context line, the `display` title and one-liner, `Read the case study →`, and the project's card visual rising from the tile's bottom edge. The whole tile is one link; it loops from the last project back to the first.

### 9.4 Stack
Section opener: `display`, *"Tools I reach for."*
A **spec sheet** (two columns on desktop, one on mobile): each group has a mono label and a hairline list, every tool in `h2` type with, beside it, the projects whose stack lists it, linked to their case studies. Show, don't claim. The groups:
- **Languages**: Go, TypeScript, JavaScript, Java, PHP, SQL
- **Frameworks**: React, SvelteKit, Laravel, Tailwind CSS
- **Tools**: Git, GitHub, Docker, MySQL
- **Practices**: Domain-driven design, Design patterns, OOP, Agile teamwork

No logos wall, no progress bars.

### 9.5 About
Section opener: `display`, *"About me."* Then a **statement** in large type (two sentences: who Samuele is and how he works) whose words light up from tertiary to ink as it is read, with a CSS scroll-driven animation (the grey still meets AA; without support it is simply lit). Below it, two columns: short paragraphs (`lead`: the stack, and what he is working on now) on the left, and a **timeline** (§8.10) on the right:
- `2023-27` · HZ University of Applied Sciences · BSc ICT, Software Engineering
- `2024-25` · Conneqtech · Software engineering intern
- `2020-22` · Rondinella & Partners · Web development & marketing

Plus a small line of languages: `ITALIAN (NATIVE), ENGLISH (C1)`.
Below the timeline: a secondary button `Résumé (PDF) ↓` that downloads `/cv/samuele-poma-cv.pdf`. It renders **only when the file exists** (checked at build time), so there is never a broken link. This is the only résumé link on the page.
Optional portrait: `IMG-PORTRAIT`, 4:5, grayscale, `radius-lg`. Not shown until Samuele provides one (an optional image never gets a placeholder).

### 9.6 Contact (a `--night` band that merges into the footer)
- Centred, over the horizon (§3.2): `display-xl`, `--night-ink`: *"Let's talk."*, then one `lead` line: *"Have a project, a question or an idea? Email is the best way to reach me."*
- The email as the headline act, up to 72px: a real `mailto:` link that copies on click and confirms with a toast (§7.3.8); without JavaScript or clipboard access it opens the email app. On narrow screens it wraps after the `@`.
- Then three pills: `Write an email ↗` (primary, `mailto:`), GitHub ↗ (`github.com/SamuelePoma`) and LinkedIn ↗ (`linkedin.com/in/samuele-poma-547120242`). The résumé stays in About, so no intent is repeated.
- **No form** (§8.12) and **no phone number.**
- **No phone number.**

### 9.7 Footer (continues the `--night` band)
- A hairline on top (`--night-hairline`), 32px padding, mono 12px `--night-ink-secondary`.
- Left: `© {current year} Samuele Poma`. Right: `Privacy` and `Legal` links.
- On mobile the two groups stack.

### 9.8 Utility pages
All utility pages use the nav and footer.
- **404:** a full dark screen over the horizon, centred: a mono eyebrow `ERROR 404`, the `display-xl` text *"This page doesn't exist."*, a `lead` line, a primary button `Back home` and a secondary `View work`.
- **Error (500 / runtime):** the same layout, *"Something broke."*, plus a `Try again` button (resets the error boundary) and `Back home`. Never show a stack trace or error message.
- **Privacy / Legal:** a short dark header over the horizon (breadcrumb, mono `LAST UPDATED` label, `display` title, `lead` intro), then the text in a `65ch` reading column styled as `body`, with `h2` sections and anchor links on the headings. On wide screens an *On this page* list of the sections stays in view beside it.

---

## 10. Image slots

Put files in `/public/images/`. Format: **WebP or AVIF**, sRGB, long edge 2400px for 16:10 media and 1600px for the others. Until a file exists, the component renders the placeholder from §8.6 using the text below.

| Slot ID | Where | Ratio | What to put there | Status |
|---|---|---|---|---|
| `IMG-MUSETRAIL-01` | Featured band (front phone) plus case-study hero | 9:19.5 | The *My Museum* screen. Straightened from the team's poster | ✅ In place |
| `IMG-MUSETRAIL-02` | Featured band photo | 16:9 | The team pitching MuseTrail to professors and investors | ✅ In place |
| `IMG-MUSETRAIL-03` | Featured band (back phone) plus case-study gallery | 9:19.5 | The progress screen (CO2 saved compared with the average user). Cropped from the poster | ✅ In place |
| `IMG-CONNEQTECH-01` | Card plus case-study hero | 16:10 | The fleet health dashboard, from Samuele's final Figma design (fake data) | ✅ In place |
| `IMG-CONNEQTECH-02` | Case-study gallery | 16:10 | The faulty devices table, from the same design | ✅ In place |
| `IMG-STEDIN-01` | Card plus case-study hero | 16:10 | The voltage chart of one transformer over two weeks, on a white page | ✅ In place |
| `IMG-STEDIN-02` | Case-study gallery | 16:9 | Samuele's project group at work | ✅ In place |
| `IMG-STEDIN-03` | Case-study gallery | 2:1 | The Figma screen designs and the flow between them (padded to 2:1, never cropped) | ✅ In place |
| `IMG-PROGMATIC-01` | Card plus case-study hero | 16:9 | The assistant's overview screen. The signed-in user's name and avatar are blurred | ✅ In place |
| `IMG-YOUNGDCC-01` | Card plus case-study hero | 16:10 | The platform's home page | ✅ In place |
| `IMG-TOWERDEFENSE-01` | Card plus case-study hero | 16:9 | The game's win screen | ✅ In place |
| `IMG-PORTRAIT` | About | 4:5 | A professional portrait on a neutral background, shown in grayscale | Optional |
| `OG-IMAGE` | Social share preview | 1200×630 | Generated from the hero (name plus mesh), not a photo | Built in code |
| `CV-PDF` | `/public/cv/samuele-poma-cv.pdf` | A4 PDF | The résumé **without the phone number** (it's public) | Samuele to export |

ChessGame needs no images: the terminal block is the visual. Slots shown on the live site while their file is missing get a drawn stand-in instead of the placeholder (`illustration` in `src/content/media.ts`): `IMG-DND-01` shows the ability scores of a character sheet (the course's standard array). The real image replaces it as soon as the file exists. The source files Samuele sent are kept untracked in `assets-src/`; the exported WebP files are what ships.

---

## 11. Accessibility & quality bar

- WCAG 2.2 AA. Every interactive element is reachable by keyboard and has a visible focus ring.
- Semantic landmarks (`header`, `main`, `section[aria-labelledby]`, `footer`) and one `h1` per view.
- Every image has meaningful `alt` text; decorative elements use `aria-hidden`.
- `prefers-reduced-motion` is respected everywhere (§7.2).
- Lighthouse targets: **Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100**.
- LCP < 2.0s, CLS < 0.05. Fonts use `font-display: swap` and the Geist variable font is preloaded.
- Verified visually with Playwright at 375 / 768 / 1280 / 1920 widths before each release.

---

## 12. Do / Don't

**Do**
- Leave more whitespace than feels comfortable.
- Put every screenshot in a frame.
- Use mono for every date, tag and label.
- Write short, concrete copy: what it is, what you did, what happened.
- Keep the accent to links, focus, the award label and the "in progress" dot.

**Don't**
- ❌ Add colors, gradients (outside the hero), glows or colored shadows.
- ❌ Use weight 700+, all-caps headlines, or mono body text.
- ❌ Use skill bars, percentages, logo walls, emoji, or stock illustrations.
- ❌ Use typewriter hero text, cursor trails, particle backgrounds, or scroll-jacking (wheel smoothing, §7.2, is the one exception: it never changes where the page goes, only how it glides there).
- ❌ Use bounce easing, `scale(0)` entrances, or animations over 300ms on UI that is used repeatedly.
- ❌ Use single drop-shadows, or heavy blurred shadows.
- ❌ Use CV language: "seeking", "hire me", "looking for an internship", phone numbers. (Listing a past internship as experience is fine.)
- ❌ Center-align long text. Only short hero or contact lines may be centered.

**Template tells (never on the site)**
- ❌ Em dashes (—) or en dashes (–) anywhere in visible text, alt text or metadata. Ranges use a hyphen (`2024-25`); pauses use a period, comma or colon.
- ❌ Numbered section eyebrows (`01 — Selected work`, `02 / Stack`) or an eyebrow above every section (max one per three sections).
- ❌ Decorative mono strips (a row of technologies at the bottom of the hero, `DESIGN · BUILD · SHIP`-style lines).
- ❌ Locale or clock strips (`Middelburg 14:32`), scroll cues (`Scroll ↓`), version stamps.
- ❌ More than one middle dot (`·`) per line of metadata.
- ❌ Decorative status dots. The only dot on the site is Progmatic's `IN PROGRESS`, because it reports real status.
