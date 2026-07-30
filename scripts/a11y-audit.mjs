/* ---------------------------------------------------------------------------
   Automated accessibility audit
   ---------------------------------------------------------------------------
   Runs axe-core against the production build in three states, because a
   single-pass audit of the landing view misses most of the interactive surface:

     1. Landing page, default motion
     2. Lightbox open — exercises the dialog, focus trap and live caption
     3. Contact form in its error state — exercises aria-invalid / describedby

   Plus non-axe structural checks that axe cannot express: heading order, the
   skip link being genuinely first in the tab order, and whether reduced-motion
   emulation actually suppresses transform animation.

   Usage:  npm run build && npm run a11y
--------------------------------------------------------------------------- */

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import puppeteer from 'puppeteer'

const PORT = 3123
const BASE_URL = `http://127.0.0.1:${PORT}`
/* WCAG 2.2 Level AA — the brief's stated target. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/* axe-core is injected by hand rather than via @axe-core/puppeteer: that
   wrapper calls require.resolve() from a file:// URL, and this project's path
   contains a space ("ELEGANCIA WEBSITE"), which arrives percent-encoded and
   fails to resolve. Reading the bundle straight off disk avoids the problem
   and drops a dependency. */
const AXE_SOURCE = readFileSync(
  new URL('../node_modules/axe-core/axe.min.js', import.meta.url),
  'utf8',
)

/** Inject axe into the page (and every frame) and run it against TAGS. */
async function runAxe(page) {
  await page.evaluate(AXE_SOURCE)
  return page.evaluate(
    async (tags) =>
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations'],
      }),
    TAGS,
  )
}

/* --------------------------------------------------------------------------
   Contrast against the nearest OPAQUE ancestor.

   axe resolves contrast against the painted backdrop, so it accepts text whose
   dark background is drawn by a *sibling* subtree. That is exactly how a
   transparent header sitting over the hero's absolutely-positioned scrim passed
   axe while WAVE correctly reported 1.22:1 against body's cream. This walks
   ancestors for a genuinely opaque background, the way WAVE does, and runs on
   the no-JS page too — where no scroll-reveal has fired.
-------------------------------------------------------------------------- */
function contrastProbe() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null
  }
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
  const cr = (f, b) => { const x = lum(f), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  const out = []
  for (const el of document.querySelectorAll('*')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    if (Number(cs.opacity) < 0.99) continue
    /* Skip visually-hidden text (.sr-only clips to a 1x1 box). Contrast
       criteria apply to text a sighted user can actually see; a screen reader
       does not care what colour its announcements would have been. */
    const box = el.getBoundingClientRect()
    if (box.width <= 1 || box.height <= 1) continue
    const fg = parse(cs.color)
    if (!fg) continue
    let n = el, bg = null
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0.99) { bg = c; break }
      n = n.parentElement
    }
    if (!bg) bg = { r: 255, g: 255, b: 255, a: 1 }
    const size = parseFloat(cs.fontSize)
    const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5
    const ratio = cr(fg, bg)
    if (ratio < need) out.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), need, size })
  }
  return out
}

async function checkOpaqueContrast(page, label) {
  const issues = await page.evaluate(contrastProbe)
  console.log(
    issues.length === 0
      ? `  \u2713 Contrast vs opaque ancestor (${label}) — all text passes`
      : `  \u2717 Contrast vs opaque ancestor (${label}) — ${issues.length} failure(s):`,
  )
  for (const i of issues.slice(0, 8)) {
    console.log(`      ${i.ratio}/${i.need} at ${i.size}px — "${i.text}"`)
  }
  failures += issues.length
}

let failures = 0

function report(label, results) {
  const { violations } = results
  if (violations.length === 0) {
    console.log(`  ✓ ${label} — no violations`)
    return
  }
  failures += violations.length
  console.log(`  ✗ ${label} — ${violations.length} violation(s)`)
  for (const v of violations) {
    console.log(`\n    [${v.impact}] ${v.id}: ${v.help}`)
    console.log(`      ${v.helpUrl}`)
    for (const node of v.nodes.slice(0, 4)) {
      console.log(`      → ${node.target.join(' ')}`)
      const msg = node.failureSummary?.split('\n').filter(Boolean).slice(1)
      if (msg?.length) console.log(`        ${msg.join(' | ')}`)
    }
    if (v.nodes.length > 4) {
      console.log(`      … and ${v.nodes.length - 4} more node(s)`)
    }
  }
  console.log('')
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(`Server did not start on ${BASE_URL} within ${timeoutMs}ms`)
}

const server = spawn('npx', ['next', 'start', '--port', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
})
server.stdout.on('data', () => {})
server.stderr.on('data', (d) => process.stderr.write(`[next] ${d}`))

