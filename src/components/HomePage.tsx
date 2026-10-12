import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Highlights } from '@/components/Highlights'
import { Gallery } from '@/components/Gallery'
import { Contact } from '@/components/Contact'
import type { Locale } from '@/lib/i18n'

/* One page, shared by both locales.

   Five sections, down from seven. Materials was cut — four close-ups with
   captions could not justify a full band, and its photographs are better value
   inside the gallery, where they now live. Amenities was folded into
   Highlights, which had been listing a twelve-item subset of it directly above.

   Surfaces: espresso hero, cream (About), sand (Highlights), cream (Gallery),
   then Contact closes on a full-bleed night photograph. The dark open and dark
   close bracket the light middle.

   Heading hierarchy: one h1 (hero), then one h2 per section. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Highlights locale={locale} />
      <Gallery locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
