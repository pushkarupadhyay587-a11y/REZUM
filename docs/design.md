---
name: Rezum Brutalist-Editorial System
version: 1.0
source: Stitch export "minimalist career navigator" (code.html, screen.png, DESIGN.md)
colors:
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5b5f63'
  on-secondary: '#ffffff'
  secondary-container: '#e0e2e8'
  on-secondary-container: '#616469'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#181c20'
  on-tertiary-container: '#818489'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e0e2e8'
  secondary-fixed-dim: '#c4c6cc'
  on-secondary-fixed: '#191c20'
  on-secondary-fixed-variant: '#44474c'
  tertiary-fixed: '#e0e2e8'
  tertiary-fixed-dim: '#c4c6cc'
  on-tertiary-fixed: '#181c20'
  on-tertiary-fixed-variant: '#44474b'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e3'
typography:
  headline-2xl:
    fontFamily: Syne
    fontSize: 4.5rem
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: -0.035em
  headline-2xl-mobile:
    fontFamily: Syne
    fontSize: 2.75rem
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Syne
    fontSize: 3.25rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 2.125rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Syne
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.14em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.18em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.625rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.2em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

# Rezum Design System

Design reference for **Rezum**, a career platform that scores resumes, matches jobs and builds skill roadmaps. This file describes the visual system from the Stitch export and how to apply it across the app.

**How to read this file**
- Sections 1 to 9 describe the design as exported. Values come straight from the source tokens, `code.html` and the `screen.png` mockup.
- Section 10 is an **extension**: how the same system applies to app screens the mockup does not show (resume editor, report, job detail, tracker, auth, settings). Those screens are proposals, not part of the export.
- Section 12 lists inconsistencies in the source. Read it before building.

---

## 1. Concept

**Brutalist-editorial.** A monochrome, architectural look that treats a career like a published dossier. It rejects the usual blue-and-friendly corporate job board in three ways:

1. **Type carries the page.** Heavy, tightly tracked display headings (Syne) against small, widely spaced uppercase labels (Hanken Grotesk). The contrast is the identity.
2. **Structure is visible.** 1px hairlines divide the page into bays like a blueprint. Panels sit flush against each other and share borders.
3. **Two shapes only.** Containers are sharp rectangles. Everything you can press is a pill or a circle.

Color is almost absent. Black, off-white and a few cool greys do all the work, so the user's own content (scores, job titles, salaries) is the loudest thing on the page.

**Audience in the mockup:** senior professionals and executives (Staff, Principal, VP roles). If Rezum also serves graduates and career switchers, keep the visual system but soften the copy (see section 9).

---

## 2. Color

All values are in the frontmatter. This section says what to use them for.

### Core roles

| Role | Token | Hex | Use |
|---|---|---|---|
| Canvas | `surface` / `background` | `#f9f9fa` | Page background |
| Raised panel | `surface-container-lowest` | `#ffffff` | Cards, inputs, workbench panels |
| Quiet band | `surface-container-low` | `#f3f3f4` | Alternate section background, metrics strip, hover fill, input fill |
| Chip / track fill | `surface-container` | `#eeeeef` | Tags, progress track, icon circles, row hover |
| Ink | `primary` | `#000000` | Headlines, primary buttons, outline buttons, strong values |
| Dark module | `primary-container` | `#1c1b1b` | Hero and testimonial band backgrounds |
| Body text | `on-surface-variant` | `#444748` | Paragraphs and descriptions |
| Metadata | `secondary` | `#5b5f63` | Labels, captions, secondary values |
| Hairline | `outline-variant` | `#c4c7c7` | Borders, always at reduced opacity (below) |
| Error | `error` / `error-container` | `#ba1a1a` / `#ffdad6` | Failed checks, validation |

The prose brief names the ink as `#111111`. The exported token and the HTML use `#000000`. See section 12.

### Hairline opacities (from the HTML)

| Context | Class | Meaning |
|---|---|---|
| Section dividers | `border-outline-variant/40` | Strong structural line |
| Panel and card frames | `border-outline-variant/30` | Standard frame |
| Header bottom edge | `border-outline-variant/30` | Same as frame |
| Inner dividers inside a panel | `border-outline-variant/20` | Quiet rule |
| Inputs | `border-outline-variant/40` | Rest state; focus becomes `border-primary` |
| Outline pills at rest | `border-outline-variant/50` | Unselected chip or filter |
| On dark modules | `border-on-primary/15` to `/40` | White hairlines |

### Semantic color

The mockup has none. Pass and fail are shown with icons and text, not hue. Keep it that way for pass states (`check_circle` in black). Use `error` and `error-container` only for real failures and validation. If a warning state is needed, use a bordered pill with the label "REVIEW", not a new color.

### Dark surfaces

Dark is used as a *module*, not a theme. The hero and testimonial bands use `primary-container` with a grayscale photo, a `from-primary via-primary/70 to-primary/40` gradient scrim, and these text tones:

