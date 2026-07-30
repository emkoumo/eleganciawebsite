/* ---------------------------------------------------------------------------
   Automated accessibility audit
   ---------------------------------------------------------------------------
   Runs against the production build, for EVERY locale, in several states —
   because a single-pass audit of one locale's landing view misses most of the
   interactive surface and all of the other language.

   Per locale:
     1. axe-core on the landing page (after scrolling, so reveals have fired)
     2. axe-core with the lightbox open — dialog, focus trap, live caption
     3. axe-core with the contact form in its error state
     4. axe-core under prefers-reduced-motion
     5. structural checks axe cannot express: single h1, heading order,
        landmarks, skip link first in tab order, correct <html lang>
     6. JavaScript disabled — no [data-reveal] left at opacity 0
     7. contrast against the nearest OPAQUE ancestor (WAVE's method), on both
        the normal and the no-JS page

   Usage:  npm run build && npm run a11y
--------------------------------------------------------------------------- */

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

const PORT = 3123
const BASE_URL = `http://127.0.0.1:${PORT}`
/* WCAG 2.2 Level AA — the stated target. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const LOCALES = [
  { path: '/', label: 'en', lang: 'en' },
  { path: '/el', label: 'el', lang: 'el' },
]

/* axe-core is injected by hand rather than via @axe-core/puppeteer: that
   wrapper calls require.resolve() from a file:// URL, and this project's path
   contains a space ("ELEGANCIA WEBSITE"), which arrives percent-encoded and
   fails to resolve. Reading the bundle off disk avoids it and drops a dep. */
const AXE_SOURCE = readFileSync(
  new URL('../node_modules/axe-core/axe.min.js', import.meta.url),
  'utf8',
)

/* --------------------------------------------------------------------------
   Hero text contrast, sampled from RENDERED PIXELS.

   The hero places text over a photograph behind a gradient scrim. No static
   analysis can evaluate that: axe sees a semi-transparent overlay, WAVE walks
   past it to the section background, and neither knows what the photo looks
   like where the words fall.

   So this screenshots the hero, then for each text element samples a grid of
   real pixels inside its bounding box and computes the worst contrast found
   against that element's own text colour. That makes swapping the hero photo
   safe: a darker or busier image fails here loudly instead of silently.
-------------------------------------------------------------------------- */
async function checkHeroPixelContrast(page, sharp) {
  /* Collect the boxes and colours FIRST, while the text is still visible. */
  const targets = await page.evaluate(() => {
    const hero = document.querySelector('section')
    if (!hero) return []
    const out = []
    for (const el of hero.querySelectorAll('h1, p, a')) {
      const b = el.getBoundingClientRect()
      if (b.width < 4 || b.height < 4 || b.top > 900) continue
      if (!el.textContent?.trim()) continue
      const cs = getComputedStyle(el)
      /* Canvas round-trip rather than a regex: Tailwind v4 computes every
         `/opacity` colour to oklab(), which an rgb() regex silently drops —
         that is how the hero subtext escaped this check entirely. */
      const cvs = document.createElement('canvas')
      cvs.width = cvs.height = 1
      const ctx = cvs.getContext('2d', { willReadFrequently: true })
      ctx.fillStyle = '#000000'
      ctx.fillStyle = cs.color
      ctx.fillRect(0, 0, 1, 1)
      const px = ctx.getImageData(0, 0, 1, 1).data
      out.push({
        text: el.textContent.trim().slice(0, 34),
        fg: [px[0], px[1], px[2]],
        fgAlpha: px[3] / 255,
        x: Math.round(b.left), y: Math.round(b.top),
        w: Math.round(b.width), h: Math.round(b.height),
        size: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight),
        /* An element with its own opaque background (the CTA button) is not
           text-over-photo at all, so it is measured against that instead. */
        ownBg: cs.backgroundColor,
      })
    }
    return out
  })

  /* Now hide the hero text and screenshot, so every sampled pixel is BACKDROP
     rather than a glyph. Sampling with the text visible is what produced a
     nonsensical 1.00:1 — the sample simply landed on the letters. */
  await page.evaluate(() => {
    const hero = document.querySelector('section')
    for (const el of hero.querySelectorAll('h1, p, a')) {
      el.setAttribute('data-hidden-for-sampling', '')
      el.style.visibility = 'hidden'
    }
  })
  await new Promise((r) => setTimeout(r, 120))
  const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } })
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-hidden-for-sampling]')) {
      el.style.visibility = ''
      el.removeAttribute('data-hidden-for-sampling')
    }
  })

  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels

  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

  const seen = new Set()
  for (const t of targets) {
    if (seen.has(t.text)) continue
    seen.add(t.text)

    /* Skip elements painting their own opaque background — the CTA button is
       sand-on-espresso by construction and already covered by the
       opaque-ancestor probe. */
    const bgAlpha = t.ownBg.match(/rgba?\([^)]*?,\s*([\d.]+)\)$/)
    if (t.ownBg !== 'rgba(0, 0, 0, 0)' && (!bgAlpha || Number(bgAlpha[1]) > 0.99)) continue

    const need = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700) ? 3 : 4.5
    const a = t.fgAlpha ?? 1
    let worst = Infinity
    let worstPx = null
    for (let gy = 0; gy <= 12; gy++) {
      for (let gx = 0; gx <= 24; gx++) {
        const px = Math.min(info.width - 1, Math.max(0, t.x + Math.round((t.w * gx) / 24)))
        const py = Math.min(info.height - 1, Math.max(0, t.y + Math.round((t.h * gy) / 12)))
        const i = (py * info.width + px) * ch
        const bg = [data[i], data[i + 1], data[i + 2]]
        /* Composite the text's own alpha over this backdrop pixel — sand/90 is
           not sand, and comparing the opaque colour would overstate contrast. */
        const fg = bg.map((c, k) => a * t.fg[k] + (1 - a) * c)
        const ratio = cr(lum(...fg), lum(...bg))
        if (ratio < worst) { worst = ratio; worstPx = bg }
      }
    }
    const ok = worst >= need
    const hex = worstPx ? '#' + worstPx.map((v) => v.toString(16).padStart(2, '0')).join('') : '?'
    console.log(
      ok
        ? `    \u2713 Hero pixels: "${t.text}" worst ${worst.toFixed(2)}:1 vs ${hex} (needs ${need})`
        : `    \u2717 Hero pixels: "${t.text}" worst ${worst.toFixed(2)}:1 vs ${hex} — needs ${need}`,
    )
    if (!ok) failures++
  }
  if (seen.size === 0) {
    console.log('    \u2717 Hero pixels: found no hero text to sample')
    failures++
  }
}

