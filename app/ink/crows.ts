// Crows at night: black birds with a moonlit outline and red eyes. One lands on the current
// sheet's main panel shortly after it comes into view; more gather on the bottom of the frame
// the longer a visitor stays. They blink, caw now and then, turn around, and lose a feather.
// Crows are never cut by text boxes: they sit where no text is, always in front.
import type { PixelBuffer } from './buffer'
import { hash, overlaps, type Box, type Marked, type Scene, type View } from './scene'

// facing right, anchor is the middle of the feet; '#' body, 'r' eye
const PERCH = [
  '..........###...',
  '.........#####..',
  '........##r#####',
  '........#######.',
  '.......######...',
  '.....########...',
  '...##########...',
  '.############...',
  '############....',
  '##...######.....',
  '#......#.#......',
  '......##.##.....',
]
const CAW = PERCH.map((row, y) => (y === 2 ? '........##r###.#' : y === 3 ? '........######.#' : row))
const BLINK = PERCH.map((row) => row.replace('r', '#'))
const WINGS_UP = [
  '#...............',
  '##.........###..',
  '.###......#####.',
  '..####...###r###',
  '...#####.######.',
  '....###########.',
  '.....#########..',
  '......#######...',
  '.......####.....',
  '........#.......',
]
const WINGS_DOWN = [
  '...........###..',
  '..........#####.',
  '..#......###r###',
  '.####...#######.',
  '..##############',
  '...###########..',
  '....#########...',
  '.....######.....',
  '......###.......',
  '.......#........',
]
const FEATHER = [
  ['..#', '.#.', '#..'],
  ['.#.', '.#.', '.#.'],
]

const FLIGHT = 16 // frames from off screen to the perch

/** Draws a sprite with its feet at (x, y); `s` blows every pixel up for crows close to the eye. */
function sprite(view: View, buf: PixelBuffer, rows: string[], x: number, y: number, flip: boolean, s = 1) {
  const { pal } = view
  const h = rows.length
  const w = rows[0]!.length
  const put = (px: number, py: number, c: number) => {
    for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) buf.put(ox + px * s + b, oy + py * s + a, c)
  }
  const at = (cx: number, cy: number) => rows[cy]?.[flip ? w - 1 - cx : cx]
  const filled = (cx: number, cy: number) => {
    const c = at(cx, cy)
    return c !== undefined && c !== '.'
  }
  const ox = Math.round(x - (w * s) / 2)
  const oy = Math.round(y - h * s + 1)
  // outline first: moonlight on the upper side, a dim edge everywhere else
  for (let cy = -1; cy <= h; cy++) {
    for (let cx = -1; cx <= w; cx++) {
      if (filled(cx, cy)) continue
      if (filled(cx, cy + 1)) put(cx, cy, pal.rim)
      else if (filled(cx - 1, cy) || filled(cx + 1, cy) || filled(cx, cy - 1)) put(cx, cy, pal.edge)
    }
  }
  for (let cy = 0; cy < h; cy++) {
    for (let cx = 0; cx < w; cx++) {
      const c = at(cx, cy)
      if (c === '#') put(cx, cy, pal.body)
      else if (c === 'r') put(cx, cy, pal.spark)
    }
  }
}

/** A perched crow that blinks, caws and turns around on its own clock. */
function perched(view: View, buf: PixelBuffer, seed: number, x: number, y: number, since: number, s = 1) {
  const t = view.step - since
  const turn = Math.floor((t + hash(seed, 1) * 90) / (70 + hash(seed, 2) * 60))
  const flip = (turn + Math.floor(hash(seed, 3) * 2)) % 2 === 1
  const blink = (t + Math.floor(hash(seed, 4) * 31)) % 31 === 0
  const cawAt = (t + Math.floor(hash(seed, 5) * 140)) % 140
  const rows = cawAt < 3 ? CAW : blink ? BLINK : PERCH
  sprite(view, buf, rows, x, y, flip, s)
}

