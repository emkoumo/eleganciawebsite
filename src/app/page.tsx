import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Villas } from '@/components/Villas'
import { Amenities } from '@/components/Amenities'
import { Gallery } from '@/components/Gallery'
import { Contact } from '@/components/Contact'

/* One page, in the order the brief specifies. Surfaces alternate cream / sand
   so each section reads as a distinct band without needing heavy dividers.
   Heading hierarchy across the page: one h1 (hero), then one h2 per section. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Villas />
      <Amenities />
      <Gallery />
      <Contact />
    </>
  )
}
