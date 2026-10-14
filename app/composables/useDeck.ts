// Shared state of the horizontal deck: which sheet is in view and when it changed.
import { shallowRef } from 'vue'

export interface SheetInfo {
  id: string
  label: string
}

// set by the deck on the client, called by the pager and in-page links (never serialised)
const goTo = shallowRef<((i: number) => void) | null>(null)
/** the deck's own ink canvas, which scrolls with the sheets, for the ink layer */
const inkPage = shallowRef<{ canvas: HTMLCanvasElement; host: HTMLElement } | null>(null)

export function useDeck() {
  const sheets = useState<SheetInfo[]>('deck-sheets', () => [])
  const index = useState('deck-index', () => 0)
  /** bumps on every sheet change, the ink layer listens to it */
  const turns = useState('deck-turns', () => 0)

  function go(target: number | string) {
    const i = typeof target === 'number' ? target : sheets.value.findIndex((s) => s.id === target)
    if (i >= 0) goTo.value?.(i)
  }

  return { sheets, index, turns, goTo, go, inkPage }
}
