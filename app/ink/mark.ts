// The small pixel mark next to the name: the GitHub avatar as a 20 × 20 pixel bust. Its idle
// loop blinks, and the cursed seal on the cheek spreads and pulls back now and then.
import { PixelBuffer, colour } from './buffer'

// '#' ink, 'r' red, '.' empty
const BUST = [
  '..#.....#...........',
  '..##...##..#........',
  '...###.##.##........',
  '#..#########........',
  '.###########.#......',
  '..#############.....',
  '################....',
  '.#######..###.###...',
  '..#####.##..#..###..',
  '..####.#.....#..##..',
  '.#####..##..##r#.##.',
  '..####.........#.##.',
  '..##.#........#.#.#.',
  '...#.#.........#.##.',
  '...#.#....###..###..',
  '...###.........##...',
  '....####......##....',
  '...##############...',
  '.#################..',
  '###################.',
]

function edit(rows: string[], pixels: [x: number, y: number, c: string][]) {
  const out = rows.map((r) => [...r])
  for (const [x, y, c] of pixels) out[y]![x] = c
  return out.map((r) => r.join(''))
}

const BLINK = edit(BUST, [[8, 10, '.'], [9, 10, '.'], [8, 11, '#'], [9, 11, '#'], [14, 10, '#']])
const SEAL_1 = edit(BUST, [[13, 11, '#'], [17, 14, '#']])
const SEAL_2 = edit(SEAL_1, [[12, 11, '#'], [13, 9, '#'], [16, 15, '#'], [18, 12, '#']])

// one loop of 72 frames at 8 fps: rest, blink, rest, the seal spreads and pulls back, blink
const LOOP: string[][] = []
const hold = (frame: string[], n: number) => {
  for (let i = 0; i < n; i++) LOOP.push(frame)
}
hold(BUST, 26)
hold(BLINK, 1)
hold(BUST, 14)
hold(SEAL_1, 2)
hold(SEAL_2, 10)
hold(SEAL_1, 2)
hold(BUST, 6)
hold(BLINK, 1)
hold(BUST, 10)

export const MARK = { size: 20, fps: 8 }

/** Draws frame `step` of the idle loop; colours are '#rrggbb'. */
export function drawMark(buf: PixelBuffer, step: number, ink: string, red: string) {
  buf.clear()
  const rows = LOOP[step % LOOP.length]!
  const c: Record<string, number> = { '#': colour(ink), r: colour(red) }
  rows.forEach((row, y) => [...row].forEach((ch, x) => c[ch] !== undefined && buf.put(x, y, c[ch]!)))
  buf.flush()
}

export { PixelBuffer }
