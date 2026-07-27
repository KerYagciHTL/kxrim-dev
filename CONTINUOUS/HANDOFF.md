# Handoff · yagci.cc

Last update: 2026-07-27. **Live at https://yagci.cc**, indexed by Google.

## Where things stand

The site went through 4 design iterations with Kerimcan reacting to *pixels* (style
demos on yagci.cc), not descriptions. That workflow is mandatory; see memory note
`artifact-first-design-workflow`. Timeline: V1 dark industrial R3F (rejected hard),
V2 navy glass SaaS (rejected, "like my old site"), V3 award-genre typography (approved
direction), V4 horizontal + Apple glass (approved), then a max-detail pass, a second
blob, and the real content build. The live site is `site/`: static HTML/CSS/JS, V4
language, English copy, real facts only.

## Done

- **Content**: 5 sections (hero, projects, client work, record, contact) with real
  facts only. Mobile verified at 375px (vertical stack, glass topbar, go-pills always
  visible on touch). Kerimcan flagged mobile as critical.
- **Copyright**: LICENSE (all rights reserved), meta tag, footer line, and a header
  comment in every `site/` file.
- **SEO**: sitemap.xml, robots.txt, canonical, schema.org Person JSON-LD; IndexNow
  pinged (202). Google Search Console verified via `site/googleec41dbfa65d42ec9.html`.
  He submitted the sitemap and requested indexing; the page is indexed.
- **Old domain**: kxrim.is-a.dev now serves a redirect to yagci.cc (gh-pages branch of
  this repo, plain HTML meta-refresh + canonical). See gotcha below.
- **Repo cleanup**: the rejected V1 React/Vite codebase, the demos, and the README were
  deleted (git history keeps them). package.json is slimmed to just `serve`.
- **No em dash** (the U+2014 character) anywhere, in site or docs; his hard rule, see
  memory `no-em-dashes`. Never swap it for a plain hyphen; rephrase or use `·`/`/`/`,`/`:`.

## Gotchas (read before touching)

- **Cloudflare caches JS/CSS at the edge** (not the HTML). After editing main.js /
  scene.js / style.css, bump the `?v=N` query on their `<link>`/`<script>` tags in
  index.html, or the edge keeps serving the old file. This bit us once (stale main.js
  showed old title/clock). HTML is served fresh, so the new query propagates.
- **GitHub Pages custom domain for this repo must stay `kxrim.is-a.dev`** (the redirect
  host). Setting it to yagci.cc in the UI rewrites CNAME on gh-pages and kills the
  redirect. yagci.cc itself never touches GitHub; it is the Cloudflare tunnel.
- **serve.json**: `cleanUrls:false` (so the Google verification .html serves 200, not a
  301), `directoryListing:false`, and a `/` rewrite to index.html. Without the rewrite,
  disabling cleanUrls makes `serve` show a directory listing at `/`.
- Force-pushes and reading stored git credentials are blocked for the agent by the
  harness classifier; hand those commands to Kerimcan (he runs them via `!`).

## Open / next steps

1. **Sitemap status in Search Console** may still read "couldn't fetch" from a stale
   attempt during an early outage. It is fully fetchable now (verified with a Googlebot
   UA). Fix: resubmit it in GSC. (His click.)
2. **GitHub profile website field** should point to yagci.cc. (His click.)
3. **Real-device check** on iPhone Safari (backdrop-filter cost, svh, horizontal Lenis
   is desktop-only so mobile is plain vertical scroll). All checks so far are headless.
4. **Perf audit** (Lighthouse on live): lenis + three come from jsdelivr; consider
   self-hosting to `site/vendor/` with a modulepreload. Heavy glass blur on old Androids
   may want a `@supports` fallback.
5. Optional, all must stay honest: screenshots of the two client sites in their cards;
   an Impressum/privacy note if wanted; an og-image (currently only meta text).

## Content inventory (verified facts, do not exceed)

Kerimcan Yagci, kxrim / KerYagciHTL, Ansfelden AT. HTL Leonding, higher department of
computer science, until 2028 (start year unconfirmed; focus: software dev, databases,
OS). Summer internship (Ferialpraktikum) at SlideLizard, summer 2026, one month; the
word Ferialpraktikum stays off the English site. Projects: KCY-Accounting (C# / .NET 10
/ Avalonia, TCP licensing, solo), Kerlib (C# Win32 windowing lib), Afterfall (Java
subway-building game, school team project). Clients (sole developer, both satisfied,
no quotes): yagcisons.at (freight forwarding AT/EU), moe-v.de (traffic & safety,
Berlin). Languages C/C++/C#/Java/TS/Python. Frameworks/tools: .NET, Avalonia, React,
Vite, Tailwind, Git & Linux. Email kerimcan41@icloud.com. HtmlForge + a
chat app: excluded (repos not public). No testimonial quotes, ever. The word "Servus"
must not appear on the site.

## Infrastructure

- systemd `kxrim-web`: `npx serve -l tcp://127.0.0.1:3300 site` in /opt/kxrim-dev.
- cloudflared ingress (/etc/cloudflared/config.yml): yagci.cc points to :3300. Other
  hostnames on the same tunnel serve his client/school projects; **do not touch them**
  (yagcisons.at on :3200 is a live client site).
- api.yagci.cc DNS points at an external IP (185.128.246.66), unrelated to this tunnel
  and unreachable before we started; pre-existing, not ours.
