// Light or dark. Without a saved choice the page follows the system; a click saves the choice.
// The inline script in app.vue applies the saved choice before the first paint.
export const THEME_KEY = 'kx-theme'

export function useTheme() {
  const dark = useState('theme-dark', () => false)

  function read() {
    if (import.meta.server) return
    const set = document.documentElement.dataset.theme
    dark.value = set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  }

  function toggle() {
    const next = dark.value ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // private mode: the choice just lasts for this visit
    }
    dark.value = next === 'dark'
  }

  return { dark, read, toggle }
}
