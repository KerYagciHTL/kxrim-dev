# kxrim-dev — yagci.cc

Personal site of Kerimcan Yagci (KerYagciHTL), live at https://yagci.cc.
**The production site is the static project in `site/`** — plain HTML/CSS/JS, no build
step. It is served by the systemd unit `kxrim-web` (npx serve on 127.0.0.1:3300) behind
a cloudflared tunnel (`/etc/cloudflared/config.yml`, hostname yagci.cc).

## History / what lives where

- `site/` — **the real site** (V4 "Apple glass" design). index.html + style.css +
  main.js + scene.js + self-hosted fonts. Also archives the approved style demos as
  `v4.html` and `v2.html`.
- `demo/` — the style-demo iterations that led to V4. Kept for reference, not served.
- `src/`, `index.html` (root), `package.json`, Vite config — the **rejected first
  build** (dark industrial R3F concept). Not served anywhere. Safe to delete once
  Kerimcan confirms; see CONTINUOUS/HANDOFF.md.

## The design (V4 — approved through 4 iterations)

- Light warm paper `#f2f0eb`, night `#14161f`, one accent family: electric `#4553e8`,
  periwinkle `#8b94ff`, sky `#9fd4ff`. No other hues.
- Type: Clash Display (display) + Switzer (text), self-hosted in `site/fonts/`
  (Fontshare, ITF Free Font License).
- Frosted-glass surfaces everywhere (blur + saturate, white hairlines, specular
  highlight following the mouse, 3D tilt on cards).
- **Horizontal scroll on desktop** (Lenis `orientation: horizontal`, wheel scrolls
  sideways, arrow keys + glass dock navigate); **vertical stack on mobile** (<768px).
- Two procedural three.js "milk glass" blobs (scene.js), phase-shifted, reacting to
  mouse + scroll. Nothing floats randomly — every motion answers user input.
- Micro-details are part of the language: Vienna clock, sheen sweep through the outline
  name, dock tooltips, go-pills, copy-email chip, magnet button with pulse ring,
  dynamic tab title, custom SVG cursor, hidden native scrollbar, film grain.

## Working on the site

- Edit `site/*` directly; no build. `sudo systemctl restart kxrim-web` is NOT needed
  for file changes (serve reads from disk), only for unit changes.
- Verify visually with headless Chromium (playwright-core is installed in the session
  scratchpad; system libs installed). Screenshot desktop 1440 AND mobile 375 — mobile
  support is an explicit requirement from Kerimcan.
- External CDN deps of the live site: lenis@1.3.11, three@0.185.1 (jsdelivr). Consider
  self-hosting later (HANDOFF).
- Reduced motion: full static fallback (no smooth scroll, no animations, one still
  3D frame). Touch devices: hover-dependent UI (go-pills) is always visible.

## Content rules (binding)

All statements about Kerimcan are verified facts — never invent projects, metrics,
quotes, or dates. SlideLizard is always "one-month Ferialpraktikum, summer 2026".
Afterfall is a subway-building school team project. No testimonial quotes (decided);
"references available on request" is the ceiling.

## Git rules (binding)

- Commit after each coherent unit. English, imperative, **subject line only**, <72
  chars. No body, no Co-Authored-By, no "Generated with" trailer
  (use `git -c core.hooksPath=/dev/null commit`). Never push unless asked.
