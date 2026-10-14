<script setup lang="ts">
import type { Area } from '~~/content/types'

const props = defineProps<{ area: Area }>()
const tx = useText()
const shot = computed(() => (props.area.shot ? mediaOf(props.area.shot.media) : null))
</script>

<template>
  <Sheet :id="area.id" :label="tx(area.title)" class="area">
    <div class="visual">
      <div v-if="area.shot && shot" class="frame" data-ink="left top">
        <img
          :src="shot.src"
          :srcset="srcsetOf(shot)"
          sizes="(min-width: 768px) 56vw, 100vw"
          :width="shot.width"
          :height="shot.height"
          :alt="tx(area.shot.alt)"
          loading="lazy"
        />
      </div>
      <div v-else-if="area.flow" data-ink="left top">
        <FlowDiagram :steps="area.flow" />
      </div>
    </div>

    <div class="text" data-ink-safe>
      <p class="label">{{ tx(area.kind) }}</p>
      <h2>{{ tx(area.title) }}</h2>
      <p class="summary">{{ tx(area.text) }}</p>
      <ul v-if="area.tags.length" class="tags label">
        <li v-for="tag in area.tags" :key="tag">{{ tag }}</li>
      </ul>
      <div v-if="area.examples" class="links">
        <a v-for="link in area.examples" :key="link.href" class="btn" :href="link.href" target="_blank" rel="noopener">{{ tx(link.label) }}</a>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.area {
  align-content: center;
  grid-template-columns: minmax(0, 1fr);
}

.frame {
  border: var(--border) solid var(--ink);
  overflow: hidden;
  background: #0b0d14;
}

.frame img {
  width: 100%;
  height: auto;
}

.text {
  display: grid;
  gap: 14px;
  align-content: start;
  min-width: 0;
}

h2 {
  font-size: clamp(36px, 10vw, 72px);
  line-height: 0.98;
}

.summary {
  max-width: 34em;
  font-size: 16.5px;
  line-height: 1.62;
}

.tags {
  display: flex;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 768px) {
  .area {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    column-gap: clamp(36px, 4.5vw, 64px);
    align-items: center;
  }

  .frame img {
    max-height: 58vh;
    object-fit: cover;
    object-position: top left;
  }

  h2 {
    font-size: clamp(40px, min(4.8vw, 9vh), 72px);
  }
}
</style>
