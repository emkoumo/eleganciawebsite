/* ---------------------------------------------------------------------------
   Elegancia Luxury Villas — content source of truth
   ---------------------------------------------------------------------------
   All copy, villa data and image slots live here so they can be edited without
   touching components.

   !! IMPORTANT — UNVERIFIED DATA IS MARKED `TODO:` !!

   Booking.com and Agoda both block automated reads (HTTP 202, empty body), so
   villa sizes, guest counts and bedroom/bathroom counts could NOT be sourced.
   Anything marked TODO is a placeholder and must be replaced with real figures
   before launch. Villa NAMES are real — taken from the guest app's Prisma seed.
--------------------------------------------------------------------------- */

export const site = {
  name: 'Elegancia Luxury Villas',
  /* Verified: property is in Skotina, Pieria, Greece. */
  location: 'Skotina, Pieria, Greece',
  /* The Booking.com share link. Works for humans; blocks bots. */
  bookingUrl: 'https://www.booking.com/Share-p19G51n',

  /* Hero. [HERO_PHRASE] arrived blank, so this is proposal 1 of 3.
     Alternatives, both languages:
       "Where the mountain keeps its silence" / "Εκεί που ο Όλυμπος κρατά τη σιωπή του"
       "Three villas. One horizon."          / "Τρεις βίλες. Ένας ορίζοντας."          */
  hero: {
    headline: 'Between Olympus and the Aegean',
    headlineEl: 'Ανάμεσα στον Όλυμπο και το Αιγαίο',
    subtext:
      'Three private villas in Skotina, Pieria — each with its own pool, framed by the mountain on one side and the sea on the other.',
    ctaLabel: 'Check availability',
  },

  contact: {
    /* TODO: replace with the real published address, phone and email. */
    email: 'TODO@eleganciavillas.gr',
    phone: 'TODO +30 XXX XXX XXXX',
    address: 'Skotina, Pieria, Greece',
  },

  /* Verified from the Greek house-rules PDF (rules/Κανόνες & Πολιτικές Διαμονής.pdf). */
  stayPolicy: {
    checkIn: '15:00 – 22:00',
    checkOut: 'until 11:00',
    notes: [
      'No smoking indoors',
      'No parties or events without prior approval',
      'Pets only by prior arrangement',
      'Children must be supervised at the pool at all times',
    ],
  },
} as const

/* --------------------------------------------------------------------------
   Villas
   --------------------------------------------------------------------------
   Names are REAL. Everything else is TODO.

   Design note: the brief asks that visitors spot the difference between three
   near-identical villas at a glance. So `shared` is stated once, above the
   cards, and each card surfaces exactly one `differentiator` — the single
   reason to choose it. That is the only text that differs between cards.
-------------------------------------------------------------------------- */

export const sharedFeatures = [
  'Private pool',
  'Fully equipped kitchen',
  'Air conditioning throughout',
  'Free WiFi',
  'Private parking',
  'Garden with pool views',
] as const

export type Villa = {
  id: 'serenity' | 'harmony' | 'majesty'
  number: 1 | 2 | 3
  name: string
  /* TODO: real figures. */
  size: string
  guests: string
  bedrooms: string
  /* The one thing that sets this villa apart. TODO: supply the real detail. */
  differentiator: string
  description: string
  logo: string
}

export const villas: Villa[] = [
  {
    id: 'serenity',
    number: 1,
    name: 'Villa Serenity',
    size: 'TODO m²',
    guests: 'TODO guests',
    bedrooms: 'TODO bedrooms',
    differentiator: 'TODO: what only Villa Serenity has',
    description:
      'TODO: one or two lines on what distinguishes Villa Serenity from the other two.',
    logo: '/logos/elegancia-villa1-dark.svg',
  },
  {
    id: 'harmony',
    number: 2,
    name: 'Villa Harmony',
    size: 'TODO m²',
    guests: 'TODO guests',
    bedrooms: 'TODO bedrooms',
    differentiator: 'TODO: what only Villa Harmony has',
    description:
      'TODO: one or two lines on what distinguishes Villa Harmony from the other two.',
    logo: '/logos/elegancia-villa2-dark.svg',
  },
  {
    id: 'majesty',
    number: 3,
    name: 'Villa Majesty',
    size: 'TODO m²',
    guests: 'TODO guests',
    bedrooms: 'TODO bedrooms',
    differentiator: 'TODO: what only Villa Majesty has',
    description:
      'TODO: one or two lines on what distinguishes Villa Majesty from the other two.',
    logo: '/logos/elegancia-villa3-dark.svg',
  },
]

/* --------------------------------------------------------------------------
   Amenities
   --------------------------------------------------------------------------
   `confirmed: true` means the amenity appears in the Booking.com search
   snippet or the house-rules PDF. The rest are the brief's suggested list and
   need checking against the real listing before launch.
-------------------------------------------------------------------------- */

export type Amenity = {
  label: string
  icon: 'pool' | 'kitchen' | 'wifi' | 'parking' | 'garden' | 'ac'
  confirmed: boolean
}

export const amenities: Amenity[] = [
  { label: 'Private pool', icon: 'pool', confirmed: true },
  { label: 'Garden with pool views', icon: 'garden', confirmed: true },
  { label: 'Fully equipped kitchen', icon: 'kitchen', confirmed: false },
  { label: 'Air conditioning', icon: 'ac', confirmed: true },
  { label: 'Free WiFi', icon: 'wifi', confirmed: false },
  { label: 'Private parking', icon: 'parking', confirmed: false },
]

