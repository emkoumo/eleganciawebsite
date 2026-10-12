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
      {/*
        There used to be a <noscript> stylesheet here forcing [data-reveal]
        elements back to opacity 1, because Motion serialised initial="hidden"
        into the HTML and with JS disabled that never cleared.

        It is gone because the thing it was rescuing is gone: reveals no longer
        touch opacity at all, and their resting state is the visible one, so the
        server HTML is already correct with or without JavaScript. Keeping the
        override would have been dead code that WAVE flags as an alert.
      */}
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
