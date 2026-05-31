const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { routes, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const keyFile = path.join(root, "indexnow-key.txt");
let key = process.env.INDEXNOW_KEY || "";

if (!key && fs.existsSync(keyFile)) key = fs.readFileSync(keyFile, "utf8").trim();
if (!key) {
  key = crypto.randomBytes(16).toString("hex");
  fs.writeFileSync(keyFile, `${key}\n`);
}

const keyFileName = `${key}.txt`;
const keyFilePath = path.join(root, keyFileName);
if (!fs.existsSync(keyFilePath) || fs.readFileSync(keyFilePath, "utf8").trim() !== key) {
  fs.writeFileSync(keyFilePath, `${key}\n`);
}

const keyLocation = `${siteUrl("").replace(/\/+$/, "")}/${keyFileName}`;
const urls = routes
  .filter((route) => route.index !== false)
  .map((route) => siteUrl(route.path));

async function main() {
  const payload = {
    host: new URL(siteUrl("")).host,
    key,
    keyLocation,
    urlList: urls,
  };
  const response = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok && response.status !== 202) {
    console.warn(`IndexNow skipped with ${response.status}: ${text}`);
    console.warn(`Key URL checked: ${keyLocation}`);
    console.warn("This does not block Google indexing; Search Console sitemap submission is the primary indexing path.");
    return;
  }
  console.log(`IndexNow submitted ${urls.length} URLs with status ${response.status}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
