// The marks themselves: flames grown along a curling spine, tendrils, sparks and the three tomoe.
// Light theme draws the cursed seal ("seal"), dark theme draws Amaterasu ("fire").
import { random, type Colour, type PixelBuffer } from './buffer'

export interface Palette {
  body: Colour
  rim: Colour
  edge: Colour
  spark: Colour
  seal: Colour
}

export interface Pen {
  buf: PixelBuffer
  pal: Palette
  style: 'seal' | 'fire'
  /** animation frame counter; 0 forever when motion is reduced */
  step: number
}

type Point = [x: number, y: number, r: number, a: number]

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const wobble = (n: number) => [0, 1, 0, -1][((n % 4) + 4) % 4]!

function spine(x: number, y: number, a: number, curl: number, len: number, base: number, tipCurl = 2.2, pow = 1.1): Point[] {
  const pts: Point[] = []
  for (let s = 0; s <= len; s += 0.5) {
    const t = s / len
    a += curl * 0.5 * (0.2 + tipCurl * t * t)
    x += Math.cos(a) * 0.5
    y += Math.sin(a) * 0.5
    pts.push([x, y, base * Math.pow(1 - t, pow), a])
  }
  return pts
}

function paint(pen: Pen, pts: Point[], c: Colour, grow = 0) {
  for (const [x, y, r] of pts) pen.buf.disc(x, y, Math.max(0.5, r + grow), c)
}

/** One flame: a teardrop that curls at the tip and licks in place, frame by frame. */
export function flame(pen: Pen, x: number, y: number, a: number, size: number, curl: number, growth: number, phase: number) {
  const fire = pen.style === 'fire'
  const w = wobble(pen.step + phase)
  const len = Math.max(1, size * (fire ? 2.9 : 2.6) * growth + w * (fire ? 1.4 : 0.8))
  const pts = spine(x, y, a, curl + w * (fire ? 0.035 : 0.02), len, size * 0.55)
  paint(pen, pts, pen.pal.rim, 1)
  paint(pen, pts, pen.pal.body)
  // the stroke inside bigger flames: paper in the seal, a dark ember line in the fire
  if (size >= 6 && growth > 0.6) {
    const n = pts.length
    for (let i = Math.floor(n * 0.14); i < n * 0.55; i++) {
      const [px, py, r, ang] = pts[i]!
      if (r < 1.7) continue
      const o = r * 0.38 * Math.sign(curl || 1)
      pen.buf.put(px - Math.sin(ang) * o, py + Math.cos(ang) * o, pen.pal.edge)
    }
  }
}

/** A hairline that ends in a small spiral, like the swirls between the seal's flames. */
export function tendril(pen: Pen, x: number, y: number, a: number, len: number, dir: number, growth: number) {
  for (const [px, py] of spine(x, y, a, dir * 0.09, len * growth, 0.6, 6, 0.2)) pen.buf.put(px, py, pen.pal.body)
}

/** A spark that rises from a flame and starts over, two pixels tall. */
export function ember(pen: Pen, x: number, y: number, phase: number, height: number) {
  const t = (pen.step * 0.6 + phase) % height
  if (t > height * 0.85) return
  const drift = Math.round(Math.sin((pen.step + phase) * 0.7))
  pen.buf.put(x + drift, y - t, pen.pal.spark)
  if (t < height * 0.5) pen.buf.put(x + drift, y - t + 1, pen.pal.rim)
}

/** The three tomoe of the seal, turning slowly. */
export function seal(pen: Pen, cx: number, cy: number, size: number, rot: number) {
  for (let i = 0; i < 3; i++) {
    const a = rot + i * 2.094
    const x = cx + Math.cos(a) * size * 2.8
    const y = cy + Math.sin(a) * size * 2.8
    const pts = spine(x, y, a + 1.75, 0.26, size * 3.2, size * 0.8, 1.2)
    paint(pen, pts, pen.style === 'fire' ? pen.pal.edge : pen.pal.rim, 1)
    pen.buf.disc(x, y, size + 1, pen.style === 'fire' ? pen.pal.edge : pen.pal.rim)
    paint(pen, pts, pen.pal.seal)
    pen.buf.disc(x, y, size, pen.pal.seal)
  }
}

export interface Row {
  seed: number
  /** start point and direction along the edge, plus the inward normal */
  x: number
  y: number
  dx: number
  dy: number
  nx: number
  ny: number
  span: number
  size: number
  growth: number
  /** chance of a tendril or a spark per flame */
  detail?: number
}

/** A row of flames standing on an edge; flames further from the start need more growth. */
export function flameRow(pen: Pen, row: Row) {
  const { x, y, dx, dy, nx, ny, span, size, growth } = row
  const detail = row.detail ?? 0.25
  const r = random(row.seed)
  const fire = pen.style === 'fire'
  const normal = Math.atan2(ny, nx)
  const side = Math.sign(nx * dy - ny * dx) || 1
  // the edge line itself turns to ink first
  for (let u = 0; u < span * growth; u++) {
    const th = u < span * 0.4 ? 2 : 1
    for (let v = 0; v < th; v++) pen.buf.put(x + dx * u + nx * v, y + dy * u + ny * v, pen.pal.body)
  }
  let u = 0
  let i = 0
  while (u < span * growth) {
    const q = u / span
    const s = size * (1 - q * 0.65) * (0.75 + r() * 0.5)
    let a = normal + side * (0.25 + r() * 0.4)
    // fire rises: on side edges the flames bend upward
    if (fire && Math.abs(ny) < 0.5) a = Math.atan2(Math.sin(a) * 0.45 - 0.55, Math.cos(a) * 0.45)
    const local = clamp01((growth - q * 0.6) / 0.5)
    const bx = x + dx * u
    const by = y + dy * u
    if (local > 0.05) flame(pen, bx, by, a, s, side * (0.04 + r() * 0.06), local, i)
    const roll = r()
    if (!fire && roll < detail && local > 0.4) tendril(pen, bx + dx * s * 0.5 + nx * 2, by + dy * s * 0.5 + ny * 2, normal + side * 1.2, s * 1.6, -side, local)
    if (fire && roll < detail * 2 && local > 0.3) ember(pen, bx + nx * s, by + ny * s, i * 7 + r() * 9, s * 3.5 + 6)
    u += s * (0.8 + r() * 0.45)
    i++
  }
}
