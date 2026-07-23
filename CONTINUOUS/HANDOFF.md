# Handoff — yagci.cc

Last update: 2026-07-23, after the real site shipped. **Live at https://yagci.cc.**

## Where things stand

The site went through 4 design iterations with Kerimcan reacting to *pixels* (style
demos on yagci.cc), not descriptions — that workflow is mandatory, see memory note
`artifact-first-design-workflow`. Timeline: V1 dark industrial R3F (rejected hard),
V2 navy glass SaaS (rejected, "like my old site"), V3 award-genre typography (approved
direction), V4 horizontal + Apple glass (approved: "nicht schlecht… mehr details… dann
ist perfekt"), then max-detail pass, second blob, and the real content build. The live
site = `site/` (static HTML/CSS/JS, V4 language, English copy, real facts only).

## Verified

- Headless-Chromium screenshots of all 5 sections, desktop 1440 and mobile 375, after
  every change. Console clean (only a headless-only ReadPixels perf note from the
  screenshot capture itself).
- Mobile: vertical stack, glass topbar, single-line brand, go-pills always visible on
  touch, blobs repositioned/scaled. Kerimcan explicitly flagged mobile as critical.
- Copyright: LICENSE (all rights reserved), meta tag, footer line. Old rejected site's
  footer also carries it, but that site is not served.

## Not done / next steps (priority order)

1. **Real-device check** — iPhone Safari specifically (backdrop-filter cost, svh,
   horizontal Lenis is desktop-only so mobile is plain vertical scroll). All checks so
   far are SwiftShader headless.
2. **Perf audit** — Lighthouse on live: fonts are self-hosted woff2, but lenis+three
   come from jsdelivr; consider self-hosting to `site/vendor/` and adding
   `<link rel="modulepreload">`. Blur-heavy glass on old Androids may need a
   `@supports`/quality fallback.
3. **Repo cleanup** — the rejected V1 React/Vite codebase (src/, root index.html,
   package.json, node_modules, dist/) is dead weight and confuses the repo story. Ask
   Kerimcan, then delete (git history preserves it) and slim package.json (only `serve`
   is used operationally).
4. kxrim.is-a.dev still serves the OLD portfolio (GitHub Pages). Decide: redirect to
   yagci.cc, or update. GitHub repo homepage field still says yagci.cc (now correct).
5. Possible content upgrades (all optional, all must stay honest): screenshots of the
   two client sites inside their cards; an Impressum/privacy note if he wants one;
   og-image (currently none, just meta text).

## Content inventory (verified facts — do not exceed)

Kerimcan Yagci, kxrim / KerYagciHTL, Ansfelden AT. HTL Leonding, higher department of
computer science, 2022–2027 (focus: software dev, databases, OS). Ferialpraktikum
SlideLizard, summer 2026, one month. Projects: KCY-Accounting (C#/.NET 10/Avalonia,
TCP licensing, solo), Kerlib (C# Win32 windowing lib), Afterfall (Java subway-building
game, school team project). Clients (sole developer, both satisfied, no quotes):
yagcisons.at (freight forwarding AT/EU), moe-v.de (traffic & safety, Berlin). Languages
C/C++/C#/Java/TS/Python. Email k.yagci@students.htl-leonding.ac.at. HtmlForge + chat
app: excluded (repos not public). No testimonial quotes, ever, per his decision.

## Infrastructure

- systemd `kxrim-web`: `npx serve -l tcp://127.0.0.1:3300 site` in /opt/kxrim-dev.
- cloudflared ingress (/etc/cloudflared/config.yml): yagci.cc → :3300. Other hostnames
  on the same tunnel serve his client/school projects — **do not touch them**
  (yagcisons.at :3200 is a live client site).
- api.yagci.cc DNS points at an external IP (185.128.246.66), unrelated to this tunnel;
  it was unreachable before we ever touched anything — pre-existing, not ours.
- Style demos archived: yagci.cc/v4 and yagci.cc/v2 (not linked from the real site).
