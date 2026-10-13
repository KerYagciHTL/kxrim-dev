<script setup lang="ts">
// Hosts the pixel layer (cursed seal by day, Amaterasu by night) and the screentone under it.
import { InkEngine } from '~/ink/engine'

const ink = ref<HTMLCanvasElement>()
const tone = ref<HTMLCanvasElement>()
const { turns } = useDeck()
const { dark, read } = useTheme()
let engine: InkEngine | null = null
let frame = 0

const redraw = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => engine?.render())
}
const refresh = () => engine?.refresh()

onMounted(() => {
  if (!ink.value || !tone.value) return
  read()
  engine = new InkEngine(ink.value, tone.value)
  engine.start()
  addEventListener('resize', refresh)
  addEventListener('scroll', redraw, { passive: true, capture: true })
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    read()
    refresh()
  })
})

watch(turns, () => engine?.sheetChanged())
watch(dark, () => nextTick(refresh))

onBeforeUnmount(() => {
  engine?.stop()
  removeEventListener('resize', refresh)
  removeEventListener('scroll', redraw, { capture: true })
})
</script>

<template>
  <canvas ref="tone" class="tone-layer" aria-hidden="true" />
  <canvas ref="ink" class="ink-layer" aria-hidden="true" />
</template>

<style scoped>
canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
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
