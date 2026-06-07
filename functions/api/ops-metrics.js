const EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const PRINTABLE_SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const GAME_EVENTS = ["page_view", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const SOURCES = ["direct", "google", "bing", "github", "github-pages", "github-issue", "gist", "zearches", "listai", "techtools", "nosignuptools", "freenosignup", "nologin", "nosubscription", "share-kit", "short-video", "game-platform", "sponsor-outreach", "directory", "community", "referral", "embed", "publisher", "platform-review"];
const PRINTABLE_TOOLS = ["site", "sponsor", "compress-pdf", "compress-image", "compress-image-to-kb", "invoice-generator", "receipt-generator", "qr-code", "wifi-qr-code", "ats-resume-checker", "resume-builder", "pdf-to-word", "local-seller-starter-kit", "custom-local-print-pack", "market-table-print-audit"];
const GAME_TOOLS = ["pocket-arcade-shelf", "game-portal", "spell-sigil-duel", "ember-crypt-rogue", "turbo-diner-shift", "cascade-mini-golf", "prism-pinball-heist", "penalty-fever-arena", "pixel-potion-clicker", "skyhook-obby-rush", "orbital-bubble-forge", "crystal-current-match", "signal-rail-sprint", "starfall-salvage", "lumen-grove-keeper", "echo-archive-mystery", "neon-drift-outlaw", "verdant-gridworks", "void-glyph-cards", "shadow-vault-tactics", "rune-forge-atelier"];

const PROJECTS = [
  {
    id: "printable-tools-lab",
    name: "PrintableTools Lab",
    url: "https://printable-tools-lab.pages.dev/",
    goal: "Free browser tools, sponsor leads, and later ad-network approval.",
    legacy: true,
    events: PRINTABLE_EVENTS,
    sourceEvents: PRINTABLE_SOURCE_EVENTS,
    tools: PRINTABLE_TOOLS,
    paths: ["/", "/free-pdf-tools/", "/pdf-tool-finder/", "/sponsor/", "/sponsor-call/", "/sponsor-opportunities/", "/tools/compress-pdf/", "/tools/invoice-generator/", "/tools/qr-code/", "/upload-limit-fixer/"],
  },
  {
    id: "pocket-arcade-shelf",
    name: "Pocket Arcade Shelf",
    url: "https://pocket-arcade-shelf.pages.dev/",
    goal: "HTML5 game portal traffic, play intent, embeds, and platform revenue-share readiness.",
    events: GAME_EVENTS,
    sourceEvents: GAME_EVENTS,
    tools: GAME_TOOLS,
    paths: ["/", "/play.html", "/embed.html", "/share.html", "/press.html", ...GAME_TOOLS.slice(2, 12).map((slug) => `/game/${slug}.html`)],
  },
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
    projects: {
      "printable-tools-lab": {
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
        paths: {
          "/": 494,
        },
      },
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
      projects: {
        "printable-tools-lab": {
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
          paths: {
            "/": 92,
          },
        },
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
  const projects = PROJECTS.map((project) => projectMetrics(project, today, combined));
  return json({
    ok: true,
    today,
    dataQuality: rollupResult.ok ? "rollup" : "degraded-baseline",
    dataWarning: rollupResult.ok ? "" : "KV rollup read failed, so this response uses the last verified baseline and may lag live activity.",
    totals,
    todayTotals,
    sponsorLeads: totals.sponsor_lead_submit || 0,
    todaySponsorLeads: todayTotals.sponsor_lead_submit || 0,
    sponsorInvoiceRequests: totals.sponsor_invoice_request || 0,
    todaySponsorInvoiceRequests: todayTotals.sponsor_invoice_request || 0,
    projects,
    revenueGate: "Revenue is real only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals.",
  });
}

function projectMetrics(project, today, combined) {
  const projectRollup = normalizeBucket(combined.totals.projects[project.id]);
  const todayProjectRollup = normalizeBucket(combined.today.projects[project.id]);
  const totals = entriesFromEvents(project.events, project.legacy ? combined.totals.events : projectRollup.events);
  const todayTotals = entriesFromEvents(project.events, project.legacy ? combined.today.events : todayProjectRollup.events);
  const toolsBucket = project.legacy ? combined.totals.tools : projectRollup.tools;
  const sourcesBucket = project.legacy ? combined.totals.sources : projectRollup.sources;
  const pathsBucket = project.legacy ? projectRollup.paths : projectRollup.paths;
  const todayPathsBucket = project.legacy ? todayProjectRollup.paths : todayProjectRollup.paths;
  return {
    id: project.id,
    name: project.name,
    url: project.url,
    goal: project.goal,
    totals,
    todayTotals,
    summary: {
      pageViews: totals.page_view || 0,
      todayPageViews: todayTotals.page_view || 0,
      downloads: (totals.download_pdf || 0) + (totals.download_file || 0),
      generations: (totals.generate_pdf || 0) + (totals.generate_file || 0),
      depthIntent: (totals.free_tool_depth || 0) + (totals.guide_depth || 0),
      commercialIntent: commercialIntent(totals),
      sponsorLeads: project.id === "printable-tools-lab" ? (totals.sponsor_lead_submit || 0) : 0,
      sponsorInvoiceRequests: project.id === "printable-tools-lab" ? (totals.sponsor_invoice_request || 0) : 0,
      gamePlayIntent: totals.game_play_intent || 0,
      gameFullscreenOpen: totals.game_fullscreen_open || 0,
      gameEmbedOpen: totals.game_embed_open || 0,
    },
    sources: SOURCES.map((source) => {
      const row = { source };
      for (const event of project.sourceEvents) row[event] = countNested(sourcesBucket, source, event);
      return row;
    }),
    paths: project.paths.map((path) => ({
      path,
      page_view: countFrom(pathsBucket, path),
      today_page_view: countFrom(todayPathsBucket, path),
    })),
    tools: project.tools.map((tool) => {
      const row = { tool };
      for (const event of project.events) row[event] = countNested(toolsBucket, tool, event);
      return row;
    }),
  };
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
  mergeCounts(target.paths, source.paths);
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

function commercialIntent(totals) {
  return (totals.seller_checkout_intent || 0)
    + (totals.service_request_intent || 0)
    + (totals.audit_request_intent || 0)
    + (totals.sponsor_request_intent || 0)
    + (totals.sponsor_lead_submit || 0)
    + (totals.sponsor_invoice_request || 0);
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
