const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "site-config.js");
const args = parseArgs(process.argv.slice(2));
const disable = args.disable === true || String(process.env.CHECKOUT_DISABLE || "").toLowerCase() === "true";
const sellerKitCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["seller-kit-url"]
    || args.url
    || process.env.PUBLIC_SELLER_KIT_CHECKOUT_URL
    || process.env.PUBLIC_CHECKOUT_URL
    || "",
  "seller kit checkout URL",
);
const serviceCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["service-url"]
    || process.env.PUBLIC_CUSTOM_PRINT_PACK_CHECKOUT_URL
    || process.env.PUBLIC_SERVICE_CHECKOUT_URL
    || "",
  "service checkout URL",
);
const customPrintPackCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["custom-print-pack-url"]
    || args["custom-local-print-pack-url"]
    || process.env.PUBLIC_CUSTOM_LOCAL_PRINT_PACK_CHECKOUT_URL
    || process.env.PUBLIC_CUSTOM_PRINT_PACK_CHECKOUT_URL
    || "",
  "custom print pack checkout URL",
);
const invoiceFollowupCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["invoice-followup-url"]
    || args["invoice-followup-copy-pack-url"]
    || process.env.PUBLIC_INVOICE_FOLLOWUP_CHECKOUT_URL
    || process.env.PUBLIC_INVOICE_FOLLOWUP_COPY_PACK_CHECKOUT_URL
    || "",
  "invoice follow-up checkout URL",
);
const uploadLimitFixPlanCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["upload-limit-fix-plan-url"]
    || args["upload-fix-plan-url"]
    || process.env.PUBLIC_UPLOAD_LIMIT_FIX_PLAN_CHECKOUT_URL
    || process.env.PUBLIC_UPLOAD_FIX_PLAN_CHECKOUT_URL
    || "",
  "upload limit fix plan checkout URL",
);
const auditUpgradeCheckoutUrl = disable ? "" : normalizeCheckoutUrl(
  args["audit-upgrade-url"]
    || process.env.PUBLIC_AUDIT_UPGRADE_CHECKOUT_URL
    || customPrintPackCheckoutUrl
    || serviceCheckoutUrl
    || "",
  "audit upgrade checkout URL",
);

if (!disable && !sellerKitCheckoutUrl && !serviceCheckoutUrl && !customPrintPackCheckoutUrl && !invoiceFollowupCheckoutUrl && !uploadLimitFixPlanCheckoutUrl && !auditUpgradeCheckoutUrl) {
  throw new Error("Provide --seller-kit-url, --service-url, --custom-print-pack-url, --invoice-followup-url, --upload-limit-fix-plan-url, --audit-upgrade-url, or the matching PUBLIC_* checkout URL.");
}

const existing = readConfig();
writeConfig({
  ...existing,
  sellerKitCheckoutUrl: disable || sellerKitCheckoutUrl ? sellerKitCheckoutUrl : existing.sellerKitCheckoutUrl,
  serviceCheckoutUrl: disable || serviceCheckoutUrl ? serviceCheckoutUrl : existing.serviceCheckoutUrl,
  customPrintPackCheckoutUrl: disable || customPrintPackCheckoutUrl ? customPrintPackCheckoutUrl : existing.customPrintPackCheckoutUrl,
  invoiceFollowupCheckoutUrl: disable || invoiceFollowupCheckoutUrl ? invoiceFollowupCheckoutUrl : existing.invoiceFollowupCheckoutUrl,
  uploadLimitFixPlanCheckoutUrl: disable || uploadLimitFixPlanCheckoutUrl ? uploadLimitFixPlanCheckoutUrl : existing.uploadLimitFixPlanCheckoutUrl,
  auditUpgradeCheckoutUrl: disable || auditUpgradeCheckoutUrl ? auditUpgradeCheckoutUrl : existing.auditUpgradeCheckoutUrl,
});

