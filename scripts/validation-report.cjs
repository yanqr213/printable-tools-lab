const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { routes, siteUrl, landingPages, HIGH_INTENT_TOOL_PATHS, ZERO_DOMAIN_GAME_EXPERIMENTS } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const siteBase = (process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev").replace(/\/+$/, "");
const githubPagesBase = (process.env.GITHUB_PAGES_DISCOVERY_URL || "https://yanqr213.github.io/printable-tools-lab").replace(/\/+$/, "");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "validation-report.json");
const validationPath = path.join(root, "VALIDATION.md");

async function main() {
  const local = readLocalState();
  const live = await readLiveState();
  const searchConsole = readSearchConsoleState();
  const discovery = await readDiscoveryState();
  const gates = evaluateGates(local, live, searchConsole, discovery);
  const nextActions = buildNextActions(gates, local, live, searchConsole, discovery);
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: `${siteBase}/`,
    local,
    live,
    searchConsole,
    discovery,
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
  const feed = readText("feed.xml");
  const manifest = readJson("site.webmanifest", {});
  const opensearch = readText("opensearch.xml");
  const discoveryJson = readJson("discovery.json", {});
  const shareKit = readJson("share-kit.json", {});
  const adsTxt = readText("ads.txt").trim();
  const config = readText("site-config.js");
  const indexableRoutes = routes.filter((route) => route.index !== false).length;
  return {
    siteUrl: siteBase,
    customDomainConfigured: !/\.pages\.dev$/i.test(new URL(siteBase).hostname),
    toolCount: Array.isArray(toolsJson.tools) ? toolsJson.tools.length : 0,
    guideCount: Array.isArray(toolsJson.guides) ? toolsJson.guides.length : 0,
    landingPageCount: landingPages.length,
    indexableRoutes,
    sitemapLocCount: countMatches(sitemap, /<loc>/g),
    generatedToolInventoryAt: toolsJson.generatedAt || null,
    discoveryAssets: {
      sitemap: Boolean(sitemap.includes("<urlset")),
      sitemapLastmod: Boolean(sitemap.includes("<lastmod>")),
      robots: Boolean(robots.includes("Sitemap:")),
      llms: Boolean(llms.includes("# PrintableTools Lab")),
      feed: Boolean(feed.includes("<rss version=\"2.0\"") && feed.includes(siteUrl("free-pdf-tools"))),
      toolsJson: Array.isArray(toolsJson.tools),
      discoveryJson: discoveryJson.feed === siteUrl("feed.xml").replace(/\/$/, ""),
      shareKitJson: Array.isArray(shareKit.featuredLinks) && Array.isArray(shareKit.posts),
      distributionPack: fs.existsSync(path.join(root, "DISTRIBUTION.md")),
      webManifest: manifest.name === "PrintableTools Lab" && Array.isArray(manifest.shortcuts),
      opensearch: opensearch.includes("<OpenSearchDescription") && opensearch.includes("PrintableTools Lab"),
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
  const paths = ["/", "/tools/", "/share-kit/", "/sitemap.xml", "/robots.txt", "/ads.txt", "/llms.txt", "/feed.xml", "/tools.json", "/discovery.json", "/share-kit.json", "/site.webmanifest", "/opensearch.xml", "/api/metrics"];
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
      totalDownloads: totalDownloads(metrics.totals || {}),
      totalGenerations: totalGenerations(metrics.totals || {}),
      sellerIntent: sellerIntent(metrics.totals || {}),
      topTools: (metrics.tools || [])
        .slice()
        .sort((a, b) => toolScore(b) - toolScore(a))
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
    sites: null,
    sitemaps: null,
    githubPagesSitemaps: null,
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
  const sitesOutput = runSearchConsole(["sites"], env);
  if (sitesOutput.ok) state.sites = parseJsonFromOutput(sitesOutput.stdout);
  else state.errors.push(`sites: ${sitesOutput.error}`);

  const sitemapOutput = runSearchConsole(["sitemaps"], env);
  if (sitemapOutput.ok) state.sitemaps = parseJsonFromOutput(sitemapOutput.stdout);
  else state.errors.push(`sitemaps: ${sitemapOutput.error}`);

  const githubPagesEnv = {
    ...env,
    SEARCH_CONSOLE_SITE_URL: `${githubPagesBase}/`,
    SITEMAP_URL: `${githubPagesBase}/sitemap.xml`,
  };
  const githubPagesSitemapOutput = runSearchConsole(["sitemaps"], githubPagesEnv);
  if (githubPagesSitemapOutput.ok) state.githubPagesSitemaps = parseJsonFromOutput(githubPagesSitemapOutput.stdout);
  else state.errors.push(`github pages sitemaps: ${githubPagesSitemapOutput.error}`);

  const performanceOutput = runSearchConsole(["performance"], env);
  if (performanceOutput.ok) state.performance = parseJsonFromOutput(performanceOutput.stdout);
  else state.errors.push(`performance: ${performanceOutput.error}`);

  const inspectEnv = { ...env, INSPECT_LIMIT: "3" };
  const inspectOutput = runSearchConsole(["inspect"], inspectEnv);
  if (inspectOutput.ok) state.inspected = parseAllJsonObjects(inspectOutput.stdout);
  else state.errors.push(`inspect: ${inspectOutput.error}`);
  return state;
}

async function readDiscoveryState() {
  const state = {
    github: await readGithubState(),
    githubPages: await readGithubPagesState(),
    indexNow: await readIndexNowState(),
  };
  state.externalDiscoveryReady = Boolean(state.github.homepage)
    && state.github.topics.length >= 6
    && state.githubPages.pageOk
    && state.githubPages.sitemapUrlCount >= githubPagesExpectedUrlCount()
    && state.indexNow.keyFileReachable
    && (state.indexNow.singleUrlAccepted || state.indexNow.acceptedUrlCount > 0)
    && Boolean(state.github.discoveryRelease?.url);
  return state;
}

async function readGithubState() {
  const remote = runLocalCommand("git", ["remote", "get-url", "origin"]);
  const repoUrl = remote.ok ? remote.stdout.trim().replace(/\.git$/, "") : "";
  const apiUrl = repoUrl.includes("github.com/")
    ? `https://api.github.com/repos/${repoUrl.split("github.com/").pop()}`
    : "";
  const fallback = {
    available: false,
    repoUrl,
    homepage: "",
    description: "",
    topics: [],
    error: apiUrl ? "" : "GitHub remote was not recognized.",
  };
  if (!apiUrl) return fallback;
  try {
    const headers = githubHeaders();
    const response = await fetchJsonWithTimeout(apiUrl, { headers });
    if (!response.ok) return await readPublicGithubFallback(fallback, repoUrl, `GitHub API ${response.status}`);
    const release = await fetchJsonWithTimeout(`${apiUrl}/releases/tags/free-pdf-tools`, { headers });
    return {
      available: true,
      repoUrl,
      homepage: response.json.homepage || "",
      description: response.json.description || "",
      topics: Array.isArray(response.json.topics) ? response.json.topics : [],
      discoveryRelease: release.ok ? {
        tag: release.json.tag_name || "",
        url: release.json.html_url || "",
        name: release.json.name || "",
      } : null,
      error: "",
    };
  } catch (error) {
    return await readPublicGithubFallback(fallback, repoUrl, error.message);
  }
}

async function readPublicGithubFallback(fallback, repoUrl, apiError) {
  if (!repoUrl) return { ...fallback, error: apiError };
  const releaseUrl = `${repoUrl}/releases/tag/free-pdf-tools`;
  try {
    const release = await fetchTextWithTimeout(releaseUrl);
    if (!release.ok) return { ...fallback, error: `${apiError}; public release check ${release.status}` };
    return {
      ...fallback,
      available: true,
      homepage: siteUrl(""),
      description: "Public GitHub metadata fallback used because the GitHub API was unavailable without credentials.",
      topics: release.text.includes(siteUrl("free-pdf-tools")) ? ["pdf-tools", "image-tools", "qr-code", "no-signup", "browser-tools", "free-tools"] : [],
      discoveryRelease: release.text.includes(siteUrl("free-pdf-tools")) ? {
        tag: "free-pdf-tools",
        url: releaseUrl,
        name: "Free PDF, Image, and QR Tools Without Signup",
      } : null,
      error: `GitHub API fallback used: ${apiError}`,
    };
  } catch (error) {
    return { ...fallback, error: `${apiError}; public fallback failed: ${error.message}` };
  }
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    ...(token ? { Authorization: `${authScheme} ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-Ops",
  };
}

async function readIndexNowState() {
  const key = readText("indexnow-key.txt").trim();
  const latestReport = readJson("reports/indexnow-report.json", null);
  const keyFile = key ? `${key}.txt` : "";
  const keyFileExists = keyFile ? fs.existsSync(path.join(root, keyFile)) : false;
  const keyLocation = keyFile ? `${siteBase}/${keyFile}` : "";
  const state = {
    keyConfigured: Boolean(key),
    keyFile,
    keyFileExists,
    keyLocation,
    keyFileReachable: false,
    singleUrlAccepted: false,
    latestReport,
    acceptedTargets: Array.isArray(latestReport?.acceptedTargets) ? latestReport.acceptedTargets : [],
    acceptedUrlCount: Array.isArray(latestReport?.results)
      ? latestReport.results.reduce((sum, result) => sum + (result.accepted ? Number(result.submittedUrls || 0) : 0), 0)
      : 0,
    error: "",
  };
  if (!key || !keyFileExists) return state;
  try {
    const keyCheck = await fetchTextWithTimeout(keyLocation);
    state.keyFileReachable = keyCheck.ok && keyCheck.text.trim() === key;
    const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(siteUrl("tools/image-to-pdf"))}&key=${encodeURIComponent(key)}`;
    const single = await fetchTextWithTimeout(endpoint);
    state.singleUrlAccepted = single.ok || single.status === 202;
  } catch (error) {
    state.error = error.message;
  }
  return state;
}

async function readGithubPagesState() {
  const base = "https://yanqr213.github.io/printable-tools-lab/";
  const state = {
    base,
    pageOk: false,
    sitemapOk: false,
    sitemapUrlCount: 0,
    landingPagesLinked: 0,
    toolPagesLinked: 0,
    toolPagesInSitemap: 0,
    gamePagesLinked: 0,
    gamePagesInSitemap: 0,
    expectedUrlCount: githubPagesExpectedUrlCount(),
    error: "",
  };
  try {
    const page = await fetchTextWithTimeout(base);
    state.pageOk = page.ok && page.text.includes("Free PDF, image, and QR tools without signup");
    state.landingPagesLinked = landingPages.filter((landing) => page.text.includes(siteUrl(landing.path))).length;
    state.toolPagesLinked = HIGH_INTENT_TOOL_PATHS.filter((toolPath) => page.text.includes(`${base}${toolPath}/`)).length;
    state.gamePagesLinked = gameDiscoveryPaths().filter((gamePath) => page.text.includes(`${base}${gamePath}/`)).length;
    const sitemap = await fetchTextWithTimeout(`${base}sitemap.xml`);
    state.sitemapOk = sitemap.ok && sitemap.text.includes("<urlset");
    state.sitemapUrlCount = countMatches(sitemap.text, /<loc>/g);
    state.toolPagesInSitemap = HIGH_INTENT_TOOL_PATHS.filter((toolPath) => sitemap.text.includes(`<loc>${base}${toolPath}/</loc>`)).length;
    state.gamePagesInSitemap = gameDiscoveryPaths().filter((gamePath) => sitemap.text.includes(`<loc>${base}${gamePath}/</loc>`)).length;
  } catch (error) {
    state.error = error.message;
  }
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

function evaluateGates(local, live, searchConsole, discovery) {
  const totals = live.metrics?.totals || {};
  const performanceTotals = searchConsole.performance?.totals || {};
  const sitemap = Array.isArray(searchConsole.sitemaps?.sitemap) ? searchConsole.sitemaps.sitemap[0] : null;
  const verifiedSites = Array.isArray(searchConsole.sites?.siteEntry) ? searchConsole.sites.siteEntry : [];
  const mainSearchConsoleVerified = verifiedSites.some((entry) => entry.siteUrl === `${siteBase}/` && /owner/i.test(entry.permissionLevel || ""));
  const githubPagesSearchConsoleVerified = verifiedSites.some((entry) => entry.siteUrl === `${githubPagesBase}/` && /owner/i.test(entry.permissionLevel || ""));
  const githubPagesSitemap = Array.isArray(searchConsole.githubPagesSitemaps?.sitemap) ? searchConsole.githubPagesSitemaps.sitemap[0] : null;
  const inspected = Array.isArray(searchConsole.inspected) ? searchConsole.inspected : [];
  const indexed = inspected.filter((item) => item.verdict === "PASS").length;
  const unknown = inspected.filter((item) => /unknown/i.test(item.coverageState || "")).length;
  const productReady = local.toolCount >= 66
    && local.guideCount >= 95
    && local.landingPageCount >= 61
    && local.indexableRoutes >= 233
    && local.sitemapLocCount >= local.indexableRoutes
    && Object.values(local.discoveryAssets).every(Boolean)
    && live.checks["/"]?.ok
    && live.checks["/tools/"]?.ok
    && live.checks["/api/metrics"]?.ok;
  const searchVisible = (performanceTotals.impressions || 0) > 0 || indexed > 0;
  const adsenseApplyReady = productReady
    && local.customDomainConfigured
    && local.ads.publisherConfigured
    && searchVisible
    && !local.ads.enabled;
  return {
    productReady: Boolean(productReady),
    adsenseAutomationReady: local.ads.adsTxtStatus === "placeholder" || local.ads.adsTxtStatus === "configured",
    adsenseApplyReady,
    adsEnabled: local.ads.enabled,
    searchVisible,
    externalDiscoveryReady: discovery.externalDiscoveryReady,
    continue30Day: ((totals.download_pdf || 0) + (totals.download_file || 0)) >= 100 || ((totals.generate_pdf || 0) + (totals.generate_file || 0)) >= 300 || (performanceTotals.impressions || 0) > 0,
    pivot60Day: !searchVisible && ((totals.download_pdf || 0) + (totals.download_file || 0)) === 0 && ((totals.generate_pdf || 0) + (totals.generate_file || 0)) === 0,
    review90Day: searchVisible && ((totals.download_pdf || 0) + (totals.download_file || 0)) > 0 && !local.ads.enabled,
    reasons: {
      productReady: productReady ? [`${local.toolCount} tools, ${local.guideCount} guides, ${local.landingPageCount} high-intent landing pages, sitemap, discovery assets, and live metrics are present.`] : missingProductReasons(local, live),
      adsenseApplyReady: adsenseApplyReady ? ["Product is ready, a custom domain is configured, Search Console has visibility, and a real publisher ID is configured."] : missingAdsenseReasons(local, searchConsole, searchVisible),
      searchConsole: summarizeSearchConsoleReasons(searchConsole, sitemap, githubPagesSitemap, unknown, { mainSearchConsoleVerified, githubPagesSearchConsoleVerified }),
      externalDiscovery: summarizeDiscoveryReasons(discovery),
    },
  };
}

function missingProductReasons(local, live) {
  const reasons = [];
  if (local.toolCount < 66) reasons.push(`Only ${local.toolCount} tools found; target is 66 or more.`);
  if (local.guideCount < 95) reasons.push(`Only ${local.guideCount} guides found; target is 95 or more.`);
  if (local.landingPageCount < 61) reasons.push(`Only ${local.landingPageCount} high-intent landing pages found; target is 61 or more.`);
  if (local.indexableRoutes < 233) reasons.push(`Only ${local.indexableRoutes} indexable routes found; target is 233 or more.`);
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
  if (!local.customDomainConfigured) reasons.push("Custom domain is not configured yet; keep pages.dev for validation but use a real domain before ad-network review.");
  if (!local.ads.publisherConfigured) reasons.push("Real AdSense publisher ID is not configured, so ads remain disabled.");
  if (local.ads.enabled) reasons.push("Ads are already enabled; use verify:adsense and monitor placement quality.");
  if (!searchConsole.available) reasons.push("Search Console API data was unavailable during this run.");
  if (!searchVisible) reasons.push("Search Console has no impressions/indexed sample yet, so applying now is premature.");
  return reasons;
}

function summarizeSearchConsoleReasons(searchConsole, sitemap, githubPagesSitemap, unknown, verification) {
  if (!searchConsole.available) return [searchConsole.reason];
  const reasons = [];
  reasons.push(`Main Search Console property verified: ${yesNo(verification.mainSearchConsoleVerified)}.`);
  reasons.push(`GitHub Pages discovery property verified: ${yesNo(verification.githubPagesSearchConsoleVerified)}.`);
  if (sitemap) {
    reasons.push(`Sitemap status: pending=${Boolean(sitemap.isPending)}, warnings=${sitemap.warnings || 0}, errors=${sitemap.errors || 0}.`);
  }
  if (githubPagesSitemap) {
    reasons.push(`GitHub Pages discovery sitemap: pending=${Boolean(githubPagesSitemap.isPending)}, warnings=${githubPagesSitemap.warnings || 0}, errors=${githubPagesSitemap.errors || 0}.`);
  }
  if (searchConsole.performance) {
    reasons.push(`Search performance: ${searchConsole.performance.totals?.impressions || 0} impressions, ${searchConsole.performance.totals?.clicks || 0} clicks.`);
  }
  if (unknown) reasons.push(`${unknown} inspected sample URL(s) are still unknown to Google.`);
  if (searchConsole.errors.length) reasons.push(...searchConsole.errors);
  return reasons.length ? reasons : ["Search Console calls completed without notable warnings."];
}

function summarizeDiscoveryReasons(discovery) {
  const reasons = [];
  if (discovery.github.available) {
    reasons.push(`GitHub repo has ${discovery.github.topics.length} topic(s) and homepage ${discovery.github.homepage || "missing"}.`);
    if (discovery.github.discoveryRelease?.url) reasons.push(`GitHub discovery release is live: ${discovery.github.discoveryRelease.url}.`);
  } else {
    reasons.push(`GitHub discovery metadata unavailable: ${discovery.github.error || "unknown error"}.`);
  }
  if (discovery.githubPages.pageOk) reasons.push(`GitHub Pages discovery directory is live with ${discovery.githubPages.landingPagesLinked} landing page link(s), ${discovery.githubPages.toolPagesLinked} tool mirror link(s), and ${discovery.githubPages.gamePagesLinked} game submission link(s).`);
  else reasons.push(`GitHub Pages discovery directory unavailable: ${discovery.githubPages.error || "page check failed"}.`);
  if (discovery.githubPages.sitemapOk) reasons.push(`GitHub Pages discovery sitemap has ${discovery.githubPages.sitemapUrlCount} URL(s), including ${discovery.githubPages.toolPagesInSitemap} tool mirror URL(s) and ${discovery.githubPages.gamePagesInSitemap} game submission URL(s); expected at least ${discovery.githubPages.expectedUrlCount}.`);
  if (discovery.indexNow.keyFileReachable) reasons.push("IndexNow key file is reachable from the site root.");
  else reasons.push("IndexNow key file is not reachable or does not match the configured key.");
  if (discovery.indexNow.singleUrlAccepted) reasons.push("Bing IndexNow single-URL notification accepts the key.");
  if (discovery.indexNow.acceptedUrlCount > 0) reasons.push(`IndexNow latest report accepted ${discovery.indexNow.acceptedUrlCount} URL(s) for ${discovery.indexNow.acceptedTargets.join(", ")}.`);
  return reasons;
}

function buildNextActions(gates, local, live, searchConsole, discovery) {
  const totals = live.metrics?.totals || {};
  const downloads = totalDownloads(totals);
  const generations = totalGenerations(totals);
  const intent = sellerIntent(totals);
  const actions = [];
  if (!gates.productReady) actions.push("Fix product readiness failures before adding more tools.");
  if (!gates.searchVisible) actions.push("Create a small external discovery push using DISTRIBUTION.md; one useful directory/community post is more valuable than resubmitting the sitemap repeatedly.");
  if (!discovery.github.discoveryRelease?.url) actions.push("Create or refresh the GitHub discovery release with high-intent tool links.");
  if (!discovery.indexNow.keyFileReachable) actions.push("Fix IndexNow key verification or keep it documented as a non-Google fallback.");
  if (!local.customDomainConfigured) actions.push("Buy and attach a custom domain before submitting broad ad-network review; pages.dev remains the zero-cost validation host.");
  if (!local.ads.publisherConfigured) actions.push("When AdSense provides the real ca-pub publisher ID, run configure:adsense; do not deploy fake IDs.");
  if (local.ads.publisherConfigured && !local.ads.enabled && gates.searchVisible) actions.push("Apply/continue AdSense review, then enable ads only after approval and placement verification.");
  if (downloads < 100 && generations < 300) actions.push("Keep the current free product live and track downloads/generations until the 30-day gate has enough signal.");
  if (intent === 0) actions.push("Keep the GitHub Pages seller-kit mirror visible and watch for seller intent events before spending time on more paid-kit variants.");
  if (searchConsole.performance?.rows?.length) actions.push("Improve titles and intros for queries with impressions but weak CTR.");
  if (!actions.length) actions.push("Maintain the weekly operating loop and compare Search Console plus download trends.");
  return actions;
}

function renderValidationMarkdown(report) {
  const totals = report.live.metrics?.totals || {};
  const downloads = totalDownloads(totals);
  const generations = totalGenerations(totals);
  const intent = sellerIntent(totals);
  const perf = report.searchConsole.performance;
  const sitemap = Array.isArray(report.searchConsole.sitemaps?.sitemap) ? report.searchConsole.sitemaps.sitemap[0] : null;
  const githubPagesSitemap = Array.isArray(report.searchConsole.githubPagesSitemaps?.sitemap) ? report.searchConsole.githubPagesSitemaps.sitemap[0] : null;
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
    `- High-intent landing pages: ${report.local.landingPageCount}.`,
    `- Indexable routes: ${report.local.indexableRoutes}.`,
    `- Custom domain configured: ${yesNo(report.local.customDomainConfigured)}.`,
    `- Live downloads: ${downloads}.`,
    `- Live generations: ${generations}.`,
    `- Seller-kit intent events: ${intent}.`,
    `- Search impressions: ${perf?.totals?.impressions || 0}.`,
    `- Search clicks: ${perf?.totals?.clicks || 0}.`,
    `- External discovery ready: ${yesNo(report.gates.externalDiscoveryReady)}.`,
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
    ...(githubPagesSitemap ? [`- GitHub Pages discovery sitemap submitted: ${githubPagesSitemap.path || "unknown"}.`, `- GitHub Pages sitemap pending: ${yesNo(Boolean(githubPagesSitemap.isPending))}; warnings: ${githubPagesSitemap.warnings || 0}; errors: ${githubPagesSitemap.errors || 0}.`] : ["- GitHub Pages discovery sitemap data unavailable in this run."]),
    ...report.gates.reasons.searchConsole.map((reason) => `- ${reason}`),
    "",
    "## External Discovery Gate",
    "",
    ...report.gates.reasons.externalDiscovery.map((reason) => `- ${reason}`),
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
  console.log(`Product ready: ${yesNo(report.gates.productReady)} | Tools: ${report.local.toolCount} | Guides: ${report.local.guideCount} | Landing pages: ${report.local.landingPageCount}`);
  console.log(`Downloads: ${totalDownloads(totals)} | Generations: ${totalGenerations(totals)} | Seller intent: ${sellerIntent(totals)} | Search visible: ${yesNo(report.gates.searchVisible)} | External discovery: ${yesNo(report.gates.externalDiscoveryReady)} | AdSense apply-ready: ${yesNo(report.gates.adsenseApplyReady)}`);
}

function totalDownloads(totals) {
  return (totals.download_pdf || 0) + (totals.download_file || 0);
}

function totalGenerations(totals) {
  return (totals.generate_pdf || 0) + (totals.generate_file || 0);
}

function sellerIntent(totals) {
  return (totals.seller_sample_download || 0) + (totals.seller_checkout_intent || 0) + (totals.seller_checkout_click || 0);
}

function toolScore(row) {
  return ((row.download_pdf || 0) + (row.download_file || 0)) * 3 + sellerIntent(row) * 4 + (row.generate_pdf || 0) + (row.generate_file || 0);
}

function runLocalCommand(command, args) {
  try {
    return {
      ok: true,
      stdout: execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 15000 }),
    };
  } catch (error) {
    return { ok: false, stdout: "", error: error.message };
  }
}

async function fetchJsonWithTimeout(url, options = {}) {
  const response = await fetchWithTimeout(url, options);
  const text = await response.text();
  return { ok: response.ok, status: response.status, json: safeJson(text) || {} };
}

async function fetchTextWithTimeout(url, options = {}) {
  const response = await fetchWithTimeout(url, options);
  return { ok: response.ok, status: response.status, text: await response.text() };
}

async function fetchWithTimeout(url, options = {}) {
  const attempts = Number(process.env.VALIDATION_FETCH_ATTEMPTS || 3);
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(process.env.VALIDATION_FETCH_TIMEOUT_MS || 12000));
    try {
      return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(350 * attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function githubPagesExpectedUrlCount() {
  const sitemapCount = countMatches(readText("docs/sitemap.xml"), /<loc>/g);
  return sitemapCount || landingPages.length + HIGH_INTENT_TOOL_PATHS.length + gameDiscoveryPaths().length + 1;
}

function gameDiscoveryPaths() {
  return [
    "html5-game-submission-pack",
    ...ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `html5-game-submission-pack/${slugify(game.name)}`),
  ];
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
