const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

async function main() {
  const eventSource = loadFunction("functions/api/event.js", ["onRequestPost", "onRequestGet"]);
  const metricsSource = loadFunction("functions/api/metrics.js", ["onRequestGet"]);
  const store = new MemoryStore();
  const env = { PTL_EVENTS: store };

  const eventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "download_pdf", tool: "invoice-generator", path: "/tools/invoice-generator/", source: "nosignuptools" }),
    }),
    env,
  });
  const eventPayload = await eventResponse.json();
  assert(eventResponse.status === 200 && eventPayload.ok, "Event collector should accept supported events");

  const metricsResponse = await metricsSource.onRequestGet({ env });
  const metricsPayload = await metricsResponse.json();
  assert(metricsPayload.ok, "Metrics endpoint should respond");
  assert(metricsPayload.totals.download_pdf === 1, "Metrics should count downloads");
  assert(metricsPayload.tools.length === 69, "Metrics should include every active tool plus monetization funnel rows");
  const invoice = metricsPayload.tools.find((row) => row.tool === "invoice-generator");
  assert(invoice.download_pdf === 1, "Metrics should count per-tool downloads");
  const noSignupTools = metricsPayload.sources.find((row) => row.source === "nosignuptools");
  assert(noSignupTools.download_pdf === 1, "Metrics should count per-source downloads");
  for (const tool of ["multi-image-pdf", "compress-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "compress-image", "compress-image-to-kb", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "qr-code", "wifi-qr-code", "vcard-qr-code", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf", "text-to-pdf", "markdown-to-pdf", "csv-to-pdf", "json-to-pdf", "receipt-generator", "timesheet-generator", "business-card", "address-labels", "barcode-labels", "price-tag", "flyer-maker", "coupon-maker", "packing-slip", "work-order", "inventory-sheet", "resume-builder", "ats-resume-checker", "certificate-generator", "todo-list"]) {
    assert(metricsPayload.tools.some((row) => row.tool === tool), `Metrics should include ${tool}`);
  }

  const fileEventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "download_file", tool: "compress-image", path: "/tools/compress-image/", source: "google" }),
    }),
    env,
  });
  assert(fileEventResponse.status === 200, "Event collector should accept image file download events");
  const fileMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const compressor = fileMetrics.tools.find((row) => row.tool === "compress-image");
  assert(compressor.download_file === 1, "Metrics should count per-tool file downloads");
  assert(fileMetrics.totals.download_file === 1, "Metrics should count total file downloads");
  const google = fileMetrics.sources.find((row) => row.source === "google");
  assert(google.download_file === 1, "Metrics should count per-source file downloads");

  const directoryEventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "page_view", tool: "site", path: "/upload-limit-fixer/", source: "no-subscription" }),
    }),
    env,
  });
  assert(directoryEventResponse.status === 200, "Event collector should accept canonical directory aliases");
  const directoryMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const noSubscription = directoryMetrics.sources.find((row) => row.source === "nosubscription");
  assert(noSubscription.page_view === 1, "Metrics should count NoSubscription directory aliases");
  for (const source of ["nologin", "share-kit", "short-video", "github-issue", "gist"]) {
    assert(directoryMetrics.sources.some((row) => row.source === source), `Metrics should include ${source} source row`);
  }

  const rejectResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "bad_event", tool: "invoice-generator" }),
    }),
    env,
  });
  assert(rejectResponse.status === 400, "Event collector should reject unsupported events");

  const unknownSourceResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "page_view", tool: "site", source: "weird forum source" }),
    }),
    env,
  });
  assert(unknownSourceResponse.status === 200, "Event collector should accept and normalize unknown sources");
  const unknownSourceMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const referral = unknownSourceMetrics.sources.find((row) => row.source === "referral");
  assert(referral.page_view === 1, "Unknown source labels should roll into referral");

  const unknownToolResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "generate_pdf", tool: "unexpected-tool-id", source: "github" }),
    }),
    env,
  });
  assert(unknownToolResponse.status === 200, "Event collector should accept and normalize unknown tool IDs");
  const unknownToolMetrics = await (await metricsSource.onRequestGet({ env })).json();
  assert(unknownToolMetrics.totals.generate_pdf === 1, "Unknown tool IDs should still count total generations");
  assert(!unknownToolMetrics.tools.some((row) => row.tool === "unexpected-tool-id"), "Unknown tool IDs should not create public metric rows");

  const sellerIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "seller_checkout_intent", tool: "local-seller-starter-kit", path: "/local-seller-starter-kit/", source: "github-pages" }),
    }),
    env,
  });
  assert(sellerIntentResponse.status === 200, "Event collector should accept seller checkout intent events");
  const serviceIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_request_intent", tool: "custom-local-print-pack", path: "/custom-local-print-pack/", source: "community" }),
    }),
    env,
  });
  assert(serviceIntentResponse.status === 200, "Event collector should accept service request intent events");
  const auditIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "audit_request_intent", tool: "market-table-print-audit", path: "/market-table-print-audit/", source: "github-pages" }),
    }),
    env,
  });
  assert(auditIntentResponse.status === 200, "Event collector should accept audit request intent events");
  const sellerDownloadResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "seller_sample_download", tool: "local-seller-starter-kit", path: "/local-seller-starter-kit/", source: "github-pages" }),
    }),
    env,
  });
  assert(sellerDownloadResponse.status === 200, "Event collector should accept seller sample download events");
  const sellerMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const sellerKit = sellerMetrics.tools.find((row) => row.tool === "local-seller-starter-kit");
  assert(sellerKit.seller_checkout_intent === 1, "Metrics should count seller checkout intent");
  assert(sellerKit.seller_sample_download === 1, "Metrics should count seller sample downloads");
  const service = sellerMetrics.tools.find((row) => row.tool === "custom-local-print-pack");
  const audit = sellerMetrics.tools.find((row) => row.tool === "market-table-print-audit");
  assert(service.service_request_intent === 1, "Metrics should count service request intent");
  assert(audit.audit_request_intent === 1, "Metrics should count audit request intent");
  assert(sellerMetrics.totals.seller_checkout_intent === 1, "Metrics should count total seller checkout intent");
  assert(sellerMetrics.totals.service_request_intent === 1, "Metrics should count total service request intent");
  assert(sellerMetrics.totals.audit_request_intent === 1, "Metrics should count total audit request intent");
  const githubPages = sellerMetrics.sources.find((row) => row.source === "github-pages");
  assert(githubPages.seller_checkout_intent === 1, "Metrics should count seller intent by source");
  assert(githubPages.audit_request_intent === 1, "Metrics should count audit intent by source");
  const community = sellerMetrics.sources.find((row) => row.source === "community");
  assert(community.service_request_intent === 1, "Metrics should count service intent by source");
  console.log("Event metrics test passed.");
}

function loadFunction(file, exportsList) {
  let source = fs.readFileSync(path.join(root, file), "utf8");
  for (const name of exportsList) {
    source = source.replace(new RegExp(`export async function ${name}`), `async function ${name}`);
    source = source.replace(new RegExp(`export function ${name}`), `function ${name}`);
  }
  source += `\nreturn { ${exportsList.join(", ")} };\n`;
  return new Function(source)();
}

class MemoryStore {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) || null;
  }

  async put(key, value) {
    this.data.set(key, value);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
