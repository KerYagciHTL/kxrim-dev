// The cursed seal (light) and Amaterasu (dark): flames that grow on the edges of the current
// sheet's elements and from the frame corners, and keep licking in place.
import { flameRow, seal, type Pen, type Row } from './marks'
import { grow, type Scene, type View } from './scene'

function draw(view: View, style: Pen['style']) {
  const { buf, W, H, T, mobile, still } = view
  const pen: Pen = { buf, pal: view.pal, style, step: view.step }
  const k = mobile ? 0.55 : 1

  // 1. marks on the current sheet's elements
  const gSheet = grow(view, view.sheetAge, 0.3, 12000)
  for (const m of view.marked) {
    const { L, T: Tp, R, B, edges } = m
    const seed = 20 + m.i * 10
    const rows: Row[] = []
    if (edges.has('right')) rows.push({ seed, x: R, y: Tp + (B - Tp) * 0.34, dx: 0, dy: 1, nx: 1, ny: 0, span: (B - Tp) * 0.52, size: 5.5 * k, growth: gSheet })
    if (edges.has('bottom')) rows.push({ seed: seed + 1, x: R - 1, y: B, dx: -1, dy: 0, nx: 0, ny: 1, span: (R - L) * 0.32, size: 5 * k, growth: gSheet })
    if (edges.has('left')) rows.push({ seed: seed + 2, x: L, y: B - (B - Tp) * 0.2, dx: 0, dy: -1, nx: -1, ny: 0, span: (B - Tp) * 0.45, size: 5.5 * k, growth: gSheet })
    if (edges.has('top')) rows.push({ seed: seed + 3, x: L, y: Tp, dx: 1, dy: 0, nx: 0, ny: -1, span: (R - L) * 0.24, size: 4.5 * k, growth: gSheet })
    for (const row of rows) flameRow(pen, { ...row, detail: 0.2 })
    if (edges.has('seal')) seal(pen, L - 2, Tp - 2, 2.3 * k, still ? 0 : -view.step * 0.11)
  }

  // 2. text boxes stay clear of them
  view.clearSafe()

  // 3. the frame corners, always in front
  const gPage = grow(view, view.pageAge, 0.5, 20000)
  const frame: Row[] = [
    { seed: 3, x: T, y: H - T, dx: 1, dy: 0, nx: 0, ny: -1, span: 70 * k, size: 9 * k, growth: gPage },
    { seed: 4, x: T, y: H - T, dx: 0, dy: -1, nx: 1, ny: 0, span: 46 * k, size: 8 * k, growth: gPage },
    { seed: 5, x: W - T, y: H - T, dx: -1, dy: 0, nx: 0, ny: -1, span: 58 * k, size: 8 * k, growth: gPage },
  ]
  if (!mobile) {
    frame.push({ seed: 6, x: W - T, y: H - T, dx: 0, dy: -1, nx: -1, ny: 0, span: 32, size: 6.5, growth: gPage })
    frame.push({ seed: 9, x: W - T, y: T + 24, dx: 0, dy: 1, nx: -1, ny: 0, span: 28, size: 6, growth: gPage })
  }
  for (const row of frame) flameRow(pen, row)
  seal(pen, T + 15 * k, H - T - 17 * k, 2.3 * k, still ? 0 : view.step * 0.11)

  // on phones the frame sits over the text while scrolling, so it gives way there too
  if (mobile) view.clearSafe()
}

export const cursedSeal: Scene = { fps: 6, draw: (v) => draw(v, 'seal') }
export const amaterasu: Scene = { fps: 8, draw: (v) => draw(v, 'fire') }
