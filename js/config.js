/* ==========================================================
   SITE CONFIG — edit this file to change brand, contact,
   prices, box contents and reviews. No other file needs edits.
   ========================================================== */
window.SITE = {
  brand: "Dinbox",                       // placeholder brand name
  tagline: "Calendars made into gifts",

  // WhatsApp: country code + number, digits only (no + or spaces)
  whatsappNumber: "919999999999",
  whatsappDisplay: "+91 99999 99999",
  qrImage: "assets/whatsapp-qr.svg",     // replace with assets/whatsapp-qr.png
  instagram: "@dinbox.in",

  // Launch offer
  discount: 0.20,                        // 20% off, applied to every price below
  orderCutoff: "2026-12-20T23:59:00+05:30",
  cutoffLabel: "20 Dec",

  // Google Sheet logging (see apps-script/Code.gs). Leave "" to skip.
  sheetWebhook: "",

  calendarYear: 2027,

  // Month colours follow the season (used in the hero + preview)
  months: [
    ["January", "Winter", "#3B6FD4"],
    ["February", "Spring", "#E0679A"],
    ["March", "Holi colours", "#EE7A3B"],
    ["April", "Summer", "#E9A21A"],
    ["May", "Peak summer", "#E0503A"],
    ["June", "Monsoon", "#1B998B"],
    ["July", "Monsoon", "#2A7FA8"],
    ["August", "Monsoon green", "#3D8F5A"],
    ["September", "Early autumn", "#8A62C9"],
    ["October", "Festive", "#D9772B"],
    ["November", "Festive lights", "#C2462C"],
    ["December", "Winter", "#2E4D91"]
  ],

  // Sample dates shown on the hero calendar (d = day, l = label, t = sticker)
  heroMarks: [
    [{ d: 9, l: "Maa's birthday", t: "star" }, { d: 26, l: "Republic Day", t: "rest" }],
    [{ d: 14, l: "Our day", t: "heart" }],
    [{ d: 20, l: "Holi plans", t: "star" }],
    [{ d: 18, l: "Exams done!", t: "star" }, { d: 25, l: "Rest day", t: "rest" }],
    [{ d: 12, l: "Arjun turns 30", t: "star" }],
    [{ d: 21, l: "First rain walk", t: "heart" }],
    [{ d: 7, l: "Anniversary", t: "heart" }],
    [{ d: 15, l: "Independence Day", t: "rest" }],
    [{ d: 3, l: "30-day puzzle streak", t: "star" }],
    [{ d: 2, l: "Gandhi Jayanti", t: "rest" }, { d: 24, l: "Date night", t: "heart" }],
    [{ d: 14, l: "Family photo day", t: "star" }],
    [{ d: 25, l: "Christmas", t: "rest" }, { d: 31, l: "New Year's Eve", t: "heart" }]
  ],

  sampleDates: [
    { l: "Our anniversary", d: "2027-02-14" },
    { l: "Maa's birthday", d: "2027-02-23" }
  ],

  calendars: [
    {
      id: "planner", name: "Daily Planner Calendar", short: "Planner",
      tag: "For the doers", color: "#2F5FC4", mrp: 899,
      promise: "Plan the day, tick it off, and take the rest you earned.",
      points: [
        "A to-do space for every day, so tasks leave your head and land on paper",
        "Tick boxes for each task: small wins you can actually see",
        "\"Take a rest\" stickers, so rest days are planned, not guilty",
        "A goals page at the start of every month"
      ],
      forWho: "Students, working professionals, anyone juggling a busy week.",
      stickerItem: "reststickers", themedItem: "penset"
    },
    {
      id: "unscroll", name: "Unscroll Puzzle Calendar", short: "Unscroll",
      tag: "Anti brain-rot", color: "#13786D", mrp: 999,
      promise: "One small puzzle a day instead of one more scroll.",
      points: [
        "A new puzzle every day: logic, words, numbers and riddles",
        "Easy on Monday, tricky by Sunday, so your mind warms up through the week",
        "Answers hidden behind a QR code on each page",
        "A streak tracker to keep your chain going"
      ],
      forWho: "Anyone who wants ten quiet minutes away from the phone.",
      stickerItem: "reststickers", themedItem: "chaikit"
    },
    {
      id: "lovable", name: "Lovable Calendar", short: "Lovable",
      tag: "For couples and loved ones", color: "#C94F82", mrp: 1199,
      promise: "365 small reasons to smile, with your dates printed in.",
      points: [
        "A little prompt each day: a compliment, a memory, a date idea",
        "Your anniversary, birthdays and firsts printed on the right pages",
        "Space for notes you leave for each other",
        "Date-night stickers for the plans you make together"
      ],
      forWho: "Partners, parents, best friends and long-distance loved ones.",
      stickerItem: "lovestickers", themedItem: "polaroids"
    },
    {
      id: "photo", name: "Photo Sheet Calendar", short: "Photo sheet",
      tag: "Minimal, with your photos", color: "#B85F1E", mrp: 499,
      promise: "Your favourite photo and the whole year on one clean sheet.",
      points: [
        "The full year on a single A3 sheet",
        "Up to 3 of your photos, colour-corrected before printing",
        "A clean, minimal layout that suits any wall or desk",
        "Your 5 dates highlighted in their season colour"
      ],
      forWho: "Families, friends and first gifts on a smaller budget.",
      stickerItem: null, themedItem: "deskstand"
    }
  ],

  tiers: [
    { id: "essential", name: "Essential", mrp: 0, blurb: "Calendar, 5 bookmarks, date stickers and a card. Free with every calendar." },
    { id: "thoughtful", name: "Thoughtful", mrp: 699, badge: "Most gifted", blurb: "Adds handmade chocolates and a gift picked to match your calendar." },
    { id: "grand", name: "Grand", mrp: 1499, blurb: "Adds perfume, a scented candle and a keepsake box with ribbon." }
  ],

  extras: [
    { id: "flowers", item: "flowers", mrp: 249 },
    { id: "letter", item: "letter", mrp: 99 },
    { id: "prints", item: "prints", mrp: 149 }
  ],

  // Everything that can go in a box (icon = SVG symbol id in index.html)
  items: {
    calendar: { label: "Your calendar", icon: "i-cal" },
    bookmarks: { label: "5 bookmarks", icon: "i-bookmark" },
    datestickers: { label: "Date-marker stickers (5 to 10)", icon: "i-sticker" },
    reststickers: { label: "\"Take a rest\" stickers", icon: "i-rest" },
    lovestickers: { label: "Heart and date-night stickers", icon: "i-heart" },
    card: { label: "Greeting card with your message", icon: "i-card" },
    chocolates: { label: "Handmade chocolates", icon: "i-choco" },
    penset: { label: "Pen and highlighter set", icon: "i-pen" },
    chaikit: { label: "Pencil kit and chai sachets", icon: "i-tea" },
    polaroids: { label: "6 polaroid-style prints", icon: "i-photo" },
    deskstand: { label: "Wooden desk stand", icon: "i-stand" },
    perfume: { label: "Perfume or attar", icon: "i-perfume" },
    candle: { label: "Scented candle", icon: "i-candle" },
    keepsake: { label: "Keepsake box with ribbon", icon: "i-ribbon" },
    flowers: { label: "Dried flower bunch", icon: "i-flower" },
    letter: { label: "Handwritten letter", icon: "i-letter" },
    prints: { label: "Extra photo prints", icon: "i-photo" }
  },

  defaultBox: { cal: "lovable", tier: "thoughtful" },

  // Reviews: set sample:false and add photo: "assets/reviews/1.jpg" when real
  reviews: [
    { sample: true, name: "Ananya, Hyderabad", product: "Lovable + Thoughtful box", tint: "#F7C9D9", icon: "i-heart",
      text: "He found our first-date day marked in the calendar and just stood there smiling. The box felt like opening a letter." },
    { sample: true, name: "Rohit, Pune", product: "Unscroll calendar", tint: "#BFE3DC", icon: "i-tea",
      text: "My morning is chai and the day's puzzle now, not reels. I'm on a 40-day streak and weirdly proud of it." },
    { sample: true, name: "Meera, Bengaluru", product: "Daily Planner", tint: "#CBD8F5", icon: "i-pen",
      text: "The 'take a rest' stickers are my favourite thing. I actually plan my off days now." },
    { sample: true, name: "Kavya, Chennai", product: "Photo sheet calendar", tint: "#F6D9BE", icon: "i-photo",
      text: "Gave one to each of my parents with our family photo. Simple, clean and it's still on their wall." },
    { sample: true, name: "Sameer, Delhi", product: "Grand box", tint: "#E5D3F3", icon: "i-ribbon",
      text: "Ordered on WhatsApp late at night, saw the preview the next day, and it reached her before her birthday." },
    { sample: true, name: "Nisha, Vizag", product: "Lovable calendar", tint: "#FBE0A8", icon: "i-card",
      text: "We're long distance. Every page gives us something to text each other about." }
  ]
};
