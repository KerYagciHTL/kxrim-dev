// Building blocks for the README pages: the manuscript sheet, fonts, text, screentone, and pixel
// art drawn by the site's own ink code (app/ink) and turned into SVG paths.
import { readFileSync } from 'node:fs'
import { PixelBuffer, colour } from '../../app/ink/buffer'

/** the light theme of the site */
export const C = {
  paper: '#f5f4ef',
  ink: '#151515',
  soft: '#4b4b50',
  guide: '#7fc4e0',
  guideSoft: '#c6e6f2',
  red: '#c8161d',
  white: '#ffffff',
}

export const WIDTH = 900
/** one art pixel is this many SVG units, as on a phone */
export const PX = 3

const FONT_FILES = {
  Dela: 'dela-gothic-one-400-latin.woff2',
  Zen: 'zen-kaku-gothic-new-400-latin.woff2',
  ZenBold: 'zen-kaku-gothic-new-700-latin.woff2',
  Dot: 'dotgothic16-400-latin.woff2',
} as const
export type Font = keyof typeof FONT_FILES

/** @font-face rules with the font files inlined: an SVG shown as an image may not load anything */
export function fonts(...which: Font[]) {
  return which
    .map((f) => `@font-face{font-family:${f};src:url(data:font/woff2;base64,${readFileSync(`public/fonts/${FONT_FILES[f]}`).toString('base64')}) format('woff2')}`)
    .join('')
}

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// average advance per character in em, measured against the real fonts in Chromium
const ADVANCE: Record<Font, number> = { Dela: 0.86, Zen: 0.5, ZenBold: 0.53, Dot: 0.5 }
export const textWidth = (s: string, font: Font, size: number) => s.length * ADVANCE[font] * size

/** the largest size from `size` down to `min` at which the text fits `max` units */
export function fit(s: string, font: Font, size: number, max: number, min = size * 0.5) {
  let z = size
  while (z > min && textWidth(s, font, z) > max) z -= 0.5
  return z
}

export function text(x: number, y: number, s: string, font: Font, size: number, opts: { fill?: string; anchor?: 'start' | 'middle' | 'end'; halo?: boolean } = {}) {
  const halo = opts.halo ? ` stroke="${C.paper}" stroke-width="4" paint-order="stroke" stroke-linejoin="round"` : ''
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${opts.fill ?? C.ink}" text-anchor="${opts.anchor ?? 'start'}"${halo}>${esc(s)}</text>`
}

