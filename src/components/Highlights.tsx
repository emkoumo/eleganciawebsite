import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { amenityIcons } from '@/components/Icons'
import { getDictionary, type Locale } from '@/lib/i18n'

/* The twelve things a visitor decides on. Every icon is aria-hidden and paired
   with a text label — an icon alone conveys nothing to a screen reader, and
   little to plenty of sighted visitors either. */
export function Highlights({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
      className="bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{d.highlights.eyebrow}</p>
          <h2
            id="highlights-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            {d.highlights.heading}
          </h2>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.05}
        >
          {d.highlights.items.map((item) => (
            <RevealItem
              as="li"
              key={item.label}
              className="flex items-start gap-3 border-t border-bronze/20 pt-4"
            >
              <span className="mt-0.5 shrink-0 text-bronze">{amenityIcons[item.icon]}</span>
              <span className="text-sm leading-snug">{item.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
