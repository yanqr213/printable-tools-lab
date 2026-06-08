const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

async function main() {
  const eventSource = loadFunction("functions/api/event.js", ["onRequestPost", "onRequestGet", "onRequestOptions"]);
  const metricsSource = loadFunction("functions/api/metrics.js", ["onRequestGet"]);
  const opsMetricsSource = loadFunction("functions/api/ops-metrics.js", ["onRequestGet"]);
  const sponsorLeadSource = loadFunction("functions/api/sponsor-lead.js", ["onRequestPost", "onRequestGet"]);
  const sponsorPublicRepliesSource = loadFunction("functions/api/sponsor-public-replies.js", ["onRequestGet"]);
  const serviceLeadSource = loadFunction("functions/api/service-lead.js", ["onRequestPost", "onRequestGet"]);
  const servicePublicRequestsSource = loadFunction("functions/api/service-public-requests.js", ["onRequestGet"]);
  const store = new MemoryStore();
  const env = { PTL_EVENTS: store, PTL_METRICS_BASELINE: "off" };

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
  const rollupKey = Array.from(store.data.keys()).find((key) => key.startsWith("rollup:"));
  assert(rollupKey, "Event collector should store regular events in a compressed monthly rollup");
  const initialRollup = JSON.parse(store.data.get(rollupKey));
  assert(initialRollup.totals.events.download_pdf === 1, "Event rollup should count total events");
  assert(initialRollup.totals.tools["invoice-generator"].download_pdf === 1, "Event rollup should count per-tool events");
  assert(initialRollup.totals.sources.nosignuptools.download_pdf === 1, "Event rollup should count per-source events");
  assert(initialRollup.totals.projects["printable-tools-lab"].paths["/tools/invoice-generator/"].download_pdf === 1, "Event rollup should count per-path download events for ops funnels");
  assert(store.putCount === 1, "Event collector should use one KV write per regular event");
  const qaEventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_request_intent", tool: "upload-limit-fix-plan", path: "/tools/compress-image-to-kb/", source: "techtools", qa: true }),
    }),
    env,
  });
  const qaEventPayload = await qaEventResponse.json();
  assert(qaEventResponse.status === 200 && qaEventPayload.ignored && qaEventPayload.reason === "qa_event", "Event collector should ignore QA validation events");
  assert(store.putCount === 1, "QA validation events should not write to the public metrics rollup");
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
  assert(limitedEventPayload.reason === "event_store_limit", "Event collector should report store limits consistently");
  const readLimitedStore = new MemoryStore({ failReadsWith: "KV get() limit exceeded for the day." });
  const readLimitedEventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "page_view", tool: "site", path: "/", source: "direct" }),
    }),
    env: { PTL_EVENTS: readLimitedStore },
  });
  const readLimitedEventPayload = await readLimitedEventResponse.json();
  assert(readLimitedEventResponse.status === 202 && readLimitedEventPayload.sampledOut, "Event collector should degrade cleanly when KV reads are exhausted");
  const optionsResponse = eventSource.onRequestOptions();
  assert(optionsResponse.status === 200, "Event collector should accept CORS preflight");
  assert(optionsResponse.headers.get("Access-Control-Allow-Origin") === "*", "Event collector should expose cross-project CORS headers");

  const metricsResponse = await metricsSource.onRequestGet({ env });
  const metricsPayload = await metricsResponse.json();
  assert(metricsPayload.ok, "Metrics endpoint should respond");
  assert(store.getCount <= 1000, `Metrics endpoint should stay under Cloudflare KV read limits, got ${store.getCount}`);
  assert(metricsPayload.totals.download_pdf === 1, "Metrics should count downloads");
  assert(metricsPayload.tools.length === 72, "Metrics should include every active tool plus monetization funnel rows");
  assert(metricsPayload.tools.some((row) => row.tool === "upload-limit-fix-plan"), "Metrics should include the upload limit fix plan funnel row");
  const invoice = metricsPayload.tools.find((row) => row.tool === "invoice-generator");
  assert(invoice.download_pdf === 1, "Metrics should count per-tool downloads");
  const noSignupTools = metricsPayload.sources.find((row) => row.source === "nosignuptools");
  assert(noSignupTools.download_pdf === 1, "Metrics should count per-source downloads");
  assert(store.getCount <= 8, `Metrics endpoint should avoid legacy KV scans, got ${store.getCount} total reads after first metrics call`);
  const failingReadEnv = { PTL_EVENTS: new MemoryStore({ failReadsWith: "KV read limit exceeded for the day." }), PTL_METRICS_BASELINE: "off" };
  const degradedMetrics = await (await metricsSource.onRequestGet({ env: failingReadEnv })).json();
  assert(degradedMetrics.ok && degradedMetrics.dataQuality === "degraded-baseline", "Metrics should degrade cleanly when KV reads fail");
  const degradedOpsMetrics = await (await opsMetricsSource.onRequestGet({ env: failingReadEnv })).json();
  assert(degradedOpsMetrics.ok && degradedOpsMetrics.dataQuality === "degraded-baseline", "Ops metrics should degrade cleanly when KV reads fail");
  const opsMetricsPayload = await (await opsMetricsSource.onRequestGet({ env })).json();
  const printableProject = opsMetricsPayload.projects.find((row) => row.id === "printable-tools-lab");
  const gameProject = opsMetricsPayload.projects.find((row) => row.id === "pocket-arcade-shelf");
  assert(printableProject, "Metrics should include PrintableTools Lab project row");
  assert(gameProject, "Metrics should include Pocket Arcade Shelf project row");
  assert(printableProject.summary.downloads === 1, "PrintableTools Lab project should count project downloads");
  assert(printableProject.summary.todayDownloads === 1, "PrintableTools Lab project should expose today's downloads");
  assert(printableProject.nextAction && printableProject.nextAction.includes("Downloads"), "PrintableTools Lab project should expose an ops next action");
  const opsInvoicePath = printableProject.paths.find((row) => row.path === "/tools/invoice-generator/");
  assert(opsInvoicePath.download_pdf === 1 && opsInvoicePath.today_download_pdf === 1, "Project ops metrics should expose path-level download funnels");
  const opsPolitePath = printableProject.paths.find((row) => row.path === "/polite-payment-reminder-email/");
  assert(opsPolitePath && opsPolitePath.service_request_intent === 0, "Project ops metrics should include high-intent invoice reminder paths before first signal");
  const opsNoSignupSource = opsMetricsPayload.sources.find((row) => row.source === "nosignuptools");
  assert(opsNoSignupSource.download_pdf === 1, "Ops metrics should expose global source totals");
  assert(opsNoSignupSource.today_download_pdf === 1, "Ops metrics should expose global source today totals");
  const opsInvoiceTool = printableProject.tools.find((row) => row.tool === "invoice-generator");
  assert(opsInvoiceTool.today_download_pdf === 1, "Project ops metrics should expose today's per-tool downloads");
  const opsNoSignupProjectSource = printableProject.sources.find((row) => row.source === "nosignuptools");
  assert(opsNoSignupProjectSource.today_download_pdf === 1, "Project ops metrics should expose today's per-source downloads");
  assert(Array.isArray(opsMetricsPayload.nextActions) && opsMetricsPayload.nextActions.length, "Ops metrics should expose operating next actions");
  const mockedFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert(String(url).includes("api.github.com/repos/yanqr213/printable-tools-lab/issues"), "Public replies API should query GitHub issues");
    return new Response(JSON.stringify([
      {
        number: 42,
        state: "open",
        title: "[Sponsor/Partner]: Example Partner",
        html_url: "https://github.com/yanqr213/printable-tools-lab/issues/42",
        created_at: "2026-06-08T00:00:00Z",
        updated_at: "2026-06-08T00:05:00Z",
        labels: [{ name: "sponsor" }, { name: "partner" }, { name: "business-review" }],
        body: "Public-safe sponsor reply.\n\nCompany / project: Example Partner\nPublic website URL: https://example.com\nAudience fit: PDF sponsorship\nSelected pilot deal: Starter fit review (USD 49)\nProposal or deal URL: https://printable-tools-lab.pages.dev/sponsor-proposal?prospect=example-partner&deal=starter-fit-review&vertical=pdf-image-qr-saas&utm_content=example-partner&commitment=request-invoice#sponsor-inquiry\n\nRequested next step: Request pilot invoice review\n\nDo not include private payment, tax, bank, phone, customer, identity, password, or confidential file data in this public issue.",
      },
    ]), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  const publicReplies = await (await sponsorPublicRepliesSource.onRequestGet({ env: {} })).json();
  globalThis.fetch = mockedFetch;
  assert(publicReplies.ok && publicReplies.publicMetricsOnly, "Public replies API should expose a public-safe summary");
  assert(publicReplies.publicReplyCount === 1, "Public replies API should count sponsor issue replies");
  assert(publicReplies.invoiceRequestCount === 1, "Public replies API should detect public invoice issue requests");
  assert(publicReplies.rows[0].prospect === "example-partner", "Public replies API should preserve proposal attribution");
  assert(!JSON.stringify(publicReplies).includes("sponsor@example.com"), "Public replies API should not expose private lead details");

  globalThis.fetch = async (url) => {
    assert(String(url).includes("api.github.com/repos/yanqr213/printable-tools-lab/issues"), "Service public requests API should query GitHub issues");
    return new Response(JSON.stringify([
      {
        number: 43,
        state: "open",
        title: "Service request: Invoice Follow-up Copy Pack",
        html_url: "https://github.com/yanqr213/printable-tools-lab/issues/43",
        created_at: "2026-06-08T00:10:00Z",
        updated_at: "2026-06-08T00:15:00Z",
        labels: [{ name: "service-request" }, { name: "business-review" }],
        body: "Public-safe service request.\n\nService: Invoice Follow-up Copy Pack\nBusiness or project: Example Market Booth\nNeed-by / timeline: this week\nSource path: https://printable-tools-lab.pages.dev/invoice-followup-copy-pack/\n\nRequest note:\nPlease draft a friendly first follow-up without invoice numbers or private client details.\n\nDo not include payment, tax, bank, phone, identity, password, customer-list, or private file data in this public issue.",
      },
    ]), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  const publicServiceRequests = await (await servicePublicRequestsSource.onRequestGet({ env: {} })).json();
  globalThis.fetch = mockedFetch;
  assert(publicServiceRequests.ok && publicServiceRequests.publicMetricsOnly, "Service public requests API should expose a public-safe summary");
  assert(publicServiceRequests.publicRequestCount === 1, "Service public requests API should count service request issues");
  assert(publicServiceRequests.invoiceFollowupRequestCount === 1, "Service public requests API should detect invoice follow-up requests");
  assert(publicServiceRequests.paidServiceRequestCount === 1, "Service public requests API should count paid service request issues");
  assert(publicServiceRequests.readyForReviewCount === 1, "Service public requests API should flag open service requests for review");
  assert(!JSON.stringify(publicServiceRequests).includes("buyer@example.com"), "Service public requests API should not expose private lead details");

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
  const sellerCheckoutClickResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "seller_checkout_click", tool: "local-seller-starter-kit", path: "/local-seller-starter-kit/", source: "github-pages" }),
    }),
    env,
  });
  assert(sellerCheckoutClickResponse.status === 200, "Event collector should accept seller checkout click events");
  const serviceIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_request_intent", tool: "custom-local-print-pack", path: "/custom-local-print-pack/", source: "community" }),
    }),
    env,
  });
  assert(serviceIntentResponse.status === 200, "Event collector should accept service request intent events");
  const serviceCheckoutClickResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_checkout_click", tool: "custom-local-print-pack", path: "/custom-local-print-pack/", source: "community" }),
    }),
    env,
  });
  assert(serviceCheckoutClickResponse.status === 200, "Event collector should accept service checkout click events");
  const serviceInvoiceRequestResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_invoice_request", tool: "upload-limit-fix-plan", path: "/upload-error-cheatsheet/", source: "techtools" }),
    }),
    env,
  });
  assert(serviceInvoiceRequestResponse.status === 200, "Event collector should accept service invoice request events");
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
  const invoiceFollowupIntentResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "service_request_intent", tool: "invoice-followup-copy-pack", path: "/polite-payment-reminder-email/", source: "google" }),
    }),
    env,
  });
  assert(invoiceFollowupIntentResponse.status === 200, "Event collector should accept invoice follow-up service intent events");
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
      body: JSON.stringify(sponsorLeadBody({
        source: "sponsor-call",
        path: "/sponsor/pdf-image-qr-saas/",
        deal: "guide-sponsor-pilot",
        utmSource: "sponsor-call",
        utmMedium: "manual",
        utmCampaign: "pdf_image_qr_saas",
        utmContent: "pdfco-pdf-api",
        vertical: "pdf-image-qr-saas",
      })),
    }),
    env,
  });
  const sponsorLeadPayload = await sponsorLeadResponse.json();
  assert(sponsorLeadResponse.status === 200 && sponsorLeadPayload.ok, "Sponsor lead endpoint should accept valid business inquiries");
  const dryRunSponsorLeadResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.18" },
      body: JSON.stringify(sponsorLeadBody({
        validation: true,
        dryRun: true,
        company: "",
        contactEmail: "dryrun@example.com",
        website: "https://dryrun-sponsor.example/path",
        dealId: "starter-fit-review",
      })),
    }),
    env,
  });
  const dryRunSponsorLeadPayload = await dryRunSponsorLeadResponse.json();
  assert(dryRunSponsorLeadResponse.status === 200 && dryRunSponsorLeadPayload.ok && dryRunSponsorLeadPayload.dryRun, "Sponsor lead endpoint should support validation dry-runs without KV writes");
  assert(dryRunSponsorLeadPayload.normalized.company === "Dryrun Sponsor", "Sponsor validation dry-run should expose inferred company label");
  assert(!dryRunSponsorLeadPayload.id, "Sponsor validation dry-run should not create a lead id");
  const dryRunFallbackResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.19" },
      body: JSON.stringify(sponsorLeadBody({
        validation: true,
        dryRunFallback: true,
        company: "Fallback Dryrun Partner",
        contactEmail: "fallback-dryrun@example.com",
        website: "https://fallback-dryrun.example/path",
        dealId: "starter-fit-review",
      })),
    }),
    env,
  });
  const dryRunFallbackPayload = await dryRunFallbackResponse.json();
  assert(dryRunFallbackResponse.status === 503 && dryRunFallbackPayload.dryRunFallback, "Sponsor lead endpoint should support validation fallback dry-runs without KV writes");
  assert(dryRunFallbackPayload.fallbackRequired, "Sponsor fallback dry-run should expose fallback-required behavior");
  assertSponsorPublicReplyUrl(dryRunFallbackPayload.fallbackPublicReplyUrl, "Sponsor fallback dry-run");
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
  const sponsorLeadWriteLimitedStore = new MemoryStore({ failWritesWith: "KV put() limit exceeded for the day." });
  const sponsorLeadWriteLimitedResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.13" },
      body: JSON.stringify(sponsorLeadBody({
        company: "Fallback Partner",
        contactEmail: "fallback@example.com",
        website: "https://fallback.example",
      })),
    }),
    env: { PTL_EVENTS: sponsorLeadWriteLimitedStore },
  });
  const sponsorLeadWriteLimitedPayload = await sponsorLeadWriteLimitedResponse.json();
  assert(sponsorLeadWriteLimitedResponse.status === 503, "Sponsor lead endpoint should not claim success when private lead storage is unavailable");
  assert(sponsorLeadWriteLimitedPayload.fallbackRequired, "Sponsor lead endpoint should ask for a backup request when storage is unavailable");
  assert(sponsorLeadWriteLimitedPayload.fallbackBody.includes("Fallback Partner"), "Sponsor lead fallback should include the normalized company");
  assert(sponsorLeadWriteLimitedPayload.fallbackBody.includes("fallback@example.com"), "Sponsor lead fallback should include the normalized email");
  assertSponsorPublicReplyUrl(sponsorLeadWriteLimitedPayload.fallbackPublicReplyUrl, "Sponsor lead fallback");
  assert(String(sponsorLeadWriteLimitedPayload.fallbackPublicReplyUrl || "").includes("Fallback+Partner"), "Sponsor lead fallback reply URL should prefill the sponsor company");
  const sponsorLeadReadLimitedStore = new MemoryStore({ failReadsWith: "KV get() limit exceeded for the day." });
  const sponsorLeadReadLimitedResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.14" },
      body: JSON.stringify(sponsorLeadBody({ company: "Read Limited Partner", contactEmail: "readlimited@example.com" })),
    }),
    env: { PTL_EVENTS: sponsorLeadReadLimitedStore },
  });
  const sponsorLeadReadLimitedPayload = await sponsorLeadReadLimitedResponse.json();
  assert(sponsorLeadReadLimitedResponse.status === 200 && sponsorLeadReadLimitedPayload.ok, "Sponsor lead endpoint should store the private lead when rate-limit reads fail");
  assert(sponsorLeadReadLimitedPayload.rateLimitSkipped, "Sponsor lead endpoint should report skipped rate limiting when KV reads are limited");
  assert(sponsorLeadReadLimitedPayload.dataQuality === "stored-private-only", "Sponsor lead endpoint should report private-only storage when index or metrics reads fail");
  assert(sponsorLeadReadLimitedStore.data.has(`sponsor:lead:${sponsorLeadReadLimitedPayload.id}`), "Read-limited sponsor lead should still be stored privately");
  const sponsorLeadSideEffectLimitedStore = new MemoryStore({ failWritesWith: "KV put() limit exceeded for the day.", failWritesAfter: 3 });
  const sponsorLeadSideEffectLimitedResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.15" },
      body: JSON.stringify(sponsorLeadBody({ company: "Private Stored Partner", contactEmail: "privateonly@example.com" })),
    }),
    env: { PTL_EVENTS: sponsorLeadSideEffectLimitedStore },
  });
  const sponsorLeadSideEffectLimitedPayload = await sponsorLeadSideEffectLimitedResponse.json();
  assert(sponsorLeadSideEffectLimitedResponse.status === 200 && sponsorLeadSideEffectLimitedPayload.ok, "Sponsor lead endpoint should succeed after private storage when side effects are write-limited");
  assert(sponsorLeadSideEffectLimitedPayload.metricsSampledOut, "Sponsor lead endpoint should flag metrics sampling when side effects are write-limited");
  assert(sponsorLeadSideEffectLimitedPayload.dataQuality === "stored-private-only", "Sponsor lead endpoint should report private-only storage when side-effect writes fail");
  assert(sponsorLeadSideEffectLimitedStore.data.has(`sponsor:lead:${sponsorLeadSideEffectLimitedPayload.id}`), "Side-effect-limited sponsor lead should still be stored privately");
  const sellerMetrics = await (await metricsSource.onRequestGet({ env })).json();
  const sellerKit = sellerMetrics.tools.find((row) => row.tool === "local-seller-starter-kit");
  assert(sellerKit.seller_checkout_intent === 1, "Metrics should count seller checkout intent");
  assert(sellerKit.seller_checkout_click === 1, "Metrics should count seller checkout clicks");
  assert(sellerKit.seller_sample_download === 1, "Metrics should count seller sample downloads");
  const service = sellerMetrics.tools.find((row) => row.tool === "custom-local-print-pack");
  const audit = sellerMetrics.tools.find((row) => row.tool === "market-table-print-audit");
  const invoiceFollowupServiceIntent = sellerMetrics.tools.find((row) => row.tool === "invoice-followup-copy-pack");
  assert(service.service_request_intent === 3, "Metrics should count service request, beacon, and copy intent");
  assert(invoiceFollowupServiceIntent.service_request_intent === 1, "Metrics should count invoice follow-up service request intent on the paid service tool row");
  assert(service.service_checkout_click === 1, "Metrics should count service checkout clicks");
  const uploadFixService = sellerMetrics.tools.find((row) => row.tool === "upload-limit-fix-plan");
  assert(uploadFixService.service_invoice_request === 1, "Metrics should count upload fix service invoice requests on the paid service tool row");
  assert(audit.audit_request_intent === 3, "Metrics should count audit request, beacon, and copy intent");
  assert(sellerMetrics.totals.seller_checkout_intent === 1, "Metrics should count total seller checkout intent");
  assert(sellerMetrics.totals.seller_checkout_click === 1, "Metrics should count total seller checkout clicks");
  assert(sellerMetrics.totals.service_checkout_click === 1, "Metrics should count total service checkout clicks");
  assert(sellerMetrics.totals.service_request_intent === 4, "Metrics should count total service request intent");
  assert(sellerMetrics.totals.service_invoice_request === 1, "Metrics should count total service invoice requests");
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
  assert(sellerMetrics.commercialIntent === 15, "Commercial intent should include checkout clicks, service invoice requests, service intent, and sponsor invoice requests");
  const sellerOpsMetrics = await (await opsMetricsSource.onRequestGet({ env })).json();
  const sellerOpsPrintableProject = sellerOpsMetrics.projects.find((row) => row.id === "printable-tools-lab");
  assert(sellerOpsPrintableProject.summary.serviceInvoiceRequests === 1, "Ops metrics should expose service invoice requests separately from regular service intent");
  assert(sellerOpsPrintableProject.summary.serviceRequestIntent === 5, "Ops metrics should expose service and seller request intent separately from sponsor intent");
  assert(sellerOpsMetrics.nextActions.some((action) => action.includes("Fresh service invoice request today") && action.includes("external $9 or $19 checkout link")), "Ops next actions should prioritize explicit service invoice requests when present");
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
  const publicSponsorLeadSummary = await (await sponsorLeadSource.onRequestGet({ env })).json();
  const publicSponsorLeadSummaryText = JSON.stringify(publicSponsorLeadSummary);
  assert(publicSponsorLeadSummary.ok && publicSponsorLeadSummary.dataQuality === "lead-index", "Sponsor lead GET should expose a public-safe lead index summary");
  assert(publicSponsorLeadSummary.leadCount === 1, "Sponsor lead GET should count indexed leads");
  assert(publicSponsorLeadSummary.invoiceRequestCount === 1, "Sponsor lead GET should count indexed invoice requests");
  assert(publicSponsorLeadSummary.latestCreatedAt === storedSponsorLead.createdAt, "Sponsor lead GET should expose the latest indexed lead timestamp");
  assert(!publicSponsorLeadSummaryText.includes("sponsor@example.com"), "Sponsor lead GET should not expose contact email");
  assert(!publicSponsorLeadSummaryText.includes("Example Partner"), "Sponsor lead GET should not expose company name");
  assert(!publicSponsorLeadSummaryText.includes("https://example.com"), "Sponsor lead GET should not expose sponsor website");
  const quickDealResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.16" },
      body: JSON.stringify(sponsorLeadBody({
        company: "Quick Deal Partner",
        contactEmail: "quickdeal@example.com",
        dealId: "starter-fit-review",
        budgetRange: "under-250",
      })),
    }),
    env,
  });
  const quickDealPayload = await quickDealResponse.json();
  assert(quickDealResponse.status === 200 && quickDealPayload.ok, "Sponsor lead endpoint should accept quick deal picker invoice requests");
  const quickDealLead = JSON.parse(store.data.get(`sponsor:lead:${quickDealPayload.id}`));
  assert(quickDealLead.dealId === "starter-fit-review", "Quick sponsor deal picker should persist the selected starter deal");
  assert(quickDealLead.budgetRange === "under-250", "Quick sponsor deal picker should persist the selected deal budget range");
  assert(quickDealLead.commitment === "request-invoice", "Quick sponsor deal picker should keep invoice request commitment");
  const inferredCompanyResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.17" },
      body: JSON.stringify(sponsorLeadBody({
        company: "",
        contactEmail: "buyer@lowfriction.example",
        website: "https://lowfriction.example/sponsor",
        dealId: "guide-sponsor-pilot",
      })),
    }),
    env,
  });
  const inferredCompanyPayload = await inferredCompanyResponse.json();
  assert(inferredCompanyResponse.status === 200 && inferredCompanyPayload.ok, "Sponsor lead endpoint should accept quick invoice requests without a company name");
  const inferredCompanyLead = JSON.parse(store.data.get(`sponsor:lead:${inferredCompanyPayload.id}`));
  assert(inferredCompanyLead.company === "Lowfriction", "Sponsor lead endpoint should infer a company label from the website when quick form company is blank");
  assert(inferredCompanyLead.commitment === "request-invoice", "Inferred-company quick sponsor lead should keep invoice request commitment");
  const emailOnlySponsorResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.20" },
      body: JSON.stringify(sponsorLeadBody({
        company: "",
        contactEmail: "buyer@onefield-sponsor.example",
        website: "",
        dealId: "starter-fit-review",
      })),
    }),
    env,
  });
  const emailOnlySponsorPayload = await emailOnlySponsorResponse.json();
  assert(emailOnlySponsorResponse.status === 200 && emailOnlySponsorPayload.ok, "Sponsor lead endpoint should accept one-field business-email invoice review requests");
  const emailOnlySponsorLead = JSON.parse(store.data.get(`sponsor:lead:${emailOnlySponsorPayload.id}`));
  assert(emailOnlySponsorLead.company === "Onefield Sponsor", "Sponsor lead endpoint should infer a company label from the email domain");
  assert(emailOnlySponsorLead.website === "https://onefield-sponsor.example/", "Sponsor lead endpoint should infer a website from a business email domain");
  assert(emailOnlySponsorLead.commitment === "request-invoice", "One-field sponsor lead should keep invoice request commitment");
  const personalEmailSponsorResponse = await sponsorLeadSource.onRequestPost({
    request: new Request("https://example.test/api/sponsor-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.21" },
      body: JSON.stringify(sponsorLeadBody({
        company: "",
        contactEmail: "buyer@gmail.com",
        website: "",
        dealId: "starter-fit-review",
      })),
    }),
    env,
  });
  const personalEmailSponsorPayload = await personalEmailSponsorResponse.json();
  assert(personalEmailSponsorResponse.status === 200 && personalEmailSponsorPayload.ok, "Sponsor lead endpoint should accept one-field email requests even when a website cannot be inferred");
  const personalEmailSponsorLead = JSON.parse(store.data.get(`sponsor:lead:${personalEmailSponsorPayload.id}`));
  assert(personalEmailSponsorLead.company === "Gmail", "Sponsor lead endpoint should keep an inferred review label for personal email domains");
  assert(personalEmailSponsorLead.website === "", "Sponsor lead endpoint should not invent a sponsor website from a personal email domain");
  assert(personalEmailSponsorLead.commitment === "request-invoice", "Personal-email sponsor lead should keep invoice request commitment");
  const finalOpsMetrics = await (await opsMetricsSource.onRequestGet({ env })).json();
  const finalPrintableProject = finalOpsMetrics.projects.find((row) => row.id === "printable-tools-lab");
  assert(finalOpsMetrics.sponsorInvoiceRequests === 5, "Ops metrics should count full, quick, inferred-company, and one-field sponsor invoice requests");
  assert(finalPrintableProject.summary.sponsorInvoiceRequests === 5, "Project ops metrics should count full, quick, inferred-company, and one-field sponsor invoice requests");
  assert([...store.data.keys()].some((key) => key.startsWith("sponsor:validation:")), "Validation sponsor lead should use isolated KV keys");
  assert(Number(store.data.get("total:sponsor_lead_tests")) === 1, "Validation sponsor lead should count only validation tests");
  const githubPages = sellerMetrics.sources.find((row) => row.source === "github-pages");
  assert(githubPages.page_view === 1, "Metrics should count GitHub Pages page views by source");
  assert(githubPages.seller_checkout_intent === 1, "Metrics should count seller intent by source");
  assert(githubPages.seller_checkout_click === 1, "Metrics should count seller checkout clicks by source");
  assert(githubPages.service_request_intent === 1, "Metrics should count beacon service intent by source");
  assert(githubPages.audit_request_intent === 2, "Metrics should count audit intent by source");
  const community = sellerMetrics.sources.find((row) => row.source === "community");
  assert(community.service_request_intent === 1, "Metrics should count service intent by source");
  assert(community.service_checkout_click === 1, "Metrics should count service checkout clicks by source");
  const direct = sellerMetrics.sources.find((row) => row.source === "direct");
  assert(direct.service_request_intent === 1, "Metrics should count copied service intent by source");
  assert(direct.audit_request_intent === 1, "Metrics should count copied audit intent by source");
  const directory = sellerMetrics.sources.find((row) => row.source === "directory");
  assert(directory.sponsor_request_intent === 1, "Metrics should count sponsor clicks by source");
  const sponsorOutreach = sellerMetrics.sources.find((row) => row.source === "sponsor-outreach");
  assert(sponsorOutreach.sponsor_request_intent === 1, "Metrics should count sponsor-call intent by outreach source");
  assert(sponsorOutreach.sponsor_lead_submit === 1, "Metrics should count sponsor lead submissions by outreach source");
  assert(sponsorOutreach.sponsor_invoice_request === 1, "Metrics should count sponsor invoice requests by outreach source");

  const serviceStore = new MemoryStore();
  const serviceEnv = { PTL_EVENTS: serviceStore, PTL_METRICS_BASELINE: "off" };
  const customServiceResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.30" },
      body: JSON.stringify(serviceLeadBody({
        serviceType: "custom-local-print-pack",
        source: "community",
        path: "/custom-local-print-pack/",
        utmSource: "community",
        utmCampaign: "service_request",
      })),
    }),
    env: serviceEnv,
  });
  const customServicePayload = await customServiceResponse.json();
  assert(customServiceResponse.status === 200 && customServicePayload.ok, "Service lead endpoint should accept valid custom setup requests");
  const invoiceFollowupServiceResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.34" },
      body: JSON.stringify(serviceLeadBody({
        serviceType: "invoice-followup-copy-pack",
        source: "download_success",
        path: "/tools/invoice-generator/",
        requestSummary: "Please draft a friendly invoice reminder and first overdue follow-up without private invoice or client details.",
        utmSource: "download_success",
        utmCampaign: "invoice_followup_service",
        utmContent: "invoice-generator",
      })),
    }),
    env: serviceEnv,
  });
  const invoiceFollowupServicePayload = await invoiceFollowupServiceResponse.json();
  assert(invoiceFollowupServiceResponse.status === 200 && invoiceFollowupServicePayload.ok, "Service lead endpoint should accept invoice follow-up copy requests");
  const uploadFixInvoiceRequestResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.35" },
      body: JSON.stringify(serviceLeadBody({
        serviceType: "upload-limit-fix-plan",
        source: "techtools",
        path: "/upload-error-cheatsheet/",
        requestSummary: "Please send the best upload fix settings and fallback checklist for a public-safe PDF size error.",
        requestedNextStep: "Request external $9 checkout or invoice link after fit is confirmed",
        invoiceLinkRequest: true,
        utmSource: "techtools",
        utmCampaign: "upload_limit_fix_plan",
        utmContent: "upload-error-cheatsheet-invoice-request",
      })),
    }),
    env: serviceEnv,
  });
  const uploadFixInvoiceRequestPayload = await uploadFixInvoiceRequestResponse.json();
  assert(uploadFixInvoiceRequestResponse.status === 200 && uploadFixInvoiceRequestPayload.ok, "Service lead endpoint should accept explicit upload fix invoice-link requests");
  const auditServiceResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.31" },
      body: JSON.stringify(serviceLeadBody({
        serviceType: "market-table-print-audit",
        source: "github-pages",
        path: "/market-table-print-audit/",
        requestSummary: "Please check whether my table prices and QR sign wording are clear before Saturday.",
      })),
    }),
    env: serviceEnv,
  });
  const auditServicePayload = await auditServiceResponse.json();
  assert(auditServiceResponse.status === 200 && auditServicePayload.ok, "Service lead endpoint should accept free audit requests");
  const sellerKitServiceResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.32" },
      body: JSON.stringify(serviceLeadBody({
        serviceType: "local-seller-starter-kit",
        source: "direct",
        path: "/local-seller-starter-kit/",
        requestSummary: "Please send the checkout link when the local seller starter kit is ready.",
      })),
    }),
    env: serviceEnv,
  });
  const sellerKitServicePayload = await sellerKitServiceResponse.json();
  assert(sellerKitServiceResponse.status === 200 && sellerKitServicePayload.ok, "Service lead endpoint should accept seller kit checkout requests");
  assert(serviceStore.data.has(`service:lead:${customServicePayload.id}`), "Service lead should be stored privately in KV");
  assert(serviceStore.data.has(`service:lead:${invoiceFollowupServicePayload.id}`), "Invoice follow-up service lead should be stored privately in KV");
  assert(serviceStore.data.has(`service:lead:${uploadFixInvoiceRequestPayload.id}`), "Upload fix invoice-link request should be stored privately in KV");
  assert(serviceStore.data.has(`service:lead:${auditServicePayload.id}`), "Audit lead should be stored privately in KV");
  assert(serviceStore.data.has(`service:lead:${sellerKitServicePayload.id}`), "Seller kit lead should be stored privately in KV");
  const storedServiceLead = JSON.parse(serviceStore.data.get(`service:lead:${customServicePayload.id}`));
  assert(storedServiceLead.contact === "buyer@example.com", "Service lead should store normalized private contact");
  assert(storedServiceLead.serviceType === "custom-local-print-pack", "Service lead should persist service type");
  assert(storedServiceLead.utmCampaign === "service_request", "Service lead should preserve UTM campaign attribution");
  const storedInvoiceFollowupLead = JSON.parse(serviceStore.data.get(`service:lead:${invoiceFollowupServicePayload.id}`));
  assert(storedInvoiceFollowupLead.serviceType === "invoice-followup-copy-pack", "Invoice follow-up lead should persist service type");
  assert(storedInvoiceFollowupLead.utmCampaign === "invoice_followup_service", "Invoice follow-up lead should preserve campaign attribution");
  const storedUploadFixInvoiceLead = JSON.parse(serviceStore.data.get(`service:lead:${uploadFixInvoiceRequestPayload.id}`));
  assert(storedUploadFixInvoiceLead.invoiceLinkRequest === true, "Upload fix invoice-link request should persist explicit invoice intent");
  assert(storedUploadFixInvoiceLead.requestedNextStep.includes("$9"), "Upload fix invoice-link request should persist the external $9 next step");
  const serviceLeadIndex = JSON.parse(serviceStore.data.get(`service:lead_index:${storedServiceLead.createdAt.slice(0, 7)}`));
  assert(serviceLeadIndex.length === 5, "Service lead index should include custom service, invoice follow-up, upload invoice, audit, and seller kit rows");
  const publicServiceLeadSummary = await (await serviceLeadSource.onRequestGet({ env: serviceEnv })).json();
  const publicServiceLeadSummaryText = JSON.stringify(publicServiceLeadSummary);
  assert(publicServiceLeadSummary.ok && publicServiceLeadSummary.dataQuality === "lead-index", "Service lead GET should expose a public-safe lead index summary");
  assert(publicServiceLeadSummary.leadCount === 5, "Service lead GET should count indexed service leads");
  assert(publicServiceLeadSummary.serviceRequestCount === 3, "Service lead GET should count paid setup, invoice follow-up, and upload fix requests");
  assert(publicServiceLeadSummary.serviceInvoiceRequestCount === 1, "Service lead GET should count explicit invoice-link requests without exposing private contact");
  assert(publicServiceLeadSummary.auditRequestCount === 1, "Service lead GET should count audit requests");
  assert(publicServiceLeadSummary.sellerKitRequestCount === 1, "Service lead GET should count seller kit requests");
  assert(publicServiceLeadSummary.serviceTypes["custom-local-print-pack"] === 1, "Service lead GET should count custom service type");
  assert(publicServiceLeadSummary.serviceTypes["invoice-followup-copy-pack"] === 1, "Service lead GET should count invoice follow-up service type");
  assert(!publicServiceLeadSummaryText.includes("buyer@example.com"), "Service lead GET should not expose private contact");
  assert(!publicServiceLeadSummaryText.includes("Example Market Booth"), "Service lead GET should not expose business name");
  assert(!publicServiceLeadSummaryText.includes("Please assemble"), "Service lead GET should not expose request notes");
  const serviceMetrics = await (await metricsSource.onRequestGet({ env: serviceEnv })).json();
  const serviceMetricsService = serviceMetrics.tools.find((row) => row.tool === "custom-local-print-pack");
  const serviceMetricsInvoiceFollowup = serviceMetrics.tools.find((row) => row.tool === "invoice-followup-copy-pack");
  const serviceMetricsAudit = serviceMetrics.tools.find((row) => row.tool === "market-table-print-audit");
  const serviceMetricsSeller = serviceMetrics.tools.find((row) => row.tool === "local-seller-starter-kit");
  assert(serviceMetricsService.service_request_intent === 1, "Metrics should count service lead submissions as service request intent");
  assert(serviceMetricsInvoiceFollowup.service_request_intent === 1, "Metrics should count invoice follow-up submissions as service request intent");
  assert(serviceMetrics.tools.find((row) => row.tool === "upload-limit-fix-plan").service_invoice_request === 1, "Metrics should count service lead invoice-link submissions as service invoice requests");
  assert(serviceMetricsAudit.audit_request_intent === 1, "Metrics should count audit lead submissions as audit request intent");
  assert(serviceMetricsSeller.seller_checkout_intent === 1, "Metrics should count seller kit lead submissions as checkout intent");
  assert(serviceMetrics.commercialIntent === 5, "Commercial intent should include service, invoice follow-up, invoice-link, audit, and seller lead submissions");
  const serviceOpsMetrics = await (await opsMetricsSource.onRequestGet({ env: serviceEnv })).json();
  const servicePrintableProject = serviceOpsMetrics.projects.find((row) => row.id === "printable-tools-lab");
  assert(servicePrintableProject.summary.commercialIntent === 5, "Ops metrics should count service lead submissions in commercial intent");
  assert(servicePrintableProject.summary.serviceRequestIntent === 3, "Ops metrics should separate paid service lead submissions from audit intent");
  assert(servicePrintableProject.summary.serviceInvoiceRequests === 1, "Ops metrics should expose invoice-link service lead submissions as close actions");
  assert(servicePrintableProject.summary.auditRequestIntent === 1, "Ops metrics should separate audit lead submissions from paid service intent");
  assert(servicePrintableProject.nextAction.includes("Service invoice request present"), "Ops project next action should prioritize explicit invoice-link requests before softer service intent");
  assert(servicePrintableProject.tools.find((row) => row.tool === "custom-local-print-pack").service_request_intent === 1, "Ops metrics should count the custom service lead tool row");
  assert(servicePrintableProject.tools.find((row) => row.tool === "invoice-followup-copy-pack").service_request_intent === 1, "Ops metrics should count the invoice follow-up service lead tool row");
  assert(servicePrintableProject.tools.find((row) => row.tool === "upload-limit-fix-plan").service_invoice_request === 1, "Ops metrics should count the upload fix invoice-link tool row");
  assert(servicePrintableProject.paths.find((row) => row.path === "/tools/invoice-generator/").service_request_intent === 1, "Ops metrics should count invoice follow-up leads by source path");
  assert(servicePrintableProject.paths.find((row) => row.path === "/upload-error-cheatsheet/").service_invoice_request === 1, "Ops metrics should count invoice-link requests by source path");
  const serviceLeadWriteLimitedStore = new MemoryStore({ failWritesWith: "KV put() limit exceeded for the day." });
  const serviceLeadWriteLimitedResponse = await serviceLeadSource.onRequestPost({
    request: new Request("https://example.test/api/service-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.33" },
      body: JSON.stringify(serviceLeadBody({ businessName: "Fallback Service Buyer", contact: "fallback-service@example.com" })),
    }),
    env: { PTL_EVENTS: serviceLeadWriteLimitedStore },
  });
  const serviceLeadWriteLimitedPayload = await serviceLeadWriteLimitedResponse.json();
  assert(serviceLeadWriteLimitedResponse.status === 503, "Service lead endpoint should not claim success when private lead storage is unavailable");
  assert(serviceLeadWriteLimitedPayload.fallbackRequired, "Service lead endpoint should ask for a backup request when storage is unavailable");
  assert(serviceLeadWriteLimitedPayload.fallbackBody.includes("Fallback Service Buyer"), "Service lead fallback should include the normalized business name");
  assert(serviceLeadWriteLimitedPayload.fallbackBody.includes("fallback-service@example.com"), "Service lead fallback should include the normalized contact");
  assertServicePublicReplyUrl(serviceLeadWriteLimitedPayload.fallbackPublicReplyUrl, "Service lead fallback");
  assert(!String(serviceLeadWriteLimitedPayload.fallbackPublicReplyUrl || "").includes("fallback-service%40example.com"), "Service lead public fallback URL should not expose private contact");
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
    this.putCount = 0;
    this.failWritesWith = options.failWritesWith || "";
    this.failWritesAfter = Number.isInteger(options.failWritesAfter) ? options.failWritesAfter : null;
    this.failReadsWith = options.failReadsWith || "";
  }

  async get(key) {
    if (this.failReadsWith) throw new Error(this.failReadsWith);
    this.getCount += 1;
    return this.data.get(key) || null;
  }

  async put(key, value, options) {
    if (this.failWritesWith && (this.failWritesAfter === null || this.putCount >= this.failWritesAfter)) {
      throw new Error(this.failWritesWith);
    }
    if (arguments.length >= 3 && options === undefined) {
      throw new Error(`Invalid undefined options for ${key}`);
    }
    if (options && Object.prototype.hasOwnProperty.call(options, "expirationTtl") && options.expirationTtl === undefined) {
      throw new Error(`Invalid undefined expirationTtl for ${key}`);
    }
    this.putCount += 1;
    this.data.set(key, value);
  }
}

