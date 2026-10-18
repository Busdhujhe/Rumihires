/* Rumi Hires — product catalogue data
   Images: place photos in assets/img/products/{slug}.png, or set imageExt for another format
   optionName turns the photo views into a customer-selectable variant carried through to the quote
   alsoCats lists extra filters the item appears under besides its own cat
   Run scripts/extract-catalogue.ps1 after adding "Rumi Hires Catalogue.pdf" to project root. */
window.RUMI_PRODUCTS = [
  {
    slug: "french-lite-iron-chair",
    cat: "seating",
    item: "French Lite Iron Chair",
    title: "french lite iron chair",
    spec: "matte white or gloss white · with arms",
    about: "The French Lite Iron chair is our signature piece, and it is generally used for ceremony seating.",
    price: 18,
    bulk: "20+ from $15 each",
    badge: "signature piece",
    placeholder: "pi--chair-a",
    imageExt: "jpg",
    optionName: "finish",
    finishes: [
      {
        label: "matte white",
        maxQty: 46,
        views: [
          { label: "front" },
          { file: "french-lite-iron-chair-side.jpg", label: "side" }
        ]
      },
      {
        label: "gloss white",
        maxQty: 102,
        views: [
          { file: "french-lite-iron-chair-gloss.jpg", label: "front" },
          { file: "french-lite-iron-chair-gloss-side.jpg", label: "side" }
        ]
      }
    ],
    cataloguePage: 1
  },
  {
    slug: "french-black-chair-type-a",
    cat: "seating",
    item: "French Black Chair Type A (with Arms)",
    title: "french black chair · type a",
    spec: "with arms",
    about: "The French Black Chair Type A comes from our French Black collection. It is perfectly suited to cocktail hour, or to a lounge area where your guests have a comfortable, cushioned seat to relax and enjoy the night with family and friends.",
    price: 40,
    maxQty: 12,
    placeholder: "pi--chair-a",
    imageExt: "jpg",
    extraImages: [
      { file: "french-black-chair-type-a-side.jpg", label: "side" },
      { file: "french-black-chair-type-a-cushion.jpg", label: "with cushion" }
    ],
    cataloguePage: 2
  },
  {
    slug: "french-black-chair-type-b",
    cat: "seating",
    item: "French Black Chair Type B (no Arms)",
    title: "french black chair · type b",
    spec: "no arms",
    about: "The French Black Chair Type B comes from our French Black collection. Without arms, it sits neatly for cocktail hour and lounge seating, with a comfortable, cushioned seat so guests can relax and enjoy the night with family and friends.",
    price: 35,
    maxQty: 12,
    placeholder: "pi--chair-b",
    imageExt: "jpg",
    extraImages: [
      { file: "french-black-chair-type-b-side.jpg", label: "side" },
      { file: "french-black-chair-type-b-cushion.jpg", label: "with cushion" }
    ],
    cataloguePage: 3
  },
  {
    slug: "french-black-bench",
    cat: "seating",
    item: "French Black Bench",
    title: "french black bench",
    about: "The French Black Bench comes from our French Black collection. It is made for cocktail hour and lounge areas, with a long cushioned seat where guests can sit together, relax, and enjoy the night with family and friends.",
    price: 75,
    maxQty: 6,
    placeholder: "pi--bench",
    extraImages: [{ file: "french-black-bench-side.jpg", label: "side" }],
    cataloguePage: 4
  },
  {
    slug: "french-black-day-bed",
    cat: "seating",
    item: "French Black Day Bed",
    title: "french black day bed",
    about: "The French Black Day Bed comes from our French Black collection. It is the lounge piece for stretching out, with a cushioned day bed where guests can relax and enjoy the night with family and friends.",
    price: 75,
    maxQty: 3,
    placeholder: "pi--daybed",
    extraImages: [{ file: "french-black-day-bed-side.png", label: "side" }],
    cataloguePage: 5
  },
  {
    slug: "french-wave-umbrella-silver",
    cat: "umbrella",
    item: "French Wave Umbrella (Silver)",
    title: "french wave umbrella · silver",
    spec: "silver pole · 2.1m · 57cm square base",
    about: "Our popular French Wave umbrellas are both beautiful and practical for elevating your space whilst providing shade and a space for your guests to stand under and enjoy the event. The silver pole finish suits a clean, modern setup.",
    price: 55,
    maxQty: 9,
    bulk: "5+ qty discount available",
    badge: "popular",
    placeholder: "pi--umbrella"
  },
  {
    slug: "french-wave-umbrella",
    cat: "umbrella",
    item: "French Wave Umbrella (Brown)",
    title: "french wave umbrella · brown",
    spec: "brown pole · 2.1m · 57cm square base",
    about: "Our popular French Wave umbrellas are both beautiful and practical for elevating your space whilst providing shade and a space for your guests to stand under and enjoy the event.",
    price: 55,
    maxQty: 7,
    bulk: "5+ qty discount available",
    placeholder: "pi--umbrella",
    cataloguePage: 6
  },
  {
    slug: "french-wave-umbrella-xl",
    cat: "umbrella",
    item: "French Wave Umbrella XL (Silver)",
    title: "french wave umbrella · xl silver",
    spec: "silver pole · 2.65m · 57cm square base",
    about: "Our popular French Wave umbrellas are both beautiful and practical for elevating your space whilst providing shade and a space for your guests to stand under and enjoy the event. The XL size gives a wider canopy for larger gatherings.",
    price: 65,
    maxQty: 6,
    bulk: "5+ qty discount available",
    placeholder: "pi--umbrella",
    imageExt: "jpg"
  },
  {
    slug: "donut-table",
    cat: "tables",
    item: "Donut Table",
    title: "donut table",
    price: 120,
    placeholder: "pi--table",
    imageExt: "jpg",
    cataloguePage: 7
  },
  {
    slug: "french-lite-iron-table",
    cat: "tables",
    item: "French Lite Iron Table",
    title: "french lite iron table",
    spec: "matte white or gloss white · 600mm",
    price: 22,
    bulk: "20+ qty discount available",
    placeholder: "pi--table",
    optionName: "finish",
    imageLabel: "matte white",
    imageMaxQty: 20,
    extraImages: [{ file: "french-lite-iron-table-gloss.png", label: "gloss white", maxQty: 9 }],
    cataloguePage: 8
  },
  {
    slug: "french-lite-iron-set",
    cat: "sets",
    item: "French Lite Iron Set (1 table & 2 chairs)",
    title: "french lite iron set",
    spec: "1 table & 2 chairs · matte white or gloss white",
    price: 50,
    bulk: "20+ qty discount available",
    placeholder: "pi--set",
    optionName: "finish",
    imageLabel: "matte white",
    extraImages: [{ file: "french-lite-iron-set-gloss.jpg", label: "gloss white" }],
    cataloguePage: 9
  },
  {
    slug: "french-black-lounge-bundle",
    cat: "sets",
    item: "French Black Lounge Bundle",
    title: "french black lounge bundle",
    spec: "bench, day bed, 2 type a chairs, 2 type b chairs & 1 silver umbrella",
    about: "The French Black Lounge Bundle brings the collection together for cocktail hour or a lounge your guests can settle into. It includes a bench, a day bed, two Type A chairs, two Type B chairs and a silver umbrella, so there is a comfortable, cushioned seat for everyone to relax and enjoy the night with family and friends.",
    price: 325,
    maxQty: 3,
    badge: "best value",
    placeholder: "pi--set",
    imageExt: "jpg"
  },
  {
    slug: "french-wave-umbrella-bundle",
    cat: "sets",
    alsoCats: ["umbrella"],
    item: "French Wave Umbrella Bundle (4 umbrellas)",
    title: "french wave umbrella bundle",
    spec: "4 umbrellas · brown or silver 2.1m · XL silver 2.65m",
    about: "The French Wave Umbrella Bundle gives you four of our popular umbrellas in one hire — beautiful and practical for elevating your space, with shade and somewhere for guests to gather and enjoy the event. Choose brown, silver or XL silver to suit your setup.",
    price: 200,
    placeholder: "pi--set",
    imageExt: "jpg",
    optionName: "style",
    imageLabel: "brown pole · 2.1m",
    imageMaxQty: 1,
    extraImages: [
      { file: "french-wave-umbrella-bundle-silver.jpg", label: "silver pole · 2.1m", maxQty: 2 },
      { file: "french-wave-umbrella-bundle-xl.jpg", label: "XL silver · 2.65m", price: 240, maxQty: 1 }
    ]
  },
  {
    slug: "instax-camera-bundle",
    cat: "sets",
    alsoCats: ["cameras"],
    item: "Instax Camera Bundle (all 3 cameras)",
    title: "instax camera bundle",
    spec: "all 3 cameras · save $20 · 30 shots of film each",
    price: 200,
    bulk: "More or fewer shots of film available on enquiry",
    badge: "best value",
    placeholder: "pi--camera",
    imageExt: "jpg",
    cataloguePage: 25
  },
  {
    slug: "fabric-table-lamp",
    cat: "tableware",
    item: "Fabric Table Lamp",
    title: "fabric table lamp",
    price: 13,
    maxQty: 10,
    bulk: "15+ qty discount available",
    placeholder: "pi--tableware",
    cataloguePage: 21
  },
  {
    slug: "champagne-cooler",
    cat: "tableware",
    item: "Champagne Cooler",
    title: "champagne cooler",
    price: 20,
    placeholder: "pi--tableware",
    cataloguePage: 10
  },
  {
    slug: "stainless-steel-bowls-a",
    cat: "tableware",
    item: "Stainless Steel Bowls A (Tall)",
    title: "stainless steel bowls · type a",
    spec: "tall",
    price: 2,
    placeholder: "pi--tableware",
    cataloguePage: 11
  },
  {
    slug: "stainless-steel-bowls-b",
    cat: "tableware",
    item: "Stainless Steel Bowls B (Short with Gap)",
    title: "stainless steel bowls · type b",
    spec: "short with gap",
    price: 2,
    placeholder: "pi--tableware",
    cataloguePage: 12
  },
  {
    slug: "stainless-steel-bowls-c",
    cat: "tableware",
    item: "Stainless Steel Bowls C (Short with no Gap)",
    title: "stainless steel bowls · type c",
    spec: "short, no gap",
    price: 2,
    placeholder: "pi--tableware",
    cataloguePage: 13
  },
  {
    slug: "european-style-plates",
    cat: "tableware",
    item: "European Style Plates",
    title: "european style plates",
    price: 3,
    placeholder: "pi--tableware",
    cataloguePage: 14
  },
  {
    slug: "timeless-snack-stand",
    cat: "tableware",
    item: "Timeless Snack Stand",
    title: "timeless snack stand",
    spec: "3 levels or 2 levels",
    price: 8,
    placeholder: "pi--tableware",
    optionName: "levels",
    imageLabel: "3 levels",
    extraImages: [{ file: "timeless-snack-stand-b.png", label: "2 levels", price: 5 }],
    cataloguePage: 17
  },
  {
    slug: "euro-tongs",
    cat: "tableware",
    item: "Euro Tongs",
    title: "euro tongs",
    price: 5,
    placeholder: "pi--tableware",
    cataloguePage: 19
  },
  {
    slug: "pearl-serving-tray",
    cat: "tableware",
    item: "Pearl Serving Tray",
    title: "pearl serving tray",
    price: 18,
    placeholder: "pi--tableware",
    cataloguePage: 20
  },
  {
    slug: "instax-mini-12",
    cat: "cameras",
    item: "Instax Mini 12 Instant Camera",
    title: "instax mini 12",
    spec: "credit-card size prints · 30 shots of film included",
    price: 65,
    bulk: "More or fewer shots of film available on enquiry",
    placeholder: "pi--camera",
    imageExt: "jpg",
    extraImages: [{ file: "instax-mini-12-back.jpg", label: "back" }],
    cataloguePage: 22
  },
  {
    slug: "instax-square-sq40",
    cat: "cameras",
    item: "Instax Square SQ40 Instant Camera",
    title: "instax square sq40",
    spec: "square prints · 30 shots of film included",
    price: 80,
    bulk: "More or fewer shots of film available on enquiry",
    placeholder: "pi--camera",
    imageExt: "jpg",
    extraImages: [{ file: "instax-square-sq40-back.jpg", label: "back" }],
    cataloguePage: 23
  },
  {
    slug: "instax-mini-liplay",
    cat: "cameras",
    item: "Instax Mini LiPlay Hybrid Camera",
    title: "instax mini liplay",
    spec: "preview before you print · 30 shots of film included",
    price: 75,
    bulk: "More or fewer shots of film available on enquiry",
    placeholder: "pi--camera",
    imageExt: "jpg",
    extraImages: [{ file: "instax-mini-liplay-back.jpg", label: "back" }],
    cataloguePage: 24
  }
];
