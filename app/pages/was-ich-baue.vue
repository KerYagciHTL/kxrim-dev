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

const title = t('meta.buildTitle')
const route = useRoute()
const homeUrl = `${SITE}${localePath('/')}`
usePageSeo({
  title,
  description: t('meta.buildDescription'),
  image: `og-build-${locale.value}.png`,
  imageAlt: title,
  schema: buildGraph(locale.value as Locale, `${SITE}${route.path}`, title, homeUrl),
})
</script>

<template>
  <Deck :key="locale" :sheets="sheets">
    <BuildIntroSheet />
    <AreaSheet v-for="area in areas" :key="area.id" :area="area" />
    <StepsSheet />
    <ContactSheet :text="buildContact.text" />
  </Deck>
</template>
