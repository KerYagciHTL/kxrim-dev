# Handoff — kxrim-dev rebuild

Session date: 2026-07-23. State: **feature-complete first pass, visually verified in
headless Chromium, not yet profiled on real hardware, not deployed.**

## Design direction (approved by Kerimcan — do not silently redesign)

The one idea: **"order from raw material"** — his own line, "small ideas, made into
stable building blocks," made literal. One continuous scroll-driven camera path; a field
of scattered instanced slabs assembles into an ordered lattice wall as you scroll; the
hero monolith (custom GLSL: radial simplex displacement, flat facet shading) settles from
turbulence to stillness. Visual language is technical-document, not sci-fi: hairline
rules, measurement ticks, index numerals, manifest rows. Typography: Archivo Variable
condensed/heavy + IBM Plex Mono, two faces total. Palette: ink `#0e0f0c`, bone
`#e8e4da`, signal orange `#ff4d00` — nothing else. Language: **English only** (decided).
Approved failure-mode list (no purple gradients, no gradient text, no Inter, no centered
hero, no card grids, no fake copy) is in the original brief and still binding.

## What works

- Preloader (real-readiness counter → panel mask reveal), hero with per-line mask intro,
  ClientWork (YSL route diagram drawn by scroll scrub, bleeds off-grid; MOE schematic
  with crawling lane line, cropped "02" numeral), Projects manifest rows, Record,
  Contact (email plate-drop + signal fill wipe)
- Scene: camera dolly path, monolith settle + velocity agitation, scatter→lattice
  assembly, bloom/CA/vignette, DOM grain overlay
- Reduced-motion: no canvas, static elevation drawing, native scroll, everything visible
  without animation. No-WebGL gets the same treatment. Noscript has a text fallback.
- Mobile 375px verified via screenshots: type scales, nav collapses to numerals,
  diagrams stack, scene runs reduced counts
- `npm run build`, `lint`, `format:check`, `typecheck` all pass clean

## Verified via headless screenshots (SwiftShader)

Desktop 1440×900, mobile 375×800, reduced-motion — all sections. Console: clean except
one upstream `THREE.Clock` deprecation warning from R3F 9.6.1 (documented in CLAUDE.md).
FPS numbers from headless SwiftShader (1–7 fps) are **software-rendering artifacts, not
real measurements**.

## Not done yet (prioritized)

1. **Profile on real hardware** — 60fps desktop / 30fps mid-phone is a brief
   non-negotiable and is UNVERIFIED. Knobs if needed: fragment count, monolith segments,
   dpr cap, drop bloom on mobile.
2. **Measure LCP** on throttled 4G (target < 2.5s). The three chunk is already lazy;
   check whether the Archivo latin woff2 (90 kB) should be `<link rel="preload">`-ed.
3. **Real screenshots of client sites** — the diagram frames in ClientWork were designed
   to accept a live capture (see TODO comments in RouteDiagram/MoeSchematic). Playwright
   + system Chromium deps are installed on this machine now; capture yagcisons.at and
   moe-v.de and drop them in, or keep diagrams-only (they hold up on their own).
4. Contrast audit pass (body copy tokens were chosen for ≥4.5:1 over ink, but verify
   over the brightest scene states), keyboard walk-through, screen-reader pass.
5. Deploy. Old site auto-deploys from this repo — **check `.github/workflows` was
   deleted with the old tree (it was) and set up Pages/CF deployment fresh.**

## Every TODO(content) — needs Kerimcan

- `src/content/content.ts`: Afterfall one-line description (repo has none)
- `src/content/content.ts`: what he actually built at SlideLizard + which summer (year)
- ClientWork.tsx (both entries): request real testimonial quotes from YSL and MOE —
  **do not write placeholder quotes**
- Old site listed "HtmlForge" (Java HTML-generation library) and a "real-time chat
  application" — repos not public; ask whether to include, else leave out
- `yagci.cc` is registered but 404s, and it's the GitHub repo's homepage field — is it
  the intended canonical domain, or does kxrim.is-a.dev stay?

## Open decisions

- Client-site visuals: hand-built diagrams (current) vs live screenshots vs both.
  Diagrams chosen initially because no browser was available; that constraint is gone.
- Whether the contact-section monolith should sit slightly further right at the final
  camera waypoint (it crowds ~40% of frame at 1440×900; reads as intentional, but
  taste-check it on a real display).

## Facts inventory (verified sources, for future copy edits)

All copy in `src/content/content.ts` traces to: kxrim.is-a.dev (bundle strings),
api.github.com/users/KerYagciHTL, yagcisons.at, moe-v.de, slidelizard.com. HTL period
2022–2027; "Higher Department of Computer Science"; email
k.yagci@students.htl-leonding.ac.at; Ansfelden AT. Nothing else may be asserted about
him without asking.
