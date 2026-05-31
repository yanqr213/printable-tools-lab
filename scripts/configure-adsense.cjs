const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "site-config.js");
const adsTxtPath = path.join(root, "ads.txt");
const args = parseArgs(process.argv.slice(2));

const existing = readConfig();
const publisherInput = args.publisher || process.env.ADSENSE_PUBLISHER_ID || existing.adsenseClientId || "";
const disabled = args.disable === true || String(process.env.ADSENSE_DISABLE || "").toLowerCase() === "true";
const normalized = publisherInput && !disabled ? normalizePublisher(publisherInput) : null;

if (publisherInput && !disabled && !normalized) {
  throw new Error("Invalid AdSense publisher ID. Expected ca-pub-1234567890123456 or pub-1234567890123456.");
}

const toolSlot = args["tool-slot"] || process.env.ADSENSE_TOOL_SLOT || existing.adsenseToolSlot || "";
const contentSlot = args["content-slot"] || process.env.ADSENSE_CONTENT_SLOT || existing.adsenseContentSlot || "";
const analyticsId = args.analytics || process.env.GOOGLE_ANALYTICS_ID || existing.googleAnalyticsId || "";
const contactEmail = args.contact || process.env.PUBLIC_CONTACT_EMAIL || existing.contactEmail || "";

if (toolSlot && !/^\d{4,30}$/.test(toolSlot)) throw new Error("Invalid tool ad slot. Expected numeric AdSense ad slot ID.");
if (contentSlot && !/^\d{4,30}$/.test(contentSlot)) throw new Error("Invalid content ad slot. Expected numeric AdSense ad slot ID.");

const next = {
  siteUrl: args["site-url"] || process.env.PUBLIC_SITE_URL || existing.siteUrl || "https://printable-tools-lab.pages.dev",
  googleSiteVerification: existing.googleSiteVerification || "",
  googleAnalyticsId: analyticsId,
  adsenseClientId: normalized ? normalized.clientId : "",
  adsenseToolSlot: normalized ? toolSlot : "",
  adsenseContentSlot: normalized ? contentSlot : "",
  contactEmail,
  enableAds: Boolean(normalized),
  enableAnalytics: Boolean(analyticsId),
};

writeConfig(next);
if (normalized) {
  fs.writeFileSync(adsTxtPath, `google.com, ${normalized.publisherId}, DIRECT, f08c47fec0942fa0\n`);
  console.log(`AdSense enabled for ${normalized.clientId}. ads.txt written.`);
  if (!toolSlot || !contentSlot) {
    console.log("No manual ad slot IDs were provided. The site will load AdSense script for review/auto ads, but fixed ad units remain placeholders until slots are set.");
  }
} else {
  fs.writeFileSync(adsTxtPath, "# No authorized advertising sellers configured yet.\n");
  console.log("AdSense disabled. site-config.js keeps ads off.");
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "disable") {
      parsed.disable = true;
    } else {
      parsed[key] = argv[i + 1] || "";
      i += 1;
    }
  }
  return parsed;
}

function normalizePublisher(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(?:ca-)?pub-(\d{10,30})$/);
  if (!match) return null;
  return {
    clientId: `ca-pub-${match[1]}`,
    publisherId: `pub-${match[1]}`,
  };
}

function readConfig() {
  if (!fs.existsSync(configPath)) return {};
  const source = fs.readFileSync(configPath, "utf8");
  return {
    siteUrl: readString(source, "siteUrl"),
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
    `  googleSiteVerification: ${JSON.stringify(config.googleSiteVerification)},`,
    `  googleAnalyticsId: ${JSON.stringify(config.googleAnalyticsId)},`,
    `  adsenseClientId: ${JSON.stringify(config.adsenseClientId)},`,
    `  adsenseToolSlot: ${JSON.stringify(config.adsenseToolSlot)},`,
    `  adsenseContentSlot: ${JSON.stringify(config.adsenseContentSlot)},`,
    `  contactEmail: ${JSON.stringify(config.contactEmail)},`,
    `  enableAds: ${config.enableAds ? "true" : "false"},`,
    `  enableAnalytics: ${config.enableAnalytics ? "true" : "false"}`,
    "};",
    "",
  ].join("\n");
  fs.writeFileSync(configPath, body);
}
