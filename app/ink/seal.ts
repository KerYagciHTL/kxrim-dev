// The cursed seal (light theme): flames that grow on the edges of the current sheet's elements
// and from the frame corners, and keep licking in place.
import { flameRow, seal, type Pen, type Row } from './marks'
import { grow, type Scene, type View } from './scene'

const size = (view: View) => (view.mobile ? 0.55 : 1)

/** Flames on the elements, on the layer that scrolls with them; text boxes stay clear. */
function page(view: View) {
  const { page: buf, still } = view
  const pen: Pen = { buf, pal: view.pal, step: view.step }
  const k = size(view)
  const g = grow(view, view.sheetAge, 0.3, 12000)
  for (const m of view.marked) {
    const { L, T, R, B, edges } = m
    const seed = 20 + m.i * 10
    const rows: Row[] = []
    if (edges.has('right')) rows.push({ seed, x: R, y: T + (B - T) * 0.34, dx: 0, dy: 1, nx: 1, ny: 0, span: (B - T) * 0.52, size: 5.5 * k, growth: g })
    if (edges.has('bottom')) rows.push({ seed: seed + 1, x: R - 1, y: B, dx: -1, dy: 0, nx: 0, ny: 1, span: (R - L) * 0.32, size: 5 * k, growth: g })
    if (edges.has('left')) rows.push({ seed: seed + 2, x: L, y: B - (B - T) * 0.2, dx: 0, dy: -1, nx: -1, ny: 0, span: (B - T) * 0.45, size: 5.5 * k, growth: g })
    if (edges.has('top')) rows.push({ seed: seed + 3, x: L, y: T, dx: 1, dy: 0, nx: 0, ny: -1, span: (R - L) * 0.24, size: 4.5 * k, growth: g })
    for (const row of rows) flameRow(pen, { ...row, detail: 0.2 })
    if (edges.has('seal')) seal(pen, L - 2, T - 2, 2.3 * k, still ? 0 : -view.step * 0.11)
  }
  view.clearSafe(buf)
}

/** The frame corners, fixed to the screen and always in front, also over text. */
function frame(view: View) {
  const { buf, W, H, T, mobile, still } = view
  const pen: Pen = { buf, pal: view.pal, step: view.step }
  const k = mobile ? 0.5 : 1
  const g = grow(view, view.pageAge, 0.5, 20000)
  const rows: Row[] = [
    { seed: 3, x: T, y: H - T, dx: 1, dy: 0, nx: 0, ny: -1, span: 70 * k, size: 9 * k, growth: g },
    { seed: 4, x: T, y: H - T, dx: 0, dy: -1, nx: 1, ny: 0, span: 46 * k, size: 8 * k, growth: g },
    { seed: 5, x: W - T, y: H - T, dx: -1, dy: 0, nx: 0, ny: -1, span: 58 * k, size: 8 * k, growth: g },
  ]
  if (!mobile) {
    rows.push({ seed: 6, x: W - T, y: H - T, dx: 0, dy: -1, nx: -1, ny: 0, span: 32, size: 6.5, growth: g })
    rows.push({ seed: 9, x: W - T, y: T + 24, dx: 0, dy: 1, nx: -1, ny: 0, span: 28, size: 6, growth: g })
  }
  for (const row of rows) flameRow(pen, row)
  seal(pen, T + 15 * k, H - T - 17 * k, 2.3 * k, still ? 0 : view.step * 0.11)
}

export const cursedSeal: Scene = { fps: 6, page, frame }