let browser
try {
  await waitForServer()
  console.log(`\nAuditing ${BASE_URL} against ${TAGS.join(', ')}\n`)

  browser = await puppeteer.launch({ headless: true })

  // --- 1. Landing page ----------------------------------------------------
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  /* Scroll the whole page so every whileInView reveal has fired — content
     still at opacity 0 is invisible to axe's contrast checks. */
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 600))
  report('Landing page', await runAxe(page))

  // --- 2. Lightbox open ---------------------------------------------------
  const thumb = await page.$('#gallery ul button')
  if (!thumb) {
    console.log('  ! Could not find a gallery thumbnail — skipping lightbox pass')
    failures++
  } else {
    await thumb.click()
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 })
    await new Promise((r) => setTimeout(r, 400))
    report('Lightbox open', await runAxe(page))

    /* Focus must be inside the dialog, not left behind on the page. */
    const focusInsideDialog = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    )
    console.log(
      focusInsideDialog
        ? '  ✓ Focus moved into the lightbox'
        : '  ✗ Focus did NOT move into the lightbox',
    )
    if (!focusInsideDialog) failures++

    /* Escape must close it and hand focus back to the page. */
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 400))
    const closed = (await page.$('[role="dialog"]')) === null
    console.log(
      closed
        ? '  ✓ Escape closes the lightbox'
        : '  ✗ Escape did NOT close the lightbox',
    )
    if (!closed) failures++
  }

  // --- 3. Contact form error state ---------------------------------------
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView()
  })
  await page.click('#contact form button[type="submit"]')
  await new Promise((r) => setTimeout(r, 300))
  const errorsShown = await page.$$eval(
    '#contact form [aria-invalid="true"]',
    (els) => els.length,
  )
  console.log(
    errorsShown > 0
      ? `  ✓ Form validation marked ${errorsShown} field(s) aria-invalid`
      : '  ✗ Form validation did not set aria-invalid',
  )
  if (errorsShown === 0) failures++
  report('Contact form, error state', await runAxe(page))

  // --- 4. Structural checks ----------------------------------------------
  const structure = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(
      (h) => ({ level: Number(h.tagName[1]), text: h.textContent?.trim().slice(0, 60) }),
    )
    const h1s = headings.filter((h) => h.level === 1)
    const skips = []
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level - headings[i - 1].level > 1) {
        skips.push(`${headings[i - 1].level} → ${headings[i].level} at "${headings[i].text}"`)
      }
    }
    const landmarks = {
      header: document.querySelectorAll('header').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer').length,
    }
    return { h1Count: h1s.length, h1: h1s[0]?.text, skips, landmarks, total: headings.length }
  })

  console.log('\n  Structure')
  console.log(
    structure.h1Count === 1
      ? `  ✓ Exactly one h1: "${structure.h1}"`
      : `  ✗ Expected 1 h1, found ${structure.h1Count}`,
  )
  if (structure.h1Count !== 1) failures++
  console.log(
    structure.skips.length === 0
      ? `  ✓ Heading hierarchy sequential across ${structure.total} headings`
      : `  ✗ Heading level skipped: ${structure.skips.join('; ')}`,
  )
  if (structure.skips.length) failures++
  console.log(
    `  ${structure.landmarks.main === 1 ? '✓' : '✗'} Landmarks: ` +
      Object.entries(structure.landmarks)
        .map(([k, v]) => `${k}=${v}`)
        .join(' '),
  )
  if (structure.landmarks.main !== 1) failures++

  /* Skip link must be the first thing Tab reaches. */
  const fresh = await browser.newPage()
  await fresh.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await fresh.keyboard.press('Tab')
  const firstFocus = await fresh.evaluate(() => {
    const el = document.activeElement
    return { tag: el?.tagName, text: el?.textContent?.trim(), href: el?.getAttribute('href') }
  })
  const skipOk = firstFocus.href === '#main'
  console.log(
    skipOk
      ? `  ✓ First tab stop is the skip link ("${firstFocus.text}")`
      : `  ✗ First tab stop is ${firstFocus.tag} "${firstFocus.text}" — expected the skip link`,
  )
  if (!skipOk) failures++

  // --- 5. Reduced motion --------------------------------------------------
  const rm = await browser.newPage()
  await rm.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ])
  await rm.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 900))
  /* Under reduced motion the hero must be fully visible with no residual
     translate — i.e. the fallback ran instead of the slide-up. */
  const heroState = await rm.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1) return null
    const cs = getComputedStyle(h1.parentElement)
    return { opacity: cs.opacity, transform: cs.transform }
  })
  const rmOk =
    heroState &&
    Number(heroState.opacity) > 0.99 &&
    (heroState.transform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(heroState.transform))
  console.log(
    rmOk
      ? '  ✓ Reduced motion: hero settles with no residual transform'
      : `  ✗ Reduced motion: hero left at ${JSON.stringify(heroState)}`,
  )
  if (!rmOk) failures++
  report('Landing page, reduced motion', await runAxe(rm))

  // --- 6. JavaScript disabled ---------------------------------------------
  /* The pass that matters most, and the one this script originally lacked.
     Sections 1-5 scroll the page before auditing, which fires every
     whileInView reveal — and therefore hides the fact that Motion ships
     `opacity: 0` in the server-rendered HTML. With JS off that never clears
     and the whole page below the hero is invisible. WAVE caught this as ~100
     contrast findings; scrolling first had masked it completely. */
  const nojs = await browser.newPage()
  await nojs.setJavaScriptEnabled(false)
  await nojs.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 400))
  const nojsVisible = await nojs.evaluate(() => {
    const els = [...document.querySelectorAll('[data-reveal]')]
    const hidden = els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
    return { total: els.length, hidden: hidden.length }
  })
  console.log(
    nojsVisible.hidden === 0
      ? `  ✓ No-JS: all ${nojsVisible.total} reveal elements visible`
      : `  ✗ No-JS: ${nojsVisible.hidden}/${nojsVisible.total} reveal elements stuck at opacity 0`,
  )
  if (nojsVisible.hidden > 0) failures++

  await checkOpaqueContrast(page, 'default')
  await checkOpaqueContrast(nojs, 'JavaScript disabled')
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}

console.log(
  failures === 0
    ? '\n✓ All accessibility checks passed.\n'
    : `\n✗ ${failures} accessibility problem(s) found.\n`,
)
process.exit(failures === 0 ? 0 : 1)
