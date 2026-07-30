import type { Metadata, Viewport } from 'next'
import { Geologica } from 'next/font/google'
import { site } from '@/lib/site'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

/* Geologica is the brand face, shared with the Elegancia guest app. Loading the
   variable font gives us the 200–600 range the type scale relies on. */
const geologica = Geologica({
  subsets: ['latin', 'latin-ext', 'greek'],
  variable: '--font-geologica',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.location}`,
    template: `%s — ${site.name}`,
  },
  description: site.hero.subtext,
  openGraph: {
    title: `${site.name} — ${site.location}`,
    description: site.hero.subtext,
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fdf6e3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geologica.variable}>
      <head>
        {/*
          No-JS safety net.

          Motion serialises `initial="hidden"` into the server-rendered HTML, so
          every scroll-reveal element ships with an inline `opacity: 0`. With JS
          working, whileInView clears it. With JS disabled or broken, it never
          clears — and the entire page below the hero stays permanently
          invisible. WAVE surfaced this as ~100 "very low contrast" findings; the
          underlying fault is worse than contrast.

          A stylesheet rule with !important outranks a non-important inline
          style, which is what lets this override Motion's own output.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body>
        {/*
          Skip link — the first focusable element on the page, per the brief.
          Visually hidden until focused, then pinned top-left over everything.
        */}
        <a
          href="#main"
          className="sr-only rounded-sm bg-espresso px-5 py-3 text-sand focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:outline-champagne"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
