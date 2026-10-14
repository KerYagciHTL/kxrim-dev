<script setup lang="ts">
import { PAPER, THEME_KEY } from '~/composables/useTheme'

// a saved theme is applied before the first paint, so dark visitors never see a light flash
useHead({
  script: [
    {
      key: 'theme',
      tagPosition: 'head',
      innerHTML: `try{var t=localStorage.getItem('${THEME_KEY}'),c={light:'${PAPER.light}',dark:'${PAPER.dark}',rain:'${PAPER.rain}'}[t];if(c){document.documentElement.dataset.theme=t;document.querySelectorAll('meta[name=theme-color]').forEach(function(m){m.content=c})}}catch(e){}`,
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
