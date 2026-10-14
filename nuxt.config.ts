// yagci.cc: prerendered with `nuxt generate`, served as static files.
// German lives on `/`, English on `/en`.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  css: ['~/assets/css/fonts.css', '~/assets/css/tokens.css', '~/assets/css/base.css'],

  // components are used by their file name, without folder prefixes
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      meta: [
        { name: 'author', content: 'Kerimcan Yagci' },
        { name: 'theme-color', content: '#f5f4ef', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#141312', media: '(prefers-color-scheme: dark)' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/dela-gothic-one-400-latin.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/zen-kaku-gothic-new-400-latin.woff2', crossorigin: '' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'me', href: 'https://github.com/KerYagciHTL' },
        { rel: 'me', href: 'https://www.linkedin.com/in/kerimcan-yagci-872a2143a/' },
      ],
    },
  },

  site: {
    url: 'https://yagci.cc',
    name: 'Kerimcan Yagci',
    trailingSlash: false,
  },

  i18n: {
    baseUrl: 'https://yagci.cc',
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
    ],
    // no automatic redirects: Google should see both languages on their own URLs
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'was-ich-baue': { de: '/was-ich-baue', en: '/what-i-build' },
    },
  },

  sitemap: {
    xslColumns: [{ label: 'URL', width: '50%' }, { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' }],
  },

  robots: {
    groups: [{ userAgent: '*', allow: '/' }],
  },

  nitro: {
    prerender: {
      routes: ['/', '/en', '/was-ich-baue', '/en/what-i-build', '/404.html'],
      crawlLinks: true,
    },
  },

  typescript: { strict: true },
})
