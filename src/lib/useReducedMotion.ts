import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/** Live prefers-reduced-motion flag. The 3D scene and all scroll choreography
 *  key off this — the fallback is a designed static composition, not a stub. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
