/* Captures the page at three breakpoints so layout can be eyeballed without
   starting a dev server by hand. Usage: npm run build && node scripts/screenshot.mjs */

import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer'

const PORT = 3124
const BASE = `http://127.0.0.1:${PORT}`
const OUT = 'screenshots'

const sizes = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
]

/* Both locales, so Greek copy length is reviewed too — Greek runs noticeably
   longer than English and is where headings wrap badly if they are going to. */
const locales = [
  { name: 'en', path: '/' },
  { name: 'el', path: '/el' },
]

mkdirSync(OUT, { recursive: true })

const server = spawn('npx', ['next', 'start', '--port', String(PORT)], {
  stdio: ['ignore', 'ignore', 'inherit'],
})

async function waitForServer() {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE, { signal: AbortSignal.timeout(2000) })).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error('server did not start')
}

let browser
try {
  await waitForServer()
  browser = await puppeteer.launch({ headless: true })

  for (const locale of locales) for (const size of sizes) {
    const page = await browser.newPage()
    await page.setViewport({ width: size.width, height: size.height })
    await page.goto(BASE + locale.path, { waitUntil: 'networkidle0' })

    /* Scroll through so every whileInView reveal has fired before capture.
       The page sets `scroll-behavior: smooth`, which makes scrollTo animate —
       so it is disabled for the duration, otherwise the final scrollTo(0,0) is
       still gliding when the screenshot fires and the hero looks clipped. */
    await page.evaluate(async () => {
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      const step = window.innerHeight
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 200))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 50))
      html.style.scrollBehavior = prev
    })
    await new Promise((r) => setTimeout(r, 800))

    await page.screenshot({ path: `${OUT}/${locale.name}-${size.name}-hero.png` })
    await page.screenshot({ path: `${OUT}/${locale.name}-${size.name}-full.png`, fullPage: true })
    console.log(`captured ${locale.name} ${size.name}`)
    await page.close()
  }
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
