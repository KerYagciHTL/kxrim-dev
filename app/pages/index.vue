<script setup lang="ts">
import { contact } from '~~/content/profile'
import { work } from '~~/content/work'
import type { Locale } from '~~/content/types'

const { t, locale } = useI18n()

const sheets = computed(() => [
  { id: 'start', label: t('sheet.start') },
  ...work.map((w) => ({ id: w.id, label: w.name })),
  { id: 'record', label: t('sheet.record') },
  { id: 'contact', label: t('sheet.contact') },
])

// the same page in both languages: switching keeps it on screen and only swaps the text
definePageMeta({ key: 'home' })
const route = useRoute()
usePageSeo(() => {
  const title = t('meta.homeTitle')
  return {
    title,
    description: t('meta.homeDescription'),
    image: `og-${locale.value}.png`,
    imageAlt: title,
    type: 'profile',
    schema: homeGraph(locale.value as Locale, `${SITE}${route.path}`, title),
  }
})
</script>

<template>
  <Deck :sheets="sheets">
    <IntroSheet />
    <WorkSheet v-for="item in work" :key="item.id" :item="item" />
    <RecordSheet />
    <ContactSheet :text="contact.text" />
  </Deck>
</template>
