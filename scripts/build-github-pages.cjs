const fs = require("fs");
const path = require("path");
const { HIGH_INTENT_TOOL_PATHS, SITE_SUMMARY, siteUrl, tools, landingPages } = require("./seo-content.cjs");

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
const discoveryRoutes = [
  { path: "", title: "Free PDF, Image, and QR Tools Directory", description: "A compact external discovery directory for PrintableTools Lab free no-signup PDF, image, and QR tools for small business, local promotion, image conversion, static QR codes, career documents, and everyday printables.", url: pagesBase },
  ...landingPages.map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    url: `${pagesBase}${page.path}/`,
    mainUrl: siteUrl(page.path),
  })),
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
      <p><a class="button" href="${siteUrl("free-pdf-tools")}">Open the full free tool directory</a></p>

      <h2>Start with a common file job</h2>
      <div class="grid">
        ${highIntentTools.map((tool) => `
        <article class="card">
          <h3>${escapeHtml(tool.title)}</h3>
          <p>${escapeHtml(tool.description)}</p>
          <a href="${siteUrl(tool.path)}">Open this free file tool</a>
        </article>`).join("\n")}
      </div>

      <h2>Useful starting points</h2>
      <ul>
        <li><a href="${siteUrl("pdf-tool-finder")}">File tool finder</a> for choosing between tools such as compress vs resize, invoice vs receipt, or one image vs multi-image PDF.</li>
        <li><a href="${siteUrl("tools")}">All free generators</a> for browsing every tool.</li>
        <li><a href="${siteUrl("guides")}">Printable guides</a> for original help pages around PDF, image, QR, and printable workflows.</li>
        ${landingPages.map((page) => `<li><a href="${siteUrl(page.path)}">${escapeHtml(page.title)}</a> for ${escapeHtml(page.intent)}.</li>`).join("\n")}
        <li><a href="${siteUrl("feed.xml").replace(/\/$/, "")}">RSS feed</a> for monitoring newly published discovery pages and high-intent tools.</li>
        <li><a href="${siteUrl("tools.json").replace(/\/$/, "")}">Machine-readable tools.json</a> for tool directories and crawlers.</li>
      </ul>

      <h2>High-intent search pages</h2>
      <div class="grid">
        ${landingPages.map((page) => `
        <article class="card">
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.description)}</p>
          <a href="${pagesBase}${page.path}/">Open the discovery note</a>
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
  const primaryTool = tools.find((tool) => tool.path === page.primaryTool);
  const relatedTools = page.relatedTools
    .map((toolPath) => tools.find((tool) => tool.path === toolPath))
    .filter(Boolean);
  fs.writeFileSync(path.join(pageDir, "index.html"), landingDiscoveryHtml(page, primaryTool, relatedTools));
}

fs.writeFileSync(path.join(docsDir, "tools.json"), `${JSON.stringify({
  name: SITE_SUMMARY.name,
  liveSite: siteUrl(""),
  directory: siteUrl("free-pdf-tools"),
  finder: siteUrl("pdf-tool-finder"),
  feed: siteUrl("feed.xml").replace(/\/$/, ""),
  generatedAt: generatedAtIso,
  landingPages: landingPages.map((page) => ({
    title: page.title,
    url: siteUrl(page.path),
    intent: page.intent,
  })),
  tools: highIntentTools.map((tool) => ({
    title: tool.title,
    description: tool.description,
    url: siteUrl(tool.path),
  })),
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

console.log(`Generated GitHub Pages discovery site in ${path.relative(root, docsDir)}.`);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function copyGoogleVerificationFiles() {
  const verificationFiles = fs.readdirSync(root)
    .filter((fileName) => /^google[a-zA-Z0-9_-]+(?:\.html)?$/.test(fileName));
  for (const fileName of verificationFiles) {
    fs.copyFileSync(path.join(root, fileName), path.join(docsDir, fileName));
  }
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
      <p><a class="button" href="${siteUrl(page.path)}">Open the live no-signup page</a></p>
      <h2>Primary tool</h2>
      <article class="card">
        <h3>${escapeHtml(primaryTool.title)}</h3>
        <p>${escapeHtml(primaryTool.description)}</p>
        <a href="${siteUrl(primaryTool.path)}">Open ${escapeHtml(primaryTool.title)}</a>
      </article>
      <h2>Intent match</h2>
      <p>${escapeHtml(page.intent)}. The live page is designed to route this search intent to a practical browser tool without account creation or an ad-click gate.</p>
      <h2>Related tools</h2>
      <div class="grid">
        ${relatedTools.map((tool) => `<article class="card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a href="${siteUrl(tool.path)}">Open this tool</a></article>`).join("\n")}
      </div>
    </main>
  </body>
</html>
`;
}
