import photoData from '@/data/photos.json'
import type { Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   Photos
   ---------------------------------------------------------------------------
   src/data/photos.json is the single source of truth, shared with
   scripts/process-photos.mjs — the script reads `source` to know what to
   resize and writes back the real output `width`/`height`, so the dimensions
   here always match the files on disk. That is what lets the grid reserve
   exact aspect ratios and avoid layout shift.

   Alt text was written after viewing every photograph, in both languages.
--------------------------------------------------------------------------- */

export type PhotoCategory = 'outdoor' | 'living' | 'kitchen' | 'bedroom' | 'bathroom'

export type Photo = {
  file: string
  category: PhotoCategory
  width: number
  height: number
  hero?: boolean
  /** Used by the Materials section; excluded from the gallery grid. */
  material?: boolean
  alt: Record<Locale, string>
}

type RawPhoto = {
  source: string
  file: string
  category: string
  width?: number
  height?: number
  hero?: boolean
  material?: boolean
  alt: { en: string; el: string }
}

const raw = photoData as RawPhoto[]

export const photos: Photo[] = raw.map((p) => {
  if (!p.width || !p.height) {
    throw new Error(
      `Photo "${p.file}" has no dimensions. Run: node scripts/process-photos.mjs`,
    )
  }
  return {
    file: p.file,
    category: p.category as PhotoCategory,
    width: p.width,
    height: p.height,
    hero: p.hero,
    material: p.material,
    alt: { en: p.alt.en, el: p.alt.el },
  }
})

export const heroPhoto: Photo =
  photos.find((p) => p.hero) ?? photos[0]

/* The gallery excludes the hero (already the largest thing on the page) and the
   four material close-ups (they have their own section, where the surface IS the
   subject — repeating them here would just pad the grid). */
export const galleryPhotos: Photo[] = photos.filter((p) => !p.hero && !p.material)

export function photoSrc(photo: Photo): string {
  return `/images/gallery/${photo.file}`
}

/** Portrait tiles span more rows in the masonry grid. */
export function isPortrait(photo: Photo): boolean {
  return photo.height > photo.width
}
