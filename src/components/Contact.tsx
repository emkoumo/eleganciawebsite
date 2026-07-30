import { Reveal } from '@/components/Reveal'
import { ContactForm } from '@/components/ContactForm'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'

export function Contact({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-sand py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{d.contact.eyebrow}</p>
            <h2
              id="contact-heading"
              className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em]"
            >
              {d.contact.heading}
            </h2>
            <p className="mt-6 max-w-prose text-pretty">{d.contact.body}</p>

            <dl className="mt-10 space-y-5 border-t border-bronze/25 pt-8 text-sm">
              <div>
                <dt className="eyebrow">{d.contact.emailLabel}</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="cursor-pointer underline decoration-bronze/40 underline-offset-4 transition-colors duration-200 hover:text-bronze hover:decoration-bronze"
                  >
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">{d.contact.phoneLabel}</dt>
                <dd className="mt-1.5">{site.contact.phone}</dd>
              </div>
              <div>
                <dt className="eyebrow">{d.contact.addressLabel}</dt>
                <dd className="mt-1.5">{d.hero.location}</dd>
              </div>
            </dl>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target mt-8 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-bronze-deep underline decoration-bronze/40 underline-offset-4 transition-colors duration-200 hover:text-bronze hover:decoration-bronze"
            >
              {d.contact.bookingLink}
              <span className="sr-only"> {d.opensNewTab}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 3h7v7M13 3L4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7">
            <ContactForm locale={locale} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
