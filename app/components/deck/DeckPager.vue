<script setup lang="ts">
// Page numbers at the bottom, like the folio of a manga page. The current one is inked.
// Phones get a compact folio instead: previous, "3 / 8", next; the number opens a list of all
// pages plus the link to the other part of the site.
const { sheets, index, go } = useDeck()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const onBuild = computed(() => String(route.name ?? '').startsWith('was-ich-baue'))
const open = ref(false)
const folio = ref<HTMLElement>()
const pad = (n: number) => String(n).padStart(2, '0')

function jump(i: number) {
  open.value = false
  go(i)
}

function outside(e: Event) {
  if (open.value && !folio.value?.contains(e.target as Node)) open.value = false
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (open.value = false)

onMounted(() => {
  document.addEventListener('pointerdown', outside)
  addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  removeEventListener('keydown', onKey)
})
</script>

<template>
  <nav class="pager" :aria-label="t('nav.pages')" data-ink-safe>
    <ol>
      <li v-for="(sheet, i) in sheets" :key="sheet.id">
        <button
          type="button"
          :aria-current="i === index ? 'true' : undefined"
          :aria-label="`${i + 1}: ${sheet.label}`"
          @click="go(i)"
        >
          {{ i + 1 }}
          <span class="tip" aria-hidden="true">{{ sheet.label }}</span>
        </button>
      </li>
    </ol>
  </nav>

  <nav ref="folio" class="folio" :aria-label="t('nav.pages')" data-ink-safe>
    <div v-if="open" id="folio-list" class="list">
      <ol>
        <li v-for="(sheet, i) in sheets" :key="sheet.id">
          <button type="button" :aria-current="i === index ? 'true' : undefined" @click="jump(i)">
            <span class="no">{{ pad(i + 1) }}</span>{{ sheet.label }}
          </button>
        </li>
      </ol>
      <NuxtLink class="other" :to="onBuild ? localePath('/') : localePath('was-ich-baue')" @click="open = false">
        {{ onBuild ? t('nav.portfolio') : t('nav.build') }}
      </NuxtLink>
    </div>
    <button type="button" class="step" :aria-label="t('nav.prev')" :disabled="index === 0" @click="go(index - 1)">
      <svg viewBox="0 0 4 7" shape-rendering="crispEdges" aria-hidden="true"><rect x="3" y="0" width="1" height="1" /><rect x="2" y="1" width="1" height="1" /><rect x="1" y="2" width="1" height="1" /><rect x="0" y="3" width="1" height="1" /><rect x="1" y="4" width="1" height="1" /><rect x="2" y="5" width="1" height="1" /><rect x="3" y="6" width="1" height="1" /></svg>
    </button>
    <button type="button" class="count" :aria-label="t('nav.contents')" :aria-expanded="open" aria-controls="folio-list" @click="open = !open">
      {{ pad(index + 1) }} / {{ pad(sheets.length) }}
    </button>
    <button type="button" class="step" :aria-label="t('nav.next')" :disabled="index === sheets.length - 1" @click="go(index + 1)">
      <svg viewBox="0 0 4 7" shape-rendering="crispEdges" aria-hidden="true"><rect x="0" y="0" width="1" height="1" /><rect x="1" y="1" width="1" height="1" /><rect x="2" y="2" width="1" height="1" /><rect x="3" y="3" width="1" height="1" /><rect x="2" y="4" width="1" height="1" /><rect x="1" y="5" width="1" height="1" /><rect x="0" y="6" width="1" height="1" /></svg>
    </button>
  </nav>
</template>

<style scoped>
.pager {
  position: fixed;
  z-index: 6;
  bottom: calc(var(--trim) + 12px);
  left: 50%;
  transform: translateX(-50%);
}

ol {
  display: flex;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

button {
  position: relative;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 2px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  font: 400 14px/1 var(--font-dot);
  cursor: pointer;
}

button[aria-current='true'] {
  background: var(--ink);
  color: var(--paper);
  box-shadow: inset 0 -4px 0 var(--red);
}

.tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 8px;
  border: 2px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  white-space: nowrap;
  font: 400 13px/1 var(--font-dot);
  visibility: hidden;
}

button:hover .tip,
button:focus-visible .tip {
  visibility: visible;
}

.folio {
  display: none;
}

@media (max-width: 767px) {
  .pager {
    display: none;
  }

  .folio {
    position: fixed;
    z-index: 6;
    bottom: calc(env(safe-area-inset-bottom, 0px) + var(--trim) + 10px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    background: var(--paper);
  }

  .folio > button {
    width: 44px;
    height: 40px;
    display: grid;
    place-items: center;
  }

  .folio > button + button {
    border-left-width: 0;
  }

  .folio .count {
    width: auto;
    padding: 0 12px;
    font-size: 15px;
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
  }

  .folio .count[aria-expanded='true'] {
    background: var(--ink);
    color: var(--paper);
  }

  .step svg {
    width: 8px;
    height: 14px;
  }

  .step rect {
    fill: currentColor;
  }

  .step:disabled {
    color: var(--soft);
    cursor: default;
  }

  .list {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: min(280px, calc(100vw - 40px));
    max-height: 62vh;
    overflow-y: auto;
    padding: 8px;
    border: 2px solid var(--ink);
    background: var(--paper);
    box-shadow: 4px 4px 0 var(--ink);
  }

  .list ol {
    display: grid;
    gap: 2px;
  }

  .list button {
    display: flex;
    align-items: baseline;
    gap: 12px;
    width: 100%;
    height: auto;
    padding: 9px 10px;
    border: 0;
    text-align: left;
    font: 500 16px/1.2 var(--font-body);
  }

  .list button[aria-current='true'] {
    box-shadow: inset 4px 0 0 var(--red);
  }

  .list .no {
    font: 400 13px/1 var(--font-dot);
    color: inherit;
    opacity: 0.7;
  }

  .other {
    display: block;
    margin-top: 6px;
    padding: 11px 10px 9px;
    border-top: 1px solid var(--guide-soft);
    font: 700 15px/1.2 var(--font-body);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
}
</style>