| Text on dark | Token | Hex |
|---|---|---|
| Headline | `surface-bright` | `#f9f9fa` |
| Lead paragraph | `secondary-fixed` | `#e0e2e8` |
| Metadata | `primary-fixed-dim` | `#c8c6c5` |
| Quiet captions | `secondary-fixed-dim` | `#c4c6cc` |

There is no full dark theme in the source (`darkMode: "class"` is set but no dark palette is defined). If one is needed, see the extension note in section 10.7.

---

## 3. Typography

**Fonts** (Google Fonts):
- **Syne**, weights 500 to 800, for every heading, stat number and the wordmark.
- **Hanken Grotesk**, weights 300 to 700, for body text, labels, buttons, inputs and metadata.
- **Material Symbols Outlined** for icons.
- Monospace (system `font-mono`) is used once, for the raw resume text area, at `text-xs`.

```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### Scale and where each step is used

| Token | Size / weight | Used for |
|---|---|---|
| `headline-2xl` | 72px / 800, tracking -0.035em | Hero headline only |
| `headline-2xl-mobile` | 44px / 800 | Hero headline below 768px |
| `headline-xl` | 52px / 700 | Section titles ("We structure it best."), testimonial quote, big score numbers |
| `headline-xl-mobile` | 34px / 700 | Same, mobile |
| `headline-lg` | 36px / 700 | Secondary section titles |
| `headline-md` | 24px / 600 | Module titles inside bays |
| `headline-sm` | 20px / 600 to 700 | Card titles, stat values, wordmark, roadmap step titles |
| `body-lg` | 18px / 400 (set to `font-light` in use) | Hero lead paragraph |
| `body-md` | 16px / 400 (set to `font-light` in use) | Section paragraphs |
| `body-sm` | 14px / 400 | Card text, table rows, inputs |
| `label-lg` | 13px / 600, 0.14em | Rare; larger metadata |
| `label-md` | 11px / 600, 0.18em | Buttons, nav links, panel headers |
| `label-sm` | 10px / 600, 0.2em | Overlines, field labels, chips, status lines, footer |

### Rules
- **Every label is uppercase** and wide-tracked. Never sentence-case a `label-*` string.
- **Headings are sentence case** with a full stop on statement headlines ("Career architecture that matters."). Card titles take no full stop.
- Hero line-height is pulled to `leading-[0.95]` and the testimonial to `1.08`. Everything else follows the token.
- Body copy uses `font-light` (300) on both light and dark panels. This looks refined but is thin; see section 11.
- Numbers that line up in columns (scores, salaries, counts) should use tabular figures. The source does not set this, so add `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`).
- Keep running text near 65 characters wide. The mockup uses `max-w-2xl` (42rem) for lead text and `max-w-md` for side notes.

### Micro-formatting patterns

| Pattern | Example |
|---|---|
| Overline above a heading | `CAPABILITIES`, `TELEMETRY PREVIEW`, `DIRECTORY` |
| Module index | `MODULE 01 // PARSER` |
| Two-part location | `AUSTIN, TX // HYBRID` |
| Status line | `SYSTEM PROTOCOL 04.9 // LIVE DATABASE` |
| Result line | `PASS // NO PARSE FAULTS` |
| Numbered steps | `01 // Consensus Protocols & Storage Engines` |
| Range | `MILESTONES 01 — 04` |
| Edition mark | `ISSUE 04 // 2025 EDITION` |

The double slash `//` is the system's separator. Use it for compound metadata and nowhere else.

---

## 4. Layout and spacing

### Grid
- **Desktop (1200px and up):** 12 columns, `gap-gutter` (24px), content max width **1720px**, centered.
- **Tablet (768 to 1199px):** 8 columns. Side rails collapse into drawers.
- **Mobile (under 768px):** 4 columns, stacked.
- Outer margin: `margin` (48px) on desktop, `margin-sm` (20px) on mobile. In code: `px-margin-sm lg:px-margin`.
- Section vertical padding: `space-xl` (48px) top and bottom. Hero is taller (see below).

### Spacing tokens

| Token | Value | Typical use |
|---|---|---|
| `space-xs` | 4px | Stacked list items, tight gaps |
| `space-sm` | 8px | Icon-to-text gaps |
| `space-md` | 16px | Card padding (compact), control gaps |
| `space-lg` | 28px | Card padding, nav gap |
| `space-xl` | 48px | Section padding, bay padding on desktop |
| `gutter` | 24px | Grid gap |
| `gutter-sm` | 16px | Grid gap on small screens |

### Persistent structure
- **Hairlines end at the container edge.** A section header sits on a full-width 1px rule (`border-b border-outline-variant/40`) and the content below sits flush to it.
- **Bays share borders.** In a 3-up or 4-up grid, only the right border of each cell (`md:border-r`) and the bottom border of the row are drawn. Do not give each card its own full border plus margin.
- **Mobile:** vertical dividers become horizontal ones (`border-b` on each cell, `md:border-b-0 md:border-r` from tablet up).

