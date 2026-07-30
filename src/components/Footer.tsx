import Image from 'next/image'
import { site } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()

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
            <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-sand/90">
              Three private villas between Mount Olympus and the Aegean.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow">Stay</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-champagne">Check-in</dt>
                <dd>{site.stayPolicy.checkIn}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-champagne">Check-out</dt>
                <dd>{site.stayPolicy.checkOut}</dd>
              </div>
            </dl>
            <ul className="mt-5 space-y-1.5 text-sm text-sand/90">
              {site.stayPolicy.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="eyebrow">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="cursor-pointer underline decoration-champagne/40 underline-offset-4 transition-colors duration-200 hover:text-champagne hover:decoration-champagne"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>{site.contact.phone}</li>
              <li className="text-sand/90">{site.contact.address}</li>
            </ul>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target mt-6 inline-flex cursor-pointer items-center rounded-sm border border-champagne px-5 text-sm font-medium transition-colors duration-200 hover:bg-champagne hover:text-espresso"
            >
              Book
              <span className="sr-only"> on Booking.com (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-champagne/20 pt-6 text-xs text-sand/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  )
}
