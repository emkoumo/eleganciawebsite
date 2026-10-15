/* ---------------------------------------------------------------------------
   Localisation
   ---------------------------------------------------------------------------
   English is the primary locale and lives at "/". Greek lives at "/el".

   Both are fully static: no runtime locale detection, no cookies, no
   client-side switching. Each locale is its own prerendered document with its
   own <html lang>, which is what screen readers and search engines need — a
   client-side toggle would leave lang="en" while announcing Greek text, and
   pronunciation would be wrong for every Greek visitor.
--------------------------------------------------------------------------- */

export const locales = ['en', 'el'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/** Path prefix for a locale. English is unprefixed. */
export function localePath(locale: Locale, hash = ''): string {
  return (locale === 'en' ? '/' : '/el') + hash
}

export type AmenityIcon =
  | 'pool' | 'hottub' | 'bed' | 'bath' | 'guests' | 'bbq'
  | 'kitchen' | 'garden' | 'parking' | 'wifi' | 'tv' | 'ac'
  | 'lounger' | 'sofa' | 'dining' | 'espresso' | 'kettle' | 'toaster'
  | 'linen' | 'wardrobe' | 'towel' | 'hairdryer' | 'key' | 'lockbox'
  | 'washer' | 'iron' | 'cot'

export type Dictionary = {
  htmlLang: string
  localeName: string
  /** Label on the link to the OTHER locale. */
  switchTo: string
  /** Two-letter form used in the header, where space is tight. */
  switchToShort: string
  switchToAria: string
  menuOpen: string
  menuClose: string
  menuTitle: string
  skipToMain: string
  nav: { about: string; amenities: string; gallery: string; contact: string }
  opensNewTab: string
  /* Search-result description. Its own string rather than a join of hero
     fragments: it has to read as one sentence to a stranger who has not seen
     the page, and it must survive the hero copy being rewritten. ~155
     characters, which is roughly where Google truncates. */
  metaDescription: string
  hero: {
    location: string
    headline: string
    subheading: string
    /* Two direct routes rather than one link out to Booking.com. The header
       still carries the Booking button, so the hero is free to put a human on
       the other end of the first tap. */
    ctaCall: string
    ctaMessage: string
  }
  about: { eyebrow: string; heading: string; paragraphs: string[] }
  /* Highlights absorbed the former Amenities section: one inventory, grouped
     by where you meet it, every line with its own icon. Two sections listing
     overlapping subsets of the same facts — twelve "highlights" above, the
     full twenty-nine below — made the visitor read the same thing twice. */
  highlights: {
    eyebrow: string
    heading: string
    groups: { title: string; items: { label: string; icon: AmenityIcon }[] }[]
    stayNote: string
  }
  gallery: {
    eyebrow: string
    heading: string
    filterLabel: string
    showAll: (n: number) => string
    showFewer: string
    filters: { id: string; label: string }[]
    showing: (n: number) => string
    viewLarger: (alt: string) => string
    close: string
    prev: string
    next: string
    counter: (i: number, n: number) => string
  }
  /* The enquiry form is gone. It posted to /api/enquiry, which validated and
     logged but never actually sent mail — so every enquiry made through it was
     silently dropped. Three real routes that work beat one that does not. */
  contact: {
    eyebrow: string
    heading: string
    body: string
    callLabel: string
    whatsappLabel: string
    emailIntro: string
    mapLink: string
    /** Prefilled into the WhatsApp composer, so the guest starts mid-sentence. */
    whatsappMessage: string
    emailLabel: string
    addressLabel: string
    responseNote: string
  }
  footer: {
    stay: string
    checkIn: string
    checkOut: string
    contact: string
    rights: string
    /** Visible link text. Names the format, because a link that silently
        downloads a file is a surprise worth avoiding. */
    houseRules: string
    /** Per-locale PDF in public/documents/rules/. Paths are deliberately
        ASCII, lowercase and hyphenated: the uploads arrived as
        "Stay Rules & Policies.pdf" and "Κανόνες & Πολιτικές Διαμονής.pdf",
        which encode to unreadable URLs and, in the Greek case, 180 characters
        of percent-escapes. */
    houseRulesPdf: string
  }
  /* EU / ESPA co-funding banner. The artwork itself is localised — the
     publicity rules require the acknowledgement in the language the visitor is
     reading — so the file path is part of the dictionary, not a constant.
     `alt` carries the full acknowledgement because the banner is the
     acknowledgement: an empty alt would hide the one thing it exists to say. */
  espa: { src: string; alt: string }
}

const en: Dictionary = {
  htmlLang: 'en',
  localeName: 'English',
  switchTo: 'Ελληνικά',
  switchToShort: 'ΕΛ',
  switchToAria: 'Switch language to Greek',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  menuTitle: 'Menu',
  skipToMain: 'Skip to main content',
  nav: { about: 'About', amenities: 'Amenities', gallery: 'Gallery', contact: 'Contact' },
  opensNewTab: '(opens in a new tab)',
  metaDescription:
    'Three private villas on the slope between Mount Olympus and the Aegean, each with its own pool and hot tub, for up to six guests. Skotina, Pieria.',
  hero: {
    location: 'Skotina, Pieria, Greece',
    headline: 'Where simplicity meets luxury',
    subheading: 'Private villas built around what matters',
    ctaCall: 'Call us',
    ctaMessage: 'Message us',
  },
  /* The section keeps its place and its layout; only the copy changes. It
     originally restated the hero almost word for word — three villas, three
     pools, no reception — which is why it read as empty despite a tall band.
     It now states the philosophy instead, leaving counts and amenities to
     Highlights and Amenities. */
  about: {
    eyebrow: 'The philosophy',
    heading: 'Nothing more than you need',
    paragraphs: [
      'Elegancia is three private villas, each with its own space and its own quiet. Simplicity here is a choice: clean lines, stone, light, and nothing unnecessary between you and the view.',
      'The pool and the veranda are the centre of the day. That is where the first coffee happens, where the afternoon drifts by, and where the evening ends, once the heat has gone and the hills darken.',
      'Luxury doesn’t mean more things. It means time, space, and a place that doesn’t need to explain itself.',
    ],
  },
  highlights: {
    eyebrow: 'Amenities',
    heading: 'Everything already here',
    groups: [
      {
        title: 'Outdoors',
        items: [
          { label: 'Private pool', icon: 'pool' },
          { label: 'Private hot tub', icon: 'hottub' },
          { label: 'Sun loungers', icon: 'lounger' },
          { label: 'Lounge area', icon: 'sofa' },
          { label: 'BBQ', icon: 'bbq' },
          { label: 'Outdoor dining', icon: 'dining' },
          { label: 'Private garden', icon: 'garden' },
          { label: 'Free private parking', icon: 'parking' },
        ],
      },
      {
        title: 'Living room',
        items: [
          { label: 'Smart TV', icon: 'tv' },
          { label: 'Sofa bed', icon: 'sofa' },
        ],
      },
      {
        title: 'Kitchen',
        items: [
          { label: 'Fully equipped', icon: 'kitchen' },
          { label: 'Espresso machine', icon: 'espresso' },
          { label: 'Kettle', icon: 'kettle' },
          { label: 'Toaster', icon: 'toaster' },
        ],
      },
      {
        title: 'Bedrooms',
        items: [
          { label: '2 master bedrooms', icon: 'bed' },
          { label: 'Up to 6 guests', icon: 'guests' },
          { label: 'Premium bed linen', icon: 'linen' },
          { label: 'Wardrobes', icon: 'wardrobe' },
          { label: 'Smart TV', icon: 'tv' },
        ],
      },
      {
        title: 'Bathrooms',
        items: [
          { label: '2 modern bathrooms', icon: 'bath' },
          { label: 'Towels provided', icon: 'towel' },
          { label: 'Hairdryer', icon: 'hairdryer' },
        ],
      },
      {
        title: 'Also included',
        items: [
          { label: 'High-speed Wi-Fi', icon: 'wifi' },
          { label: 'Air conditioning throughout', icon: 'ac' },
          { label: 'Self check-in', icon: 'key' },
          { label: 'Lockbox', icon: 'lockbox' },
          { label: 'Washing machine', icon: 'washer' },
          { label: 'Iron', icon: 'iron' },
          { label: 'Baby cot on request', icon: 'cot' },
        ],
      },
    ],
    stayNote:
      'Check-in 15:00 – 22:00. Check-out by 11:00. Self check-in by lockbox.',
  },
  gallery: {
    eyebrow: 'Gallery',
    heading: 'Look around',
    filterLabel: 'Filter photographs by area',
    showAll: (n) => `Show all ${n} photographs`,
    showFewer: 'Show fewer',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'outdoor', label: 'Pool & garden' },
      { id: 'living', label: 'Living' },
      { id: 'kitchen', label: 'Kitchen' },
      { id: 'bedroom', label: 'Bedrooms' },
      { id: 'bathroom', label: 'Bathrooms' },
    ],
    showing: (n) => `Showing ${n} ${n === 1 ? 'photograph' : 'photographs'}`,
    viewLarger: (alt) => `View larger: ${alt}`,
    close: 'Close photograph viewer',
    prev: 'Previous',
    next: 'Next',
    counter: (i, n) => `Photograph ${i} of ${n}`,
  },
  contact: {
    eyebrow: 'Book direct',
    heading: 'One message, one answer',
    body:
      'Book with us and there is no platform in between — you talk to the people who own the houses. Ask about dates, prices, a late arrival, six of you and a cot.',
    callLabel: 'Call us',
    whatsappLabel: 'Message us',
    whatsappMessage: 'Hello! I would like to book a stay at Elegancia.',
    emailIntro: 'Or write, if that is easier',
    emailLabel: 'Email',
    addressLabel: 'Where we are',
    mapLink: 'Skotina, Pieria, Greece',
    responseNote: 'We answer within a day, usually sooner.',
  },
  footer: {
    stay: 'Stay',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    contact: 'Contact',
    rights: 'All rights reserved.',
    houseRules: 'House rules (PDF)',
    houseRulesPdf: '/documents/rules/house-rules-en.pdf',
  },
  espa: {
    src: '/images/espa/antagonistikotita-en.jpg',
    /* Kept under 100 characters: WAVE raises a "long alternative text" alert
       past roughly that length, and the three facts that matter — EU
       co-funding, ESPA 2021-2027, Competitiveness programme — fit inside it. */
    alt: 'Co-funded by the European Union — ESPA 2021-2027, Competitiveness Programme',
  },
}