### Header
Fixed, 80px tall, `bg-surface/90` with `backdrop-blur-md` and a bottom hairline. Left to right: logo mark, wordmark `REZUM`, 1px divider, descriptor `CAREER INTELLIGENCE SYSTEM` (large screens only). Center (from `xl`): nav `JOBS`, `ANALYZER`, `RESUME BUILDER`, `ROADMAPS`, `RESOURCES`. Right: circular search button, `SCHEDULE DEMO` outline pill, `SIGN IN` solid pill, 32px avatar circle.

The active nav item uses `text-primary font-semibold border-b-2 border-primary`. Idle items are `text-on-surface-variant`.

The blur is the one place the system uses `backdrop-filter`. It is a functional choice to keep content legible under a fixed bar, not a depth effect.

### Footer
`bg-surface-container-low`, top hairline. 12-column grid: brand block (4), `EXPLORATION` links (2), `PLATFORM` links (2), `DISPATCH TRANSMISSION` email signup (4). Below a `border-outline-variant/20` rule: copyright line and three legal links (`TERMS OF SERVICE`, `PRIVACY DIRECTIVE`, `SECURITY AUDIT`) in `label-sm`.

---

## 5. Elevation and depth

No soft shadows, no glass, no stacked layers. Depth comes from:

1. **Tonal steps:** `surface` → `surface-container-lowest` (white) for raised panels; `surface-container-low` for recessed bands.
2. **Hairline frames:** 1px borders at 8 to 30% ink.
3. **Planar shifts:** hover moves a cell from white to `surface-container-low`. Nothing lifts.
4. **Overlays (spec only):** modals and drawers use a solid border and a flat matte veil `rgba(17, 17, 17, 0.4)`. No blur, no shadow.

Two exceptions exist in the mockup: the featured inset card in the hero uses `shadow-2xl` to separate it from the photo, and the input panel uses `shadow-sm`. Treat the hero card as the only intentional shadow. Remove `shadow-sm` when building the app.

---

## 6. Shape

| Element | Radius |
|---|---|
| Panels, cards, bays, inputs, textareas, table rows | **0** (the mockup uses `rounded-sm`, 2px; either is acceptable, pick one) |
| Buttons, nav pills, filter pills, chips, tags, status badges, search field in footer | **Full pill** (`rounded-full`) |
| Icon buttons, avatar, step dots, circular scroll button, play button | **Circle** (1:1, `rounded-full`) |

Do not use the intermediate radii (`sm` 0.5rem, `md`, `lg`, `xl`) from the token list for containers. They exist in the config but the design never applies them to boxes.

---

## 7. Components

Each recipe is the Tailwind class set used in `code.html`, so it can be copied into the app. The `font-label-*` and `text-label-*` classes come from the Tailwind config in the export (see section 13).

### 7.1 Buttons

**Primary (ink fill)**
```
inline-flex items-center justify-center px-8 py-3 rounded-full
bg-primary text-on-primary hover:bg-neutral-800
font-label-md text-label-md uppercase tracking-wider font-semibold
transition-all duration-200
```
Compact version: `px-6 py-2.5` or, in the nav, `px-space-lg py-2.5`.

**Outline (hairline ink)**
```
inline-flex items-center justify-center px-8 py-3 rounded-full
border border-primary text-primary hover:bg-primary hover:text-on-primary
font-label-md text-label-md uppercase tracking-wider transition-colors
```

**On dark:** outline uses `border-surface-bright text-surface-bright hover:bg-surface-bright hover:text-primary`; solid uses `bg-surface-bright text-primary hover:bg-surface-container-high`.

**With arrow:** add a `material-symbols-outlined text-[18px] ml-2` arrow and `group-hover:translate-x-1 transition-transform` on the arrow only.

**Busy state (from the re-evaluate button):** `opacity-50 pointer-events-none`, label becomes `AUDITING...`, icon becomes `refresh` with `animate-spin`. Restore after the result arrives.

**Group hover:** inside a bay, the outline button fills black when the whole bay is hovered (`group-hover:bg-primary group-hover:text-on-primary`).

### 7.2 Circular triggers
- **Icon button (header search):** `w-10 h-10 rounded-full border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-primary`.
- **Module icon:** `w-14 h-14 rounded-full bg-surface-container text-primary`, 24px icon, scales to 110% on bay hover.
- **Scroll prompt:** `w-16 h-16 rounded-full border border-on-primary/40`, arrow nudges down 4px on hover.
- **Arrow-out badge (featured card):** `w-8 h-8 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary`.
- **Avatar:** `w-8 h-8 rounded-full bg-primary` with a white `person` icon.

