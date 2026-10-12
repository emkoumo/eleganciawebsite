/* ---------------------------------------------------------------------------
   Automated accessibility audit
   ---------------------------------------------------------------------------
   Runs against the production build, for EVERY locale, in several states —
   because a single-pass audit of one locale's landing view misses most of the
   interactive surface and all of the other language.

   Per locale:
     1. axe-core on the landing page (after scrolling, so reveals have fired)
     2. axe-core with the lightbox open — dialog, focus trap, live caption
     3. the contact routes — tel:, mailto: and wa.me are now the only ways to
        reach the owners, and a typo in one is silent
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
  { path: '/', label: 'en', lang: 'en', espa: 'antagonistikotita-en' },
  { path: '/el', label: 'el', lang: 'el', espa: 'antagonistikotita-el' },
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
   Text contrast over a photograph, sampled from RENDERED PIXELS.

   Two bands do this — the hero and the contact section. No static analysis can
   evaluate either: axe sees a semi-transparent overlay, WAVE walks past it to
   the section background, and neither knows what the photo looks like where
   the words fall.

   So this screenshots the section, then for each text element samples a grid
   of real pixels inside its bounding box and computes the worst contrast found
   against that element's own text colour. That makes swapping either photo
   safe: a darker or busier image fails here loudly instead of silently.
-------------------------------------------------------------------------- */
async function checkPixelContrast(page, sharp, selector, label) {
  /* Every text node in the section that a sighted user can see. Collected up
     front so that anything the sampling passes fail to reach is reported as a
     gap rather than quietly skipped. */
  const expected = await page.evaluate((sel) => {
    const root = document.querySelector(sel)
    if (!root) return null
    return [...root.querySelectorAll('h1, h2, p, a')]
      .filter((el) => {
        const b = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        return b.width >= 4 && b.height >= 4 && el.textContent?.trim() &&
          cs.visibility !== 'hidden' && cs.display !== 'none'
      })
      .map((el) => el.textContent.trim().slice(0, 34))
  }, selector)

  if (expected === null) {
    console.log(`    ✗ ${label} pixels: no element matches ${selector}`)
    failures++
    return
  }

  const measured = new Map()

  /* Two scroll positions, because a section can be taller than the viewport
     and a screenshot only ever shows one viewport of it. The first puts the
     section's top edge just below the fixed header, the second puts its bottom
     edge at the foot of the viewport; between them they cover any section up
     to roughly twice the viewport height. */
  for (const align of ['top', 'bottom']) {
    await scrollSectionIntoFrame(page, selector, align)
    const found = await samplePixelContrastOnce(page, sharp, selector)
    for (const [text, m] of found) {
      const prev = measured.get(text)
      if (!prev || m.worst < prev.worst) measured.set(text, m)
    }
  }

  for (const [text, m] of measured) {
    const ok = m.worst >= m.need
    console.log(
      ok
        ? `    ✓ ${label} pixels: "${text}" worst ${m.worst.toFixed(2)}:1 vs ${m.hex} (needs ${m.need})`
        : `    ✗ ${label} pixels: "${text}" worst ${m.worst.toFixed(2)}:1 vs ${m.hex} — needs ${m.need}`,
    )
    if (!ok) failures++
  }

  /* A text that never landed fully inside a sampling frame is unverified, not
     passing. Say so rather than letting the count look complete. */
  const missed = [...new Set(expected)].filter((t) => !measured.has(t) && !skipped.has(t))
  if (missed.length) {
    console.log(`    ✗ ${label} pixels: ${missed.length} text(s) never sampled: ${missed.slice(0, 4).map((t) => `"${t}"`).join(', ')}`)
    failures++
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 200))
}

/** Elements deliberately not pixel-sampled (they paint their own opaque bg). */
const skipped = new Set()

