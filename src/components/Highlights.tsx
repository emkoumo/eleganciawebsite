import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { amenityIcons } from '@/components/Icons'
import { getDictionary, type Locale } from '@/lib/i18n'

/* ---------------------------------------------------------------------------
   Highlights
   ---------------------------------------------------------------------------
   The whole inventory, in one section, grouped by where you meet it.

   This used to be twelve "highlights" here and a separate Amenities section
   below listing twenty-nine items — which meant the visitor read Private pool,
   2 master bedrooms, Wi-Fi and most of the rest twice, once with an icon and
   once with a tick. The two sections are now one.

   Design is unchanged from the old Highlights: an icon beside every line,
   hairline rule above, bronze mark, same grid rhythm. What changed is that the
   lines are grouped under a heading rather than running as one flat list of
   twelve, because twenty-nine items in a single run is an inventory, not a
   scan.

   Every icon is aria-hidden and paired with a text label — an icon alone
   conveys nothing to a screen reader, and little to plenty of sighted visitors
   either. Each group is its own <ul>, so a screen-reader user hears
   "list, 8 items" per group rather than one 29-item run-on.
--------------------------------------------------------------------------- */
export function Highlights({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
      className="bg-sand py-24 md:py-32 lg:py-40"
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
          className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {d.highlights.groups.map((group) => (
            <RevealItem key={group.title}>
              <h3 className="eyebrow border-b border-bronze/25 pb-3">{group.title}</h3>
              <ul className="mt-5 space-y-4">
                {group.items.map((item) => (
                  /* key on label+icon: "Smart TV" appears in two groups, and
                     within Outdoors no label repeats, so this stays unique. */
                  <li
                    key={`${item.icon}-${item.label}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-px shrink-0 text-bronze">
                      {amenityIcons[item.icon]}
                    </span>
                    <span className="text-sm leading-snug">{item.label}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Check-in window and lockbox note, carried over from Amenities —
            practical enough that losing it with the section would have cost
            the visitor something. */}
        <Reveal className="mt-16 border-t border-bronze/20 pt-6">
          <p className="max-w-prose text-sm text-bronze-deep">{d.highlights.stayNote}</p>
        </Reveal>
      </div>
    </section>
  )
}
