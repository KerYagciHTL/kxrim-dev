<script setup lang="ts">
// Start of "Was ich baue": the three areas as one small manga page, each panel turns to its sheet.
import { areas, buildIntro } from '~~/content/build'

const { t } = useI18n()
const tx = useText()
const { go } = useDeck()
</script>

<template>
  <Sheet id="start" :label="t('sheet.start')" class="build-intro">
    <div class="hello" data-ink-safe>
      <h1>{{ tx(buildIntro.title) }}</h1>
      <p class="lead">{{ tx(buildIntro.lead) }}</p>
    </div>

    <nav class="panels" data-ink="right bottom seal" :aria-label="t('nav.pages')">
      <a
        v-for="(area, i) in areas"
        :key="area.id"
        :href="`#${area.id}`"
        class="koma panel"
        :class="`p${i + 1}`"
        @click.prevent="go(area.id)"
      >
        <span class="label">{{ tx(area.kind) }}</span>
        <span class="name">{{ tx(area.title) }}</span>
      </a>
    </nav>
  </Sheet>
</template>

<style scoped>
.build-intro {
  align-content: center;
  grid-template-columns: minmax(0, 1fr);
}

.hello {
  display: grid;
  gap: 20px;
}

h1 {
  font-size: clamp(48px, 13vw, 120px);
  line-height: 0.95;
}

.lead {
  max-width: 32em;
  font-size: 17px;
}

.panels {
  display: grid;
  gap: 10px;
}

.panel {
  display: grid;
  align-content: end;
  gap: 6px;
  padding: 16px 18px;
  text-decoration: none;
  min-height: 92px;
}

.panel .name {
  font: 400 22px/1.1 var(--font-display);
  hyphens: auto;
  overflow-wrap: break-word;
}

.panel:hover .name {
  text-decoration: underline;
  text-decoration-thickness: 3px;
}

.p1 .label,
.p1 .name,
.p3 .label,
.p3 .name {
  justify-self: start;
  padding: 2px 6px;
  background: var(--paper);
}

.p1 {
  background-image: radial-gradient(circle, var(--ink) 0.9px, transparent 1.2px);
  background-size: 6px 6px;
}

.p3 {
  background-image: radial-gradient(circle, var(--ink) 1.3px, transparent 1.6px);
  background-size: 5px 5px;
}

@media (min-width: 768px) {
  .build-intro {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    column-gap: clamp(40px, 5vw, 72px);
    align-items: center;
  }

  h1 {
    font-size: clamp(56px, min(7vw, 13vh), 120px);
  }

  .lead {
    font-size: 19px;
  }

  .panels {
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: minmax(150px, 22vh) minmax(150px, 22vh);
  }

  .p1 {
    grid-row: 1 / span 2;
  }

  .panel .name {
    font-size: clamp(18px, min(1.7vw, 3.4vh), 28px);
  }
}
</style>
