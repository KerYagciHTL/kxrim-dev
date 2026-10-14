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
- **Three themes**, one button in the top bar steps through them (light, dark, rain). Each
  has its own colours and its own pixel layer:
  - **Light: the cursed seal (Fluchmal)** as 1-bit pixel art. Flames grow from the frame
    corners and from the edge of the current sheet's main element. While a visitor stays on a
    sheet they keep growing, then lick in place at 6 frames per second. Three tomoe turn slowly.
  - **Dark: crows.** Charcoal, bone and red. A crow with a red eye lands on the sheet's main
    panel shortly after it comes into view; more gather on the bottom of the frame over time
    (the first one big, close to the eye). They blink, caw, turn around and lose feathers.
  - **Rain.** Blue black and cool white. Pixel rain bursts on the top edge of every panel,
    drips off their lower edges and rings on the frame; the corner tone becomes the slanted
    line tone manga uses for rain. It starts as a drizzle and gets heavier.
  - Without a saved choice the system picks light or dark. Lightning ("Chidori") and black
    fire ("Amaterasu") were tried and rejected.
- **The mark** next to the name is the seal from the avatar's corner: the same drawing code at
  half the size, turning constantly, in every theme.
- Pages turn **sideways**, like a book. The content gets a short horizontal motion blur while
  it moves; the ink layer stays sharp in front.
- **Switching the language re-letters the page** like a manga translation: every visible line
  gets a strip of correction tape, the text changes underneath, the tape comes off again.
  Light paper gets blue tape (the guide colour), the night themes a tape a shade lighter than
  the paper. Names and the address (`translate="no"`) keep their text. The page stays where it
  is; the deck does not turn while the tape is on, and on phones a swipe ends it at once.

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
- Phones: one vertical page, like a webtoon. Every sheet starts under a guide line with its
  page number. The top bar stays fixed, slides away while reading down and comes back on the
  way up. At the bottom a folio shows "03 / 08" between previous and next; tapping the number
  lists all pages and links the other part of the site. The ink layer gives way around text.
- Reduced motion: no smooth turning, no blur, the ink is drawn once and stands still.

## 6. Ink layer (`app/ink`)

- `buffer.ts`: a pixel buffer, one art pixel is 4 CSS pixels (3 on phones).
- Two layers, so nothing lags behind or gets cut while the page scrolls: a **page layer**, a
  canvas inside the deck that scrolls with the sheets (marks that belong to an element, the
  crow on a panel), and a **screen layer**, fixed and hung from the bottom of the screen
  (frame corners, crows on the frame, rain). The screen layer has a fixed size, so a phone
  toolbar sliding in and out moves it instead of stretching it.
- `engine.ts`: measures the page and hands it to the theme's scene (`--ink-scene`); redraws
  both layers at the scene's frame rate and only the screen layer while scrolling; also paints
  the corner screentone (`--tone-kind`: dots or rain lines).
- `scene.ts`: what a scene gets (buffer, colours, clock, element boxes) and small helpers.
- `seal.ts` + `marks.ts`: the cursed seal (light): flames on a curling spine, tendrils, tomoe.
- `crows.ts`: crow sprites with a moonlit outline, landing, idling, feathers (dark). Crows are
  never cut by text boxes: a panel crow only sits where no text is above the panel.
- `rain.ts`: drops, splashes on panel tops, drips, rings on the frame (rain).
- `mark.ts`: the turning seal next to the name; the server renders its first frame as SVG.
- The DOM steers it: `data-ink="right bottom left top seal"` grows marks on those edges of an
  element; `data-ink-safe` keeps a box free of element marks.
- Colours come from CSS tokens (`--px-body`, `--px-rim`, `--px-edge`, `--px-spark`, `--px-seal`).
- The DOM side of the language switch lives in `app/utils/reletter.ts`.

## 7. Look

| Token | Light | Dark (crows) | Rain |
|---|---|---|---|
| paper | `#f5f4ef` | `#141312` | `#0e1418` |
| ink | `#151515` | `#ece4d6` | `#dce5e9` |
| guide / guide soft | `#7fc4e0` / `#c6e6f2` | `#4a423b` / `#2a2622` | `#2b5468` / `#19303b` |
| red (active page, focus) | `#c8161d` | `#e0383e` | `#f0565b` |

- Square corners everywhere; borders are 3 px ink (panels) or 2 px (boxes, buttons).
- The avatar is the original image; at night an SVG filter (in the layout) prints it in the
  theme's own ink and paper colours.
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
| `npm run readme` | draws the GitHub README pages into `public/readme` (`-- live/readme` for the running site) |

## 10. GitHub README

`docs/README.md` is the profile README for `KerYagciHTL/KerYagciHTL`: a short chapter of five
manuscript pages in the light theme and nothing else (no text between them, his wish), each one an
SVG that yagci.cc draws itself
(`scripts/readme`, served at `/readme/*.svg`, cached for an hour):

| Page | Shows |
|---|---|
| `title.svg` | name, and the site's mark big in an ink panel: the three tomoe turning in a halo of screentone, the seal's flames growing from the panel, the Sasuke line (no avatar: GitHub shows it right beside the README) |
| `numbers.svg` | contributions of the last year behind focus lines; repositories, stars, followers, busiest day; languages of the public code as screentone bars |
| `year.svg` | the contribution calendar: days as halftone dots (bigger on busier days, quiet days blue), and above them the cursed seal as one mass of black fire, as high as each week was busy, with licking tips and paper swirls; the year spreads in week by week, the busiest day has a red ring |
| `lately.svg` | the four newest public happenings as a four-panel strip |
| `next.svg` | "Continued on yagci.cc" with the turning seal |

The data is public only (calendar of the profile page, REST API without a token, 60 requests an
hour). Each real run saves its data in `.cache/readme-data.json`; `npm run readme -- --cached` draws
from it without asking GitHub, for working on the drawings. The pixel ink is
the site's own code from `app/ink`, flames lick and the seal turns via CSS inside the SVG, still
when the viewer asks for reduced motion. Fonts are inlined, since an SVG shown as an image loads
nothing. The pages are drawn on every deploy and, with the timer in `scripts/systemd`, every
morning straight into `live/readme`.
