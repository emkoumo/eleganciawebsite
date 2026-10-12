/* ---------------------------------------------------------------------------
   Locale-independent facts.
   All translated copy lives in src/lib/i18n.ts; all photo data in
   src/data/photos.json (typed via src/lib/photos.ts).
--------------------------------------------------------------------------- */

export const site = {
  name: 'Elegancia Luxury Villas',
  /** Canonical origin, used for hreflang alternates and Open Graph. */
  url: 'https://eleganciawebsite.vercel.app',
  /** Booking.com share link. Works for humans; blocks bots. */
  bookingUrl: 'https://www.booking.com/Share-p19G51n',

  /* Verified from the Greek house-rules PDF. */
  checkIn: '15:00 – 22:00',
  checkOut: '11:00',

  contact: {
    email: 'info@elegancialuxuryvillas.com',
    /** E.164, no spaces — what tel: and wa.me both need. */
    phone: '+306931145507',
    /** Grouped for reading. Never put this in an href. */
    phoneDisplay: '+30 693 114 5507',
    /** wa.me wants the number without the leading +. */
    whatsapp: '306931145507',
  },

  /** Per-villa logo marks. The villas are identical, so these are branding
      only — there is no per-villa content to differentiate. */
  villaLogos: [
    '/logos/elegancia-villa1-dark.svg',
    '/logos/elegancia-villa2-dark.svg',
    '/logos/elegancia-villa3-dark.svg',
  ],
} as const
