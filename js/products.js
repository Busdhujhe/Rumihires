/* Rumi Hires — product catalogue data
   Images: place photos in assets/img/products/{slug}.png, or set imageExt for another format
   optionName turns the photo views into a customer-selectable variant carried through to the quote
   Run scripts/extract-catalogue.ps1 after adding "Rumi Hires Catalogue.pdf" to project root. */
window.RUMI_PRODUCTS = [
  {
    slug: "french-lite-iron-chair",
    cat: "seating",
    item: "French Lite Iron Chair",
    title: "french lite iron chair",
    price: 18,
    bulk: "20+ from $15 each",
    badge: "most hired",
    placeholder: "pi--chair-a",
    imageExt: "jpg",
    extraImages: [
      { file: "french-lite-iron-chair-side.jpg", label: "side" },
      { file: "french-lite-iron-chair-three-quarter.jpg", label: "3/4" },
      { file: "french-lite-iron-chair-back.jpg", label: "back" }
    ],
    cataloguePage: 1
  },
  {
    slug: "french-black-chair-type-a",
    cat: "seating",
    item: "French Black Chair Type A (with Arms)",
    title: "french black chair · type a",
    spec: "with arms",
    price: 40,
    placeholder: "pi--chair-a",
    imageExt: "jpg",
    extraImages: [
      { file: "french-black-chair-type-a-side.jpg", label: "side" },
      { file: "french-black-chair-type-a-three-quarter.jpg", label: "3/4" },
      { file: "french-black-chair-type-a-back.jpg", label: "back" }
    ],
    cataloguePage: 2
  },
  {
    slug: "french-black-chair-type-b",
    cat: "seating",
    item: "French Black Chair Type B (no Arms)",
    title: "french black chair · type b",
    spec: "no arms",
    price: 35,
    placeholder: "pi--chair-b",
    imageExt: "jpg",
    extraImages: [
      { file: "french-black-chair-type-b-side.jpg", label: "side" },
      { file: "french-black-chair-type-b-three-quarter.jpg", label: "3/4" },
      { file: "french-black-chair-type-b-back.jpg", label: "back" }
    ],
    cataloguePage: 3
  },
  {
    slug: "french-black-bench",
    cat: "lounge",
    item: "French Black Bench",
    title: "french black bench",
    price: 75,
    placeholder: "pi--bench",
    cataloguePage: 4
  },
  {
    slug: "french-black-day-bed",
    cat: "lounge",
    item: "French Black Day Bed",
    title: "french black day bed",
    price: 75,
    placeholder: "pi--daybed",
    extraImages: [{ file: "french-black-day-bed-side.png", label: "side" }],
    cataloguePage: 5
  },
  {
    slug: "french-wave-umbrella",
    cat: "umbrella",
    item: "French Wave Umbrella",
    title: "french wave umbrella",
    spec: "brown or silver pole",
    price: 55,
    bulk: "5+ qty discount available",
    badge: "signature piece",
    placeholder: "pi--umbrella",
    optionName: "pole",
    imageLabel: "brown pole",
    extraImages: [{ file: "french-wave-umbrella-silver.png", label: "silver pole" }],
    cataloguePage: 6
  },
  {
    slug: "donut-table",
    cat: "tables",
    item: "Donut Table",
    title: "donut table",
    price: 120,
    placeholder: "pi--table",
    cataloguePage: 7
  },
  {
    slug: "french-lite-iron-table",
    cat: "tables",
    item: "French Lite Iron Table",
    title: "french lite iron table",
    price: 22,
    bulk: "20+ qty discount available",
    placeholder: "pi--table",
    cataloguePage: 8
  },
  {
    slug: "french-lite-iron-set",
    cat: "sets",
    item: "French Lite Iron Set (1 table & 2 chairs)",
    title: "french lite iron set",
    spec: "1 table & 2 chairs",
    price: 50,
    bulk: "20+ qty discount available",
    placeholder: "pi--set",
    cataloguePage: 9
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
    slug: "golden-snack-stand-a",
    cat: "tableware",
    item: "Golden Snack Stand A (3 level)",
    title: "golden snack stand · type a",
    spec: "3 level",
    price: 13,
    placeholder: "pi--tableware",
    cataloguePage: 15
  },
  {
    slug: "golden-snack-stand-b",
    cat: "tableware",
    item: "Golden Snack Stand B (2 level)",
    title: "golden snack stand · type b",
    spec: "2 level",
    price: 10,
    placeholder: "pi--tableware",
    cataloguePage: 16
  },
  {
    slug: "timeless-snack-stand-a",
    cat: "tableware",
    item: "Timeless Snack Stand A (3 level)",
    title: "timeless snack stand · type a",
    spec: "3 level",
    price: 8,
    placeholder: "pi--tableware",
    cataloguePage: 17
  },
  {
    slug: "timeless-snack-stand-b",
    cat: "tableware",
    item: "Timeless Snack Stand B (2 level)",
    title: "timeless snack stand · type b",
    spec: "2 level",
    price: 5,
    placeholder: "pi--tableware",
    cataloguePage: 18
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
    slug: "fabric-table-lamp",
    cat: "tableware",
    item: "Fabric Table Lamp",
    title: "fabric table lamp",
    price: 13,
    bulk: "15+ qty discount available",
    placeholder: "pi--tableware",
    cataloguePage: 21
  }
];
