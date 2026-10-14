// What a scene gets to draw one frame: two pixel buffers, the colours, the clock, and where the
// page's elements are, all in art pixels (one art pixel is `scale` CSS pixels) and measured from
// the top left of the screen.
//
// Two layers, so nothing lags behind when the page scrolls:
//   page   lives inside the deck and scrolls with the content: marks that belong to an element
//   frame  is fixed to the screen: the frame corners, crows on the frame, rain
// Both take screen coordinates; the page buffer shifts them onto the page by itself.
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
  /** at least partly on screen right now */
  seen: boolean
}

export interface View {
  /** the layer fixed to the screen */
  buf: PixelBuffer
  /** the layer that scrolls with the content */
  page: PixelBuffer
  pal: Palette
  /** frame counter at the scene's own frame rate; 0 forever when motion is reduced */
  step: number
  still: boolean
  mobile: boolean
  /** viewport size and the trim line inset, in art pixels */
  W: number
  H: number
  T: number
  /** every element with data-ink and every text box on the page, also those off screen */
  marked: Marked[]
  safe: Box[]
  /** milliseconds since the current sheet came into view, and since the page loaded */
  sheetAge: number
  pageAge: number
  /** clears every text box in one layer, so text stays readable */
  clearSafe(layer: PixelBuffer): void
}

/**
 * `page` draws what belongs to the elements; it runs at the scene's frame rate only, because
 * that layer scrolls by itself. `frame` draws what is fixed to the screen; it also runs while
 * the page scrolls.
 */
export interface Scene {
  fps: number
  page?(view: View): void
  frame(view: View): void
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
export const overlaps = (a: Box, b: Box) => a.L < b.R && a.R > b.L && a.T < b.B && a.B > b.T