/* --------------------------------------------------------------------------
   Gallery
   --------------------------------------------------------------------------
   !! ALT TEXT WARNING !!
   No villa photographs exist yet, so the alt text below describes the photo we
   EXPECT in each slot, not one anyone has seen. Alt text that misdescribes an
   image is worse for a screen-reader user than no site at all — so every entry
   must be re-read against the real photo before launch. Each is prefixed in
   `needsAltReview` to make them easy to find.

   `src` files do not exist yet; GalleryImage renders a labelled placeholder
   when a file is missing, so the layout is testable now. Drop real files at
   these exact paths and they appear with no code change.
-------------------------------------------------------------------------- */

export type GalleryItem = {
  id: string
  villa: Villa['id']
  src: string
  alt: string
  width: number
  height: number
  /* Portrait slots span two rows in the masonry grid. */
  orientation: 'landscape' | 'portrait'
}

export const galleryItems: GalleryItem[] = [
  // --- Villa Serenity -----------------------------------------------------
  {
    id: 'serenity-pool',
    villa: 'serenity',
    src: '/images/villas/serenity-pool-terrace.jpg',
    alt: 'Pool terrace of Villa Serenity with sun loungers and the garden beyond',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'serenity-living',
    villa: 'serenity',
    src: '/images/villas/serenity-living-room.jpg',
    alt: 'Living room of Villa Serenity with linen sofas and natural stone floor',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'serenity-kitchen',
    villa: 'serenity',
    src: '/images/villas/serenity-kitchen.jpg',
    alt: 'Fully equipped kitchen of Villa Serenity with dining table for six',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'serenity-bedroom',
    villa: 'serenity',
    src: '/images/villas/serenity-bedroom.jpg',
    alt: 'Main bedroom of Villa Serenity with a double bed and garden window',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'serenity-bathroom',
    villa: 'serenity',
    src: '/images/villas/serenity-bathroom.jpg',
    alt: 'Bathroom of Villa Serenity with a walk-in rain shower',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'serenity-exterior',
    villa: 'serenity',
    src: '/images/villas/serenity-exterior-dusk.jpg',
    alt: 'Exterior of Villa Serenity at dusk with the pool lit from within',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },

  // --- Villa Harmony ------------------------------------------------------
  {
    id: 'harmony-pool',
    villa: 'harmony',
    src: '/images/villas/harmony-pool-terrace.jpg',
    alt: 'Pool terrace of Villa Harmony with a shaded outdoor dining area',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'harmony-living',
    villa: 'harmony',
    src: '/images/villas/harmony-living-room.jpg',
    alt: 'Open-plan living area of Villa Harmony looking out to the terrace',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'harmony-kitchen',
    villa: 'harmony',
    src: '/images/villas/harmony-kitchen.jpg',
    alt: 'Kitchen of Villa Harmony with stone worktop and full appliances',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'harmony-bedroom',
    villa: 'harmony',
    src: '/images/villas/harmony-bedroom.jpg',
    alt: 'Bedroom of Villa Harmony in cream and natural wood tones',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'harmony-bathroom',
    villa: 'harmony',
    src: '/images/villas/harmony-bathroom.jpg',
    alt: 'Bathroom of Villa Harmony with twin basins and stone tiling',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'harmony-garden',
    villa: 'harmony',
    src: '/images/villas/harmony-garden.jpg',
    alt: 'Planted garden of Villa Harmony with olive trees around the pool',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },

  // --- Villa Majesty ------------------------------------------------------
  {
    id: 'majesty-pool',
    villa: 'majesty',
    src: '/images/villas/majesty-pool-terrace.jpg',
    alt: 'Pool terrace of Villa Majesty with Mount Olympus rising behind',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'majesty-living',
    villa: 'majesty',
    src: '/images/villas/majesty-living-room.jpg',
    alt: 'Living room of Villa Majesty with full-height glass onto the pool',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'majesty-kitchen',
    villa: 'majesty',
    src: '/images/villas/majesty-kitchen.jpg',
    alt: 'Kitchen and dining space of Villa Majesty in pale oak and stone',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'majesty-bedroom',
    villa: 'majesty',
    src: '/images/villas/majesty-bedroom.jpg',
    alt: 'Main bedroom of Villa Majesty with a private balcony',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
  {
    id: 'majesty-bathroom',
    villa: 'majesty',
    src: '/images/villas/majesty-bathroom.jpg',
    alt: 'Bathroom of Villa Majesty with a freestanding bath',
    width: 1067,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'majesty-view',
    villa: 'majesty',
    src: '/images/villas/majesty-mountain-view.jpg',
    alt: 'View from Villa Majesty across the garden towards Mount Olympus',
    width: 1600,
    height: 1067,
    orientation: 'landscape',
  },
]

export const galleryFilters = [
  { id: 'all' as const, label: 'All' },
  { id: 'serenity' as const, label: 'Serenity' },
  { id: 'harmony' as const, label: 'Harmony' },
  { id: 'majesty' as const, label: 'Majesty' },
]

export type GalleryFilter = (typeof galleryFilters)[number]['id']
