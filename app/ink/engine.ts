// Runs the pixel layer over the whole viewport and the screentone under it.
// Marks grow while a visitor stays on a sheet, then keep licking in place at a pixel-art frame rate.
//
// The DOM tells the engine what to do:
//   data-ink="right bottom left top seal"  marks grow on these edges of the element
//   data-ink-safe                          no element marks are drawn over this box (text stays readable)
import { PixelBuffer, colour } from './buffer'
import { flameRow, seal, type Palette, type Pen, type Row } from './marks'

const FPS = { seal: 6, fire: 8 }

export class InkEngine {
  private buf: PixelBuffer
  private scale = 4
  private trim = 5
  private palette: Palette | null = null
  private style: Pen['style'] = 'seal'
  private step = 0
  private pageSince = performance.now()
  private sheetSince = performance.now()
  private raf = 0
  private last = 0
  private running = false
  private readonly still = matchMedia('(prefers-reduced-motion: reduce)').matches

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly tone: HTMLCanvasElement,
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2d canvas not available')
    this.buf = new PixelBuffer(ctx)
  }

  private get mobile() {
    return innerWidth < 768
  }

  /** Re-reads colours and sizes; call after a resize or a theme change. */
  refresh() {
    const css = getComputedStyle(document.documentElement)
    const v = (name: string) => css.getPropertyValue(name)
    this.palette = {
      body: colour(v('--px-body')),
      rim: colour(v('--px-rim')),
      edge: colour(v('--px-edge')),
      spark: colour(v('--px-spark')),
      seal: colour(v('--px-seal')),
    }
    const dark = v('color-scheme').trim() === 'dark'
    this.style = dark ? 'fire' : 'seal'
    this.scale = this.mobile ? 3 : 4
    this.trim = Math.round(parseFloat(v('--trim')) / this.scale)
    this.buf.resize(Math.ceil(innerWidth / this.scale), Math.ceil(innerHeight / this.scale))
    this.drawTone(v('--ink').trim(), parseFloat(v('--tone-alpha')))
    this.render()
  }

  /** The marks on a sheet's own element start growing again from small. */
  sheetChanged() {
    this.sheetSince = performance.now()
    this.render()
  }

  start() {
    this.refresh()
    if (this.still || this.running) return
    this.running = true
    const loop = (t: number) => {
      if (!this.running) return
      if (!document.hidden && t - this.last > 1000 / FPS[this.style]) {
        this.last = t
        this.step++
        this.render()
      }
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private growth(since: number, from: number, ms: number) {
    if (this.still) return 0.85
    const g = Math.min(1, from + ((performance.now() - since) / ms) * (1 - from))
    return Math.round(g * 48) / 48
  }

  render() {
    if (!this.palette) return
    const { buf, scale: P, trim: T } = this
    const W = buf.width
    const H = buf.height
    const pen: Pen = { buf, pal: this.palette, style: this.style, step: this.still ? 0 : this.step }
    const k = this.mobile ? 0.55 : 1
    buf.clear()

    // 1. marks on the current sheet's elements
    const gSheet = this.growth(this.sheetSince, 0.3, 12000)
    document.querySelectorAll<HTMLElement>('[data-ink]').forEach((el, i) => {
      const b = el.getBoundingClientRect()
      if (b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight) return
      const L = b.left / P
      const Tp = b.top / P
      const R = b.right / P
      const B = b.bottom / P
      const edges = new Set((el.dataset.ink ?? '').split(' '))
      const seed = 20 + i * 10
      const rows: Row[] = []
      if (edges.has('right')) rows.push({ seed, x: R, y: Tp + (B - Tp) * 0.34, dx: 0, dy: 1, nx: 1, ny: 0, span: (B - Tp) * 0.52, size: 5.5 * k, growth: gSheet })
      if (edges.has('bottom')) rows.push({ seed: seed + 1, x: R - 1, y: B, dx: -1, dy: 0, nx: 0, ny: 1, span: (R - L) * 0.32, size: 5 * k, growth: gSheet })
      if (edges.has('left')) rows.push({ seed: seed + 2, x: L, y: B - (B - Tp) * 0.2, dx: 0, dy: -1, nx: -1, ny: 0, span: (B - Tp) * 0.45, size: 5.5 * k, growth: gSheet })
      if (edges.has('top')) rows.push({ seed: seed + 3, x: L, y: Tp, dx: 1, dy: 0, nx: 0, ny: -1, span: (R - L) * 0.24, size: 4.5 * k, growth: gSheet })
      for (const row of rows) flameRow(pen, { ...row, detail: 0.2 })
      if (edges.has('seal')) seal(pen, L - 2, Tp - 2, 2.3 * k, this.still ? 0 : -this.step * 0.11)
    })

    // 2. text boxes stay clear of them
    document.querySelectorAll<HTMLElement>('[data-ink-safe]').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight) return
      buf.erase(b.left / P, b.top / P, b.right / P, b.bottom / P)
    })

    // 3. the frame corners, always in front
    const gPage = this.growth(this.pageSince, 0.5, 20000)
    const frame: Row[] = [
      { seed: 3, x: T, y: H - T, dx: 1, dy: 0, nx: 0, ny: -1, span: 70 * k, size: 9 * k, growth: gPage },
      { seed: 4, x: T, y: H - T, dx: 0, dy: -1, nx: 1, ny: 0, span: 46 * k, size: 8 * k, growth: gPage },
      { seed: 5, x: W - T, y: H - T, dx: -1, dy: 0, nx: 0, ny: -1, span: 58 * k, size: 8 * k, growth: gPage },
    ]
    if (!this.mobile) {
      frame.push({ seed: 6, x: W - T, y: H - T, dx: 0, dy: -1, nx: -1, ny: 0, span: 32, size: 6.5, growth: gPage })
      frame.push({ seed: 9, x: W - T, y: T + 24, dx: 0, dy: 1, nx: -1, ny: 0, span: 28, size: 6, growth: gPage })
    }
    for (const row of frame) flameRow(pen, row)
    seal(pen, T + 15 * k, H - T - 17 * k, 2.3 * k, this.still ? 0 : this.step * 0.11)

    // on phones the frame sits over the text while scrolling, so it gives way there too
    if (this.mobile) {
      document.querySelectorAll<HTMLElement>('[data-ink-safe]').forEach((el) => {
        const b = el.getBoundingClientRect()
        if (b.bottom < 0 || b.top > innerHeight) return
        buf.erase(b.left / P, b.top / P, b.right / P, b.bottom / P)
      })
    }

    buf.flush()
  }

  /** Gradient screentone in the corners: dots on a 45° grid that shrink away from the corner. */
  private drawTone(ink: string, alpha: number) {
    const dpr = Math.min(2, devicePixelRatio || 1)
    const w = innerWidth
    const h = innerHeight
    this.tone.width = Math.round(w * dpr)
    this.tone.height = Math.round(h * dpr)
    const c = this.tone.getContext('2d')
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, w, h)
    c.fillStyle = ink
    c.globalAlpha = alpha
    const spots: [number, number, number][] = this.mobile
      ? [[0, h, h * 0.3]]
      : [[0, h, h * 0.5], [w, h, h * 0.4], [w, 0, h * 0.24]]
    // lattice rotated by 45°: x = (i + j) * a, y = (j - i) * a
    const a = 6 / Math.SQRT2
    const iMin = Math.floor(-h / (2 * a)) - 1
    const iMax = Math.ceil(w / (2 * a)) + 1
    const jMax = Math.ceil((w + h) / (2 * a)) + 1
    for (let i = iMin; i <= iMax; i++) {
      for (let j = -1; j <= jMax; j++) {
        const x = (i + j) * a
        const y = (j - i) * a
        if (x < -2 || y < -2 || x > w + 2 || y > h + 2) continue
        let r = 0
        for (const [cx, cy, R] of spots) {
          const d = Math.hypot(x - cx, y - cy) / R
          if (d < 1) r = Math.max(r, 1.55 * Math.pow(1 - d, 1.25))
        }
        if (r < 0.3) continue
        c.beginPath()
        c.arc(x, y, r, 0, Math.PI * 2)
        c.fill()
      }
    }
  }
}
