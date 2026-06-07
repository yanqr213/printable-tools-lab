const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];

const publicFiles = [
  "app.js",
  "sponsor/index.html",
  "sponsor-starter-review/index.html",
  "sponsor-deal-room/index.html",
  "sponsor-call/index.html",
  "sponsor-opportunities/index.html",
  "sponsor-proposal/index.html",
  "sponsor-intent-feed.json",
  "sponsor-outreach-pack.json",
  "docs/sponsor-starter-review/index.html",
  "docs/sponsor-deal-room/index.html",
  "docs/sponsor-call/index.html",
  "docs/sponsor-opportunities/index.html",
];

for (const file of publicFiles) {
  const text = read(file);
  if (!text) {
    failures.push(`Missing sponsor close-path file: ${file}`);
    continue;
  }
  if (/partners@printable-tools-lab\.pages\.dev/i.test(text)) failures.push(`${file} contains an unverified sponsor fallback email.`);
  if (/Email fallback/i.test(text)) failures.push(`${file} contains an email fallback CTA.`);
  if (/mailto:partners@printable-tools-lab\.pages\.dev/i.test(text)) failures.push(`${file} contains a dead sponsor mailto link.`);
}

const app = read("app.js");
if (!app.includes("function renderSponsorLeadFallback")) failures.push("app.js missing sponsor lead fallback renderer.");
if (!app.includes("Open public-safe reply")) failures.push("app.js fallback missing public-safe reply CTA.");
if (!app.includes("Copy backup request")) failures.push("app.js fallback missing copyable backup request.");
if (app.includes("function sponsorLeadFallbackMailto")) failures.push("app.js still defines sponsorLeadFallbackMailto.");
if (app.includes('url.searchParams.set("template", "sponsor-partner-inquiry.yml")')) failures.push("app.js should not route sponsor fallback replies through a YAML issue form.");
if (!app.includes('url.searchParams.set("labels", "sponsor,partner,business-review")')) failures.push("app.js sponsor fallback should pre-label public sponsor reply issues.");

const sponsor = read("sponsor/index.html");
if (!sponsor.includes("github.com/yanqr213/printable-tools-lab/issues/new?")) failures.push("Sponsor page missing GitHub public-safe reply link.");
if (!sponsor.includes("body=Public-safe+sponsor+reply")) failures.push("Sponsor page public-safe reply link should prefill the issue body.");
if (!sponsor.includes("labels=sponsor%2Cpartner%2Cbusiness-review")) failures.push("Sponsor page public-safe reply link should pre-label sponsor issues.");
if (sponsor.includes("template=sponsor-partner-inquiry.yml")) failures.push("Sponsor page should not route public-safe replies through a YAML issue form.");
if (!sponsor.includes("Open public-safe reply")) failures.push("Sponsor page missing public-safe reply CTA.");
if (!sponsor.includes("Request pilot invoice review")) failures.push("Sponsor page missing fast invoice review CTA.");
if (!sponsor.includes("data-sponsor-quick-form")) failures.push("Sponsor page missing quick sponsor form.");

const issueTemplate = read(".github/ISSUE_TEMPLATE/sponsor-partner-inquiry.yml");
if (!issueTemplate.includes("Request pilot invoice review")) failures.push("GitHub issue template missing invoice review next step.");
if (!issueTemplate.includes("Do not include private payment")) failures.push("GitHub issue template missing public-safety warning.");
if (!issueTemplate.includes("sponsor-starter-review")) failures.push("GitHub issue template missing starter review path.");

const feed = safeJson(read("sponsor-intent-feed.json"));
if (!feed) failures.push("sponsor-intent-feed.json is not valid JSON.");
else {
  const feedText = JSON.stringify(feed);
  if (!String(feed.invoiceReviewUrl || "").includes("sponsor-starter-review")) failures.push("Sponsor intent feed missing invoice review URL.");
  if (/\/ops\/|\/dashboard\//.test(feedText)) failures.push("Sponsor intent feed exposes an internal route.");
  if (!String(feed.privacyBoundary || "").includes("No sponsor lead emails")) failures.push("Sponsor intent feed missing privacy boundary.");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Sponsor close-path verification passed.");

function read(file) {
  try {
    return fs.readFileSync(path.join(root, file), "utf8");
  } catch {
    return "";
  }
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
