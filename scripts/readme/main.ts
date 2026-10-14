// Draws the GitHub profile README pages from public GitHub data into a folder (default
// public/readme). Runs on deploy and once a day; see docs/README.md for the README itself.
//
//   npm run readme                 → public/readme
//   npm run readme -- live/readme  → straight into the running site
//   npm run readme -- --cached     → from the data of the last run, no GitHub requests (for
//                                    working on the drawings; GitHub allows 60 requests an hour)
//
// All pages are written to a temporary folder first and then moved in, so a failed run (GitHub
// down, the calendar page changed) leaves yesterday's pages in place.
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { load, type Data } from './github'
import { board, lately, next, numbers, title } from './pages'

const CACHE = '.cache/readme-data.json'
const args = process.argv.slice(2)
const out = args.find((a) => !a.startsWith('--')) ?? 'public/readme'
const cached = args.includes('--cached')
const data: Data = cached ? JSON.parse(readFileSync(CACHE, 'utf8')) : await load()
if (!cached) {
  mkdirSync('.cache', { recursive: true })
  writeFileSync(CACHE, JSON.stringify(data))
}
const pages: Record<string, string> = {
  'title.svg': title(),
  'numbers.svg': numbers(data),
  'year.svg': board(data),
  'lately.svg': lately(data),
  'next.svg': next(),
}

const tmp = `${out}.tmp`
rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })
for (const [name, svg] of Object.entries(pages)) writeFileSync(join(tmp, name), svg)
mkdirSync(out, { recursive: true })
for (const name of Object.keys(pages)) renameSync(join(tmp, name), join(out, name))
rmSync(tmp, { recursive: true, force: true })

const kb = (s: string) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} KB`
console.log(`readme: ${data.total} contributions, ${data.lately.length} happenings → ${out}`)
for (const [name, svg] of Object.entries(pages)) console.log(`  ${name} ${kb(svg)}`)
