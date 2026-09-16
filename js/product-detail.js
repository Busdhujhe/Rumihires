/* Rumi Hires — product detail page */
(function () {
  "use strict";

  var root = document.getElementById("productDetail");
  if (!root) return;

  var slug = new URLSearchParams(window.location.search).get("slug");
  if (slug === "french-wave-umbrella-xl") {
    window.location.replace("product.html?slug=french-wave-umbrella");
    return;
  }
  var p = window.RUMI.getProduct(slug);

  if (!p) {
    root.innerHTML =
      '<div class="product-detail__missing">' +
      "<h1>item not found</h1>" +
      '<p>Sorry — we couldn\u2019t find that product. <a href=\"items.html\">Browse all items</a>.</p>' +
      "</div>";
    document.title = "Item not found | Rumi Hires";
    return;
  }

  var gallery = window.RUMI.productGallery(p);
  var images = window.RUMI.productImages(p);
  var catLabel = window.RUMI.catLabels[p.cat] || p.cat;
  var esc = window.RUMI.esc;
  var optionIdx = 0;
  var viewIdx = 0;

  function currentView() {
    return gallery.options[optionIdx].views[viewIdx];
  }

  function finishRowHtml() {
    if (!(gallery.optionName && gallery.options.length > 1)) return "";
    return (
      '<div class="product-detail__finishes" role="group" aria-label="Choose ' + esc(gallery.optionName) + '">' +
      '<span class="product__views-label">choose ' + esc(gallery.optionName) + "</span>" +
      gallery.options.map(function (opt, i) {
        return (
          '<button type="button" class="product__view-btn' + (i === 0 ? " is-active" : "") + '"' +
          ' data-role="option" data-index="' + i + '"' +
          ' aria-pressed="' + (i === 0 ? "true" : "false") + '">' +
          esc(opt.label) +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function thumbsHtmlFor(opt, activeView) {
    if (!opt.views || opt.views.length < 2) return "";
    return (
      '<div class="product-detail__thumbs" role="group" aria-label="Photo views">' +
      opt.views.map(function (img, i) {
        var label = img.label || "view " + (i + 1);
        return (
          '<button type="button" class="product-detail__thumb' + (i === activeView ? " active" : "") + '" data-role="angle" data-index="' + i + '"' +
          ' title="' + esc(label) + '" aria-label="Show ' + esc(label) + ' photo">' +
          '<img src="' + esc(img.src) + '" alt="">' +
          '<span class="product-detail__thumb-label">' + esc(label) + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  /* Flat option products (umbrella): thumbs = each option's first (only) photo. */
  function optionThumbsHtml() {
    if (!(gallery.optionName && gallery.options.length > 1)) return "";
    var multiView = gallery.options.some(function (o) { return o.views.length > 1; });
    if (multiView) return "";
    return (
      '<div class="product-detail__thumbs" role="group" aria-label="Choose ' + esc(gallery.optionName) + '">' +
      gallery.options.map(function (opt, i) {
        var img = opt.views[0];
        return (
          '<button type="button" class="product-detail__thumb' + (i === 0 ? " active" : "") + '" data-role="option" data-index="' + i + '"' +
          ' title="' + esc(opt.label) + '" aria-label="Show ' + esc(opt.label) + ' photo">' +
          '<img src="' + esc(img.src) + '" alt="">' +
          '<span class="product-detail__thumb-label">' + esc(opt.label) + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  var related = (window.RUMI_PRODUCTS || [])
    .filter(function (item) { return item.cat === p.cat && item.slug !== p.slug; })
    .slice(0, 3);

  var relatedHtml = related.length
    ? '<section class="product-related">' +
      '<div class="container">' +
      '<h2>more in ' + esc(catLabel) + "</h2>" +
      '<div class="products products--related">' +
      related.map(function (item) {
        return (
          '<a href="' + esc(window.RUMI.productUrl(item.slug)) + '" class="product product--link">' +
          '<div class="' + esc(window.RUMI.productImgClasses(item)) + '">' +
          '<img src="' + esc(window.RUMI.imagePath(item.slug, item.imageExt)) + '" alt="' + esc(item.item) + '" loading="lazy"' +
          ' onerror="this.closest(\'.product__img\').classList.remove(\'has-photo\')">' +
          "</div>" +
          '<div class="product__body">' +
          '<div class="product__cat">' + esc(window.RUMI.catLabels[item.cat] || item.cat) + "</div>" +
          "<h3>" + esc(item.title) + "</h3>" +
          '<div class="product__price">$' + item.price + ' <span class="unit">/ hire</span></div>' +
          "</div></a>"
        );
      }).join("") +
      "</div></div></section>"
    : "";

  var inMoments = typeof window.RUMI.momentsForProduct === "function"
    ? window.RUMI.momentsForProduct(p.slug)
    : [];
  var momentsHtml = inMoments.length
    ? '<section class="product-moments">' +
      '<div class="product-moments__head">' +
      "<h2>seen in moments</h2>" +
      '<a href="' + esc(window.RUMI.momentsUrl(p.slug)) + '">view all with this piece</a>' +
      "</div>" +
      '<div class="product-moments__grid">' +
      inMoments.slice(0, 6).map(function (m) {
        return (
          '<a class="product-moments__shot" href="moments.html?shot=' + esc(m.id) + '&product=' + esc(p.slug) + '" title="' + esc(m.title) + '">' +
          '<img src="' + esc(window.RUMI.momentSrc(m)) + '" alt="' + esc(m.title) + '" loading="lazy">' +
          "</a>"
        );
      }).join("") +
      "</div></section>"
    : "";

  var first = currentView();
  var hasFinishAngles = gallery.optionName && gallery.options.some(function (o) { return o.views.length > 1; });

  root.innerHTML =
    '<div class="container">' +
    '<nav class="product-detail__crumb" aria-label="Breadcrumb">' +
    '<a href="items.html">items for hire</a>' +
    '<span aria-hidden="true">/</span>' +
    '<a href="items.html?cat=' + esc(p.cat) + '">' + esc(catLabel) + "</a>" +
    '<span aria-hidden="true">/</span>' +
    "<span>" + esc(p.title) + "</span>" +
    "</nav>" +
    '<div class="product product-detail" data-cat="' + esc(p.cat) + '"' +
    (gallery.optionName ? ' data-option-name="' + esc(gallery.optionName) + '" data-option="' + esc(gallery.options[0].label) + '"' : "") + ">" +
    '<div class="product-detail__gallery ' + esc(p.placeholder) + '">' +
    '<button type="button" class="product-detail__main" id="productLightboxOpen" aria-label="View full size photo">' +
    '<img id="productMainImg" src="' + esc(first.src) + '" alt="' + esc(first.alt) + '">' +
    '<span class="product-detail__zoom">click to enlarge</span>' +
    "</button>" +
    (hasFinishAngles ? finishRowHtml() + '<div id="productAngleThumbs">' + thumbsHtmlFor(gallery.options[0], 0) + "</div>" : optionThumbsHtml() || thumbsHtmlFor(gallery.options[0], 0)) +
    "</div>" +
    '<div class="product-detail__info">' +
    (p.badge ? '<span class="product__badge product-detail__badge">' + esc(p.badge) + "</span>" : "") +
    '<div class="product__cat">' + esc(catLabel) + "</div>" +
    "<h1>" + esc(p.title) + "</h1>" +
    (p.spec ? '<p class="product__spec">' + esc(p.spec) + "</p>" : "") +
    '<div class="product__price" id="productPrice">$' + gallery.options[0].price + ' <span class="unit">/ hire</span></div>' +
    (p.bulk ? '<p class="product__bulk">' + esc(p.bulk) + "</p>" : "") +
    (window.RUMI.stockNote(p) ? '<p class="product__stock">' + esc(window.RUMI.stockNote(p)) + "</p>" : "") +
    '<p class="product-detail__lead">Hire this piece for your event across Brisbane, Queensland &amp; Northern NSW. Add to your quote list — no obligation.</p>' +
    '<div class="product-detail__actions product__actions">' +
    (window.RUMI.maxQty(p) === 1 ? "" :
      '<div class="product__qty">' +
      "<label>qty</label>" +
      '<div class="qty-stepper"' + (window.RUMI.maxQty(p) ? ' data-max="' + window.RUMI.maxQty(p) + '"' : "") + ">" +
      '<button type="button" class="qty-stepper__btn" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input type="text" class="quote-qty" id="qty-' + esc(p.slug) + '" value="1" readonly inputmode="numeric" aria-label="Quantity">' +
      '<button type="button" class="qty-stepper__btn" data-step="1" aria-label="Increase quantity">+</button>' +
      "</div></div>") +
    '<button type="button" class="btn btn--gold add-quote" data-item="' + esc(p.item) + '" data-price="' + gallery.options[0].price + '">add to quote</button>' +
    '<a href="contact.html" class="btn btn--ghost">ask about this item</a>' +
    "</div></div></div>" +
    momentsHtml +
    "</div>" +
    relatedHtml;

  document.title = p.item + " — Hire $" + p.price + " | Rumi Hires";
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      "Hire " + p.item + " from $" + p.price + " in Brisbane. " +
      (p.bulk ? p.bulk + ". " : "") +
      "Event & wedding hire — Rumi Hires."
    );
  }

  var ld = document.getElementById("productSchema");
  if (ld) {
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.item,
      image: images.map(function (img) { return img.src; }),
      description: "Hire " + p.item + " for events in Brisbane, Queensland and Northern NSW.",
      offers: {
        "@type": "Offer",
        priceCurrency: "AUD",
        price: String(p.price),
        availability: "https://schema.org/InStock"
      }
    });
  }

  var mainImg = document.getElementById("productMainImg");
  images.forEach(function (img) {
    var pre = new Image();
    pre.src = img.src;
  });

  function applySelection() {
    var opt = gallery.options[optionIdx];
    var view = opt.views[viewIdx] || opt.views[0];
    if (mainImg.getAttribute("src") !== view.src) mainImg.src = view.src;
    mainImg.alt = view.alt;
    var detail = root.querySelector(".product-detail");
    if (detail && detail.hasAttribute("data-option-name")) {
      detail.setAttribute("data-option", opt.label);
    }
    var priceEl = document.getElementById("productPrice");
    if (priceEl) {
      priceEl.innerHTML = "$" + opt.price + ' <span class="unit">/ hire</span>';
    }
    var addBtn = root.querySelector(".add-quote");
    if (addBtn) addBtn.setAttribute("data-price", String(opt.price));
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-role]");
    if (!btn || !root.contains(btn)) return;
    var role = btn.getAttribute("data-role");
    var idx = parseInt(btn.getAttribute("data-index"), 10) || 0;

    if (role === "option") {
      optionIdx = idx;
      if (viewIdx >= gallery.options[optionIdx].views.length) viewIdx = 0;
      applySelection();

      root.querySelectorAll('[data-role="option"]').forEach(function (b) {
        var active = b === btn || parseInt(b.getAttribute("data-index"), 10) === optionIdx;
        b.classList.toggle("is-active", active);
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      var angleWrap = document.getElementById("productAngleThumbs");
      if (angleWrap) {
        angleWrap.innerHTML = thumbsHtmlFor(gallery.options[optionIdx], viewIdx);
      }
      return;
    }

    if (role === "angle") {
      viewIdx = idx;
      applySelection();
      root.querySelectorAll('[data-role="angle"]').forEach(function (b) {
        b.classList.toggle("active", parseInt(b.getAttribute("data-index"), 10) === viewIdx);
      });
    }
  });

  var lightbox = document.getElementById("productLightbox");
  var lightboxImg = document.getElementById("productLightboxImg");
  var openBtn = document.getElementById("productLightboxOpen");
  if (lightbox && lightboxImg && openBtn) {
    openBtn.addEventListener("click", function () {
      lightboxImg.src = mainImg.src;
      lightboxImg.alt = mainImg.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    lightbox.querySelector(".product-lightbox__backdrop").addEventListener("click", closeLightbox);
    lightbox.querySelector(".product-lightbox__close").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }
})();
