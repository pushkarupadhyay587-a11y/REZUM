---
name: ReZum Brutalist-Editorial System
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

## Brand & Style

This design system establishes a high-end, architectural, and editorial atmosphere for career management, portfolio curation, and talent discovery. By drawing cues from contemporary European spatial design monographs and stark brutalist publishing, the interface rejects the typical generic corporate aesthetic in favor of uncompromising typographic presence, pristine grid discipline, and monochromatic authority.

The visual style is characterized by:
- **Architectural Grid Visibility:** Subtle 1px structural guidelines and panel divides organize complex professional data, giving the platform the precision of a blueprint.
- **Editorial Typography Contrast:** Severe contrast between bold, tight-aperture display headings and micro-tracked, all-caps technical metadata labels.
- **Minimal Monochromatism:** Surfaces are kept lean and unadorned, relying on stark contrast between deep carbon charcoals and crisp, clinical off-whites to let candidate qualifications and career milestones read as high-impact editorial artifacts.
- **Sculpted Interactive Details:** Tactile pill-shaped button silhouettes, hairline action badges, and delicate circular affordances provide an elevated, gallery-grade experience.

## Colors

The palette operates on high-contrast architectural values. The primary color is a deep obsidian carbon `#111111`, driving high-impact typographic titles, primary interactive pills, and crisp boundary lines. The base canvas is `#F9F9FA` with structural panel contrasts anchored by `#FFFFFF` and `#F0F1F3`.

Subtle secondary and tertiary values (`#64676C` and `#8E9196`) provide nuanced middle tones for editorial summaries, body copy, and secondary structural metadata. Dynamic interactive states, hover tiers, and subtle badge highlights introduce muted industrial slates rather than standard saturated chromatic accents, preserving the restrained architectural atmosphere across both light and dark surface environments.

## Typography

The typography pairs the structural, sculptural heft of `Syne` for headlines with the clean, modernist neutrality of `Hanken Grotesk` for analytical reading and metadata displays.

- **Display Headlines:** Headlines use tight negative tracking and compressed line heights to create decisive poster-like graphic statements.
- **Editorial Sub-headers & Metadata Labels:** Labels (`label-lg`, `label-md`, `label-sm`) are rendered in all-caps with generous letter-spacing (`0.14em` to `0.2em`). This micro-tracking references the navigational indices and blueprint notations common in architectural archives.
- **Body Elements:** Long-form summaries, resume career entries, and role descriptions favor balanced line height and legible baseline geometry to ensure frictionless review across dense documentation.

## Layout & Spacing

The layout philosophy follows a disciplined fluid structural grid inspired by spatial architectural elevations:

- **Grid Architecture:** Desktop displays utilize a 12-column grid intersected by continuous hairline borders. Columns function as visible bays where candidate metrics, resume modules, and career roadmaps sit flush against grid boundaries.
- **Outer Margins:** Generous screen margins (`3rem` on desktop, adapting down to `1.25rem` on mobile) isolate the content area, preserving white space and eliminating visual noise.
- **Section Dividers:** Content sections do not float randomly in space; they terminate on structural axis lines spanning 100% of the container width with `1px solid rgba(17, 17, 17, 0.08)`.
- **Responsive Adaptation:**
  - *Desktop (1200px+):* 12-column grid, persistent structural borders, multi-column editorial modules.
  - *Tablet (768px - 1199px):* 8-column grid with grouped secondary metadata rails transitioning to collapsible drawers.
  - *Mobile (< 768px):* 4-column stack; horizontal dividing lines convert to vertical stack dividers while keeping strict top and bottom baseline margins.

## Elevation & Depth

This design system avoids blurry drop shadows, soft volumetric skeuomorphism, and heavy layered elevations. Depth is articulated purely through tonal layers, high-definition hairline frames, and flat architectural shifts:

- **Low-Contrast Outlines & Hairlines:** Hierarchy is declared using crisp `1px` lines tinted with `#111111` at 8% to 15% opacity on light canvases, and `#FFFFFF` at 12% to 20% opacity on dark modules.
- **Planar Surface Tiers:** Raised elements (such as quick-view candidate dossiers or active job filters) rely on background tone shifts: transitioning from the canvas (`#F9F9FA`) to elevated surface panels (`#FFFFFF`), outlined with precise borders.
- **Overlay States:** Modal dialogs, roadmaps, and drawer components employ a sharp solid border paired with an unblurred semi-opaque matte veil (`rgba(17, 17, 17, 0.4)`), eliminating diffuse ambient shadows entirely in favor of editorial clarity.

## Shapes

The geometric identity is defined by a deliberate tension between strict orthogonal rectilinear structures and fully rounded pill contours:

- **Containers, Panels & Cards:** Remain strictly rectilinear with zero border-radius (`0px`), aligning directly with the visible architectural grid framework.
- **Interactive Triggers & Action Badges:** In direct contrast to the razor-sharp container frames, all interactive action triggers—including buttons, tags, circular media buttons, and step indicators—utilize full pill roundedness (`roundedness: 3` / 9999px).
- **Circular Badges:** Directional icon containers and navigation buttons are rendered as absolute circles (1:1 aspect ratio with 50% border radius), mirroring classic architectural compasses and mechanical stamps.

## Components

### Buttons & Circular Triggers
- **Pill Outlines:** Outlined pill buttons featuring a 1px border (`#111111`), transparent background, all-caps tracked typography (`label-md`), and comfortable horizontal padding (`1.75rem`).
- **Primary Obsidian Fill:** Solid `#111111` background, crisp off-white text, and seamless hover transition to muted slate tones (`#333538`).
- **Action Circles:** Circular action buttons (such as carousel arrows, scroll prompts, or media triggers) with thin 1px hairline borders and centered minimal iconography, providing architectural balance next to heavy headings.

### Form Inputs & Resume Analyzer Fields
- **Minimal Hairline Fields:** Inputs are styled with clean bottom-borders or razor-sharp hairline bounding boxes, using clear background fills (`#FFFFFF`).
- **Labeling:** Floating or upper-anchored micro-tracked uppercase labels (`label-sm`), providing a schematic-style appearance. Focus states transition the border from subtle grey to sharp `#111111` without glow rings.

### Career Roadmaps & Timeline Nodes
- **Linear Nodes:** Structural vertical and horizontal grid lines punctuated by small circular micro-indicators (5px solid points or 16px outlined rings).
- **Status Indicators:** Minimal monotone badges indicating completion, skill compatibility score, or job application phase.

### Cards & Job Explorer Listings
- **Grid-Aligned Cards:** Job listings, resume modules, and metric widgets sit within bordered grid bays. No floating shadows; cards border each other seamlessly along shared 1px interior boundary lines.
- **Hover Micro-Interactions:** On cursor engagement, the card's background shifts subtly to `#F0F1F3`, and the secondary micro-label reveals a subtle directional arrow (`→`).

### Chips & Metadata Tags
- **Architectural Chips:** Compact pill-shaped enclosures with hairline borders, utilizing `label-sm` typography and minimal vertical padding to tag job competencies, salary benchmarks, and tech stacks without cluttering the screen.