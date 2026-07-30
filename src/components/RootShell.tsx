import { Geologica } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getDictionary, type Locale } from '@/lib/i18n'
import '@/app/globals.css'

/* Geologica is the brand face, shared with the Elegancia guest app. The Greek
   subset is required — the Greek locale would otherwise fall back to a system
   font mid-sentence. */
const geologica = Geologica({
  subsets: ['latin', 'latin-ext', 'greek'],
  variable: '--font-geologica',
  display: 'swap',
})

/* ---------------------------------------------------------------------------
   RootShell
   ---------------------------------------------------------------------------
   Shared by both locale root layouts. English lives at "/" and Greek at "/el",
   each as its own root layout so that <html lang> is correct in the served
   document rather than patched up on the client. A client-side language toggle
   would leave lang="en" while announcing Greek, which mispronounces every word
   for a screen-reader user.
--------------------------------------------------------------------------- */

export function RootShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const d = getDictionary(locale)

  return (
    <html lang={d.htmlLang} className={geologica.variable}>
      <head>
        {/*
          No-JS safety net. Motion serialises initial="hidden" into the
          server-rendered HTML, so every scroll-reveal ships with an inline
          opacity: 0. With JS disabled that never clears and the whole page
          below the hero stays invisible. A stylesheet !important outranks a
          non-important inline style, which is what makes this work.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body>
        {/* Skip link — the first focusable element on the page. */}
        <a
          href="#main"
          className="sr-only rounded-sm bg-espresso px-5 py-3 text-sand focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:outline-champagne"
        >
          {d.skipToMain}
        </a>

        <Header locale={locale} />

        <main id="main">{children}</main>

        <Footer locale={locale} />
      </body>
    </html>
  )
}
