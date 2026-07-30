import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { amenities } from '@/lib/site'
import { amenityIcons } from '@/components/Icons'

export function Amenities() {
  return (
    <section
      id="amenities"
      aria-labelledby="amenities-heading"
      className="bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Amenities</p>
          <h2
            id="amenities-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            Everything already in place
          </h2>
        </Reveal>

        {/* Icon + label grid. Every icon is aria-hidden and paired with a text
            label — an icon alone conveys nothing to a screen reader, and to
            plenty of sighted visitors either. */}
        <RevealGroup
          as="ul"
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
          stagger={0.07}
        >
          {amenities.map((amenity) => (
            <RevealItem as="li" key={amenity.label} className="flex flex-col items-start">
              <span className="text-bronze">{amenityIcons[amenity.icon]}</span>
              <span className="mt-4 text-sm leading-snug">{amenity.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-16 border-t border-bronze/20 pt-6">
          <p className="max-w-prose text-sm text-bronze-deep">
            Check-in is {' '}
            <span className="whitespace-nowrap">15:00 – 22:00</span> and
            check-out is until 11:00. Full house rules are provided on arrival.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
