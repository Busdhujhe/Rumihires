/* Rumi Hires — render product cards on items.html */
(function () {
  "use strict";

  var wrap = document.getElementById("products");
  var products = window.RUMI_PRODUCTS;
  if (!wrap || !products) return;

  var catLabels = window.RUMI.catLabels;
  var esc = window.RUMI ? window.RUMI.esc : function (s) { return s; };
  var productUrl = window.RUMI ? window.RUMI.productUrl : function (slug) {
    return "product.html?slug=" + encodeURIComponent(slug);
  };

  function qtyStepperHtml(value, id, max) {
    var idAttr = id ? ' id="' + esc(id) + '"' : "";
    var maxAttr = max > 0 ? ' data-max="' + max + '"' : "";
    return (
      '<div class="qty-stepper"' + maxAttr + ">" +
      '<button type="button" class="qty-stepper__btn" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input type="text" class="quote-qty"' + idAttr + ' value="' + value + '" readonly inputmode="numeric" aria-label="Quantity">' +
      '<button type="button" class="qty-stepper__btn" data-step="1" aria-label="Increase quantity">+</button>' +
      "</div>"
    );
  }

  function setCardImage(card, view) {
    if (!view) return;
    var img = card.querySelector(".product__img img");
    var frame = card.querySelector(".product__img");
    if (!img) return;
    img.alt = view.alt || "";
    img.onload = function () {
      if (frame) frame.classList.add("has-photo");
    };
    img.onerror = function () {
      if (frame) frame.classList.remove("has-photo");
    };
    if (img.getAttribute("src") !== view.src) {
      img.src = view.src;
    } else if (frame) {
      frame.classList.add("has-photo");
    }
  }

  function setCardPrice(card, price) {
    if (!(price > 0)) return;
    var priceEl = card.querySelector(".product__price");
    if (priceEl) {
      priceEl.innerHTML = "$" + price + ' <span class="unit">/ hire</span>';
    }
    var addBtn = card.querySelector(".add-quote");
    if (addBtn) addBtn.setAttribute("data-price", String(price));
  }

  function angleButtonsHtml(views, activeIdx) {
    if (!views || views.length < 2) return "";
    return (
      '<div class="product__views product__views--angles" role="group" aria-label="Photo angle">' +
      '<span class="product__views-label">view</span>' +
      views.map(function (view, i) {
        return (
          '<button type="button" class="product__view-btn' + (i === activeIdx ? " is-active" : "") + '"' +
          ' data-role="angle" data-index="' + i + '"' +
          ' data-src="' + esc(view.src) + '" data-alt="' + esc(view.alt) + '"' +
          ' aria-pressed="' + (i === activeIdx ? "true" : "false") + '">' +
          esc(view.label) +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function viewsHtmlFor(gallery) {
    var opt0 = gallery.options[0];
    var html = "";

    if (gallery.optionName && gallery.options.length > 1) {
      html +=
        '<div class="product__views product__views--options" role="group" aria-label="Choose ' +
        esc(gallery.optionName) + '">' +
        '<span class="product__views-label">choose ' + esc(gallery.optionName) + "</span>" +
        gallery.options.map(function (opt, i) {
          return (
            '<button type="button" class="product__view-btn' + (i === 0 ? " is-active" : "") + '"' +
            ' data-role="option" data-index="' + i + '"' +
            ' data-label="' + esc(opt.label) + '"' +
            ' data-price="' + opt.price + '"' +
            ' aria-pressed="' + (i === 0 ? "true" : "false") + '">' +
            esc(opt.label) +
            "</button>"
          );
        }).join("") +
        "</div>";
    }

    html += angleButtonsHtml(opt0.views, 0);

    /* Flat option products (e.g. umbrella styles) have one photo per option —
       no separate angle row, so the option buttons themselves swap the image. */
    if (!html && gallery.options.length > 1) {
      html =
        '<div class="product__views" role="group" aria-label="Photo views">' +
        gallery.options[0].views.map(function (view, i) {
          return (
            '<button type="button" class="product__view-btn' + (i === 0 ? " is-active" : "") + '"' +
            ' data-role="angle" data-index="' + i + '"' +
            ' data-src="' + esc(view.src) + '" data-alt="' + esc(view.alt) + '"' +
            ' aria-pressed="' + (i === 0 ? "true" : "false") + '">' +
            esc(view.label) +
            "</button>"
          );
        }).join("") +
        "</div>";
    }

    return html;
  }

  products.forEach(function (p) {
    var card = document.createElement("article");
    card.className = "product";
    card.setAttribute("data-cat", p.cat);

    var detailUrl = productUrl(p.slug);
    var gallery = window.RUMI.productGallery(p);
    card._gallery = gallery;
    card._optionIdx = 0;
    card._viewIdx = 0;

    var firstView = gallery.options[0].views[0];

    var imgHtml =
      '<a href="' + esc(detailUrl) + '" class="product__img-link" aria-label="View ' + esc(p.item) + '">' +
      '<div class="' + esc(window.RUMI.productImgClasses(p)) + '">' +
      '<img src="' + esc(firstView.src) + '" alt="' + esc(firstView.alt) + '" loading="lazy"' +
      ' onerror="var wrap=this.closest(\'.product__img\'); if(wrap) wrap.classList.remove(\'has-photo\');"' +
      ' onload="var wrap=this.closest(\'.product__img\'); if(wrap) wrap.classList.add(\'has-photo\');">' +
      (p.badge ? '<span class="product__badge">' + esc(p.badge) + "</span>" : "") +
      "</div></a>";

    if (gallery.optionName) {
      card.setAttribute("data-option-name", gallery.optionName);
      card.setAttribute("data-option", gallery.options[0].label);
    }

    var viewsHtml = viewsHtmlFor(gallery);

    var body =
      '<div class="product__cat">' + esc(catLabels[p.cat] || p.cat) + "</div>" +
      '<h3><a href="' + esc(detailUrl) + '">' + esc(p.title) + "</a></h3>" +
      (p.spec ? '<p class="product__spec">' + esc(p.spec) + "</p>" : "") +
      '<div class="product__price">$' + gallery.options[0].price + ' <span class="unit">/ hire</span></div>' +
      (p.bulk ? '<p class="product__bulk">' + esc(p.bulk) + "</p>" : "") +
      (window.RUMI.stockNote(p) ? '<p class="product__stock">' + esc(window.RUMI.stockNote(p)) + "</p>" : "") +
      '<div class="product__actions">' +
      (window.RUMI.maxQty(p) === 1 ? "" :
        '<div class="product__qty">' +
        '<label for="qty-' + esc(p.slug) + '">qty</label>' +
        qtyStepperHtml(1, "qty-" + p.slug, window.RUMI.maxQty(p)) +
        "</div>") +
      '<button type="button" class="btn btn--primary btn--small add-quote" data-item="' + esc(p.item) + '" data-price="' + gallery.options[0].price + '">add to quote</button>' +
      "</div>";

    card.innerHTML = imgHtml + viewsHtml + '<div class="product__body">' + body + "</div>";
    wrap.appendChild(card);

    gallery.options.forEach(function (opt) {
      opt.views.forEach(function (view) {
        var pre = new Image();
        pre.src = view.src;
      });
    });
  });

  wrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".product__view-btn");
    if (!btn) return;

    var card = btn.closest(".product");
    var gallery = card._gallery;
    if (!gallery) return;

    var role = btn.getAttribute("data-role");
    var idx = parseInt(btn.getAttribute("data-index"), 10) || 0;

    if (role === "option") {
      card._optionIdx = idx;
      var keepAngle = card._viewIdx || 0;
      var opt = gallery.options[idx];
      if (keepAngle >= opt.views.length) keepAngle = 0;
      card._viewIdx = keepAngle;

      if (card.hasAttribute("data-option-name")) {
        card.setAttribute("data-option", opt.label);
      }
      setCardPrice(card, opt.price);
      setCardImage(card, opt.views[keepAngle]);

      Array.prototype.forEach.call(card.querySelectorAll('.product__view-btn[data-role="option"]'), function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      var angleRow = card.querySelector(".product__views--angles");
      if (angleRow) {
        if (opt.views.length < 2) {
          angleRow.innerHTML = "";
          angleRow.hidden = true;
        } else {
          angleRow.hidden = false;
          angleRow.outerHTML = angleButtonsHtml(opt.views, keepAngle);
        }
      } else if (opt.views.length > 1) {
        var optionsRow = card.querySelector(".product__views--options");
        if (optionsRow) {
          optionsRow.insertAdjacentHTML("afterend", angleButtonsHtml(opt.views, keepAngle));
        }
      }
      return;
    }

    if (role === "angle") {
      card._viewIdx = idx;
      var current = gallery.options[card._optionIdx || 0];
      var view = current.views[idx];
      setCardImage(card, view);

      /* Flat selectable options (umbrella): angle row unused; option buttons
         carry the quote label via data-label on option role. When a product
         only has option buttons with one view each, those use role=option. */
      Array.prototype.forEach.call(card.querySelectorAll('.product__view-btn[data-role="angle"]'), function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  });
})();
