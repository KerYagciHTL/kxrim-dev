// The five pages of the GitHub README, a short chapter on manga manuscript paper in the site's
// light theme. Every page is one SVG; the pixel ink is drawn by the site's own code.
import { readFileSync } from 'node:fs'
import { flame, flameRow, seal, tendril, type Pen } from '../../app/ink/marks'
import { hash } from '../../app/ink/scene'
import type { Data, Happening } from './github'
import { C, INK, PX, RIM, TONES, WIDTH, animate, cornerTone, esc, fit, fonts, koma, narration, pixels, sheet, text, textWidth, toPaths, tones, wrap } from './svg'

const pal = { body: INK, rim: RIM, edge: RIM, spark: INK, seal: INK }
const ink = (canvas: ReturnType<typeof pixels>) => toPaths(canvas, 0, 0, [[RIM, C.paper], [INK, C.ink]])
const fmt = (n: number) => n.toLocaleString('en-US')
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const tagWidth = (s: string) => textWidth(s, 'Dela', 17) + 28

/** A heading tag: a small white box with an inked edge. */
function tag(x: number, y: number, s: string) {
  const w = tagWidth(s)
  return `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="32" fill="${C.white}" stroke="${C.ink}" stroke-width="2"/>${text(x + 14, y + 23, s, 'Dela', 17)}`
}

/** Seals of the cursed mark turning on their own clock: 19 frames make a third of a turn. */
function turningSeals(h: number, seals: [x: number, y: number, size: number, dir: number][]) {
  const frames: string[] = []
  for (let i = 0; i < 19; i++) {
    const canvas = pixels(Math.ceil(WIDTH / PX), Math.ceil(h / PX))
    const pen: Pen = { buf: canvas.buf, pal, step: i }
    for (const [x, y, size, dir] of seals) seal(pen, x, y, size, dir * i * 0.11)
    frames.push(ink(canvas))
  }
  return animate('s', frames, 167)
}

// ---------------------------------------------------------------------------------------------
// 01 title: name, avatar in an ink panel with the cursed seal growing from it

export function title() {
  const H = 400
  const avatar = `data:image/webp;base64,${readFileSync('public/img/avatar.webp').toString('base64')}`
  const box = { x: 600, y: 52, s: 234 }
  const L = box.x / PX
  const T = box.y / PX
  const R = (box.x + box.s) / PX
  const B = (box.y + box.s) / PX
  const t = 8 / PX
  const b = (H - 8) / PX

  const flames: string[] = []
  for (let step = 0; step < 4; step++) {
    const canvas = pixels(Math.ceil(WIDTH / PX), Math.ceil(H / PX))
    const pen: Pen = { buf: canvas.buf, pal, step }
    flameRow(pen, { seed: 20, x: R, y: T + (B - T) * 0.34, dx: 0, dy: 1, nx: 1, ny: 0, span: (B - T) * 0.52, size: 5.5, growth: 1, detail: 0.2 })
    flameRow(pen, { seed: 21, x: R - 1, y: B, dx: -1, dy: 0, nx: 0, ny: 1, span: (R - L) * 0.32, size: 5, growth: 1, detail: 0.2 })
    flameRow(pen, { seed: 3, x: t, y: b, dx: 1, dy: 0, nx: 0, ny: -1, span: 46, size: 6.2, growth: 1 })
    flameRow(pen, { seed: 4, x: t, y: b, dx: 0, dy: -1, nx: 1, ny: 0, span: 9, size: 4.5, growth: 1 })
    flames.push(ink(canvas))
  }
  const fire = animate('f', flames, 167)
  const seals = turningSeals(H, [[L - 2, T - 2, 2.3, -1], [t + 15, b - 17, 2.3, 1]])

  const nameSize = fit('Kerimcan', 'Dela', 82, 500)
  const why = wrap('He gets things done on his own. Same with my client projects.', 'Zen', 14, 206)
  const body = `
${cornerTone(WIDTH - 8, 8, 170, { x: 9, y: 9, w: WIDTH - 18, h: H - 18 })}
${koma(box.x, box.y, box.s, box.s, 4, C.white)}
<image href="${avatar}" x="${box.x + 4}" y="${box.y + 4}" width="${box.s - 8}" height="${box.s - 8}" preserveAspectRatio="xMidYMid slice"/>
${fire.markup}${seals.markup}
${text(44, 128, 'Kerimcan', 'Dela', nameSize)}
${text(44, 128 + nameSize * 1.02, 'Yagci', 'Dela', nameSize)}
${text(46, 262, 'Software developer from Austria', 'ZenBold', 22)}
${text(46, 294, 'C#  ·  Java  ·  TypeScript', 'Dot', 15, { fill: C.soft })}
${text(46, 318, 'HTL Leonding  ·  Ansfelden near Linz', 'Dot', 15, { fill: C.soft })}
${narration(552, 262, 234, 'Why Sasuke?', why)}`
  return sheet(H, 1, body, fonts('Dela', 'Zen', 'ZenBold', 'Dot') + fire.css + seals.css)
}

