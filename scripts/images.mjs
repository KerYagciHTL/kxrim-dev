// Turns the raw files in docs/screenshots/ into web images in public/img/
// and writes their sizes to content/media.json, so every <img> gets width and height.
//
//   npm run images
//
// Still images: <name>.webp (max 1600 px wide) and <name>-800.webp.
// GIFs: an animated <name>.webp plus a still first frame <name>-poster.webp.
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'docs/screenshots'
const OUT = 'public/img'
const MEDIA = 'content/media.json'

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f)).sort()
const media = {}

for (const file of files) {
  const { name, ext } = parse(file)
  const input = join(SRC, file)

  if (ext.toLowerCase() === '.gif') {
    const meta = await sharp(input, { animated: true }).metadata()
    const height = meta.pageHeight ?? meta.height
    await sharp(input, { animated: true }).webp({ quality: 80, effort: 6 }).toFile(join(OUT, `${name}.webp`))
    await sharp(input, { pages: 1 }).webp({ quality: 85 }).toFile(join(OUT, `${name}-poster.webp`))
    media[name] = { src: `/img/${name}.webp`, poster: `/img/${name}-poster.webp`, width: meta.width, height }
    console.log(`${file}: animated ${meta.width}x${height}`)
    continue
  }

  const meta = await sharp(input).metadata()
  const width = Math.min(1600, meta.width)
  const height = Math.round(meta.height * (width / meta.width))
  await sharp(input).resize({ width }).webp({ quality: 78, effort: 6 }).toFile(join(OUT, `${name}.webp`))
  const entry = { src: `/img/${name}.webp`, width, height }
  if (meta.width > 900) {
    await sharp(input).resize({ width: 800 }).webp({ quality: 78, effort: 6 }).toFile(join(OUT, `${name}-800.webp`))
    entry.small = `/img/${name}-800.webp`
  }
  media[name] = entry
  console.log(`${file}: ${width}x${height}`)
}

await writeFile(MEDIA, JSON.stringify(media, null, 2) + '\n')
console.log(`${Object.keys(media).length} images, sizes in ${MEDIA}`)
