import Image from 'next/image'
import { site } from '@/lib/site'
import { getDictionary, type Locale } from '@/lib/i18n'

export function Footer({ locale }: { locale: Locale }) {
  /* Year is computed at build time. These pages are fully static, so it is
     baked into the HTML — which is correct here (no hydration mismatch), but
     means the footer year updates on the next deploy, not at midnight on
     1 January. Acceptable for a marketing site that redeploys on every edit. */
  const year = new Date().getFullYear()
  const d = getDictionary(locale)

  return (
    /* `on-dark` switches focus rings to champagne (5.62:1 on espresso). */
    <footer className="on-dark bg-espresso py-16 text-sand md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/logos/elegancia-logo-light.svg"
              alt={site.name}
              width={545}
              height={138}
              className="h-10 w-auto"
            />
            {/* The hero's two lines, repeated here as a sign-off. Not headings:
                they restate the promise, they do not title anything, and an h2
                would push into the page outline for no reason.

                The language link that used to sit here has gone — the header
                carries it on every screen, and a second switcher in the footer
                is a second thing to maintain in two places. */}
            <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-sand">
              {d.hero.headline}
            </p>
            <p className="mt-1.5 max-w-xs text-pretty text-sm leading-relaxed text-sand/90">
              {d.hero.subheading}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow">{d.footer.stay}</h2>

            {/* The full rules as a PDF, per locale. The link names the format,
                because a link that silently downloads a file is a surprise. */}
            <a
              href={d.footer.houseRulesPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target mt-3 inline-flex cursor-pointer items-center text-sm font-medium text-champagne underline decoration-champagne/40 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
            >
              {d.footer.houseRules}
              <span className="sr-only"> {d.opensNewTab}</span>
            </a>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-champagne">{d.footer.checkIn}</dt>
                <dd>{site.checkIn}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-champagne">{d.footer.checkOut}</dt>
                <dd>{site.checkOut}</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-4">
            <h2 className="eyebrow">{d.footer.contact}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="cursor-pointer underline decoration-champagne/40 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
                >
                  {site.contact.email}
                </a>
              </li>
              {/* tel: needs the E.164 form; the grouped form is for reading. */}
              <li>
                <a
                  href={`tel:${site.contact.phone}`}
                  className="cursor-pointer underline decoration-champagne/40 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
                >
                  {site.contact.phoneDisplay}
                </a>
              </li>
            </ul>

          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-champagne/20 pt-6 text-xs text-sand/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {d.footer.rights}
          </p>
          <p>{d.hero.location}</p>
        </div>
      </div>
    </footer>
  )
}
