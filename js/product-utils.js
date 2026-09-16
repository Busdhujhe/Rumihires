/* Rumi Hires — shared product helpers */
window.RUMI = window.RUMI || {};

window.RUMI.catLabels = {
  seating: "seating",
  lounge: "lounge",
  umbrella: "umbrellas",
  tables: "tables",
  sets: "sets",
  tableware: "tableware",
  cameras: "cameras"
};

window.RUMI.esc = function (str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

/* Bump when product photos are re-shot so browsers pick up the new files. */
window.RUMI.assetVersion = "67";

/* Moments gallery helpers — tagged real-event photos linked to hire products. */
window.RUMI.momentsForProduct = function (slug) {
  var list = window.RUMI_MOMENTS || [];
  if (!slug) return list.slice();
  return list.filter(function (m) {
    return (m.products || []).indexOf(slug) !== -1;
  });
};

window.RUMI.momentSrc = function (m) {
  return "assets/img/moments/" + m.file + "?v=" + window.RUMI.assetVersion;
};

window.RUMI.momentsUrl = function (slug) {
  return slug ? "moments.html?product=" + encodeURIComponent(slug) : "moments.html";
};

window.RUMI.imagePath = function (slug, ext) {
  return "assets/img/products/" + slug + "." + (ext || "png") + "?v=" + window.RUMI.assetVersion;
};

/* Stock ceiling for a product — 0 means no limit. Used to stop a visitor
   asking for three of something we only own one of. */
window.RUMI.maxQty = function (p) {
  var max = p && parseInt(p.maxQty, 10);
  return max > 0 ? max : 0;
};

/* The quote list only stores the display name, and variant products have
   their option appended as " (silver pole)", so fall back to a prefix match. */
window.RUMI.maxQtyForItem = function (item) {
  var list = window.RUMI_PRODUCTS || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].item === item) return window.RUMI.maxQty(list[i]);
  }
  for (var j = 0; j < list.length; j++) {
    if (item.indexOf(list[j].item + " (") === 0) return window.RUMI.maxQty(list[j]);
  }
  return 0;
};

/* Explains the capped quantity stepper to the customer. */
window.RUMI.stockNote = function (p) {
  var max = window.RUMI.maxQty(p);
  if (!max) return "";
  return max === 1 ? "only 1 available" : "only " + max + " available";
};

/* Hire price for a quote-list item name. Same prefix match as maxQtyForItem
   so variant labels like " (silver pole)" still resolve. Option labels can
   carry their own price (e.g. XL umbrella at $75). */
window.RUMI.priceForItem = function (item) {
  var list = window.RUMI_PRODUCTS || [];
  if (!item) return 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].item === item) return list[i].price || 0;
  }
  for (var j = 0; j < list.length; j++) {
    var prefix = list[j].item + " (";
    if (item.indexOf(prefix) === 0 && item.charAt(item.length - 1) === ")") {
      var option = item.slice(prefix.length, -1);
      var finishes = list[j].finishes || [];
      for (var f = 0; f < finishes.length; f++) {
        if (finishes[f].label === option && finishes[f].price > 0) return finishes[f].price;
      }
      var extras = list[j].extraImages || [];
      for (var k = 0; k < extras.length; k++) {
        var extra = extras[k];
        if (typeof extra !== "string" && extra.label === option && extra.price > 0) {
          return extra.price;
        }
      }
      return list[j].price || 0;
    }
  }
  return 0;
};

/* Product photo for a quote-list line. Picks a matching option view when the
   name ends with " (silver pole)" etc., otherwise the main studio shot. */