console.log(sellerKitCheckoutUrl ? "Seller kit checkout URL configured." : "Seller kit checkout disabled.");
console.log(serviceCheckoutUrl ? "Service checkout URL configured." : "Service checkout disabled.");
console.log(customPrintPackCheckoutUrl ? "Custom print pack checkout URL configured." : "Custom print pack checkout disabled.");
console.log(invoiceFollowupCheckoutUrl ? "Invoice follow-up checkout URL configured." : "Invoice follow-up checkout disabled.");
console.log(uploadLimitFixPlanCheckoutUrl ? "Upload limit fix plan checkout URL configured." : "Upload limit fix plan checkout disabled.");
console.log(auditUpgradeCheckoutUrl ? "Audit upgrade checkout URL configured." : "Audit upgrade checkout disabled.");
console.log("Next: run npm.cmd run build:routes, verify, commit, and deploy.");

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) parsed[key] = true;
    else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function normalizeCheckoutUrl(value, label = "checkout URL") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${label} must be a valid https URL.`);
  }
  if (url.protocol !== "https:") throw new Error(`${label} must use https.`);
  if (!url.hostname.includes(".")) throw new Error(`${label} hostname looks invalid.`);
  if (url.hostname.endsWith("pages.dev") || url.hostname.endsWith("github.io")) {
    throw new Error(`${label} should point to a real payment provider, not the free site itself.`);
  }
  return url.toString();
}

function readConfig() {
  const source = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  return {
    siteUrl: readString(source, "siteUrl") || "https://printable-tools-lab.pages.dev",
    googleSiteVerification: readString(source, "googleSiteVerification"),
    googleAnalyticsId: readString(source, "googleAnalyticsId"),
    adsenseClientId: readString(source, "adsenseClientId"),
    adsenseToolSlot: readString(source, "adsenseToolSlot"),
    adsenseContentSlot: readString(source, "adsenseContentSlot"),
    sellerKitCheckoutUrl: readString(source, "sellerKitCheckoutUrl"),
    customPrintPackCheckoutUrl: readString(source, "customPrintPackCheckoutUrl"),
    invoiceFollowupCheckoutUrl: readString(source, "invoiceFollowupCheckoutUrl"),
    uploadLimitFixPlanCheckoutUrl: readString(source, "uploadLimitFixPlanCheckoutUrl"),
    serviceCheckoutUrl: readString(source, "serviceCheckoutUrl"),
    auditUpgradeCheckoutUrl: readString(source, "auditUpgradeCheckoutUrl"),
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
    `  siteUrl: ${JSON.stringify(config.siteUrl || "https://printable-tools-lab.pages.dev")},`,
    `  googleSiteVerification: ${JSON.stringify(config.googleSiteVerification || "")},`,
    `  googleAnalyticsId: ${JSON.stringify(config.googleAnalyticsId || "")},`,
    `  adsenseClientId: ${JSON.stringify(config.adsenseClientId || "")},`,
    `  adsenseToolSlot: ${JSON.stringify(config.adsenseToolSlot || "")},`,
    `  adsenseContentSlot: ${JSON.stringify(config.adsenseContentSlot || "")},`,
    `  sellerKitCheckoutUrl: ${JSON.stringify(config.sellerKitCheckoutUrl || "")},`,
    `  customPrintPackCheckoutUrl: ${JSON.stringify(config.customPrintPackCheckoutUrl || "")},`,
    `  invoiceFollowupCheckoutUrl: ${JSON.stringify(config.invoiceFollowupCheckoutUrl || "")},`,
    `  uploadLimitFixPlanCheckoutUrl: ${JSON.stringify(config.uploadLimitFixPlanCheckoutUrl || "")},`,
    `  serviceCheckoutUrl: ${JSON.stringify(config.serviceCheckoutUrl || "")},`,
    `  auditUpgradeCheckoutUrl: ${JSON.stringify(config.auditUpgradeCheckoutUrl || "")},`,
    `  contactEmail: ${JSON.stringify(config.contactEmail || "")},`,
    `  enableAds: ${config.enableAds ? "true" : "false"},`,
    `  enableAnalytics: ${config.enableAnalytics ? "true" : "false"}`,
    "};",
    "",
  ].join("\n");
  fs.writeFileSync(configPath, body);
}
