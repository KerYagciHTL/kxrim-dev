# Assets

Every visual asset on this site is generated procedurally or typeset — there are no
downloaded models, textures, or images. This is deliberate: it keeps the bundle small
and the composition fully parametric.

## 3D

| Asset | Source | License |
| --- | --- | --- |
| Monolith (displaced box) | Procedural (`src/scene/Monolith.tsx`) | — |
| Fragment slabs (instanced boxes) | Procedural (`src/scene/Fragments.tsx`) | — |
| Simplex noise GLSL (`snoise`) | Ashima Arts / Stefan Gustavson, [webgl-noise](https://github.com/ashima/webgl-noise) | MIT |

## Diagrams

| Asset | Source | License |
| --- | --- | --- |
| YSL route diagram | Hand-built SVG (`src/components/ClientWork/RouteDiagram.tsx`); city list from yagcisons.at | — |
| MOE site-plan schematic | Hand-built SVG (`src/components/ClientWork/MoeSchematic.tsx`) | — |
| Monolith elevation drawing | Hand-built SVG (`src/components/Hero/StaticComposition.tsx`) | — |
| Film grain | Inline SVG `feTurbulence` data URI (`src/styles/global.css`) | — |

## Fonts (self-hosted via Fontsource)

| Face | Package | License |
| --- | --- | --- |
| Archivo Variable (wght + wdth) | `@fontsource-variable/archivo` 5.3.0 | OFL 1.1 |
| IBM Plex Mono 400/500/600 | `@fontsource/ibm-plex-mono` 5.3.0 | OFL 1.1 |
