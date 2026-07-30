import Image from 'next/image'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { villas, sharedFeatures } from '@/lib/site'

/* ---------------------------------------------------------------------------
   Villas
   ---------------------------------------------------------------------------
   The brief's hardest constraint: three near-identical villas, and the visitor
   must spot the difference at a glance without reading all three.

   Solution — state what they SHARE exactly once, above the cards, then give
   each card a single highlighted "what's different here" line. The shared list
   never repeats, so the only prose that varies between cards is the
   differentiator itself. Scanning the three cards therefore reads as a
   three-item comparison rather than three brochures.
--------------------------------------------------------------------------- */

export function Villas() {
  return (
    <section
      id="villas"
      aria-labelledby="villas-heading"
      className="bg-sand py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The three villas</p>
          <h2
            id="villas-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            Alike by design. Chosen by detail.
          </h2>
          <p className="mt-6 max-w-prose text-pretty">
            All three villas share the same specification, so you are not
            trading anything away by picking one over another. Only the last
            line of each card differs — that is the deciding detail.
          </p>
        </Reveal>

        {/* Shared spec, stated once. */}
        <Reveal className="mt-12">
          <h3 className="eyebrow">In every villa</h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-bronze/20 pt-4">
            {sharedFeatures.map((feature) => (
              <li key={feature} className="text-sm text-bronze-deep">
                {feature}
              </li>
            ))}
          </ul>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {villas.map((villa) => (
            <RevealItem
              as="li"
              key={villa.id}
              className="flex flex-col border border-bronze/20 bg-cream p-7"
            >
              <Image
                src={villa.logo}
                alt=""
                aria-hidden="true"
                width={220}
                height={120}
                className="h-12 w-auto"
              />

              <h3 className="mt-6 text-xl font-medium tracking-[-0.01em]">
                {villa.name}
              </h3>

              {/* Separators are borders on the wrapper divs, not text nodes: a
                  <dl> may only contain dt/dd pairs or divs wrapping them, so a
                  <div>·</div> between groups is invalid markup (axe flags it as
                  a serious `definition-list` violation). */}
              <dl className="mt-3 flex flex-wrap items-center text-sm text-bronze-deep">
                <div className="pr-3">
                  <dt className="sr-only">Size</dt>
                  <dd>{villa.size}</dd>
                </div>
                <div className="border-l border-bronze/30 px-3">
                  <dt className="sr-only">Sleeps</dt>
                  <dd>{villa.guests}</dd>
                </div>
                <div className="border-l border-bronze/30 pl-3">
                  <dt className="sr-only">Bedrooms</dt>
                  <dd>{villa.bedrooms}</dd>
                </div>
              </dl>

              <p className="mt-5 text-pretty text-sm leading-relaxed">
                {villa.description}
              </p>

              {/* The differentiator — the one line that varies. Given its own
                  rule and label so the eye lands on it while scanning. */}
              <div className="mt-auto border-t border-bronze/20 pt-5">
                <p className="eyebrow">What's different</p>
                <p className="mt-2 text-pretty text-sm font-medium leading-relaxed text-ink">
                  {villa.differentiator}
                </p>
              </div>

              {/* Deep-links to the gallery pre-filtered to this villa. A real
                  href, so it works without JS and is keyboard-navigable. */}
              <a
                href={`#gallery-${villa.id}`}
                className="tap-target mt-6 inline-flex cursor-pointer items-center gap-2 self-start text-sm font-medium text-bronze-deep underline decoration-bronze/40 underline-offset-4 transition-colors duration-200 hover:text-bronze hover:decoration-bronze"
              >
                See {villa.name} photographs
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
