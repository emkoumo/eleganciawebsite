'use client'

import { motion } from 'framer-motion'
import { useRevealGate, useRevealVariants, useStaggerVariants } from '@/lib/motion'

/* ---------------------------------------------------------------------------
   Reveal / RevealGroup / RevealItem
   ---------------------------------------------------------------------------
   Thin wrappers over Motion that pull their variants from @/lib/motion, where
   the prefers-reduced-motion fallback is already applied. Components use these
   instead of raw <motion.div> so a reveal can't ship without a fallback.

   These used `whileInView` + `initial="hidden"`, which made Motion serialise an
   inline `opacity: 0` into the server HTML for every reveal on the page. They
   now drive `animate` from useRevealGate instead: the resting state is visible,
   and the hidden state is armed on the client before first paint. See the hook
   for why that matters. `initial={false}` is what stops Motion writing any
   initial state into the markup.

   The gate fires once and disconnects, which satisfies the brief's "once per
   element, not looping" requirement.
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
  const { ref, animate } = useRevealGate()
  const Component = motion[as]

  return (
    <Component
      ref={ref as React.Ref<never>}
      data-reveal
      className={className}
      variants={variants}
      initial={false}
      animate={animate}
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
  const { ref, animate } = useRevealGate()
  const Component = motion[as]

  return (
    <Component
      ref={ref as React.Ref<never>}
      data-reveal
      className={className}
      variants={variants}
      initial={false}
      animate={animate}
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
