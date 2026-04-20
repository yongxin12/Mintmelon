# Abetka Experience Replica Design

Date: 2026-04-20

## Goal

Recreate the experience of `https://abetkaua.com/en/` inside the current Mintmelon Next.js project. The target is an experience-level replica: preserve the visual language, page rhythm, section structure, and interactive feel without copying proprietary source assets such as original images, typefaces, or animation files.

## Scope

The implementation replaces the current placeholder locale home page with a complete long-form editorial page available at `/en/` and `/zh/`. Both locales use the same Abetka-inspired English content and preserve the existing locale routing and validation.

In scope:

- Black editorial interface with high-contrast white typography.
- Minimal navigation with home, language links, Abetka, and About anchors.
- Hero with small intro copy and oversized title: "Typeface Alphabet of the Ukrainian Identity".
- Featured letter cards near the hero.
- Introductory sections for 33 symbols and 33 fonts.
- A dense 33-item alphabet grid using Ukrainian letters, transliterations, numbers, topic titles, and font names.
- Repeating visual bands and ticker-like rows to mimic the original site's motion density.
- Footer with share links, partner blocks, language links, credit text, and copyright.
- Responsive desktop and mobile layouts.

Out of scope:

- Downloading or embedding the original site's proprietary images, exact fonts, or animation bundles.
- Pixel-perfect reproduction of canvas/WebGL behavior.
- Letter detail pages behind each alphabet item.
- Production analytics, CMS integration, or external API calls.

## Current Project Context

The project is a Next.js 15 App Router site with Tailwind CSS and existing locale routes:

- `app/[locale]/page.tsx` currently renders a placeholder home page.
- `app/[locale]/layout.tsx` validates `en` and `zh` and renders the existing navigation.
- `styles/globals.css` contains global dark theme defaults.
- The project is intended for static export and GitHub Pages deployment.

The replica should fit this structure and avoid new dependencies unless required.

## Architecture

Use a single statically rendered page component backed by local data.

- `app/[locale]/page.tsx` renders the complete replica page.
- Alphabet entries are defined as a typed constant array in the page module unless the file becomes unwieldy; if needed, move data to `app/[locale]/abetka-data.ts`.
- Styling is split between semantic class names in the page markup and global CSS in `styles/globals.css`.
- No client-side state is required for the first version. Hover and responsive behavior are CSS-only.

This keeps the implementation static-export friendly and minimizes moving parts.

## Visual System

The visual direction follows the original site's black-and-white typographic editorial style:

- Background: near-black, with occasional off-white inverted sections.
- Text: off-white, high contrast, large display type using system fonts.
- Layout: full-width bands, large spacing, dense grids, and deliberate typographic scale shifts.
- Motifs: Ukrainian Cyrillic letters, numeric indices, bracketed transliterations, plus signs, repeated `33` fields, and bordered cells.
- Motion feel: CSS marquee/ticker bands and hover transforms instead of imported animation libraries.

The design must avoid looking like a generic card landing page. The main experience should start immediately and remain full-bleed.

## Page Sections

1. **Navigation**
   - Top bar with `a Home`, language links, `Abetka`, and `About`.
   - Uses anchors within the single page.

2. **Hero**
   - Small intro line: "The History of Ukrainian Struggle from A to Z — in the literal sense of these letters".
   - Oversized title: "Typeface Alphabet of the Ukrainian Identity".
   - Featured letter strip with several representative entries.

3. **Intro / About**
   - Short explanatory paragraphs based on the original page's public-facing text, paraphrased where practical.
   - `33 fonts` and `33 symbols` counters.
   - Repeated `33` pattern field.

4. **Alphabet Grid**
   - 33 entries.
   - Each entry includes font name, display letter, transliteration label, symbol/topic title, number, and plus marker.
   - Layout adapts from multi-column desktop grid to single-column mobile list.

5. **Visual Interludes**
   - Repeating rows of letters and selected topics.
   - Used between major sections to create the original's dense scrolling rhythm.

6. **Closing / Share / Footer**
   - Repeats the main title.
   - Share links to Facebook, Twitter/X, and LinkedIn.
   - Partner-style blocks for Projector and Telegraf.Design.
   - Language links, designer credit, and copyright.

## Data

The alphabet data includes 33 Ukrainian letters and topics visible from the original page, including examples such as:

- Antonov AN-225 Mriya
- Budynok "Slovo"
- Volia
- Holodomor
- Georgiy Gongadze
- Danylo Halytskyi
- Aeneid by Ivan Kotliarevsky
- Peresopnytske Yevanheliie
- Zhyvyi lantsiuh
- Zaporizka Sich
- Ivan Franko
- Mariupol
- Orlyk's Constitution
- The Trident of Volodymyr the Great
- Chornobyl Disaster
- "Shchedryk"
- Yuzivka

The data is static and does not need runtime fetching.

## Accessibility

- Use semantic landmarks: `main`, `section`, `nav`, `footer`.
- Keep links keyboard focusable.
- Ensure hover states also have focus-visible styles.
- Preserve readable contrast.
- Avoid text that overflows on mobile by using fixed responsive breakpoints and `clamp()` with bounded values.
- Ticker/interlude content is decorative and should not create confusing duplicate navigation.

## Error Handling

Locale validation remains in place through `isLocale(locale)` and `notFound()`.

No network requests are required at runtime, so runtime failure surface is minimal. Build-time TypeScript checks should catch data shape mistakes.

## Testing And Verification

Run:

- `pnpm typecheck`
- `pnpm build`
- `pnpm dev`

Manual browser checks:

- `/en/` loads the replica page.
- `/zh/` loads the same experience without locale errors.
- Desktop and mobile widths keep text inside containers.
- Alphabet grid and footer render completely.
- Hover and focus states do not shift layout.

## Implementation Notes

Use no new npm packages for this version. Prefer CSS-only motion and static data. Keep file edits focused on:

- `app/[locale]/page.tsx`
- `styles/globals.css`
- optionally `app/[locale]/abetka-data.ts` if the page module becomes too large
- `.gitignore` for generated brainstorming artifacts
