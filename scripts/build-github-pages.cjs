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

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Free PDF Tools Directory - PrintableTools Lab</title>
    <meta name="description" content="A compact directory for PrintableTools Lab free no-signup PDF generators: image to PDF, text to PDF, invoices, receipts, timesheets, resumes, certificates, checklists, and graph paper.">
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
      <h1>Free PDF tools without signup</h1>
      <p>This GitHub Pages directory points to the live PrintableTools Lab app, a free browser-based PDF tool site for everyday documents. Use it when you need a quick PDF and do not want an account or a surprise download fee.</p>
      <p><a class="button" href="${siteUrl("free-pdf-tools")}">Open the full free PDF tools directory</a></p>

      <h2>Start with a common PDF job</h2>
      <div class="grid">
        ${highIntentTools.map((tool) => `
        <article class="card">
          <h3>${escapeHtml(tool.title)}</h3>
          <p>${escapeHtml(tool.description)}</p>
          <a href="${siteUrl(tool.path)}">Open this free PDF tool</a>
        </article>`).join("\n")}
      </div>

      <h2>Useful starting points</h2>
      <ul>
        <li><a href="${siteUrl("pdf-tool-finder")}">PDF tool finder</a> for choosing between tools such as invoice vs receipt or one image vs multi-image PDF.</li>
        <li><a href="${siteUrl("tools")}">All free PDF generators</a> for browsing every tool.</li>
        <li><a href="${siteUrl("guides")}">Printable guides</a> for original help pages around PDF and printable workflows.</li>
        ${landingPages.slice(0, 8).map((page) => `<li><a href="${siteUrl(page.path)}">${escapeHtml(page.title)}</a> for ${escapeHtml(page.intent)}.</li>`).join("\n")}
        <li><a href="${siteUrl("feed.xml").replace(/\/$/, "")}">RSS feed</a> for monitoring newly published discovery pages and high-intent tools.</li>
        <li><a href="${siteUrl("tools.json").replace(/\/$/, "")}">Machine-readable tools.json</a> for tool directories and crawlers.</li>
      </ul>

      <h2>Scope and limits</h2>
      <p>${escapeHtml(SITE_SUMMARY.monetization)} The tools are for practical PDFs and simple records; review documents before sending, printing, or relying on them.</p>
    </main>
  </body>
</html>
`;

fs.writeFileSync(path.join(docsDir, "index.html"), html);
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
  <url><loc>${pagesBase}</loc><lastmod>${lastmod}</lastmod></url>
</urlset>
`);

fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");

console.log(`Generated GitHub Pages discovery site in ${path.relative(root, docsDir)}.`);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
