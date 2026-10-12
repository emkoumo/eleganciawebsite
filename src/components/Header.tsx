'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { EspaBanner } from '@/components/EspaBanner'
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
     --------------------------------------------------------------------- */
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const d = getDictionary(locale)
  const other: Locale = locale === 'en' ? 'el' : 'en'
  const home = localePath(locale)

  const waHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    d.contact.whatsappMessage,
  )}`

  const navLinks = [
    { href: '#about', label: d.nav.about },
    /* The Amenities section was folded into Highlights; the nav label stays
       "Amenities" because that is what a visitor is looking for, but the
       anchor has to follow the content. */
    { href: '#highlights', label: d.nav.amenities },
    { href: '#gallery', label: d.nav.gallery },
    { href: '#contact', label: d.nav.contact },
  ]

  /* restoreFocus is opt-in because returning focus to the toggle makes the
     browser paint a focus ring on it, and after a tap or a click that ring is
     just a box sitting in the header with nothing to explain it. Keyboard
     users still need focus back — losing it would drop them to the top of the
     document — so Escape and keyboard activation pass true, pointer does not. */
  const close = useCallback((restoreFocus = false) => {
    setMenuOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  /* A click event from the keyboard reports detail 0; a real pointer click
     reports 1 or more. */
  const closeFromEvent = useCallback(
    (e: React.MouseEvent) => close(e.detail === 0),
    [close],
  )

  /* Escape closes and returns focus to the toggle, and Tab is kept inside the
     panel. A full-screen overlay that leaves focus behind it is worse than no
     overlay: a keyboard user tabs into links they cannot see. */
  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close(true)
        return
      }
      if (e.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, close])

  /* Lock background scroll while the overlay is up, compensating for the
     scrollbar so the page underneath does not jump sideways. */
  useEffect(() => {
    if (!menuOpen) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [menuOpen])

  /* Move focus into the panel on open, so the first Tab lands on a menu item
     rather than somewhere behind the overlay. */
  useEffect(() => {
    if (!menuOpen) return
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus(),
    )
    return () => cancelAnimationFrame(raf)
  }, [menuOpen])

  /* Reduced motion: the panel still appears, it just stops travelling. The
     brief's contract is opacity-only or instant — no slide, no stagger. */
  const panelVariants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.001 } },
        exit: { opacity: 0, transition: { duration: 0.001 } },
      }
    : {
        hidden: { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
        visible: {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.06,
            delayChildren: 0.18,
          },
        },
        exit: {
          opacity: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
        },
      }

  const itemVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.001 } } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
      }

  return (
    /*
      `absolute`, not `fixed`: the header scrolls away with the page instead of
      following it down, which is what was asked for.

      Still taken out of flow rather than left static, and that is load-bearing.
      It overlays the top of the hero, so header height + hero height is exactly
      one viewport — the hero can simply be min-h-svh and there is no strip of
      the next section showing under it. A static header would stack above the
      hero and push 100svh of photograph partly below the fold.
    */
    <header className="on-dark absolute inset-x-0 top-0 z-40 border-b border-champagne/15 bg-espresso">
      {/* EU/ESPA acknowledgement sits above the nav, inside the banner
          landmark, so the whole dark block reads as one header. */}
      <EspaBanner locale={locale} />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
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
            className="h-11 w-auto sm:h-12"
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
              <LocaleRule />
            </li>
            <li>
              <LocaleSwitch locale={other} label={d.switchToShort} aria={d.switchToAria} />
            </li>
          </ul>
        </nav>

        {/* Mobile: menu button, then the rule, then the language — the order
            asked for. */}
        <div className="flex items-center lg:hidden">
          <MenuButton
            ref={toggleRef}
            open={menuOpen}
            label={menuOpen ? d.menuClose : d.menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
          <LocaleRule />
          <LocaleSwitch locale={other} label={d.switchToShort} aria={d.switchToAria} />
        </div>
      </div>

      {/*
        Full-screen menu.

        AnimatePresence rather than a `hidden` attribute, so the panel is not in
        the DOM at all when closed — nothing to tab into, and the exit animation
        gets to finish before it unmounts.

        The reveal is a clip-path wipe upward from the bottom edge plus a
        staggered rise on the items. Items carry no `data-reveal`, because they
        are user-triggered: the no-JS stylesheet override exists to rescue
        scroll reveals that would otherwise be stuck invisible, and with JS off
        this panel never renders in the first place.
      */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={d.menuTitle}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex flex-col bg-espresso lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Image
                src="/logos/elegancia-logo-light.svg"
                alt=""
                width={545}
                height={138}
                className="h-8 w-auto"
              />
              <MenuButton open label={d.menuClose} onClick={closeFromEvent} />
            </div>

            <nav
              aria-label={locale === 'en' ? 'Primary (mobile)' : 'Κύρια πλοήγηση (κινητό)'}
              className="flex flex-1 flex-col justify-center px-6 pb-16"
            >
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={itemVariants}>
                    <a
                      href={link.href}
                      onClick={closeFromEvent}
                      className="block py-3 text-[clamp(2rem,9vw,2.75rem)] font-extralight leading-tight tracking-[-0.02em] text-sand transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* The same pair as the hero and the contact section, so the
                  guest meets one set of controls everywhere. */}
              <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${site.contact.phone}`}
                  onClick={closeFromEvent}
                  className="tap-target inline-flex cursor-pointer items-center gap-3 rounded-sm bg-sand px-4 text-sm font-medium tracking-wide text-espresso transition-colors duration-200 hover:bg-champagne"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
                  </svg>
                  {d.contact.callLabel}
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeFromEvent}
                  className="tap-target inline-flex cursor-pointer items-center gap-3 rounded-sm border border-sand px-4 text-sm font-medium tracking-wide text-sand transition-colors duration-200 hover:bg-sand hover:text-espresso"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                  </svg>
                  {d.contact.whatsappLabel}
                  <span className="sr-only"> WhatsApp {d.opensNewTab}</span>
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* A hairline between the menu button and the language, as asked. Decorative:
   it separates two controls that are already distinct to a screen reader. */
function LocaleRule() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-champagne/40" />
}

/* Two lines that cross into an X rather than the usual three-line burger. The
   middle line of a three-line icon has nowhere to go on close — it either
   fades (which reads as a glitch at this size) or rotates onto one of the
   others. Two lines animate cleanly and leave the mark calmer when closed. */
function MenuButton({
  open,
  label,
  onClick,
  ref,
}: {
  open: boolean
  label: string
  onClick: (e: React.MouseEvent) => void
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="tap-target group -ml-2 flex cursor-pointer items-center justify-center text-sand"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="relative block h-4 w-6">
        <span
          className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            open ? 'top-1/2 rotate-45' : 'top-1 group-hover:top-0.5'
          }`}
        />
        <span
          className={`absolute left-0 block h-px bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            open ? 'top-1/2 w-6 -rotate-45' : 'bottom-1 w-4 group-hover:bottom-0.5 group-hover:w-6'
          }`}
        />
      </span>
    </button>
  )
}

/* A plain link, not a button: switching locale is a navigation to a different
   URL, so it must behave like one (middle-click, open in new tab, bookmark).
   hrefLang tells assistive tech and crawlers what is on the other end. The
   visible label is the two-letter code; the full sentence lives in aria-label,
   so "ΕΛ" is never announced as a word. */
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
      className="tap-target inline-flex cursor-pointer items-center px-2 text-sm font-medium tracking-wide text-champagne transition-colors duration-200 hover:text-white"
    >
      {label}
    </a>
  )
}
