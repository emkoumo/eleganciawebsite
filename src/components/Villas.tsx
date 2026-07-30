import Image from 'next/image'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   Villas
   ---------------------------------------------------------------------------
   Deliberately NOT three cards.

   The three villas are identical in layout, size and specification, so three
   cards would be three copies of the same content — which forces the visitor to
   read all of it before discovering there is nothing to choose between. Worse,
   presenting them as separate offers implies a difference that does not exist,
   and the visitor then hunts for the catch.

   So this states the fact once and shows the three marks as branding. The
   actionable takeaway — "choose on availability alone" — is the point.
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

        <RevealGroup
          as="ul"
          className="mt-14 grid grid-cols-3 gap-6 border-t border-bronze/20 pt-10"
          stagger={0.1}
        >
          {d.villas.names.map((name, i) => (
            <RevealItem as="li" key={name} className="flex flex-col items-center text-center">
              {/* Logo is decorative: the villa name sits right beneath it as
                  real text, so alt would only repeat it. */}
              <Image
                src={site.villaLogos[i]}
                alt=""
                aria-hidden="true"
                width={220}
                height={120}
                className="h-10 w-auto sm:h-12"
              />
              <p className="mt-4 text-sm font-medium sm:text-base">{name}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-bronze-deep">{d.villas.identical}</p>
        </Reveal>
      </div>
    </section>
  )
}
