const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

async function main() {
  const eventSource = loadFunction("functions/api/event.js", ["onRequestPost", "onRequestGet", "onRequestOptions"]);
  const metricsSource = loadFunction("functions/api/metrics.js", ["onRequestGet"]);
  const opsMetricsSource = loadFunction("functions/api/ops-metrics.js", ["onRequestGet"]);
  const sponsorLeadSource = loadFunction("functions/api/sponsor-lead.js", ["onRequestPost", "onRequestGet"]);
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
  const limitedStore = new MemoryStore({ failWritesWith: "KV put() limit exceeded for the day." });
  const limitedEventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "page_view", tool: "site", path: "/ops/", source: "direct" }),
    }),
    env: { PTL_EVENTS: limitedStore },
  });
  const limitedEventPayload = await limitedEventResponse.json();
  assert(limitedEventResponse.status === 202 && limitedEventPayload.sampledOut, "Event collector should degrade cleanly when KV daily writes are exhausted");
  const optionsResponse = eventSource.onRequestOptions();
  assert(optionsResponse.status === 200, "Event collector should accept CORS preflight");
  assert(optionsResponse.headers.get("Access-Control-Allow-Origin") === "*", "Event collector should expose cross-project CORS headers");

  const metricsResponse = await metricsSource.onRequestGet({ env });
  const metricsPayload = await metricsResponse.json();
  assert(metricsPayload.ok, "Metrics endpoint should respond");
  assert(store.getCount <= 1000, `Metrics endpoint should stay under Cloudflare KV read limits, got ${store.getCount}`);
  assert(metricsPayload.totals.download_pdf === 1, "Metrics should count downloads");
  assert(metricsPayload.tools.length === 70, "Metrics should include every active tool plus monetization funnel rows");
  const invoice = metricsPayload.tools.find((row) => row.tool === "invoice-generator");
  assert(invoice.download_pdf === 1, "Metrics should count per-tool downloads");
  const noSignupTools = metricsPayload.sources.find((row) => row.source === "nosignuptools");
  assert(noSignupTools.download_pdf === 1, "Metrics should count per-source downloads");
  const opsMetricsPayload = await (await opsMetricsSource.onRequestGet({ env })).json();
  const printableProject = opsMetricsPayload.projects.find((row) => row.id === "printable-tools-lab");
  const gameProject = opsMetricsPayload.projects.find((row) => row.id === "pocket-arcade-shelf");
  assert(printableProject, "Metrics should include PrintableTools Lab project row");
  assert(gameProject, "Metrics should include Pocket Arcade Shelf project row");
  assert(printableProject.summary.downloads === 1, "PrintableTools Lab project should count project downloads");

  const gameIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://printable-tools-lab.pages.dev/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": "https://pocket-arcade-shelf.pages.dev" },
      body: JSON.stringify({ project: "pocket-arcade-shelf", name: "game_play_intent", tool: "spell-sigil-duel", path: "/game/spell-sigil-duel.html", source: "embed" }),
    }),
    env,
  });
  assert(gameIntentResponse.status === 200, "Event collector should accept Pocket Arcade Shelf game events");
  const gameMetrics = await (await opsMetricsSource.onRequestGet({ env })).json();
  const updatedGameProject = gameMetrics.projects.find((row) => row.id === "pocket-arcade-shelf");
  const spellGame = updatedGameProject.tools.find((row) => row.tool === "spell-sigil-duel");
  assert(updatedGameProject.summary.gamePlayIntent === 1, "Project metrics should count game play intent");
  assert(spellGame.game_play_intent === 1, "Project metrics should count per-game play intent");
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

  const freeToolDepthResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "free_tool_depth", tool: "compress-image-to-kb", path: "/tools/compress-image-to-kb/", source: "short-video" }),
    }),
    env,
  });
  assert(freeToolDepthResponse.status === 200, "Event collector should accept free-tool depth events");
  const depthMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const imageKbTool = depthMetrics.tools.find((row) => row.tool === "compress-image-to-kb");
  assert(imageKbTool.free_tool_depth === 1, "Metrics should count per-tool free-tool depth events");
  assert(depthMetrics.totals.free_tool_depth === 1, "Metrics should count total free-tool depth events");
  const shortVideo = depthMetrics.sources.find((row) => row.source === "short-video");
  assert(shortVideo.free_tool_depth === 1, "Metrics should count per-source free-tool depth events");

  const guideDepthResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "guide_depth", tool: "site", path: "/guides/free-invoice-generator-no-signup/", source: "github-pages" }),
    }),
    env,
  });
  assert(guideDepthResponse.status === 200, "Event collector should accept guide-depth events");
  const guideDepthMetrics = await (await metricsSource.onRequestGet({ env })).json();
  assert(guideDepthMetrics.totals.guide_depth === 1, "Metrics should count total guide-depth events");
  const guidePagesSource = guideDepthMetrics.sources.find((row) => row.source === "github-pages");
  assert(guidePagesSource.guide_depth === 1, "Metrics should count guide-depth events by source");

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
  for (const source of ["techtools", "nologin", "share-kit", "short-video", "github-issue", "gist"]) {
    assert(directoryMetrics.sources.some((row) => row.source === source), `Metrics should include ${source} source row`);
  }

  const githubPagesViewResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ name: "page_view", tool: "site", path: "/custom-local-print-pack/", source: "github-pages" }),
    }),
    env,
  });
  assert(githubPagesViewResponse.status === 200, "Event collector should accept beacon-style GitHub Pages page views");

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
  const beaconServiceIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ name: "service_request_intent", tool: "custom-local-print-pack", path: "/custom-local-print-pack/", source: "github-pages" }),
    }),
    env,
  });
  assert(beaconServiceIntentResponse.status === 200, "Event collector should accept beacon-style service intent events");
  const serviceCopyIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_request_intent", tool: "custom-local-print-pack", path: "/custom-local-print-pack/", source: "direct" }),
    }),
    env,
  });
  assert(serviceCopyIntentResponse.status === 200, "Event collector should accept copied service request intent events");
  const auditIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "audit_request_intent", tool: "market-table-print-audit", path: "/market-table-print-audit/", source: "github-pages" }),
    }),
    env,
  });
  assert(auditIntentResponse.status === 200, "Event collector should accept audit request intent events");
  const beaconAuditIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ name: "audit_request_intent", tool: "market-table-print-audit", path: "/market-table-print-audit/", source: "github-pages" }),
    }),
    env,
  });
  assert(beaconAuditIntentResponse.status === 200, "Event collector should accept beacon-style audit intent events");
  const auditCopyIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "audit_request_intent", tool: "market-table-print-audit", path: "/market-table-print-audit/", source: "direct" }),
    }),
    env,
  });
  assert(auditCopyIntentResponse.status === 200, "Event collector should accept copied audit request intent events");
  const sellerDownloadResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "seller_sample_download", tool: "local-seller-starter-kit", path: "/local-seller-starter-kit/", source: "github-pages" }),
    }),
    env,
  });
  assert(sellerDownloadResponse.status === 200, "Event collector should accept seller sample download events");
  const sponsorIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "sponsor_request_intent", tool: "sponsor", path: "/sponsor/", source: "directory" }),
    }),
    env,
  });
  assert(sponsorIntentResponse.status === 200, "Event collector should accept sponsor request intent events");
  const sponsorCallIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "sponsor_request_intent", tool: "sponsor", path: "/sponsor-call/", source: "sponsor-call" }),
    }),
    env,
  });
  assert(sponsorCallIntentResponse.status === 200, "Event collector should canonicalize sponsor-call source");
  const sponsorLeadResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.10" },
      body: JSON.stringify({
        company: "Example Partner",
        contactEmail: "sponsor@example.com",
        website: "https://example.com",
        placement: "content-sponsorship",
        budgetRange: "250-500",
        timeline: "this-month",
        commitment: "request-invoice",
        audienceFit: "Privacy-friendly PDF and image tool users.",
        notes: "Interested in a clearly labeled guide sponsorship.",
        consent: true,
        source: "sponsor-call",
        path: "/sponsor/pdf-image-qr-saas/",
        deal: "guide-sponsor-pilot",
        utmSource: "sponsor-call",
        utmMedium: "manual",
        utmCampaign: "pdf_image_qr_saas",
        utmContent: "pdfco-pdf-api",
        vertical: "pdf-image-qr-saas",
      }),
    }),
    env,
  });
  const sponsorLeadPayload = await sponsorLeadResponse.json();
  assert(sponsorLeadResponse.status === 200 && sponsorLeadPayload.ok, "Sponsor lead endpoint should accept valid business inquiries");
  const invalidSponsorLeadResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.11" },
      body: JSON.stringify({
        company: "Bad Email",
        contactEmail: "not-an-email",
        website: "https://example.com",
        audienceFit: "Privacy-friendly PDF and image tool users.",
        consent: true,
      }),
    }),
    env,
  });
  assert(invalidSponsorLeadResponse.status === 400, "Sponsor lead endpoint should reject invalid email addresses");
  const validationSponsorLeadResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.12" },
      body: JSON.stringify({
        company: "Validation Partner",
        contactEmail: "validation@example.com",
        website: "https://example.org",
        placement: "media-kit-review",
        budgetRange: "exploratory",
        timeline: "exploratory",
        audienceFit: "Validation path for sponsor intake.",
        consent: true,
        validation: true,
      }),
    }),
    env,
  });
  assert(validationSponsorLeadResponse.status === 200, "Sponsor lead endpoint should accept isolated validation inquiries");
  const sellerMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const sellerKit = sellerMetrics.tools.find((row) => row.tool === "local-seller-starter-kit");
  assert(sellerKit.seller_checkout_intent === 1, "Metrics should count seller checkout intent");
  assert(sellerKit.seller_sample_download === 1, "Metrics should count seller sample downloads");
  const service = sellerMetrics.tools.find((row) => row.tool === "custom-local-print-pack");
  const audit = sellerMetrics.tools.find((row) => row.tool === "market-table-print-audit");
  assert(service.service_request_intent === 3, "Metrics should count service request, beacon, and copy intent");
  assert(audit.audit_request_intent === 3, "Metrics should count audit request, beacon, and copy intent");
  assert(sellerMetrics.totals.seller_checkout_intent === 1, "Metrics should count total seller checkout intent");
  assert(sellerMetrics.totals.service_request_intent === 3, "Metrics should count total service request intent");
  assert(sellerMetrics.totals.audit_request_intent === 3, "Metrics should count total audit request intent");
  const sponsor = sellerMetrics.tools.find((row) => row.tool === "sponsor");
  assert(sponsor.sponsor_request_intent === 2, "Metrics should count sponsor intent");
  assert(sponsor.sponsor_lead_submit === 1, "Metrics should count sponsor lead submissions");
  assert(sponsor.sponsor_invoice_request === 1, "Metrics should count sponsor invoice requests");
  assert(sellerMetrics.totals.sponsor_request_intent === 2, "Metrics should count total sponsor intent");
  assert(sellerMetrics.totals.sponsor_lead_submit === 1, "Metrics should count total sponsor lead submissions");
  assert(sellerMetrics.totals.sponsor_invoice_request === 1, "Metrics should count total sponsor invoice requests");
  assert(sellerMetrics.sponsorLeads === 1, "Metrics should expose real sponsor lead count");
  assert(sellerMetrics.sponsorInvoiceRequests === 1, "Metrics should expose sponsor invoice request count");
  assert(sellerMetrics.commercialIntent === 11, "Commercial intent should include sponsor invoice requests");
  assert(store.data.has(`sponsor:lead:${sponsorLeadPayload.id}`), "Sponsor lead should be stored privately in KV");
  const storedSponsorLead = JSON.parse(store.data.get(`sponsor:lead:${sponsorLeadPayload.id}`));
  assert(storedSponsorLead.source === "sponsor-outreach", "Sponsor lead should canonicalize sponsor-call into sponsor-outreach source metrics");
  assert(storedSponsorLead.utmSource === "sponsor-call", "Sponsor lead should preserve original sponsor-call UTM attribution");
  assert(storedSponsorLead.utmCampaign === "pdf_image_qr_saas", "Sponsor lead should store UTM campaign attribution");
  assert(storedSponsorLead.dealId === "guide-sponsor-pilot", "Sponsor lead should store selected sponsor deal attribution");
  assert(storedSponsorLead.commitment === "request-invoice", "Sponsor lead should store sponsor commitment level");
  assert(storedSponsorLead.vertical === "pdf-image-qr-saas", "Sponsor lead should store sponsor vertical attribution");
  assert(storedSponsorLead.path === "/sponsor/pdf-image-qr-saas/", "Sponsor lead should store the clean sponsor path");
  const sponsorLeadIndex = JSON.parse(store.data.get(`sponsor:lead_index:${storedSponsorLead.createdAt.slice(0, 7)}`));
  assert(sponsorLeadIndex.some((lead) => lead.id === sponsorLeadPayload.id && lead.dealId === "guide-sponsor-pilot" && lead.commitment === "request-invoice"), "Sponsor lead index should include selected deal and commitment attribution");
  const finalOpsMetrics = await (await opsMetricsSource.onRequestGet({ env })).json();
  const finalPrintableProject = finalOpsMetrics.projects.find((row) => row.id === "printable-tools-lab");
  assert(finalOpsMetrics.sponsorInvoiceRequests === 1, "Ops metrics should expose sponsor invoice request count");
  assert(finalPrintableProject.summary.sponsorInvoiceRequests === 1, "Project ops metrics should expose sponsor invoice request count");
  assert([...store.data.keys()].some((key) => key.startsWith("sponsor:validation:")), "Validation sponsor lead should use isolated KV keys");
  assert(Number(store.data.get("total:sponsor_lead_tests")) === 1, "Validation sponsor lead should count only validation tests");
  const githubPages = sellerMetrics.sources.find((row) => row.source === "github-pages");
  assert(githubPages.page_view === 1, "Metrics should count GitHub Pages page views by source");
  assert(githubPages.seller_checkout_intent === 1, "Metrics should count seller intent by source");
  assert(githubPages.service_request_intent === 1, "Metrics should count beacon service intent by source");
  assert(githubPages.audit_request_intent === 2, "Metrics should count audit intent by source");
  const community = sellerMetrics.sources.find((row) => row.source === "community");
  assert(community.service_request_intent === 1, "Metrics should count service intent by source");
  const direct = sellerMetrics.sources.find((row) => row.source === "direct");
  assert(direct.service_request_intent === 1, "Metrics should count copied service intent by source");
  assert(direct.audit_request_intent === 1, "Metrics should count copied audit intent by source");
  const directory = sellerMetrics.sources.find((row) => row.source === "directory");
  assert(directory.sponsor_request_intent === 1, "Metrics should count sponsor clicks by source");
  const sponsorOutreach = sellerMetrics.sources.find((row) => row.source === "sponsor-outreach");
  assert(sponsorOutreach.sponsor_request_intent === 2, "Metrics should count sponsor-call and lead submissions by outreach source");
  assert(sponsorOutreach.sponsor_invoice_request === 1, "Metrics should count sponsor invoice requests by outreach source");
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
  constructor(options = {}) {
    this.data = new Map();
    this.getCount = 0;
    this.failWritesWith = options.failWritesWith || "";
  }

  async get(key) {
    this.getCount += 1;
    return this.data.get(key) || null;
  }

  async put(key, value, options) {
    if (this.failWritesWith) throw new Error(this.failWritesWith);
    if (arguments.length >= 3 && options === undefined) {
      throw new Error(`Invalid undefined options for ${key}`);
    }
    if (options && Object.prototype.hasOwnProperty.call(options, "expirationTtl") && options.expirationTtl === undefined) {
      throw new Error(`Invalid undefined expirationTtl for ${key}`);
    }
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
