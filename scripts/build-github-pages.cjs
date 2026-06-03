const fs = require("fs");
const path = require("path");
const { HIGH_INTENT_TOOL_PATHS, SITE_SUMMARY, DIGITAL_PRODUCTS, LOCAL_SELLER_STARTER_KIT, ZERO_DOMAIN_GAME_EXPERIMENTS, productCheckoutRequestUrl, productCheckoutRequestCopy, siteUrl, tools, landingPages } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
const pagesBase = "https://yanqr213.github.io/printable-tools-lab/";
const generatedAt = new Date();
const generatedAtIso = generatedAt.toISOString();
const lastmod = generatedAtIso.slice(0, 10);

fs.mkdirSync(docsDir, { recursive: true });

const highIntentTools = HIGH_INTENT_TOOL_PATHS
  .map((toolPath) => tools.find((tool) => tool.path === toolPath))
  .filter(Boolean);
const highIntentToolDiscoveryRoutes = highIntentTools.map((tool) => ({
  path: tool.path,
  title: tool.title,
  description: tool.description,
  url: pagesUrl(tool.path),
  mainUrl: siteUrl(tool.path),
}));
const gameDiscoveryRoutes = [
  {
    path: "html5-game-submission-pack",
    title: "HTML5 Game Submission Pack",
    description: "Zero-cost discovery mirror for free HTML5 game packages, clean portal ZIPs, demo videos, and platform ad review assets.",
    url: pagesUrl("html5-game-submission-pack"),
    mainUrl: siteUrl("portal-submission-pack"),
  },
  ...ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => ({
    path: gameDiscoveryPath(game),
    title: `${game.name} HTML5 game package`,
    description: game.summary,
    url: pagesUrl(gameDiscoveryPath(game)),
    mainUrl: game.url,
  })),
];
const discoveryRoutes = [
  { path: "", title: "Free PDF, Image, and QR Tools Directory", description: "A compact external discovery directory for PrintableTools Lab free no-signup PDF, image, and QR tools for small business, local promotion, image conversion, static QR codes, career documents, and everyday printables.", url: pagesBase },
  ...landingPages.map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    url: pagesUrl(page.path),
    mainUrl: siteUrl(page.path),
  })),
  ...highIntentToolDiscoveryRoutes,
  ...DIGITAL_PRODUCTS.map((product) => ({
    path: product.slug,
    title: product.name,
    description: product.shortDescription,
    url: pagesUrl(product.slug),
    mainUrl: siteUrl(product.slug),
  })),
  ...gameDiscoveryRoutes,
];

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Free PDF, Image, and QR Tools Directory - PrintableTools Lab</title>
    <meta name="description" content="A compact directory for PrintableTools Lab free no-signup PDF, image, and QR tools: image compression, image resizing, format conversion, QR codes, WiFi QR signs, contact QR codes, invoices, receipts, timesheets, business cards, labels, barcodes, flyers, coupons, image to PDF, resumes, certificates, checklists, and graph paper.">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesBase}">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --soft: #eef7f9; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(1040px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.8rem); line-height: 1; margin: 0 0 14px; }
      h2 { margin-top: 34px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
      .card h3 { margin: 0 0 8px; }
      .card p { margin: 0 0 12px; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      ul { padding-left: 20px; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Free PDF, image, and QR tools without signup</h1>
      <p>This GitHub Pages directory points to the live PrintableTools Lab app, a free browser-based PDF, image, and QR tool site for small business paperwork, local promotion, image conversion, static QR codes, career documents, and everyday printables. Use it when you need a quick file and do not want an account, forced ad view, or surprise download fee.</p>
      <p><a class="button" href="${trackedSiteUrl("free-pdf-tools", "directory-home")}">Open the full free tool directory</a></p>

      <h2>Start with a common file job</h2>
      <div class="grid">
        ${highIntentTools.map((tool) => `
        <article class="card">
          <h3>${escapeHtml(tool.title)}</h3>
          <p>${escapeHtml(tool.description)}</p>
          <a href="${pagesUrl(tool.path)}">Open the discovery note</a>
          <br>
          <a href="${trackedSiteUrl(tool.path, `home-${tool.path}`)}">Open this free file tool</a>
        </article>`).join("\n")}
      </div>

      <h2>Useful starting points</h2>
      <ul>
        <li><a href="${trackedSiteUrl("pdf-tool-finder", "finder")}">File tool finder</a> for choosing between tools such as compress vs resize, invoice vs receipt, or one image vs multi-image PDF.</li>
        <li><a href="${trackedSiteUrl("upload-limit-fixer", "upload-limit-fixer")}">Upload limit fixer</a> for choosing the right no-upload tool when a website rejects a file by size, format, or dimensions.</li>
        <li><a href="${trackedSiteUrl("tools", "all-tools")}">All free generators</a> for browsing every tool.</li>
        <li><a href="${trackedSiteUrl("guides", "guides")}">Printable guides</a> for original help pages around PDF, image, QR, and printable workflows.</li>
        <li><a href="${pagesUrl(LOCAL_SELLER_STARTER_KIT.slug)}">Local Seller Starter Kit mirror</a> for the sample ZIP, checkout setup notes, and paid-kit delivery checklist.</li>
        <li><a href="${pagesUrl("html5-game-submission-pack")}">HTML5 game submission pack mirror</a> for clean portal ZIPs, GameSnacks packages, demo videos, and platform-review assets.</li>
        ${landingPages.map((page) => `<li><a href="${trackedSiteUrl(page.path, `home-${page.path}`)}">${escapeHtml(page.title)}</a> for ${escapeHtml(page.intent)}.</li>`).join("\n")}
        <li><a href="${siteUrl("feed.xml").replace(/\/$/, "")}">RSS feed</a> for monitoring newly published discovery pages and high-intent tools.</li>
        <li><a href="${siteUrl("tools.json").replace(/\/$/, "")}">Machine-readable tools.json</a> for tool directories and crawlers.</li>
      </ul>

      <h2>High-intent search pages</h2>
      <div class="grid">
        ${landingPages.map((page) => `
        <article class="card">
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.description)}</p>
          <a href="${pagesUrl(page.path)}">Open the discovery note</a>
        </article>`).join("\n")}
      </div>

      <h2>Scope and limits</h2>
      <p>${escapeHtml(SITE_SUMMARY.monetization)} The tools are for practical PDFs and simple records; review documents before sending, printing, or relying on them.</p>
    </main>
  </body>
</html>
`;

fs.writeFileSync(path.join(docsDir, "index.html"), html);
for (const page of landingPages) {
  const pageDir = path.join(docsDir, page.path);
  fs.mkdirSync(pageDir, { recursive: true });
  const primaryTool = tools.find((tool) => tool.path === cleanToolPath(page.primaryTool));
  const relatedTools = page.relatedTools
    .map((toolPath) => tools.find((tool) => tool.path === cleanToolPath(toolPath)))
    .filter(Boolean);
  fs.writeFileSync(path.join(pageDir, "index.html"), landingDiscoveryHtml(page, primaryTool, relatedTools));
}
for (const tool of highIntentTools) {
  const toolDir = path.join(docsDir, ...tool.path.split("/"));
  fs.mkdirSync(toolDir, { recursive: true });
  const relatedLandingPages = landingPages
    .filter((page) => cleanToolPath(page.primaryTool) === tool.path || page.relatedTools.some((toolPath) => cleanToolPath(toolPath) === tool.path))
    .slice(0, 6);
  fs.writeFileSync(path.join(toolDir, "index.html"), toolDiscoveryHtml(tool, relatedLandingPages));
}
writeDigitalProductDiscoveryPages();
copyDigitalProductPublicAssets();
writeGameDiscoveryPages();

fs.writeFileSync(path.join(docsDir, "tools.json"), `${JSON.stringify({
  name: SITE_SUMMARY.name,
  liveSite: siteUrl(""),
  directory: siteUrl("free-pdf-tools"),
  finder: siteUrl("pdf-tool-finder"),
  feed: siteUrl("feed.xml").replace(/\/$/, ""),
  githubPagesDirectory: pagesUrl(""),
  generatedAt: generatedAtIso,
  landingPages: landingPages.map((page) => ({
    title: page.title,
    url: siteUrl(page.path),
    discoveryUrl: pagesUrl(page.path),
    intent: page.intent,
  })),
  tools: highIntentTools.map((tool) => ({
    title: tool.title,
    description: tool.description,
    url: siteUrl(tool.path),
    discoveryUrl: pagesUrl(tool.path),
  })),
  gameSubmissionPack: {
    title: "HTML5 Game Submission Pack",
    url: siteUrl("portal-submission-pack"),
    discoveryUrl: pagesUrl("html5-game-submission-pack"),
    games: ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => ({
      name: game.name,
      url: game.url,
      discoveryUrl: pagesUrl(gameDiscoveryPath(game)),
      zipUrl: game.zipUrl,
      cleanZipUrl: game.cleanZipUrl,
      gameSnacksZipUrl: game.gameSnacksZipUrl || "",
      demoVideoUrl: game.demoVideoUrl,
      reviewReadinessUrl: game.reviewReadinessUrl,
    })),
  },
  digitalProducts: DIGITAL_PRODUCTS.map(productFeedEntry),
}, null, 2)}\n`);

fs.writeFileSync(path.join(docsDir, "products.json"), `${JSON.stringify({
  name: "PrintableTools Lab Digital Products",
  generatedAt: generatedAtIso,
  directory: pagesUrl(""),
  products: DIGITAL_PRODUCTS.map(productFeedEntry),
  moneyGate: "Revenue is real only when a payment provider shows a paid order, payout balance, or settled payment.",
}, null, 2)}\n`);

fs.writeFileSync(path.join(docsDir, "games.json"), `${JSON.stringify({
  name: "HTML5 Game Submission Feed",
  generatedAt: generatedAtIso,
  directory: pagesUrl("html5-game-submission-pack"),
  mainSubmissionPack: siteUrl("portal-submission-pack"),
  purpose: "Public machine-readable feed for HTML5 game portals and reviewers. It lists playable builds, clean ZIPs, SDK packages, demo videos, review reports, and ad-safety notes without private account or payout data.",
  games: ZERO_DOMAIN_GAME_EXPERIMENTS.map(gameFeedEntry),
  safetyRules: [
    "Standalone builds do not force ads.",
    "Clean portal ZIPs remove third-party ad SDKs, external links, sponsorship CTAs, and remote tracking.",
    "Platform ad calls are gated to approved platform contexts and natural breaks.",
    "Payment, tax, bank, card, and Alipay-linked settlement details are not included in this public feed.",
  ],
}, null, 2)}\n`);

fs.writeFileSync(path.join(docsDir, "robots.txt"), [
  "User-agent: *",
  "Allow: /",
  `Sitemap: ${pagesBase}sitemap.xml`,
  "",
].join("\n"));

fs.writeFileSync(path.join(docsDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${discoveryRoutes.map((route) => `  <url><loc>${route.url}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`);

fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");
copyGoogleVerificationFiles();
copyIndexNowKeyFile();

console.log(`Generated GitHub Pages discovery site in ${path.relative(root, docsDir)}.`);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pagesUrl(routePath = "") {
  const cleanPath = String(routePath).replace(/^\/+|\/+$/g, "");
  return cleanPath ? `${pagesBase}${cleanPath}/` : pagesBase;
}

function cleanToolPath(toolPath) {
  return String(toolPath).split("?")[0];
}

function liveToolUrl(toolPath) {
  const [pathname, query] = String(toolPath).split("?");
  return `${siteUrl(pathname)}${query ? `?${query}` : ""}`;
}

function trackedSiteUrl(routePath = "", content = "") {
  const url = new URL(siteUrl(routePath));
  url.searchParams.set("utm_source", "github-pages");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", "discovery_mirror");
  if (content) url.searchParams.set("utm_content", slugify(content).slice(0, 64));
  return url.toString();
}

function trackedLiveToolUrl(toolPath) {
  const url = new URL(liveToolUrl(toolPath));
  url.searchParams.set("utm_source", "github-pages");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", "discovery_mirror");
  url.searchParams.set("utm_content", slugify(String(toolPath).split("?")[0]).slice(0, 64));
  return url.toString();
}

function gameDiscoveryPath(game) {
  return `html5-game-submission-pack/${slugify(game.name)}`;
}

function writeDigitalProductDiscoveryPages() {
  for (const product of DIGITAL_PRODUCTS) {
    const productDir = path.join(docsDir, product.slug);
    fs.mkdirSync(productDir, { recursive: true });
    fs.writeFileSync(path.join(productDir, "index.html"), digitalProductHtml(product));
  }
}

function copyDigitalProductPublicAssets() {
  for (const product of DIGITAL_PRODUCTS) {
    copyPublicFile(product.publicSamplePath);
    copyPublicFile(product.packageReportPath);
  }
}

function copyPublicFile(relativePath) {
  const cleanPath = String(relativePath || "").replace(/^\/+/, "");
  if (!cleanPath) return;
  const sourcePath = path.join(root, cleanPath);
  if (!fs.existsSync(sourcePath)) return;
  const targetPath = path.join(docsDir, cleanPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function digitalProductHtml(product) {
  const checkoutConfigured = Boolean(product.checkoutUrl);
  const sampleUrl = pagesAssetUrl(product.publicSamplePath);
  const packageReportUrl = pagesAssetUrl(product.packageReportPath);
  const checkoutRequestUrl = productCheckoutRequestUrl(product, sampleUrl);
  const checkoutTargetUrl = checkoutConfigured ? product.checkoutUrl : checkoutRequestUrl;
  const checkoutLabel = checkoutConfigured ? `Buy for $${product.priceUsd}` : "Request checkout link";
  const checkoutCopy = productCheckoutRequestCopy(product, sampleUrl);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(product.name)} - PrintableTools Lab Directory</title>
    <meta name="description" content="${escapeHtml(product.shortDescription)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesUrl(product.slug)}">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 14px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 20px 0; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      .button.secondary { background: #17313b; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
      code { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 2px 5px; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 14px; color: var(--ink); }
      ul { padding-left: 20px; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <p><a href="${pagesBase}">PrintableTools Lab discovery directory</a></p>
      <h1>${escapeHtml(product.headline)}</h1>
      <p>${escapeHtml(product.description)}</p>
      <div class="actions">
        <a class="button" href="${sampleUrl}" download>Download sample ZIP</a>
        <a class="button secondary" href="${escapeHtml(checkoutTargetUrl)}">${escapeHtml(checkoutLabel)}</a>
        <a href="${packageReportUrl}">View package report</a>
      </div>
      <h2>Checkout state</h2>
      <p>${checkoutConfigured ? "Checkout is configured through an external payment provider. Revenue is still counted only from paid provider orders." : "Checkout is not connected yet. Use the request link to capture buyer intent without taking payment; a real Gumroad, Payhip, Ko-fi, or Stripe Payment Link is still required before paid promotion."}</p>
      <pre>${escapeHtml(checkoutCopy)}</pre>
      <p><a href="${trackedSiteUrl(product.slug, "product-backup")}">Open main site copy</a></p>
      <h2>Included assets</h2>
      <div class="grid">
        ${product.contents.map((item) => `<article class="card"><h3>${escapeHtml(item)}</h3><p>Editable local-selling template content for the paid ZIP.</p></article>`).join("\n")}
      </div>
      <h2>Risk controls</h2>
      <ul>${product.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p><strong>Money gate:</strong> ${escapeHtml(product.successGate)}</p>
      ${jsonLdHtml(productSchema(product))}
    </main>
  </body>
</html>
`;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function writeGameDiscoveryPages() {
  const packDir = path.join(docsDir, "html5-game-submission-pack");
  fs.mkdirSync(packDir, { recursive: true });
  fs.writeFileSync(path.join(packDir, "index.html"), gameSubmissionPackHtml());
  for (const game of ZERO_DOMAIN_GAME_EXPERIMENTS) {
    const gameDir = path.join(docsDir, gameDiscoveryPath(game));
    fs.mkdirSync(gameDir, { recursive: true });
    fs.writeFileSync(path.join(gameDir, "index.html"), gameDiscoveryHtml(game));
  }
}

function gameSubmissionPackHtml() {
  const gameCards = ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `<article class="card">
          <h2>${escapeHtml(game.name)}</h2>
          <p>${escapeHtml(game.summary)}</p>
          <ul>
            <li><a href="${escapeHtml(game.url)}">Play live build</a></li>
            <li><a href="${pagesUrl(gameDiscoveryPath(game))}">Open game mirror page</a></li>
            <li><a href="${escapeHtml(game.cleanZipUrl)}">Clean portal ZIP</a></li>
            <li><a href="${escapeHtml(game.zipUrl)}">SDK-adapter ZIP</a></li>
            ${optionalListItem(game.gameSnacksZipUrl, "GameSnacks ZIP")}
            <li><a href="${escapeHtml(game.demoVideoUrl)}">Demo MP4</a></li>
            <li><a href="${escapeHtml(game.reviewReadinessUrl)}">Review-readiness report</a></li>
          </ul>
        </article>`).join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HTML5 Game Submission Pack - PrintableTools Lab Directory</title>
    <meta name="description" content="A zero-cost discovery mirror for free HTML5 game packages, clean portal ZIPs, GameSnacks packages, demo videos, and platform review assets.">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesUrl("html5-game-submission-pack")}">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(980px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 14px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      ul { padding-left: 20px; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <p><a href="${pagesBase}">PrintableTools Lab discovery directory</a></p>
      <h1>HTML5 game submission pack</h1>
      <p>This mirror lists the public game packages used for zero-domain platform-ad validation. It keeps live play links, clean portal ZIPs, SDK-adapter ZIPs, demo videos, review notes, and GameSnacks assets in one crawlable place.</p>
      <p><a class="button" href="${trackedSiteUrl("portal-submission-pack", "game-submission-pack")}">Open the live portal submission pack</a></p>
      <div class="grid">
        ${gameCards}
      </div>
      <h2>Safety rules</h2>
      <ul>
        <li>Standalone builds do not force ads or ask users to click advertisements.</li>
        <li>Clean portal ZIPs remove third-party ad SDKs, external links, sponsorship CTAs, and remote tracking.</li>
        <li>Payment, tax, bank, card, and Alipay-linked settlement details stay inside official platform dashboards only after acceptance or payout eligibility.</li>
      </ul>
      ${jsonLdHtml(itemListSchema("HTML5 game submission packages", ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => ({ title: game.name, url: pagesUrl(gameDiscoveryPath(game)) }))))}
    </main>
  </body>