let failures = 0

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

function report(label, results) {
  const { violations } = results
  if (violations.length === 0) {
    console.log(`    ✓ ${label} — no violations`)
    return
  }
  failures += violations.length
  console.log(`    ✗ ${label} — ${violations.length} violation(s)`)
  for (const v of violations) {
    console.log(`\n      [${v.impact}] ${v.id}: ${v.help}`)
    console.log(`        ${v.helpUrl}`)
    for (const node of v.nodes.slice(0, 4)) {
      console.log(`        → ${node.target.join(' ')}`)
      const msg = node.failureSummary?.split('\n').filter(Boolean).slice(1)
      if (msg?.length) console.log(`          ${msg.join(' | ')}`)
    }
    if (v.nodes.length > 4) console.log(`        … and ${v.nodes.length - 4} more`)
  }
  console.log('')
}

function check(ok, pass, fail) {
  console.log(ok ? `    ✓ ${pass}` : `    ✗ ${fail}`)
  if (!ok) failures++
}

/* --------------------------------------------------------------------------
   Contrast against the nearest OPAQUE ancestor.

   axe resolves contrast against the painted backdrop, so it accepts text whose
   dark background is drawn by a *sibling* subtree. That is exactly how a
   transparent header over the hero's absolutely-positioned scrim passed axe
   while WAVE correctly reported 1.22:1 against body's cream. This walks
   ancestors for a genuinely opaque background, the way WAVE does.
-------------------------------------------------------------------------- */
function contrastProbe() {
  /* Resolve ANY CSS colour to sRGB bytes by painting it on a 1x1 canvas and
     reading the pixel back.

     This replaced a regex that only understood rgb()/rgba(). Tailwind v4 emits
     oklab() for every `/opacity` utility — text-sand/90 computes to
     "oklab(0.907 0.004 0.019 / 0.9)" — so the regex silently skipped all of
     them, and the probe reported "all text passes" while never having looked at
     them. Canvas round-tripping handles oklab, color(), lab, hsl and anything
     else the engine can parse, and getImageData returns un-premultiplied bytes
     so the alpha survives. */
  const cvs = document.createElement('canvas')
  cvs.width = cvs.height = 1
  const ctx = cvs.getContext('2d', { willReadFrequently: true })

  const resolve = (css) => {
    if (!css) return null
    ctx.clearRect(0, 0, 1, 1)
    /* Reset to a known value: if `css` is invalid, fillStyle keeps its previous
       value and we would silently measure the wrong colour. */
    ctx.fillStyle = '#000000'
    const before = ctx.fillStyle
    ctx.fillStyle = css
    if (ctx.fillStyle === before && !/^(#000000|black|rgb\(0, 0, 0\))$/i.test(css.trim())) {
      return null
    }
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }
  }

  const over = (fg, bg) => ({
    r: fg.a * fg.r + (1 - fg.a) * bg.r,
    g: fg.a * fg.g + (1 - fg.a) * bg.g,
    b: fg.a * fg.b + (1 - fg.a) * bg.b,
  })
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

  const fails = []
  const unresolved = []

  for (const el of document.querySelectorAll('*')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    if (Number(cs.opacity) < 0.99) continue
    /* Skip visually-hidden text (.sr-only clips to a 1x1 box). Contrast
       criteria apply to text a sighted user can actually see. */
    const box = el.getBoundingClientRect()
    if (box.width <= 1 || box.height <= 1) continue

    const label = el.textContent.trim().slice(0, 40)
    const fg = resolve(cs.color)
    if (!fg) { unresolved.push({ label, what: 'color', value: cs.color }); continue }

    /* Walk ancestors for an opaque background, compositing any translucent
       layers encountered on the way down. */
    let n = el
    let bg = null
    const stack = []
    while (n && n !== document.documentElement) {
      const c = resolve(getComputedStyle(n).backgroundColor)
      if (c === null) { unresolved.push({ label, what: 'background', value: getComputedStyle(n).backgroundColor }); break }
      if (c.a > 0.99) { bg = c; break }
      if (c.a > 0) stack.push(c)
      n = n.parentElement
    }
    if (!bg) bg = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i], bg)

    const composited = fg.a < 0.99 ? over(fg, bg) : fg
    const size = parseFloat(cs.fontSize)
    const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5
    const ratio = cr(composited, bg)
    if (ratio < need) fails.push({ text: label, ratio: +ratio.toFixed(2), need, size })
  }
  return { fails, unresolved }
}

