const fs = require("fs");
const crypto = require("crypto");
const { routes, siteUrl } = require("./seo-content.cjs");

const SITE_URL = withTrailingSlash(process.env.SEARCH_CONSOLE_SITE_URL || "https://printable-tools-lab.pages.dev/");
const SITEMAP_URL = normalizeSitemapUrl(process.env.SITEMAP_URL || "https://printable-tools-lab.pages.dev/sitemap.xml");
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.argv[3];
const COMMAND = process.argv[2] || "status";
const SCOPE = "https://www.googleapis.com/auth/webmasters";

if (!KEY_FILE) {
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS or pass the service account JSON path as the last argument.");
  process.exit(1);
}

async function main() {
  const token = await getAccessToken(KEY_FILE, SCOPE);
  if (COMMAND === "sites") return listSites(token);
  if (COMMAND === "add-site") return addSite(token);
  if (COMMAND === "submit-sitemap") return submitSitemap(token);
  if (COMMAND === "sitemaps") return listSitemaps(token);
  if (COMMAND === "inspect") return inspectUrls(token);
  if (COMMAND === "performance") return queryPerformance(token);
  if (COMMAND === "status") {
    await listSites(token);
    await addSite(token);
    await submitSitemap(token);
    await listSitemaps(token);
    return;
  }
  throw new Error(`Unknown command: ${COMMAND}`);
}

async function addSite(token) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}`;
  await googleFetch(url, token, { method: "PUT" });
  console.log(`Added Search Console site: ${SITE_URL}`);
}

async function listSites(token) {
  const response = await googleFetch("https://www.googleapis.com/webmasters/v3/sites", token);
  console.log(JSON.stringify(response, null, 2));
  return response;
}

async function submitSitemap(token) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
  await googleFetch(url, token, { method: "PUT" });
  console.log(`Submitted sitemap: ${SITEMAP_URL}`);
}

async function listSitemaps(token) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps`;
  const response = await googleFetch(url, token);
  console.log(JSON.stringify(response, null, 2));
  return response;
}

async function inspectUrls(token) {
  const urls = routes
    .filter((route) => route.index !== false)
    .map((route) => siteUrl(route.path))
    .slice(0, Number(process.env.INSPECT_LIMIT || 10));
  for (const inspectionUrl of urls) {
    const body = {
      inspectionUrl,
      siteUrl: SITE_URL,
    };
    const response = await googleFetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = response.inspectionResult && response.inspectionResult.indexStatusResult;
    console.log(JSON.stringify({
      url: inspectionUrl,
      verdict: result && result.verdict,
      coverageState: result && result.coverageState,
      indexingState: result && result.indexingState,
      lastCrawlTime: result && result.lastCrawlTime,
    }, null, 2));
  }
}

async function queryPerformance(token) {
  const days = Number(process.env.SEARCH_DAYS || 28);
  const rowLimit = Number(process.env.SEARCH_ROW_LIMIT || 50);
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 1);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - days + 1);
  const body = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dimensions: ["query", "page"],
    rowLimit,
    startRow: 0,
  };
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const response = await googleFetch(url, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const rows = response.rows || [];
  console.log(JSON.stringify({
    siteUrl: SITE_URL,
    startDate: body.startDate,
    endDate: body.endDate,
    rowCount: rows.length,
    totals: summarizeSearchRows(rows),
    rows: rows.map((row) => ({
      query: row.keys && row.keys[0],
      page: row.keys && row.keys[1],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })),
  }, null, 2));
}

async function googleFetch(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google API ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function getAccessToken(keyFile, scope) {
  const credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key, "base64url");
  const assertion = `${unsigned}.${signature}`;
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function summarizeSearchRows(rows) {
  return rows.reduce((acc, row) => {
    acc.clicks += row.clicks || 0;
    acc.impressions += row.impressions || 0;
    return acc;
  }, { clicks: 0, impressions: 0 });
}

function withTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "") + "/";
}

function normalizeSitemapUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