</html>
`;
}

function gameDiscoveryHtml(game) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(game.name)} HTML5 Game Package - PrintableTools Lab Directory</title>
    <meta name="description" content="${escapeHtml(game.summary)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesUrl(gameDiscoveryPath(game))}">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 14px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; margin: 16px 0; }
      ul { padding-left: 20px; }
    </style>
  </head>
  <body>
    <main>
      <p><a href="${pagesUrl("html5-game-submission-pack")}">HTML5 game submission pack</a></p>
      <h1>${escapeHtml(game.name)} HTML5 game package</h1>
      <p>${escapeHtml(game.summary)}</p>
      <p><a class="button" href="${escapeHtml(game.url)}">Play the live build</a></p>
      <section class="card">
        <h2>Submission assets</h2>
        <ul>
          <li><a href="${escapeHtml(game.releaseUrl)}">GitHub release pack</a></li>
          <li><a href="${escapeHtml(game.zipUrl)}">HTML5 SDK-adapter ZIP</a></li>
          <li><a href="${escapeHtml(game.cleanZipUrl)}">Clean portal ZIP</a></li>
          ${optionalListItem(game.gameSnacksZipUrl, "GameSnacks ZIP")}
          ${optionalListItem(game.gameSnacksVerificationUrl, "GameSnacks verification report")}
          <li><a href="${escapeHtml(game.demoVideoUrl)}">Gameplay demo MP4</a></li>
          <li><a href="${escapeHtml(game.iconUrl)}">512x512 icon</a></li>
          <li><a href="${escapeHtml(game.coverUrl)}">16:9 cover image</a></li>
          <li><a href="${escapeHtml(game.submissionCopyUrl)}">Submission copy pack</a></li>
          <li><a href="${escapeHtml(game.reviewReadinessUrl)}">Review-readiness report</a></li>
        </ul>
      </section>
      <section class="card">
        <h2>Monetization route</h2>
        <p>The package is designed for platform-managed advertising after review. It does not include a fake payout flow, fake ad clicks, or private payment details.</p>
      </section>
      ${jsonLdHtml(videoGameSchema(game))}
    </main>
  </body>
</html>
`;
}

