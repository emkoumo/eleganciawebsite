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
  /* `scrolled` swaps the header from a transparent overlay on the hero to a
     solid surface. Solid matters for contrast: over a photograph we can only
     guarantee AA because the hero paints a minimum 85% espresso scrim beneath
     this bar (see the measurements in Hero.tsx). Once past the hero there is no
     scrim, so the header must supply its own opaque background.

     Hover colour is white, not champagne: champagne reaches only 3.53:1 against
     the scrim, below the 4.5:1 small-text floor. */
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  /* The header sits on dark ground in both states (scrim over hero, solid
     espresso after), so `on-dark` keeps focus rings champagne throughout. */
  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-espresso' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <a
          href="#main"
          aria-label={`${site.name} — back to top`}
          className="flex shrink-0 items-center"
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
