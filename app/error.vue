<script setup lang="ts">
// 404 and other errors, on the same manuscript sheet as the rest of the site.
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: t('meta.notFoundTitle'), robots: 'noindex' })
const code = computed(() => props.error.statusCode ?? 404)
</script>

<template>
  <NuxtLayout>
    <main id="main" class="lost">
      <p class="code" aria-hidden="true">{{ code }}</p>
      <div class="box text" data-ink-safe>
        <h1>{{ t('notFound.title') }}</h1>
        <p>{{ t('notFound.text') }}</p>
        <NuxtLink class="btn" :to="localePath('/')" @click="clearError()">{{ t('notFound.back') }}</NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped>
.lost {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 18px;
  padding: 120px 28px 80px;
  text-align: center;
}

.code {
  font: 400 clamp(110px, 24vw, 260px)/0.9 var(--font-display);
}

.text {
  display: grid;
  gap: 12px;
  justify-items: center;
  max-width: 30em;
  padding: 20px 24px;
}

h1 {
  font-size: 26px;
}
</style>
