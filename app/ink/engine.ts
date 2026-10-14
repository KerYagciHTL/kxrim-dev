// Runs the pixel layer over the whole viewport and the screentone under it.
// Which scene it draws comes from the CSS token --ink-scene, so each theme brings its own.
//
// The DOM tells the scenes what to do:
//   data-ink="right bottom left top seal"  the scene decorates these edges of the element
//   data-ink-safe                          nothing is drawn over this box (text stays readable)
import { PixelBuffer, colour } from './buffer'
import { crows } from './crows'
import { rain } from './rain'
import type { Box, Marked, Palette, Scene, View } from './scene'
import { amaterasu, cursedSeal } from './seal'

const SCENES: Record<string, Scene> = { seal: cursedSeal, fire: amaterasu, rain, crows }

export class InkEngine {
  private buf: PixelBuffer
  private scale = 4
  private trim = 5
  private palette: Palette | null = null
  private scene: Scene = cursedSeal
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

  /** Re-reads the scene, colours and sizes; call after a resize or a theme change. */
  refresh() {
    const css = getComputedStyle(document.documentElement)
    const v = (name: string) => css.getPropertyValue(name).trim()
    this.palette = {
      body: colour(v('--px-body')),
      rim: colour(v('--px-rim')),
      edge: colour(v('--px-edge')),
      spark: colour(v('--px-spark')),
      seal: colour(v('--px-seal')),
    }
    this.scene = SCENES[v('--ink-scene')] ?? cursedSeal
    this.scale = this.mobile ? 3 : 4
    this.trim = Math.round(parseFloat(v('--trim')) / this.scale)
    this.buf.resize(Math.ceil(innerWidth / this.scale), Math.ceil(innerHeight / this.scale))
    this.drawTone(v('--tone-ink') || v('--ink'), parseFloat(v('--tone-alpha')), v('--tone-kind') === 'rain')
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
      if (!document.hidden && t - this.last > 1000 / this.scene.fps) {
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

  render() {
    if (!this.palette) return
    const { buf, scale: P } = this
    const onScreen = (b: DOMRect) => !(b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight)
    const box = (b: DOMRect): Box => ({ L: b.left / P, T: b.top / P, R: b.right / P, B: b.bottom / P })

    const marked: Marked[] = []
    document.querySelectorAll<HTMLElement>('[data-ink]').forEach((el, i) => {
      const b = el.getBoundingClientRect()
      if (onScreen(b)) marked.push({ ...box(b), edges: new Set((el.dataset.ink ?? '').split(' ')), i })
    })
    const safe: Box[] = []
    document.querySelectorAll<HTMLElement>('[data-ink-safe]').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (onScreen(b)) safe.push(box(b))
    })

    const now = performance.now()
    const view: View = {
      buf,
      pal: this.palette,
      step: this.still ? 0 : this.step,
      still: this.still,
      mobile: this.mobile,
      W: buf.width,
      H: buf.height,
      T: this.trim,
      marked,
      safe,
      sheetAge: now - this.sheetSince,
      pageAge: now - this.pageSince,
      clearSafe: () => safe.forEach((s) => buf.erase(s.L, s.T, s.R, s.B)),
    }
    buf.clear()
    this.scene.draw(view)
    buf.flush()
  }

  /**
   * Gradient screentone in the corners, fading away from them: dots on a 45° grid, or for rain
   * the slanted line tone manga uses for a downpour.
   */
  private drawTone(ink: string, alpha: number, lines: boolean) {
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
    c.strokeStyle = ink
    c.globalAlpha = alpha
    const spots: [number, number, number][] = this.mobile
      ? [[0, h, h * 0.3]]
      : [[0, h, h * 0.5], [w, h, h * 0.4], [w, 0, h * 0.24]]
    const strength = (x: number, y: number) => {
      let r = 0
      for (const [cx, cy, R] of spots) {
        const d = Math.hypot(x - cx, y - cy) / R
        if (d < 1) r = Math.max(r, Math.pow(1 - d, 1.25))
      }
      return r
    }

    if (lines) {
      // short strokes along the rain's slant, longer and thicker towards the corner
      const gap = 7
      c.lineCap = 'butt'
      for (let y = -gap; y < h + gap; y += gap) {
        for (let x = -gap; x < w + gap; x += gap * 2.2) {
          const ox = x + ((y / gap) % 2) * gap * 1.1
          const r = strength(ox, y)
          if (r < 0.12) continue
          const len = 4 + r * 16
          c.lineWidth = 0.6 + r * 0.9
          c.beginPath()
          c.moveTo(ox, y)
          c.lineTo(ox - len * 0.25, y + len)
          c.stroke()
        }
      }
      return
    }

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
        const r = 1.55 * strength(x, y)
        if (r < 0.3) continue
        c.beginPath()
        c.arc(x, y, r, 0, Math.PI * 2)
        c.fill()
      }
    }
  }
}
