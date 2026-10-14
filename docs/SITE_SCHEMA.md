# yagci.cc · Site Schema

Personal site of Kerimcan Yagci. This file describes the stack, the structure, the features
and the look, so the site can be changed without guessing.

## 1. Idea

The site is a manga manuscript. Kerimcan's GitHub avatar is a black and white manga drawing
of Sasuke with the cursed seal on his face, so the whole page comes from that world:

- **Paper** with the light blue guide lines of manga manuscript paper (trim line, inner frame,
  ruler ticks, centre marks). They never print in a real manga; here they frame the page.
- **Ink panels** (koma) with thick borders, **screentone** (dot rasters) inside some panels,
  and gradient screentone in the corners of the screen.
- **The cursed seal (Fluchmal)** as 1-bit pixel art: flames grow from the frame corners and
  from the edge of the current sheet's main element. While a visitor stays on a sheet they
  keep growing, then lick in place at 6 frames per second. Three tomoe turn slowly.
- **Dark mode is Amaterasu**: the same flame language as black fire with a red rim and
  rising sparks, the tomoe turn red. (Lightning, "Chidori", was tried and rejected.)
- Pages turn **sideways**, like a book. The content gets a short horizontal motion blur while
  it moves; the ink layer stays sharp in front.

## 2. Stack

| Part | Choice |
|---|---|
| Framework | Nuxt 4 + Vue 3 + TypeScript, `nuxt generate` (every page prerendered) |
| i18n | `@nuxtjs/i18n`, German on `/`, English on `/en`, `prefix_except_default`, no auto redirects |
| SEO | `@nuxtjs/sitemap` (per language, with hreflang), `@nuxtjs/robots`, own JSON-LD in `app/utils/schema.ts` |
| Fonts | Dela Gothic One (display), Zen Kaku Gothic New (text), DotGothic16 (labels), Latin cuts self-hosted |
| Images | `scripts/images.mjs` (sharp) turns `docs/screenshots/` into WebP in `public/img/` |
| Serving | `serve` behind a Cloudflare tunnel, systemd unit `kxrim-web`, port 3300 |

No UI library, no CSS framework, no animation library. The pixel layer is plain canvas code.

## 3. Layers

| Layer | What | Where |
|---|---|---|
| Content | every sentence on the site, DE and EN, only verified facts | `content/*.ts` |
| Interface text | buttons, labels, page titles | `i18n/locales/*.json` |
| Structure | deck, sheets, pages | `app/components/deck`, `app/components/sheets`, `app/pages` |
| Decoration | frame, screentone, pixel ink | `app/assets/css`, `app/components/ink`, `app/ink` |

Content files hold data only. Components never contain copy except interface labels.

## 4. Routes

| URL | Page | Sheets |
|---|---|---|
| `/` · `/en` | portfolio | Start, SortingVisualizer, Afterfall, Kerlib, yagcisons.at, moe-v.de, Werdegang, Kontakt |
| `/was-ich-baue` · `/en/what-i-build` | what he builds | Start, Websites, Web-Apps, Desktop-Tools, Ablauf, Kontakt |

Every sheet has an id, so `/#afterfall` opens that sheet. Old URLs: `/services` and
`/services.html` go to `/was-ich-baue` (301), `/de` goes to `/` (see `public/serve.json`).

## 5. Deck

- Desktop (768 px and wider): one sheet per screen, side by side. Mouse wheel, arrow keys,
  Page Up/Down, Home/End and the page numbers turn one sheet. The current sheet goes into the
  URL hash.
- Phones: a normal vertical page; the ink layer gives way around text.
- Reduced motion: no smooth turning, no blur, the ink is drawn once and stands still.

## 6. Ink layer (`app/ink`)

- `buffer.ts`: a pixel buffer, one art pixel is 4 CSS pixels (3 on phones).
- `marks.ts`: flames on a curling spine, tendrils, sparks, the three tomoe.
- `engine.ts`: draws every frame: marks on the current sheet's element, then clears every
  text box, then the frame corners on top.
- The DOM steers it: `data-ink="right bottom left top seal"` grows marks on those edges of an
  element; `data-ink-safe` keeps a box free of element marks.
- Colours come from CSS tokens (`--px-body`, `--px-rim`, `--px-edge`, `--px-spark`, `--px-seal`).

## 7. Look

| Token | Light | Dark |
|---|---|---|
| paper | `#f5f4ef` | `#111215` |
| ink | `#151515` | `#ebe9e3` |
| guide / guide soft | `#7fc4e0` / `#c6e6f2` | `#2f6d8a` / `#1b313d` |
| red (active page, focus) | `#c8161d` | `#ff4b50` |

- Square corners everywhere; borders are 3 px ink (panels) or 2 px (boxes, buttons).
- The avatar is the original image; in dark mode it is inverted (white ink on black).
- Narration boxes (white box inside a screentone panel) carry the short asides.

## 8. SEO

- One Person `https://yagci.cc/#person` with `alternateName` "Kerim Yagci", `sameAs` GitHub and
  LinkedIn, HTL Leonding as affiliation. The projects are `SoftwareSourceCode`, the client sites
  `WebSite` with him as creator. `/was-ich-baue` adds a `BreadcrumbList`.
- Real URLs per language with `hreflang` (de, en, x-default) and self canonicals.
- Link preview cards: `public/og-*.png`, made by `npm run og`.
- After changes: `npm run indexnow`, and ask Kerimcan to request indexing in Search Console.

## 9. Scripts

| Command | Does |
|---|---|
| `npm run dev` | dev server on :3391 |
| `npm run build` | static build into `.output/public` |
| `npm run preview` | serves the build on :3390 |
| `npm run images` | screenshots to WebP plus `content/media.json` |
| `npm run fonts` | downloads the Latin font cuts |
| `npm run og` | renders the four link preview cards |
| `npm run deploy` | builds, copies to `releases/<time>`, points `live` at it |
| `sh scripts/deploy.sh back` | points `live` at the previous release |
| `npm run indexnow` | pings IndexNow |
