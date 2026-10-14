// Switching the language re-letters the page the way a manga gets translated: every line on
// screen is covered with correction tape, the text underneath changes, and the tape comes off
// again over the new words. Text marked translate="no" (names, the address) stays as it is.
// The deck does not turn while it runs; on phones a swipe ends it at once (the text still swaps).
import { nextTick } from 'vue'

interface Line {
  x: number
  y: number
  w: number
  h: number
  bg: string
}

const ROOTS = 'header.top, #main'
const SKIP = '[translate="no"], [aria-hidden="true"], .visually-hidden'

let busy = false

/** true while the tape is on screen; the deck ignores the wheel and the keys meanwhile */
export const isRelettering = () => busy

const frame = () => new Promise<void>((done) => requestAnimationFrame(() => done()))

function backgroundOf(el: Element | null): string {
  for (let e = el; e; e = e.parentElement) {
    const c = getComputedStyle(e).backgroundColor
    const alpha = c.match(/rgba\(.*,\s*([\d.]+)\)/)
    if (c && c !== 'transparent' && (!alpha || Number(alpha[1]) > 0.5)) return c
  }
  return getComputedStyle(document.body).backgroundColor
}

function visible(el: Element, r: DOMRect) {
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
  return !hit || el.contains(hit) || hit.contains(el)
}

/** The visible lines of text, one rectangle per line and background. */
function linesOnScreen(): Line[] {
  const out: Line[] = []
  const range = document.createRange()
  document.querySelectorAll(ROOTS).forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.textContent?.trim() && !n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    })
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      range.selectNodeContents(n)
      const bg = backgroundOf(n.parentElement)
      for (const r of range.getClientRects()) {
        if (r.width < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue
        // text under the phone's top bar or the folio is not on screen, it needs no tape
        if (!visible(n.parentElement!, r)) continue
        // pieces of one line (a bold word, a link) become one strip
        const prev = out[out.length - 1]
        if (prev && prev.bg === bg && Math.abs(prev.y - r.top) < 4 && r.left >= prev.x && r.left - (prev.x + prev.w) < 12) {
          prev.w = r.right - prev.x
          prev.h = Math.max(prev.h, r.height)
          continue
        }
        out.push({ x: r.left, y: r.top, w: r.width, h: r.height, bg })
      }
    }
  })
  return out
}

/** `tape` is a colour, or 'auto' for a shade lighter than whatever is behind each line */
function lay(layer: HTMLElement, lines: Line[], tape: string): HTMLElement[] {
  return lines.map((l) => {
    const strip = document.createElement('i')
    const colour = tape === 'auto' ? `color-mix(in srgb, ${l.bg} 86%, #fff)` : tape
    strip.style.cssText = `left:${l.x - 2}px;top:${l.y}px;width:${l.w + 4}px;height:${l.h}px;background:${colour}`
    strip.append(document.createElement('b'))
    layer.append(strip)
    return strip
  })
}

/** Tape goes on from the left (cover) or comes off towards the right (reveal), line by line. */
function sweep(strips: HTMLElement[], mode: 'cover' | 'reveal') {
  const ms = mode === 'cover' ? 210 : 260
  const gap = Math.min(16, (mode === 'cover' ? 260 : 320) / Math.max(1, strips.length))
  const easing = 'cubic-bezier(0.5, 0, 0.25, 1)'
  return Promise.all(
    strips.map((strip, i) => {
      const w = strip.offsetWidth
      const timing = { duration: ms, delay: i * gap, easing, fill: 'both' as const }
      const clip = mode === 'cover' ? ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] : ['inset(0 0 0 0)', 'inset(0 0 0 100%)']
      strip.firstElementChild?.animate(
        [
          { transform: `translateX(${mode === 'cover' ? 0 : -2}px)`, opacity: 1 },
          { transform: `translateX(${w - 2}px)`, opacity: 1, offset: 0.9 },
          { transform: `translateX(${w - 2}px)`, opacity: 0 },
        ],
        timing,
      )
      return strip.animate({ clipPath: clip }, timing).finished
    }),
  )
}

/** Runs `swap` (the language change) under the tape. Without motion it just swaps. */
export async function reletter(swap: () => Promise<void>) {
  if (busy) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('animate' in Element.prototype)) return swap()
  busy = true
  const html = document.documentElement
  const tape = getComputedStyle(html).getPropertyValue('--tape').trim() || 'auto'
  const layer = document.createElement('div')
  layer.className = 'reletter'
  layer.setAttribute('aria-hidden', 'true')
  document.body.append(layer)
  // a swipe on a phone scrolls the text away from its tape: drop the tape, keep the swap
  let aborted = false
  const abort = () => {
    aborted = true
    layer.getAnimations({ subtree: true }).forEach((a) => a.finish())
    layer.style.visibility = 'hidden'
  }
  addEventListener('touchmove', abort, { passive: true })
  try {
    const old = lay(layer, linesOnScreen(), tape)
    await sweep(old, 'cover')
    html.classList.add('relettering')
    await swap()
    if (aborted) return
    await nextTick()
    await frame()
    await frame()
    if (aborted) return
    const fresh = lay(layer, linesOnScreen(), tape)
    for (const s of fresh) s.style.opacity = '0'
    await Promise.all([
      ...old.map((s) => s.animate({ opacity: [1, 0] }, { duration: 120, fill: 'forwards' }).finished),
      ...fresh.map((s) => s.animate({ opacity: [0, 1] }, { duration: 120, fill: 'forwards' }).finished),
    ])
    for (const s of old) s.remove()
    html.classList.remove('relettering')
    if (!aborted) await sweep(fresh, 'reveal')
  } finally {
    removeEventListener('touchmove', abort)
    layer.remove()
    html.classList.remove('relettering')
    busy = false
  }
}
