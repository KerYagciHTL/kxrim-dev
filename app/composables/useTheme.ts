// Light, dark or rain. Without a saved choice the page follows the system (light or dark); the
// button in the top bar steps through all three and saves the choice.
// The inline script in app.vue applies the saved choice before the first paint.
export const THEME_KEY = 'kx-theme'
export const THEMES = ['light', 'dark', 'rain'] as const
export type Theme = (typeof THEMES)[number]

/** the paper colour of each theme, for the browser's own toolbar */
export const PAPER: Record<Theme, string> = { light: '#f5f4ef', dark: '#141312', rain: '#0e1418' }

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')
  const next = computed<Theme>(() => THEMES[(THEMES.indexOf(theme.value) + 1) % THEMES.length]!)

  function read() {
    if (import.meta.server) return
    const set = document.documentElement.dataset.theme as Theme | undefined
    theme.value = set && THEMES.includes(set) ? set : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    if (set) paintToolbar(theme.value)
  }

  function paintToolbar(to: Theme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', PAPER[to]))
  }

  function apply(to: Theme) {
    document.documentElement.dataset.theme = to
    paintToolbar(to)
    try {
      localStorage.setItem(THEME_KEY, to)
    } catch {
      // private mode: the choice just lasts for this visit
    }
    theme.value = to
  }

  const toggle = () => apply(next.value)

  return { theme, next, read, toggle }
}
