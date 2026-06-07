const EVENTS = ["page_view", "generate_pdf", "download_pdf", "generate_file", "download_file", "free_tool_depth", "guide_depth", "limit_hit", "ai_ideas", "ai_ideas_apply", "seller_sample_download", "seller_checkout_intent", "seller_checkout_click", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_sample_download", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_invoice_request"];
const TOOL_EVENTS = ["generate_pdf", "download_pdf", "generate_file", "download_file", "free_tool_depth", "limit_hit", "seller_sample_download", "seller_checkout_intent", "service_request_intent", "audit_request_intent"];
const PRINTABLE_TOOL_EVENTS = [...TOOL_EVENTS, "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const GAME_EVENTS = ["page_view", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_TOOLS = [
  "invoice-generator",
  "estimate-generator",
  "purchase-order",
  "bill-of-sale",
  "business-card",
  "address-labels",
  "price-tag",
  "flyer-maker",
  "barcode-labels",
  "coupon-maker",
  "packing-slip",
  "work-order",
  "inventory-sheet",
  "resume-builder",
  "ats-resume-checker",
  "cover-letter",
  "resignation-letter",
  "monthly-calendar",
  "meal-planner",
  "image-to-pdf",
  "multi-image-pdf",
  "compress-pdf",
  "pdf-to-images",
  "pdf-to-text",
  "pdf-to-word",
  "compress-image",
  "compress-image-to-kb",
  "resize-image",
  "convert-image",
  "remove-background",
  "crop-image",
  "rotate-image",
  "watermark-image",
  "add-text-image",
  "signature-png",
  "passport-photo",
  "qr-code",
  "wifi-qr-code",
  "vcard-qr-code",
  "merge-pdf",
  "split-pdf",
  "pdf-page-numbers",
  "rotate-pdf",
  "remove-pdf-pages",
  "reorder-pdf-pages",
  "watermark-pdf",
  "stamp-pdf",
  "sign-pdf",
  "text-to-pdf",
  "markdown-to-pdf",
  "csv-to-pdf",
  "json-to-pdf",
  "sign-in-sheet",
  "graph-paper",
  "packing-list",
  "receipt-generator",
  "timesheet-generator",
  "certificate-generator",
  "todo-list",
  "rent-receipt",
  "name-tracing",
  "chore-chart",
  "reward-chart",
  "flashcards",
  "weekly-planner",
  "habit-tracker",
  "local-seller-starter-kit",
  "custom-local-print-pack",
  "market-table-print-audit",
  "sponsor",
];
const SOURCES = [
  "direct",
  "google",
  "bing",
  "github",
  "github-pages",
  "github-issue",
  "gist",
  "zearches",
  "listai",
  "techtools",
  "nosignuptools",
  "freenosignup",
  "nologin",
  "nosubscription",
  "share-kit",
  "short-video",
  "game-platform",
  "sponsor-outreach",
  "directory",
  "community",
  "referral",
];

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Metrics store unavailable" }, 503);
  const today = new Date().toISOString().slice(0, 10);
  const rollup = await readRollup(env.PTL_EVENTS, today);
  const count = async (key) => Number(await env.PTL_EVENTS.get(key)) || 0;
  const [totalEntries, todayEntries, sponsorLeads, todaySponsorLeads, sponsorInvoiceRequests, todaySponsorInvoiceRequests, tools, sources] = await Promise.all([
    Promise.all(EVENTS.map(async (event) => [event, await count(`total:event:${event}`) + countFrom(rollup.totals.events, event)])),
    Promise.all(EVENTS.map(async (event) => [event, await count(`day:${today}:event:${event}`) + countFrom(rollup.today.events, event)])),
    count("total:sponsor_leads"),
    count(`day:${today}:sponsor_leads`),
    count("total:sponsor_invoice_requests"),
    count(`day:${today}:sponsor_invoice_requests`),
    Promise.all(PRINTABLE_TOOLS.map(async (tool) => {
      const eventEntries = await Promise.all(
        TOOL_EVENTS.map(async (event) => [
          event,
          await count(`total:tool:${tool}:event:${event}`) + countNested(rollup.totals.tools, tool, event),
        ]),
      );
      const row = { tool, ...Object.fromEntries(eventEntries) };
      if (tool === "sponsor") row.sponsor_request_intent = await count(`total:tool:${tool}:event:sponsor_request_intent`) + countNested(rollup.totals.tools, tool, "sponsor_request_intent");
      if (tool === "sponsor") row.sponsor_lead_submit = await count(`total:tool:${tool}:event:sponsor_lead_submit`) + countNested(rollup.totals.tools, tool, "sponsor_lead_submit");
      if (tool === "sponsor") row.sponsor_invoice_request = await count(`total:tool:${tool}:event:sponsor_invoice_request`) + countNested(rollup.totals.tools, tool, "sponsor_invoice_request");
      return row;
    })),
    Promise.all(SOURCES.map(async (source) => {
      const totalSourceEntries = await Promise.all(SOURCE_EVENTS.map(async (event) => [
        event,
        await count(`total:source:${source}:event:${event}`) + countNested(rollup.totals.sources, source, event),
      ]));
      return { source, ...Object.fromEntries(totalSourceEntries) };
    })),
  ]);
  const totals = Object.fromEntries(totalEntries);
  return json({
    ok: true,
    today,
    totals,
    todayTotals: Object.fromEntries(todayEntries),
    totalDownloads: (totals.download_pdf || 0) + (totals.download_file || 0),
    totalGenerations: (totals.generate_pdf || 0) + (totals.generate_file || 0),
    freeToolDepthIntent: (totals.free_tool_depth || 0) + (totals.guide_depth || 0),
    sponsorLeads,
    todaySponsorLeads,
    sponsorInvoiceRequests: sponsorInvoiceRequests + countFrom(rollup.totals.events, "sponsor_invoice_request"),
    todaySponsorInvoiceRequests: todaySponsorInvoiceRequests + countFrom(rollup.today.events, "sponsor_invoice_request"),
    commercialIntent:
      (totals.seller_checkout_intent || 0)
      + (totals.seller_checkout_click || 0)
      + (totals.service_request_intent || 0)
      + (totals.audit_request_intent || 0)
      + (totals.sponsor_request_intent || 0)
      + (totals.sponsor_lead_submit || 0)
      + (totals.sponsor_invoice_request || 0),
    tools,
    sources,
  });
}

async function readRollup(store, today) {
  const month = today.slice(0, 7);
  const data = safeJson(await store.get(`rollup:${month}`), {});
  return {
    totals: normalizeBucket(data.totals),
    today: normalizeBucket(data.today?.[today]),
  };
}

function normalizeBucket(bucket = {}) {
  return {
    events: bucket.events || {},
    tools: bucket.tools || {},
    sources: bucket.sources || {},
    projects: bucket.projects || {},
    paths: bucket.paths || {},
  };
}

function countFrom(container, key) {
  return Number(container?.[key]) || 0;
}

function countNested(container, outerKey, innerKey) {
  return Number(container?.[outerKey]?.[innerKey]) || 0;
}

function safeJson(text, fallback) {
  try {
    if (!text) return fallback;
    const value = JSON.parse(text);
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
