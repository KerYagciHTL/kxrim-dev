<script setup lang="ts">
import { areas, buildContact, buildIntro } from '~~/content/build'
import type { Locale } from '~~/content/types'

const { t, locale } = useI18n()
const tx = useText()
const localePath = useLocalePath()

const sheets = computed(() => [
  { id: 'start', label: tx(buildIntro.title) },
  ...areas.map((a) => ({ id: a.id, label: tx(a.title) })),
  { id: 'steps', label: t('sheet.steps') },
  { id: 'contact', label: t('sheet.contact') },
])

// the same page in both languages: switching keeps it on screen and only swaps the text
definePageMeta({ key: 'build' })
const route = useRoute()
usePageSeo(() => {
  const title = t('meta.buildTitle')
  return {
    title,
    description: t('meta.buildDescription'),
    image: `og-build-${locale.value}.png`,
    imageAlt: title,
    schema: buildGraph(locale.value as Locale, `${SITE}${route.path}`, title, `${SITE}${localePath('/')}`),
  }
})
</script>

<template>
  <Deck :sheets="sheets">
    <BuildIntroSheet />
    <AreaSheet v-for="area in areas" :key="area.id" :area="area" />
    <StepsSheet />
    <ContactSheet :text="buildContact.text" />
  </Deck>
</template>
