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
        /* The photograph is portrait (1800x2400) and the hero is far wider than
           it is tall on desktop but narrower on a phone, so `cover` crops a
           different axis at each end. On a phone it trims ~240px horizontally,
           and centring that trim cut the swimming pool — the subject — off the
           right edge. Biasing the crop to 68% keeps the pool in frame. Desktop
           crops vertically instead, where centre is already right. */
        className="-z-10 object-cover object-[68%_center] sm:object-center"
      />

      {/*
        Global wash — deliberately light.

        This used to be two heavy full-frame scrims: a vertical one running to
        0.82 at the bottom and a horizontal one adding another 0.70 on the left,
        compositing to 0.95 behind the text. They met AA comfortably and buried
        the photograph doing it, because a veil that covers everything has to be
        heavy enough for the brightest thing it covers.

        All the contrast work now happens in the pool below, which only covers
        the words. What is left here is cohesion, not contrast: just enough to
        seat the photograph in the page and keep the bottom edge from competing
        with the section beneath it. Nothing on this layer is load-bearing for
        accessibility, which is why it can be this transparent.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(31,27,23,0.18)_0%,rgba(31,27,23,0.10)_45%,rgba(31,27,23,0.05)_75%,rgba(31,27,23,0.02)_100%)]"
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
        {/*
          `isolate` so the pool's -z-10 lands behind this text but still above
          the photograph and the wash, both of which sit outside this element.

          max-w-3xl matches the widest thing inside (the h1), so the pool's
          percentages are measured against the text's own box rather than the
          viewport. That is what lets a single set of stops hold on a 360px
          phone and a 1440px desktop, where the text is 90% and 53% of the
          width respectively.

          Variants still reach the children through this plain div: Motion
          propagates them down the React tree by context, not by DOM parentage.
        */}
        <div className="relative isolate max-w-3xl">
          <div
            aria-hidden="true"
            /* Flat fill, soft mask. Extends past the text on every side so the
               falloff happens outside the glyphs rather than across them. */
            className="hero-pool pointer-events-none absolute -inset-[50%] -z-10 bg-[rgba(31,27,23,0.76)]"
          />

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
        </div>
      </motion.div>
    </section>
  )
}
