const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === "/api/metrics") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify({
      ok: true,
      today: new Date().toISOString().slice(0, 10),
      totals: { page_view: 0, generate_pdf: 0, download_pdf: 0, generate_file: 0, download_file: 0, limit_hit: 0, ai_ideas: 0, ai_ideas_apply: 0, seller_sample_download: 0, seller_checkout_intent: 0, seller_checkout_click: 0 },
      todayTotals: { page_view: 0, generate_pdf: 0, download_pdf: 0, generate_file: 0, download_file: 0, limit_hit: 0, ai_ideas: 0, ai_ideas_apply: 0, seller_sample_download: 0, seller_checkout_intent: 0, seller_checkout_click: 0 },
      tools: [],
      sources: [],
    }));
    return;
  }

  let filePath = path.join(root, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith("/")) filePath = path.join(filePath, "index.html");

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, "index.html");
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`PrintableTools Lab running at http://localhost:${port}/`);
});
