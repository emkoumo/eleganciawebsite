import Image from 'next/image'
import { getDictionary, type Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   ESPA / EU co-funding banner
   ---------------------------------------------------------------------------
   The EU publicity rules require the acknowledgement to be visible at the top
   of the site, in the language the visitor is reading. The artwork is a single
   lockup (EU emblem + ΕΣΠΑ 2021-2027 + Competitiveness programme), supplied in
   an EL and an EN version; the dictionary picks the right one, so the Greek
   page never shows the English banner and vice versa.

   Rendered inside <header>, which is the `banner` landmark — the right home
   for a funding acknowledgement, and it keeps the image out of the "content
   outside a landmark region" bucket that auditing tools flag.

   Accessibility notes:

     * alt carries the FULL acknowledgement text. This is the one image on the
       site that must not be alt="": the banner is not decoration, it IS the
       statement, and a screen-reader user is entitled to the same information
       a sighted one gets. (By contrast the hero photo and the logo mark are
       decorative or duplicated by adjacent text, so those are alt="".)

     * Not a link. ESPA banners are often wired to espa.gr, but a link here
       would be an unlabelled image link leaving the site, and nothing on the
       page tells the visitor where it goes. The static image says everything
       the rule requires without that cost.

     * The strip is espresso, matching the nav row below it, so the two read as
       one header rather than a white bar stacked on a dark one. The artwork
       keeps its own white ground because it is a JPEG with no alpha — and
       because that is what the EU emblem guidance asks for: on a dark
       background the emblem sits inside a white box rather than being
       recoloured or knocked out. Nothing here is a contrast risk; the only
       text is inside the image, carried by alt.

   Sizing is width-driven (`w-full max-w-[460px]`) rather than height-driven so
   the lockup never overflows a narrow phone: ~39px tall at 360px wide, ~54px
   tall from the small breakpoint up.
--------------------------------------------------------------------------- */
export function EspaBanner({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    /* Flush: no padding of its own, so the artwork's own white margin is the
       only breathing room and the strip is exactly as tall as the image. */
    <div className="border-b border-black bg-espresso">
      <div className="mx-auto flex max-w-6xl justify-center sm:justify-start">
        <Image
          src={d.espa.src}
          alt={d.espa.alt}
          width={1956}
          height={231}
          priority
          sizes="(min-width: 640px) 460px, 100vw"
          className="h-auto w-full max-w-[460px]"
        />
      </div>
    </div>
  )
}