### 7.3 Chips and tags
- **Keyword chip:** `px-2.5 py-1 bg-surface-container rounded-full font-label-sm text-label-sm text-on-surface border border-outline-variant/30`.
- **Tech tag in a card:** `px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm`.
- **Status badge:** `px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm` (example: `HIGH DEMAND`).
- **Segmented pills (single choice):** selected `bg-primary text-on-primary border-primary`; unselected `border-outline-variant/50 text-secondary hover:text-primary`. Used for target vertical and job filters.

### 7.4 Form fields
- Label above, `label-sm`, uppercase, `text-secondary`, `mb-1`.
- Input: `w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm text-on-surface focus:outline-none focus:border-primary`.
- Textarea: same, `p-3`, `font-mono text-xs` when the content is raw resume text.
- Focus: border goes from grey to `primary`. **No glow ring.** Because `focus:outline-none` removes the browser outline, the border change must be visible enough on its own. Use `focus-visible:border-primary focus-visible:border-2` or keep the 1px black border plus a 2px offset outline for keyboard users (see section 11).
- Newsletter field: a pill container `border border-outline-variant/60 rounded-full p-1 bg-surface-container-lowest` holding a borderless input and an inline `SUBSCRIBE` pill.

### 7.5 Cards and bays
- **Capability bay (3-up):** `p-space-lg md:p-space-xl`, `md:border-r border-outline-variant/40`, flex column with content top and button bottom. Hover: `bg-surface-container-low`. Order inside: circle icon, `MODULE 0N // NAME` overline, `headline-md` title, `body-md` light paragraph, outline button.
- **Job card (4-up):** `p-space-lg`, flex column. Top row: location line (`label-sm`, secondary) and `north_east` arrow (secondary, turns black and moves right 4px on hover). Then `headline-sm` title, `body-sm` light blurb. Bottom: a `border-t border-outline-variant/20` row with `BASE + EQUITY` label left and `label-md` bold range right, then up to three tag pills.
- **Metric tile:** white, `border border-outline-variant/30 p-space-md`. Overline label and 18px icon on one row, then big `headline-xl` number with `/ 100` in `label-md`, a 6px track (`h-1.5 bg-surface-container`) with a `bg-primary` fill, and a one-line `label-sm` caption.
- **Workbench panel:** white, `border-outline-variant/30`, header row with a 10px black dot, `label-md` title and a right-aligned `label-sm` reference, divided from the body by `border-b border-outline-variant/20`.
- **Featured inset card (hero):** white card with a vertical `FEATURED` tab on the left (`writing-mode: vertical-rl; rotate-180`, on `surface-container-highest`), body to the right.
- **Note card:** `p-space-md bg-surface-container-lowest border border-outline-variant/30` with overline, `headline-sm` title, `body-sm` text and a text-link action with a `download` icon.

### 7.6 Result rows (parser matrix)
`flex justify-between p-2.5 bg-surface-container-low hover:bg-surface-container`. Left: 18px `check_circle` in black plus a semibold `body-sm` name. Right: `label-sm` result text in the pattern `PASS // REASON`. Rows are separated by `space-y-3`, not borders.

### 7.7 Roadmap timeline
- Container: `space-y-8 relative`, with a vertical 1px line (`before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40`).
- Each node: `relative pl-10`, a 12px solid black dot (`w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest`) at `left-1.5 top-1.5`.
- Node content: title row with `headline-sm` ("01 // Title") and pacing on the right (`3 WEEKS PACING`), a `body-sm` light description, then a `label-sm` bold line `INCLUDES: ...`.
- Final node uses `FINAL CAPSTONE` in place of a duration.
- The spec also allows 16px outlined rings for steps that are not yet complete. The mockup shows only solid dots (all upcoming). Use solid for done, outlined ring for not started, and a solid dot with a 1px outer ring for current.

### 7.8 Section header
```
grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pb-space-lg border-b border-outline-variant/40
  col-span-8: overline (label-sm, secondary) + headline-xl or headline-lg
  col-span-4: right-aligned primary button
```

### 7.9 Data strip
`bg-surface-container-low border-b border-outline-variant/30`, 2 columns on mobile and 4 on desktop. Each item: 20px secondary icon, `label-sm` caption, `headline-sm` bold uppercase value (`14,280 ROLES`).

---

## 8. Landing page anatomy (as exported)

Top to bottom, with the grid and background of each band:

