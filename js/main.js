/* Rumi Hires — shared site behaviour */
(function () {
  "use strict";

  var QUOTE_KEY = "rumi-quote-list";
  var EMAIL = "hello@rumihires.com";

  /* Enquiry delivery.
     Paste a free Web3Forms access key below and enquiries are sent straight to
     EMAIL from the page, so the visitor never has to open a mail app. Get one
     at https://web3forms.com — the key is safe to publish, it only permits
     sending to the address verified against it.
     While this is blank the form keeps its old behaviour and opens the
     visitor's mail app instead, so the site still works either way. */
  var FORM_ACCESS_KEY = "";
  var FORM_ENDPOINT = "https://api.web3forms.com/submit";

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
  /* Stock ceiling for a saved line. It travels with the entry so the quote
     panel still enforces it on pages that don't load the product catalogue. */
  function entryMax(entry) {
    var stored = parseInt(entry && entry.max, 10);
    if (stored > 0) return stored;
    if (window.RUMI && window.RUMI.maxQtyForItem) {
      return window.RUMI.maxQtyForItem(entry.item) || 0;
    }
    return 0;
  }

  /* Unit hire price. Travels with the entry so totals still work on pages
     that don't load the product catalogue. */
  function entryPrice(entry) {
    var stored = parseFloat(entry && entry.price);
    if (!isNaN(stored) && stored > 0) return stored;
    if (window.RUMI && window.RUMI.priceForItem) {
      return window.RUMI.priceForItem(entry.item) || 0;
    }
    return 0;
  }

  function lineTotal(entry) {
    return entryPrice(entry) * (entry.qty || 1);
  }

  function formatMoney(amount) {
    var n = Math.round((amount || 0) * 100) / 100;
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }

  function normalizeEntry(entry) {
    if (typeof entry === "string") {
      entry = { item: entry, qty: 1 };
    }
    var max = entryMax(entry);
    var qty = Math.max(1, parseInt(entry.qty, 10) || 1);
    var price = entryPrice(entry);
    var out = { item: entry.item, qty: max > 0 ? Math.min(qty, max) : qty };
    if (max > 0) out.max = max;
    if (price > 0) out.price = price;
    return out;
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
    var hire = list.reduce(function (sum, entry) {
      return sum + lineTotal(entry);
    }, 0);
    return { lines: lines, units: units, hire: hire };
  }

  function formatQuoteLine(entry) {
    var price = entryPrice(entry);
    var line = "  - " + entry.item;
    if (entry.qty > 1) line += " × " + entry.qty;
    if (price > 0) {
      line += entry.qty > 1
        ? " @ $" + formatMoney(price) + " = $" + formatMoney(lineTotal(entry))
        : " — $" + formatMoney(price);
    }
    return line;
  }

  function summaryHtml(totals) {
    var text =
      totals.lines + " item" + (totals.lines === 1 ? "" : "s") +
      " · " + totals.units + " piece" + (totals.units === 1 ? "" : "s");
    if (totals.hire > 0) {
      text +=
        '<span class="quote-panel__hire">Hire total <strong>$' +
        formatMoney(totals.hire) +
        "</strong></span>" +
        '<span class="quote-panel__hire-note">Items only — pickup/delivery quoted separately</span>';
    }
    return text;
  }

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function stepperMax(stepper) {
    var max = stepper && parseInt(stepper.getAttribute("data-max"), 10);
    return max > 0 ? max : 9999;
  }

  function qtyStepperHtml(value, max) {
    return (
      '<div class="qty-stepper"' + (max > 0 ? ' data-max="' + max + '"' : "") + ">" +
      '<button type="button" class="qty-stepper__btn" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input type="text" class="quote-qty" value="' + value + '" readonly inputmode="numeric" aria-label="Quantity">' +
      '<button type="button" class="qty-stepper__btn" data-step="1" aria-label="Increase quantity">+</button>' +
      "</div>"
    );
  }

  function readQty(input) {
    if (!input) return 1;
    var max = stepperMax(input.closest(".qty-stepper"));
    return Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  }

  function syncStepper(stepper, val) {
    var input = stepper.querySelector(".quote-qty");
    var minus = stepper.querySelector('[data-step="-1"]');
    var plus = stepper.querySelector('[data-step="1"]');
    if (input) input.value = val;
    if (minus) minus.disabled = val <= 1;
    if (plus) plus.disabled = val >= stepperMax(stepper);
  }

  function applyStepperStep(stepper, step) {
    var input = stepper.querySelector(".quote-qty");
    var val = readQty(input) + step;
    val = Math.max(1, Math.min(stepperMax(stepper), val));
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
        '<p class="quote-panel__note">Pickup from Brisbane or delivery across QLD &amp; Northern NSW — both available. Delivery is quoted once we have your venue address, so it won\u2019t appear in this list yet.</p>' +
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
    var note = panel && panel.querySelector(".quote-panel__note");

    if (!list.length) {
      panelBody.innerHTML =
        '<p class="quote-panel__empty">Your quote list is empty. ' +
        '<a href="items.html">Browse items</a> to add pieces.</p>';
      if (note) note.style.display = "none";
      return;
    }

    if (note) note.style.display = "";

    var totals = quoteTotals(list);
    var html = list.map(function (entry, index) {
      var price = entryPrice(entry);
      var line = lineTotal(entry);
      return (
        '<div class="quote-item" data-index="' + index + '">' +
        '<span class="quote-item__name">' + esc(entry.item) + "</span>" +
        '<span class="quote-item__price"' + (price > 0 ? ' data-unit="' + price + '"' : "") + ">" +
        (price > 0 ? "$" + formatMoney(line) : "") +
        "</span>" +
        '<div class="quote-item__qty">' +
        (entryMax(entry) === 1
          ? '<span class="quote-item__fixed" aria-label="Quantity 1, only one available">1</span>'
          : qtyStepperHtml(entry.qty, entryMax(entry))) +
        "</div>" +
        '<button type="button" class="quote-item__remove" data-index="' + index + '" aria-label="Remove ' + esc(entry.item) + '">&times;</button>' +
        "</div>"
      );
    }).join("");

    html += '<div class="quote-panel__summary">' + summaryHtml(totals) + "</div>";

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

  /* The list travels with the visitor in localStorage, so the enquiry form
     picks it up on its own — we only need to get them to the form. */
  function goToEnquiryForm() {
    if (!getQuote().length) return;
    var form = document.getElementById("enquiryForm");
    if (form) {
      closeQuotePanel();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Your items are attached — just add your details");
      return;
    }
    window.location.href = "contact.html#enquiry";
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
      goToEnquiryForm();
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
          var priceEl = row.querySelector(".quote-item__price");
          if (priceEl) {
            var unit = parseFloat(priceEl.getAttribute("data-unit")) || entryPrice(list[idx]);
            if (unit > 0) {
              priceEl.setAttribute("data-unit", unit);
              priceEl.textContent = "$" + formatMoney(unit * val);
            }
          }
          var summary = panelBody && panelBody.querySelector(".quote-panel__summary");
          if (summary) summary.innerHTML = summaryHtml(quoteTotals(list));
        }
      }
      return;
    }

    var btn = e.target.closest(".add-quote");
    if (!btn) return;

    var item = btn.getAttribute("data-item");
    var card = btn.closest(".product");
    var option = card ? card.getAttribute("data-option") : null;
    if (option) item += " (" + option + ")";
    var qtyInput = card ? card.querySelector(".quote-qty") : null;
    var stepper = qtyInput ? qtyInput.closest(".qty-stepper") : null;
    var qty = readQty(qtyInput);
    if (stepper) syncStepper(stepper, qty);

    var max = stepper ? parseInt(stepper.getAttribute("data-max"), 10) || 0 : 0;
    if (!max && window.RUMI && window.RUMI.maxQtyForItem) max = window.RUMI.maxQtyForItem(item);

    var price = parseFloat(btn.getAttribute("data-price"));
    if (!(price > 0) && window.RUMI && window.RUMI.priceForItem) {
      price = window.RUMI.priceForItem(item) || 0;
    }

    var list = getQuote();
    var existing = list.find(function (entry) {
      return entry.item === item;
    });

    if (existing) {
      existing.qty = qty;
      if (max > 0) existing.max = max;
      if (price > 0) existing.price = price;
      saveQuote(list);
      showToast("Updated \u201c" + item + "\u201d to qty " + qty);
      return;
    }

    var entry = { item: item, qty: qty };
    if (max > 0) entry.max = max;
    if (price > 0) entry.price = price;
    list.push(entry);
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

  /* ---------- enquiry form ---------- */
  var form = document.getElementById("enquiryForm");
  if (form) {
    var statusEl = document.getElementById("formStatus");
    var fallbackBtn = document.getElementById("formFallback");
    var submitBtn = form.querySelector('button[type="submit"]');

    var get = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    var hint = document.getElementById("formHint");
    if (hint && FORM_ACCESS_KEY) {
      hint.textContent =
        "Sent straight to our team — no email app needed. Anything in your quote list comes with it.";
    }

    function setStatus(msg, kind) {
      if (!statusEl) return;
      statusEl.textContent = msg || "";
      statusEl.className = "form-status" + (kind ? " form-status--" + kind : "");
      statusEl.style.display = msg ? "block" : "none";
    }

    function enquiryDetails() {
      var lines = [
        "Name: " + get("name"),
        "Email: " + (get("email") || "not given"),
        "Phone: " + (get("phone") || "not given"),
        "Hire start date: " + (get("hireStart") || "TBC"),
        "Hire end date: " + (get("hireEnd") || "TBC"),
        "Event type: " + (get("type") || "-"),
        "Venue / location: " + (get("location") || "TBC")
      ];
      var extra = get("extra");
      if (extra) lines.push("", "Anything else:", extra);

      var items = getQuote();
      if (items.length) {
        lines.push("", "Quote list:");
        items.forEach(function (entry) {
          lines.push(formatQuoteLine(entry));
        });
        var hire = quoteTotals(items).hire;
        if (hire > 0) {
          lines.push("", "Hire total: $" + formatMoney(hire));
          lines.push("(Pickup/delivery quoted separately once venue is confirmed)");
        }
      } else {
        lines.push("", "Quote list: nothing selected");
      }
      return lines;
    }

    function sendByMailApp() {
      var body = ["Hi Rumi Hires,", ""]
        .concat(enquiryDetails(), ["", "Thanks!"])
        .join("\n");
      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent("Event enquiry — " + (get("name") || "new enquiry")) +
        "&body=" + encodeURIComponent(body);
    }

    function showSuccess(replyTo) {
      localStorage.removeItem(QUOTE_KEY);
      updateQuoteBar();
      renderQuotePanel();
      var card = form.closest(".form-card") || form.parentNode;
      card.innerHTML =
        '<div class="form-success">' +
        "<h2>thank you — we've got it</h2>" +
        "<p>Your enquiry has been sent to our team" +
        (replyTo ? " and we'll reply to " + esc(replyTo) : "") +
        ". We aim to come back to you within one business day.</p>" +
        '<p class="form-success__next">In the meantime, feel free to ' +
        '<a href="items.html">keep browsing the collection</a>.</p>' +
        "</div>";
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (fallbackBtn) {
      fallbackBtn.addEventListener("click", function () {
        sendByMailApp();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Honeypot: bots fill every field they find, people never see this one. */
      if (get("company")) {
        showSuccess("");
        return;
      }

      var email = get("email");
      var phone = get("phone");
      if (!email && !phone) {
        setStatus("Please leave either an email address or a phone number so we can get back to you.", "error");
        var emailEl = document.getElementById("email");
        if (emailEl) emailEl.focus();
        return;
      }

      var hireStart = get("hireStart");
      var hireEnd = get("hireEnd");
      if (hireStart && hireEnd && hireEnd < hireStart) {
        setStatus("Hire end date needs to be on or after the start date.", "error");
        var endEl = document.getElementById("hireEnd");
        if (endEl) endEl.focus();
        return;
      }

      if (!FORM_ACCESS_KEY) {
        sendByMailApp();
        showToast("Opening your email app…");
        return;
      }

      setStatus("");
      if (fallbackBtn) fallbackBtn.style.display = "none";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "sending…";
      }

      var payload = {
        access_key: FORM_ACCESS_KEY,
        subject: "Event enquiry — " + (get("name") || "new enquiry"),
        from_name: "Rumi Hires website",
        name: get("name"),
        phone: phone || "not given",
        message: enquiryDetails().join("\n")
      };
      if (email) {
        payload.email = email;
        payload.replyto = email;
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          if (!data || !data.success) throw new Error("rejected");
          showSuccess(email);
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "send enquiry";
          }
          setStatus("Sorry, that didn't send. Please check your connection and try again — or use the button below to send it by email instead.", "error");
          if (fallbackBtn) fallbackBtn.style.display = "inline-block";
        });
    });
  }
})();
