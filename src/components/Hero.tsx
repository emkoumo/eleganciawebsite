'use client'

import { motion } from 'motion/react'
import { site } from '@/lib/site'
import { useHeroVariants, useStaggerVariants } from '@/lib/motion'

const photosReady = process.env.NEXT_PUBLIC_PHOTOS_READY === 'true'

export function Hero() {
  const item = useHeroVariants()
  /* Entrance plays on load, so this uses `animate` rather than `whileInView`.
     The 0.15s delayChildren lets the scrim settle before text arrives; under
     reduced motion useStaggerVariants zeroes both stagger and delay. */
  const group = useStaggerVariants(0.12, 0.15)

  return (
    <section
      /* `on-dark` switches focus rings to champagne for the CTA below. */
      className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-espresso"
      aria-labelledby="hero-heading"
    >
      {/* ---------------------------------------------------------------
          Full-bleed backdrop.
          With no photography available this is a warm espresso wash, which
          reads as a deliberate choice rather than a broken image. When the
          hero photo lands it slots in behind the same scrim.
          --------------------------------------------------------------- */}
      {photosReady ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/hero/complex-aerial-dusk.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,#3a3128_0%,#2b2724_45%,#1f1b17_100%)]"
        />
      )}

      {/*
        Contrast scrim. Text over photography can never be guaranteed to meet AA
        because the photograph is unknown, so this espresso wash sets a contrast
        floor regardless of what sits behind it.

        Measured against the worst possible backdrop (a pure white photo):
          85% scrim -> resolves to #413D3A : sand 8.15:1, champagne 3.53:1
          95% scrim -> resolves to #2A2623 : sand 11.37:1, champagne 4.92:1

        Two consequences, both load-bearing:
          1. Never drop below 85% — at 80% champagne falls to 2.94:1, under even
             the 3:1 floor for UI components.
          2. Champagne is not safe for small text anywhere over this scrim
             (3.53–4.92:1 vs the 4.5:1 needed), so the hero overrides .eyebrow
             to sand. Champagne stays fine on solid espresso elsewhere (5.62:1).
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso/95 via-espresso/90 to-espresso/85"
      />

      <motion.div
        className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 sm:pb-28"
        variants={group}
        initial="hidden"
        animate="visible"
      >
        {/* Overrides .eyebrow's champagne to sand: at 12px over the scrim,
            champagne cannot reach 4.5:1. See the scrim note above. */}
        <motion.p variants={item} className="eyebrow !text-sand">
          {site.location}
        </motion.p>

        <motion.h1
          variants={item}
          id="hero-heading"
          className="mt-5 max-w-3xl text-balance text-[clamp(2.5rem,7vw,5rem)] font-extralight leading-[1.05] tracking-[-0.02em] text-sand"
        >
          {site.hero.headline}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-sand/90 sm:text-lg"
        >
          {site.hero.subtext}
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target group inline-flex cursor-pointer items-center gap-3 rounded-sm bg-sand px-7 text-sm font-medium tracking-wide text-espresso transition-colors duration-200 hover:bg-champagne"
          >
            {site.hero.ctaLabel}
            <span className="sr-only"> on Booking.com (opens in a new tab)</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
