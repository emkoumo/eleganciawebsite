'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Lightbox } from '@/components/Lightbox'
import { Reveal } from '@/components/Reveal'
import { useGalleryItemVariants } from '@/lib/motion'
import { galleryPhotos, photoSrc, isPortrait } from '@/lib/photos'
import { getDictionary, type Locale } from '@/lib/i18n'

export function Gallery({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  /* Filters are by AREA, not by villa: the three villas are identical and the
     photography is not villa-specific, so a per-villa filter would present
     arbitrary splits as meaningful. Area is the distinction a visitor actually
     wants — "show me the bathrooms". */
  const [filter, setFilter] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const itemVariants = useGalleryItemVariants()

  const visible = useMemo(
    () =>
      filter === 'all'
        ? galleryPhotos
        : galleryPhotos.filter((p) => p.category === filter),
    [filter],
  )

  /* Closing the lightbox on a filter change avoids stale indices. */
  const changeFilter = (next: string) => {
    setLightboxIndex(null)
    setFilter(next)
  }

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{d.gallery.eyebrow}</p>
          <h2
            id="gallery-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            {d.gallery.heading}
          </h2>
        </Reveal>

        {/*
          Buttons with aria-pressed rather than role="tab": the grid below is a
          filtered view of one collection, not six separate panels. Claiming a
          tab pattern we don't fully implement would mislead screen-reader users
          about what the arrow keys do.
        */}
        <Reveal className="mt-12">
          <div
            role="group"
            aria-label={d.gallery.filterLabel}
            className="flex flex-wrap gap-2 border-b border-bronze/20 pb-5"
          >
            {d.gallery.filters.map((f) => {
              const isActive = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeFilter(f.id)}
                  aria-pressed={isActive}
                  className={`tap-target cursor-pointer rounded-sm px-4 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-bronze text-white'
                      : 'text-bronze-deep hover:bg-bronze/10'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Result count, announced on filter change — gives non-visual users
            the feedback the crossfade gives sighted ones. */}
        <p aria-live="polite" className="mt-5 text-sm text-bronze-deep">
          {d.gallery.showing(visible.length)}
        </p>

        {/*
          Masonry-style grid. Portrait tiles span four rows, landscape three, so
          the grid breaks its own baseline the way a masonry wall does while
          staying a real CSS grid — which is what lets Motion animate the reflow.
          `grid-flow-row-dense` back-fills the holes a mixed-span grid otherwise
          leaves. `layout` is off under reduced motion so tiles crossfade in
          place instead of sliding across the viewport.
        */}
        <ul className="mt-8 grid auto-rows-[7rem] grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((photo, i) => (
              <motion.li
                key={photo.file}
                layout={!reduce}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={isPortrait(photo) ? 'row-span-4' : 'row-span-3'}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  /* Descriptive label — "photo" alone would tell a screen-reader
                     user nothing about which image they are opening. */
                  aria-label={d.gallery.viewLarger(photo.alt[locale])}
                  className="group h-full w-full cursor-pointer overflow-hidden bg-sand"
                >
                  {/* Silent: the button's aria-label already describes it. */}
                  <Image
                    src={photoSrc(photo)}
                    alt=""
                    aria-hidden="true"
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
                  />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        locale={locale}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}