/** Flies in on a shallow curve from above the far side, then sits. */
function arriving(view: View, buf: PixelBuffer, seed: number, x: number, y: number, landAt: number, s = 1) {
  const t = view.step - landAt
  if (t >= 0) return perched(view, buf, seed, x, y, landAt, s)
  const p = 1 + t / FLIGHT
  if (p <= 0) return
  const from = x > view.W / 2 ? -1 : 1
  const sx = x + from * (1 - p) * view.W * 0.35
  const sy = y - (1 - p * p) * (y + 14 * s)
  const rows = Math.floor(view.step / 2) % 2 ? WINGS_UP : WINGS_DOWN
  sprite(view, buf, rows, sx, sy + 2 * s, from === 1, s)
}

/** A feather that sways down to the bottom of the frame. */
function feather(view: View, buf: PixelBuffer, seed: number, x: number, y: number, since: number, ground: number) {
  const t = view.step - since
  if (t < 0) return
  const fy = y + t * 0.9
  if (fy > ground - 2) return
  const fx = x + Math.sin(t * 0.25 + seed) * 4
  const shape = FEATHER[Math.floor(t / 4 + seed) % 2]!
  shape.forEach((row, cy) => [...row].forEach((c, cx) => c === '#' && buf.put(fx + cx, fy + cy, cy === 0 ? view.pal.rim : view.pal.edge)))
}

/** The main panel of what is on screen: the one nearest the middle, framed panels first. */
function mainPanel(view: View): Marked | undefined {
  const seen = view.marked.filter((m) => m.seen && m.T > 16)
  const framed = seen.filter((m) => m.edges.has('top') || m.edges.has('seal'))
  const mid = (m: Marked) => Math.hypot((m.L + m.R) / 2 - view.W / 2, (m.T + m.B) / 2 - view.H / 2)
  return (framed.length ? framed : seen).sort((a, b) => mid(a) - mid(b))[0]
}

/** A spot on the panel's top edge with no text where the crow would sit. */
function perchOn(view: View, panel: Marked): number | undefined {
  for (const f of [0.66, 0.4, 0.84, 0.2, 0.52]) {
    const x = panel.L + (panel.R - panel.L) * f
    const body: Box = { L: x - 9, R: x + 9, T: panel.T - 14, B: panel.T }
    if (!view.safe.some((s) => overlaps(s, body))) return x
  }
  return undefined
}

const frames = (ms: number) => Math.floor((ms / 1000) * crows.fps)

export const crows: Scene = {
  fps: 8,

  // the current sheet's main panel gets one crow, a moment after the sheet arrives
  page(view) {
    const panel = mainPanel(view)
    if (!panel) return
    const x = perchOn(view, panel)
    if (x === undefined) return
    const landAt = view.still ? -1e9 : view.step - frames(view.sheetAge) + 10 + FLIGHT
    arriving(view, view.page, 100 + panel.i, x, panel.T - 1, landAt)
    if (!view.still) feather(view, view.page, panel.i, x, panel.T + 2, landAt + 4, panel.B)
  },

  frame(view) {
    const { buf, W, H, T, mobile, step } = view
    const ground = H - T

    // crows gather on the bottom of the frame; the first one sits close, so it is drawn bigger
    const spots: [x: number, size: number][] = mobile ? [[0.14, 1], [0.86, 1]] : [[0.07, 2], [0.93, 1], [0.3, 1]]
    spots.forEach(([at, size], k) => {
      const landAt = view.still || k === 0 ? -1e9 : step - frames(view.pageAge) + k * 12 * crows.fps
      arriving(view, buf, k, W * at, ground, landAt, size)
    })

    // now and then a loose feather drifts down from the top
    if (!view.still) {
      const every = 13 * crows.fps
      const n = Math.floor(step / every)
      feather(view, buf, n, W * (0.2 + 0.6 * hash(n, 11)), -4, n * every, ground)
    }
  },
}
