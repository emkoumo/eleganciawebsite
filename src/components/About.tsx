import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { getDictionary, type Locale } from '@/lib/i18n'

export function About({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-cream py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{d.about.eyebrow}</p>
            <h2
              id="about-heading"
              className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
            >
              {d.about.heading}
            </h2>
          </Reveal>

          {/* max-w-prose keeps measure inside the 65–75 character band. */}
          <RevealGroup className="space-y-6 lg:col-span-6 lg:col-start-7" stagger={0.12}>
            {d.about.paragraphs.map((paragraph, i) => (
              <RevealItem as="p" key={i} className="max-w-prose text-pretty">
                {paragraph}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
