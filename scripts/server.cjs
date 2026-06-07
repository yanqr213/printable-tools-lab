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
    const totals = { page_view: 0, generate_pdf: 0, download_pdf: 0, generate_file: 0, download_file: 0, free_tool_depth: 0, guide_depth: 0, limit_hit: 0, ai_ideas: 0, ai_ideas_apply: 0, seller_sample_download: 0, seller_checkout_intent: 0, seller_checkout_click: 0, service_request_intent: 0, audit_request_intent: 0, sponsor_request_intent: 0, sponsor_lead_submit: 0 };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify({
      ok: true,
      today: new Date().toISOString().slice(0, 10),
      totals,
      todayTotals: totals,
      totalDownloads: 0,
      totalGenerations: 0,
      freeToolDepthIntent: 0,
      sponsorLeads: 0,
      todaySponsorLeads: 0,
      commercialIntent: 0,
      tools: [],
      sources: [],
    }));
    return;
  }
  if (url.pathname === "/api/sponsor-lead" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10000) req.destroy();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data.company || !data.contactEmail || !data.website || !data.audienceFit || !data.consent) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
          res.end(JSON.stringify({ ok: false, error: "Missing required sponsor inquiry fields." }));
          return;
        }
        if (data.path && String(data.path).startsWith("/sponsor/pdf-image-qr-saas/")) {
          if (data.utmCampaign !== "pdf_image_qr_saas" || data.vertical !== "pdf-image-qr-saas") {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
            res.end(JSON.stringify({ ok: false, error: "Missing sponsor attribution fields." }));
            return;
          }
        }
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ ok: true, id: "local-sponsor-lead", validation: true }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ ok: false, error: "Sponsor inquiry rejected" }));
      }
    });
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

module.exports = server;
