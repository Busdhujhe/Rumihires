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
window.RUMI.assetVersion = "25";

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

/* Returns the product's photos in display order: front first, then any
   extra views. Each extra may be a plain filename or { file, label }. */
window.RUMI.productImages = function (p) {
  var extras = p.extraImages || [];

  function entry(src, label) {
    return {
      src: src,
      label: label,
      alt: extras.length && label ? p.item + " — " + label : p.item
    };
  }

  var images = [entry(window.RUMI.imagePath(p.slug, p.imageExt), p.imageLabel || "front")];

  extras.forEach(function (extra) {
    var file = typeof extra === "string" ? extra : extra.file;
    var label = typeof extra === "string" ? "" : extra.label;
    images.push(entry("assets/img/products/" + file + "?v=" + window.RUMI.assetVersion, label));
  });

  return images;
};
