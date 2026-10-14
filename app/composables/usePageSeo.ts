// Title, description, link preview and JSON-LD for one page. Reactive, because switching the
// language keeps the page on screen and only swaps its text.
// Canonical, hreflang and og:locale come from @nuxtjs/i18n in the layout.
import { SITE } from '~/utils/schema'

interface PageSeo {
  title: string
  description: string
  /** file in public/, e.g. og-de.png */
  image: string
  imageAlt: string
  type?: 'website' | 'profile'
  schema?: object
}

export function usePageSeo(source: () => PageSeo) {
  const route = useRoute()
  const page = computed(source)
  const url = computed(() => `${SITE}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`)
  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
    ogTitle: () => page.value.title,
    ogDescription: () => page.value.description,
    ogType: () => page.value.type ?? 'website',
    ogUrl: () => url.value,
    ogSiteName: 'Kerimcan Yagci',
    ogImage: () => `${SITE}/${page.value.image}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => page.value.imageAlt,
    twitterCard: 'summary_large_image',
  })
  useHead(() => ({
    script: page.value.schema ? [{ type: 'application/ld+json', key: 'schema', innerHTML: JSON.stringify(page.value.schema) }] : [],
  }))
  return { url }
}
