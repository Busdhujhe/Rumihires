/* Rumi Hires — featured products on the home page */
(function () {
  "use strict";

  var wrap = document.getElementById("homeFeatured");
  if (!wrap || !window.RUMI_PRODUCTS || !window.RUMI) return;

  var featuredSlugs = [
    "french-wave-umbrella",
    "french-lite-iron-chair",
    "french-black-chair-type-a",
    "french-black-day-bed",
    "european-style-plates",
    "champagne-cooler"
  ];

  var esc = window.RUMI.esc;
  var bySlug = {};
  window.RUMI_PRODUCTS.forEach(function (p) {
    bySlug[p.slug] = p;
  });

  featuredSlugs.forEach(function (slug) {
    var p = bySlug[slug];
    if (!p) return;

    var detailUrl = window.RUMI.productUrl(p.slug);
    var card = document.createElement("article");
    card.className = "product product--home";

    card.innerHTML =
      '<a href="' + esc(detailUrl) + '" class="product__img-link" aria-label="View ' + esc(p.item) + '">' +
      '<div class="' + esc(window.RUMI.productImgClasses(p)) + '">' +
      '<img src="' + esc(window.RUMI.imagePath(p.slug, p.imageExt)) + '" alt="' + esc(p.item) + '" loading="lazy"' +
      window.RUMI.productImgStyle(p) +
      ' onerror="this.closest(\'.product__img\').classList.remove(\'has-photo\')">' +
      (p.badge ? '<span class="product__badge">' + esc(p.badge) + "</span>" : "") +
      "</div></a>" +
      '<div class="product__body">' +
      '<div class="product__cat">' + esc(window.RUMI.catLabels[p.cat] || p.cat) + "</div>" +
      '<h3><a href="' + esc(detailUrl) + '">' + esc(p.title) + "</a></h3>" +
      '<div class="product__price">$' + p.price + ' <span class="unit">/ hire</span></div>' +
      '<a href="' + esc(detailUrl) + '" class="product__view">view details</a>' +
      "</div>";

    wrap.appendChild(card);
  });
})();
