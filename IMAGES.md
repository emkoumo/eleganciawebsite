# Photography manifest

The site is built and accessible, but **no villa photographs exist yet**.
Booking.com and Agoda both block automated download (HTTP 202, empty body), so
none could be retrieved. Every image slot currently renders a labelled
placeholder at the correct aspect ratio, so layout, filtering and the lightbox
are all testable today.

## Dropping the real photos in

1. Save files to the exact paths in the tables below.
2. Set `NEXT_PUBLIC_PHOTOS_READY=true` (in `.env.local`, and in Vercel's
   environment variables for the deployed site).
3. Rebuild. Placeholders become real `next/image` elements with AVIF/WebP
   conversion and lazy loading. **No code changes needed.**

```bash
echo 'NEXT_PUBLIC_PHOTOS_READY=true' >> .env.local
npm run build && npm run a11y
```

## Source files

Shoot or export at **2400px on the long edge minimum** — Next.js downscales but
cannot invent detail. JPEG at quality 85–90 is fine; Next converts to AVIF/WebP
at build time, so don't pre-optimise.

## ⚠ Alt text must be re-checked

The `alt` text in `src/lib/site.ts` describes the photo **expected** in each
slot — written before any photo existed. Alt text that misdescribes an image is
worse than none, because a screen-reader user is actively misled rather than
merely uninformed.

**Re-read every `alt` string against the actual photo and correct it.** They are
all in one place: the `galleryItems` array in `src/lib/site.ts`.

## Hero

| Path | Ratio | Subject |
|---|---|---|
| `public/images/hero/complex-aerial-dusk.jpg` | 16:9, ≥2400px wide | Wide or aerial view of all three villas, ideally at dusk with pool lighting on. Mount Olympus in frame if possible. |

The hero carries an 85–95% espresso scrim for text contrast, so a **bright,
high-key** image works better than a dark one — it will be substantially
darkened. Do not lower the scrim to compensate; see the measurements in
`src/components/Hero.tsx`.

## Gallery — 18 slots, 6 per villa

Each villa needs the same six shots, so the three read as genuine
like-for-like comparisons rather than an uneven set.

### Villa Serenity

| Path | Orientation |
|---|---|
| `public/images/villas/serenity-pool-terrace.jpg` | landscape 3:2 |
| `public/images/villas/serenity-living-room.jpg` | landscape 3:2 |
| `public/images/villas/serenity-kitchen.jpg` | portrait 2:3 |
| `public/images/villas/serenity-bedroom.jpg` | landscape 3:2 |
| `public/images/villas/serenity-bathroom.jpg` | portrait 2:3 |
| `public/images/villas/serenity-exterior-dusk.jpg` | landscape 3:2 |

### Villa Harmony

| Path | Orientation |
|---|---|
| `public/images/villas/harmony-pool-terrace.jpg` | landscape 3:2 |
| `public/images/villas/harmony-living-room.jpg` | landscape 3:2 |
| `public/images/villas/harmony-kitchen.jpg` | portrait 2:3 |
| `public/images/villas/harmony-bedroom.jpg` | landscape 3:2 |
| `public/images/villas/harmony-bathroom.jpg` | portrait 2:3 |
| `public/images/villas/harmony-garden.jpg` | landscape 3:2 |

### Villa Majesty

| Path | Orientation |
|---|---|
| `public/images/villas/majesty-pool-terrace.jpg` | landscape 3:2 |
| `public/images/villas/majesty-living-room.jpg` | landscape 3:2 |
| `public/images/villas/majesty-kitchen.jpg` | portrait 2:3 |
| `public/images/villas/majesty-bedroom.jpg` | landscape 3:2 |
| `public/images/villas/majesty-bathroom.jpg` | portrait 2:3 |
| `public/images/villas/majesty-mountain-view.jpg` | landscape 3:2 |

Orientation drives the masonry grid: portrait slots span four rows, landscape
three. If you supply a different aspect ratio, update `width`/`height` and
`orientation` for that entry in `src/lib/site.ts` or the tile will crop oddly.

## Changing the slot list

The gallery is generated entirely from `galleryItems` in `src/lib/site.ts` — add
or remove entries there and the grid, the per-villa filters and the lightbox all
follow automatically. Filters are driven by the `villa` field.
