const fs = require("fs");
const path = require("path");
const { routes, renderRoute, siteUrl, tools, guides, keywordClusters, SITE_SUMMARY } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");

function pageHtml(route) {
  const rendered = renderRoute(route);
  return template
    .replace(/<title>.*?<\/title>/, `<title>${rendered.title} - PrintableTools Lab</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta name="robots" content=".*?">/, `<meta name="robots" content="${route.index === false ? "noindex,follow" : "index,follow"}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeAttr(rendered.title)}">`)
    .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${siteUrl("assets/images/social-card.webp").replace(/\/$/, "")}">`)
    .replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${siteUrl(route.path)}">`)
    .replace(/<main id="app" tabindex="-1">[\s\S]*?<\/main>/, `<main id="app" tabindex="-1">\n${rendered.html}\n    </main>`);
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function writeRoute(route) {
  const dir = path.join(root, route.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(route));
}

const rootRoute = routes.find((route) => route.path === "");
if (rootRoute) {
  fs.writeFileSync(path.join(root, "index.html"), pageHtml(rootRoute));
}

for (const route of routes) {
  if (route.path) writeRoute(route);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .filter((route) => route.index !== false)
  .map((route) => `  <url><loc>${siteUrl(route.path)}</loc></url>`)
  .join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /dashboard/",
  "Disallow: /roadmap/",
  "Disallow: /launch-kit/",
  "Disallow: /reports/",
  `Sitemap: ${fileUrl("sitemap.xml")}`,
  "",
].join("\n");
fs.writeFileSync(path.join(root, "robots.txt"), robots);

const adsTxtPath = path.join(root, "ads.txt");
if (!fs.existsSync(adsTxtPath)) {
  fs.writeFileSync(adsTxtPath, "# No authorized advertising sellers configured yet.\n");
}

const toolsJson = {
  name: SITE_SUMMARY.name,
  description: SITE_SUMMARY.description,
  url: siteUrl(""),
  generatedAt: new Date().toISOString(),
  tools: tools.map((tool) => ({
    title: tool.title,
    url: siteUrl(tool.path),
    description: tool.description,
    category: categoryForTool(tool.path),
  })),
  guides: guides.map((guide) => ({
    title: guide.title,
    url: siteUrl(guide.path),
    description: guide.description,
  })),
};
fs.writeFileSync(path.join(root, "tools.json"), `${JSON.stringify(toolsJson, null, 2)}\n`);

const llms = [
  `# ${SITE_SUMMARY.name}`,
  "",
  SITE_SUMMARY.description,
  "",
  `Audience: ${SITE_SUMMARY.audience}`,
  "",
  `Monetization model: ${SITE_SUMMARY.monetization}`,
  "",
  "## Primary URLs",
  "",
  `- Homepage: ${siteUrl("")}`,
  `- Tools index: ${siteUrl("tools")}`,
  `- Guides index: ${siteUrl("guides")}`,
  `- Sitemap: ${fileUrl("sitemap.xml")}`,
  `- Machine-readable tool list: ${fileUrl("tools.json")}`,
  "",
  "## Tools",
  "",
  ...tools.map((tool) => `- [${tool.title}](${siteUrl(tool.path)}): ${tool.description}`),
  "",
  "## Useful Guide Pages",
  "",
  ...guides.slice(0, 24).map((guide) => `- [${guide.title}](${siteUrl(guide.path)}): ${guide.description}`),
  "",
  "## Notes For Crawlers And Assistants",
  "",
  "- Ordinary PDF generation runs in the browser and does not require an account.",
  "- Optional AI idea suggestions are server-side and limited to non-sensitive fields.",
  "- Ads are not used as a gate for downloading PDFs.",
  "- Paid checkout is intentionally disabled until free usage and search demand are validated.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "llms.txt"), llms);

const distribution = [
  "# PrintableTools Lab Distribution Pack",
  "",
  "Use these snippets for low-friction external discovery. Do not spam communities; post only where free tools are relevant.",
  "",
  "## One-line pitch",
  "",
  "PrintableTools Lab is a free no-signup PDF generator site for image-to-PDF conversion, invoices, estimates, resumes, cover letters, calendars, meal planners, sign-in sheets, graph paper, packing lists, worksheets, charts, and flashcards.",
  "",
  "## Short launch post",
  "",
  "I built PrintableTools Lab, a free browser-based PDF tool site. It creates practical one-page PDFs like image-to-PDF conversions, invoices, estimates, purchase orders, resumes, cover letters, resignation letters, monthly calendars, meal planners, sign-in sheets, graph paper, packing lists, name tracing worksheets, chore charts, reward charts, flashcards, weekly planners, and habit trackers. No account and no surprise download fee. Feedback on which tools are most useful would help shape the next batch.",
  "",
  "## Directory submission fields",
  "",
  "- Product name: PrintableTools Lab",
  "- URL: https://printable-tools-lab.pages.dev/",
  "- Category: Productivity, PDF Tools, Education, Small Business Tools, Job Search Tools",
  "- Tagline: Free no-signup printable PDF generators",
  "- Description: Create practical one-page PDFs in the browser, including image-to-PDF conversions, invoices, estimates, purchase orders, sale records, receipts, resumes, cover letters, resignation letters, calendars, meal planners, sign-in sheets, graph paper, packing lists, worksheets, charts, flashcards, and habit trackers.",
  "- Pricing: Free",
  "",
  "## Community-safe angles",
  "",
  "- For freelancers: free invoice, estimate, purchase order, and bill of sale PDFs without account creation.",
  "- For job seekers: free resume, cover letter, and resignation letter PDFs without a hidden export fee.",
  "- For parents and teachers: printable name tracing, chore charts, reward charts, flashcards, weekly planners, and habit trackers.",
  "- For household planning: monthly calendars and meal planners with grocery lists.",
  "- For everyday utility needs: image-to-PDF conversion, sign-in sheets, graph paper, and packing lists.",
  "",
  "## Places to consider manually",
  "",
  "- Indie Hackers product update or milestone post",
  "- Product Hunt upcoming/manual launch after indexing starts",
  "- Reddit communities only when rules allow self-promotion and the tool directly solves a request",
  "- Startup/tool directories with free submissions",
  "- GitHub repository topics and README link",
  "",
  "## Rules",
  "",
  "- Never ask users to click ads.",
  "- Never claim legal, tax, employment, or financial advice.",
  "- Never claim that image conversion removes the need to review sensitive documents before sharing.",
  "- Keep the post framed as a free utility and ask for feedback.",
  "- Record the posted URL and date in OPERATIONS.md.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "DISTRIBUTION.md"), distribution);

console.log(`Generated ${routes.length - 1} static route entries, sitemap.xml, robots.txt, tools.json, llms.txt, and DISTRIBUTION.md.`);

function categoryForTool(toolPath) {
  const slug = toolPath.replace(/^tools\//, "");
  if (["invoice-generator", "estimate-generator", "purchase-order", "bill-of-sale", "rent-receipt"].includes(slug)) return "Business paperwork";
  if (["resume-builder", "cover-letter", "resignation-letter"].includes(slug)) return "Career documents";
  if (["monthly-calendar", "meal-planner", "weekly-planner", "habit-tracker"].includes(slug)) return "Planning";
  if (["image-to-pdf", "sign-in-sheet", "graph-paper", "packing-list"].includes(slug)) return "Everyday utility PDFs";
  return "Education and family printables";
}

function fileUrl(fileName) {
  return siteUrl(fileName).replace(/\/$/, "");
}
