<script setup lang="ts">
// Three boxes and two arrows: how a web app reaches people, or how a tool moves data.
import type { Text } from '~~/content/types'

defineProps<{ steps: Text[] }>()
const tx = useText()
</script>

<template>
  <ol class="flow koma tone">
    <template v-for="(step, i) in steps" :key="i">
      <li class="box node">{{ tx(step) }}</li>
      <li v-if="i < steps.length - 1" class="arrow" aria-hidden="true">
        <svg viewBox="0 0 12 7" shape-rendering="crispEdges">
          <rect x="0" y="3" width="9" height="1" /><rect x="7" y="1" width="1" height="5" /><rect x="8" y="2" width="1" height="3" />
          <rect x="9" y="3" width="1" height="1" />
        </svg>
      </li>
    </template>
  </ol>
</template>

<style scoped>
.flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: clamp(24px, 5vh, 52px) 18px;
  list-style: none;
}

.node {
  min-width: 11em;
  padding: 14px 16px;
  text-align: center;
  font: 400 clamp(16px, 1.7vw, 22px) / 1.1 var(--font-display);
  white-space: nowrap;
}

.arrow {
  padding: 4px;
  background: var(--paper);
  border: 2px solid var(--ink);
}

.arrow svg {
  display: block;
  width: 30px;
  height: 18px;
  transform: rotate(90deg);
}

.arrow rect {
  fill: var(--ink);
}
</style>
