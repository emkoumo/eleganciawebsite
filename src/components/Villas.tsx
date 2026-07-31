import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { getDictionary, type Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   Villas
   ---------------------------------------------------------------------------
   Deliberately NOT three cards, and no longer three logo marks either.

   Three identical villas means three cards would be three copies of the same
   content, and would imply a difference that does not exist. But a row of three
   logos was no better: it repeated "Villa 1, Villa 2, Villa 3" without telling
   the visitor anything they could act on.

   What IS worth saying is that identical villas COMBINE. One villa sleeps six;
   the whole complex sleeps eighteen with nobody else on site. That reframes the
   sameness as capacity rather than as an apology, and answers the question a
   group actually arrives with. So this is a capacity ladder: 6 → 12 → 18.
--------------------------------------------------------------------------- */

export function Villas({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="villas"
      aria-labelledby="villas-heading"
      className="bg-sand py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{d.villas.eyebrow}</p>
          <h2
            id="villas-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            {d.villas.heading}
          </h2>
          <p className="mt-6 max-w-prose text-pretty">{d.villas.body}</p>
        </Reveal>

        {/* A definition list, because each row genuinely is term → description:
            the scale ("Two villas") defines what you get. */}
        <RevealGroup
          as="ul"
          className="mt-14 grid gap-px overflow-hidden border border-bronze/20 bg-bronze/20 sm:grid-cols-3"
          stagger={0.1}
        >
          {d.villas.capacity.map((step, i) => (
            <RevealItem as="li" key={step.villas} className="bg-cream p-7">
              <p className="eyebrow">{step.villas}</p>
              {/* The number is the whole point, so it carries the visual
                  weight — extralight at display size, the same voice as the
                  hero headline. */}
              <p className="mt-4 text-[clamp(2.25rem,4vw,3.25rem)] font-extralight leading-none tracking-[-0.02em]">
                {step.guests.replace(/[^0-9]/g, '')}
                <span className="ml-2 align-baseline text-sm font-normal tracking-normal text-bronze-deep">
                  {step.guests.replace(/[0-9\s]/g, '')}
                </span>
              </p>
              <p className="mt-5 text-pretty text-sm leading-relaxed text-ink">
                {step.note}
              </p>
              {/* Villa names appear once, on the first row, where they are
                  context rather than a list to read. */}
              {i === 0 && (
                <p className="mt-5 border-t border-bronze/20 pt-4 text-xs text-bronze-deep">
                  {d.villas.names.join(' · ')}
                </p>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
