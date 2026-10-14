<script setup lang="ts">
// The page chrome every page shares: manuscript frame, screentone, pixel ink and the top bar.
const head = useLocaleHead()
useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
}))
const { t } = useI18n()

// The avatar is black ink on white. At night it is printed in the theme's own two colours:
// black becomes the ink, white the paper (values as in tokens.css).
const duotones = [
  { id: 'duo-dark', ink: '#ece4d6', paper: '#141312' },
  { id: 'duo-rain', ink: '#dce5e9', paper: '#0e1418' },
].map(({ id, ink, paper }) => {
  const ch = (hex: string, i: number) => (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3)
  return { id, tables: [0, 1, 2].map((i) => `${ch(ink, i)} ${ch(paper, i)}`) }
})
</script>

<template>
  <div class="page">
    <a class="skip" href="#main">{{ t('nav.skip') }}</a>
    <div class="manuscript" aria-hidden="true">
      <span class="ruler-x" />
      <span class="ruler-y" />
      <span class="mark top" />
      <span class="mark bottom" />
      <span class="mark left" />
      <span class="mark right" />
    </div>
    <svg class="filters" aria-hidden="true" width="0" height="0">
      <filter v-for="d in duotones" :id="d.id" :key="d.id" color-interpolation-filters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="table" :tableValues="d.tables[0]" />
          <feFuncG type="table" :tableValues="d.tables[1]" />
          <feFuncB type="table" :tableValues="d.tables[2]" />
        </feComponentTransfer>
      </filter>
    </svg>
    <InkLayer />
    <TopBar />
    <slot />
  </div>
</template>

<style scoped>
.filters {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
