/* Rumi Hires — Moments gallery page */
(function () {
  "use strict";

  var grid = document.getElementById("momentsGrid");
  var filters = document.getElementById("momentsFilters");
  if (!grid) return;

  var esc = window.RUMI.esc;
  var moments = window.RUMI_MOMENTS || [];
  var activeSlug = new URLSearchParams(window.location.search).get("product") || "";
  var activeId = new URLSearchParams(window.location.search).get("shot") || "";

  function momentSrc(m) {
    return "assets/img/moments/" + m.file + "?v=" + window.RUMI.assetVersion;
  }

  function productLabel(slug) {
    var p = window.RUMI.getProduct(slug);
    return p ? p.title : slug;
  }

  function filtered() {
    if (!activeSlug) return moments.slice();
    return moments.filter(function (m) {
      return (m.products || []).indexOf(activeSlug) !== -1;
    });
  }

  function buildFilters() {
    if (!filters) return;
    var counts = {};
    moments.forEach(function (m) {
      (m.products || []).forEach(function (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      });
    });
    var slugs = Object.keys(counts).sort(function (a, b) {
      return productLabel(a).localeCompare(productLabel(b));
    });

    var html =
      '<button type="button" class="filter-chip' + (!activeSlug ? " active" : "") + '" data-product="">all moments</button>';
    slugs.forEach(function (slug) {
      html +=
        '<button type="button" class="filter-chip' + (activeSlug === slug ? " active" : "") + '" data-product="' + esc(slug) + '">' +
        esc(productLabel(slug)) +
        ' <span class="moments-filter-count">' + counts[slug] + "</span>" +
        "</button>";
    });
    filters.innerHTML = html;

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-chip");
      if (!btn) return;
      activeSlug = btn.getAttribute("data-product") || "";
      var url = new URL(window.location.href);
      if (activeSlug) url.searchParams.set("product", activeSlug);
      else url.searchParams.delete("product");
      url.searchParams.delete("shot");
      window.history.replaceState({}, "", url.pathname + url.search);
      Array.prototype.forEach.call(filters.querySelectorAll(".filter-chip"), function (b) {
        b.classList.toggle("active", (b.getAttribute("data-product") || "") === activeSlug);
      });
      renderGrid();
    });
  }

  function tagHtml(slugs) {
    if (!slugs || !slugs.length) return "";
    return (
      '<div class="moments-card__tags">' +
      slugs.map(function (slug) {
        var p = window.RUMI.getProduct(slug);
        if (!p) return "";
        return (
          '<a class="moments-tag" href="' + esc(window.RUMI.productUrl(slug)) + '">' +
          esc(p.title) +
          "</a>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderGrid() {
    var list = filtered();
    if (!list.length) {
      grid.innerHTML =
        '<p class="moments-empty">No moments tagged with that piece yet — browse all moments or pick another item.</p>';
      return;
    }
    grid.innerHTML = list.map(function (m, i) {
      return (
        '<article class="moments-card" data-id="' + esc(m.id) + '" style="--i:' + i + '" tabindex="0" role="button" aria-label="Open ' + esc(m.title) + '">' +
        '<div class="moments-card__media">' +
        '<img src="' + esc(momentSrc(m)) + '" alt="" loading="lazy">' +
        "</div>" +
        '<div class="moments-card__body">' +
        "<h3>" + esc(m.title) + "</h3>" +
        (m.products && m.products.length
          ? '<div class="moments-card__hire"><span class="moments-card__hire-label">in this shot</span>' + tagHtml(m.products) + "</div>"
          : "") +
        "</div></article>"
      );
    }).join("");
  }

  var lightbox = document.getElementById("momentsLightbox");
  var lbImg = document.getElementById("momentsLightboxImg");
  var lbTitle = document.getElementById("momentsLightboxTitle");
  var lbCaption = document.getElementById("momentsLightboxCaption");
  var lbTags = document.getElementById("momentsLightboxTags");
  var lbIndex = -1;

  function openAt(id) {
    var list = filtered();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { idx = i; break; }
    }
    if (idx < 0 && moments.length) {
      list = moments;
      for (i = 0; i < list.length; i++) {
        if (list[i].id === id) { idx = i; break; }
      }
    }
    if (idx < 0) return;
    show(list, idx);
  }

  function show(list, idx) {
    var m = list[idx];
    if (!m || !lightbox) return;
    lbIndex = idx;
    lbImg.src = momentSrc(m);
    lbImg.alt = m.title;
    lbTitle.textContent = m.title;
    lbCaption.textContent = m.caption || "";
    lbTags.innerHTML =
      '<p class="moments-lightbox__label">pieces in this photo</p>' +
      (m.products || []).map(function (slug) {
        var p = window.RUMI.getProduct(slug);
        if (!p) return "";
        return (
          '<a class="moments-tag moments-tag--lg" href="' + esc(window.RUMI.productUrl(slug)) + '">' +
          '<img src="' + esc(window.RUMI.imagePath(p.slug, p.imageExt)) + '" alt="">' +
          "<span>" + esc(p.title) + ' · $' + p.price + " / hire</span>" +
          "</a>"
        );
      }).join("") +
      '<a class="moments-lightbox__hire" href="items.html">browse all items for hire</a>';

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    var url = new URL(window.location.href);
    url.searchParams.set("shot", m.id);
    window.history.replaceState({}, "", url.pathname + url.search);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    var url = new URL(window.location.href);
    url.searchParams.delete("shot");
    window.history.replaceState({}, "", url.pathname + url.search);
  }

  function step(delta) {
    var list = filtered();
    if (!list.length) return;
    var next = (lbIndex + delta + list.length) % list.length;
    show(list, next);
  }

  grid.addEventListener("click", function (e) {
    if (e.target.closest("a.moments-tag")) return;
    var card = e.target.closest(".moments-card");
    if (!card) return;
    openAt(card.getAttribute("data-id"));
  });
  grid.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest("a.moments-tag")) return;
    var card = e.target.closest(".moments-card");
    if (!card || e.target !== card) return;
    e.preventDefault();
    openAt(card.getAttribute("data-id"));
  });

  if (lightbox) {
    lightbox.querySelector(".moments-lightbox__backdrop").addEventListener("click", closeLightbox);
    lightbox.querySelector(".moments-lightbox__close").addEventListener("click", closeLightbox);
    var prevBtn = lightbox.querySelector(".moments-lightbox__prev");
    var nextBtn = lightbox.querySelector(".moments-lightbox__next");
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  buildFilters();
  renderGrid();
  if (activeId) openAt(activeId);
})();
