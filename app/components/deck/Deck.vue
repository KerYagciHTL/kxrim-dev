<script setup lang="ts">
// The horizontal deck. Desktop: one sheet per screen, the wheel and the arrow keys turn one sheet,
// and the content gets a horizontal motion blur while it moves. Phones: a plain vertical page.
import type { SheetInfo } from '~/composables/useDeck'

const props = defineProps<{ sheets: SheetInfo[] }>()
const { sheets, index, turns, goTo, inkPage } = useDeck()
const route = useRoute()
index.value = 0
// labels change with the language while the deck stays
watchEffect(() => (sheets.value = props.sheets))

const deck = ref<HTMLElement>()
const ink = ref<HTMLCanvasElement>()
const blur = ref<SVGFEGaussianBlurElement>()
const still = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches
const wide = () => innerWidth >= 768

let lastX = 0
let lastT = 0
let settle = 0
let io: IntersectionObserver | null = null
// the sheet a turn is heading for, so a second press during the slide goes one further
let aim = -1
// wheel gestures: when the last event came, when the wheel last turned a sheet, recent strengths
let wheelAt = 0
let stepAt = 0
let spent = false
const recent: number[] = []

function setIndex(i: number) {
  if (i === index.value || i < 0 || i >= props.sheets.length) return
  index.value = i
  turns.value++
  const id = props.sheets[i]!.id
  history.replaceState(history.state, '', i === 0 ? location.pathname : `#${id}`)
}

function go(i: number, instant = false) {
  const el = deck.value
  if (!el) return
  const target = Math.max(0, Math.min(props.sheets.length - 1, i))
  aim = instant || still ? -1 : target
  if (wide()) el.scrollTo({ left: target * el.clientWidth, behavior: instant || still ? 'auto' : 'smooth' })
  else document.getElementById(props.sheets[target]!.id)?.scrollIntoView({ behavior: instant || still ? 'auto' : 'smooth' })
}

function onScroll() {
  const el = deck.value
  if (!el || !wide()) return
  setIndex(Math.round(el.scrollLeft / el.clientWidth))
  if (still || !blur.value) return
  // motion blur from the scroll speed, gone as soon as the sheet settles
  const now = performance.now()
  const speed = Math.abs(el.scrollLeft - lastX) / Math.max(1, now - lastT)
  lastX = el.scrollLeft
  lastT = now
  const amount = Math.min(9, speed * 3.2)
  blur.value.setAttribute('stdDeviation', `${amount.toFixed(1)} 0`)
  el.classList.toggle('moving', amount > 0.6)
  clearTimeout(settle)
  settle = window.setTimeout(() => {
    blur.value?.setAttribute('stdDeviation', '0 0')
    el.classList.remove('moving')
    aim = -1
  }, 90)
}

/** Turns one sheet from where the deck is heading, not from where it is right now. */
function step(by: number) {
  go((aim >= 0 ? aim : index.value) + by)
}

// One gesture turns one sheet. A touchpad keeps sending ever weaker events for a second after
// the fingers let go; those belong to the same gesture. A pause ends it, and so does a clearly
// stronger push in the middle of the fade, which is a new swipe.
function onWheel(e: WheelEvent) {
  if (!wide() || e.ctrlKey) return
  e.preventDefault()
  // the language switch is re-lettering the sheet in view: this gesture is spent on it
  if (isRelettering()) {
    spent = true
    wheelAt = performance.now()
    return
  }
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
  const d = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit
  const strength = Math.abs(d)
  const now = performance.now()
  if (now - wheelAt > 180) {
    spent = false
    recent.length = 0
  }
  wheelAt = now
  const fading = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0
  recent.push(strength)
  if (recent.length > 5) recent.shift()
  if (spent && now - stepAt > 450 && strength > fading * 1.6 + 6) spent = false
  if (spent || strength < 4) return
  spent = true
  stepAt = now
  step(Math.sign(d))
}

function onKey(e: KeyboardEvent) {
  if (!wide() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
  if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  const moves: Record<string, number> = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }
  if ((e.key in moves || e.key === 'Home' || e.key === 'End') && isRelettering()) {
    e.preventDefault()
  } else if (e.key in moves) {
    e.preventDefault()
    step(moves[e.key]!)
  } else if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault()
    go(e.key === 'Home' ? 0 : props.sheets.length - 1)
  }
}

onMounted(() => {
  goTo.value = (i: number) => go(i)
  if (ink.value && deck.value) inkPage.value = { canvas: ink.value, host: deck.value }
  addEventListener('keydown', onKey)
  addEventListener('wheel', onWheel, { passive: false })
  // phones: the sheet in the middle of the screen counts as current
  io = new IntersectionObserver(
    (entries) => {
      if (wide()) return
      for (const entry of entries) {
        if (entry.isIntersecting) setIndex(props.sheets.findIndex((s) => s.id === entry.target.id))
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  deck.value?.querySelectorAll('.sheet').forEach((s) => io?.observe(s))
  // the router may still be busy with the address, so the route's hash counts too
  const hash = location.hash || route.hash
  const start = props.sheets.findIndex((s) => `#${s.id}` === hash)
  requestAnimationFrame(() => {
    if (start > 0) go(start, true)
    // the browser may already have jumped to the anchor, then no scroll event follows
    const el = deck.value
    if (el && wide()) setIndex(Math.round(el.scrollLeft / el.clientWidth))
    else if (start > 0) setIndex(start)
  })
})

onBeforeUnmount(() => {
  goTo.value = null
  if (inkPage.value?.canvas === ink.value) inkPage.value = null
  removeEventListener('keydown', onKey)
  removeEventListener('wheel', onWheel)
  io?.disconnect()
  clearTimeout(settle)
})
</script>

<template>
  <main id="main" ref="deck" class="deck" tabindex="-1" @scroll.passive="onScroll">
    <slot />
    <!-- the ink that belongs to elements: it scrolls with them, so it never lags behind -->
    <canvas ref="ink" class="ink-page" aria-hidden="true" />
  </main>
  <DeckPager />
  <svg class="fx" aria-hidden="true" width="0" height="0">
    <filter id="deck-blur" x="-4%" y="0" width="108%" height="100%" color-interpolation-filters="sRGB">
      <feGaussianBlur ref="blur" stdDeviation="0 0" />
    </filter>
  </svg>
</template>

<style scoped>
.deck {
  position: relative;
  z-index: 2;
  outline: none;
}

.ink-page {
  position: absolute;
  z-index: 3;
  left: 0;
  top: 0;
  pointer-events: none;
  image-rendering: pixelated;
}

.fx {
  position: absolute;
  width: 0;
  height: 0;
}

@media (min-width: 768px) {
  .deck {
    display: flex;
    height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .deck::-webkit-scrollbar {
    display: none;
  }

  /* the sheets blur while they move, the ink stays sharp */
  .deck.moving > :deep(.sheet) {
    filter: url(#deck-blur);
  }
}
</style>