async function checkOpaqueContrast(page, label) {
  const { fails, unresolved } = await page.evaluate(contrastProbe)
  console.log(
    fails.length === 0
      ? `    \u2713 Contrast vs opaque ancestor (${label}) — all text passes`
      : `    \u2717 Contrast vs opaque ancestor (${label}) — ${fails.length} failure(s):`,
  )
  for (const i of fails.slice(0, 8)) {
    console.log(`        ${i.ratio}/${i.need} at ${i.size}px — "${i.text}"`)
  }
  failures += fails.length

  /* An unresolvable colour is a hole in the audit, not a pass. Report it as a
     failure so the probe can never again claim coverage it does not have. */
  if (unresolved.length) {
    console.log(`    \u2717 Contrast (${label}) — ${unresolved.length} colour(s) could not be resolved:`)
    for (const u of unresolved.slice(0, 5)) {
      console.log(`        ${u.what}="${u.value}" on "${u.label}"`)
    }
    failures += unresolved.length
  }
}

async function scrollThrough(page) {
  /* The page sets scroll-behavior: smooth, which makes scrollTo animate — so it
     is disabled for the duration, otherwise the final scrollTo(0,0) is still
     gliding when the next assertion runs. */
  await page.evaluate(async () => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 110))
    }
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prev
  })
  await new Promise((r) => setTimeout(r, 500))
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) })).ok) return
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(`Server did not start on ${BASE_URL}`)
}

