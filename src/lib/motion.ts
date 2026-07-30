'use client'

import { useReducedMotion } from 'motion/react'
import type { Transition, Variants } from 'motion/react'

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
 * Fade + rise, for section content entering the viewport.
 * Reduced motion: fades with no vertical travel.
 */
export function useRevealVariants(distance = 24): Variants {
  const reduce = useReducedMotion()

  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: INSTANT },
    }
  }

  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
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
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.001 } },
    }
  }

  return {
    hidden: { opacity: 0, y: 28 },
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
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: INSTANT },
      exit: { opacity: 0, transition: INSTANT },
    }
  }

  return {
    hidden: { opacity: 0, scale: 0.96 },
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
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: reduce ? INSTANT : { duration: 0.25 } },
    exit: { opacity: 0, transition: reduce ? INSTANT : { duration: 0.2 } },
  }

  const panel: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: INSTANT },
        exit: { opacity: 0, transition: INSTANT },
      }
    : {
        hidden: { opacity: 0, scale: 0.97 },
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
