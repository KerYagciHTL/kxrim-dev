import type { Locale, Text } from '~~/content/types'

/** Picks the current language out of a content Text. */
export function useText() {
  const { locale } = useI18n()
  return (text: Text) => text[locale.value as Locale]
}
