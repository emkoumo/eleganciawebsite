/* ---------------------------------------------------------------------------
   Icons
   ---------------------------------------------------------------------------
   Hand-drawn on a consistent 24x24 viewBox with a 1.25 stroke, matching the
   hairline weight used elsewhere. Every icon is aria-hidden: they are always
   paired with a visible text label, so announcing them would only duplicate.
   (No emoji — they render inconsistently and read poorly on screen readers.)
--------------------------------------------------------------------------- */

import type { AmenityIcon } from '@/lib/i18n'

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

export const amenityIcons: Record<AmenityIcon, React.ReactElement> = {
  pool: (
    <svg {...base}>
      <path d="M2 17c1.5 0 2.2-1 3.7-1s2.2 1 3.7 1 2.2-1 3.7-1 2.2 1 3.7 1 2.2-1 3.5-1" />
      <path d="M2 21c1.5 0 2.2-1 3.7-1s2.2 1 3.7 1 2.2-1 3.7-1 2.2 1 3.7 1 2.2-1 3.5-1" />
      <path d="M7 13V4.5A1.5 1.5 0 018.5 3A1.5 1.5 0 0110 4.5V5" />
      <path d="M15 13V4.5A1.5 1.5 0 0116.5 3A1.5 1.5 0 0118 4.5V5" />
      <path d="M7 8h8" />
    </svg>
  ),
  hottub: (
    <svg {...base}>
      <path d="M3 12h18v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6z" />
      <path d="M7 9c0-1.2.8-1.8.8-3S7 3.8 7 2.6" />
      <path d="M12 9c0-1.2.8-1.8.8-3S12 3.8 12 2.6" />
      <path d="M17 9c0-1.2.8-1.8.8-3S17 3.8 17 2.6" />
      <path d="M7 15.5h.01M12 15.5h.01M17 15.5h.01" />
    </svg>
  ),
  bed: (
    <svg {...base}>
      <path d="M2 19v-7a2 2 0 012-2h12a4 4 0 014 4v5" />
      <path d="M2 15h20" />
      <path d="M6.5 10V7.5A1.5 1.5 0 018 6h4" />
      <circle cx="7" cy="12.5" r="1.2" />
    </svg>
  ),
  bath: (
    <svg {...base}>
      <path d="M3 12h18v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3z" />
      <path d="M6 12V6a2 2 0 012-2h1" />
      <path d="M9 6.5h3" />
      <path d="M7 21l-1 1M17 21l1 1" />
    </svg>
  ),
  guests: (
    <svg {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1" />
      <path d="M16 5.5a3 3 0 010 5.8" />
      <path d="M18 14.2a5 5 0 013 4.6V20" />
    </svg>
  ),
  bbq: (
    <svg {...base}>
      <path d="M4 6h16l-2.2 6.5a4 4 0 01-3.8 2.7h-4a4 4 0 01-3.8-2.7L4 6z" />
      <path d="M9 15.2L7.5 21M15 15.2L16.5 21" />
      <path d="M9.5 3.2c0 .9-1 1.3-1 2.2M14.5 3.2c0 .9-1 1.3-1 2.2" />
    </svg>
  ),
  kitchen: (
    <svg {...base}>
      <path d="M6 3v7a2 2 0 002 2a2 2 0 002-2V3" />
      <path d="M8 12v9" />
      <path d="M16 3v18" />
      <path d="M16 3c1.7 0 3 1.6 3 3.5S17.7 10 16 10" />
    </svg>
  ),
  garden: (
    <svg {...base}>
      <path d="M12 21v-7" />
      <path d="M12 14c-3.5 0-5.5-2.2-5.5-5S8.5 3.5 12 6c3.5-2.5 5.5-.3 5.5 3s-2 5-5.5 5z" />
      <path d="M5 21h14" />
    </svg>
  ),
  parking: (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9.5 17V7.5h3a3 3 0 010 6h-3" />
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
  tv: (
    <svg {...base}>
      <rect x="2.5" y="5" width="19" height="12" rx="1.5" />
      <path d="M8.5 21h7" />
      <path d="M12 17v4" />
    </svg>
  ),
  ac: (
    <svg {...base}>
      <rect x="2.5" y="4" width="19" height="8" rx="1.5" />
      <path d="M6 8h5" />
      <path d="M7 15.5v1M12 15.5v2.5M17 15.5v1" />
    </svg>
  ),

  /* Added when the full amenity inventory moved into this section. Every item
     carries its own icon rather than sharing one per category, because the
     section's whole design idea is an icon beside each line. `sofa` is used for
     both the outdoor lounge and the sofa bed — the same object in two places. */
  lounger: (
    <svg {...base}>
      <path d="M2.5 20h19" />
      <path d="M5 20l1.6-5.5h7.4l4.5-7" />
      <path d="M6.6 14.5l-.9-3.2 7.6-2.2 1 3" />
    </svg>
  ),
  sofa: (
    <svg {...base}>
      <path d="M3 11V8.5A2.5 2.5 0 015.5 6h13A2.5 2.5 0 0121 8.5V11" />
      <path d="M2 11.5a2 2 0 012 2V17h16v-3.5a2 2 0 012-2" />
      <path d="M6.5 11h11" />
      <path d="M6 17v2M18 17v2" />
    </svg>
  ),
  dining: (
    <svg {...base}>
      <path d="M3 9c0-3.3 4-6 9-6s9 2.7 9 6z" />
      <path d="M12 9v12" />
      <path d="M8.5 21h7" />
    </svg>
  ),
  espresso: (
    <svg {...base}>
      <path d="M4 9h12v5a4 4 0 01-4 4H8a4 4 0 01-4-4V9z" />
      <path d="M16 10h1.5a2.5 2.5 0 010 5H16" />
      <path d="M3 21h14" />
      <path d="M7.5 3.5c0 .9-.9 1.3-.9 2.2M11.5 3.5c0 .9-.9 1.3-.9 2.2" />
    </svg>
  ),
  kettle: (
    <svg {...base}>
      <path d="M5 11h10v6a3 3 0 01-3 3H8a3 3 0 01-3-3v-6z" />
      <path d="M15 12.5L19.5 10" />
      <path d="M7.5 11V9.5a2.5 2.5 0 015 0V11" />
      <path d="M4 20.5h12" />
    </svg>
  ),
  toaster: (
    <svg {...base}>
      <rect x="3" y="10" width="18" height="9" rx="2" />
      <path d="M8 10V8.6a1.6 1.6 0 013.2 0V10" />
      <path d="M12.8 10V8.6a1.6 1.6 0 013.2 0V10" />
      <path d="M6.5 15h5" />
    </svg>
  ),
  linen: (
    <svg {...base}>
      <rect x="3" y="6" width="18" height="5" rx="1" />
      <rect x="3" y="13" width="18" height="5" rx="1" />
      <path d="M8 6v5M8 13v5" />
    </svg>
  ),
  wardrobe: (
    <svg {...base}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18" />
      <path d="M10 11v2M14 11v2" />
    </svg>
  ),
  towel: (
    <svg {...base}>
      <path d="M3 5h18" />
      <path d="M7 5v11a2 2 0 002 2h6a2 2 0 002-2V5" />
      <path d="M7 9.5h10" />
    </svg>
  ),
  hairdryer: (
    <svg {...base}>
      <path d="M3 10a4 4 0 014-4h6l6-2.5v13L13 14H7a4 4 0 01-4-4z" />
      <path d="M8.5 14l1.3 6.5" />
    </svg>
  ),
  key: (
    <svg {...base}>
      <circle cx="7.5" cy="12" r="4" />
      <path d="M11.5 12H21" />
      <path d="M17.5 12v3.5M20 12v2.5" />
    </svg>
  ),
  lockbox: (
    <svg {...base}>
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M7.5 9V6.5a4.5 4.5 0 019 0V9" />
      <circle cx="12" cy="14.5" r="1.5" />
    </svg>
  ),
  washer: (
    <svg {...base}>
      <rect x="3.5" y="3" width="17" height="18" rx="2" />
      <circle cx="12" cy="14" r="4.5" />
      <circle cx="12" cy="14" r="1.6" />
      <path d="M7 6.5h.01M10 6.5h.01" />
    </svg>
  ),
  iron: (
    <svg {...base}>
      <path d="M3 17h15a3 3 0 003-3v-1H8a5 5 0 00-5 4z" />
      <path d="M8 13V9.5A2.5 2.5 0 0110.5 7h5A2.5 2.5 0 0118 9.5V13" />
      <path d="M4 20.5h14" />
    </svg>
  ),
  cot: (
    <svg {...base}>
      <path d="M3 6v14M21 6v14" />
      <path d="M3 10h18M3 19.5h18" />
      <path d="M7.5 10v9.5M12 10v9.5M16.5 10v9.5" />
    </svg>
  ),
}
