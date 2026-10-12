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

export type Dictionary = {
  htmlLang: string
  localeName: string
  /** Label on the link to the OTHER locale. */
  switchTo: string
  switchToAria: string
  skipToMain: string
  nav: { about: string; amenities: string; gallery: string; contact: string; book: string }
  opensNewTab: string
  bookOnBooking: string
  hero: {
    location: string
    headline: string
    subheading: string
    /* Three short lines, each rendered on its own row. Kept as an array rather
       than one paragraph so the three-beat rhythm survives every breakpoint
       instead of reflowing into a block. */
    lines: [string, string, string]
    cta: string
  }
  about: { eyebrow: string; heading: string; paragraphs: string[] }
  /* Four materials, each with one close-up. This is what the detail
     photographs are for — they say more about the aesthetic than prose can. */
  materials: {
    eyebrow: string
    heading: string
    items: { name: string; note: string; photo: string }[]
  }
  /* The villas section was removed — three identical villas gave it nothing
     useful to say. The names survive only to populate the contact form's
     "which villa interests you?" dropdown. */
  villas: { names: [string, string, string] }
  highlights: { eyebrow: string; heading: string; items: { label: string; icon: AmenityIcon }[] }
  amenities: {
    eyebrow: string
    heading: string
    groups: { title: string; items: string[] }[]
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
    /** Prefilled into the WhatsApp composer, so the guest starts mid-sentence. */
    whatsappMessage: string
    emailLabel: string
    addressLabel: string
    bookingLink: string
    responseNote: string
  }
  footer: { stay: string; checkIn: string; checkOut: string; contact: string; rights: string }
  stayPolicy: string[]
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
  switchToAria: 'Switch language to Greek',
  skipToMain: 'Skip to main content',
  nav: { about: 'About', amenities: 'Amenities', gallery: 'Gallery', contact: 'Contact', book: 'Book' },
  opensNewTab: '(opens in a new tab)',
  bookOnBooking: 'on Booking.com',
  hero: {
    location: 'Skotina, Pieria, Greece',
    headline: 'Where simplicity meets luxury',
    subheading: 'Private villas built around what matters',
    lines: [
      'Three villas on the slope between Mount Olympus and the Aegean.',
      'Each with its own pool and hot tub, for up to six guests.',
      'No lobby, no reception — you arrive on your own schedule.',
    ],
    cta: 'Check availability',
  },
  /* This section used to restate the hero almost word for word — three villas,
     three pools, no reception — which is why it read as empty despite a tall
     band. The hero already sells what the place IS; About now does the job
     nothing else on the page does, which is the setting and the shape of a day
     in it. No counts, no amenities: Highlights and Amenities own those. */
  about: {
    eyebrow: 'The setting',
    heading: 'Between the mountain and the sea',
    paragraphs: [
      'Skotina sits on the eastern slope of Olympus, with the Thermaic Gulf laid out below and the mountain still climbing behind.',
      'Mornings belong to the pool, before the heat arrives. By late afternoon the light comes in low across the terrace and the hills turn the colour of the stone the houses are built from.',
      'The sea is fifteen minutes down the hill; the first Olympus trailheads about as far back up it. Most people manage both in a day and still cook dinner at home.',
    ],
  },
  /* Captions were two or three words each ("Matte. Unlacquered.") — too clipped
     to tell a guest anything. Each one now gives the material and the reason it
     was chosen, which is the whole argument of the section. */
  materials: {
    eyebrow: 'Made of',
    heading: 'Four materials, nothing more',
    items: [
      { name: 'Natural stone', note: 'Quarried in Pieria, left rough where it meets the living room.', photo: 'living-stone-wall.jpg' },
      { name: 'Pale oak', note: 'Unlacquered, so it warms and darkens a little with use instead of staying new.', photo: 'kitchen-shelf.jpg' },
      { name: 'Microcement', note: 'Poured in one piece through the bathrooms. No grout lines, and cool underfoot in August.', photo: 'bathroom-tap-detail.jpg' },
      { name: 'Linen', note: 'Washed before it ever reaches the bed, which is why it feels soft and falls heavy.', photo: 'bedroom-cushion-detail.jpg' },
    ],
  },
  villas: { names: ['Villa 1', 'Villa 2', 'Villa 3'] },
  highlights: {
    eyebrow: 'Highlights',
    heading: 'What matters',
    items: [
      { label: 'Private pool', icon: 'pool' },
      { label: 'Private hot tub', icon: 'hottub' },
      { label: '2 master bedrooms', icon: 'bed' },
      { label: '2 bathrooms', icon: 'bath' },
      { label: 'Up to 6 guests', icon: 'guests' },
      { label: 'BBQ', icon: 'bbq' },
      { label: 'Fully equipped kitchen', icon: 'kitchen' },
      { label: 'Private garden', icon: 'garden' },
      { label: 'Free private parking', icon: 'parking' },
      { label: 'High-speed Wi-Fi', icon: 'wifi' },
      { label: 'Smart TVs', icon: 'tv' },
      { label: 'Air conditioning throughout', icon: 'ac' },
    ],
  },
  amenities: {
    eyebrow: 'Amenities',
    heading: 'Already here',
    groups: [
      { title: 'Outdoors', items: ['Private pool', 'Private hot tub', 'Sun loungers', 'Lounge area', 'BBQ', 'Outdoor dining', 'Garden', 'Private parking'] },
      { title: 'Living room', items: ['Smart TV', 'Sofa bed'] },
      { title: 'Kitchen', items: ['Fully equipped', 'Espresso machine', 'Kettle', 'Toaster'] },
      { title: 'Bedrooms', items: ['2 master bedrooms', 'Premium bed linen', 'Wardrobes', 'Smart TV'] },
      { title: 'Bathrooms', items: ['2 modern bathrooms', 'Towels provided', 'Hairdryer'] },
      { title: 'Also included', items: ['Wi-Fi', 'Self check-in', 'Lockbox', 'Washing machine', 'Iron', 'Baby cot on request'] },
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
    eyebrow: 'Contact',
    heading: 'Talk to us directly',
    body:
      'Dates and rates live on Booking.com. For everything else — a question about the house, a late ferry, six of you and a cot — it is quicker to just ask.',
    callLabel: 'Call us',
    whatsappLabel: 'Message on WhatsApp',
    whatsappMessage: 'Hello! I have a question about staying at Elegancia.',
    emailLabel: 'Email us',
    addressLabel: 'Where we are',
    bookingLink: 'Check dates and rates on Booking.com',
    responseNote: 'We answer within a day, usually sooner.',
  },
  footer: {
    stay: 'Stay',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    contact: 'Contact',
    rights: 'All rights reserved.',
  },
  stayPolicy: [
    'No smoking indoors',
    'No parties or events without prior approval',
    'Pets only by prior arrangement',
    'Children must be supervised at the pool at all times',
  ],
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
  switchToAria: 'Αλλαγή γλώσσας σε Αγγλικά',
  skipToMain: 'Μετάβαση στο κύριο περιεχόμενο',
  nav: { about: 'Το συγκρότημα', amenities: 'Παροχές', gallery: 'Φωτογραφίες', contact: 'Επικοινωνία', book: 'Κράτηση' },
  opensNewTab: '(ανοίγει σε νέα καρτέλα)',
  bookOnBooking: 'στο Booking.com',
  hero: {
    location: 'Σκοτίνα, Πιερία, Ελλάδα',
    headline: 'Εκεί που η απλότητα συναντά την πολυτέλεια',
    subheading: 'Ιδιωτικές βίλες χτισμένες γύρω από αυτό που έχει σημασία',
    lines: [
      'Τρεις βίλες στην πλαγιά ανάμεσα στον Όλυμπο και το Αιγαίο.',
      'Κάθε μία με ιδιωτική πισίνα και υδρομασάζ, για έως έξι επισκέπτες.',
      'Χωρίς υποδοχή — φτάνετε στον δικό σας χρόνο.',
    ],
    cta: 'Δείτε διαθεσιμότητα',
  },
  about: {
    eyebrow: 'Η τοποθεσία',
    heading: 'Ανάμεσα στο βουνό και τη θάλασσα',
    paragraphs: [
      'Η Σκοτίνα βρίσκεται στην ανατολική πλαγιά του Ολύμπου, με τον Θερμαϊκό απλωμένο από κάτω και το βουνό να συνεχίζει να ανηφορίζει από πίσω.',
      'Τα πρωινά ανήκουν στην πισίνα, πριν ανέβει η ζέστη. Αργά το απόγευμα το φως πέφτει πλάγια στη βεράντα και οι λόφοι παίρνουν το χρώμα της πέτρας από την οποία είναι χτισμένα τα σπίτια.',
      'Η θάλασσα είναι δεκαπέντε λεπτά πιο κάτω· τα πρώτα μονοπάτια του Ολύμπου περίπου άλλα τόσα πιο πάνω. Οι περισσότεροι προλαβαίνουν και τα δύο μέσα στην ημέρα, και μαγειρεύουν κιόλας το βράδυ.',
    ],
  },
  materials: {
    eyebrow: 'Υλικά',
    heading: 'Τέσσερα υλικά, τίποτα άλλο',
    items: [
      { name: 'Φυσική πέτρα', note: 'Από λατομεία της Πιερίας, αφημένη αδρή εκεί που συναντά το σαλόνι.', photo: 'living-stone-wall.jpg' },
      { name: 'Ανοιχτή δρυς', note: 'Χωρίς βερνίκι, ώστε να ζεσταίνει και να σκουραίνει λίγο με τη χρήση αντί να μένει καινούργια.', photo: 'kitchen-shelf.jpg' },
      { name: 'Μικροτσιμέντο', note: 'Χυτό σε ένα κομμάτι σε όλα τα μπάνια. Χωρίς αρμούς, και δροσερό τον Αύγουστο.', photo: 'bathroom-tap-detail.jpg' },
      { name: 'Λινό', note: 'Πλυμένο πριν φτάσει καν στο κρεβάτι — γι’ αυτό είναι μαλακό και πέφτει βαρύ.', photo: 'bedroom-cushion-detail.jpg' },
    ],
  },
  villas: { names: ['Βίλα 1', 'Βίλα 2', 'Βίλα 3'] },
  highlights: {
    eyebrow: 'Τα σημαντικά',
    heading: 'Αυτά που μετρούν',
    items: [
      { label: 'Ιδιωτική πισίνα', icon: 'pool' },
      { label: 'Ιδιωτικό υδρομασάζ', icon: 'hottub' },
      { label: '2 Master υπνοδωμάτια', icon: 'bed' },
      { label: '2 Μπάνια', icon: 'bath' },
      { label: 'Έως 6 επισκέπτες', icon: 'guests' },
      { label: 'BBQ', icon: 'bbq' },
      { label: 'Πλήρως εξοπλισμένη κουζίνα', icon: 'kitchen' },
      { label: 'Ιδιωτικός κήπος', icon: 'garden' },
      { label: 'Δωρεάν ιδιωτικό πάρκινγκ', icon: 'parking' },
      { label: 'Wi-Fi υψηλής ταχύτητας', icon: 'wifi' },
      { label: 'Smart TVs', icon: 'tv' },
      { label: 'Κλιματισμός σε όλους τους χώρους', icon: 'ac' },
    ],
  },
  amenities: {
    eyebrow: 'Παροχές',
    heading: 'Όλα εδώ',
    groups: [
      { title: 'Εξωτερικοί χώροι', items: ['Ιδιωτική πισίνα', 'Ιδιωτικό υδρομασάζ', 'Ξαπλώστρες', 'Χώρος lounge', 'BBQ', 'Εξωτερική τραπεζαρία', 'Κήπος', 'Ιδιωτικό πάρκινγκ'] },
      { title: 'Σαλόνι', items: ['Smart TV', 'Καναπές-κρεβάτι'] },
      { title: 'Κουζίνα', items: ['Πλήρως εξοπλισμένη', 'Μηχανή espresso', 'Βραστήρας', 'Τοστιέρα'] },
      { title: 'Υπνοδωμάτια', items: ['2 Master υπνοδωμάτια', 'Premium κλινοσκεπάσματα', 'Ντουλάπες', 'Smart TV'] },
      { title: 'Μπάνια', items: ['2 μοντέρνα μπάνια', 'Πετσέτες', 'Πιστολάκι'] },
      { title: 'Επιπλέον', items: ['Wi-Fi', 'Self check-in', 'Lockbox', 'Πλυντήριο ρούχων', 'Σίδερο', 'Βρεφική κούνια (κατόπιν αιτήματος)'] },
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
    eyebrow: 'Επικοινωνία',
    heading: 'Μιλήστε μαζί μας',
    body:
      'Ημερομηνίες και τιμές θα βρείτε στο Booking.com. Για οτιδήποτε άλλο — μια απορία για το σπίτι, μια αργοπορημένη άφιξη, έξι άτομα και μια κούνια — είναι πιο γρήγορο να ρωτήσετε.',
    callLabel: 'Καλέστε μας',
    whatsappLabel: 'Στείλτε μήνυμα στο WhatsApp',
    whatsappMessage: 'Γεια σας! Έχω μια ερώτηση για μια διαμονή στην Elegancia.',
    emailLabel: 'Στείλτε μας email',
    addressLabel: 'Πού βρισκόμαστε',
    bookingLink: 'Δείτε ημερομηνίες και τιμές στο Booking.com',
    responseNote: 'Απαντάμε μέσα σε μία ημέρα, συνήθως νωρίτερα.',
  },
  footer: {
    stay: 'Διαμονή',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    contact: 'Επικοινωνία',
    rights: 'Με την επιφύλαξη παντός δικαιώματος.',
  },
  stayPolicy: [
    'Απαγορεύεται το κάπνισμα στους εσωτερικούς χώρους',
    'Δεν επιτρέπονται πάρτι ή εκδηλώσεις χωρίς έγκριση',
    'Κατοικίδια μόνο κατόπιν συμφωνίας',
    'Τα παιδιά πρέπει να επιβλέπονται συνεχώς στην πισίνα',
  ],
  espa: {
    src: '/images/espa/antagonistikotita-el.jpg',
    alt: 'Με τη συγχρηματοδότηση της Ευρωπαϊκής Ένωσης — ΕΣΠΑ 2021-2027, Πρόγραμμα Ανταγωνιστικότητα',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { en, el }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
