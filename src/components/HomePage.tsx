import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Villas } from '@/components/Villas'
import { Highlights } from '@/components/Highlights'
import { Amenities } from '@/components/Amenities'
import { Gallery } from '@/components/Gallery'
import { Contact } from '@/components/Contact'
import type { Locale } from '@/lib/i18n'

/* One page, shared by both locales. Surfaces alternate cream / sand so each
   section reads as a distinct band without heavy dividers.
   Heading hierarchy: one h1 (hero), then one h2 per section. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Villas locale={locale} />
      <Highlights locale={locale} />
      <Amenities locale={locale} />
      <Gallery locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
