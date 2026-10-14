<script setup lang="ts">
// The pixel mark next to the name, drawn by ink/mark.ts, with its idle loop.
import { MARK, PixelBuffer, drawMark } from '~/ink/mark'

const canvas = ref<HTMLCanvasElement>()
const { dark } = useTheme()
let buf: PixelBuffer | null = null
let timer = 0
let step = 0

function paint() {
  if (!buf || !canvas.value) return
  const css = getComputedStyle(canvas.value)
  const v = (name: string) => css.getPropertyValue(name).trim()
  drawMark(buf, step, v('--ink'), v('--red'))
}

onMounted(() => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  buf = new PixelBuffer(ctx)
  buf.resize(MARK.size, MARK.size)
  paint()
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(() => {
    if (document.hidden) return
    step++
    paint()
  }, 1000 / MARK.fps)
})

watch(dark, () => nextTick(paint))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <canvas ref="canvas" class="mark" aria-hidden="true" />
</template>

<style scoped>
.mark {
  display: block;
  width: 40px;
  height: 40px;
  image-rendering: pixelated;
}
</style>
