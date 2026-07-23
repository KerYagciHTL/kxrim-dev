# Assets — yagci.cc (live site: `site/`)

Everything visual is procedural, hand-drawn SVG, or typeset — no downloaded models,
textures, or stock imagery.

## Fonts (self-hosted in `site/fonts/`, via Fontshare)

| Face | Use | License |
| --- | --- | --- |
| Clash Display 500/600/700 | Display | ITF Free Font License (Fontshare) |
| Switzer 400/500/600 | Text | ITF Free Font License (Fontshare) |

## Code libraries (CDN, jsdelivr)

| Library | Version | License |
| --- | --- | --- |
| Lenis | 1.3.11 | MIT |
| three.js | 0.185.1 | MIT |

## Procedural / hand-made

| Asset | Source |
| --- | --- |
| Milk-glass blobs | `site/scene.js` — IcosahedronGeometry + hand-written wobble/fresnel shaders |
| Aurora blobs, grain | CSS gradients + inline SVG `feTurbulence` data URI |
| Cursor arrows, favicon, badge, icons | Hand-drawn inline SVG |

## Legacy (rejected V1 build, not served)

`src/` still references @fontsource Archivo / IBM Plex Mono (OFL 1.1) and the Ashima
simplex-noise GLSL (MIT). Remove together with the V1 cleanup (see HANDOFF).
