<script setup lang="ts">
// The horizontal deck. Desktop: one sheet per screen, the wheel and the arrow keys turn one sheet,
// and the content gets a horizontal motion blur while it moves. Phones: a plain vertical page.
import type { SheetInfo } from '~/composables/useDeck'

const props = defineProps<{ sheets: SheetInfo[] }>()
const { sheets, index, turns, goTo } = useDeck()
sheets.value = props.sheets
index.value = 0

const deck = ref<HTMLElement>()
const blur = ref<SVGFEGaussianBlurElement>()
const still = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches
const wide = () => innerWidth >= 768

let lastX = 0
let lastT = 0
let settle = 0
let wheelLock = 0
let io: IntersectionObserver | null = null

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
  }, 90)
}

function onWheel(e: WheelEvent) {
  if (!wide()) return
  if ((e.target as HTMLElement).closest('[data-scroll]')) return
  const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
  if (Math.abs(d) < 8) return
  e.preventDefault()
  const now = performance.now()
  if (now - wheelLock < 450) return
  wheelLock = now
  go(index.value + Math.sign(d))
}

function onKey(e: KeyboardEvent) {
  if (!wide() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
  if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  const moves: Record<string, number> = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }
  if (e.key in moves) {
    e.preventDefault()
    go(index.value + moves[e.key]!)
  } else if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault()
    go(e.key === 'Home' ? 0 : props.sheets.length - 1)
  }
}

onMounted(() => {
  goTo.value = (i: number) => go(i)
  addEventListener('keydown', onKey)
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
  const start = props.sheets.findIndex((s) => `#${s.id}` === location.hash)
  if (start > 0) requestAnimationFrame(() => go(start, true))
})

onBeforeUnmount(() => {
  goTo.value = null
  removeEventListener('keydown', onKey)
  io?.disconnect()
  clearTimeout(settle)
})
</script>

<template>
  <main id="main" ref="deck" class="deck" tabindex="-1" @scroll.passive="onScroll" @wheel="onWheel">
    <slot />
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

  .deck.moving {
    filter: url(#deck-blur);
  }
}
</style>
