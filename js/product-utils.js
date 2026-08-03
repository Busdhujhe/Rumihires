/* Rumi Hires — shared product helpers */
window.RUMI = window.RUMI || {};

window.RUMI.catLabels = {
  seating: "seating",
  lounge: "lounge",
  umbrella: "umbrellas",
  tables: "tables",
  sets: "sets",
  tableware: "tableware"
};

window.RUMI.esc = function (str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

/* Bump when product photos are re-shot so browsers pick up the new files. */
window.RUMI.assetVersion = "24";

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