// ---------------------------------------------------------------------------------------------
// 02 numbers: one manga page of three panels

/** Focus lines (shuchusen): thin wedges racing to the middle, which stays clear for the number. */
function focusLines(cx: number, cy: number, rx: number, ry: number, n = 132) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = ((i + hash(i, 1) * 0.6) / n) * Math.PI * 2
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    // where the clear ellipse ends in this direction, pushed out a little at random
    const r0 = (1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry))) * (1 + hash(i, 2) * 0.35)
    const r1 = 520
    const w = 0.8 + hash(i, 3) * (i % 7 === 0 ? 5 : 2.4)
    const p = (r: number, s: number) => `${(cx + dx * r - dy * s).toFixed(1)} ${(cy + dy * r + dx * s).toFixed(1)}`
    d += `M${p(r0, 0)}L${p(r1, w)}L${p(r1, -w)}z`
  }
  return `<path fill="${C.ink}" d="${d}"/>`
}

export function numbers(data: Data) {
  const H = 440
  const active = data.days.filter((d) => d.count > 0)
  const busiest = Math.max(0, ...data.days.map((d) => d.count))
  const A = { x: 30, y: 52, w: 368, h: 358 }
  const cx = A.x + A.w / 2
  const cy = A.y + A.h / 2 + 4

  const stats: [string, string][] = [
    [fmt(data.repos), 'public repositories'],
    [fmt(data.stars), 'stars on my own repos'],
    [fmt(data.followers), 'followers'],
    [fmt(busiest), 'on my busiest day'],
  ]
  const Bx = 412
  const Bw = WIDTH - 30 - Bx
  const col = Bw / stats.length
  const statsSvg = stats
    .map(([n, label], i) => {
      const x = Bx + col * i + 18
      const lines = wrap(label, 'Dot', 13, col - 30)
      const sep = i ? `<path d="M${Bx + col * i} 72v104" stroke="${C.guideSoft}"/>` : ''
      return `${sep}${text(x, 128, n, 'Dela', fit(n, 'Dela', 42, col - 30))}${lines.map((l, k) => text(x, 154 + k * 17, l, 'Dot', 13, { fill: C.soft })).join('')}`
    })
    .join('')

  // the five biggest languages, the rest together
  const top = data.languages.slice(0, 5)
  if (data.languages.length > 5) {
    top.length = 4
    top.push({ name: 'Other', share: data.languages.slice(4).reduce((s, l) => s + l.share, 0) })
  }
  const barX = 530
  const barW = 262
  const langs = top
    .map((l, i) => {
      const y = 262 + i * 28
      const w = Math.max(3, barW * l.share)
      return `${text(430, y + 15, l.name, 'ZenBold', fit(l.name, 'ZenBold', 15, 92))}
<rect x="${barX}" y="${y}" width="${w.toFixed(1)}" height="18" fill="url(#${TONES[i]})"/>
<rect x="${barX + 1}" y="${y + 1}" width="${barW - 2}" height="16" fill="none" stroke="${C.ink}" stroke-width="2"/>
${text(barX + barW + 12, y + 15, `${(l.share * 100).toFixed(l.share < 0.1 ? 1 : 0)}%`, 'Dot', 14)}`
    })
    .join('')

  const body = `${tones()}
<clipPath id="pa"><rect x="${A.x + 3}" y="${A.y + 3}" width="${A.w - 6}" height="${A.h - 6}"/></clipPath>
${koma(A.x, A.y, A.w, A.h)}
<g clip-path="url(#pa)">${focusLines(cx, cy, 158, 96)}</g>
${text(cx, cy + 22, fmt(data.total), 'Dela', fit(fmt(data.total), 'Dela', 96, 270), { anchor: 'middle' })}
${text(cx, cy + 54, 'contributions in the last year', 'Dot', 15, { anchor: 'middle' })}
${text(cx, cy + 75, `on ${active.length} days`, 'Dot', 15, { anchor: 'middle', fill: C.soft })}
${koma(Bx, A.y, Bw, 144)}
${statsSvg}
${koma(Bx, 210, Bw, 200)}
${text(430, 240, 'Languages in my public code', 'Dot', 13, { fill: C.soft })}
${langs}
${tag(44, 34, 'In numbers')}`
  return sheet(H, 2, body, fonts('Dela', 'ZenBold', 'Dot'))
}

