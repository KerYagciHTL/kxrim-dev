<script setup lang="ts">
import { THEME_KEY } from '~/composables/useTheme'

// a saved theme is applied before the first paint, so dark visitors never see a light flash
useHead({
  script: [
    {
      key: 'theme',
      tagPosition: 'head',
      innerHTML: `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`,
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
