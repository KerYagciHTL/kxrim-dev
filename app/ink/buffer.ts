// A 1-bit-style pixel canvas: one art pixel is `scale` CSS pixels, drawn crisp via image-rendering.

export type Colour = number

/** '#rrggbb' to a 32-bit pixel (little endian ABGR, as ImageData stores it). */
export function colour(hex: string): Colour {
  const h = hex.trim().replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0
}

/** Small seeded generator, so shapes stay put between frames. */
export function random(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class PixelBuffer {
  width = 0
  height = 0
  /** shifts every drawing call, so callers can draw in screen coordinates on a page canvas */
  dx = 0
  dy = 0
  private image: ImageData | null = null
  private data: Uint32Array = new Uint32Array(0)

  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  get canvas() {
    return this.ctx.canvas
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
    this.image = this.ctx.createImageData(width, height)
    this.data = new Uint32Array(this.image.data.buffer)
  }

  clear() {
    this.data.fill(0)
  }

  put(x: number, y: number, c: Colour) {
    const xi = Math.round(x + this.dx)
    const yi = Math.round(y + this.dy)
    if (xi >= 0 && yi >= 0 && xi < this.width && yi < this.height) this.data[yi * this.width + xi] = c
  }

  disc(cx: number, cy: number, r: number, c: Colour) {
    const R = Math.ceil(r)
    const rr = r * r + 0.25
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        if (dx * dx + dy * dy <= rr) this.put(cx + dx, cy + dy, c)
      }
    }
  }

  /** Clears a rectangle given in art pixels, with a one pixel margin. */
  erase(x0: number, y0: number, x1: number, y1: number) {
    const ax = Math.max(0, Math.floor(x0 + this.dx) - 1)
    const bx = Math.min(this.width, Math.ceil(x1 + this.dx) + 1)
    const ay = Math.max(0, Math.floor(y0 + this.dy) - 1)
    const by = Math.min(this.height, Math.ceil(y1 + this.dy) + 1)
    if (ax >= bx) return
    for (let y = ay; y < by; y++) this.data.fill(0, y * this.width + ax, y * this.width + bx)
  }

  flush() {
    if (this.image) this.ctx.putImageData(this.image, 0, 0)
  }
}