function optionalListItem(url, label) {
  return url ? `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>` : "<!-- optional asset unavailable -->";
}

function gameFeedEntry(game) {
  return {
    name: game.name,
    summary: game.summary,
    playUrl: game.url,
    discoveryUrl: pagesUrl(gameDiscoveryPath(game)),
    repositoryUrl: game.repo,
    releaseUrl: game.releaseUrl,
    html5ZipUrl: game.zipUrl,
    cleanPortalZipUrl: game.cleanZipUrl,
    cleanPackageReportUrl: game.cleanPackageReportUrl,
    gameSnacksZipUrl: game.gameSnacksZipUrl || "",
    gameSnacksPackageReportUrl: game.gameSnacksPackageReportUrl || "",
    gameSnacksVerificationUrl: game.gameSnacksVerificationUrl || "",
    demoVideoUrl: game.demoVideoUrl,
    iconUrl: game.iconUrl,
    coverUrl: game.coverUrl,
    socialCardUrl: game.socialCardUrl,
    submissionNotesUrl: game.submissionNotesUrl,
    submissionCopyUrl: game.submissionCopyUrl,
    reviewReadinessUrl: game.reviewReadinessUrl,
    safeForPublicSubmission: true,
  };
}

function productFeedEntry(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.shortDescription,
    url: siteUrl(product.slug),
    discoveryUrl: pagesUrl(product.slug),
    priceUsd: product.priceUsd,
    currency: product.currency,
    checkoutConfigured: Boolean(product.checkoutUrl),
    checkoutUrl: product.checkoutUrl || "",
    checkoutRequestUrl: productCheckoutRequestUrl(product, pagesAssetUrl(product.publicSamplePath)),
    sampleUrl: siteUrl(product.publicSamplePath).replace(/\/$/, ""),
    discoverySampleUrl: pagesAssetUrl(product.publicSamplePath),
    packageReportUrl: siteUrl(product.packageReportPath).replace(/\/$/, ""),
    discoveryPackageReportUrl: pagesAssetUrl(product.packageReportPath),
    privatePackagePath: product.privatePackagePath,
    contents: product.contents,
    successGate: product.successGate,
  };
}

