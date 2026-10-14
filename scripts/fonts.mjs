// Downloads the Latin cuts of the three Google fonts into public/fonts/ and writes
// app/assets/css/fonts.css. Self-hosted, so no visitor IP ever goes to Google.
// The Japanese subsets are skipped on purpose: the site only sets Latin text.
//
//   npm run fonts
import { mkdir, writeFile } from 'node:fs/promises'

const FAMILIES = ['Dela+Gothic+One', 'DotGothic16', 'Zen+Kaku+Gothic+New:wght@400;500;700']
const KEEP = new Set(['latin', 'latin-ext'])
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

await mkdir('public/fonts', { recursive: true })
const url = `https://fonts.googleapis.com/css2?${FAMILIES.map((f) => `family=${f}`).join('&')}&display=swap`
const css = await (await fetch(url, { headers: { 'user-agent': UA } })).text()

let out = '/* Self-hosted Latin cuts of Dela Gothic One, DotGothic16 and Zen Kaku Gothic New (SIL OFL). Written by scripts/fonts.mjs. */\n'
let count = 0
for (const [, subset, block] of css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face \{[^}]+\})/g)) {
  if (!KEEP.has(subset)) continue
  const family = block.match(/font-family: '([^']+)'/)[1]
  const weight = block.match(/font-weight: (\d+)/)[1]
  const src = block.match(/url\((https:[^)]+\.woff2)\)/)[1]
  const file = `${family.toLowerCase().replaceAll(' ', '-')}-${weight}-${subset}.woff2`
  await writeFile(`public/fonts/${file}`, Buffer.from(await (await fetch(src)).arrayBuffer()))
  out += block.replace(src, `/fonts/${file}`).replace(/\n\s*/g, ' ') + '\n'
  count++
}
await writeFile('app/assets/css/fonts.css', out)
console.log(`${count} font files in public/fonts`)
