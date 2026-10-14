// What a scene gets to draw one frame: the pixel buffer, the colours, the clock, and where the
// page's elements are, all in art pixels (one art pixel is `scale` CSS pixels).
import type { Colour, PixelBuffer } from './buffer'

export interface Palette {
  body: Colour
  rim: Colour
  edge: Colour
  spark: Colour
  seal: Colour
}

export interface Box {
  L: number
  T: number
  R: number
  B: number
}

/** An element with `data-ink`: the scene decorates these edges of it. */
export interface Marked extends Box {
  edges: Set<string>
  /** its position among all marked elements, a stable seed */
  i: number
}

export interface View {
  buf: PixelBuffer
  pal: Palette
  /** frame counter at the scene's own frame rate; 0 forever when motion is reduced */
  step: number
  still: boolean
  mobile: boolean
  /** viewport size and the trim line inset, in art pixels */
  W: number
  H: number
  T: number
  marked: Marked[]
  safe: Box[]
  /** milliseconds since the current sheet came into view, and since the page loaded */
  sheetAge: number
  pageAge: number
  /** clears every text box, so text stays readable */
  clearSafe(): void
}

export interface Scene {
  fps: number
  draw(view: View): void
}

/** 0..1 growth from `from` over `ms`, in 48 steps so the pixels do not shimmer. */
export function grow(view: View, age: number, from: number, ms: number) {
  if (view.still) return 0.85
  const g = Math.min(1, from + (age / ms) * (1 - from))
  return Math.round(g * 48) / 48
}

/** Stable pseudo random number in 0..1 for a pair of integers. */
export function hash(a: number, b = 0) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x27d4eb2f, 0xc2b2ae35)
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

export const inside = (b: Box, x: number, y: number) => x >= b.L && x <= b.R && y >= b.T && y <= b.B
