const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "site-config.js");
const args = parseArgs(process.argv.slice(2));
const domain = normalizeDomain(args.domain || process.env.CUSTOM_DOMAIN || "");

if (!domain) {
  throw new Error("Provide a custom domain with --domain example.com or CUSTOM_DOMAIN=example.com.");
}

const existing = readConfig();
writeConfig({
  ...existing,
  siteUrl: `https://${domain}`,
});

console.log(`Custom domain configured in site-config.js: https://${domain}`);
console.log("Next: attach the domain in Cloudflare Pages, then run npm.cmd run build:routes.");

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    parsed[arg.slice(2)] = argv[i + 1] || "";
    i += 1;
  }
  return parsed;
}

function normalizeDomain(value) {
  const raw = String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(raw)) return "";
  if (raw.endsWith(".pages.dev")) return "";
  return raw;
}

function readConfig() {
  if (!fs.existsSync(configPath)) return {};
  const source = fs.readFileSync(configPath, "utf8");
  return {
    siteUrl: readString(source, "siteUrl") || "https://printable-tools-lab.pages.dev",
    googleSiteVerification: readString(source, "googleSiteVerification"),
    googleAnalyticsId: readString(source, "googleAnalyticsId"),
    adsenseClientId: readString(source, "adsenseClientId"),
    adsenseToolSlot: readString(source, "adsenseToolSlot"),
    adsenseContentSlot: readString(source, "adsenseContentSlot"),
    contactEmail: readString(source, "contactEmail"),
    enableAds: readBool(source, "enableAds"),
    enableAnalytics: readBool(source, "enableAnalytics"),
  };
}

function readString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*"([^"]*)"`));
  return match ? match[1] : "";
}

function readBool(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*(true|false)`));
  return match ? match[1] === "true" : false;
}

function writeConfig(config) {
  const body = [
    "window.PTL_CONFIG = {",
    `  siteUrl: ${JSON.stringify(config.siteUrl)},`,
    `  googleSiteVerification: ${JSON.stringify(config.googleSiteVerification || "")},`,
    `  googleAnalyticsId: ${JSON.stringify(config.googleAnalyticsId || "")},`,
    `  adsenseClientId: ${JSON.stringify(config.adsenseClientId || "")},`,
    `  adsenseToolSlot: ${JSON.stringify(config.adsenseToolSlot || "")},`,
    `  adsenseContentSlot: ${JSON.stringify(config.adsenseContentSlot || "")},`,
    `  contactEmail: ${JSON.stringify(config.contactEmail || "")},`,
    `  enableAds: ${config.enableAds ? "true" : "false"},`,
    `  enableAnalytics: ${config.enableAnalytics ? "true" : "false"}`,
    "};",
    "",
  ].join("\n");
  fs.writeFileSync(configPath, body);
}