function pagesAssetUrl(relativePath) {
  const cleanPath = String(relativePath || "").replace(/^\/+/, "");
  return `${pagesBase}${cleanPath}`;
}

function productSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    url: siteUrl(product.slug),
    offers: {
      "@type": "Offer",
      price: String(product.priceUsd),
      priceCurrency: product.currency,
      availability: product.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: product.checkoutUrl || siteUrl(product.slug),
    },
  };
}

function videoGameSchema(game) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    description: game.summary,
    url: game.url,
    image: [game.coverUrl, game.iconUrl, game.socialCardUrl].filter(Boolean),
    applicationCategory: "Game",
    gamePlatform: ["HTML5", "Web browser"],
    playMode: "SinglePlayer",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    associatedMedia: game.demoVideoUrl ? {
      "@type": "VideoObject",
      name: `${game.name} gameplay demo`,
      contentUrl: game.demoVideoUrl,
      thumbnailUrl: game.coverUrl,
    } : undefined,
  };
}

function itemListSchema(name, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: item.url,
    })),
  };
}

function jsonLdHtml(data) {
  return `<script type="application/ld+json">${JSON.stringify(removeUndefined(data))}</script>`;
}

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .filter(([, entry]) => entry !== undefined && entry !== "")
      .map(([key, entry]) => [key, removeUndefined(entry)]));
  }
  return value;
}

