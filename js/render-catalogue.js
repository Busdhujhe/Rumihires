/* Rumi Hires — render product cards on items.html */

(function () {

  "use strict";



  var wrap = document.getElementById("products");

  var products = window.RUMI_PRODUCTS;

  if (!wrap || !products) return;



  var catLabels = window.RUMI.catLabels;

  var esc = window.RUMI ? window.RUMI.esc : function (s) { return s; };

  var imagePath = window.RUMI ? window.RUMI.imagePath : function (slug, ext) {

    return "assets/img/products/" + slug + "." + (ext || "png");

  };

  var productUrl = window.RUMI ? window.RUMI.productUrl : function (slug) {

    return "product.html?slug=" + encodeURIComponent(slug);

  };



  function qtyStepperHtml(value, id) {

    var idAttr = id ? ' id="' + esc(id) + '"' : "";

    return (

      '<div class="qty-stepper">' +

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



    var imgHtml =

      '<a href="' + esc(detailUrl) + '" class="product__img-link" aria-label="View ' + esc(p.item) + '">' +

      '<div class="' + esc(window.RUMI.productImgClasses(p)) + '">' +

      '<img src="' + esc(imagePath(p.slug, p.imageExt)) + '" alt="' + esc(p.item) + '" loading="lazy"' +
      window.RUMI.productImgStyle(p) +
      ' onerror="this.closest(\'.product__img\').classList.remove(\'has-photo\')">' +

      (p.badge ? '<span class="product__badge">' + esc(p.badge) + "</span>" : "") +

      "</div></a>";



    var body =

      '<div class="product__cat">' + esc(catLabels[p.cat] || p.cat) + "</div>" +

      '<h3><a href="' + esc(detailUrl) + '">' + esc(p.title) + "</a></h3>" +

      (p.spec ? '<p class="product__spec">' + esc(p.spec) + "</p>" : "") +

      '<div class="product__price">$' + p.price + ' <span class="unit">/ hire</span></div>' +

      (p.bulk ? '<p class="product__bulk">' + esc(p.bulk) + "</p>" : "") +

      '<a href="' + esc(detailUrl) + '" class="product__view">view photos &amp; details</a>' +

      '<div class="product__actions">' +

      '<div class="product__qty">' +

      '<label for="qty-' + esc(p.slug) + '">qty</label>' +

      qtyStepperHtml(1, "qty-" + p.slug) +

      "</div>" +

      '<button type="button" class="btn btn--primary btn--small add-quote" data-item="' + esc(p.item) + '">add to quote</button>' +

      "</div>";



    card.innerHTML = imgHtml + '<div class="product__body">' + body + "</div>";

    wrap.appendChild(card);

  });

})();

