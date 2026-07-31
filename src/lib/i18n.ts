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
  contact: {
    eyebrow: string
    heading: string
    body: string
    emailLabel: string
    phoneLabel: string
    addressLabel: string
    bookingLink: string
    form: {
      name: string
      email: string
      emailHint: string
      villa: string
      villaAny: string
      arrival: string
      departure: string
      message: string
      submit: string
      submitting: string
      required: string
      errName: string
      errEmailEmpty: string
      errEmailInvalid: string
      errMessage: string
      success: string
      failure: string
    }
  }
  footer: { stay: string; checkIn: string; checkOut: string; contact: string; rights: string }
  stayPolicy: string[]
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
  about: {
    eyebrow: 'The complex',
    heading: 'A quiet address between mountain and sea',
    paragraphs: [
      'Elegancia is three private villas in Skotina, set where the foothills of Mount Olympus settle towards the Aegean. The complex is small by design — three houses, three pools, no shared lobby and no reception desk. What you get instead is the quiet of a private residence with the coast a short drive away.',
      'Each villa sleeps up to six across two master bedrooms, with two bathrooms, a fully equipped kitchen and its own pool and hot tub. Self check-in by lockbox means you arrive on your own schedule.',
      'The interiors are deliberately understated — microcement, pale oak, natural stone and linen in a Mediterranean palette of cream, sand and bronze. Nothing competes with the view. The intention throughout is restraint rather than display.',
    ],
  },
  villas: { names: ['Villa 1', 'Villa 2', 'Villa 3'] },
  highlights: {
    eyebrow: 'Highlights',
    heading: 'What matters most',
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
    heading: 'Everything already in place',
    groups: [
      { title: 'Outdoors', items: ['Private pool', 'Private hot tub', 'Sun loungers', 'Lounge area', 'BBQ', 'Outdoor dining', 'Garden', 'Private parking'] },
      { title: 'Living room', items: ['Smart TV', 'Sofa bed'] },
      { title: 'Kitchen', items: ['Fully equipped', 'Espresso machine', 'Kettle', 'Toaster'] },
      { title: 'Bedrooms', items: ['2 master bedrooms', 'Premium bed linen', 'Wardrobes', 'Smart TV'] },
      { title: 'Bathrooms', items: ['2 modern bathrooms', 'Towels provided', 'Hairdryer'] },
      { title: 'Also included', items: ['Wi-Fi', 'Self check-in', 'Lockbox', 'Washing machine', 'Iron', 'Baby cot on request'] },
    ],
    stayNote:
      'Check-in is 15:00 – 22:00 and check-out is until 11:00. Self check-in by lockbox. Full house rules are provided on arrival.',
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
    eyebrow: 'Enquiries',
    heading: 'Ask us anything',
    body:
      'For availability and rates the fastest route is Booking.com. For longer stays, or anything the site does not answer, write to us directly.',
    emailLabel: 'Email',
    phoneLabel: 'Telephone',
    addressLabel: 'Address',
    bookingLink: 'Check dates and rates on Booking.com',
    form: {
      name: 'Your name',
      email: 'Email address',
      emailHint: 'We reply within 24 hours.',
      villa: 'Which villa interests you?',
      villaAny: 'No preference',
      arrival: 'Arrival',
      departure: 'Departure',
      message: 'Your message',
      submit: 'Send enquiry',
      submitting: 'Sending…',
      required: '(required)',
      errName: 'Please enter your name.',
      errEmailEmpty: 'Please enter your email address.',
      errEmailInvalid: 'Enter a valid email address, for example name@example.com.',
      errMessage: 'Please tell us a little about your stay.',
      success: 'Thank you — your enquiry has been sent. We will reply within 24 hours.',
      failure: 'Something went wrong sending your enquiry. Please email us directly instead.',
    },
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
    eyebrow: 'Το συγκρότημα',
    heading: 'Ένας ήσυχος προορισμός ανάμεσα στο βουνό και τη θάλασσα',
    paragraphs: [
      'Η Elegancia είναι τρεις ιδιωτικές βίλες στη Σκοτίνα, εκεί όπου οι πλαγιές του Ολύμπου κατεβαίνουν προς το Αιγαίο. Το συγκρότημα είναι μικρό από επιλογή — τρία σπίτια, τρεις πισίνες, χωρίς κοινόχρηστη υποδοχή. Αυτό που κερδίζετε είναι η ησυχία μιας ιδιωτικής κατοικίας, με την παραλία λίγα λεπτά μακριά.',
      'Κάθε βίλα φιλοξενεί έως έξι επισκέπτες σε δύο master υπνοδωμάτια, με δύο μπάνια, πλήρως εξοπλισμένη κουζίνα και δική της πισίνα και υδρομασάζ. Με self check-in μέσω lockbox, φτάνετε στον δικό σας χρόνο.',
      'Οι εσωτερικοί χώροι είναι σκόπιμα λιτοί — microcement, ανοιχτή δρυς, φυσική πέτρα και λινά, σε μια μεσογειακή παλέτα από κρεμ, άμμο και μπρονζέ. Τίποτα δεν ανταγωνίζεται τη θέα. Η πρόθεση παντού είναι η εγκράτεια, όχι η επίδειξη.',
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
    heading: 'Όλα στη θέση τους',
    groups: [
      { title: 'Εξωτερικοί χώροι', items: ['Ιδιωτική πισίνα', 'Ιδιωτικό υδρομασάζ', 'Ξαπλώστρες', 'Χώρος lounge', 'BBQ', 'Εξωτερική τραπεζαρία', 'Κήπος', 'Ιδιωτικό πάρκινγκ'] },
      { title: 'Σαλόνι', items: ['Smart TV', 'Καναπές-κρεβάτι'] },
      { title: 'Κουζίνα', items: ['Πλήρως εξοπλισμένη', 'Μηχανή espresso', 'Βραστήρας', 'Τοστιέρα'] },
      { title: 'Υπνοδωμάτια', items: ['2 Master υπνοδωμάτια', 'Premium κλινοσκεπάσματα', 'Ντουλάπες', 'Smart TV'] },
      { title: 'Μπάνια', items: ['2 μοντέρνα μπάνια', 'Πετσέτες', 'Πιστολάκι'] },
      { title: 'Επιπλέον', items: ['Wi-Fi', 'Self check-in', 'Lockbox', 'Πλυντήριο ρούχων', 'Σίδερο', 'Βρεφική κούνια (κατόπιν αιτήματος)'] },
    ],
    stayNote:
      'Το check-in είναι 15:00 – 22:00 και το check-out έως τις 11:00. Self check-in μέσω lockbox. Οι πλήρεις κανόνες διαμονής παρέχονται κατά την άφιξη.',
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
    heading: 'Ρωτήστε μας οτιδήποτε',
    body:
      'Για διαθεσιμότητα και τιμές, ο γρηγορότερος δρόμος είναι το Booking.com. Για μεγαλύτερες διαμονές ή για ό,τι δεν απαντά η ιστοσελίδα, γράψτε μας απευθείας.',
    emailLabel: 'Email',
    phoneLabel: 'Τηλέφωνο',
    addressLabel: 'Διεύθυνση',
    bookingLink: 'Δείτε ημερομηνίες και τιμές στο Booking.com',
    form: {
      name: 'Το όνομά σας',
      email: 'Διεύθυνση email',
      emailHint: 'Απαντάμε εντός 24 ωρών.',
      villa: 'Ποια βίλα σας ενδιαφέρει;',
      villaAny: 'Καμία προτίμηση',
      arrival: 'Άφιξη',
      departure: 'Αναχώρηση',
      message: 'Το μήνυμά σας',
      submit: 'Αποστολή',
      submitting: 'Αποστολή…',
      required: '(υποχρεωτικό)',
      errName: 'Συμπληρώστε το όνομά σας.',
      errEmailEmpty: 'Συμπληρώστε τη διεύθυνση email σας.',
      errEmailInvalid: 'Εισάγετε έγκυρη διεύθυνση email, για παράδειγμα name@example.com.',
      errMessage: 'Πείτε μας λίγα λόγια για τη διαμονή σας.',
      success: 'Σας ευχαριστούμε — το μήνυμά σας στάλθηκε. Θα απαντήσουμε εντός 24 ωρών.',
      failure: 'Κάτι πήγε στραβά με την αποστολή. Στείλτε μας email απευθείας.',
    },
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
}

export const dictionaries: Record<Locale, Dictionary> = { en, el }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
