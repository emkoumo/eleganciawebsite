'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { VillaImage } from '@/components/VillaImage'
import { Lightbox } from '@/components/Lightbox'
import { Reveal } from '@/components/Reveal'
import { useGalleryItemVariants } from '@/lib/motion'
import {
  galleryItems,
  galleryFilters,
  villas,
  type GalleryFilter,
} from '@/lib/site'

export function Gallery() {
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const itemVariants = useGalleryItemVariants()

  const visible = useMemo(
    () =>
      filter === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.villa === filter),
    [filter],
  )

  /* The villa cards deep-link here with #gallery-serenity etc. Honour that on
     load and on subsequent hash changes, then scroll the section into view.
     Using real hash links keeps those cards working without JS. */
  useEffect(() => {
    const applyHash = () => {
      const match = /^#gallery-(serenity|harmony|majesty)$/.exec(
        window.location.hash,
      )
      if (!match) return
      setFilter(match[1] as GalleryFilter)
      document
        .getElementById('gallery')
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [reduce])

  /* Closing the lightbox on a filter change avoids stale indices. */
  const changeFilter = (next: GalleryFilter) => {
    setLightboxIndex(null)
    setFilter(next)
  }

  const activeLabel =
    galleryFilters.find((f) => f.id === filter)?.label ?? 'All'

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-sand py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Gallery</p>
          <h2
            id="gallery-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            Look around
          </h2>
        </Reveal>

        {/*
          Filter controls. Implemented as a tablist-flavoured group of buttons
          with aria-pressed rather than role="tab", because the panel below is
          a filtered view of one collection, not three separate panels — and
          claiming a tab pattern we don't fully implement would mislead screen
          reader users about what the arrow keys do.
        */}
        <Reveal className="mt-12">
          <div
            role="group"
            aria-label="Filter photographs by villa"
            className="flex flex-wrap gap-2 border-b border-bronze/20 pb-5"
          >
            {galleryFilters.map((f) => {
              const isActive = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeFilter(f.id)}
                  aria-pressed={isActive}
                  className={`tap-target cursor-pointer rounded-sm px-5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-bronze text-white'
                      : 'text-bronze-deep hover:bg-bronze/10'
                  }`}
                >
                  {f.label}
                  {f.id !== 'all' && <span className="sr-only"> villa</span>}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Result count, announced when the filter changes. Gives non-visual
            users the feedback that the crossfade gives sighted ones. */}
        <p aria-live="polite" className="mt-5 text-sm text-bronze-deep">
          Showing {visible.length}{' '}
          {visible.length === 1 ? 'photograph' : 'photographs'}
          {filter !== 'all' && ` of Villa ${activeLabel}`}
        </p>

        {/*
          Masonry-style grid. Portrait slots span two rows, landscape three, so
          the grid breaks its own baseline the way a masonry wall does while
          remaining a real CSS grid — which is what lets Motion animate the
          reflow. `layout` is switched off under reduced motion so tiles
          crossfade in place instead of sliding across the viewport.
        */}
        {/* `grid-flow-row-dense` matters here: with mixed row spans, the default
            flow leaves holes wherever a portrait tile won't fit the remaining
            gap. Dense packing back-fills them, which is what makes this read as
            a masonry wall rather than a grid with dropouts. */}
        <ul className="mt-8 grid auto-rows-[7rem] grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <motion.li
                key={item.id}
                layout={!reduce}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={
                  item.orientation === 'portrait' ? 'row-span-4' : 'row-span-3'
                }
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  /* Explicit, descriptive label — "villa" alone would tell a
                     screen reader user nothing about which photo they're
                     opening. */
                  aria-label={`View larger: ${item.alt}`}
                  className="group h-full w-full cursor-pointer overflow-hidden"
                >
                  <VillaImage
                    src={item.src}
                    alt={item.alt}
                    decorative
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
                  />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Per-villa anchors so #gallery-<id> has a real target in the document
            even before JS runs. */}
        {villas.map((villa) => (
          <span key={villa.id} id={`gallery-${villa.id}`} className="sr-only">
            {villa.name} photographs
          </span>
        ))}
      </div>

      <Lightbox
        items={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}