async function auditLocale(browser, locale) {
  const url = BASE_URL + locale.path
  console.log(`\n  -- locale "${locale.label}" (${url}) --`)

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  await scrollThrough(page)
  report('Landing page', await runAxe(page))

  /* <html lang> must match the content, or a screen reader mispronounces every
     word on the Greek page. */
  await checkHeroPixelContrast(page, sharp)

  const lang = await page.evaluate(() => document.documentElement.lang)
  check(lang === locale.lang, `<html lang="${lang}">`, `<html lang="${lang}"> — expected "${locale.lang}"`)

  // --- Lightbox ----------------------------------------------------------
  const thumb = await page.$('#gallery ul button')
  if (!thumb) {
    check(false, '', 'Could not find a gallery thumbnail')
  } else {
    await thumb.click()
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 })
    await new Promise((r) => setTimeout(r, 350))
    report('Lightbox open', await runAxe(page))

    const focusInside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    )
    check(focusInside, 'Focus moved into the lightbox', 'Focus did NOT move into the lightbox')

    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 350))
    check((await page.$('[role="dialog"]')) === null, 'Escape closes the lightbox', 'Escape did NOT close the lightbox')
  }

  // --- Contact form error state ------------------------------------------
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await page.click('#contact form button[type="submit"]')
  await new Promise((r) => setTimeout(r, 300))
  const invalid = await page.$$eval('#contact form [aria-invalid="true"]', (e) => e.length)
  check(invalid > 0, `Form marked ${invalid} field(s) aria-invalid`, 'Form did not set aria-invalid')
  report('Contact form, error state', await runAxe(page))

  // --- Structure ---------------------------------------------------------
  const structure = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: h.textContent?.trim().slice(0, 50),
    }))
    const skips = []
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level - headings[i - 1].level > 1) {
        skips.push(`${headings[i - 1].level}->${headings[i].level} at "${headings[i].text}"`)
      }
    }
    return {
      h1Count: headings.filter((h) => h.level === 1).length,
      h1: headings.find((h) => h.level === 1)?.text,
      skips,
      total: headings.length,
      main: document.querySelectorAll('main').length,
      nav: document.querySelectorAll('nav').length,
    }
  })
  check(structure.h1Count === 1, `Exactly one h1: "${structure.h1}"`, `Expected 1 h1, found ${structure.h1Count}`)
  check(structure.skips.length === 0, `Heading hierarchy sequential across ${structure.total} headings`, `Heading level skipped: ${structure.skips.join('; ')}`)
  check(structure.main === 1, `Landmarks: main=1 nav=${structure.nav}`, `Expected 1 <main>, found ${structure.main}`)

  // --- Skip link is the first tab stop -----------------------------------
  const fresh = await browser.newPage()
  await fresh.goto(url, { waitUntil: 'networkidle0' })
  await fresh.keyboard.press('Tab')
  const first = await fresh.evaluate(() => ({
    href: document.activeElement?.getAttribute('href'),
    text: document.activeElement?.textContent?.trim(),
  }))
  check(first.href === '#main', `First tab stop is the skip link ("${first.text}")`, `First tab stop is "${first.text}" — expected the skip link`)
  await fresh.close()

  // --- Reduced motion ----------------------------------------------------
  const rm = await browser.newPage()
  await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await rm.goto(url, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  const hero = await rm.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1?.parentElement) return null
    const cs = getComputedStyle(h1.parentElement)
    return { opacity: cs.opacity, transform: cs.transform }
  })
  check(
    !!hero && Number(hero.opacity) > 0.99 &&
      (hero.transform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(hero.transform)),
    'Reduced motion: hero settles with no residual transform',
    `Reduced motion: hero left at ${JSON.stringify(hero)}`,
  )
  report('Landing page, reduced motion', await runAxe(rm))
  await rm.close()

  // --- JavaScript disabled -----------------------------------------------
  /* The pass that matters most, and the one this script originally lacked. The
     passes above scroll first, which fires every whileInView reveal — and so
     hides that Motion ships opacity: 0 in the SSR'd HTML. With JS off that
     never clears and the page below the hero is permanently invisible. */
  const nojs = await browser.newPage()
  await nojs.setJavaScriptEnabled(false)
  await nojs.goto(url, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 350))
  const reveals = await nojs.evaluate(() => {
    const els = [...document.querySelectorAll('[data-reveal]')]
    return {
      total: els.length,
      hidden: els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length,
    }
  })
  check(reveals.hidden === 0, `No-JS: all ${reveals.total} reveal elements visible`, `No-JS: ${reveals.hidden}/${reveals.total} reveal elements stuck at opacity 0`)

  await checkOpaqueContrast(page, 'default')
  await checkOpaqueContrast(nojs, 'JavaScript disabled')

  await nojs.close()
  await page.close()
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
  console.log(`\nAuditing ${LOCALES.length} locales against ${TAGS.join(', ')}`)
  browser = await puppeteer.launch({ headless: true })
  for (const locale of LOCALES) {
    await auditLocale(browser, locale)
  }
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}

console.log(
  failures === 0
    ? '\n✓ All accessibility checks passed for all locales.\n'
    : `\n✗ ${failures} accessibility problem(s) found.\n`,
)
process.exit(failures === 0 ? 0 : 1)
