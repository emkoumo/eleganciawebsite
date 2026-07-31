import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { getDictionary, type Locale } from '@/lib/i18n'

/* The full inventory, grouped by where you encounter it. Each group is its own
   h3 with its own <ul>, so a screen-reader user can jump between groups and
   hears "list, 8 items" rather than one 27-item run-on. */
export function Amenities({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="amenities"
      aria-labelledby="amenities-heading"
      className="bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{d.amenities.eyebrow}</p>
          <h2
            id="amenities-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
          >
            {d.amenities.heading}
          </h2>
        </Reveal>

        <RevealGroup
          className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {d.amenities.groups.map((group) => (
            <RevealItem key={group.title}>
              <h3 className="eyebrow border-b border-bronze/25 pb-3">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    {/* Decorative tick. The list semantics already convey
                        "these are included", so this is aria-hidden. */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      aria-hidden="true"
                      className="mt-[0.3rem] shrink-0 text-bronze"
                    >
                      <path d="M3 8.5l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-16 border-t border-bronze/20 pt-6">
          <p className="max-w-prose text-sm text-bronze-deep">{d.amenities.stayNote}</p>
        </Reveal>
      </div>
    </section>
  )
}
