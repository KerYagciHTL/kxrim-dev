# kxrim-dev — personal portfolio

Short, minimal portfolio for Kerimcan Yagci (KerYagciHTL) with a scroll-driven 3D spine.
Frontend-only; builds to static files (Cloudflare Pages / Vercel / GitHub Pages).

## Stack

- Vite 8.1.5 (Rolldown) + TypeScript 5.9.3 strict — **TS pinned to 5.9.x on purpose**:
  typescript-eslint 8.65 supports `<6.1.0`; TS 7 (native compiler) breaks lint.
- React 19.2.8, React Three Fiber 9.6.1, drei 10.7.7, @react-three/postprocessing 3.0.4,
  three 0.185.1
- GSAP 3.15 (ScrollTrigger + CustomEase), Lenis 1.3.25
- Styling: **CSS Modules + hand-written CSS custom properties** (chosen over Tailwind so
  no default-scale values leak in; all tokens live in one file)
- ESLint 10 flat config + Prettier; all dependency versions pinned exactly (no `^`)

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b` + production build to `dist/`
- `npm run preview` — serve `dist/` on :4173
- `npm run lint` / `npm run format` / `npm run format:check` / `npm run typecheck`

## Directory map

- `index.html` — pre-hydration ink background, noscript fallback
- `src/content/content.ts` — **every word of copy on the site**, with TODO(content) marks
- `src/styles/tokens.css` — the design tokens (palette, faces, eases, layout)
- `src/styles/global.css` — reset, base type, grain + vignette overlays
- `src/lib/` — `smoothScroll` (Lenis↔ScrollTrigger), `scrollState` (mutable scroll
  singleton the scene reads without re-renders), `eases` (CustomEase registry),
  `useReducedMotion`
- `src/components/<Section>/` — Preloader, Nav, Hero (+ StaticComposition fallback),
  ClientWork (+ RouteDiagram, MoeSchematic), Projects, Record, Contact; one CSS module each
- `src/scene/` — `SceneRoot` (lazy-loaded Canvas), `CameraRig` (Catmull-Rom dolly path),
  `Monolith` + `monolith.glsl.ts` (the custom shader), `Fragments` (InstancedMesh
  scatter→lattice), `Effects` (bloom / CA / vignette)

## Design tokens (tokens.css)

- Palette: `--ink #0e0f0c`, `--bone #e8e4da`, `--signal #ff4d00`; everything else is
  `color-mix()` derivations. Do not introduce new hex values.
- Type: Archivo Variable (display; always condensed ~68% stretch, weight ~780, uppercase)
  + IBM Plex Mono (everything else). Two faces total — keep it that way.
- Motion: three named eases — `kx-settle`, `kx-drift`, `kx-mask` (mirrored as CSS vars).
  Each section has its own entrance voice; don't share presets between sections.

## Architecture notes / gotchas

- The three.js chunk (~966 kB) is split via `manualChunks` and only loads when the lazy
  `SceneRoot` resolves — first paint never waits on it. Keep it that way.
- Lenis 1.x drives native window scroll, so ScrollTrigger needs **no scrollerProxy**
  (documented deviation from the build brief): Lenis runs on GSAP's ticker and pings
  `ScrollTrigger.update()` per scroll frame (`src/lib/smoothScroll.ts`).
- Scroll → scene coupling is `scrollState` (mutated by Lenis, read in `useFrame`). Never
  route per-frame values through React state.
- Monolith shader: displacement is **radial** (position-based) so box edges don't crack;
  lighting is flat per-facet from `dFdx/dFdy` — the milled look is intentional. Chaos
  floor is 0.14 so facets never fully smooth out.
- Reduced motion / no WebGL: canvas never mounts; hero shows `StaticComposition`
  (measured elevation drawing); Lenis is replaced by native scroll tracking; GSAP
  entrances are skipped entirely (content is visible by default — animations are
  `gsap.from`, only registered when motion is allowed).
- Mobile (`max-width: 48rem` or coarse pointer): 240 instances instead of 680, coarser
  monolith, dpr cap 1.5, no chromatic aberration, multisampling 0.
- Known upstream noise: R3F 9.6.1 constructs `THREE.Clock`, which three r185 logs a
  deprecation warning for. Not fixable in app code; goes away with the next R3F release.
- Playwright QA harness lives outside the repo (session scratchpad `qa.mjs`): headless
  Chromium + SwiftShader → its FPS numbers are software-rendering artifacts; profile
  frame rate on real hardware only.

## Git rules (restated from the brief)

- Commit after each coherent unit of work.
- English, imperative mood, **subject line only**, under 72 chars.
- **No body, no description, no `Co-Authored-By`, no "Generated with" trailer.** Verify
  before each commit; don't let tooling append one.
- Never `git push` unless explicitly asked.
