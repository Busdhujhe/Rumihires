/* Rumi Hires — product detail page */
(function () {
  "use strict";

  var root = document.getElementById("productDetail");
  if (!root) return;

  var slug = new URLSearchParams(window.location.search).get("slug");
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

  var images = window.RUMI.productImages(p);
  var catLabel = window.RUMI.catLabels[p.cat] || p.cat;
  var esc = window.RUMI.esc;

  var thumbsHtml = "";
  if (images.length > 1) {
    thumbsHtml = '<div class="product-detail__thumbs"' +
      (p.optionName ? ' role="group" aria-label="Choose ' + esc(p.optionName) + '"' : "") + ">" +
      images.map(function (img, i) {
      var label = img.label || "view " + (i + 1);
      return (
        '<button type="button" class="product-detail__thumb' + (i === 0 ? " active" : "") + '" data-index="' + i + '"' +
        ' title="' + esc(label) + '" aria-label="Show ' + esc(label) + ' photo">' +
        '<img src="' + esc(img.src) + '" alt="" loading="lazy">' +
        '<span class="product-detail__thumb-label">' + esc(label) + "</span>" +
        "</button>"
      );
    }).join("") + "</div>";
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
    (p.optionName ? ' data-option-name="' + esc(p.optionName) + '" data-option="' + esc(images[0].label) + '"' : "") + ">" +
    '<div class="product-detail__gallery ' + esc(p.placeholder) + '">' +
    '<button type="button" class="product-detail__main" id="productLightboxOpen" aria-label="View full size photo">' +
    '<img id="productMainImg" src="' + esc(images[0].src) + '" alt="' + esc(images[0].alt) + '">' +
    '<span class="product-detail__zoom">click to enlarge</span>' +
    "</button>" +
    thumbsHtml +
    "</div>" +
    '<div class="product-detail__info">' +
    (p.badge ? '<span class="product__badge product-detail__badge">' + esc(p.badge) + "</span>" : "") +
    '<div class="product__cat">' + esc(catLabel) + "</div>" +
    "<h1>" + esc(p.title) + "</h1>" +
    (p.spec ? '<p class="product__spec">' + esc(p.spec) + "</p>" : "") +
    '<div class="product__price">$' + p.price + ' <span class="unit">/ hire</span></div>' +
    (p.bulk ? '<p class="product__bulk">' + esc(p.bulk) + "</p>" : "") +
    '<p class="product-detail__lead">Hire this piece for your event across Brisbane, Queensland &amp; Northern NSW. Add to your quote list — no obligation.</p>' +
    '<div class="product-detail__actions product__actions">' +
    '<div class="product__qty">' +
    "<label>qty</label>" +
    '<div class="qty-stepper">' +
    '<button type="button" class="qty-stepper__btn" data-step="-1" aria-label="Decrease quantity">−</button>' +
    '<input type="text" class="quote-qty" id="qty-' + esc(p.slug) + '" value="1" readonly inputmode="numeric" aria-label="Quantity">' +
    '<button type="button" class="qty-stepper__btn" data-step="1" aria-label="Increase quantity">+</button>' +
    "</div></div>" +
    '<button type="button" class="btn btn--gold add-quote" data-item="' + esc(p.item) + '">add to quote</button>' +
    '<a href="contact.html" class="btn btn--ghost">ask about this item</a>' +
    "</div></div></div></div>" +
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
        price: String(p.price),
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock"
      }
    });
  }

  var mainImg = document.getElementById("productMainImg");
  root.querySelectorAll(".product-detail__thumb").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = parseInt(btn.getAttribute("data-index"), 10);
      mainImg.src = images[idx].src;
      mainImg.alt = images[idx].alt;
      var detail = root.querySelector(".product-detail");
      if (detail && detail.hasAttribute("data-option-name")) {
        detail.setAttribute("data-option", images[idx].label);
      }
      root.querySelectorAll(".product-detail__thumb").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
    });
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
