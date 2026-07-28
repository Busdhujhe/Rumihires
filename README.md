# Rumi Hires — Static Website

A fast, sales-optimised static website for [Rumi Hires](https://rumihires.com) — luxury event & wedding hire, Brisbane. Built with plain HTML/CSS/JS, no build step, ready for GitHub Pages.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, value props, collections, brand story, how-it-works, FAQ |
| `items.html` | Filterable catalogue with an "add to quote" list |
| `product.html` | Product detail — large photos, pricing, add to quote |
| `contact.html` | Enquiry form + click-to-call / email |
| `terms.html` / `privacy.html` | Legal placeholders — replace with your full text |

## Sales features

- **Quote list**: visitors add items while browsing (stored in the browser), then send the whole list as a pre-filled email in one click — a lightweight replacement for a cart on a static site.
- **Enquiry form** opens the visitor's email app with all event details pre-filled and addressed to `hello@rumihires.com`. No server needed.
- Sticky header CTA, announcement bar, urgency messaging ("popular dates book fast"), FAQ to remove objections, and `LocalBusiness` structured data for local SEO.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `rumihires`).
2. Push this folder:

   ```bash
   git init
   git add .
   git commit -m "Rumi Hires website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rumihires.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. Your site will be live at `https://YOUR_USERNAME.github.io/rumihires/` within a minute or two.

### Custom domain (rumihires.com)

1. In **Settings → Pages → Custom domain**, enter `rumihires.com` (this creates a `CNAME` file).
2. At your DNS provider, add:
   - `A` records for the apex pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `YOUR_USERNAME.github.io`
3. Tick **Enforce HTTPS** once the certificate is issued.

## Replacing placeholder imagery

Product cards load photos from `assets/img/products/{slug}.png` (see `js/products.js` for slug names).

### From your catalogue PDF (recommended)

1. Copy **`Rumi Hires Catalogue.pdf`** into the project root (`m:\Rumihires`).
2. Install Poppler (one-time): `winget install --id=oschwartz10612.Poppler -e`
3. Run: `.\scripts\extract-catalogue.ps1`

This exports each PDF page and names it to match the product slug (page 1 → `french-lite-iron-chair.png`, etc.).

### Manual export

Export each catalogue page as PNG into `assets/img/products/` using the filenames in `js/products.js` (e.g. `french-wave-umbrella.png`). Until a photo exists, the card shows a colour gradient placeholder.

## Updating the catalogue

Edit `js/products.js` — each entry has name, price, category, image slug, and optional bulk pricing text. Product cards on `items.html` are rendered automatically by `js/render-catalogue.js`.
