'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { VillaImage } from '@/components/VillaImage'
import { useLightboxVariants } from '@/lib/motion'
import type { GalleryItem } from '@/lib/site'

/* ---------------------------------------------------------------------------
   Lightbox
   ---------------------------------------------------------------------------
   Accessibility contract from the brief:
     - operable via keyboard and screen reader
     - focus trapped while open
     - Escape to close
     - focus returned to the thumbnail that opened it

   Implemented as a role="dialog" aria-modal container. A native <dialog> would
   give the trap for free, but its ::backdrop cannot be animated by Motion, and
   the brief asks for animated open/close — so the trap is done by hand below.
--------------------------------------------------------------------------- */

type Props = {
  items: GalleryItem[]
  /** Index into `items`, or null when closed. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const { backdrop, panel } = useLightboxVariants()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  /* The element that had focus before opening, so it can be restored. */
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const isOpen = index !== null
  const item = isOpen ? items[index] : null

  const goPrev = useCallback(() => {
    if (index === null) return
    onNavigate((index - 1 + items.length) % items.length)
  }, [index, items.length, onNavigate])

  const goNext = useCallback(() => {
    if (index === null) return
    onNavigate((index + 1) % items.length)
  }, [index, items.length, onNavigate])

  /* Remember what to focus on close, and move focus into the dialog on open. */
  useEffect(() => {
    if (!isOpen) return
    returnFocusRef.current = document.activeElement as HTMLElement
    /* rAF so the panel is mounted before we try to focus into it. */
    const raf = requestAnimationFrame(() => closeRef.current?.focus())
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  /* Lock background scroll while open, without shifting layout. */
  useEffect(() => {
    if (!isOpen) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [isOpen])

  /* Keyboard: Escape closes, arrows navigate, Tab is trapped inside. */
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
        return
      }
      if (e.key !== 'Tab') return

      /* Focus trap: cycle within the panel's focusable elements. */
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, goPrev, goNext])

  /* Restore focus to the opening thumbnail once closed. */
  const handleClose = useCallback(() => {
    onClose()
    returnFocusRef.current?.focus()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="on-dark fixed inset-0 z-[60] flex items-center justify-center bg-espresso/95 p-4 sm:p-8"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph ${index + 1} of ${items.length}: ${item.alt}`}
          /* Clicking the backdrop closes; the panel stops propagation. */
          onClick={handleClose}
        >
          <motion.div
            ref={panelRef}
            variants={panel}
            className="relative flex max-h-full w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-3">
              <p className="text-xs text-champagne">
                {index + 1} / {items.length}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                className="tap-target -mr-2 flex cursor-pointer items-center justify-center text-sand transition-colors duration-200 hover:text-champagne"
              >
                <span className="sr-only">Close photograph viewer</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <VillaImage
              src={item.src}
              alt={item.alt}
              /* Described by the dialog's aria-label and the live caption
                 below, so the image itself stays silent. */
              decorative
              width={item.width}
              height={item.height}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="max-h-[70svh] w-full object-contain"
            />

            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={goPrev}
                className="tap-target inline-flex cursor-pointer items-center gap-2 px-1 text-sm text-sand transition-colors duration-200 hover:text-champagne"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M14 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              {/* aria-live so arrow-key navigation is announced. The caption is
                  the authoritative description of the current photograph. */}
              <p
                aria-live="polite"
                className="flex-1 text-center text-xs leading-relaxed text-sand/90 sm:text-sm"
              >
                {item.alt}
              </p>

              <button
                type="button"
                onClick={goNext}
                className="tap-target inline-flex cursor-pointer items-center gap-2 px-1 text-sm text-sand transition-colors duration-200 hover:text-champagne"
              >
                Next
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
