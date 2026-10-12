import type { Metadata, Viewport } from 'next'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'

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
export function buildMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale)
  const title = `${site.name} — ${d.hero.location}`

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
    },
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
