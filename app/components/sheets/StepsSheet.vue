<script setup lang="ts">
// The three steps are a real sequence, so they carry numbers.
import { steps } from '~~/content/build'

const { t } = useI18n()
const tx = useText()
</script>

<template>
  <Sheet id="steps" :label="t('sheet.steps')" class="steps">
    <h2 data-ink-safe>{{ tx(steps.title) }}</h2>
    <ol>
      <li
        v-for="(step, i) in steps.list"
        :key="i"
        class="koma step"
        :class="{ tone: i === 1 }"
        :data-ink="i === steps.list.length - 1 ? 'right bottom' : undefined"
      >
        <div class="box inner">
          <span class="num" aria-hidden="true">{{ i + 1 }}</span>
          <h3>{{ tx(step.title) }}</h3>
          <p>{{ tx(step.text) }}</p>
        </div>
      </li>
    </ol>
  </Sheet>
</template>

<style scoped>
.steps {
  align-content: center;
}

h2 {
  font-size: clamp(40px, 11vw, 76px);
  line-height: 1;
}

ol {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  padding: 12px;
}

.inner {
  display: grid;
  gap: 10px;
  height: 100%;
  padding: 18px 20px 22px;
  border: 0;
}

.tone .inner {
  border: 2px solid var(--ink);
}

.num {
  font: 400 44px/1 var(--font-display);
}

h3 {
  font-size: 26px;
  line-height: 1.1;
}

p {
  font-size: 16px;
  line-height: 1.55;
}

@media (min-width: 768px) {
  .steps {
    row-gap: clamp(20px, 4vh, 36px);
  }

  h2 {
    font-size: clamp(44px, min(5vw, 9vh), 76px);
  }

  ol {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .num {
    font-size: clamp(44px, 5vw, 72px);
  }
}
</style>
