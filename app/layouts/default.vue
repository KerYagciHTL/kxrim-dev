<script setup lang="ts">
// The page chrome every page shares: manuscript frame, screentone, pixel ink and the top bar.
const head = useLocaleHead()
useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
}))
const { t } = useI18n()
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
    <InkLayer />
    <TopBar />
    <slot />
  </div>
</template>
