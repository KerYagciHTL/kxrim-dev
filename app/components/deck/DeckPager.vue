<script setup lang="ts">
// Page numbers at the bottom, like the folio of a manga page. The current one is inked.
const { sheets, index, go } = useDeck()
const { t } = useI18n()
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

@media (max-width: 767px) {
  .pager {
    display: none;
  }
}
</style>
