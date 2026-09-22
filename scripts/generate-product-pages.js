/* Generate crawlable hire/{slug}.html pages from js/products.js */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const assetVersion = "72";
const cssVersion = "90";
const productsCode = fs.readFileSync(path.join(root, "js", "products.js"), "utf8");
const sandbox = { window: {} };
new Function("window", productsCode)(sandbox.window);
const products = sandbox.window.RUMI_PRODUCTS;
if (!Array.isArray(products) || !products.length) {
  throw new Error("No products loaded from js/products.js");
}

const catLabels = {
  seating: "seating",
  lounge: "lounge",
  umbrella: "umbrellas",
  tables: "tables",
  sets: "sets",
  tableware: "tableware",
  cameras: "cameras"
};

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageSrc(p) {
  const ext = p.imageExt || "png";
  return `assets/img/products/${p.slug}.${ext}?v=${assetVersion}`;
}

function absUrl(slug) {
  return `https://rumihires.com/hire/${slug}.html`;
}

function pageHtml(p) {
  const cat = catLabels[p.cat] || p.cat;
  const img = imageSrc(p);
  const title = `${p.item} — Hire $${p.price} | Rumi Hires`;
  const desc =
    `Hire ${p.item} from $${p.price} in Brisbane` +
    (p.spec ? ` (${p.spec})` : "") +
    (p.bulk ? `. ${p.bulk}` : "") +
    `. Event & wedding hire — Rumi Hires, Queensland & Northern NSW.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.item,
    image: [`https://rumihires.com/${img.split("?")[0]}`],
    description: `Hire ${p.item} for events in Brisbane, Queensland and Northern NSW.`,
    url: absUrl(p.slug),
    brand: { "@type": "Brand", name: "Rumi Hires" },
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: String(p.price),
      availability: "https://schema.org/InStock",
      url: absUrl(p.slug)
    }
  };

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${absUrl(p.slug)}" />
  <base href="../" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css?v=${cssVersion}" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>

  <div class="announce">
    Brisbane based · servicing QLD &amp; Northern NSW — <a href="contact.html">get your free quote</a>
  </div>

  <header class="header">
    <div class="container header__inner">
      <a href="index.html" class="logo">RUMI <span>HIRES</span></a>
      <button class="nav-toggle" aria-label="Toggle menu">☰</button>
      <nav class="nav">
        <a href="index.html">home</a>
        <a href="items.html" class="active">items for hire</a>
        <a href="moments.html">moments</a>
        <a href="index.html#story">our story</a>
        <a href="index.html#faq">faq</a>
        <a href="contact.html" class="btn btn--gold btn--small">book a chat</a>
      </nav>
    </div>
  </header>

  <section class="section section--cream product-detail-page">
    <div id="productDetail" data-slug="${esc(p.slug)}">
      <div class="container">
        <nav class="product-detail__crumb" aria-label="Breadcrumb">
          <a href="items.html">items for hire</a>
          <span aria-hidden="true">/</span>
          <a href="items.html?cat=${esc(p.cat)}">${esc(cat)}</a>
          <span aria-hidden="true">/</span>
          <span>${esc(p.title)}</span>
        </nav>
        <article class="product product-detail" data-cat="${esc(p.cat)}" itemscope itemtype="https://schema.org/Product">
          <div class="product-detail__gallery ${esc(p.placeholder || "")} has-photo">
            <img src="${esc(img)}" alt="${esc(p.item)}" itemprop="image" width="800" height="1000" />
          </div>
          <div class="product-detail__info">
            ${p.badge ? `<span class="product__badge product-detail__badge">${esc(p.badge)}</span>` : ""}
            <div class="product__cat">${esc(cat)}</div>
            <h1 itemprop="name">${esc(p.title)}</h1>
            ${p.spec ? `<p class="product__spec">${esc(p.spec)}</p>` : ""}
            <div class="product__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
              <meta itemprop="priceCurrency" content="AUD" />
              <meta itemprop="price" content="${esc(String(p.price))}" />
              $${p.price} <span class="unit">/ hire</span>
            </div>
            ${p.bulk ? `<p class="product__bulk">${esc(p.bulk)}</p>` : ""}
            <p class="product-detail__lead" itemprop="description">Hire this ${esc(p.item)} for your event across Brisbane, Queensland &amp; Northern NSW. Add to your quote list — no obligation.</p>
            <p><a class="btn btn--gold" href="contact.html">request a free quote</a>
            <a class="btn btn--ghost" href="items.html">browse all items</a></p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div class="product-lightbox" id="productLightbox" aria-hidden="true">
    <div class="product-lightbox__backdrop"></div>
    <div class="product-lightbox__inner">
      <button type="button" class="product-lightbox__close" aria-label="Close">&times;</button>
      <img id="productLightboxImg" src="" alt="">
    </div>
  </div>

  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="index.html" class="logo">RUMI <span>HIRES</span></a>
          <p style="margin-top:1rem;">Curated, modern event furnishings built on taste, intention and a passion for unforgettable moments.</p>
        </div>
        <div>
          <h4>explore</h4>
          <ul>
            <li><a href="items.html">all items</a></li>
            <li><a href="moments.html">moments</a></li>
            <li><a href="items.html?cat=seating">seating</a></li>
            <li><a href="items.html?cat=tables">tables</a></li>
            <li><a href="items.html?cat=umbrella">umbrellas</a></li>
            <li><a href="items.html?cat=tableware">tableware</a></li>
          </ul>
        </div>
        <div>
          <h4>service area</h4>
          <p>Brisbane based, servicing locations across Queensland and Northern New South Wales.</p>
        </div>
        <div>
          <h4>contact</h4>
          <ul>
            <li><a href="mailto:hello@rumihires.com">hello@rumihires.com</a></li>
            <li><a href="tel:+61426631389">+61 426 631 389</a></li>
            <li><a href="https://www.rumihires.com">www.rumihires.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© <span id="year">2026</span> Rumi Hires. All rights reserved.</span>
        <span><a href="terms.html">terms &amp; conditions</a> · <a href="privacy.html">privacy policy</a></span>
      </div>
    </div>
  </footer>

  <div class="toast" id="toast"></div>
  <div class="quote-bar" id="quoteBar">
    <span class="quote-bar__count"><strong id="quoteCount">0</strong> piece(s) in your quote list</span>
    <button class="btn btn--gold btn--small" id="sendQuote">request quote</button>
  </div>

  <script src="js/products.js?v=${assetVersion}"></script>
  <script src="js/product-utils.js?v=${assetVersion}"></script>
  <script src="js/moments-data.js?v=66"></script>
  <script src="js/product-detail.js?v=61"></script>
  <script src="js/main.js?v=70"></script>
</body>
</html>
`;
}

const hireDir = path.join(root, "hire");
fs.mkdirSync(hireDir, { recursive: true });

const urls = [
  { loc: "https://rumihires.com/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://rumihires.com/items.html", changefreq: "weekly", priority: "0.9" },
  { loc: "https://rumihires.com/contact.html", changefreq: "monthly", priority: "0.8" },
  { loc: "https://rumihires.com/moments.html", changefreq: "weekly", priority: "0.7" },
  { loc: "https://rumihires.com/catalogue.html", changefreq: "monthly", priority: "0.6" }
];

products.forEach(function (p) {
  const file = path.join(hireDir, p.slug + ".html");
  fs.writeFileSync(file, pageHtml(p), "utf8");
  urls.push({
    loc: absUrl(p.slug),
    changefreq: "monthly",
    priority: "0.8"
  });
  console.log("wrote", path.relative(root, file));
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log("wrote sitemap.xml with", urls.length, "urls");
