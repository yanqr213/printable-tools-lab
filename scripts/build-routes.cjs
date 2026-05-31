const fs = require("fs");
const path = require("path");
const { routes, renderRoute, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");

function pageHtml(route) {
  const rendered = renderRoute(route);
  return template
    .replace(/<title>.*?<\/title>/, `<title>${rendered.title} - PrintableTools Lab</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeAttr(rendered.title)}">`)
    .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeAttr(rendered.description)}">`)
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

console.log(`Generated ${routes.length - 1} static route entries and sitemap.xml.`);
