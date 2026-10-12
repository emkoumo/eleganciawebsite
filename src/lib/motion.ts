'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'

/* useLayoutEffect warns during SSR, where it is a no-op anyway. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* ---------------------------------------------------------------------------
   useRevealGate
   ---------------------------------------------------------------------------
   Why this exists rather than Motion's `whileInView`.

   `whileInView` needs `initial="hidden"`, and Motion serialises that initial
   state into the server-rendered HTML as an inline `opacity: 0`. Twenty-two
   elements shipped that way. The consequences were real, not theoretical:

     * Anything that analyses the page at load — WAVE, crawlers, SEO tools —
       sees invisible text. WAVE reported three contrast errors on the About
       paragraphs, and it was right: their effective opacity was 0 at the
       moment it looked.
     * If JavaScript loads but then fails, that content stays invisible
       permanently. The <noscript> override in RootShell only covers JS being
       DISABLED, which is a different failure.

   So the resting state is now visible, and the hidden state is armed on the
   client. The arming happens in a layout effect, which runs after commit but
   BEFORE paint, so the visitor never sees a flash of visible content being
   hidden — the first painted frame is already the animation's first frame.

   rootMargin rather than a threshold: a threshold of 0.25 never fires for a
   block taller than the viewport, which is exactly what the Highlights column
   becomes on a phone. This triggers when the element's top crosses 88% of the
   viewport height, regardless of how tall it is.
--------------------------------------------------------------------------- */
export function useRevealGate() {
  const ref = useRef<HTMLElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setArmed(true)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Before arming — which is every server render and every no-JS visit — this
     reports "visible", so nothing hidden is ever serialised. */
  return { ref, animate: !armed || shown ? 'visible' : 'hidden' } as const
}

/* ---------------------------------------------------------------------------
   Motion presets
   ---------------------------------------------------------------------------
   Reduced motion is handled here rather than in each component, so a component
   physically cannot ship an animation without a fallback — it gets one by
   construction from these hooks.

   The fallback contract, per the brief: opacity-only or instant. No translation,
   no scale, no parallax, no stagger delay.
--------------------------------------------------------------------------- */

const EASE_ELEGANT = [0.22, 1, 0.36, 1] as const

/** Instant, imperceptible transition used for every reduced-motion fallback. */
const INSTANT: Transition = { duration: 0.001 }

/**
 * Rise, for section content entering the viewport.
 *
 * Deliberately NOT a fade. A scroll reveal built on opacity means the content
 * is invisible until it is scrolled to, and that is a real state the page can
 * be found in, not a transient one: WAVE and every other at-load analyser
 * reports the text as having 1:1 contrast, a crawler reads it as hidden, and a
 * visitor whose JavaScript fails after load never sees it at all. Moving the
 * reveal entirely into `transform` removes that state — the text is readable at
 * every instant, it simply travels the last 24px into place.
 *
 * Reduced motion: no travel either, so the variants collapse to a no-op.
 */
export function useRevealVariants(distance = 24): Variants {
  const reduce = useReducedMotion()

  if (reduce) {
    return { hidden: {}, visible: {} }
  }

  return {
    hidden: { y: distance, transition: INSTANT },
    visible: {
      y: 0,
      transition: { duration: 0.7, ease: EASE_ELEGANT },
    },
  }
}

/**
 * Parent container that staggers its children.
 * Reduced motion: children appear together, no stagger.
 */
export function useStaggerVariants(stagger = 0.09, delay = 0): Variants {
  const reduce = useReducedMotion()

  return {
    hidden: {},
    visible: {
      transition: reduce
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: stagger, delayChildren: delay },
    },
  }
}

/**
 * Hero entrance. Slightly longer travel and a gentler curve than a section
 * reveal, because it plays on load rather than on scroll.
 * Reduced motion: fades in place.
 */
export function useHeroVariants(): Variants {
  const reduce = useReducedMotion()

  if (reduce) {
    return {
      hidden: { opacity: 0, transition: INSTANT },
      visible: { opacity: 1, transition: { duration: 0.001 } },
    }
  }

  return {
    hidden: { opacity: 0, y: 28, transition: INSTANT },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE_ELEGANT },
    },
  }
}

/**
 * Gallery grid item, used with Motion's layout animation for filter reflow.
 * Reduced motion: crossfades only — `layout` is disabled by the caller so
 * items do not slide across the screen.
 */
export function useGalleryItemVariants(): Variants {
  const reduce = useReducedMotion()

  if (reduce) {
    return {
      hidden: { opacity: 0, transition: INSTANT },
      visible: { opacity: 1, transition: INSTANT },
      exit: { opacity: 0, transition: INSTANT },
    }
  }

  return {
    hidden: { opacity: 0, scale: 0.96, transition: INSTANT },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: EASE_ELEGANT },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.25, ease: EASE_ELEGANT },
    },
  }
}

/**
 * Lightbox backdrop + panel.
 * Reduced motion: opacity only, no scale.
 */
export function useLightboxVariants() {
  const reduce = useReducedMotion()

  const backdrop: Variants = {
    hidden: { opacity: 0, transition: INSTANT },
    visible: { opacity: 1, transition: reduce ? INSTANT : { duration: 0.25 } },
    exit: { opacity: 0, transition: reduce ? INSTANT : { duration: 0.2 } },
  }

  const panel: Variants = reduce
    ? {
        hidden: { opacity: 0, transition: INSTANT },
        visible: { opacity: 1, transition: INSTANT },
        exit: { opacity: 0, transition: INSTANT },
      }
    : {
        hidden: { opacity: 0, scale: 0.97, transition: INSTANT },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, ease: EASE_ELEGANT },
        },
        exit: {
          opacity: 0,
          scale: 0.97,
          transition: { duration: 0.2, ease: EASE_ELEGANT },
        },
      }

  return { backdrop, panel }
}

/**
 * Shared viewport config for scroll reveals. `once: true` satisfies the brief's
 * "once per element, not looping" requirement.
 */
export const revealViewport = { once: true, amount: 0.25 } as const
