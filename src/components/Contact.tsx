import Image from 'next/image'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'
import { photos, photoSrc } from '@/lib/photos'

/* ---------------------------------------------------------------------------
   Contact
   ---------------------------------------------------------------------------
   The enquiry form is gone. It posted to /api/enquiry, which validated the
   payload and logged it — and never sent mail, because no provider was ever
   wired up. Every enquiry submitted through it was silently dropped. Three
   routes that actually reach a phone beat one that looks official and goes
   nowhere, so this is now a phone number, a WhatsApp thread and an address.

   WhatsApp is shown to everyone rather than sniffed onto mobile only. wa.me
   resolves to the native app on a phone and to WhatsApp Web on a desktop, so
   the link already does the right thing per device; hiding it on desktop would
   only remove a working option from someone who has WhatsApp open in a tab.

   Set on a full-bleed night photograph: this is the last thing on the page
   before the footer, and the brief asked it to land. Text contrast over the
   photo is handled the same way as the hero — a measured scrim, verified
   against real rendered pixels by scripts/a11y-audit.mjs rather than guessed.
--------------------------------------------------------------------------- */

const BACKDROP = 'pool-night-lit.jpg'

export function Contact({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  const photo = photos.find((p) => p.file === BACKDROP)

  const waHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    d.contact.whatsappMessage,
  )}`

  return (
    /* `on-dark` switches focus rings to champagne (5.62:1 on espresso). */
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="on-dark relative isolate overflow-hidden bg-espresso py-24 text-sand md:py-32 lg:py-40"
    >
      {photo && (
        <Image
          src={photoSrc(photo)}
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="100vw"
          className="-z-10 object-cover"
        />
      )}

      {/*
        Contrast scrim.

        Flat rather than the hero's bottom-weighted gradient, because text here
        runs the full height of the band rather than sitting in the lower third,
        so there is no quiet region to lighten. 0.74 was chosen by measuring the
        worst case: sand over the brightest pixel in the photograph (the lit
        pool) still clears the 4.5:1 body-text floor with room to spare, and at
        26% the water keeps enough glow to be worth having behind the text.

        As in the hero, champagne is unsafe over this — it lands near 3.2:1 on
        the bright water — so the eyebrow below is overridden to sand.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[rgba(31,27,23,0.74)]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow !text-sand">{d.contact.eyebrow}</p>
            <h2
              id="contact-heading"
              className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em] text-sand"
            >
              {d.contact.heading}
            </h2>
            <p className="mt-6 max-w-prose text-pretty text-sand">{d.contact.body}</p>
            <p className="mt-4 text-sm text-sand/90">{d.contact.responseNote}</p>
          </Reveal>

          <RevealGroup className="lg:col-span-6 lg:col-start-7" stagger={0.1}>
            {/* Same pair as the hero, in the same order and the same shapes.
                A visitor who scrolled past "Call us / Message us" at the top
                should meet the same two controls at the bottom rather than a
                differently-worded variant of them. */}
            <RevealItem className="flex flex-wrap items-center gap-3">
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
                {d.contact.callLabel}
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
                {d.contact.whatsappLabel}
                <span className="sr-only"> WhatsApp {d.opensNewTab}</span>
              </a>
            </RevealItem>

            {/* The phone number itself, large. The buttons above are the action;
                this is the number you write down. */}
            <RevealItem className="mt-10">
              <a
                href={`tel:${site.contact.phone}`}
                className="inline-block cursor-pointer text-[clamp(1.6rem,3.4vw,2.25rem)] font-light tracking-[-0.01em] text-sand underline decoration-sand/30 underline-offset-[6px] transition-colors duration-200 hover:text-white hover:decoration-white"
              >
                {site.contact.phoneDisplay}
              </a>
            </RevealItem>

            <RevealItem className="mt-8">
              <p className="text-sm text-sand/90">{d.contact.emailIntro}</p>
              {/* break-all, not break-words: the address is one long token with
                  no spaces, so only a mid-word break keeps it inside a 320px
                  viewport. */}
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-1.5 inline-block cursor-pointer break-all text-[clamp(1.05rem,2.2vw,1.35rem)] font-light tracking-[-0.01em] text-sand underline decoration-sand/30 underline-offset-[6px] transition-colors duration-200 hover:text-white hover:decoration-white"
              >
                {site.contact.email}
              </a>
            </RevealItem>

            <RevealItem className="mt-10 border-t border-sand/20 pt-8">
              <p className="eyebrow !text-sand">{d.contact.addressLabel}</p>
              {/* The address IS the map link — a separate "open in Maps" line
                  would be a second control doing the same job. */}
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target mt-1 inline-flex cursor-pointer items-center gap-2 text-sand underline decoration-sand/40 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
              >
                {d.contact.mapLink}
                <span className="sr-only">
                  {' '}
                  {locale === 'en' ? 'on Google Maps' : 'στους Χάρτες Google'} {d.opensNewTab}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 3h7v7M13 3L4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
