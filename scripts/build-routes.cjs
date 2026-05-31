const fs = require("fs");
const path = require("path");
const { routes, renderRoute, siteUrl, tools, guides, keywordClusters, SITE_SUMMARY, HIGH_INTENT_TOOL_PATHS } = require("./seo-content.cjs");

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

const headersPath = path.join(root, "_headers");
if (fs.existsSync(headersPath)) {
  const headers = fs.readFileSync(headersPath, "utf8");
  if (!headers.includes("/discovery.json")) {
    fs.appendFileSync(headersPath, "\n/discovery.json\n  Content-Type: application/json; charset=utf-8\n");
  }
}

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
  `- Free PDF tools directory: ${siteUrl("free-pdf-tools")}`,
  `- Guides index: ${siteUrl("guides")}`,
  `- Sitemap: ${fileUrl("sitemap.xml")}`,
  `- Machine-readable tool list: ${fileUrl("tools.json")}`,
  `- Discovery index: ${fileUrl("discovery.json")}`,
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

const discoveryIndex = {
  name: SITE_SUMMARY.name,
  url: siteUrl(""),
  generatedAt: new Date().toISOString(),
  positioning: "Free no-signup browser PDF tools with local generation, original guides, and responsible ad placement after approval.",
  highIntentEntryPoints: [siteUrl("free-pdf-tools"), ...HIGH_INTENT_TOOL_PATHS.map(siteUrl)],
  constraints: [
    "No account required.",
    "No ad interaction gate.",
    "No paid checkout in the validation version.",
    "No upload for image conversion tools.",
  ],
  validationGates: {
    continue30Day: "100 PDF downloads, 300 tool generations, or growing Search Console impressions.",
    pivot60Day: "If no search exposure or downloads, stop adding printable content and test another ad-supported route.",
    review90Day: "If traffic exists but ad revenue is weak, improve high-intent pages or test compliant affiliate links before paid features.",
  },
};
fs.writeFileSync(path.join(root, "discovery.json"), `${JSON.stringify(discoveryIndex, null, 2)}\n`);

const distribution = [
  "# PrintableTools Lab Distribution Pack",
  "",
  "Use these snippets for low-friction external discovery. Do not spam communities; post only where free tools are relevant.",
  "",
  "## One-line pitch",
  "",
  "PrintableTools Lab is a free no-signup PDF generator site for image conversion, text-to-PDF, invoices, estimates, receipts, timesheets, resumes, cover letters, certificates, calendars, meal planners, sign-in sheets, graph paper, packing lists, to-do lists, worksheets, charts, and flashcards.",
  "",
  "## Short launch post",
  "",
  "I built PrintableTools Lab, a free browser-based PDF tool site. It creates practical PDFs like image-to-PDF conversions, multi-image PDFs, text-to-PDF documents, invoices, estimates, purchase orders, receipts, timesheets, resumes, cover letters, resignation letters, certificates, monthly calendars, meal planners, sign-in sheets, graph paper, packing lists, to-do lists, name tracing worksheets, chore charts, reward charts, flashcards, weekly planners, and habit trackers. No account and no surprise download fee. Feedback on which tools are most useful would help shape the next batch.",
  "",
  "## Directory submission fields",
  "",
  "- Product name: PrintableTools Lab",
  "- URL: https://printable-tools-lab.pages.dev/",
  "- Category: Productivity, PDF Tools, Document Tools, Education, Small Business Tools, Job Search Tools",
  "- Tagline: Free no-signup printable PDF generators",
  "- Description: Create practical PDFs in the browser, including image conversions, multi-image PDFs, text-to-PDF documents, invoices, estimates, purchase orders, sale records, receipts, timesheets, resumes, cover letters, resignation letters, certificates, calendars, meal planners, sign-in sheets, graph paper, packing lists, to-do lists, worksheets, charts, flashcards, and habit trackers.",
  "- Pricing: Free",
  "",
  "## High-intent links",
  "",
  `- Free PDF tools directory: ${siteUrl("free-pdf-tools")}`,
  ...HIGH_INTENT_TOOL_PATHS.map((toolPath) => {
    const tool = tools.find((item) => item.path === toolPath);
    return tool ? `- ${tool.title}: ${siteUrl(tool.path)}` : "";
  }).filter(Boolean),
  "",
  "## Community-safe angles",
  "",
  "- For freelancers: free invoice, estimate, purchase order, receipt, bill of sale, and timesheet PDFs without account creation.",
  "- For job seekers: free resume, cover letter, and resignation letter PDFs without a hidden export fee.",
  "- For parents and teachers: printable name tracing, chore charts, reward charts, flashcards, weekly planners, and habit trackers.",
  "- For teachers and organizers: free certificate, sign-in sheet, and event checklist PDFs.",
  "- For household planning: monthly calendars and meal planners with grocery lists.",
  "- For everyday utility needs: image-to-PDF conversion, multi-image PDF export, text-to-PDF, sign-in sheets, graph paper, to-do lists, and packing lists.",
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

console.log(`Generated ${routes.length - 1} static route entries, sitemap.xml, robots.txt, tools.json, discovery.json, llms.txt, and DISTRIBUTION.md.`);

function categoryForTool(toolPath) {
  const slug = toolPath.replace(/^tools\//, "");
  if (["invoice-generator", "estimate-generator", "purchase-order", "bill-of-sale", "rent-receipt", "receipt-generator", "timesheet-generator"].includes(slug)) return "Business paperwork";
  if (["resume-builder", "cover-letter", "resignation-letter"].includes(slug)) return "Career documents";
  if (["monthly-calendar", "meal-planner", "weekly-planner", "habit-tracker"].includes(slug)) return "Planning";
  if (["image-to-pdf", "multi-image-pdf", "text-to-pdf", "sign-in-sheet", "graph-paper", "packing-list", "todo-list"].includes(slug)) return "Everyday utility PDFs";
  if (["certificate-generator"].includes(slug)) return "Events and awards";
  return "Education and family printables";
}

function fileUrl(fileName) {
  return siteUrl(fileName).replace(/\/$/, "");
}
