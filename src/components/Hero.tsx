'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
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

  /* Same wa.me contract as the contact section: the number without the leading
     plus, and a prefilled opener in the reader's language. */
  const waHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    d.contact.whatsappMessage,
  )}`

  return (
    <section
      /* `on-dark` switches focus rings to champagne for the CTA below. */
      /* Exactly one viewport, no more. The header is absolutely positioned on
         top of this section rather than stacked above it, so 100svh here is
         100svh on screen — nothing of the next section shows under the fold,
         and nothing needs to subtract a header height that changes with the
         ESPA strip's width at every breakpoint.

         svh, not vh: on mobile `vh` is the LARGE viewport, measured with the
         browser chrome retracted, so 100vh overflows by the height of the
         address bar on first paint. */
      className="on-dark relative isolate flex min-h-svh items-end overflow-hidden bg-espresso"
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

        `scrim-relief` masks this gradient's own alpha down over the right third
        from lg up, where there is no text to protect — see globals.css. Below
        lg it does nothing, because at phone width the text IS the right third.
      */}
      <div
        aria-hidden="true"
        className="scrim-relief absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(31,27,23,0.82)_0%,rgba(31,27,23,0.78)_45%,rgba(31,27,23,0.68)_74%,rgba(31,27,23,0.30)_90%,rgba(31,27,23,0.08)_100%)]"
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
        /* pt clears the header overlaying this section (ESPA strip + nav row).
           The block is bottom-aligned, so this only bites when the copy is tall
           enough to overflow — on a short phone in Greek — but that is exactly
           the case where text would otherwise slide under the header. */
        className="mx-auto w-full max-w-6xl px-6 pb-20 pt-40 sm:pb-28"
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

        {/*
          Two direct routes instead of one link out to Booking.com.

          The three summary lines that used to sit here were removed: they
          restated the subheading above and the Amenities grid below, and they
          pushed the call to action most of a screen further down.

          Call is primary because it is the fastest answer for someone deciding
          tonight; Message is the same conversation for someone who would
          rather not ring a stranger abroad. Booking.com has not disappeared —
          it is the Book button in the header, on every screen.
        */}
        <motion.div
          data-reveal
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={`tel:${site.contact.phone}`}
            className="tap-target inline-flex cursor-pointer items-center gap-3 rounded-sm bg-sand px-4 text-sm font-medium tracking-wide text-espresso transition-colors duration-200 hover:bg-champagne"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
            </svg>
            {d.hero.ctaCall}
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex cursor-pointer items-center gap-3 rounded-sm border border-sand px-4 text-sm font-medium tracking-wide text-sand transition-colors duration-200 hover:bg-sand hover:text-espresso"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
            </svg>
            {d.hero.ctaMessage}
            <span className="sr-only"> WhatsApp {d.opensNewTab}</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
