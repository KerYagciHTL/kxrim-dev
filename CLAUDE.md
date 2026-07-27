# kxrim-dev · yagci.cc

Personal site of Kerimcan Yagci (KerYagciHTL), live at https://yagci.cc.
**The production site is the static project in `site/`.** Plain HTML/CSS/JS, no build
step. It is served by the systemd unit `kxrim-web` (npx serve on 127.0.0.1:3300) behind
a cloudflared tunnel (`/etc/cloudflared/config.yml`, hostname yagci.cc).

## What lives where

- `site/`: **the site, the only codebase** (V4 "Apple glass" design): index.html,
  style.css, main.js, scene.js, self-hosted fonts (`fonts/`), language icons
  (`icons/`, devicon), `icon.png` (his GitHub avatar, used as favicon).
- `package.json`: only `serve` (the systemd unit runs `npx serve … site`).
- Everything else is documentation: CLAUDE.md, ASSETS.md, LICENSE,
  CONTINUOUS/HANDOFF.md. There is deliberately **no README** (his request). The old
  R3F build and the style demos were deleted 2026-07-23 (git history keeps them).

## The design (V4, approved through 4 iterations)

- Light warm paper `#f2f0eb`, night `#14161f`, one accent family: electric `#4553e8`,
  periwinkle `#8b94ff`, sky `#9fd4ff`. No other hues.
- Type: Clash Display (display) + Switzer (text), self-hosted in `site/fonts/`
  (Fontshare, ITF Free Font License).
- Frosted-glass surfaces everywhere (blur + saturate, white hairlines, specular
  highlight following the mouse, 3D tilt on cards).
- **Horizontal scroll on desktop** (Lenis `orientation: horizontal`, wheel scrolls
  sideways, arrow keys + glass dock navigate); **vertical stack on mobile** (<768px).
- Two procedural three.js "milk glass" blobs (scene.js), phase-shifted, reacting to
  mouse + scroll. Nothing floats randomly; every motion answers user input.
- Micro-details are part of the language: Vienna clock, sheen sweep through the outline
  name, dock tooltips, go-pills, copy-email chip, magnet button with pulse ring,
  dynamic tab title, custom SVG cursor, hidden native scrollbar, film grain.

## Working on the site

- Edit `site/*` directly; no build. `sudo systemctl restart kxrim-web` is NOT needed
  for file changes (serve reads from disk), only for unit changes.
- Verify visually with headless Chromium (playwright-core is installed in the session
  scratchpad; system libs installed). Screenshot desktop 1440 AND mobile 375; mobile
  support is an explicit requirement from Kerimcan.
- External CDN deps of the live site: lenis@1.3.11, three@0.185.1 (jsdelivr). Consider
  self-hosting later (HANDOFF).
- Reduced motion: full static fallback (no smooth scroll, no animations, one still
  3D frame). Touch devices: hover-dependent UI (go-pills) is always visible.

## Content rules (binding)

All statements about Kerimcan are verified facts; never invent projects, metrics,
quotes, or dates. SlideLizard: "summer internship, summer 2026, 1 month" (the German
word Ferialpraktikum stays off the English site). Education: HTL Leonding **until
2028** (his correction; start year unconfirmed, so the site says "until 2028").
Afterfall is a subway-building school team project. No testimonial quotes (decided);
"references available on request" is the ceiling. The word "Servus" must not appear
on the site (his request).

## Git rules (binding)

- Commit after each coherent unit. English, imperative, **subject line only**, <72
  chars. No body, no Co-Authored-By, no "Generated with" trailer
  (use `git -c core.hooksPath=/dev/null commit`). Never push unless asked.