| # | Section | Background | Content |
|---|---|---|---|
| 1 | **Hero** | `primary-container` + grayscale boardroom photo at 45% opacity (luminosity blend) + gradient scrim + 12-column construction lines at 20% | Status bar (`SYSTEM PROTOCOL 04.9 // LIVE DATABASE`, `UPDATED 14 MIN AGO`, `LATENCY 24MS`); overline; 72px headline "Career architecture that matters."; lead paragraph; two CTAs (`EVALUATE RESUME`, `FIND ROLES (14,280)`); bottom row with featured card, two mini stats, circular scroll button |
| 2 | **Metrics strip** | `surface-container-low` | Four live figures |
| 3 | **Capabilities** | `surface-container-lowest` | "We structure it best." and three bays: Resume Analyzer, Aggregated Job Matrix, Skill Blueprints & Vectors |
| 4 | **Dossier preview** | `surface-container-low` | Two-column workbench. Left (5 cols): input panel with title field, vertical pills, raw text, `RE-EVALUATE`. Right (7 cols): three score tiles plus the parser compatibility matrix and keyword chips |
| 5 | **Testimonial** | `primary-container` + photo at 30% + left-to-right scrim | Single large quote, play-circle, name and company line |
| 6 | **Curated positions** | `surface-container-lowest` | Filter pills, four-bay job grid, "SHOWING 4 OF 14,280" line and `ACCESS COMPLETE DATABASE` button |
| 7 | **Roadmaps** | `surface-container-low` | Left (4 cols): copy plus a free-download note card. Right (8 cols): four-step timeline |
| 8 | **Closing CTA** | White section, `surface-container-low` boxed panel | Overline `COMMENCE PROTOCOL`, headline, two CTAs |
| 9 | **Footer** | `surface-container-low` | See section 4 |

Backgrounds alternate white and `surface-container-low` so the page reads as stacked bands separated by hairlines.

### Hero details
- Minimum height `92vh`. The mockup lets the hero run under the fixed header with `-mt-20`, then adds `pt-36 lg:pt-48` inside so content clears it.
- Photo: `mix-blend-luminosity` at `opacity-45`, `scale-105`, so it reads as texture. Use a dark, desaturated architectural or office interior. No people looking at the camera, no stock-handshake imagery.
- Construction lines: a 4-column (mobile) or 12-column overlay of 1px `border-on-primary/30` right edges at 20% opacity.
- The pinging dot (`animate-ping`, 8px) beside the status line is the only looping animation in the page.

---

## 9. Voice and content

The mockup writes in an engineered, "intelligence agency" tone: *dossier, telemetry, protocol, vector, blueprint, bay, dispatch, directive.* This is part of the style.

**Do**
- Keep label text short and uppercase: `RUN ATS SCAN`, `BROWSE 14,280 JOBS`, `EXPLORE PATHWAYS`.
- Use real units and counts in meta lines (`3 WEEKS PACING`, `18 OF 19 DETECTED`, `$310K - $385K`).
- Use plain, specific verbs on buttons. A button says what happens.

**Be careful**
- The jargon should never replace clarity in a form, error or empty state. A person fixing their resume needs "Add a result to this bullet", not "Quantified impact deficit detected". Use the editorial voice for headings and metadata, and plain language for instructions and errors.
- Keep body paragraphs to two sentences where possible. The mockup's descriptions run long; trim them in the app.

**Placeholder claims in the mockup.** These are invented demo content and must not ship unless they are true and sourced:
- `98.4% ATS PASS RATIO`, `99.1% PRECISION`, `11.4 DAYS` mean interview invitation, `540 ENTERPRISES`, `14,280 ROLES`
- `AUDIT COMPLIANCE ISO-27001`
- The testimonial from "Marcus Vaughn, CTO, Synapse Distributed Systems"
- "40+ leading enterprise applicant tracking systems" and the Greenhouse, Workday and Lever pass results
- "Unredacted salary and equity bands for 1,200 tech roles" and the 48-page PDF
- "Verified" and "curated" labels on jobs
Replace each with real data from the product, or remove it. A simulated ATS pass result in particular must not be presented to users as an actual parse of their file.

---

## 10. Extension: applying the system to Rezum's app screens

> This section is not in the Stitch export. It applies the same tokens and components to the screens in `prd.md` and `workflow.md`. Treat it as a proposal to confirm with design.

### 10.1 App shell
Reuse the fixed header. Replace marketing nav with product nav: `RESUME`, `ANALYZER`, `JOBS`, `ROADMAPS`, `TRACKER`. Replace `SCHEDULE DEMO` with a user menu (avatar circle). Keep `SIGN IN` for logged-out users only. Page content sits on `surface` with the same 1720px max width and margins.

### 10.2 Resume editor
- Two bays: editor (7 cols) and live preview (5 cols), sharing a 1px vertical hairline.
- Section list on the left of the editor as vertical rows with a circle reorder handle, section name in `label-md`, and a visibility toggle (pill switch: black when on, outlined when off).
- Fields use section 7.4. One bullet per textarea, with an `AI REWRITE` outline pill beneath.
- Preview is a white sheet with a hairline frame. It renders the chosen template, not the app's own typography.
- Template picker: row of segmented pills (`CLASSIC`, `COMPACT`, `TECHNICAL`). Every template is a single column to stay readable by ATS parsers.
- Versions: a `VERSION 3 // BACKEND ENGINEER` overline with a dropdown styled as a pill.

