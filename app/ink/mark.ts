// The mark next to the name: the three tomoe of the cursed seal, drawn by the same code as the
// seal on the avatar's corner and turning the same way, in every theme.
import { PixelBuffer, colour } from './buffer'
import { seal } from './marks'

export const MARK = { size: 20, fps: 6 }

function draw(buf: PixelBuffer, step: number, ink: string, paper: string) {
  const i = colour(ink)
  const p = colour(paper)
  const c = MARK.size / 2 - 0.5
  seal({ buf, pal: { body: i, rim: p, edge: p, spark: i, seal: i }, step }, c, c, 2.3, -step * 0.11)
}

/** Draws frame `step` into a canvas buffer; colours are '#rrggbb'. */
export function drawMark(buf: PixelBuffer, step: number, ink: string, paper: string) {
  buf.clear()
  draw(buf, step, ink, paper)
  buf.flush()
}

/** The first frame as horizontal runs of ink, for the server-rendered SVG. */
export function markRuns(): { x: number; y: number; w: number }[] {
  const ink = '#010101'
  const image = { data: new Uint8ClampedArray(MARK.size * MARK.size * 4) }
  const ctx = { canvas: {}, createImageData: () => image, putImageData() {} } as unknown as CanvasRenderingContext2D
  const buf = new PixelBuffer(ctx)
  buf.resize(MARK.size, MARK.size)
  draw(buf, 0, ink, '#ffffff')
  const px = new Uint32Array(image.data.buffer)
  const want = colour(ink)
  const runs: { x: number; y: number; w: number }[] = []
  for (let y = 0; y < MARK.size; y++) {
    for (let x = 0; x < MARK.size; x++) {
      if (px[y * MARK.size + x] !== want) continue
      const last = runs[runs.length - 1]
      if (last && last.y === y && last.x + last.w === x) last.w++
      else runs.push({ x, y, w: 1 })
    }
  }
  return runs
}

export { PixelBuffer }