const el: Dictionary = {
  htmlLang: 'el',
  localeName: 'Ελληνικά',
  switchTo: 'English',
  switchToShort: 'EN',
  switchToAria: 'Αλλαγή γλώσσας σε Αγγλικά',
  menuOpen: 'Άνοιγμα μενού',
  menuClose: 'Κλείσιμο μενού',
  menuTitle: 'Μενού',
  skipToMain: 'Μετάβαση στο κύριο περιεχόμενο',
  nav: { about: 'Το συγκρότημα', amenities: 'Παροχές', gallery: 'Φωτογραφίες', contact: 'Επικοινωνία' },
  opensNewTab: '(ανοίγει σε νέα καρτέλα)',
  metaDescription:
    'Τρεις ιδιωτικές βίλες στην πλαγιά ανάμεσα στον Όλυμπο και το Αιγαίο, η καθεμιά με δική της πισίνα και υδρομασάζ, για έως έξι επισκέπτες. Σκοτίνα, Πιερία.',
  hero: {
    location: 'Σκοτίνα, Πιερία, Ελλάδα',
    headline: 'Εκεί που η απλότητα συναντά την πολυτέλεια',
    subheading: 'Ιδιωτικές βίλες χτισμένες γύρω από αυτό που έχει σημασία',
    ctaCall: 'Καλέστε μας',
    ctaMessage: 'Στείλτε μήνυμα',
  },
  about: {
    eyebrow: 'Η φιλοσοφία',
    heading: 'Τίποτα περισσότερο απ’ ό,τι χρειάζεται',
    paragraphs: [
      'Το Elegancia είναι τρεις ιδιωτικές βίλες, η καθεμιά με τον δικό της χώρο και τη δική της ησυχία. Η απλότητα εδώ είναι επιλογή: καθαρές γραμμές, πέτρα, φως και τίποτα περιττό ανάμεσα σε εσάς και στη θέα.',
      'Η πισίνα και η βεράντα είναι το κέντρο της μέρας. Εκεί πίνεις τον πρώτο καφέ, εκεί κυλάει το απόγευμα, και εκεί καταλήγει το βράδυ, όταν η ζέστη έχει φύγει και ο λόφος σκουραίνει.',
      'Πολυτέλεια δεν σημαίνει περισσότερα πράγματα. Σημαίνει χρόνος, χώρος και ένα μέρος που δεν χρειάζεται να σου εξηγήσει τίποτα.',
    ],
  },
  highlights: {
    eyebrow: 'Παροχές',
    heading: 'Όλα είναι ήδη εδώ',
    groups: [
      {
        title: 'Εξωτερικοί χώροι',
        items: [
          { label: 'Ιδιωτική πισίνα', icon: 'pool' },
          { label: 'Ιδιωτικό υδρομασάζ', icon: 'hottub' },
          { label: 'Ξαπλώστρες', icon: 'lounger' },
          { label: 'Χώρος lounge', icon: 'sofa' },
          { label: 'BBQ', icon: 'bbq' },
          { label: 'Εξωτερική τραπεζαρία', icon: 'dining' },
          { label: 'Ιδιωτικός κήπος', icon: 'garden' },
          { label: 'Δωρεάν ιδιωτικό πάρκινγκ', icon: 'parking' },
        ],
      },
      {
        title: 'Σαλόνι',
        items: [
          { label: 'Smart TV', icon: 'tv' },
          { label: 'Καναπές-κρεβάτι', icon: 'sofa' },
        ],
      },
      {
        title: 'Κουζίνα',
        items: [
          { label: 'Πλήρως εξοπλισμένη', icon: 'kitchen' },
          { label: 'Μηχανή espresso', icon: 'espresso' },
          { label: 'Βραστήρας', icon: 'kettle' },
          { label: 'Τοστιέρα', icon: 'toaster' },
        ],
      },
      {
        title: 'Υπνοδωμάτια',
        items: [
          { label: '2 Master υπνοδωμάτια', icon: 'bed' },
          { label: 'Έως 6 επισκέπτες', icon: 'guests' },
          { label: 'Premium κλινοσκεπάσματα', icon: 'linen' },
          { label: 'Ντουλάπες', icon: 'wardrobe' },
          { label: 'Smart TV', icon: 'tv' },
        ],
      },
      {
        title: 'Μπάνια',
        items: [
          { label: '2 μοντέρνα μπάνια', icon: 'bath' },
          { label: 'Πετσέτες', icon: 'towel' },
          { label: 'Πιστολάκι', icon: 'hairdryer' },
        ],
      },
      {
        title: 'Επιπλέον',
        items: [
          { label: 'Wi-Fi υψηλής ταχύτητας', icon: 'wifi' },
          { label: 'Κλιματισμός σε όλους τους χώρους', icon: 'ac' },
          { label: 'Self check-in', icon: 'key' },
          { label: 'Lockbox', icon: 'lockbox' },
          { label: 'Πλυντήριο ρούχων', icon: 'washer' },
          { label: 'Σίδερο', icon: 'iron' },
          { label: 'Βρεφική κούνια (κατόπιν αιτήματος)', icon: 'cot' },
        ],
      },
    ],
    stayNote:
      'Check-in 15:00 – 22:00. Check-out έως 11:00. Self check-in με lockbox.',
  },
  gallery: {
    eyebrow: 'Φωτογραφίες',
    heading: 'Ρίξτε μια ματιά',
    filterLabel: 'Φιλτράρισμα φωτογραφιών ανά χώρο',
    showAll: (n) => `Δείτε όλες τις ${n} φωτογραφίες`,
    showFewer: 'Δείτε λιγότερες',
    filters: [
      { id: 'all', label: 'Όλες' },
      { id: 'outdoor', label: 'Πισίνα & κήπος' },
      { id: 'living', label: 'Σαλόνι' },
      { id: 'kitchen', label: 'Κουζίνα' },
      { id: 'bedroom', label: 'Υπνοδωμάτια' },
      { id: 'bathroom', label: 'Μπάνια' },
    ],
    showing: (n) => `${n} ${n === 1 ? 'φωτογραφία' : 'φωτογραφίες'}`,
    viewLarger: (alt) => `Μεγέθυνση: ${alt}`,
    close: 'Κλείσιμο προβολής φωτογραφίας',
    prev: 'Προηγούμενη',
    next: 'Επόμενη',
    counter: (i, n) => `Φωτογραφία ${i} από ${n}`,
  },
  contact: {
    eyebrow: 'Απευθείας κράτηση',
    heading: 'Ένα μήνυμα, μία απάντηση',
    body:
      'Κάνετε κράτηση χωρίς ενδιάμεσους — μιλάτε απευθείας με τους ιδιοκτήτες. Ρωτήστε για ημερομηνίες, τιμές, μια αργοπορημένη άφιξη, έξι άτομα και μια κούνια.',
    callLabel: 'Καλέστε μας',
    whatsappLabel: 'Στείλτε μήνυμα',
    whatsappMessage: 'Γεια σας! Θα ήθελα να κάνω κράτηση στην Elegancia.',
    emailIntro: 'Ή γράψτε μας, αν σας βολεύει',
    emailLabel: 'Email',
    addressLabel: 'Πού βρισκόμαστε',
    mapLink: 'Σκοτίνα, Πιερία, Ελλάδα',
    responseNote: 'Απαντάμε μέσα σε μία ημέρα, συνήθως νωρίτερα.',
  },
  footer: {
    stay: 'Διαμονή',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    contact: 'Επικοινωνία',
    rights: 'Με την επιφύλαξη παντός δικαιώματος.',
    houseRules: 'Κανονισμός διαμονής (PDF)',
    houseRulesPdf: '/documents/rules/house-rules-el.pdf',
  },
  espa: {
    src: '/images/espa/antagonistikotita-el.jpg',
    alt: 'Με τη συγχρηματοδότηση της Ευρωπαϊκής Ένωσης — ΕΣΠΑ 2021-2027, Πρόγραμμα Ανταγωνιστικότητα',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { en, el }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
