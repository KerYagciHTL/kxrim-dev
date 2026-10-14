<script setup lang="ts">
// Hosts the screen layer of the ink (cursed seal, crows or rain, by theme) and the screentone
// under it; the deck brings the second layer that scrolls with the sheets.
import { InkEngine } from '~/ink/engine'

const ink = ref<HTMLCanvasElement>()
const tone = ref<HTMLCanvasElement>()
const { turns, inkPage } = useDeck()
const { theme, read } = useTheme()
let engine: InkEngine | null = null
let frame = 0

// scrolling only moves the screen layer's text gaps and the rain; the page layer moves by itself
const redraw = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => engine?.renderScreen())
}
const refresh = () => engine?.refresh()
const resized = () => engine?.resized()

onMounted(() => {
  if (!ink.value || !tone.value) return
  read()
  engine = new InkEngine(ink.value, tone.value)
  engine.attachPage(inkPage.value?.canvas ?? null, inkPage.value?.host ?? null)
  engine.start()
  addEventListener('resize', resized)
  addEventListener('scroll', redraw, { passive: true, capture: true })
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    read()
    refresh()
  })
})

watch(turns, () => engine?.sheetChanged())
watch(inkPage, (p) => engine?.attachPage(p?.canvas ?? null, p?.host ?? null))
watch(theme, () => nextTick(refresh))

onBeforeUnmount(() => {
  engine?.stop()
  removeEventListener('resize', resized)
  removeEventListener('scroll', redraw, { capture: true })
})
</script>

<template>
  <canvas ref="tone" class="tone-layer" aria-hidden="true" />
  <canvas ref="ink" class="ink-layer" aria-hidden="true" />
</template>

<style scoped>
/* hung from the bottom with a size the engine sets, so a phone toolbar moves it, never stretches it */
canvas {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tone-layer {
  z-index: 0;
}

.ink-layer {
  z-index: 4;
  image-rendering: pixelated;
}
</style>