### 10.3 Analysis report
- Top: one large score tile (the `headline-2xl` number with `/ 100`, 6px track) beside five category tiles as in the metric tile recipe. Category names and weights come from `workflow.md` (ATS compatibility 25, Content impact 25, Skills match 20, Structure and clarity 15, Language quality 10, Completeness 5).
- Below: the **fix list** as full-width rows in the result-row style. Each row: severity pill (`HIGH`, `MEDIUM`, `LOW`, shown as outline pills with increasing fill, not colors), the exact resume text in a mono block, a plain-language reason, and a primary `APPLY FIX` pill.
- Applying a fix never changes the resume silently. The row shows the proposed rewrite first; the pill reads `ACCEPT REWRITE`. Placeholder numbers appear as `[N]` for the user to fill.
- A job-targeted score uses the keyword chip pattern, with found keywords as solid chips and missing ones as dashed-outline chips.
- Score uplift between versions uses a two-point line chart in black on white with a faint 1px grid, endpoint dot and value labels. No gradient fills.

### 10.4 Jobs
- Directory header with filter pills (`ALL`, `REMOTE`, `HYBRID`, saved searches) and a sort select styled as a pill.
- Results use the 4-up bay grid on desktop, 2-up on tablet, 1-up on mobile. Add a match figure in the top-right of each card in `headline-sm` (`91%`) with a 6px track beneath.
- Replace `BASE + EQUITY` with the real pay label from the listing, and omit the row when the listing has no pay.
- Keep the location pattern `CITY // MODE`.
- Show the data source on each card in `label-sm` (`GREENHOUSE`, `LEVER`, `ADZUNA`) so users know where the posting lives.

### 10.5 Job detail
- Split view: listing (8 cols) and a sticky match panel (4 cols).
- Match panel: big percent, why-you-match list with `check_circle` rows, missing skills as dashed chips each linking to its roadmap, then three stacked actions: `TAILOR RESUME`, `APPLY ON SITE` (primary), `SAVE`.
- Assisted apply opens the employer's posting in a new tab; return to Rezum to press `MARK AS APPLIED`.

### 10.6 Roadmaps
Use the timeline from 7.7 for the staged plan (Foundations, Core, Projects, Interview prep). Under each node, resources appear as a compact list: type chip (`DOCS`, `VIDEO`, `COURSE`), title, duration, and a circular `north_east` link. Progress is a checkbox rendered as a 16px circle that fills black when done. A header row shows `4 OF 10 COMPLETE` and hours remaining. Only show a resource link that the app has verified.

