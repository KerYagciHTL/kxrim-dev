<script setup lang="ts">
// Mark and name (a breadcrumb on the second page), the link to the other page, language and theme.
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const onBuild = computed(() => String(route.name ?? '').startsWith('was-ich-baue'))
const { dark, toggle } = useTheme()

// the language links re-letter the page in place instead of loading the other one
async function switchLanguage(e: MouseEvent) {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[hreflang]')
  if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  const code = link.hreflang as 'de' | 'en'
  if (code === locale.value) return
  const hash = location.hash
  await reletter(async () => {
    await navigateTo(switchLocalePath(code))
    if (hash) history.replaceState(history.state, '', location.pathname + hash)
  })
}
</script>

<template>
  <header class="top" data-ink-safe>
    <nav class="crumbs" :aria-label="t('nav.pages')">
      <NuxtLink class="home" :to="localePath('/')" :aria-label="t('nav.home')">
        <SealMark />
        <span translate="no">Kerimcan Yagci</span>
      </NuxtLink>
      <template v-if="onBuild">
        <span class="sep" aria-hidden="true">/</span>
        <span class="here" aria-current="page">{{ t('nav.build') }}</span>
      </template>
    </nav>
    <div class="tools">
      <NuxtLink v-if="!onBuild" class="other" :to="localePath('was-ich-baue')">{{ t('nav.build') }}</NuxtLink>
      <NuxtLink v-else class="other" :to="localePath('/')">{{ t('nav.portfolio') }}</NuxtLink>
      <div class="seg" role="group" :aria-label="t('nav.language')" translate="no" @click.capture="switchLanguage">
        <NuxtLink :to="switchLocalePath('de')" hreflang="de" lang="de" :aria-current="locale === 'de' ? 'true' : undefined">DE</NuxtLink>
        <NuxtLink :to="switchLocalePath('en')" hreflang="en" lang="en" :aria-current="locale === 'en' ? 'true' : undefined">EN</NuxtLink>
      </div>
      <button type="button" class="seg theme" :aria-label="t('nav.theme')" :aria-pressed="dark" :title="t('nav.theme')" @click="toggle">
        <svg viewBox="0 0 7 7" shape-rendering="crispEdges" aria-hidden="true">
          <template v-if="!dark">
            <rect x="2" y="0" width="3" height="1" /><rect x="1" y="1" width="2" height="1" /><rect x="0" y="2" width="2" height="3" />
            <rect x="1" y="5" width="2" height="1" /><rect x="2" y="6" width="3" height="1" /><rect x="5" y="5" width="1" height="1" />
          </template>
          <template v-else>
            <rect x="2" y="2" width="3" height="3" /><rect x="3" y="0" width="1" height="1" /><rect x="3" y="6" width="1" height="1" />
            <rect x="0" y="3" width="1" height="1" /><rect x="6" y="3" width="1" height="1" /><rect x="1" y="1" width="1" height="1" />
            <rect x="5" y="1" width="1" height="1" /><rect x="1" y="5" width="1" height="1" /><rect x="5" y="5" width="1" height="1" />
          </template>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.top {
  position: fixed;
  z-index: 6;
  top: calc(var(--trim) + 14px);
  left: var(--inner);
  right: var(--inner);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font: 700 15px/1 var(--font-body);
}

.home {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  white-space: nowrap;
}

.sep {
  color: var(--soft);
  font-weight: 400;
}

.here {
  font-weight: 500;
  white-space: nowrap;
}

.tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.other {
  font: 500 15px/1 var(--font-body);
  text-decoration: none;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 2px;
  margin-right: 6px;
  white-space: nowrap;
}

.seg {
  display: flex;
  border: 2px solid var(--ink);
  background: var(--paper);
  font: 400 14px/1 var(--font-dot);
}

.seg a {
  padding: 5px 8px;
  text-decoration: none;
}

.seg a[aria-current='true'] {
  background: var(--ink);
  color: var(--paper);
}

.theme {
  padding: 5px 7px;
  color: var(--ink);
  cursor: pointer;
}

.theme svg {
  display: block;
  width: 14px;
  height: 14px;
}

.theme rect {
  fill: currentColor;
}

@media (max-width: 767px) {
  .top {
    position: absolute;
    top: 34px;
    left: 28px;
    right: 28px;
  }

  .other,
  .crumbs .sep,
  .crumbs .here {
    display: none;
  }
}
</style>
