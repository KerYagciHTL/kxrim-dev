<script setup lang="ts">
// One manga page of the deck. Each sheet component sets its own grid on this root.
defineProps<{ id: string; label: string }>()
</script>

<template>
  <section :id="id" class="sheet" :aria-label="label">
    <slot />
  </section>
</template>

<style>
.sheet {
  position: relative;
  padding: 40px 28px 48px;
  display: grid;
  gap: 24px;
}

.sheet:first-of-type {
  padding-top: 104px;
}

/* phones: one long page; each sheet starts under a guide line with its page number, and a
   jump to it stops below the top bar */
@media (max-width: 767px) {
  .deck {
    counter-reset: sheet;
  }

  .sheet {
    counter-increment: sheet;
    scroll-margin-top: 58px;
    padding-top: 52px;
  }

  /* room for the folio at the very end */
  .sheet:last-of-type {
    padding-bottom: 96px;
  }

  .sheet + .sheet::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: var(--guide);
    opacity: 0.6;
  }

  .sheet + .sheet::before {
    content: counter(sheet, decimal-leading-zero);
    position: absolute;
    z-index: 1;
    top: -8px;
    left: 28px;
    padding: 0 6px;
    background: var(--paper);
    color: var(--guide);
    font: 400 13px/16px var(--font-dot);
  }
}

@media (min-width: 768px) {
  .sheet {
    flex: 0 0 100vw;
    height: 100vh;
    padding: calc(var(--inner) + 46px) calc(var(--inner) + 44px) calc(var(--inner) + 50px) !important;
    scroll-snap-align: start;
    overflow: hidden;
  }
}
</style>
