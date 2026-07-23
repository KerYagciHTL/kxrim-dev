import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollState } from './scrollState.ts'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis 1.x animates native window scroll, so ScrollTrigger needs no
 * scrollerProxy — it reads window.scrollY as usual. The integration point is
 * timing: Lenis is driven from GSAP's ticker and pings ScrollTrigger.update
 * on each scroll frame. (Documented deviation from the brief's scrollerProxy
 * note — see CLAUDE.md.)
 */
export function initSmoothScroll(): () => void {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 2.6),
    smoothWheel: true,
  })

  lenis.on('scroll', () => {
    scrollState.progress = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0
    scrollState.velocity = lenis.velocity
    ScrollTrigger.update()
  })

  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}

/** Native-scroll fallback used when prefers-reduced-motion is set: no
 *  smoothing, no scroll-jacking — but progress still tracks for the counter. */
export function initNativeScrollTracking(): () => void {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? window.scrollY / max : 0
    scrollState.velocity = 0
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