/** Splits text into lines that fit `max` units. */
export function wrap(s: string, font: Font, size: number, max: number) {
  const lines: string[] = []
  let line = ''
  for (const word of s.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (line && textWidth(next, font, size) > max) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

/** A page of manga manuscript paper: trim line, inner frame, ruler ticks, centre marks, folio. */
export function sheet(h: number, folio: number, body: string, style = '') {
  const W = WIDTH
  const ticks: string[] = []
  for (let x = 30; x <= W - 30; x += 10) ticks.push(`M${x} 8v${x % 50 === 0 ? 9 : 4}`)
  for (let y = 30; y <= h - 30; y += 10) ticks.push(`M8 ${y}h${y % 50 === 0 ? 9 : 4}`)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img">
<style>${style}</style>
<rect width="${W}" height="${h}" fill="${C.paper}"/>
<path d="${ticks.join('')}" stroke="${C.guideSoft}" stroke-width="1"/>
<rect x="8.5" y="8.5" width="${W - 17}" height="${h - 17}" fill="none" stroke="${C.guide}"/>
<rect x="22.5" y="22.5" width="${W - 45}" height="${h - 45}" fill="none" stroke="${C.guideSoft}"/>
<path d="M${W / 2} 0v18M${W / 2} ${h}v-18M0 ${h / 2}h18M${W} ${h / 2}h-18" stroke="${C.guide}"/>
${body}
${text(W / 2, h - 11, String(folio).padStart(2, '0'), 'Dot', 12, { fill: C.guide, anchor: 'middle' })}
</svg>
`
}

/** An ink panel (koma) with a paper fill. */
export const koma = (x: number, y: number, w: number, h: number, border = 3, fill: string = C.paper) =>
  `<rect x="${x + border / 2}" y="${y + border / 2}" width="${w - border}" height="${h - border}" fill="${fill}" stroke="${C.ink}" stroke-width="${border}"/>`

/** A narration box: white, inked edge, a dotted label and a line or two of text. */
export function narration(x: number, y: number, w: number, label: string, lines: string[], size = 14) {
  const h = 30 + lines.length * (size + 6)
  return `<g><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" fill="${C.white}" stroke="${C.ink}" stroke-width="2"/>
${text(x + 14, y + 22, label, 'Dot', 13)}
${lines.map((l, i) => text(x + 14, y + 22 + (i + 1) * (size + 6), l, 'Zen', size)).join('')}</g>`
}

/** Screentone patterns, as on the site and in a manga artist's tone catalogue. */
export function tones() {
  return `<defs>
<pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.15" fill="${C.ink}"/></pattern>
<pattern id="dots-big" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4" cy="4" r="2" fill="${C.ink}"/></pattern>
<pattern id="lines" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.6" height="5" fill="${C.ink}"/></pattern>
<pattern id="cross" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0h6v1.3H0zM0 0h1.3v6H0z" fill="${C.ink}"/></pattern>
<pattern id="rows" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="${C.ink}"/></pattern>
<pattern id="fine" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.8" fill="${C.ink}"/></pattern>
</defs>`
}
export const TONES = ['dots-big', 'lines', 'dots', 'cross', 'rows', 'fine']

/** Gradient screentone fading out of a corner: dots on a 45° grid that shrink with distance. */
export function cornerTone(cx: number, cy: number, radius: number, clip: { x: number; y: number; w: number; h: number }) {
  const a = 6 / Math.SQRT2
  const dots: string[] = []
  for (let i = -80; i <= 80; i++) {
    for (let j = -80; j <= 160; j++) {
      const x = (i + j) * a
      const y = (j - i) * a
      if (x < clip.x || y < clip.y || x > clip.x + clip.w || y > clip.y + clip.h) continue
      const d = Math.hypot(x - cx, y - cy) / radius
      if (d >= 1) continue
      const r = 1.55 * Math.pow(1 - d, 1.25)
      if (r >= 0.3) dots.push(`M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`)
    }
  }
  return `<path fill="${C.ink}" fill-opacity="0.85" d="${dots.join('')}"/>`
}

// colours the pixel canvas draws with; they become paths of the real colours
export const INK = colour('#010101')
export const RIM = colour('#fefefe')

/** A pixel canvas in memory for the site's ink code. */
export function pixels(w: number, h: number) {
  const image = { data: new Uint8ClampedArray(w * h * 4) }
  const ctx = { canvas: {}, createImageData: () => image, putImageData() {} } as unknown as CanvasRenderingContext2D
  const buf = new PixelBuffer(ctx)
  buf.resize(w, h)
  return { buf, data: new Uint32Array(image.data.buffer), w, h }
}

/** The canvas as SVG: one path per colour, each art pixel a PX square, offset by (ox, oy). */
export function toPaths(canvas: ReturnType<typeof pixels>, ox: number, oy: number, fills: [number, string][]) {
  const { data, w, h } = canvas
  return fills
    .map(([want, fill]) => {
      let d = ''
      for (let y = 0; y < h; y++) {
        let x = 0
        while (x < w) {
          if (data[y * w + x] !== want) {
            x++
            continue
          }
          let run = 1
          while (x + run < w && data[y * w + x + run] === want) run++
          d += `M${ox + x * PX} ${oy + y * PX}h${run * PX}v${PX}h${-run * PX}z`
          x += run
        }
      }
      return d ? `<path fill="${fill}" d="${d}"/>` : ''
    })
    .join('')
}

/**
 * Frames of a pixel animation, stepping like the site at a pixel-art frame rate. Frame 0 shows
 * where animation is off or motion is reduced.
 */
export function animate(name: string, frames: string[], ms: number) {
  const n = frames.length
  const css =
    `.${name}{visibility:hidden;animation:${name} ${n * ms}ms infinite}.${name}0{visibility:visible}` +
    `@keyframes ${name}{0%{visibility:visible}${(100 / n).toFixed(3)}%,100%{visibility:hidden}}` +
    frames.map((_, i) => `.${name}${i}{animation-delay:${-(n - i) * ms}ms}`).join('') +
    `@media (prefers-reduced-motion:reduce){.${name}{animation:none}}`
  const markup = frames.map((f, i) => `<g class="${name} ${name}${i}">${f}</g>`).join('')
  return { css, markup }
}