// ---------------------------------------------------------------------------------------------
// 03 the year: the days as halftone dots, the cursed seal burning above them as one mass of black
// fire, as high as each week was busy, with flame tips licking off its top

/** halftone dot radius per GitHub level, in SVG units: bigger dot, busier day */
const DOT = [0, 2.2, 3.6, 5, 6.4]

export function board(data: Data) {
  const H = 360
  const weeks = Math.max(...data.days.map((d) => d.col)) + 1
  const pitch = 15
  const x0 = (WIDTH - weeks * pitch) / 2
  const gy = 195 // top of the grid
  const active = data.days.filter((d) => d.count > 0)
  const busiest = data.days.reduce((a, b) => (b.count > a.count ? b : a), data.days[0]!)

  // the height of the fire over every week, smoothed so neighbouring weeks run together
  const sums = Array.from({ length: weeks }, () => 0)
  for (const d of data.days) sums[d.col]! += d.count
  const max = Math.max(1, ...sums)
  const raw = sums.map((s) => (s ? 5 + 20 * Math.pow(s / max, 0.62) : 0))
  const kernel = [0.12, 0.22, 0.32, 0.22, 0.12]
  const height = raw.map((_, c) => kernel.reduce((h, w, k) => h + w * (raw[c + k - 2] ?? 0), 0))

  // in art pixels
  const ax0 = x0 / PX
  const base = gy / PX - 2
  const span = (weeks * pitch) / PX
  const at = (x: number) => {
    const f = (x - ax0) / (pitch / PX) - 0.5
    const i = Math.floor(f)
    const t = f - i
    return (height[Math.max(0, i)] ?? 0) * (1 - t) + (height[Math.min(weeks - 1, i + 1)] ?? 0) * t
  }

  const frames: string[] = []
  for (let step = 0; step < 4; step++) {
    const canvas = pixels(Math.ceil(WIDTH / PX), Math.ceil(H / PX))
    const pen: Pen = { buf: canvas.buf, pal, step }
    const swirl: Pen = { buf: canvas.buf, pal: { ...pal, body: RIM }, step }
    // the mass, with a ragged top edge
    for (let x = Math.floor(ax0); x < ax0 + span; x++) {
      const h = at(x)
      if (h < 1) continue
      const top = base - h + Math.round((hash(x, 7) - 0.5) * 2)
      for (let y = top; y <= base; y++) canvas.buf.put(x, y, INK)
    }
    // flame tips licking off the top, bigger where the fire is high
    for (let x = Math.floor(ax0) + 2, i = 0; x < ax0 + span; x += 5 + Math.round(hash(i, 8) * 3), i++) {
      const h = at(x)
      if (h < 3) continue
      const curl = (i % 2 ? -1 : 1) * (0.07 + hash(i, 9) * 0.07)
      flame(pen, x, base - h + 2, -Math.PI / 2 + (hash(i, 10) - 0.5) * 0.5, 1.6 + h * 0.3, curl, 1, i)
    }
    // the seal's hairline swirls, in paper, inside the bigger fires
    for (let x = Math.floor(ax0) + 4, i = 0; x < ax0 + span; x += 9, i++) {
      const h = at(x)
      if (h < 12 || hash(i, 11) < 0.35) continue
      tendril(swirl, x, base - 2, -Math.PI / 2 + (hash(i, 12) - 0.5) * 0.9, h * 0.75, i % 2 ? 1 : -1, 1)
    }
    // the fire stands on a ground line
    for (let x = Math.floor(ax0); x < ax0 + span; x++) if (at(x) >= 1) canvas.buf.put(x, base + 1, INK)
    frames.push(ink(canvas))
  }
  const fire = animate('f', frames, 167)

  // the days: halftone dots in ink, quiet days as dots of non-repro blue
  const cx = (d: { col: number }) => x0 + d.col * pitch + pitch / 2
  const cy = (d: { row: number }) => gy + d.row * pitch + pitch / 2
  const dots = data.days
    .filter((d) => d.count)
    .map((d) => {
      const r = DOT[Math.max(1, d.level)]!
      return `M${(cx(d) - r).toFixed(1)} ${cy(d)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
    })
    .join('')
  const quiet = data.days
    .filter((d) => !d.count)
    .map((d) => `M${cx(d) - 1.5} ${cy(d) - 1.5}h3v3h-3z`)
    .join('')

  // month names under the first week of each month
  const months: string[] = []
  let last = -1
  for (const d of data.days) {
    const m = Number(d.date.slice(5, 7)) - 1
    if (d.row === 0 && m !== last) {
      months.push(text(x0 + d.col * pitch + 2, gy + 7 * pitch + 20, MONTHS[m]!, 'Dot', 12, { fill: C.soft }))
      last = m
    }
  }

  // legend: the five dot sizes from quiet to busy
  const lx = WIDTH - 40 - 5 * 18 - 34
  const legend =
    `<path fill="${C.guide}" d="M${lx - 1.5} 46.5h3v3h-3z"/>` +
    `<path fill="${C.ink}" d="${[1, 2, 3, 4].map((l) => `M${lx + l * 18 - DOT[l]!} 48a${DOT[l]} ${DOT[l]} 0 1 0 ${2 * DOT[l]!} 0a${DOT[l]} ${DOT[l]} 0 1 0 ${-2 * DOT[l]!} 0`).join('')}"/>` +
    text(lx - 12, 52, 'quiet', 'Dot', 11, { fill: C.soft, anchor: 'end' }) +
    text(lx + 4 * 18 + 12, 52, 'busy', 'Dot', 11, { fill: C.soft })

  const bDate = new Date(`${busiest.date}T12:00:00Z`)
  const summary = `${fmt(data.total)} contributions on ${active.length} days`
  const busy = `busiest: ${busiest.count} on ${bDate.getUTCDate()} ${MONTHS[bDate.getUTCMonth()]}`
  const sweep =
    `.sw{transform-box:fill-box;transform-origin:0 0;animation:sw 3.2s steps(${weeks},end) .3s both}` +
    `@keyframes sw{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media (prefers-reduced-motion:reduce){.sw{animation:none}}`

  const body = `
<clipPath id="spread"><rect class="sw" x="${x0}" y="0" width="${weeks * pitch}" height="${H}"/></clipPath>
${koma(30, 76, WIDTH - 60, H - 76 - 26)}
<path fill="${C.guide}" d="${quiet}"/>
<g clip-path="url(#spread)">${fire.markup}<path fill="${C.ink}" d="${dots}"/></g>
<circle cx="${cx(busiest)}" cy="${cy(busiest)}" r="${DOT[4]! + 3.5}" fill="none" stroke="${C.red}" stroke-width="2"/>
${months.join('')}
${tag(40, 30, 'The last year')}
${text(40 + tagWidth('The last year') + 18, 52, summary, 'Zen', 15)}
${text(40 + tagWidth('The last year') + 18 + textWidth(summary, 'Zen', 15) + 16, 52, busy, 'Dot', 13, { fill: C.red })}
${legend}`
  return sheet(H, 3, body, fonts('Dela', 'Zen', 'Dot') + fire.css + sweep)
}

// ---------------------------------------------------------------------------------------------
// 04 lately: a four panel strip (yonkoma), newest first

// 7 × 7 pixel icons, '#' ink
const ICONS: Record<Happening['kind'], string[]> = {
  push: ['...#...', '..###..', '.#.#.#.', '...#...', '...#...', '...#...', '...#...'],
  create: ['...#...', '...#...', '...#...', '#######', '...#...', '...#...', '...#...'],
  review: ['.......', '..###..', '.#...#.', '#..#..#', '.#...#.', '..###..', '.......'],
  merge: ['.#...#.', '.#..#..', '.#.#...', '.##....', '.#.....', '.#.....', '.#.....'],
  pr: ['.#...#.', '###..#.', '.#...#.', '.#...#.', '.#..###', '.#...#.', '.#.....'],
  issue: ['..###..', '.#...#.', '#.....#', '#..#..#', '#.....#', '.#...#.', '..###..'],
  release: ['####...', '#...#..', '#.#..#.', '#....#.', '.#...#.', '..#.#..', '...#...'],
  other: ['.......', '.......', '..###..', '..###..', '..###..', '.......', '.......'],
}

function icon(kind: Happening['kind'], x: number, y: number, s = 3) {
  let d = ''
  ICONS[kind].forEach((row, cy) => [...row].forEach((c, cx) => c === '#' && (d += `M${x + cx * s} ${y + cy * s}h${s}v${s}h${-s}z`)))
  return `<path fill="${C.ink}" d="${d}"/>`
}

/** A repository name on one line, or broken after the hyphen nearest the middle. */
function repoLines(repo: string, max: number) {
  if (textWidth(repo, 'Dela', 16) <= max || !repo.includes('-')) return [repo]
  let best = 0
  for (let i = 0; i < repo.length; i++) if (repo[i] === '-' && Math.abs(i - repo.length / 2) < Math.abs(best - repo.length / 2)) best = i
  return best ? [repo.slice(0, best + 1), repo.slice(best + 1)] : [repo]
}

export function lately(data: Data) {
  const H = 300
  const items = data.lately
  const gap = 16
  const w = (WIDTH - 60 - gap * 3) / 4
  const y = 72
  const h = 198
  const panels = items
    .map((e, i) => {
      const x = 30 + i * (w + gap)
      const [owner, repo] = e.repo.split('/') as [string, string]
      const date = new Date(e.date)
      const when = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
      const name = repoLines(repo, w - 32)
      const size = Math.min(...name.map((l) => fit(l, 'Dela', 19, w - 32, 12)))
      const lines = wrap(e.what, 'Zen', 15, w - 32).slice(0, name.length > 1 ? 1 : 2)
      return `${koma(x, y, w, h)}
<rect x="${x + 3}" y="${y + h - 32}" width="${w - 6}" height="29" fill="url(#${TONES[i % TONES.length]})"/>
<path d="M${x + 3} ${y + h - 32}h${w - 6}" stroke="${C.ink}" stroke-width="2"/>
<rect x="${x + 13}" y="${y + 13}" width="${textWidth(when, 'Dot', 12) + 16}" height="22" fill="${C.white}" stroke="${C.ink}" stroke-width="2"/>
${text(x + 21, y + 29, when, 'Dot', 12)}
${icon(e.kind, x + w - 36, y + 14)}
${text(x + 16, y + 62, `${owner} /`, 'Dot', 12, { fill: C.soft })}
${name.map((l, k) => text(x + 16, y + 88 + k * 22, l, 'Dela', size)).join('')}
${lines.map((l, k) => text(x + 16, y + 92 + name.length * 22 + k * 19, l, 'Zen', 15)).join('')}`
    })
    .join('')
  const empty = items.length ? '' : text(WIDTH / 2, 160, 'Nothing public happened lately.', 'Zen', 16, { anchor: 'middle', fill: C.soft })
  const body = `${tones()}${panels}${empty}${tag(40, 30, 'Lately')}`
  return sheet(H, 4, body, fonts('Dela', 'Zen', 'Dot'))
}

// ---------------------------------------------------------------------------------------------
// 05 next: the chapter goes on at yagci.cc

export function next() {
  const H = 190
  const P = { x: 30, y: 36, w: WIDTH - 60, h: 120 }
  // speed lines running out to the right: the page turns
  let lines = ''
  for (let i = 0; i < 30; i++) {
    const ly = P.y + 8 + i * 3.6 + hash(i, 5) * 2
    const len = 90 + hash(i, 6) * 230
    lines += `M${P.x + P.w - 4 - len} ${ly.toFixed(1)}h${len.toFixed(1)}v${(0.7 + hash(i, 7) * 1.1).toFixed(2)}h${(-len).toFixed(1)}z`
  }
  const seals = turningSeals(H, [[(P.x + P.w - 70) / PX, (P.y + P.h / 2) / PX, 3.4, 1]])
  const body = `
<clipPath id="pn"><rect x="${P.x + 3}" y="${P.y + 3}" width="${P.w - 6}" height="${P.h - 6}"/></clipPath>
${koma(P.x, P.y, P.w, P.h)}
<g clip-path="url(#pn)"><path fill="${C.ink}" d="${lines}"/>
<circle cx="${P.x + P.w - 70}" cy="${P.y + P.h / 2}" r="44" fill="${C.paper}"/></g>
${seals.markup}
${text(P.x + 30, P.y + 62, 'Continued on yagci.cc', 'Dela', 32)}
${text(P.x + 32, P.y + 92, 'Projects, client sites, school and contact, in German and English.', 'Zen', 15)}`
  return sheet(H, 5, body, fonts('Dela', 'Zen', 'Dot') + seals.css)
}

export { esc }
