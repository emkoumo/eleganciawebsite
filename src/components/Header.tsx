'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { site } from '@/lib/site'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'

export function Header({ locale }: { locale: Locale }) {
  /* ---------------------------------------------------------------------
     This header is ALWAYS opaque. It previously started transparent over the
     hero and went solid on scroll, which was wrong twice over:

       1. Contrast. The dark look came from the hero's absolutely-positioned
          scrim — a SIBLING subtree, not an ancestor — so sand nav text
          actually resolved against <body>'s cream at 1.22:1. WAVE flagged
          every nav link; it only looked fine because the hero painted dark
          pixels behind it.
       2. No-JS. The solid state was React state driven by a scroll listener,
          so with JS disabled the header stayed transparent forever and the
          navigation became invisible over the cream sections.

     A semi-transparent background does not fix this: contrast can only resolve
     against an opaque ancestor, so any alpha below 1 still falls through to
     body. Opaque is the only honest answer.

     Hover is white, not champagne — champagne reaches only 3.53:1 over the
     hero scrim, below the 4.5:1 small-text floor.
     --------------------------------------------------------------------- */
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const d = getDictionary(locale)
  const other: Locale = locale === 'en' ? 'el' : 'en'
  const home = localePath(locale)

  const navLinks = [
    { href: '#about', label: d.nav.about },
    { href: '#amenities', label: d.nav.amenities },
    { href: '#gallery', label: d.nav.gallery },
    { href: '#contact', label: d.nav.contact },
  ]

  /* Escape closes the mobile menu and returns focus to the toggle that opened
     it, so keyboard focus is never left orphaned. */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  /* Solid espresso throughout, so `on-dark` keeps focus rings champagne and
     every pairing resolves against a known opaque background:
     sand 12.97:1, champagne 5.62:1, white 12.63:1. */
  return (
    <header className="on-dark fixed inset-x-0 top-0 z-40 border-b border-champagne/15 bg-espresso">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a
          href={home}
          aria-label={`${site.name} — ${locale === 'en' ? 'home' : 'αρχική'}`}
          /* text-sand so anything inheriting from this link stays legible on
             the espresso bar rather than inheriting body's ink at 1.37:1. */
          className="flex shrink-0 items-center text-sand"
        >
          <Image
            src="/logos/elegancia-logo-light.svg"
            alt=""
            width={545}
            height={138}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <span className="sr-only">{site.name}</span>
        </a>

        <nav aria-label={locale === 'en' ? 'Primary' : 'Κύρια πλοήγηση'} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="tap-target flex items-center px-3 text-sm font-normal text-sand transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <LocaleSwitch locale={other} label={d.switchTo} aria={d.switchToAria} />
            </li>
            <li className="ml-1">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target inline-flex cursor-pointer items-center rounded-sm border border-champagne px-5 text-sm font-medium text-sand transition-colors duration-200 hover:bg-champagne hover:text-espresso"
              >
                {d.nav.book}
                <span className="sr-only">
                  {' '}
                  {d.bookOnBooking} {d.opensNewTab}
                </span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <LocaleSwitch locale={other} label={d.switchTo} aria={d.switchToAria} />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="tap-target -mr-2 flex cursor-pointer items-center justify-center text-sand"
          >
            <span className="sr-only">
              {menuOpen
                ? locale === 'en' ? 'Close menu' : 'Κλείσιμο μενού'
                : locale === 'en' ? 'Open menu' : 'Άνοιγμα μενού'}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* `hidden` keeps the closed menu out of the tab order entirely. */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-champagne/20 bg-espresso lg:hidden"
      >
        <nav aria-label={locale === 'en' ? 'Primary (mobile)' : 'Κύρια πλοήγηση (κινητό)'}>
          <ul className="mx-auto max-w-6xl px-6 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="tap-target flex items-center border-b border-champagne/15 text-base text-sand transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="py-4">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="tap-target inline-flex cursor-pointer items-center rounded-sm border border-champagne px-5 text-sm font-medium text-sand"
              >
                {d.nav.book}
                <span className="sr-only">
                  {' '}
                  {d.bookOnBooking} {d.opensNewTab}
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

/* A plain link, not a button: switching locale is a navigation to a different
   URL, so it must behave like one (middle-click, open in new tab, bookmark).
   hrefLang tells assistive tech and crawlers what is on the other end. */
function LocaleSwitch({
  locale,
  label,
  aria,
}: {
  locale: Locale
  label: string
  aria: string
}) {
  return (
    <a
      href={localePath(locale)}
      hrefLang={locale}
      lang={locale}
      aria-label={aria}
      className="tap-target inline-flex cursor-pointer items-center px-3 text-sm font-medium text-champagne transition-colors duration-200 hover:text-white"
    >
      {label}
    </a>
  )
}