window.RUMI.imageForItem = function (item) {
  var list = window.RUMI_PRODUCTS || [];
  if (!item) return "";

  function pathFor(p, optionLabel) {
    if (optionLabel && p.finishes && p.finishes.length) {
      for (var f = 0; f < p.finishes.length; f++) {
        if (p.finishes[f].label === optionLabel) {
          var views = p.finishes[f].views || [];
          var first = views[0];
          var file = first && typeof first !== "string" ? first.file : first;
          if (file) return "assets/img/products/" + file + "?v=" + window.RUMI.assetVersion;
          return window.RUMI.imagePath(p.slug, p.imageExt);
        }
      }
    }
    if (optionLabel && p.extraImages && p.extraImages.length) {
      for (var i = 0; i < p.extraImages.length; i++) {
        var extra = p.extraImages[i];
        var label = typeof extra === "string" ? "" : extra.label;
        var fileName = typeof extra === "string" ? extra : extra.file;
        if (label && label === optionLabel) {
          return "assets/img/products/" + fileName + "?v=" + window.RUMI.assetVersion;
        }
      }
    }
    return window.RUMI.imagePath(p.slug, p.imageExt);
  }

  for (var i = 0; i < list.length; i++) {
    if (list[i].item === item) return pathFor(list[i], "");
  }
  for (var j = 0; j < list.length; j++) {
    var prefix = list[j].item + " (";
    if (item.indexOf(prefix) === 0 && item.charAt(item.length - 1) === ")") {
      var option = item.slice(prefix.length, -1);
      return pathFor(list[j], option);
    }
  }
  return "";
};

window.RUMI.getProduct = function (slug) {
  var list = window.RUMI_PRODUCTS || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].slug === slug) return list[i];
  }
  return null;
};

window.RUMI.productUrl = function (slug) {
  return "product.html?slug=" + encodeURIComponent(slug);
};

window.RUMI.productImgClasses = function (p) {
  return "product__img " + (p.placeholder || "") + " has-photo";
};

/* Gallery model used by catalogue cards + detail page.
   - finishes: selectable quote option, each with its own front/side views
   - optionName + extraImages: each image is a quote option (one photo each)
   - extraImages only: angle/photo views, not quote options */
window.RUMI.productGallery = function (p) {
  var v = window.RUMI.assetVersion;

  function fileSrc(file) {
    if (!file) return window.RUMI.imagePath(p.slug, p.imageExt);
    return "assets/img/products/" + file + "?v=" + v;
  }

  function makeView(file, viewLabel, optionLabel, price) {
    var bits = [];
    if (optionLabel) bits.push(optionLabel);
    if (viewLabel) bits.push(viewLabel);
    return {
      src: fileSrc(file),
      label: viewLabel || "front",
      price: price > 0 ? price : p.price,
      alt: bits.length ? p.item + " — " + bits.join(" · ") : p.item
    };
  }

  if (p.finishes && p.finishes.length) {
    return {
      optionName: p.optionName || "finish",
      options: p.finishes.map(function (f) {
        var price = f.price > 0 ? f.price : p.price;
        return {
          label: f.label,
          price: price,
          views: (f.views || []).map(function (vw) {
            var file = typeof vw === "string" ? vw : vw.file;
            var label = typeof vw === "string" ? "front" : (vw.label || "front");
            return makeView(file, label, f.label, price);
          })
        };
      })
    };
  }

  var extras = p.extraImages || [];
  var mainLabel = p.imageLabel || (extras.length ? "front" : "");
  var main = makeView(null, mainLabel || "front", p.optionName ? mainLabel : "", p.price);
  if (!p.optionName) main.alt = p.item;

  if (p.optionName) {
    var options = [{ label: mainLabel || "front", price: p.price, views: [main] }];
    extras.forEach(function (extra) {
      var file = typeof extra === "string" ? extra : extra.file;
      var label = typeof extra === "string" ? "" : extra.label;
      var price = typeof extra === "string" ? p.price : (extra.price > 0 ? extra.price : p.price);
      var view = makeView(file, label, label, price);
      options.push({ label: label, price: price, views: [view] });
    });
    return { optionName: p.optionName, options: options };
  }

  var views = [main];
  extras.forEach(function (extra) {
    var file = typeof extra === "string" ? extra : extra.file;
    var label = typeof extra === "string" ? "" : extra.label;
    views.push(makeView(file, label || "view", "", p.price));
  });
  return { optionName: null, options: [{ label: "", price: p.price, views: views }] };
};

/* Flat photo list (schema, prefetch). Prefer gallery when available. */
window.RUMI.productImages = function (p) {
  var gallery = window.RUMI.productGallery(p);
  var images = [];
  gallery.options.forEach(function (opt) {
    opt.views.forEach(function (view) {
      images.push(view);
    });
  });
  return images;
};
