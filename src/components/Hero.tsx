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

        Stops are measured, not eyeballed. The gradient holds a heavy alpha up to
        the highest point any text reaches, then lightens sharply above it:

            0%  (bottom) 0.82
           45%           0.78
           74%           0.68    -> highest point text reaches, in Greek
           90%           0.30    -> no text here
          100% (top)     0.08    -> photograph essentially unveiled

        The 74% stop is set by the GREEK copy, not the English: Greek runs longer,
        so its heading wraps to an extra line and pushes the whole block upward
        into lighter gradient. Tuned to the longer locale, verified on both.

        scripts/a11y-audit.mjs verifies this by sampling the ACTUAL rendered
        pixels behind each text element rather than trusting these numbers, so
        changing the hero photo cannot silently break contrast.

        Champagne is still unsafe for small text anywhere over this scrim, so the
        eyebrow below is overridden to sand.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(31,27,23,0.82)_0%,rgba(31,27,23,0.78)_45%,rgba(31,27,23,0.68)_74%,rgba(31,27,23,0.30)_90%,rgba(31,27,23,0.08)_100%)]"
      />

      {/*
        Second, LOCALISED wash behind the text column.

        Lightening the vertical scrim dropped the 12px eyebrow to 3.76:1 against
        a bright window in the photograph — measured, not guessed. Re-darkening
        the whole image would have undone the point of lightening it, so instead
        this darkens only the left third, where all the text sits. The pool and
        architecture on the right stay bright.

        Alphas compose, so this lifts the text column without touching the rest:
        where the vertical scrim is 0.68, adding 0.70 here yields an effective
        1-(1-0.68)(1-0.70) = 0.90 exactly where it is needed. Every figure is
        confirmed by the pixel sampler in scripts/a11y-audit.mjs.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(31,27,23,0.70)_0%,rgba(31,27,23,0.55)_38%,rgba(31,27,23,0)_72%)]"
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
          className="mt-5 max-w-3xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-extralight leading-[1.05] tracking-[-0.02em] text-sand"
        >
          {d.hero.headline}
        </motion.h1>

        {/* Subheading. A <p>, not an h2 — it restates the promise rather than
            titling a new section, and an h2 here would sit above the real
            section headings in the outline for no reason. */}
        <motion.p
          data-reveal
          variants={item}
          className="mt-5 max-w-xl text-pretty text-lg font-light leading-snug text-sand sm:text-xl"
        >
          {d.hero.subheading}
        </motion.p>

        {/* Three short lines, each on its own row — the quiet three-beat rhythm
            is the point, so they are not merged into a paragraph. */}
        <motion.div
          data-reveal
          variants={item}
          className="mt-7 max-w-md space-y-1.5 text-sm leading-relaxed text-sand/90 sm:text-base"
        >
          {d.hero.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </motion.div>

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
