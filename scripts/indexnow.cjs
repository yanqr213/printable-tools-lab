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
const priorityUrls = [
  siteUrl(""),
  siteUrl("tools"),
  siteUrl("free-pdf-tools"),
  siteUrl("share-kit"),
  siteUrl("compress-pdf-to-500kb"),
  siteUrl("compress-pdf-to-1mb"),
  siteUrl("compress-pdf-to-2mb"),
  siteUrl("compress-pdf-to-5mb"),
  siteUrl("compress-image-to-50kb"),
  siteUrl("compress-image-to-100kb"),
  siteUrl("compress-image-to-200kb"),
  siteUrl("compress-image-to-500kb"),
  siteUrl("tools/image-to-pdf"),
  siteUrl("tools/multi-image-pdf"),
  siteUrl("tools/compress-image"),
  siteUrl("tools/resize-image"),
  siteUrl("tools/convert-image"),
  siteUrl("tools/crop-image"),
  siteUrl("tools/rotate-image"),
  siteUrl("tools/watermark-image"),
  siteUrl("tools/qr-code"),
  siteUrl("tools/wifi-qr-code"),
  siteUrl("tools/vcard-qr-code"),
  siteUrl("tools/text-to-pdf"),
  siteUrl("tools/invoice-generator"),
  siteUrl("tools/receipt-generator"),
  siteUrl("tools/timesheet-generator"),
  siteUrl("tools/resume-builder"),
  siteUrl("tools/certificate-generator"),
  siteUrl("tools/todo-list"),
  siteUrl("tools/graph-paper"),
].filter((url, index, list) => list.indexOf(url) === index);

async function main() {
  const keyCheck = await checkKeyLocation();
  if (!keyCheck.ok) {
    console.warn(`IndexNow key file is not reachable: ${keyCheck.status} ${keyCheck.message}`);
    console.warn(`Key URL checked: ${keyLocation}`);
    console.warn("This does not block Google indexing; Search Console sitemap submission is the primary indexing path.");
    return;
  }

  const payload = {
    host: new URL(siteUrl("")).host,
    key,
    keyLocation,
    urlList: urls,
  };
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok && response.status !== 202) {
    console.warn(`IndexNow batch POST failed with ${response.status}: ${text}`);
    console.warn("Tip: IndexNow can return 403 for pages.dev subdomains even when the key file is reachable. This is a non-Google discovery channel.");
    const fallback = await submitPriorityUrls();
    if (fallback.accepted) {
      console.log(`IndexNow fallback submitted ${fallback.accepted} priority URLs.`);
      if (fallback.failed) console.warn(`IndexNow fallback had ${fallback.failed} failed URL(s).`);
      return;
    }
    console.warn("IndexNow fallback did not accept any URLs. This does not block Google indexing; Search Console sitemap submission is the primary indexing path.");
    return;
  }
  console.log(`IndexNow submitted ${urls.length} URLs with status ${response.status}.`);
}

async function checkKeyLocation() {
  try {
    const response = await fetch(keyLocation, { cache: "no-store" });
    const text = await response.text();
    return {
      ok: response.ok && text.trim() === key,
      status: response.status,
      message: response.ok ? (text.trim() === key ? "ok" : "key mismatch") : text.slice(0, 160),
    };
  } catch (error) {
    return { ok: false, status: 0, message: error.message };
  }
}

async function submitPriorityUrls() {
  let accepted = 0;
  let failed = 0;
  for (const url of priorityUrls) {
    const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}`;
    try {
      const response = await fetch(endpoint, { method: "GET" });
      if (response.ok || response.status === 202) accepted += 1;
      else {
        failed += 1;
        console.warn(`IndexNow fallback failed ${response.status} for ${url}: ${(await response.text()).slice(0, 180)}`);
      }
    } catch {
      failed += 1;
    }
  }
  return { accepted, failed };
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
