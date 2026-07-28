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

window.RUMI.imagePath = function (slug, ext) {
  return "assets/img/products/" + slug + "." + (ext || "png");
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
  var classes = "product__img " + (p.placeholder || "") + " has-photo";
  if (p.whiteBg) classes += " product__img--white-bg";
  return classes;
};

window.RUMI.productImgStyle = function (p) {
  var rules = [];
  if (p.imageScale) {
    rules.push("transform:scale(" + p.imageScale + ")");
    rules.push("transform-origin:" + (p.imageOrigin || "center center"));
  }
  return rules.length ? ' style="' + rules.join(";") + '"' : "";
};

window.RUMI.productImages = function (p) {
  var images = [{
    src: window.RUMI.imagePath(p.slug, p.imageExt),
    alt: p.item
  }];
  if (p.extraImages && p.extraImages.length) {
    p.extraImages.forEach(function (file) {
      images.push({ src: "assets/img/products/" + file, alt: p.item });
    });
  }
  return images;
};
