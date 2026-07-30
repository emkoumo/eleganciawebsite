import Image from 'next/image'

/* ---------------------------------------------------------------------------
   VillaImage
   ---------------------------------------------------------------------------
   No villa photographs exist yet (Booking.com blocks automated download), so
   rather than commit fake binary assets this renders a labelled placeholder
   that occupies the exact aspect ratio the real photo will.

   When the real files land in /public/images/villas, set
   NEXT_PUBLIC_PHOTOS_READY=true and every placeholder becomes a real
   next/image with AVIF/WebP conversion and lazy loading — no other code
   change needed. See IMAGES.md.

   `decorative` exists because the same photo is sometimes already described by
   its container: a gallery thumbnail sits inside a button with an aria-label,
   and the lightbox image is described by the dialog's own label plus a live
   caption. In those cases the image itself must be silent, or a screen reader
   announces the same sentence two or three times. The description is still
   rendered visually in the placeholder (aria-hidden) so the layout stays
   readable during development.
--------------------------------------------------------------------------- */

const photosReady = process.env.NEXT_PUBLIC_PHOTOS_READY === 'true'

type Props = {
  src: string
  /** Always the real description, even when `decorative` silences it. */
  alt: string
  width: number
  height: number
  /** True when an ancestor already conveys this description to assistive tech. */
  decorative?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export function VillaImage({
  src,
  alt,
  width,
  height,
  decorative = false,
  className = '',
  sizes,
  priority = false,
}: Props) {
  if (photosReady) {
    return (
      <Image
        src={src}
        alt={decorative ? '' : alt}
        aria-hidden={decorative || undefined}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className={className}
      />
    )
  }

  const filename = src.split('/').pop() ?? src

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-sand ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Decorative hairline frame so the placeholder reads as intentional. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-bronze/20"
      />
      <div aria-hidden="true" className="max-w-[85%] px-4 text-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="mx-auto mb-3 text-bronze"
        >
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 16l4.5-4.5a1.5 1.5 0 012 0L14 16" strokeLinecap="round" />
          <circle cx="15.5" cy="9" r="1.5" />
        </svg>
        <p className="text-xs font-medium leading-snug text-bronze-deep">{alt}</p>
        <p className="mt-2 font-mono text-[10px] leading-tight text-bronze-deep/70">
          {filename}
        </p>
      </div>
      {/* Announce the description only when nothing else does. */}
      {!decorative && <span className="sr-only">{alt}</span>}
    </div>
  )
}
