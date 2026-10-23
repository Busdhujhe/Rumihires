/* Lightweight ads/analytics notice — links to /privacy/ */
(function () {
  "use strict";

  var KEY = "rumi-privacy-notice-dismissed";
  try {
    if (window.localStorage && localStorage.getItem(KEY) === "1") return;
  } catch (e) {}

  var bar = document.createElement("div");
  bar.id = "rumiPrivacyNotice";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-label", "Privacy and cookies notice");
  bar.innerHTML =
    '<div class="rpn__inner">' +
    '<p>We use cookies and the Meta Pixel to measure site use and improve our ads. ' +
    '<a href="/privacy/">Read our privacy policy</a>.</p>' +
    '<button type="button" class="rpn__ok" id="rumiPrivacyOk">OK</button>' +
    "</div>";

  var style = document.createElement("style");
  style.textContent =
    "#rumiPrivacyNotice{position:fixed;left:0;right:0;bottom:0;z-index:300;" +
    "background:#111;color:#f2f2f2;padding:0.85rem 1rem;box-shadow:0 -8px 28px rgba(0,0,0,.25);" +
    "font-family:Jost,Segoe UI,sans-serif;font-size:0.88rem;line-height:1.45}" +
    "#rumiPrivacyNotice .rpn__inner{max-width:1180px;margin:0 auto;display:flex;gap:1rem;" +
    "align-items:center;justify-content:space-between;flex-wrap:wrap}" +
    "#rumiPrivacyNotice p{margin:0;flex:1 1 16rem;color:#e8e8e8}" +
    "#rumiPrivacyNotice a{color:#99d6ee;text-decoration:underline}" +
    "#rumiPrivacyNotice .rpn__ok{appearance:none;border:1px solid rgba(255,255,255,.35);" +
    "background:transparent;color:#fff;padding:0.55rem 1.15rem;letter-spacing:.08em;" +
    "text-transform:uppercase;font-size:0.68rem;cursor:pointer;min-height:40px}" +
    "#rumiPrivacyNotice .rpn__ok:hover{background:rgba(255,255,255,.08)}" +
    "@media (max-width:640px){#rumiPrivacyNotice .rpn__ok{width:100%}}";

  function dismiss() {
    try {
      if (window.localStorage) localStorage.setItem(KEY, "1");
    } catch (err) {}
    if (bar.parentNode) bar.parentNode.removeChild(bar);
    if (style.parentNode) style.parentNode.removeChild(style);
  }

  document.head.appendChild(style);
  document.body.appendChild(bar);
  document.getElementById("rumiPrivacyOk").addEventListener("click", dismiss);
})();
