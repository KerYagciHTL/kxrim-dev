// Runs the pixel layers and the screentone under them. Which scene it draws comes from the CSS
// token --ink-scene, so each theme brings its own. There are two layers (see scene.ts): one fixed
// to the screen, one inside the deck that scrolls with the content, so marks that belong to an
// element stay glued to it while the page moves.
//
// The DOM tells the scenes what to do:
//   data-ink="right bottom left top seal"  the scene decorates these edges of the element
//   data-ink-safe                          nothing is drawn over this box (text stays readable)
import { PixelBuffer, colour } from './buffer'
import { crows } from './crows'
import { rain } from './rain'
import type { Box, Marked, Palette, Scene, View } from './scene'
import { cursedSeal } from './seal'

const SCENES: Record<string, Scene> = { seal: cursedSeal, crows, rain }

/** extra canvas above the screen on phones, so a toolbar that slides away never shows a gap */
const HEADROOM = 140

export class InkEngine {
  private buf: PixelBuffer
  private page: PixelBuffer | null = null
  private host: HTMLElement | null = null
  private scale = 4
  private trim = 5
  /** CSS size of the screen layer, and the viewport width it was made for */
  private size = { w: 0, h: 0, vw: 0 }
  private palette: Palette | null = null
  private scene: Scene = cursedSeal
  private step = 0
  private pageSince = performance.now()
  private sheetSince = performance.now()
  private raf = 0
  private last = 0
  private running = false
  private readonly still = matchMedia('(prefers-reduced-motion: reduce)').matches
  private readonly watchHost = new ResizeObserver(() => this.sizePage())

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly tone: HTMLCanvasElement,
  ) {
    this.buf = new PixelBuffer(this.context(canvas))
  }

  private context(c: HTMLCanvasElement) {
    const ctx = c.getContext('2d')
    if (!ctx) throw new Error('2d canvas not available')
    return ctx
  }

  private get mobile() {
    return innerWidth < 768
  }

  /** The canvas that scrolls with the content, and the element it lives in (the deck). */
  attachPage(canvas: HTMLCanvasElement | null, host: HTMLElement | null) {
    this.watchHost.disconnect()
    this.page = canvas && host ? new PixelBuffer(this.context(canvas)) : null
    this.host = canvas && host ? host : null
    if (this.host) this.watchHost.observe(this.host)
    this.sizePage()
  }

  private sizePage() {
    if (!this.page || !this.host) return
    const P = this.scale
    // never larger than the content, or the canvas itself would make the page longer
    const w = Math.max(1, Math.floor(this.host.scrollWidth / P))
    const h = Math.max(1, Math.floor(this.host.scrollHeight / P))
    if (w !== this.page.width || h !== this.page.height) {
      this.page.resize(w, h)
      const c = this.page.canvas
      c.style.width = `${w * P}px`
      c.style.height = `${h * P}px`
    }
    this.render()
  }

  /** Re-reads the scene, colours and sizes; call after a theme change. */
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
    // the screen layer hangs from the bottom of the screen with a fixed size, so a phone's
    // toolbar sliding in and out moves it instead of stretching it
    const P = this.scale
    const w = Math.ceil(innerWidth / P)
    const h = Math.ceil((innerHeight + (this.mobile ? HEADROOM : 0)) / P)
    this.buf.resize(w, h)
    this.size = { w: w * P, h: h * P, vw: innerWidth }
    for (const c of [this.canvas, this.tone]) {
      c.style.width = `${this.size.w}px`
      c.style.height = `${this.size.h}px`
    }
    this.drawTone(v('--tone-ink') || v('--ink'), parseFloat(v('--tone-alpha')), v('--tone-kind') === 'rain')
    this.sizePage()
    this.render()
  }

  /** On resize: a phone toolbar only changes the height a little, that needs no new canvas. */
  resized() {
    const fits = this.mobile && innerWidth === this.size.vw && innerHeight <= this.size.h && innerHeight > this.size.h - HEADROOM * 2
    if (fits) this.render()
    else this.refresh()
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
    this.watchHost.disconnect()
  }

  /** Both layers. While the page scrolls only `renderScreen` is needed: the page layer moves along. */
  render() {
    this.draw(true)
  }

  renderScreen() {
    this.draw(false)
  }

  private draw(withPage: boolean) {
    if (!this.palette) return
    const { buf, scale: P } = this
    const box = (b: DOMRect): Box => ({ L: b.left / P, T: b.top / P, R: b.right / P, B: b.bottom / P })
    const seen = (b: DOMRect) => !(b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight)

    const marked: Marked[] = []
    document.querySelectorAll<HTMLElement>('[data-ink]').forEach((el, i) => {
      const b = el.getBoundingClientRect()
      if (b.width || b.height) marked.push({ ...box(b), edges: new Set((el.dataset.ink ?? '').split(' ')), i, seen: seen(b) })
    })
    const safe: Box[] = []
    document.querySelectorAll<HTMLElement>('[data-ink-safe]').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (b.width || b.height) safe.push(box(b))
    })

    // screen coordinates onto each canvas: the screen layer's top sits above the screen by the
    // headroom; the page layer starts at the deck's own top left corner
    buf.dy = (this.size.h - innerHeight) / P
    const page = this.page && this.host ? this.page : null
    if (page && this.host) {
      const r = this.host.getBoundingClientRect()
      page.dx = (this.host.scrollLeft - r.left) / P
      page.dy = (this.host.scrollTop - r.top) / P
    }

    const now = performance.now()
    const view: View = {
      buf,
      page: page ?? buf,
      pal: this.palette,
      step: this.still ? 0 : this.step,
      still: this.still,
      mobile: this.mobile,
      W: innerWidth / P,
      H: innerHeight / P,
      T: this.trim,
      marked,
      safe,
      sheetAge: now - this.sheetSince,
      pageAge: now - this.pageSince,
      clearSafe: (layer) => safe.forEach((s) => layer.erase(s.L, s.T, s.R, s.B)),
    }

    if (page && withPage) {
      page.clear()
      this.scene.page?.(view)
      page.flush()
    }
    buf.clear()
    // without a page canvas (the error page) everything shares the screen layer
    if (!page) this.scene.page?.(view)
    this.scene.frame(view)
    buf.flush()
  }

  /**
   * Gradient screentone in the corners, fading away from them: dots on a 45° grid, or for rain
   * the slanted line tone manga uses for a downpour.
   */
  private drawTone(ink: string, alpha: number, lines: boolean) {
    const dpr = Math.min(2, devicePixelRatio || 1)
    const w = this.size.w
    const h = this.size.h
    // the visible screen is the lower part of the canvas
    const top = h - innerHeight
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
      ? [[0, h, innerHeight * 0.3]]
      : [[0, h, innerHeight * 0.5], [w, h, innerHeight * 0.4], [w, top, innerHeight * 0.24]]
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
