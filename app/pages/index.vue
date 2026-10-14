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

const title = t('meta.homeTitle')
const route = useRoute()
const url = `${SITE}${route.path === '/' ? '/' : route.path}`
usePageSeo({
  title,
  description: t('meta.homeDescription'),
  image: `og-${locale.value}.png`,
  imageAlt: title,
  type: 'profile',
  schema: homeGraph(locale.value as Locale, url, title),
})
</script>

<template>
  <Deck :key="locale" :sheets="sheets">
    <IntroSheet />
    <WorkSheet v-for="item in work" :key="item.id" :item="item" />
    <RecordSheet />
    <ContactSheet :text="contact.text" />
  </Deck>
</template>
