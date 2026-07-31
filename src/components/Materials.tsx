import Image from 'next/image'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { getDictionary, type Locale } from '@/lib/i18n'
import { photos } from '@/lib/photos'

/* ---------------------------------------------------------------------------
   Materials
   ---------------------------------------------------------------------------
   The aesthetics section. Four materials, one close-up each, two or three words
   of caption — the photographs carry it, the words stay out of the way.

   This is also where the tight detail shots earn their place. Taps, a shelf, a
   cushion, a stone wall are weak gallery entries (a visitor scanning for rooms
   scrolls past them) but they are exactly right here, where the subject IS the
   surface.

   Set on espresso rather than another cream/sand band. A single dark section
   mid-page reads as deliberate rather than as a gap, and dark ground is where
   these warm, low-contrast textures actually look expensive.
--------------------------------------------------------------------------- */

export function Materials({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    /* `on-dark` switches focus rings to champagne (5.62:1 on espresso). */
    <section
      id="materials"
      aria-labelledby="materials-heading"
      className="on-dark bg-espresso py-24 text-sand md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{d.materials.eyebrow}</p>
          <h2
            id="materials-heading"
            className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em] text-sand"
          >
            {d.materials.heading}
          </h2>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4"
          stagger={0.09}
        >
          {d.materials.items.map((item) => {
            /* Dimensions come from the manifest so each tile reserves its exact
               aspect ratio and nothing shifts as the images load. */
            const photo = photos.find((p) => p.file === item.photo)
            if (!photo) return null

            return (
              <RevealItem as="li" key={item.name}>
                <div className="overflow-hidden bg-espresso-soft">
                  {/* Decorative: the material name sits directly beneath as
                      real text, so alt would only repeat it. */}
                  <Image
                    src={`/images/gallery/${photo.file}`}
                    alt=""
                    aria-hidden="true"
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 text-base font-normal text-sand">{item.name}</h3>
                {/* champagne on espresso = 5.62:1 */}
                <p className="mt-1.5 text-sm leading-relaxed text-champagne">
                  {item.note}
                </p>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
