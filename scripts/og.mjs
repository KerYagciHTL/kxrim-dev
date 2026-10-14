// Renders the link preview cards (1200 × 630) into public/ with headless Chromium:
// og-de.png, og-en.png, og-build-de.png, og-build-en.png.
//
//   npm run og
// Needs Chromium from Playwright; set CHROME=/path/to/chrome if it lives elsewhere.
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = process.env.CHROME ?? `${process.env.HOME}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`
const root = resolve('public')
// embedded, because a page set from a string may not load file:// fonts
const font = (file) => `url(data:font/woff2;base64,${readFileSync(`${root}/fonts/${file}`).toString('base64')})`
const avatar = `data:image/webp;base64,${readFileSync(`${root}/img/avatar.webp`).toString('base64')}`

const cards = [
  { file: 'og-de.png', title: ['Kerimcan', 'Yagci'], line: 'Softwareentwickler aus Ansfelden, Österreich. C#, Java, TypeScript.', avatar: true },
  { file: 'og-en.png', title: ['Kerimcan', 'Yagci'], line: 'Software developer from Ansfelden, Austria. C#, Java, TypeScript.', avatar: true },
  { file: 'og-build-de.png', title: ['Was ich', 'baue'], line: 'Websites, Web-Apps und kleine Desktop-Tools. Von Kerimcan Yagci.', avatar: false },
  { file: 'og-build-en.png', title: ['What I', 'build'], line: 'Websites, web apps and small desktop tools. By Kerimcan Yagci.', avatar: false },
]

const page = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Dela; src: ${font('dela-gothic-one-400-latin.woff2')}; }
@font-face { font-family: Dela; src: ${font('dela-gothic-one-400-latin-ext.woff2')}; unicode-range: U+0100-024F; }
@font-face { font-family: Zen; src: ${font('zen-kaku-gothic-new-500-latin.woff2')}; }
@font-face { font-family: Dot; src: ${font('dotgothic16-400-latin.woff2')}; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; background: #f5f4ef; color: #151515; position: relative; overflow: hidden; font-family: Zen, sans-serif; }
.trim { position: absolute; inset: 18px; border: 1px solid #7fc4e0; }
.inner { position: absolute; inset: 44px; border: 1px solid #c6e6f2; }
.tone { position: absolute; left: 0; bottom: 0; width: 360px; height: 360px;
  background-image: radial-gradient(circle, #151515 1.4px, transparent 1.7px); background-size: 8px 8px;
  -webkit-mask-image: radial-gradient(circle at 0 100%, #000 0, transparent 70%); }
.text { position: absolute; left: 92px; top: 92px; right: ${c.avatar ? '470px' : '92px'}; }
h1 { font: 400 112px/0.92 Dela, sans-serif; letter-spacing: -1px; }
p { margin-top: 30px; max-width: 560px; font-size: 26px; line-height: 1.45; }
.mark { position: absolute; left: 92px; bottom: 74px; font: 400 22px/1 Dot, monospace; }
.pic { position: absolute; right: 92px; top: 112px; width: 340px; height: 340px; border: 5px solid #151515; background: #fff; }
.pic img { width: 100%; height: 100%; object-fit: cover; display: block; }
.panels { position: absolute; right: 92px; bottom: 92px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 420px; }
.panels div { border: 4px solid #151515; height: 90px; }
.panels div:first-child { grid-row: span 2; height: auto; background-image: radial-gradient(circle, #151515 1.2px, transparent 1.5px); background-size: 7px 7px; }
</style></head><body>
<div class="tone"></div><div class="trim"></div><div class="inner"></div>
<div class="text"><h1>${c.title.join('<br>')}</h1><p>${c.line}</p></div>
${c.avatar ? `<div class="pic"><img src="${avatar}"></div>` : '<div class="panels"><div></div><div></div><div></div></div>'}
<div class="mark">yagci.cc</div>
</body></html>`

const browser = await chromium.launch({ executablePath: CHROME })
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const c of cards) {
  await tab.setContent(page(c), { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  await tab.screenshot({ path: `${root}/${c.file}` })
  console.log(c.file)
}
await browser.close()
