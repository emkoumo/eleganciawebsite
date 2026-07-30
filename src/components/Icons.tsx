/* ---------------------------------------------------------------------------
   Icons
   ---------------------------------------------------------------------------
   Hand-drawn on a consistent 24x24 viewBox with a 1.25 stroke, matching the
   hairline weight used elsewhere. Every icon is aria-hidden: they are always
   paired with a visible text label, so announcing them would only duplicate.
   (No emoji — they render inconsistently and read poorly on screen readers.)
--------------------------------------------------------------------------- */

import type { Amenity } from '@/lib/site'

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const amenityIcons: Record<Amenity['icon'], React.ReactElement> = {
  pool: (
    <svg {...base}>
      <path d="M2 17c1.5 0 2.2-1 3.7-1s2.2 1 3.7 1 2.2-1 3.7-1 2.2 1 3.7 1 2.2-1 3.5-1" />
      <path d="M2 21c1.5 0 2.2-1 3.7-1s2.2 1 3.7 1 2.2-1 3.7-1 2.2 1 3.7 1 2.2-1 3.5-1" />
      <path d="M7 13V4.5A1.5 1.5 0 018.5 3h0A1.5 1.5 0 0110 4.5V5" />
      <path d="M15 13V4.5A1.5 1.5 0 0116.5 3h0A1.5 1.5 0 0118 4.5V5" />
      <path d="M7 8h8" />
    </svg>
  ),
  kitchen: (
    <svg {...base}>
      <path d="M6 3v7a2 2 0 002 2h0a2 2 0 002-2V3" />
      <path d="M8 12v9" />
      <path d="M16 3v18" />
      <path d="M16 3c1.7 0 3 1.6 3 3.5S17.7 10 16 10" />
    </svg>
  ),
  wifi: (
    <svg {...base}>
      <path d="M2.5 9a13 13 0 0119 0" />
      <path d="M6 12.5a8.5 8.5 0 0112 0" />
      <path d="M9.5 16a4 4 0 015 0" />
      <circle cx="12" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  parking: (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9.5 17V7.5h3a3 3 0 010 6h-3" />
    </svg>
  ),
  garden: (
    <svg {...base}>
      <path d="M12 21v-7" />
      <path d="M12 14c-3.5 0-5.5-2.2-5.5-5S8.5 3.5 12 6c3.5-2.5 5.5-.3 5.5 3s-2 5-5.5 5z" />
      <path d="M5 21h14" />
    </svg>
  ),
  ac: (
    <svg {...base}>
      <rect x="2.5" y="4" width="19" height="8" rx="1.5" />
      <path d="M6 8h5" />
      <path d="M7 15.5v1M12 15.5v2.5M17 15.5v1" />
    </svg>
  ),
}
