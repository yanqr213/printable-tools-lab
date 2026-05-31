const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { routes, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const siteBase = (process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev").replace(/\/+$/, "");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "validation-report.json");
const validationPath = path.join(root, "VALIDATION.md");

async function main() {
  const local = readLocalState();
  const live = await readLiveState();
  const searchConsole = readSearchConsoleState();
  const gates = evaluateGates(local, live, searchConsole);
  const nextActions = buildNextActions(gates, local, live, searchConsole);
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: `${siteBase}/`,
    local,
    live,
    searchConsole,
    gates,
    nextActions,
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(validationPath, renderValidationMarkdown(report));
  printSummary(report);
}

function readLocalState() {
  const toolsJson = readJson("tools.json", {});
  const sitemap = readText("sitemap.xml");
  const robots = readText("robots.txt");
  const llms = readText("llms.txt");
  const adsTxt = readText("ads.txt").trim();
  const config = readText("site-config.js");
  const indexableRoutes = routes.filter((route) => route.index !== false).length;
  return {
    toolCount: Array.isArray(toolsJson.tools) ? toolsJson.tools.length : 0,
    guideCount: Array.isArray(toolsJson.guides) ? toolsJson.guides.length : 0,
    indexableRoutes,
    sitemapLocCount: countMatches(sitemap, /<loc>/g),
    generatedToolInventoryAt: toolsJson.generatedAt || null,
    discoveryAssets: {
      sitemap: Boolean(sitemap.includes("<urlset")),
      robots: Boolean(robots.includes("Sitemap:")),
      llms: Boolean(llms.includes("# PrintableTools Lab")),
      toolsJson: Array.isArray(toolsJson.tools),
      distributionPack: fs.existsSync(path.join(root, "DISTRIBUTION.md")),
    },
    ads: {
      enabled: readBool(config, "enableAds"),
      publisherConfigured: /^ca-pub-\d{10,30}$/.test(readString(config, "adsenseClientId")),
      toolSlotConfigured: /^\d{4,30}$/.test(readString(config, "adsenseToolSlot")),
      contentSlotConfigured: /^\d{4,30}$/.test(readString(config, "adsenseContentSlot")),
      adsTxtStatus: adsTxt.startsWith("google.com, pub-") ? "configured" : adsTxt ? "placeholder" : "missing",
    },
  };
}

async function readLiveState() {
  const paths = ["/", "/tools/", "/sitemap.xml", "/robots.txt", "/ads.txt", "/llms.txt", "/tools.json", "/api/metrics"];
  const checks = {};
  for (const pathname of paths) {
    checks[pathname] = await liveCheck(pathname);
  }
  const metrics = checks["/api/metrics"].json && checks["/api/metrics"].json.ok ? checks["/api/metrics"].json : null;
  return {
    checks,
    metrics: metrics ? {
      today: metrics.today,
      totals: metrics.totals || {},
      todayTotals: metrics.todayTotals || {},
      topTools: (metrics.tools || [])
        .slice()
        .sort((a, b) => (b.download_pdf || 0) - (a.download_pdf || 0) || (b.generate_pdf || 0) - (a.generate_pdf || 0))
        .slice(0, 8),
    } : null,
  };
}

async function liveCheck(pathname) {
  const url = `${siteBase}${pathname}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      contentType,
      bytes: Buffer.byteLength(text),
      json: contentType.includes("application/json") ? safeJson(text) : null,
      sample: contentType.includes("text/plain") ? text.slice(0, 180) : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      contentType: "",
      bytes: 0,
      error: error.message,
    };
  }
}

function readSearchConsoleState() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFile || !fs.existsSync(keyFile)) {
    return {
      available: false,
      reason: "GOOGLE_APPLICATION_CREDENTIALS is not set or the file is missing.",
    };
  }
  const state = {
    available: true,
    sitemaps: null,
    performance: null,
    inspected: [],
    errors: [],
  };
  const env = {
    ...process.env,
    GOOGLE_APPLICATION_CREDENTIALS: keyFile,
    SEARCH_CONSOLE_SITE_URL: `${siteBase}/`,
    SITEMAP_URL: `${siteBase}/sitemap.xml`,
  };
  const sitemapOutput = runSearchConsole(["sitemaps"], env);
  if (sitemapOutput.ok) state.sitemaps = parseJsonFromOutput(sitemapOutput.stdout);
  else state.errors.push(`sitemaps: ${sitemapOutput.error}`);

  const performanceOutput = runSearchConsole(["performance"], env);
  if (performanceOutput.ok) state.performance = parseJsonFromOutput(performanceOutput.stdout);
  else state.errors.push(`performance: ${performanceOutput.error}`);

  const inspectEnv = { ...env, INSPECT_LIMIT: "3" };
  const inspectOutput = runSearchConsole(["inspect"], inspectEnv);
  if (inspectOutput.ok) state.inspected = parseAllJsonObjects(inspectOutput.stdout);
  else state.errors.push(`inspect: ${inspectOutput.error}`);
  return state;
}

function runSearchConsole(args, env) {
  try {
    const stdout = execFileSync(process.execPath, [path.join(root, "scripts", "search-console.cjs"), ...args], {
      cwd: root,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 45000,
    });
    return { ok: true, stdout };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout ? String(error.stdout) : "",
      error: error.stderr ? String(error.stderr).trim() : error.message,
    };
  }
}

function evaluateGates(local, live, searchConsole) {
  const totals = live.metrics?.totals || {};
  const performanceTotals = searchConsole.performance?.totals || {};
  const sitemap = Array.isArray(searchConsole.sitemaps?.sitemap) ? searchConsole.sitemaps.sitemap[0] : null;
  const indexed = searchConsole.inspected.filter((item) => item.verdict === "PASS").length;
  const unknown = searchConsole.inspected.filter((item) => /unknown/i.test(item.coverageState || "")).length;
  const productReady = local.toolCount >= 20
    && local.guideCount >= 46
    && local.indexableRoutes >= 69
    && local.sitemapLocCount >= local.indexableRoutes
    && Object.values(local.discoveryAssets).every(Boolean)
    && live.checks["/"]?.ok
    && live.checks["/tools/"]?.ok
    && live.checks["/api/metrics"]?.ok;
  const searchVisible = (performanceTotals.impressions || 0) > 0 || indexed > 0;
  const adsenseApplyReady = productReady
    && local.ads.publisherConfigured
    && searchVisible
    && !local.ads.enabled;
  return {
    productReady: Boolean(productReady),
    adsenseAutomationReady: local.ads.adsTxtStatus === "placeholder" || local.ads.adsTxtStatus === "configured",
    adsenseApplyReady,
    adsEnabled: local.ads.enabled,
    searchVisible,
    continue30Day: (totals.download_pdf || 0) >= 100 || (totals.generate_pdf || 0) >= 300 || (performanceTotals.impressions || 0) > 0,
    pivot60Day: !searchVisible && (totals.download_pdf || 0) === 0 && (totals.generate_pdf || 0) === 0,
    review90Day: searchVisible && (totals.download_pdf || 0) > 0 && !local.ads.enabled,
    reasons: {
      productReady: productReady ? ["20 tools, 46 guides, sitemap, discovery assets, and live metrics are present."] : missingProductReasons(local, live),
      adsenseApplyReady: adsenseApplyReady ? ["Product is ready, Search Console has visibility, and a real publisher ID is configured."] : missingAdsenseReasons(local, searchConsole, searchVisible),
      searchConsole: summarizeSearchConsoleReasons(searchConsole, sitemap, unknown),
    },
  };
}

function missingProductReasons(local, live) {
  const reasons = [];
  if (local.toolCount < 20) reasons.push(`Only ${local.toolCount} tools found; target is 20 or more.`);
  if (local.guideCount < 46) reasons.push(`Only ${local.guideCount} guides found; target is 46 or more.`);
  if (local.sitemapLocCount < local.indexableRoutes) reasons.push("Sitemap has fewer URLs than the indexable route list.");
  for (const [name, ok] of Object.entries(local.discoveryAssets)) {
    if (!ok) reasons.push(`Missing discovery asset: ${name}.`);
  }
  for (const pathname of ["/", "/tools/", "/api/metrics"]) {
    if (!live.checks[pathname]?.ok) reasons.push(`Live check failed: ${pathname}.`);
  }
  return reasons;
}

function missingAdsenseReasons(local, searchConsole, searchVisible) {
  const reasons = [];
  if (!local.ads.publisherConfigured) reasons.push("Real AdSense publisher ID is not configured, so ads remain disabled.");
  if (local.ads.enabled) reasons.push("Ads are already enabled; use verify:adsense and monitor placement quality.");
  if (!searchConsole.available) reasons.push("Search Console API data was unavailable during this run.");
  if (!searchVisible) reasons.push("Search Console has no impressions/indexed sample yet, so applying now is premature.");
  return reasons;
}

function summarizeSearchConsoleReasons(searchConsole, sitemap, unknown) {
  if (!searchConsole.available) return [searchConsole.reason];
  const reasons = [];
  if (sitemap) {
    reasons.push(`Sitemap status: pending=${Boolean(sitemap.isPending)}, warnings=${sitemap.warnings || 0}, errors=${sitemap.errors || 0}.`);
  }
  if (searchConsole.performance) {
    reasons.push(`Search performance: ${searchConsole.performance.totals?.impressions || 0} impressions, ${searchConsole.performance.totals?.clicks || 0} clicks.`);
  }
  if (unknown) reasons.push(`${unknown} inspected sample URL(s) are still unknown to Google.`);
  if (searchConsole.errors.length) reasons.push(...searchConsole.errors);
  return reasons.length ? reasons : ["Search Console calls completed without notable warnings."];
}

function buildNextActions(gates, local, live, searchConsole) {
  const totals = live.metrics?.totals || {};
  const actions = [];
  if (!gates.productReady) actions.push("Fix product readiness failures before adding more tools.");
  if (!gates.searchVisible) actions.push("Create a small external discovery push using DISTRIBUTION.md; one useful directory/community post is more valuable than resubmitting the sitemap repeatedly.");
  if (!local.ads.publisherConfigured) actions.push("When AdSense provides the real ca-pub publisher ID, run configure:adsense; do not deploy fake IDs.");
  if (local.ads.publisherConfigured && !local.ads.enabled && gates.searchVisible) actions.push("Apply/continue AdSense review, then enable ads only after approval and placement verification.");
  if ((totals.download_pdf || 0) < 100 && (totals.generate_pdf || 0) < 300) actions.push("Keep the current free product live and track downloads/generations until the 30-day gate has enough signal.");
  if (searchConsole.performance?.rows?.length) actions.push("Improve titles and intros for queries with impressions but weak CTR.");
  if (!actions.length) actions.push("Maintain the weekly operating loop and compare Search Console plus download trends.");
  return actions;
}

function renderValidationMarkdown(report) {
  const totals = report.live.metrics?.totals || {};
  const perf = report.searchConsole.performance;
  const sitemap = Array.isArray(report.searchConsole.sitemaps?.sitemap) ? report.searchConsole.sitemaps.sitemap[0] : null;
  return [
    "# Validation Gates",
    "",
    `Last generated: ${report.generatedAt}`,
    "",
    "## Current Automated Status",
    "",
    `- Product ready: ${yesNo(report.gates.productReady)}.`,
    `- Tools live in inventory: ${report.local.toolCount}.`,
    `- Guide pages live in inventory: ${report.local.guideCount}.`,
    `- Indexable routes: ${report.local.indexableRoutes}.`,
    `- Live downloads: ${totals.download_pdf || 0}.`,
    `- Live generations: ${totals.generate_pdf || 0}.`,
    `- Search impressions: ${perf?.totals?.impressions || 0}.`,
    `- Search clicks: ${perf?.totals?.clicks || 0}.`,
    `- Ads enabled: ${yesNo(report.gates.adsEnabled)}.`,
    `- AdSense apply-ready: ${yesNo(report.gates.adsenseApplyReady)}.`,
    "",
    "## Product Gate",
    "",
    ...report.gates.reasons.productReady.map((reason) => `- ${reason}`),
    "",
    "## Search Console Gate",
    "",
    ...(sitemap ? [`- Sitemap submitted: ${sitemap.path || "unknown"}.`, `- Sitemap pending: ${yesNo(Boolean(sitemap.isPending))}; warnings: ${sitemap.warnings || 0}; errors: ${sitemap.errors || 0}.`] : ["- Sitemap data unavailable in this run."]),
    ...report.gates.reasons.searchConsole.map((reason) => `- ${reason}`),
    "",
    "## Monetization Gate",
    "",
    ...report.gates.reasons.adsenseApplyReady.map((reason) => `- ${reason}`),
    "",
    "## Validation Gates",
    "",
    `- 30-day continue gate: ${yesNo(report.gates.continue30Day)}. Continue if downloads >= 100, generations >= 300, or Search Console impressions are growing.`,
    `- 60-day pivot warning: ${yesNo(report.gates.pivot60Day)}. If still true at the 60-day checkpoint, pause printable expansion and test another ad-supported route.`,
    `- 90-day monetization review: ${yesNo(report.gates.review90Day)}. If true later, optimize ad/affiliate revenue before building paid features.`,
    "",
    "## Next Actions",
    "",
    ...report.nextActions.map((action) => `- ${action}`),
    "",
    "## Commands",
    "",
    "```powershell",
    "npm.cmd run validate:ops",
    "npm.cmd run verify:seo",
    "npm.cmd run verify:adsense",
    "```",
    "",
  ].join("\n");
}

function printSummary(report) {
  const totals = report.live.metrics?.totals || {};
  console.log(`Validation report written to ${path.relative(root, reportPath)} and VALIDATION.md`);
  console.log(`Product ready: ${yesNo(report.gates.productReady)} | Tools: ${report.local.toolCount} | Guides: ${report.local.guideCount}`);
  console.log(`Downloads: ${totals.download_pdf || 0} | Generations: ${totals.generate_pdf || 0} | Search visible: ${yesNo(report.gates.searchVisible)} | AdSense apply-ready: ${yesNo(report.gates.adsenseApplyReady)}`);
}

function readText(file) {
  const filePath = path.join(root, file);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readText(file));
  } catch {
    return fallback;
  }
}

function readString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*"([^"]*)"`));
  return match ? match[1] : "";
}

function readBool(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*(true|false)`));
  return match ? match[1] === "true" : false;
}

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseJsonFromOutput(output) {
  const parsed = parseAllJsonObjects(output);
  return parsed[0] || null;
}

function parseAllJsonObjects(output) {
  const text = String(output || "");
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const candidate = text.slice(start, i + 1);
        const parsed = safeJson(candidate);
        if (parsed) objects.push(parsed);
        start = -1;
      }
    }
  }
  return objects;
}

function yesNo(value) {
  return value ? "yes" : "no";
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
