'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { site } from '@/lib/site'
import { useHeroVariants, useStaggerVariants } from '@/lib/motion'
import { getDictionary, type Locale } from '@/lib/i18n'
import { heroPhoto, photoSrc } from '@/lib/photos'

export function Hero({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  const item = useHeroVariants()
  /* Entrance plays on load, so this uses `animate` rather than `whileInView`.
     Under reduced motion useStaggerVariants zeroes both stagger and delay. */
  const group = useStaggerVariants(0.12, 0.15)

  return (
    <section
      /* `on-dark` switches focus rings to champagne for the CTA below. */
      className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-espresso"
      aria-labelledby="hero-heading"
    >
      {/* Full-bleed backdrop. alt="" because the hero image is decorative —
          the headline beside it already conveys the message, and describing
          the photo again would just delay a screen-reader user. */}
      <Image
        src={photoSrc(heroPhoto)}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/*
        Contrast scrim — weighted to the BOTTOM, where the text sits.

        A flat 85–95% wash across the whole image did meet AA, but it buried the
        photograph: at that opacity the villa was barely visible, which defeats
        having a hero image at all. The scrim only needs to be heavy where text
        overlaps it.

        This became possible once the header was made opaque. Previously the
        header was transparent and relied on this scrim for its own contrast, so
        the top had to stay dark too. The header now supplies its own background,
        which frees the top of the image to be seen.

        Stops are measured, not eyeballed. The text block spans roughly 39%–86%
        of the hero's height (eyebrow down to CTA), i.e. 14%–61% measured from
        the bottom. The gradient therefore holds >=0.85 alpha up to 65% from the
        bottom, and only lightens above that:

            0%  (bottom) 0.95    -> sand 11.4:1 worst case
           45%           0.92
           65%           0.85    -> sand  8.2:1 worst case, still AA
           85%           0.45    -> no text here
          100% (top)     0.25    -> photograph clearly visible

        scripts/a11y-audit.mjs verifies this by sampling the ACTUAL rendered
        pixels behind each text element rather than trusting these numbers, so
        changing the hero photo cannot silently break contrast.

        Champagne is still unsafe for small text anywhere over this scrim, so the
        eyebrow below is overridden to sand.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(31,27,23,0.95)_0%,rgba(31,27,23,0.92)_45%,rgba(31,27,23,0.85)_65%,rgba(31,27,23,0.45)_85%,rgba(31,27,23,0.25)_100%)]"
      />

      <motion.div
        data-reveal
        className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 sm:pb-28"
        variants={group}
        initial="hidden"
        animate="visible"
      >
        <motion.p data-reveal variants={item} className="eyebrow !text-sand">
          {d.hero.location}
        </motion.p>

        <motion.h1
          data-reveal
          variants={item}
          id="hero-heading"
          className="mt-5 max-w-3xl text-balance text-[clamp(2.25rem,6.5vw,5rem)] font-extralight leading-[1.05] tracking-[-0.02em] text-sand"
        >
          {d.hero.headline}
        </motion.h1>

        <motion.p
          data-reveal
          variants={item}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-sand/90 sm:text-lg"
        >
          {d.hero.subtext}
        </motion.p>

        <motion.div data-reveal variants={item} className="mt-10">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target group inline-flex cursor-pointer items-center gap-3 rounded-sm bg-sand px-7 text-sm font-medium tracking-wide text-espresso transition-colors duration-200 hover:bg-champagne"
          >
            {d.hero.cta}
            <span className="sr-only">
              {' '}
              {d.bookOnBooking} {d.opensNewTab}
            </span>
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
