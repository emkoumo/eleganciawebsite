import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { site } from '@/lib/site'

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">The complex</p>
            <h2
              id="about-heading"
              className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
            >
              A quiet address between mountain and sea
            </h2>
          </Reveal>

          {/* max-w-prose keeps measure inside the 65–75 character band. */}
          <RevealGroup className="space-y-6 lg:col-span-6 lg:col-start-7" stagger={0.12}>
            <RevealItem as="p" className="max-w-prose text-pretty">
              Elegancia is three private villas in {site.location.split(',')[0]},
              set where the foothills of Mount Olympus settle towards the
              Aegean. The complex is small by design — three houses, three
              pools, no shared lobby and no reception desk. What you get instead
              is the quiet of a private residence with the coast a short drive
              away.
            </RevealItem>

            <RevealItem as="p" className="max-w-prose text-pretty">
              Each villa stands on its own plot with a private pool and a garden
              that looks onto it. The three share a single design language, so
              whichever you book the experience is consistent: generous outdoor
              space, a kitchen equipped for real cooking, and rooms that stay
              cool through the middle of the day.
            </RevealItem>

            <RevealItem as="p" className="max-w-prose text-pretty">
              The interiors are deliberately understated — natural stone, pale
              oak, linen and a Mediterranean palette of cream, sand and bronze.
              Nothing competes with the view. The intention throughout is
              restraint rather than display: luxury you notice on the second
              day, not the first.
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
