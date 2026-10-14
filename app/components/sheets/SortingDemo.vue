<script setup lang="ts">
// The three sorting runs from the SortingVisualizer README. A still first frame until someone presses play.
import type { Demo } from '~~/content/types'

const props = defineProps<{ demos: Demo[] }>()
const { t } = useI18n()
const current = ref(0)
const playing = ref(false)
const entry = computed(() => mediaOf(props.demos[current.value]!.media))

function pick(i: number) {
  current.value = i
}
</script>

<template>
  <div class="demo">
    <div class="frame" data-ink="left top">
      <img
        :src="playing ? entry.src : entry.poster"
        :width="entry.width"
        :height="entry.height"
        :alt="`${t('work.demo')}: ${demos[current]!.label}`"
        loading="lazy"
      />
    </div>
    <div class="controls" data-ink-safe>
      <div class="tabs" role="group" :aria-label="t('work.demo')">
        <button
          v-for="(d, i) in demos"
          :key="d.media"
          type="button"
          :aria-pressed="i === current"
          @click="pick(i)"
        >
          {{ d.label }}
        </button>
      </div>
      <button type="button" class="btn play" :aria-pressed="playing" @click="playing = !playing">
        {{ playing ? t('work.stop') : t('work.play') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
}

.frame {
  border: var(--border) solid var(--ink);
  background: #000;
  aspect-ratio: 16 / 9;
}

.frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  border: 2px solid var(--ink);
}

.tabs button {
  padding: 8px 10px;
  border: 0;
  background: var(--paper);
  color: var(--ink);
  font: 400 13.5px/1 var(--font-dot);
  white-space: nowrap;
  cursor: pointer;
}

.tabs button[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

.play {
  font-size: 14px;
  padding: 8px 12px;
}
</style>
