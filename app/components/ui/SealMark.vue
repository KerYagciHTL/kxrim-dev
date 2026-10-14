<script setup lang="ts">
// The mark next to the name: the turning seal from ink/mark.ts. The server renders its first
// frame as SVG; once the page runs, a canvas takes over and keeps it turning.
import { MARK, PixelBuffer, drawMark, markRuns } from '~/ink/mark'

const runs = markRuns()
const live = ref(false)
const canvas = ref<HTMLCanvasElement>()
const { theme } = useTheme()
let buf: PixelBuffer | null = null
let colours = { ink: '#151515', paper: '#f5f4ef' }
let timer = 0
let step = 0

function readColours() {
  const css = getComputedStyle(document.documentElement)
  colours = { ink: css.getPropertyValue('--ink').trim(), paper: css.getPropertyValue('--paper').trim() }
}

const paint = () => buf && drawMark(buf, step, colours.ink, colours.paper)

onMounted(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  live.value = true
  await nextTick()
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  buf = new PixelBuffer(ctx)
  buf.resize(MARK.size, MARK.size)
  readColours()
  paint()
  timer = window.setInterval(() => {
    if (document.hidden) return
    step++
    paint()
  }, 1000 / MARK.fps)
})

watch(theme, () =>
  nextTick(() => {
    readColours()
    paint()
  }),
)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <canvas v-if="live" ref="canvas" class="mark" aria-hidden="true" />
  <svg v-else class="mark" :viewBox="`0 0 ${MARK.size} ${MARK.size}`" shape-rendering="crispEdges" aria-hidden="true">
    <rect v-for="(r, i) in runs" :key="i" :x="r.x" :y="r.y" :width="r.w" height="1" />
  </svg>
</template>

<style scoped>
/* two CSS pixels per art pixel: the avatar's seal at half its size */
.mark {
  display: block;
  width: 40px;
  height: 40px;
  image-rendering: pixelated;
}

rect {
  fill: currentColor;
}
</style>
