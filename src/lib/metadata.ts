import type { Metadata, Viewport } from 'next'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'
import { heroPhoto } from '@/lib/photos'

/* ---------------------------------------------------------------------------
   Per-locale metadata.

   `alternates.languages` emits the hreflang pair, which is what tells search
   engines these two URLs are the same page in different languages rather than
   duplicate content. x-default points at English as the primary locale.
--------------------------------------------------------------------------- */

/* The description used to be built by joining the hero's three summary lines.
   Those lines are gone, and stitching page copy into search copy was fragile
   anyway — a hero rewrite silently rewrote what Google shows. It is now its
   own string per locale, in the dictionary.
*/
/* The share card is a fixed 1200x630 crop of the hero photograph, made by
   scripts/make-og-image.mjs — the hero itself is portrait and every platform
   would crop it differently. Its alt text is the hero's, per locale. */
const ogImage = { url: '/images/og/og-image.jpg', width: 1200, height: 630 }

export function buildMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale)
  const title = `${site.name} — ${d.hero.location}`
  const ogImages = [{ ...ogImage, alt: heroPhoto.alt[locale] }]

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.name}` },
    description: d.metaDescription,
    alternates: {
      canonical: locale === 'en' ? '/' : '/el',
      languages: {
        en: '/',
        el: '/el',
        'x-default': '/',
      },
    },
    openGraph: {
      title,
      description: d.metaDescription,
      locale: locale === 'en' ? 'en_GB' : 'el_GR',
      alternateLocale: locale === 'en' ? 'el_GR' : 'en_GB',
      type: 'website',
      url: locale === 'en' ? site.url : `${site.url}/el`,
      siteName: site.name,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: d.metaDescription,
      images: ogImages,
    },
    /* Files live in public/images/favicon, not at the root, so they are
       declared here rather than picked up by the app/ file conventions. */
    icons: {
      icon: [
        { url: '/images/favicon/favicon.ico', sizes: 'any' },
        { url: '/images/favicon/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/images/favicon/apple-touch-icon.png',
    },
    manifest: '/images/favicon/site.webmanifest',
    robots: { index: true, follow: true },
  }
}

export const sharedViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* Must track --color-cream in globals.css, or mobile browsers paint a seam
     between their chrome and the page background. */
  themeColor: '#fffbf0',
}