### 10.7 Tracker
Five columns (`SAVED`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`) as bays with shared hairlines. Cards are flat white rows with company, role and date; move buttons are circle arrows. Keep it plain; no drag shadows (use a 1px black outline while dragging).

### 10.8 Auth and settings
Auth: a centered 480px white panel on `surface`, hairline frame, `label-sm` overline, `headline-lg` title, stacked fields, a full-width primary pill, and a Google button as an outline pill. Settings: left rail of text links in `label-md`, right column of panels. The privacy panel holds `EXPORT MY DATA` (outline pill) and `DELETE ACCOUNT` (outline pill with `error` text and border, plus an inline confirmation row before anything is deleted).

### 10.9 Dark theme (if required)
The source does not define one. A faithful derivation inverts the roles and keeps the hairline rules:

| Role | Light | Dark (proposed) |
|---|---|---|
| Canvas | `#f9f9fa` | `#111111` |
| Raised panel | `#ffffff` | `#1c1b1b` |
| Quiet band | `#f3f3f4` | `#161616` |
| Ink / primary fill | `#000000` | `#f9f9fa` (button text becomes `#111111`) |
| Body text | `#444748` | `#c4c6cc` |
| Metadata | `#5b5f63` | `#9a9da2` |
| Hairline | ink at 8 to 30% | `#ffffff` at 12 to 20% |

Check every pairing for contrast before adopting; these values are not from the export.

---

## 11. Interaction, motion and accessibility

### Motion
| Where | Effect | Timing |
|---|---|---|
| Buttons | Color or fill change | `duration-200` to `300` |
| Arrow buttons | Arrow shifts right 4px | `transition-transform` |
| Scroll button | Border brightens, circle scales to 105%, arrow drops 4px | `duration-300` |
| Bay hover | Background to `surface-container-low`, module icon scales to 110% | `duration-300` |
| Job card hover | Background to `surface-container-low`, `north_east` arrow moves right 4px and turns black | `duration-200` |
| Hero photo | `scale-105` with `duration-1000 ease-out` (reserved for a slow settle) | 1000ms |
| Status dot | `animate-ping` | looping |
| Re-evaluate | 600ms simulated wait, spin icon, then new values | 600ms |

Respect `prefers-reduced-motion`: disable the scale, translate and ping effects and keep color changes. The source does not do this; add it.

### States
- **Hover:** tonal shift only (to `surface-container-low`/`surface-container`) or fill inversion on buttons.
- **Active/selected:** solid black pill with white text.
- **Focus:** black border on fields. For buttons and links add a visible 2px black outline with 2px offset (`focus-visible:outline outline-2 outline-offset-2 outline-primary`). The export strips outlines on some links, so add this back.
- **Disabled:** `opacity-50`, no hover change.
- **Loading:** inline spinner icon and the label changes to a present-tense verb in caps.
- **Selection color:** `selection:bg-primary selection:text-on-primary`.

### Contrast (computed from the token values)

| Pair | Ratio | Verdict |
|---|---|---|
| `on-surface` on `surface` | 16.3 : 1 | Pass |
| `primary` on `surface` | 20.0 : 1 | Pass |
| `on-surface-variant` on white | 9.4 : 1 | Pass |
| `secondary` on white | 6.4 : 1 | Pass |
| `secondary` on `surface` | 6.1 : 1 | Pass |
| `secondary` on `surface-container-low` | 5.8 : 1 | Pass |
| `secondary` on `surface-container` | 5.6 : 1 | Pass |
| `primary-fixed-dim` on `primary-container` | 10.1 : 1 | Pass |
| `secondary-fixed` on `primary-container` | 13.3 : 1 | Pass |
| `on-primary-container` (`#858383`) on `primary-container` | 4.6 : 1 | Pass for text 18px and above or bold; borderline for small text |
| `outline` (`#747878`) on white | 4.5 : 1 | Borderline; do not use for small text |
| `outline-variant` hairlines | below 3 : 1 | Decorative only. Never the sole indicator of state or a control's edge |

### Accessibility notes
- **Small type.** `label-sm` is 10px with all caps and wide tracking. It passes contrast but is small. Use `label-sm` for decoration and metadata only. For anything a user must read to complete a task (field labels, error text, button text) use `label-md` (11px) at minimum and prefer 12px.
- **Thin body weight.** `font-light` at 14 to 16px reduces legibility. Use weight 400 for body text in forms, reports and any long reading; keep 300 for large display-adjacent paragraphs.
- **Controls without a visible edge.** Segmented pills at rest use a 50%-opacity hairline. Add a stronger border (`outline` `#747878`) for toggle controls so their boundary is clear.
- **Color is never the only signal.** Pass and fail are icon plus text. Keep this.
- **Icon-only buttons** need `aria-label` (the header search button has one; add it everywhere).
- **Nav is hidden below `xl`** in the export (`hidden xl:flex`), leaving no mobile navigation. Add a menu button and a full-height drawer using the overlay spec (solid border, matte veil).
- **Landmarks and headings:** one `h1` per page; keep section titles at `h2`.
- **Touch targets** at least 40px. The 32px avatar and 18px arrow icons need a larger hit area.

---

## 12. Inconsistencies in the source

Decide these before building so the app does not mix both versions.

| Topic | What the files say | Recommendation |
|---|---|---|
| Ink color | Prose: `#111111`. Token and HTML: `#000000` (`primary`). Dark bands: `#1c1b1b`. | Use `#000000` for text and fills, `#1c1b1b` for dark modules. Update the prose. |
| Container radius | Prose and Shapes: `0px`. HTML: `rounded-sm` (2px) on panels. Token `rounded.sm` is `0.5rem`. | Use `0`. If 2px is kept, do not use the token `sm`, which is 8px. |
| Hover fill | Prose: `#F0F1F3`. Tokens: `surface-container-low` is `#f3f3f4`. | Use `surface-container-low`. |
| Hover fill on buttons | Prose: `#333538`. HTML: `hover:bg-neutral-800` (`#262626`). | Use `#333538` as a named token (`primary-hover`). |
| Headline weights | Token `headline-2xl`: 800. HTML sets `font-bold` (700) on the hero. | Use the token weight (800). |
| Font-size classes | Tailwind config maps `text-label-sm` to 10px, but the HTML also adds `tracking-widest` (0.1em) on many labels, which overrides the token's 0.2em. | Remove the extra `tracking-*` classes and rely on the token tracking. |
| Dark mode | `darkMode: "class"` is enabled, but no dark palette exists. | See 10.9, or drop the setting. |
| Hairline values | Prose gives `rgba(17,17,17,0.08)` for section dividers; HTML uses `outline-variant` at 20 to 50%. | Use the HTML values (section 2); they read better on `#f9f9fa`. |
| Shadows | Prose forbids shadows. HTML uses `shadow-2xl` (hero card) and `shadow-sm` (input panel). | Keep only the hero card shadow. |
| Mobile nav | Not designed. | Add one (see section 11). |
| Hover on touch | Several effects depend on hover only. | Mirror important hover reveals (arrow, button fill) with focus and active states. |

---

## 13. Implementation reference

### Tailwind config (from the export)
The export loads Tailwind from the CDN and extends the theme. For a production build, move the same values into `tailwind.config.js`:

```js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: { /* every key in the frontmatter `colors` block, as shown in the YAML above */ },
      borderRadius: { DEFAULT: "1rem", lg: "2rem", xl: "3rem", full: "9999px" },
      spacing: {
        "space-xs": "0.25rem", "space-sm": "0.5rem", "space-md": "1rem",
        "space-lg": "1.75rem", "space-xl": "3rem",
        "gutter-sm": "1rem", gutter: "1.5rem",
        "margin-sm": "1.25rem", margin: "3rem"
      },
      fontFamily: {
        // every headline-* uses Syne; body-* and label-* use Hanken Grotesk
        "headline-2xl": ["Syne"], "headline-xl": ["Syne"], "headline-lg": ["Syne"],
        "headline-md": ["Syne"], "headline-sm": ["Syne"],
        "body-lg": ["Hanken Grotesk"], "body-md": ["Hanken Grotesk"], "body-sm": ["Hanken Grotesk"],
        "label-lg": ["Hanken Grotesk"], "label-md": ["Hanken Grotesk"], "label-sm": ["Hanken Grotesk"]
      },
      fontSize: {
        "headline-2xl": ["4.5rem",  { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "800" }],
        "headline-xl":  ["3.25rem", { lineHeight: "1.1",  letterSpacing: "-0.03em",  fontWeight: "700" }],
        "headline-lg":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.02em",  fontWeight: "700" }],
        "headline-md":  ["1.5rem",  { lineHeight: "1.3",  letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm":  ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em",  fontWeight: "600" }],
        "body-lg":      ["1.125rem",{ lineHeight: "1.65", letterSpacing: "-0.01em",  fontWeight: "400" }],
        "body-md":      ["1rem",    { lineHeight: "1.6",  letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-sm":      ["0.875rem",{ lineHeight: "1.5",  letterSpacing: "0",        fontWeight: "400" }],
        "label-lg":     ["0.8125rem",{ lineHeight: "1.2", letterSpacing: "0.14em",   fontWeight: "600" }],
        "label-md":     ["0.6875rem",{ lineHeight: "1.2", letterSpacing: "0.18em",   fontWeight: "600" }],
        "label-sm":     ["0.625rem",{ lineHeight: "1.2",  letterSpacing: "0.2em",    fontWeight: "600" }]
        // plus headline-2xl-mobile (2.75rem/800) and headline-xl-mobile (2.125rem/700)
      }
    }
  }
}
```

The mobile headline tokens are defined but the HTML never applies them (it uses `text-headline-2xl` at every width). Apply them with a breakpoint: `text-headline-2xl-mobile md:text-headline-2xl`.

### Python app (FastAPI + Jinja2 + Tailwind + HTMX)
This matches the stack in `trd.md`.
- Put the tokens in `tailwind.config.js` and build CSS with the Tailwind CLI; do not ship the CDN script to production.
- Create Jinja macros for the repeated parts: `button(label, variant, href)`, `chip(label)`, `metric_tile(label, value, caption, icon)`, `bay_card(...)`, `section_header(overline, title, action)`, `timeline_node(...)`.
- Self-host Syne and Hanken Grotesk (or keep Google Fonts with `font-display: swap`) and declare fallbacks: `Syne, "Helvetica Neue", Arial, sans-serif` and `"Hanken Grotesk", system-ui, sans-serif`.
- Use HTMX for the re-evaluate button, filter pills and tracker moves so the page stays server-rendered.
- Icons: Material Symbols Outlined at weight 300 to 400, FILL 0, sizes 16, 18, 20, 24px.

### Assets in the export
| File | Contents |
|---|---|
| `code.html` | Full landing page, Tailwind CDN, 3 small scripts (re-evaluate, role pills, filter pills) |
| `screen.png` | Full-page mockup of the landing page |
| `DESIGN.md` | The original design-system spec (tokens and prose) |

The hero and testimonial photos and the logo are hosted on Google's image CDN in the export. Download and self-host licensed replacements before launch; those URLs are not stable.

---

## 14. Checklist before shipping a screen

- [ ] Containers have square corners; every pressable element is a pill or circle.
- [ ] Borders are 1px hairlines at the opacities in section 2. No drop shadows (except the hero card).
- [ ] Headings are Syne, sentence case. Labels are Hanken Grotesk, uppercase, tracked.
- [ ] Interactive labels are 11px or larger and body text in forms is weight 400.
- [ ] Every control has a visible keyboard focus state.
- [ ] No invented statistics, testimonials, certifications or ATS results.
- [ ] Pass and fail are shown with an icon and text, not color alone.
- [ ] Works at 400px wide with a 20px side margin and no horizontal scroll.
- [ ] Hover reveals have a focus or tap equivalent.
