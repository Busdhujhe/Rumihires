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



  products.forEach(function (p) {

    var card = document.createElement("article");

    card.className = "product";

    card.setAttribute("data-cat", p.cat);



    var detailUrl = productUrl(p.slug);

    var images = window.RUMI.productImages(p);

    var imgHtml =

      '<a href="' + esc(detailUrl) + '" class="product__img-link" aria-label="View ' + esc(p.item) + '">' +

      '<div class="' + esc(window.RUMI.productImgClasses(p)) + '">' +

      '<img src="' + esc(images[0].src) + '" alt="' + esc(images[0].alt) + '" loading="lazy"' +
      ' onerror="var wrap=this.closest(\'.product__img\'); if(wrap) wrap.classList.remove(\'has-photo\');"' +
      ' onload="var wrap=this.closest(\'.product__img\'); if(wrap) wrap.classList.add(\'has-photo\');">' +

      (p.badge ? '<span class="product__badge">' + esc(p.badge) + "</span>" : "") +

      "</div></a>";

    if (p.optionName) {
      card.setAttribute("data-option-name", p.optionName);
      card.setAttribute("data-option", images[0].label);
    }

    var viewsHtml = images.length < 2 ? "" :
      '<div class="product__views" role="group" aria-label="' +
      (p.optionName ? "Choose " + esc(p.optionName) : "Photo views of " + esc(p.item)) + '">' +
      (p.optionName ? '<span class="product__views-label">choose ' + esc(p.optionName) + "</span>" : "") +
      images.map(function (img, i) {
        return (
          '<button type="button" class="product__view-btn' + (i === 0 ? " is-active" : "") + '"' +
          ' data-src="' + esc(img.src) + '" data-alt="' + esc(img.alt) + '"' +
          ' data-label="' + esc(img.label) + '"' +
          ' aria-pressed="' + (i === 0 ? "true" : "false") + '">' +
          esc(img.label) +
          "</button>"
        );
      }).join("") +
      "</div>";



    var body =

      '<div class="product__cat">' + esc(catLabels[p.cat] || p.cat) + "</div>" +

      '<h3><a href="' + esc(detailUrl) + '">' + esc(p.title) + "</a></h3>" +

      (p.spec ? '<p class="product__spec">' + esc(p.spec) + "</p>" : "") +

      '<div class="product__price">$' + p.price + ' <span class="unit">/ hire</span></div>' +

      (p.bulk ? '<p class="product__bulk">' + esc(p.bulk) + "</p>" : "") +

      (window.RUMI.stockNote(p) ? '<p class="product__stock">' + esc(window.RUMI.stockNote(p)) + "</p>" : "") +

      '<a href="' + esc(detailUrl) + '" class="product__view">view photos &amp; details</a>' +

      '<div class="product__actions">' +

      /* A stepper pinned to 1 has both buttons dead, which reads as broken —
         the stock note already tells the customer why. */
      (window.RUMI.maxQty(p) === 1 ? "" :

        '<div class="product__qty">' +

        '<label for="qty-' + esc(p.slug) + '">qty</label>' +

        qtyStepperHtml(1, "qty-" + p.slug, window.RUMI.maxQty(p)) +

        "</div>") +

      '<button type="button" class="btn btn--primary btn--small add-quote" data-item="' + esc(p.item) + '">add to quote</button>' +

      "</div>";



    card.innerHTML = imgHtml + viewsHtml + '<div class="product__body">' + body + "</div>";

    wrap.appendChild(card);

    // Prefetch alternate angles so view switches are instant from cache
    if (images.length > 1) {
      images.slice(1).forEach(function (img) {
        var pre = new Image();
        pre.src = img.src;
      });
    }
  });

  wrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".product__view-btn");
    if (!btn) return;

    var card = btn.closest(".product");
    var img = card.querySelector(".product__img img");
    var frame = card.querySelector(".product__img");
    if (img) {
      var nextSrc = btn.getAttribute("data-src");
      var nextAlt = btn.getAttribute("data-alt") || "";
      img.alt = nextAlt;
      img.onload = function () {
        if (frame) frame.classList.add("has-photo");
      };
      img.onerror = function () {
        if (frame) frame.classList.remove("has-photo");
      };
      // Swap in place — do not clear src (that forced a full reload every click)
      if (img.getAttribute("src") !== nextSrc) {
        img.src = nextSrc;
      } else if (frame) {
        frame.classList.add("has-photo");
      }
    }

    if (card.hasAttribute("data-option-name")) {
      card.setAttribute("data-option", btn.getAttribute("data-label"));
    }

    Array.prototype.forEach.call(card.querySelectorAll(".product__view-btn"), function (b) {
      var active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  });

})();

