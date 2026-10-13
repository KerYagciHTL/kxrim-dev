// Title, description, link preview and JSON-LD for one page.
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

export function usePageSeo(page: PageSeo) {
  const route = useRoute()
  const url = `${SITE}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`
  useSeoMeta({
    title: page.title,
    description: page.description,
    ogTitle: page.title,
    ogDescription: page.description,
    ogType: page.type ?? 'website',
    ogUrl: url,
    ogSiteName: 'Kerimcan Yagci',
    ogImage: `${SITE}/${page.image}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: page.imageAlt,
    twitterCard: 'summary_large_image',
  })
  if (page.schema) {
    useHead({ script: [{ type: 'application/ld+json', key: 'schema', innerHTML: JSON.stringify(page.schema) }] })
  }
  return { url }
}
