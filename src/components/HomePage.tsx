import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Materials } from '@/components/Materials'
import { Highlights } from '@/components/Highlights'
import { Amenities } from '@/components/Amenities'
import { Gallery } from '@/components/Gallery'
import { Contact } from '@/components/Contact'
import type { Locale } from '@/lib/i18n'

/* One page, shared by both locales.

   Surfaces: espresso hero, then cream / sand alternating, with Materials as a
   second espresso band mid-page. The dark band breaks the light rhythm on
   purpose — it separates "about the place" from "what you get", and gives the
   material close-ups a ground they read well against.

   Heading hierarchy: one h1 (hero), then one h2 per section. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Materials locale={locale} />
      <Highlights locale={locale} />
      <Amenities locale={locale} />
      <Gallery locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
