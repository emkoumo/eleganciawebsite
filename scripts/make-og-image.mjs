/* ---------------------------------------------------------------------------
   Open Graph image
   ---------------------------------------------------------------------------
   Crops the hero photograph into public/images/og/og-image.jpg at 1200x630,
   the 1.91:1 card that Facebook, WhatsApp, LinkedIn and X all render.

   Why not point og:image at the hero file directly? It is portrait
   (1800x2400), and each platform centre-crops a portrait image to landscape
   differently — usually landing on the lawn. A fixed crop means every share
   shows the same frame: the lit facade with the top of the pool.

   Usage:  node scripts/make-og-image.mjs
--------------------------------------------------------------------------- */

import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SOURCE = 'public/images/gallery/01-exterior-dusk-pool.jpg'
const OUT_DIR = 'public/images/og'
const OUT = `${OUT_DIR}/og-image.jpg`

const WIDTH = 1200
const HEIGHT = 630

/* Vertical position of the crop window as a fraction of the slack, 0 = top.
   Tuned by eye: higher shows sky, lower loses the balconies. */
const BIAS = 0.4

mkdirSync(OUT_DIR, { recursive: true })

const { width, height } = await sharp(SOURCE).metadata()
const cropHeight = Math.round((width * HEIGHT) / WIDTH)
const top = Math.round((height - cropHeight) * BIAS)

await sharp(SOURCE)
  .extract({ left: 0, top, width, height: cropHeight })
  .resize(WIDTH, HEIGHT)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT)

console.log(`${OUT}  ${WIDTH}x${HEIGHT}  (crop top ${top}px of ${height})`)
