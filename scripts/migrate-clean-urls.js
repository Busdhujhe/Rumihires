/* One-shot: move *.html pages into folder/index.html and leave redirect stubs. */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const ROOT_PAGES = [
  "contact",
  "items",
  "moments",
  "privacy",
  "terms",
  "catalogue",
  "product"
];

function redirectHtml(targetPath) {
  const abs = "https://rumihires.com" + targetPath;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redirecting…</title>
  <link rel="canonical" href="${abs}" />
  <meta http-equiv="refresh" content="0; url=${targetPath}" />
  <script>location.replace(${JSON.stringify(targetPath)});</script>
</head>
<body>
  <p>This page has moved. <a href="${targetPath}">Continue</a>.</p>
</body>
</html>
`;
}

function cleanLinks(html) {
  let out = html;

  // Canonical / og URLs
  out = out.replace(
    /https:\/\/rumihires\.com\/([a-z0-9-]+)\.html/gi,
    "https://rumihires.com/$1/"
  );
  out = out.replace(
    /https:\/\/rumihires\.com\/hire\/([a-z0-9-]+)\.html/gi,
    "https://rumihires.com/hire/$1/"
  );

  // Root pages (href/src/action) — keep query + hash
  const pages = [
    "contact",
    "items",
    "moments",
    "privacy",
    "terms",
    "catalogue",
    "product",
    "prints"
  ];
  pages.forEach(function (name) {
    const re = new RegExp(
      "(href|content)=([\"'])" + name + "\\.html([?#][^\"']*)?\\2",
      "gi"
    );
    out = out.replace(re, function (_, attr, q, suffix) {
      return attr + "=" + q + "/" + name + "/" + (suffix || "") + q;
    });
  });

  // Home links
  out = out.replace(/href=(["'])index\.html#/gi, "href=$1/#");
  out = out.replace(/href=(["'])index\.html\1/gi, "href=$1/$1");

  // Hire product links
  out = out.replace(
    /href=(["'])hire\/([a-z0-9-]+)\.html([?#][^"']*)?\1/gi,
    "href=$1/hire/$2/$3$1"
  );

  // Asset + script paths → site-root absolute (safe from /page/ and /hire/slug/)
  out = out.replace(
    /(href|src)=(["'])(css\/|js\/|assets\/|favicon|apple-touch-icon)/gi,
    "$1=$2/$3"
  );

  // Drop hire <base href="../"> — absolute paths replace it
  out = out.replace(/\n?\s*<base href="\.\.\/"\s*\/>\s*/gi, "\n");

  return out;
}

function migrateRootPage(name) {
  const src = path.join(root, name + ".html");
  if (!fs.existsSync(src)) {
    console.log("skip missing", name + ".html");
    return;
  }
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, "index.html");
  const html = cleanLinks(fs.readFileSync(src, "utf8"));
  fs.writeFileSync(dest, html, "utf8");
  fs.writeFileSync(src, redirectHtml("/" + name + "/"), "utf8");
  console.log("migrated", name + ".html", "→", name + "/index.html");
}

function migrateIndex() {
  const src = path.join(root, "index.html");
  const html = cleanLinks(fs.readFileSync(src, "utf8"));
  fs.writeFileSync(src, html, "utf8");
  console.log("updated links in index.html");
}

function migrateHirePages() {
  const hireDir = path.join(root, "hire");
  const files = fs.readdirSync(hireDir).filter(function (f) {
    return f.endsWith(".html") && !f.includes(path.sep);
  });
  files.forEach(function (file) {
    const slug = file.replace(/\.html$/i, "");
    const src = path.join(hireDir, file);
    // Skip if this is already a redirect stub pointing at a folder we made
    // (re-run safety): only migrate real pages that aren't tiny redirects
    const raw = fs.readFileSync(src, "utf8");
    if (raw.includes("This page has moved") && raw.length < 800) {
      console.log("skip redirect stub", file);
      return;
    }
    const dir = path.join(hireDir, slug);
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, "index.html");
    fs.writeFileSync(dest, cleanLinks(raw), "utf8");
    fs.writeFileSync(src, redirectHtml("/hire/" + slug + "/"), "utf8");
    console.log("migrated hire/" + file, "→ hire/" + slug + "/index.html");
  });
}

migrateIndex();
ROOT_PAGES.forEach(migrateRootPage);

// Local-only prints page if present
if (fs.existsSync(path.join(root, "prints.html"))) {
  migrateRootPage("prints");
}

migrateHirePages();
console.log("done");