/** Put `selector`'s top edge below the fixed header, or its bottom at the foot. */
async function scrollSectionIntoFrame(page, selector, align) {
  await page.evaluate(
    (sel, al) => {
      const el = document.querySelector(sel)
      const box = el.getBoundingClientRect()
      const top = box.top + window.scrollY
      document.documentElement.style.scrollBehavior = 'auto'
      /* No header-height offset: the header is absolute, so it only overlaps
         the viewport at the very top of the document. Elements it does cover
         are discarded by the occlusion test in the sampler instead. */
      const y = al === 'top' ? top - 8 : top + box.height - window.innerHeight + 8
      window.scrollTo(0, Math.max(0, y))
    },
    selector,
    align,
  )
  await new Promise((r) => setTimeout(r, 350))
}

async function samplePixelContrastOnce(page, sharp, selector) {
  /* Collect the boxes and colours FIRST, while the text is still visible.
     Only elements lying entirely inside the usable band — below the fixed
     header, above the fold — are measured here; the other scroll pass picks
     up the rest. */
  const targets = await page.evaluate((sel) => {
    const hero = document.querySelector(sel)
    if (!hero) return []
    /* Where the usable band starts. The header is absolute rather than fixed,
       so it only hides anything while the page is scrolled to the very top —
       measure the overlap instead of always subtracting its height, or every
       section below the fold loses 147px of samplable area for no reason. */
    const hb = document.querySelector('header')?.getBoundingClientRect()
    const top = hb && hb.top <= 0 && hb.bottom > 0 ? hb.bottom : 0
    const out = []
    /* The GLYPHS' box, not the element's box.

       A block element is as wide as its container whether or not its text
       fills it. The hero eyebrow is a <p> about 230px of text wide sitting in
       a 1152px block, so measuring el.getBoundingClientRect() sampled ~900px
       of empty photograph to its right and failed on a bright pixel no letter
       ever touches. A Range over the element's contents returns one rect per
       rendered line, which hugs the text; their union is the area that
       actually has to meet contrast. */
    const glyphBox = (el) => {
      const r = document.createRange()
      r.selectNodeContents(el)
      const rects = [...r.getClientRects()].filter((x) => x.width > 0 && x.height > 0)
      if (!rects.length) return null
      const left = Math.min(...rects.map((x) => x.left))
      const right = Math.max(...rects.map((x) => x.right))
      const topY = Math.min(...rects.map((x) => x.top))
      const bottomY = Math.max(...rects.map((x) => x.bottom))
      return { left, right, top: topY, bottom: bottomY, width: right - left, height: bottomY - topY }
    }

    for (const el of hero.querySelectorAll('h1, h2, p, a')) {
      const b = glyphBox(el) ?? el.getBoundingClientRect()
      if (b.width < 4 || b.height < 4) continue
      if (b.top < top || b.bottom > window.innerHeight) continue
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
  }, selector)

  /* Now hide the section's text and screenshot, so every sampled pixel is
     BACKDROP rather than a glyph. Sampling with the text visible is what
     produced a nonsensical 1.00:1 — the sample simply landed on the letters. */
  await page.evaluate((sel) => {
    const hero = document.querySelector(sel)
    for (const el of hero.querySelectorAll('h1, h2, p, a')) {
      el.setAttribute('data-hidden-for-sampling', '')
      el.style.visibility = 'hidden'
    }
  }, selector)
  await new Promise((r) => setTimeout(r, 120))
  /* No `clip`. Puppeteer's clip is in PAGE coordinates while
     getBoundingClientRect() is viewport-relative, so clipping to {0,0,…} once
     the page is scrolled silently samples the top of the document instead of
     the section under test — which is how the contact band first "passed"
     while actually being measured against the hero's pixels. An unclipped
     screenshot is the viewport, which is the coordinate space the boxes are
     already in. */
  const shot = await page.screenshot()
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

  const out = new Map()
  for (const t of targets) {
    if (out.has(t.text)) continue

    /* Skip elements painting their own opaque background — the hero CTA and
       the WhatsApp button are sand-on-espresso by construction and already
       covered by the opaque-ancestor probe. */
    const bgAlpha = t.ownBg.match(/rgba?\([^)]*?,\s*([\d.]+)\)$/)
    if (t.ownBg !== 'rgba(0, 0, 0, 0)' && (!bgAlpha || Number(bgAlpha[1]) > 0.99)) {
      skipped.add(t.text)
      continue
    }

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
    const hex = worstPx ? '#' + worstPx.map((v) => v.toString(16).padStart(2, '0')).join('') : '?'
    out.set(t.text, { worst, hex, need })
  }
  return out
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
  /* Both bands set light text over a photograph, which no static analysis can
     evaluate — so both get sampled from real rendered pixels. */
  await checkPixelContrast(page, sharp, '#contact', 'Contact')
  await checkPixelContrast(page, sharp, 'section', 'Hero')

  const lang = await page.evaluate(() => document.documentElement.lang)
  check(lang === locale.lang, `<html lang="${lang}">`, `<html lang="${lang}"> — expected "${locale.lang}"`)

  // --- ESPA / EU co-funding banner ---------------------------------------
  /* Three things axe cannot know:
       1. the banner is actually on the page at all,
       2. the LOCALISED artwork matches the page (the EU publicity rules want
          the acknowledgement in the visitor's language, and a copy-paste of
          the EN file onto /el is the obvious way to get this wrong),
       3. the alt is both non-empty and short enough that WAVE does not raise
          its "long alternative text" alert at ~100 characters.
     axe is happy with alt="" on any image, so without this the banner could
     go silently decorative and still pass every other check here. */
  const espa = await page.evaluate(() => {
    const img = [...document.querySelectorAll('header img')].find((i) =>
      /antagonistikotita/.test(i.currentSrc || i.src),
    )
    if (!img) return null
    const b = img.getBoundingClientRect()
    return {
      src: decodeURIComponent(img.currentSrc || img.src),
      alt: img.getAttribute('alt') ?? '',
      visible: b.width > 1 && b.height > 1,
    }
  })
  if (!espa) {
    check(false, '', 'ESPA banner not found inside the <header> landmark')
  } else {
    check(espa.src.includes(locale.espa), `ESPA banner is the "${locale.label}" artwork`, `ESPA banner is "${espa.src}" — expected ${locale.espa}`)
    check(espa.visible, 'ESPA banner is rendered and visible', 'ESPA banner is present but not visible')
    check(espa.alt.trim().length > 0, `ESPA alt text present (${espa.alt.length} chars)`, 'ESPA banner has empty alt — the acknowledgement is lost to screen readers')
    check(espa.alt.length <= 100, 'ESPA alt text under the 100-char WAVE alert threshold', `ESPA alt text is ${espa.alt.length} chars — WAVE flags "long alternative text" past ~100`)
  }

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

  // --- Contact routes ----------------------------------------------------
  /* The enquiry form was removed because /api/enquiry never sent mail, so the
     three remaining routes are now the ONLY way to reach the owners. A typo in
     any of them is silent — the link still looks fine and simply goes nowhere.
     tel: and wa.me both need E.164 digits with no spaces or punctuation, which
     is exactly the kind of thing a well-meaning edit to the display string
     breaks. */
  const routes = await page.evaluate(() => {
    const hrefs = [...document.querySelectorAll('#contact a')].map((a) => a.getAttribute('href'))
    return {
      tel: hrefs.find((h) => h?.startsWith('tel:')),
      mail: hrefs.find((h) => h?.startsWith('mailto:')),
      wa: hrefs.find((h) => h?.includes('wa.me')),
      form: document.querySelectorAll('#contact form').length,
    }
  })
  check(routes.tel === 'tel:+306931145507', `Phone link ${routes.tel}`, `Phone link is "${routes.tel}" — expected tel:+306931145507`)
  check(
    routes.mail === 'mailto:info@elegancialuxuryvillas.com',
    `Email link ${routes.mail}`,
    `Email link is "${routes.mail}" — expected mailto:info@elegancialuxuryvillas.com`,
  )
  check(
    !!routes.wa?.startsWith('https://wa.me/306931145507?text='),
    'WhatsApp link points at wa.me/306931145507 with a prefilled message',
    `WhatsApp link is "${routes.wa}"`,
  )
  check(routes.form === 0, 'No enquiry form left in the contact section', `Found ${routes.form} form(s) in #contact — the dead enquiry form is back`)

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
