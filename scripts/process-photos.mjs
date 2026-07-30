/* ---------------------------------------------------------------------------
   Photo processing
   ---------------------------------------------------------------------------
   Reads src/data/photos.json, resizes each source photo into
   public/images/gallery/, and writes the resulting width/height back into the
   same JSON so the site can reserve exact aspect ratios (no layout shift).

   Why resize at all, when next/image optimises on demand? Because the ORIGINALS
   are committed and deployed. The source set is 402MB of 5712px-wide JPEGs —
   far past what belongs in git, and past Vercel's practical limits. 2400px on
   the long edge is more than any layout here requests (the largest render is a
   full-bleed hero at 2x on a 1440px display), so nothing is lost visually.

   Idempotent: skips a file whose output already exists unless --force.

   Usage:  node scripts/process-photos.mjs [--force]
--------------------------------------------------------------------------- */

import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'

const SRC_DIR =
  '/Users/macbookpro/Documents/Documents/Manolo business/ΚΟΥΜΟΡΤΖΗΣ ΜΟΝ. Ι.Κ.Ε/BOOKING/PHOTOS/Website photos/General'
const OUT_DIR = 'public/images/gallery'
const MANIFEST = 'src/data/photos.json'

const MAX_EDGE = 2400
const QUALITY = 80
const force = process.argv.includes('--force')

mkdirSync(OUT_DIR, { recursive: true })

const photos = JSON.parse(readFileSync(MANIFEST, 'utf8'))
let processed = 0
let skipped = 0
let missing = 0
let bytesIn = 0
let bytesOut = 0

for (const photo of photos) {
  const src = path.join(SRC_DIR, photo.source)
  const out = path.join(OUT_DIR, photo.file)

  if (!existsSync(src)) {
    console.error(`  ! MISSING SOURCE: ${photo.source}`)
    missing++
    continue
  }

  if (existsSync(out) && !force) {
    const meta = await sharp(out).metadata()
    photo.width = meta.width
    photo.height = meta.height
    skipped++
    continue
  }

  bytesIn += statSync(src).size

  /* .rotate() with no argument applies the EXIF orientation, then strips it.
     Without this, phone photos (the IMG_* set) can come out sideways. */
  const info = await sharp(src)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(out)

  photo.width = info.width
  photo.height = info.height
  bytesOut += statSync(out).size
  processed++
  console.log(
    `  ${photo.file}  ${info.width}x${info.height}  ${(statSync(out).size / 1024).toFixed(0)}KB`,
  )
}

/* Persist the real output dimensions so components can set aspect-ratio. */
writeFileSync(MANIFEST, JSON.stringify(photos, null, 2) + '\n')

const mb = (b) => (b / 1024 / 1024).toFixed(1)
console.log(
  `\n${processed} processed, ${skipped} already present, ${missing} missing source`,
)
if (processed) {
  console.log(`${mb(bytesIn)}MB in -> ${mb(bytesOut)}MB out`)
}
if (missing) process.exit(1)
