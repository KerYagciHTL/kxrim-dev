// Sizes of the web images, written by `npm run images`.
import data from '~~/content/media.json'

export interface MediaEntry {
  src: string
  width: number
  height: number
  small?: string
  poster?: string
}

const media = data as Record<string, MediaEntry>

export function mediaOf(key: string): MediaEntry {
  const entry = media[key]
  if (!entry) throw new Error(`unknown media "${key}": run npm run images`)
  return entry
}

/** srcset for an entry that has a small version */
export function srcsetOf(entry: MediaEntry) {
  return entry.small ? `${entry.small} 800w, ${entry.src} ${entry.width}w` : undefined
}
