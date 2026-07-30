'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { site } from '@/lib/site'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#villas', label: 'The Villas' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  /* ---------------------------------------------------------------------
     This header is ALWAYS opaque. It previously started transparent over the
     hero and went solid on scroll, which was wrong twice over:

       1. Contrast. The dark look came from the hero's absolutely-positioned
          scrim — a sibling subtree, not an ancestor. So sand nav text actually
          resolved against <body>'s cream at 1.22:1. Every automated checker
          reports that correctly (WAVE flagged all six nav links); it only
          *looked* fine because the hero painted dark pixels behind it.
       2. No-JS. The solid state was React state driven by a scroll listener,
          so with JS disabled the header stayed transparent forever — scroll to
          the cream sections and the navigation became invisible.

     A semi-transparent background does not fix this: contrast can only be
     computed against an opaque ancestor, so anything below alpha 1 still
     resolves to body. Opaque is the only honest answer.

     Hover colour is white rather than champagne, which reaches only 3.53:1
     over the hero scrim — below the 4.5:1 small-text floor.
     --------------------------------------------------------------------- */
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

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
     every text pairing here resolves against a known opaque background:
     sand 12.97:1, champagne 5.62:1, white 12.63:1. */
  return (
    <header className="on-dark fixed inset-x-0 top-0 z-40 border-b border-champagne/15 bg-espresso">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        {/* Links to "/" rather than "#main": pointing it at #main duplicated the
            skip link's destination, which WAVE reports as a redundant link. */}
        <a
          href="/"
          aria-label={`${site.name} — home`}
          /* text-sand so any text inheriting from this link is legible on the
             espresso bar, rather than inheriting body's ink at 1.37:1. */
          className="flex shrink-0 items-center text-sand"
        >
          {/* Light logo variant: champagne + sand, for dark backgrounds. */}
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

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="tap-target flex items-center px-4 text-sm font-normal text-sand transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target inline-flex cursor-pointer items-center rounded-sm border border-champagne px-5 text-sm font-medium text-sand transition-colors duration-200 hover:bg-champagne hover:text-espresso"
              >
                Book
                <span className="sr-only"> on Booking.com (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="tap-target -mr-2 flex cursor-pointer items-center justify-center text-sand md:hidden"
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
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

      {/* Mobile menu. Rendered but hidden when closed so the markup stays in
          DOM order; `hidden` keeps it out of the tab order entirely. */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-champagne/20 bg-espresso md:hidden"
      >
        <nav aria-label="Primary (mobile)">
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
                Book
                <span className="sr-only"> on Booking.com (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
