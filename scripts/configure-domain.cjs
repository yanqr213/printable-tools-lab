const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "site-config.js");
const args = parseArgs(process.argv.slice(2));
const domain = normalizeDomain(args.domain || process.env.CUSTOM_DOMAIN || "");
const accountId = args.account || process.env.CLOUDFLARE_ACCOUNT_ID || "";
const projectName = args.project || process.env.CLOUDFLARE_PAGES_PROJECT || "printable-tools-lab";
const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN || "";

if (!domain) {
  throw new Error("Provide a custom domain with --domain example.com or CUSTOM_DOMAIN=example.com.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

async function main() {
  if (cloudflareToken && accountId) {
    await attachCloudflarePagesDomain({ accountId, projectName, domain, token: cloudflareToken });
  } else {
    console.log("Cloudflare API credentials not provided; updating local site-config.js only.");
    console.log("Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID to attach the domain automatically.");
  }

  const existing = readConfig();
  writeConfig({
    ...existing,
    siteUrl: `https://${domain}`,
  });

  console.log(`Custom domain configured in site-config.js: https://${domain}`);
  console.log("Next: run npm.cmd run build:routes, deploy Cloudflare Pages, then submit the new sitemap in Search Console.");
}

async function attachCloudflarePagesDomain({ accountId, projectName, domain, token }) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const zonesUrl = `https://api.cloudflare.com/client/v4/zones?account.id=${encodeURIComponent(accountId)}&name=${encodeURIComponent(rootDomain(domain))}&per_page=1`;
  const zones = await cloudflare(zonesUrl, { headers });
  if (!zones.result || !zones.result.length) {
    throw new Error(`Cloudflare account has no zone for ${rootDomain(domain)}. Add/buy the domain in Cloudflare first, then rerun configure:domain.`);
  }

  const domainsUrl = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(projectName)}/domains`;
  const current = await cloudflare(domainsUrl, { headers });
  const existing = Array.isArray(current.result) ? current.result.find((item) => item.name === domain) : null;
  if (existing) {
    console.log(`Cloudflare Pages domain already exists: ${domain} (${existing.status || "unknown status"})`);
    return;
  }

  const created = await cloudflare(domainsUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: domain }),
  });
  console.log(`Cloudflare Pages domain requested: ${created.result?.name || domain}`);
}

async function cloudflare(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const message = Array.isArray(payload.errors) && payload.errors.length
      ? payload.errors.map((error) => error.message || JSON.stringify(error)).join("; ")
      : `Cloudflare API returned ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function rootDomain(domain) {
  const parts = String(domain || "").split(".");
  return parts.slice(-2).join(".");
}

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
    sellerKitCheckoutUrl: readString(source, "sellerKitCheckoutUrl"),
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
    `  sellerKitCheckoutUrl: ${JSON.stringify(config.sellerKitCheckoutUrl || "")},`,
    `  contactEmail: ${JSON.stringify(config.contactEmail || "")},`,
    `  enableAds: ${config.enableAds ? "true" : "false"},`,
    `  enableAnalytics: ${config.enableAnalytics ? "true" : "false"}`,
    "};",
    "",
  ].join("\n");
  fs.writeFileSync(configPath, body);
}
