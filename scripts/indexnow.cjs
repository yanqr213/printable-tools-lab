const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { routes, siteUrl, landingPages, tools } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reports = path.join(root, "reports");
const keyFile = path.join(root, "indexnow-key.txt");
const githubPagesBase = (process.env.GITHUB_PAGES_DISCOVERY_URL || "https://yanqr213.github.io/printable-tools-lab").replace(/\/+$/, "");
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

const mainUrls = routes
  .filter((route) => route.index !== false)
  .map((route) => siteUrl(route.path));
const priorityMainUrls = [
  siteUrl(""),
  siteUrl("tools"),
  siteUrl("free-pdf-tools"),
  siteUrl("share-kit"),
  siteUrl("sponsor-starter-review"),
  siteUrl("sponsor-call"),
  siteUrl("sponsor-deal-room"),
  siteUrl("invoice-followup-copy-pack"),
  siteUrl("upload-error-cheatsheet"),
  siteUrl("upload-limit-fix-plan"),
  siteUrl("image-dimensions-600x600"),
  siteUrl("pdf-not-accepted-jpg-required"),
  siteUrl("email-attachment-too-large"),
  siteUrl("pdf-must-be-under-100kb"),
  siteUrl("pdf-must-be-under-200kb"),
  siteUrl("pdf-must-be-under-300kb"),
  siteUrl("pdf-must-be-under-10mb"),
  siteUrl("compress-pdf-to-100kb"),
  siteUrl("compress-pdf-to-200kb"),
  siteUrl("compress-pdf-to-300kb"),
  siteUrl("compress-pdf-to-10mb"),
  siteUrl("tools/invoice-followup-email"),
  siteUrl("overdue-invoice-reminder-email"),
  siteUrl("polite-payment-reminder-email"),
  siteUrl("freelance-invoice-follow-up-email"),
  siteUrl("compress-pdf-to-500kb"),
  siteUrl("compress-pdf-to-1mb"),
  siteUrl("compress-image-to-100kb"),
  siteUrl("tools/image-to-pdf"),
  siteUrl("tools/compress-image"),
  siteUrl("tools/qr-code"),
].filter(unique);
const githubPagesUrls = [
  `${githubPagesBase}/`,
  `${githubPagesBase}/sponsor-starter-review/`,
  `${githubPagesBase}/sponsor-call/`,
  `${githubPagesBase}/sponsor-deal-room/`,
  ...landingPages.map((page) => `${githubPagesBase}/${page.path}/`),
  ...tools.map((tool) => `${githubPagesBase}/${tool.path}/`),
].filter(unique);
const githubPagesSitemapUrls = readGithubPagesSitemapUrls();

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  const targets = [
    {
      label: "pages.dev",
      host: new URL(siteUrl("")).host,
      keyLocation: `${siteUrl("").replace(/\/+$/, "")}/${keyFileName}`,
      urls: mainUrls,
      priorityUrls: priorityMainUrls,
    },
    {
      label: "github-pages",
      host: new URL(githubPagesBase).host,
      keyLocation: `${githubPagesBase}/${keyFileName}`,
      urls: githubPagesSitemapUrls.length ? githubPagesSitemapUrls : githubPagesUrls,
      priorityUrls: (githubPagesSitemapUrls.length ? githubPagesSitemapUrls : githubPagesUrls).slice(0, 30),
    },
  ];

  const results = [];
  for (const target of targets) {
    results.push(await submitTarget(target));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    keyFile: keyFileName,
    results,
    acceptedTargets: results.filter((result) => result.accepted).map((result) => result.label),
  };
  fs.mkdirSync(reports, { recursive: true });
  fs.writeFileSync(path.join(reports, "indexnow-report.json"), `${JSON.stringify(report, null, 2)}\n`);

  for (const result of results) {
    if (result.accepted) {
      console.log(`IndexNow accepted ${result.submittedUrls} URL(s) for ${result.label}.`);
    } else {
      console.warn(`IndexNow did not accept ${result.label}: ${result.status || 0} ${result.message}`);
    }
  }
  if (!report.acceptedTargets.length) {
    console.warn("IndexNow accepted no targets. Google Search Console sitemap submission remains the primary discovery channel.");
  }
}

async function submitTarget(target) {
  const keyCheck = await checkKeyLocation(target.keyLocation);
  const result = {
    label: target.label,
    host: target.host,
    keyLocation: target.keyLocation,
    keyReachable: keyCheck.ok,
    keyStatus: keyCheck.status,
    keyMessage: keyCheck.message,
    urlCount: target.urls.length,
    submittedUrls: 0,
    accepted: false,
    status: 0,
    message: "",
    fallbackAccepted: 0,
    fallbackFailed: 0,
  };
  if (!keyCheck.ok) {
    result.message = `key file not reachable or mismatched: ${keyCheck.message}`;
    return result;
  }

  const payload = {
    host: target.host,
    key,
    keyLocation: target.keyLocation,
    urlList: target.urls,
  };
  const response = await postIndexNow(payload);
  result.status = response.status;
  result.message = response.text;
  if (response.ok) {
    result.accepted = true;
    result.submittedUrls = target.urls.length;
    return result;
  }

  const fallback = await submitPriorityUrls(target.priorityUrls, target.keyLocation);
  result.fallbackAccepted = fallback.accepted;
  result.fallbackFailed = fallback.failed;
  result.accepted = fallback.accepted > 0;
  result.submittedUrls = fallback.accepted;
  return result;
}

async function checkKeyLocation(keyLocation) {
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

async function postIndexNow(payload) {
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    return { ok: response.ok || response.status === 202, status: response.status, text: text.slice(0, 500) };
  } catch (error) {
    return { ok: false, status: 0, text: error.message };
  }
}

async function submitPriorityUrls(urls, keyLocation) {
  let accepted = 0;
  let failed = 0;
  for (const url of urls) {
    const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}&keyLocation=${encodeURIComponent(keyLocation)}`;
    try {
      const response = await fetch(endpoint, { method: "GET" });
      if (response.ok || response.status === 202) accepted += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
  return { accepted, failed };
}

function unique(value, index, list) {
  return list.indexOf(value) === index;
}

function readGithubPagesSitemapUrls() {
  const sitemapFile = path.join(root, "docs", "sitemap.xml");
  if (!fs.existsSync(sitemapFile)) return [];
  const sitemap = fs.readFileSync(sitemapFile, "utf8");
  const base = `${githubPagesBase}/`;
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(base))
    .filter(unique);
}
