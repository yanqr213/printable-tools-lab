const EVENTS = ["page_view", "generate_pdf", "download_pdf", "generate_file", "download_file", "free_tool_depth", "guide_depth", "limit_hit", "ai_ideas", "ai_ideas_apply", "seller_sample_download", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_sample_download", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const TOOL_EVENTS = ["generate_pdf", "download_pdf", "generate_file", "download_file", "free_tool_depth", "limit_hit", "seller_sample_download", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "audit_request_intent"];
const PRINTABLE_TOOL_EVENTS = [...TOOL_EVENTS, "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
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
  "invoice-followup-copy-pack",
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
  "download_success",
  "short-video",
  "game-platform",
  "sponsor-outreach",
  "directory",
  "community",
  "referral",
];

const LEGACY_BASELINE = {
  capturedAt: "2026-06-07T17:00:00.000Z",
  reason: "Last verified legacy multi-key counters before metrics moved to low-read rollups.",
  totals: {
    events: {
      page_view: 494,
      download_pdf: 2,
      sponsor_request_intent: 2,
    },
    tools: {
      "invoice-generator": { download_pdf: 2 },
      sponsor: { sponsor_request_intent: 2 },
    },
    sources: {
      direct: { page_view: 494 },
      "sponsor-outreach": { sponsor_request_intent: 2 },
    },
  },
  today: {
    "2026-06-07": {
      events: {
        page_view: 92,
        sponsor_request_intent: 2,
      },
      tools: {
        sponsor: { sponsor_request_intent: 2 },
      },
      sources: {
        direct: { page_view: 92 },
        "sponsor-outreach": { sponsor_request_intent: 2 },
      },
    },
  },
};

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Metrics store unavailable" }, 503);
  const today = new Date().toISOString().slice(0, 10);
  const rollupResult = await readRollup(env.PTL_EVENTS, today);
  const combined = combineBuckets(legacyBucket(today, env), rollupResult.rollup);
  const totals = entriesFromEvents(EVENTS, combined.totals.events);
  const todayTotals = entriesFromEvents(EVENTS, combined.today.events);
  const tools = PRINTABLE_TOOLS.map((tool) => {
    const row = { tool };
    for (const event of PRINTABLE_TOOL_EVENTS) row[event] = countNested(combined.totals.tools, tool, event);
    return row;
  });
  const sources = SOURCES.map((source) => {
    const row = { source };
    for (const event of SOURCE_EVENTS) row[event] = countNested(combined.totals.sources, source, event);
    return row;
  });
  return json({
    ok: true,
    today,
    dataQuality: rollupResult.ok ? "rollup" : "degraded-baseline",
    dataWarning: rollupResult.ok ? "" : "KV rollup read failed, so this response uses the last verified baseline and may lag live activity.",
    totals,
    todayTotals,
    totalDownloads: (totals.download_pdf || 0) + (totals.download_file || 0),
    totalGenerations: (totals.generate_pdf || 0) + (totals.generate_file || 0),
    freeToolDepthIntent: (totals.free_tool_depth || 0) + (totals.guide_depth || 0),
    sponsorLeads: totals.sponsor_lead_submit || 0,
    todaySponsorLeads: todayTotals.sponsor_lead_submit || 0,
    sponsorInvoiceRequests: totals.sponsor_invoice_request || 0,
    todaySponsorInvoiceRequests: todayTotals.sponsor_invoice_request || 0,
    commercialIntent:
      (totals.seller_checkout_intent || 0)
      + (totals.seller_checkout_click || 0)
      + (totals.service_checkout_click || 0)
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
  try {
    const month = today.slice(0, 7);
    const data = safeJson(await store.get(`rollup:${month}`), {});
    return {
      ok: true,
      rollup: {
        totals: normalizeBucket(data.totals),
        today: normalizeBucket(data.today?.[today]),
      },
    };
  } catch {
    return { ok: false, rollup: emptyRollup() };
  }
}

function legacyBucket(today, env) {
  if (String(env.PTL_METRICS_BASELINE || "").toLowerCase() === "off") return emptyRollup();
  return {
    totals: normalizeBucket(LEGACY_BASELINE.totals),
    today: normalizeBucket(LEGACY_BASELINE.today[today]),
  };
}

function combineBuckets(...buckets) {
  const combined = emptyRollup();
  for (const bucket of buckets) {
    mergeBucket(combined.totals, normalizeBucket(bucket.totals));
    mergeBucket(combined.today, normalizeBucket(bucket.today));
  }
  return combined;
}

function emptyRollup() {
  return { totals: emptyBucket(), today: emptyBucket() };
}

function emptyBucket() {
  return { events: {}, tools: {}, sources: {}, projects: {}, paths: {} };
}

function normalizeBucket(bucket = {}) {
  return {
    events: isObject(bucket.events) ? bucket.events : {},
    tools: isObject(bucket.tools) ? bucket.tools : {},
    sources: isObject(bucket.sources) ? bucket.sources : {},
    projects: isObject(bucket.projects) ? bucket.projects : {},
    paths: isObject(bucket.paths) ? bucket.paths : {},
  };
}

function mergeBucket(target, source) {
  mergeCounts(target.events, source.events);
  mergeNestedCounts(target.tools, source.tools);
  mergeNestedCounts(target.sources, source.sources);
  mergeProjectBuckets(target.projects, source.projects);
  mergePathCounts(target.paths, source.paths);
}

function mergeProjectBuckets(target, source) {
  for (const [project, bucket] of Object.entries(source || {})) {
    if (!target[project]) target[project] = emptyBucket();
    mergeBucket(target[project], normalizeBucket(bucket));
  }
}

function mergeCounts(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    target[key] = (Number(target[key]) || 0) + (Number(value) || 0);
  }
}

function mergeNestedCounts(target, source) {
  for (const [outerKey, values] of Object.entries(source || {})) {
    if (!target[outerKey]) target[outerKey] = {};
    mergeCounts(target[outerKey], values);
  }
}

function mergePathCounts(target, source) {
  for (const [path, value] of Object.entries(source || {})) {
    if (isObject(value)) {
      if (!isObject(target[path])) target[path] = {};
      mergeCounts(target[path], value);
    } else {
      if (!isObject(target[path])) target[path] = {};
      target[path].page_view = (Number(target[path].page_view) || 0) + (Number(value) || 0);
    }
  }
}

function entriesFromEvents(events, source) {
  return Object.fromEntries(events.map((event) => [event, countFrom(source, event)]));
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

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
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
