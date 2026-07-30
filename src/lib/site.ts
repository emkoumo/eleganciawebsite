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

  /* TODO: replace with the real published contact details before launch. */
  contact: {
    email: 'TODO@eleganciavillas.gr',
    phone: 'TODO +30 XXX XXX XXXX',
  },

  /** Per-villa logo marks. The villas are identical, so these are branding
      only — there is no per-villa content to differentiate. */
  villaLogos: [
    '/logos/elegancia-villa1-dark.svg',
    '/logos/elegancia-villa2-dark.svg',
    '/logos/elegancia-villa3-dark.svg',
  ],
} as const
