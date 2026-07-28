/* Rumi Hires — shared site behaviour */
(function () {
  "use strict";

  var QUOTE_KEY = "rumi-quote-list";
  var EMAIL = "hello@rumihires.com";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* ---------- quote list (localStorage) ---------- */
  function normalizeEntry(entry) {
    if (typeof entry === "string") {
      return { item: entry, qty: 1 };
    }
    return {
      item: entry.item,
      qty: Math.max(1, parseInt(entry.qty, 10) || 1)
    };
  }

  function getQuote() {
    try {
      var raw = JSON.parse(localStorage.getItem(QUOTE_KEY)) || [];
      return raw.map(normalizeEntry);
    } catch (e) {
      return [];
    }
  }

  function saveQuote(list, options) {
    localStorage.setItem(QUOTE_KEY, JSON.stringify(list));
    updateQuoteBar();
    if (!options || options.renderPanel !== false) {
      renderQuotePanel();
    }
  }

  function quoteTotals(list) {
    var lines = list.length;
    var units = list.reduce(function (sum, entry) {
      return sum + entry.qty;
    }, 0);
    return { lines: lines, units: units };
  }

  function formatQuoteLine(entry) {
    return entry.qty > 1
      ? "  - " + entry.item + " × " + entry.qty
      : "  - " + entry.item;
  }

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function qtyStepperHtml(value) {
    return (
      '<div class="qty-stepper">' +
      '<button type="button" class="qty-stepper__btn" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input type="text" class="quote-qty" value="' + value + '" readonly inputmode="numeric" aria-label="Quantity">' +
      '<button type="button" class="qty-stepper__btn" data-step="1" aria-label="Increase quantity">+</button>' +
      "</div>"
    );
  }

  function readQty(input) {
    if (!input) return 1;
    return Math.max(1, Math.min(9999, parseInt(input.value, 10) || 1));
  }

  function syncStepper(stepper, val) {
    var input = stepper.querySelector(".quote-qty");
    var minus = stepper.querySelector('[data-step="-1"]');
    if (input) input.value = val;
    if (minus) minus.disabled = val <= 1;
  }

  function applyStepperStep(stepper, step) {
    var input = stepper.querySelector(".quote-qty");
    var val = readQty(input) + step;
    val = Math.max(1, Math.min(9999, val));
    syncStepper(stepper, val);
    return val;
  }

  /* ---------- quote panel UI ---------- */
  var panel, panelBody, panelOpen = false;

  function ensureQuoteUI() {
    var bar = document.getElementById("quoteBar");
    if (!bar) return;

    if (!bar.querySelector("#viewQuote")) {
      var viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className = "btn btn--ghost-light btn--small quote-bar__view";
      viewBtn.id = "viewQuote";
      viewBtn.textContent = "view list";
      bar.insertBefore(viewBtn, bar.firstChild);
    }

    if (!document.getElementById("quotePanel")) {
      var wrap = document.createElement("div");
      wrap.className = "quote-panel";
      wrap.id = "quotePanel";
      wrap.setAttribute("aria-hidden", "true");
      wrap.innerHTML =
        '<div class="quote-panel__backdrop" id="quotePanelBackdrop"></div>' +
        '<div class="quote-panel__sheet" role="dialog" aria-labelledby="quotePanelTitle">' +
        '<div class="quote-panel__head">' +
        '<h2 id="quotePanelTitle">your quote list</h2>' +
        '<button type="button" class="quote-panel__close" id="closeQuotePanel" aria-label="Close quote list">&times;</button>' +
        "</div>" +
        '<div class="quote-panel__body" id="quotePanelBody"></div>' +
        '<div class="quote-panel__foot">' +
        '<button type="button" class="btn btn--ghost btn--small" id="clearQuote">clear all</button>' +
        '<button type="button" class="btn btn--gold btn--small" id="sendQuotePanel">request quote</button>' +
        "</div>" +
        "</div>";
      document.body.appendChild(wrap);
    }

    panel = document.getElementById("quotePanel");
    panelBody = document.getElementById("quotePanelBody");
  }

  function openQuotePanel() {
    if (!panel) return;
    renderQuotePanel();
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    panelOpen = true;
    document.body.style.overflow = "hidden";
  }

  function closeQuotePanel() {
    if (!panel) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    panelOpen = false;
    document.body.style.overflow = "";
  }

  function renderQuotePanel() {
    if (!panelBody) return;
    var list = getQuote();

    if (!list.length) {
      panelBody.innerHTML =
        '<p class="quote-panel__empty">Your quote list is empty. ' +
        '<a href="items.html">Browse items</a> to add pieces.</p>';
      return;
    }

    var totals = quoteTotals(list);
    var html = list.map(function (entry, index) {
      return (
        '<div class="quote-item" data-index="' + index + '">' +
        '<span class="quote-item__name">' + esc(entry.item) + "</span>" +
        '<div class="quote-item__qty">' + qtyStepperHtml(entry.qty) + "</div>" +
        '<button type="button" class="quote-item__remove" data-index="' + index + '" aria-label="Remove ' + esc(entry.item) + '">&times;</button>' +
        "</div>"
      );
    }).join("");

    html +=
      '<p class="quote-panel__summary">' +
      totals.lines + " item" + (totals.lines === 1 ? "" : "s") +
      " · " + totals.units + " piece" + (totals.units === 1 ? "" : "s") + " total" +
      "</p>";

    panelBody.innerHTML = html;
    panelBody.querySelectorAll(".qty-stepper").forEach(function (stepper) {
      syncStepper(stepper, readQty(stepper.querySelector(".quote-qty")));
    });
  }

  function updateQuoteBar() {
    var bar = document.getElementById("quoteBar");
    var count = document.getElementById("quoteCount");
    if (!bar || !count) return;
    var totals = quoteTotals(getQuote());
    count.textContent = totals.units;
    bar.classList.toggle("visible", totals.lines > 0);
    if (panelOpen && totals.lines === 0) closeQuotePanel();
  }

  function sendQuoteEmail() {
    var list = getQuote();
    if (!list.length) return;
    var body =
      "Hi Rumi Hires,\n\n" +
      "I'd like a quote for the following items:\n\n" +
      list.map(formatQuoteLine).join("\n") +
      "\n\nEvent date: \nVenue / location: \nApprox. guest numbers: \n\nThanks!";
    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Quote request — Rumi Hires") +
      "&body=" + encodeURIComponent(body);
    localStorage.removeItem(QUOTE_KEY);
    closeQuotePanel();
    updateQuoteBar();
    renderQuotePanel();
    showToast("Quote list cleared — check your email app");
  }

  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#viewQuote") || e.target.closest("#quoteCount") || e.target.closest(".quote-bar__count")) {
      openQuotePanel();
      return;
    }

    if (e.target.closest("#closeQuotePanel") || e.target.id === "quotePanelBackdrop") {
      closeQuotePanel();
      return;
    }

    if (e.target.closest("#clearQuote")) {
      if (!getQuote().length) return;
      if (window.confirm("Clear your entire quote list?")) {
        localStorage.removeItem(QUOTE_KEY);
        updateQuoteBar();
        renderQuotePanel();
        showToast("Quote list cleared");
      }
      return;
    }

    if (e.target.closest("#sendQuote") || e.target.closest("#sendQuotePanel")) {
      sendQuoteEmail();
      return;
    }

    var removeBtn = e.target.closest(".quote-item__remove");
    if (removeBtn) {
      var idx = parseInt(removeBtn.getAttribute("data-index"), 10);
      var list = getQuote();
      if (list[idx]) {
        var removed = list[idx].item;
        list.splice(idx, 1);
        saveQuote(list);
        showToast("Removed \u201c" + removed + "\u201d");
      }
      return;
    }

    var stepBtn = e.target.closest(".qty-stepper__btn");
    if (stepBtn) {
      var stepper = stepBtn.closest(".qty-stepper");
      if (!stepper) return;
      var step = parseInt(stepBtn.getAttribute("data-step"), 10);
      var val = applyStepperStep(stepper, step);

      var row = stepper.closest(".quote-item");
      if (row) {
        var idx = parseInt(row.getAttribute("data-index"), 10);
        var list = getQuote();
        if (list[idx]) {
          list[idx].qty = val;
          saveQuote(list, { renderPanel: false });
          var summary = panelBody && panelBody.querySelector(".quote-panel__summary");
          if (summary) {
            var totals = quoteTotals(list);
            summary.textContent =
              totals.lines + " item" + (totals.lines === 1 ? "" : "s") +
              " · " + totals.units + " piece" + (totals.units === 1 ? "" : "s") + " total";
          }
        }
      }
      return;
    }

    var btn = e.target.closest(".add-quote");
    if (!btn) return;

    var item = btn.getAttribute("data-item");
    var card = btn.closest(".product");
    var qtyInput = card ? card.querySelector(".quote-qty") : null;
    var qty = readQty(qtyInput);
    if (qtyInput) syncStepper(qtyInput.closest(".qty-stepper"), qty);

    var list = getQuote();
    var existing = list.find(function (entry) {
      return entry.item === item;
    });

    if (existing) {
      existing.qty = qty;
      saveQuote(list);
      showToast("Updated \u201c" + item + "\u201d to qty " + qty);
      return;
    }

    list.push({ item: item, qty: qty });
    saveQuote(list);
    showToast("Added \u201c" + item + "\u201d \u00d7 " + qty + " to your quote list");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panelOpen) closeQuotePanel();
  });

  ensureQuoteUI();
  updateQuoteBar();
  renderQuotePanel();

  document.querySelectorAll(".qty-stepper").forEach(function (stepper) {
    syncStepper(stepper, readQty(stepper.querySelector(".quote-qty")));
  });

  /* ---------- catalogue filters ---------- */
  var filterWrap = document.getElementById("filters");
  var productsWrap = document.getElementById("products");

  function applyFilter(cat) {
    if (!productsWrap) return;
    var visible = 0;
    productsWrap.querySelectorAll(".product").forEach(function (card) {
      var match = cat === "all" || card.getAttribute("data-cat") === cat;
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });
    var noResults = document.getElementById("noResults");
    if (noResults) noResults.style.display = visible ? "none" : "block";
    if (filterWrap) {
      filterWrap.querySelectorAll(".filter-chip").forEach(function (chip) {
        chip.classList.toggle("active", chip.getAttribute("data-filter") === cat);
      });
    }
  }

  if (filterWrap) {
    filterWrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (chip) applyFilter(chip.getAttribute("data-filter"));
    });

    var params = new URLSearchParams(window.location.search);
    var cat = params.get("cat");
    if (cat && filterWrap.querySelector('[data-filter="' + cat + '"]')) {
      applyFilter(cat);
    }
  }

  /* ---------- enquiry form -> mailto ---------- */
  var form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var get = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var quoteItems = getQuote();
      var lines = [
        "Hi Rumi Hires,",
        "",
        "Name: " + get("name"),
        "Phone: " + (get("phone") || "-"),
        "Email: " + get("email"),
        "Event date: " + (get("date") || "TBC"),
        "Event type: " + (get("type") || "-"),
        "Venue / location: " + (get("location") || "TBC"),
        "",
        "My vision:",
        get("message")
      ];
      if (quoteItems.length) {
        lines.push("", "Items on my quote list:");
        quoteItems.forEach(function (entry) {
          lines.push(formatQuoteLine(entry));
        });
      }
      lines.push("", "Thanks!");
      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent("Event enquiry — " + (get("name") || "new enquiry")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      showToast("Opening your email app\u2026");
    });
  }
})();