function copyGoogleVerificationFiles() {
  const verificationFiles = fs.readdirSync(root)
    .filter((fileName) => /^google[a-zA-Z0-9_-]+(?:\.html)?$/.test(fileName));
  for (const fileName of verificationFiles) {
    fs.copyFileSync(path.join(root, fileName), path.join(docsDir, fileName));
  }
}

function copyIndexNowKeyFile() {
  const key = fs.existsSync(path.join(root, "indexnow-key.txt"))
    ? fs.readFileSync(path.join(root, "indexnow-key.txt"), "utf8").trim()
    : "";
  if (!/^[a-z0-9]{16,64}$/i.test(key)) return;
  const keyFileName = `${key}.txt`;
  const keyFilePath = path.join(root, keyFileName);
  if (fs.existsSync(keyFilePath)) fs.copyFileSync(keyFilePath, path.join(docsDir, keyFileName));
}

function landingDiscoveryHtml(page, primaryTool, relatedTools) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)} - PrintableTools Lab Directory</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesBase}${page.path}/">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --soft: #eef7f9; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 14px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <p><a href="${pagesBase}">PrintableTools Lab discovery directory</a></p>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.lead)}</p>
      <p><a class="button" href="${trackedSiteUrl(page.path, `landing-${page.path}`)}">Open the live no-signup page</a></p>
      <h2>Primary tool</h2>
      <article class="card">
        <h3>${escapeHtml(primaryTool.title)}</h3>
        <p>${escapeHtml(primaryTool.description)}</p>
        <a href="${trackedLiveToolUrl(page.primaryTool)}">Open ${escapeHtml(primaryTool.title)}</a>
      </article>
      <h2>Intent match</h2>
      <p>${escapeHtml(page.intent)}. The live page is designed to route this search intent to a practical browser tool without account creation or an ad-click gate.</p>
      <h2>Related tools</h2>
      <div class="grid">
        ${relatedTools.map((tool) => `<article class="card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a href="${trackedSiteUrl(tool.path, `related-${tool.path}`)}">Open this tool</a></article>`).join("\n")}
      </div>
    </main>
  </body>