function sponsorLeadBody(overrides = {}) {
  return {
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
    ...overrides,
  };
}

function serviceLeadBody(overrides = {}) {
  return {
    serviceType: "custom-local-print-pack",
    businessName: "Example Market Booth",
    contact: "buyer@example.com",
    requestSummary: "Please assemble a small market table print pack with price tags, QR wording, flyer copy, and pickup notes.",
    needBy: "this month",
    source: "direct",
    path: "/custom-local-print-pack/",
    consent: true,
    ...overrides,
  };
}

function assertSponsorPublicReplyUrl(value, label) {
  const text = String(value || "");
  assert(text.includes("https://github.com/yanqr213/printable-tools-lab/issues/new?"), `${label} should include a public-safe reply URL`);
  assert(!text.includes("template=sponsor-partner-inquiry.yml"), `${label} should not use the YAML issue form because it cannot reliably preserve the prefilled body`);
  assert(text.includes("body=Public-safe+sponsor+reply"), `${label} should prefill the public-safe issue body`);
  assert(text.includes("labels=sponsor%2Cpartner%2Cbusiness-review"), `${label} should pre-label the sponsor issue`);
}

function assertServicePublicReplyUrl(value, label) {
  const text = String(value || "");
  assert(text.includes("https://github.com/yanqr213/printable-tools-lab/issues/new?"), `${label} should include a public-safe service URL`);
  assert(text.includes("body=Public-safe+service+request"), `${label} should prefill the public-safe service issue body`);
  assert(text.includes("labels=service-request%2Cbusiness-review"), `${label} should pre-label the service issue`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
