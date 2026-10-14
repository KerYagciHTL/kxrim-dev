<script setup lang="ts">
// Mark and name (a breadcrumb on the second page), the link to the other page, language and the
// theme button, which steps through light, dark and rain. On phones the bar stays at the top,
// slides away while reading downwards and comes back as soon as the reader scrolls up.
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const onBuild = computed(() => String(route.name ?? '').startsWith('was-ich-baue'))
const { next, toggle } = useTheme()
const { sheets, index } = useDeck()
const tucked = ref(false)

// pixel icons on a 7 × 7 grid, each showing the theme the button switches to
const ICONS: Record<string, [number, number, number][]> = {
  dark: [[2, 0, 3], [1, 1, 2], [0, 2, 2], [0, 3, 2], [0, 4, 2], [1, 5, 2], [2, 6, 3], [5, 5, 1]],
  rain: [[2, 0, 3], [1, 1, 5], [0, 2, 7], [2, 4, 1], [5, 4, 1], [1, 5, 1], [4, 5, 1], [0, 6, 1], [3, 6, 1]],
  light: [[2, 2, 3], [2, 3, 3], [2, 4, 3], [3, 0, 1], [3, 6, 1], [0, 3, 1], [6, 3, 1], [1, 1, 1], [5, 1, 1], [1, 5, 1], [5, 5, 1]],
}
const themeLabel = computed(() => t('nav.theme', { name: t(`theme.${next.value}`) }))

// the language links re-letter the page in place instead of loading the other one
async function switchLanguage(e: MouseEvent) {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[hreflang]')
  if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  const code = link.hreflang as 'de' | 'en'
  if (code === locale.value) return
  await reletter(async () => {
    await navigateTo(switchLocalePath(code))
    // the sheet in view, which may have changed while the tape was on
    const id = index.value > 0 ? sheets.value[index.value]?.id : undefined
    history.replaceState(history.state, '', location.pathname + (id ? `#${id}` : ''))
  })
}

let lastY = 0
function onScroll() {
  if (innerWidth >= 768) return
  const y = scrollY
  // new text of another length shifts the page a little: that is not the reader scrolling
  if (isRelettering()) {
    lastY = y
    return
  }
  if (Math.abs(y - lastY) < 8) return
  tucked.value = y > lastY && y > 140
  lastY = y
}
onMounted(() => addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="top" :class="{ tucked }" data-ink-safe @focusin="tucked = false">
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
      <button type="button" class="seg theme" :aria-label="themeLabel" :title="themeLabel" @click="toggle">
        <svg viewBox="0 0 7 7" shape-rendering="crispEdges" aria-hidden="true">
          <rect v-for="([x, y, w], i) in ICONS[next]" :key="i" :x="x" :y="y" :width="w" height="1" />
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
    top: 0;
    left: 0;
    right: 0;
    padding: calc(env(safe-area-inset-top, 0px) + 10px) 20px 8px;
    background: var(--paper);
    border-bottom: 1px solid var(--guide-soft);
    transition: transform 0.28s var(--ease-sheet);
  }

  .top.tucked {
    transform: translateY(calc(-100% - 2px));
  }

  /* bigger targets for thumbs */
  .seg a {
    padding: 9px 10px;
  }

  .theme {
    padding: 8px 9px;
  }

  .other,
  .crumbs .sep,
  .crumbs .here {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .top {
    transition: none;
  }
}
</style>