</html>
`;
}

function toolDiscoveryHtml(tool, relatedLandingPages) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(tool.title)} - Free Tool Discovery</title>
    <meta name="description" content="${escapeHtml(tool.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pagesUrl(tool.path)}">
    <style>
      :root { color-scheme: light; --ink: #17313b; --muted: #5b6f78; --line: #dce8ec; --soft: #eef7f9; --teal: #176b87; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: var(--ink); background: #f7fbfc; line-height: 1.55; }
      main { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 56px; }
      h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; margin: 0 0 14px; }
      p { color: var(--muted); max-width: 780px; }
      a { color: var(--teal); font-weight: 700; }
      .button { display: inline-flex; min-height: 40px; align-items: center; padding: 8px 12px; border-radius: 8px; background: var(--teal); color: #fff; text-decoration: none; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .card { padding: 18px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
      ul { padding-left: 20px; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <p><a href="${pagesUrl("")}">PrintableTools Lab discovery directory</a></p>
      <h1>${escapeHtml(tool.title)}</h1>
      <p>${escapeHtml(tool.description)}</p>
      <p><a class="button" href="${trackedSiteUrl(tool.path, `tool-${tool.path}`)}">Open the live free tool</a></p>
      <h2>Why this tool exists</h2>
      <p>This mirror page is a zero-cost discovery entry for the live PrintableTools Lab tool. The live app focuses on practical browser-side generation, no account wall, and clear download flow so users can solve a file or printable job quickly.</p>
      <h2>Best fit</h2>
      <ul>
        <li>Use it when you need a practical file now and do not want to create an account first.</li>
        <li>Use browser-side PDF, image, QR, and printable workflows for ordinary one-off tasks.</li>
        <li>Review every exported file before printing, submitting, or sending it to someone else.</li>
      </ul>
      <h2>Related high-intent pages</h2>
      <div class="grid">
        ${relatedLandingPages.length ? relatedLandingPages.map((page) => `
        <article class="card">
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.description)}</p>
          <a href="${pagesUrl(page.path)}">Open discovery page</a>
          <br>
          <a href="${trackedSiteUrl(page.path, `tool-related-${page.path}`)}">Open live page</a>
        </article>`).join("\n") : `
        <article class="card">
          <h3>Free PDF, image, and QR tools</h3>
          <p>Browse the full no-signup directory and choose the closest tool for your file task.</p>
          <a href="${trackedSiteUrl("free-pdf-tools", "tool-fallback-directory")}">Open the live directory</a>
        </article>`}
      </div>
      <h2>Useful links</h2>
      <ul>
        <li><a href="${trackedSiteUrl("free-pdf-tools", "tool-footer-directory")}">Full free tool directory</a></li>
        <li><a href="${trackedSiteUrl("pdf-tool-finder", "tool-footer-finder")}">Tool finder</a></li>
        <li><a href="${trackedSiteUrl("privacy", "tool-footer-privacy")}">Privacy policy</a></li>
        <li><a href="${siteUrl("tools.json").replace(/\/$/, "")}">Machine-readable tools.json</a></li>
      </ul>
    </main>
  </body>
</html>
`;
}
