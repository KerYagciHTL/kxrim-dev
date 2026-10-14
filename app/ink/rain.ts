// Night rain: thin drops fall at a slant, burst on the top edge of every panel and on the
// bottom of the frame, and drip off the panels' lower edges. It starts as a drizzle and gets
// heavier while a visitor stays on the page.
import { grow, hash, inside, type Box, type Scene, type View } from './scene'

/** sideways drift per pixel of fall, the same slant as the line tone in the corners */
const SLANT = -0.28

// splash frames: [dx, dy, colour] above the point of impact; s = spark, b = body, e = edge
const SPLASH: [number, number, 's' | 'b' | 'e'][][] = [
  [[0, -1, 's'], [-1, 0, 'b'], [1, 0, 'b']],
  [[-1, -2, 's'], [1, -2, 's'], [-2, -1, 'b'], [2, -1, 'b']],
  [[-2, -2, 'b'], [2, -3, 'b'], [-3, -1, 'e'], [3, -1, 'e']],
  [[-3, -1, 'e'], [3, -2, 'e']],
]

function stopOf(x0: number, roofs: Box[], ground: number) {
  let stop = ground
  for (const r of roofs) {
    const x = x0 + SLANT * r.T
    if (r.T > 0 && r.T < stop && x >= r.L && x <= r.R) stop = r.T
  }
  return stop
}

function behind(roofs: Box[], x: number, y: number) {
  for (const r of roofs) if (inside(r, x, y)) return true
  return false
}

function splash(view: View, x: number, y: number, frame: number) {
  const { buf, pal } = view
  for (const [dx, dy, c] of SPLASH[frame] ?? []) buf.put(x + dx, y + dy, c === 's' ? pal.spark : c === 'b' ? pal.body : pal.edge)
}

function ripple(view: View, x: number, y: number, frame: number) {
  const { buf, pal } = view
  if (frame < 2) buf.put(x, y - 2 - frame, pal.spark)
  if (frame > 5) return
  const r = 1 + frame
  for (const s of [-1, 1]) {
    buf.put(x + s * r, y - 1, frame < 3 ? pal.spark : pal.edge)
    if (frame < 4) buf.put(x + s * (r - 1), y - 1, pal.edge)
  }
}

function drop(view: View, i: number, roofs: Box[], ground: number) {
  const { buf, pal, W, H, step } = view
  const speed = 6 + hash(i, 1) * 3
  const len = Math.round(speed * 0.6 + hash(i, 2) * 3)
  const period = Math.ceil((H + len + 10) / speed) + 8
  const t = step + Math.floor(hash(i, 3) * period)
  const cycle = Math.floor(t / period)
  const f = t % period
  const x0 = hash(i, cycle + 7) * (W - SLANT * H)
  const y = -len + f * speed
  const stop = stopOf(x0, roofs, ground)
  if (y < stop) {
    for (let j = 0; j < len; j++) {
      const py = y - j
      if (py < 0 || py >= stop) continue
      const px = x0 + SLANT * py
      if (!behind(roofs, px, py)) buf.put(px, py, j === 0 ? pal.spark : pal.body)
    }
    return
  }
  const k = Math.floor((y - stop) / speed)
  const sx = x0 + SLANT * stop
  if (stop === ground) ripple(view, sx, ground, k)
  else splash(view, sx, stop, k)
}

/** Water gathers under a panel's lower edge, hangs, lets go and lands on the frame. */
function drip(view: View, m: Box & { i: number }, ground: number) {
  const { buf, pal, step } = view
  if (m.B > ground - 6) return
  const x = Math.round(m.L + (m.R - m.L) * (0.2 + 0.6 * hash(m.i, 9)))
  const period = 44
  const f = (step + Math.floor(hash(m.i, 10) * period)) % period
  const y = Math.round(m.B) + 1
  if (f < 18) {
    const hang = f < 7 ? 1 : f < 13 ? 2 : 3
    for (let j = 0; j < hang; j++) buf.put(x, y + j, j === hang - 1 ? pal.spark : pal.body)
    return
  }
  const py = y + 3 + (f - 18) * 5
  if (py < ground) {
    buf.put(x, py, pal.spark)
    buf.put(x, py - 1, pal.body)
  } else ripple(view, x, ground, Math.floor((py - ground) / 5))
}

export const rain: Scene = {
  fps: 15,
  draw(view) {
    const { H, T, mobile } = view
    const ground = H - T
    const roofs = view.marked
    const g = grow(view, view.pageAge, 0, 30000)
    const [few, many] = mobile ? [18, 40] : [44, 96]
    const n = Math.round(few + (many - few) * g)
    for (let i = 0; i < n; i++) drop(view, i, roofs, ground)
    for (const m of roofs) drip(view, m, ground)
    view.clearSafe()
  },
}
