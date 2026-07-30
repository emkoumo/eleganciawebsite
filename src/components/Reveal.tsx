'use client'

import { motion } from 'motion/react'
import { useRevealVariants, useStaggerVariants, revealViewport } from '@/lib/motion'

/* ---------------------------------------------------------------------------
   Reveal / RevealGroup / RevealItem
   ---------------------------------------------------------------------------
   Thin wrappers over Motion that pull their variants from @/lib/motion, where
   the prefers-reduced-motion fallback is already applied. Components use these
   instead of raw <motion.div> so a reveal can't ship without a fallback.

   `once: true` on the viewport satisfies the brief's "once per element, not
   looping" requirement.
--------------------------------------------------------------------------- */

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Vertical travel in px. Ignored under reduced motion. */
  distance?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span'
}

export function Reveal({
  children,
  className,
  distance = 24,
  as = 'div',
}: RevealProps) {
  const variants = useRevealVariants(distance)
  const Component = motion[as]

  return (
    <Component
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </Component>
  )
}

/** Parent that staggers RevealItem children as the group enters the viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  as?: 'div' | 'ul' | 'section'
}) {
  const variants = useStaggerVariants(stagger)
  const Component = motion[as]

  return (
    <Component
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </Component>
  )
}

/** Child of RevealGroup. Inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  distance = 20,
  as = 'div',
}: RevealProps) {
  const variants = useRevealVariants(distance)
  const Component = motion[as]

  return (
    <Component data-reveal className={className} variants={variants}>
      {children}
    </Component>
  )
}
