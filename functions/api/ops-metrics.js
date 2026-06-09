const EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "service_invoice_request", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "service_invoice_request", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const PRINTABLE_SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "service_invoice_request", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const GAME_EVENTS = ["page_view", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const SOURCES = ["direct", "google", "bing", "github", "github-pages", "github-issue", "gist", "zearches", "listai", "techtools", "nosignuptools", "freenosignup", "nologin", "nosubscription", "share-kit", "download_success", "short-video", "game-platform", "sponsor-outreach", "directory", "community", "referral", "embed", "publisher", "platform-review"];
const PRINTABLE_TOOLS = ["site", "sponsor", "compress-pdf", "compress-image", "compress-image-to-kb", "invoice-generator", "receipt-generator", "qr-code", "wifi-qr-code", "ats-resume-checker", "resume-builder", "pdf-to-word", "local-seller-starter-kit", "custom-local-print-pack", "invoice-followup-copy-pack", "upload-limit-fix-plan", "market-table-print-audit"];
const GAME_TOOLS = ["pocket-arcade-shelf", "game-portal", "spell-sigil-duel", "ember-crypt-rogue", "turbo-diner-shift", "cascade-mini-golf", "prism-pinball-heist", "penalty-fever-arena", "pixel-potion-clicker", "skyhook-obby-rush", "orbital-bubble-forge", "crystal-current-match", "signal-rail-sprint", "starfall-salvage", "lumen-grove-keeper", "echo-archive-mystery", "neon-drift-outlaw", "verdant-gridworks", "void-glyph-cards", "shadow-vault-tactics", "rune-forge-atelier"];
const PATH_EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "seller_checkout_click", "service_checkout_click", "service_request_intent", "service_invoice_request", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_OPS_PATHS = [
  "/",
  "/invoice-followup-copy-pack/",
  "/upload-limit-fix-plan/",
  "/upload-error-cheatsheet/",
  "/file-must-be-less-than-1mb/",
  "/pdf-must-be-under-500kb/",
  "/pdf-must-be-under-2mb/",
  "/pdf-must-be-under-5mb/",
  "/resume-pdf-too-large/",
  "/resume-pdf-under-2mb/",
  "/document-must-be-under-5mb/",
  "/photo-must-be-under-100kb/",
  "/image-must-be-less-than-2mb/",
  "/image-must-be-under-500kb/",
  "/jpg-must-be-under-200kb/",
  "/png-screenshot-too-large/",
  "/image-dimensions-600x600/",
  "/pdf-not-accepted-jpg-required/",
  "/email-attachment-too-large/",
  "/polite-payment-reminder-email/",
  "/freelance-invoice-follow-up-email/",
  "/overdue-invoice-reminder-email/",
  "/tools/invoice-followup-email/",
  "/tools/invoice-generator/",
  "/free-pdf-tools/",
  "/pdf-tool-finder/",
  "/sponsor/",
  "/sponsor-call/",
  "/sponsor-opportunities/",
  "/tools/compress-pdf/",
  "/tools/qr-code/",
  "/upload-limit-fixer/",
  "/custom-local-print-pack/",
  "/market-table-print-audit/",
  "/local-seller-starter-kit/",
  "/pdf-size-reducer/",
  "/compress-image-no-upload/",
  "/resize-image-no-upload/",
  "/convert-image-format-no-upload/",
  "/remove-background-no-upload/",
  "/crop-image-no-upload/",
  "/rotate-image-no-upload/",
  "/watermark-image-no-upload/",
  "/compress-pdf-no-upload/",
  "/pdf-to-jpg-no-upload/",
  "/jpg-to-pdf-no-upload/",
  "/extract-text-from-pdf-no-upload/",
  "/merge-pdf-no-upload/",
  "/split-pdf-no-upload/",
  "/rotate-pdf-no-upload/",
  "/remove-pages-from-pdf-no-upload/",
  "/reorder-pdf-pages-no-upload/",
  "/add-page-numbers-to-pdf/",
  "/stamp-pdf-no-upload/",
  "/sign-pdf-no-upload/",
  "/compress-image-to-10kb/",
  "/compress-image-to-20kb/",
  "/compress-image-to-30kb/",
  "/compress-image-to-50kb/",
  "/compress-image-to-100kb/",
  "/compress-image-to-150kb/",
  "/compress-image-to-200kb/",
  "/compress-image-to-300kb/",
  "/compress-image-to-500kb/",
  "/compress-jpg-to-50kb/",
  "/compress-jpg-to-100kb/",
  "/compress-jpg-to-200kb/",
  "/compress-png-to-50kb/",
  "/compress-png-to-100kb/",
  "/compress-png-to-200kb/",
  "/passport-photo-compress-to-50kb/",
  "/passport-photo-compress-to-100kb/",
  "/passport-photo-compress-to-200kb/",
  "/image-size-reducer-in-kb/",
  "/passport-photo-size-fixer/",
  "/passport-photo-maker/",
  "/passport-photo-35x45mm/",
  "/photo-200x230-50kb/",
  "/signature-under-20kb/",
  "/signature-under-50kb/",
  "/resize-signature-140x60/",
  "/resize-signature-200x100/",
  "/resize-photo-200x230/",
  "/resize-photo-413x531/",
  "/resize-image-512x512/",
  "/resize-image-1080x1080/",
  "/compress-pdf-to-500kb/",
  "/compress-pdf-to-1mb/",
  "/compress-pdf-to-2mb/",
  "/compress-pdf-to-5mb/",
];

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
    paths: PRINTABLE_OPS_PATHS,
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
          "/": {
            page_view: 494,
          },
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
            "/": {
              page_view: 92,
            },
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
  const sources = sourceRows(SOURCES, EVENTS, combined.totals.sources, combined.today.sources);
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
    sources,
    projects,
    revenueGate: "Revenue is real only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals.",
    nextActions: opsNextActions(totals, todayTotals, projects),
  });
}

function projectMetrics(project, today, combined) {
  const projectRollup = normalizeBucket(combined.totals.projects[project.id]);
  const todayProjectRollup = normalizeBucket(combined.today.projects[project.id]);
  const totals = entriesFromEvents(project.events, project.legacy ? combined.totals.events : projectRollup.events);
  const todayTotals = entriesFromEvents(project.events, project.legacy ? combined.today.events : todayProjectRollup.events);
  const toolsBucket = project.legacy ? combined.totals.tools : projectRollup.tools;
  const todayToolsBucket = project.legacy ? combined.today.tools : todayProjectRollup.tools;
  const sourcesBucket = project.legacy ? combined.totals.sources : projectRollup.sources;
  const todaySourcesBucket = project.legacy ? combined.today.sources : todayProjectRollup.sources;
  const pathsBucket = project.legacy ? projectRollup.paths : projectRollup.paths;
  const todayPathsBucket = project.legacy ? todayProjectRollup.paths : todayProjectRollup.paths;
  const summary = {
    pageViews: totals.page_view || 0,
    todayPageViews: todayTotals.page_view || 0,
    downloads: (totals.download_pdf || 0) + (totals.download_file || 0),
    todayDownloads: (todayTotals.download_pdf || 0) + (todayTotals.download_file || 0),
    generations: (totals.generate_pdf || 0) + (totals.generate_file || 0),
    todayGenerations: (todayTotals.generate_pdf || 0) + (todayTotals.generate_file || 0),
    depthIntent: (totals.free_tool_depth || 0) + (totals.guide_depth || 0),
    todayDepthIntent: (todayTotals.free_tool_depth || 0) + (todayTotals.guide_depth || 0),
    commercialIntent: commercialIntent(totals),
    todayCommercialIntent: commercialIntent(todayTotals),
    serviceRequestIntent: (totals.service_request_intent || 0) + (totals.seller_checkout_intent || 0),
    todayServiceRequestIntent: (todayTotals.service_request_intent || 0) + (todayTotals.seller_checkout_intent || 0),
    serviceInvoiceRequests: totals.service_invoice_request || 0,
    todayServiceInvoiceRequests: todayTotals.service_invoice_request || 0,
    auditRequestIntent: totals.audit_request_intent || 0,
    todayAuditRequestIntent: todayTotals.audit_request_intent || 0,
    sponsorLeads: project.id === "printable-tools-lab" ? (totals.sponsor_lead_submit || 0) : 0,
    todaySponsorLeads: project.id === "printable-tools-lab" ? (todayTotals.sponsor_lead_submit || 0) : 0,
    sponsorInvoiceRequests: project.id === "printable-tools-lab" ? (totals.sponsor_invoice_request || 0) : 0,
    todaySponsorInvoiceRequests: project.id === "printable-tools-lab" ? (todayTotals.sponsor_invoice_request || 0) : 0,
    gamePlayIntent: totals.game_play_intent || 0,
    todayGamePlayIntent: todayTotals.game_play_intent || 0,
    gameFullscreenOpen: totals.game_fullscreen_open || 0,
    todayGameFullscreenOpen: todayTotals.game_fullscreen_open || 0,
    gameEmbedOpen: totals.game_embed_open || 0,
    todayGameEmbedOpen: todayTotals.game_embed_open || 0,
  };
  return {
    id: project.id,
    name: project.name,
    url: project.url,
    goal: project.goal,
    totals,
    todayTotals,
    summary,
    nextAction: projectNextAction(project, summary),
    sources: sourceRows(SOURCES, project.sourceEvents, sourcesBucket, todaySourcesBucket),
    paths: pathRows(project.paths, PATH_EVENTS, pathsBucket, todayPathsBucket),
    tools: project.tools.map((tool) => {
      const row = { tool };
      for (const event of project.events) {
        row[event] = countNested(toolsBucket, tool, event);
        row[`today_${event}`] = countNested(todayToolsBucket, tool, event);
      }
      return row;
    }),
  };
}

function sourceRows(sources, events, totalsBucket, todayBucket) {
  return sources.map((source) => {
    const row = { source };
    for (const event of events) {
      row[event] = countNested(totalsBucket, source, event);
      row[`today_${event}`] = countNested(todayBucket, source, event);
    }
    return row;
  });
}

function pathRows(seedPaths, events, totalsBucket, todayBucket) {
  const keys = new Set(seedPaths);
  for (const path of Object.keys(totalsBucket || {})) keys.add(path);
  for (const path of Object.keys(todayBucket || {})) keys.add(path);
  return Array.from(keys).map((path) => {
    const row = { path };
    for (const event of events) {
      row[event] = countPathEvent(totalsBucket, path, event);
      row[`today_${event}`] = countPathEvent(todayBucket, path, event);
    }
    return row;
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

function countPathEvent(container, path, event) {
  const value = container?.[path];
  if (isObject(value)) return Number(value[event]) || 0;
  return event === "page_view" ? Number(value) || 0 : 0;
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
    + (totals.seller_checkout_click || 0)
    + (totals.service_checkout_click || 0)
    + (totals.service_request_intent || 0)
    + (totals.service_invoice_request || 0)
    + (totals.audit_request_intent || 0)
    + (totals.sponsor_request_intent || 0)
    + (totals.sponsor_lead_submit || 0)
    + (totals.sponsor_invoice_request || 0);
}

function opsNextActions(totals, todayTotals, projects) {
  const actions = [];
  const sponsorLeads = totals.sponsor_lead_submit || 0;
  const sponsorInvoices = totals.sponsor_invoice_request || 0;
  const sponsorIntent = totals.sponsor_request_intent || 0;
  const serviceInvoiceRequests = totals.service_invoice_request || 0;
  const todayServiceInvoiceRequests = todayTotals.service_invoice_request || 0;
  const serviceIntent = (totals.service_request_intent || 0) + (totals.seller_checkout_intent || 0);
  const todayServiceIntent = (todayTotals.service_request_intent || 0) + (todayTotals.seller_checkout_intent || 0);
  const auditIntent = totals.audit_request_intent || 0;
  const todayViews = todayTotals.page_view || 0;
  const downloads = (totals.download_pdf || 0) + (totals.download_file || 0);
  const gameProject = projects.find((project) => project.id === "pocket-arcade-shelf");
  if (sponsorInvoices > 0) actions.push("Export private sponsor leads and send only a real external invoice or agreement after policy review.");
  else if (sponsorLeads > 0) actions.push("Reply to qualified sponsor leads with the selected pilot deal and do not count revenue until agreement or settled payment.");
  if (serviceInvoiceRequests > 0) actions.push(`${todayServiceInvoiceRequests > 0 ? "Fresh service invoice request today" : "Service invoice request exists"}; export or open the public request, confirm fit, then send the matching external $9 or $19 checkout link.`);
  else if (serviceIntent > 0) actions.push(`${todayServiceIntent > 0 ? "Fresh service request intent today" : "Service request intent exists"}; keep the one-reply-contact path primary, then send the matching external $9 or $19 checkout only after a qualified reply.`);
  else if (auditIntent > 0) actions.push("Audit intent exists; reply with the free audit first, then offer the external $29 custom print pack only after fit is clear.");
  if (sponsorInvoices === 0 && sponsorLeads === 0 && sponsorIntent > 0) actions.push("Sponsor clicks exist without lead capture; send the starter review proposal to the highest-fit sponsor prospects.");
  else if (downloads > 0 || todayViews >= 50) actions.push("Traffic exists; push one sponsor vertical tied to the warmest PDF, QR, resume, or paperwork path.");
  if (gameProject?.summary?.gamePlayIntent > 0) actions.push("Game play intent exists; continue platform submission and monitor embed/fullscreen rows for revenue-share readiness.");
  if (!actions.length) actions.push("Keep distribution running and watch for the first download, sponsor intent, game play, or search signal.");
  return actions;
}

function projectNextAction(project, summary) {
  if (project.id === "pocket-arcade-shelf") {
    if (summary.todayGamePlayIntent || summary.todayGameFullscreenOpen || summary.todayGameEmbedOpen) return "Fresh game traffic today: submit or update the strongest platform listing and track embed/fullscreen intent.";
    if (summary.gamePlayIntent || summary.gameFullscreenOpen || summary.gameEmbedOpen) return "Game intent exists: keep platform outreach active and compare source rows before adding new games.";
    return "No game play signal yet: prioritize distribution and platform review over more game inventory.";
  }
  if (summary.todaySponsorInvoiceRequests || summary.sponsorInvoiceRequests) return "Invoice request present: export private sponsor lead details and move only external agreement or settled payment into revenue.";
  if (summary.todaySponsorLeads || summary.sponsorLeads) return "Sponsor lead present: review fit, reply with the selected deal, and keep unsafe categories out.";
  if (summary.todayServiceInvoiceRequests || summary.serviceInvoiceRequests) return "Service invoice request present: confirm fit and send the matching external $9 or $19 checkout link.";
  if (summary.todayServiceRequestIntent || summary.serviceRequestIntent) return "Service request intent exists: keep the one-contact form primary and send the external $9 or $19 checkout only after a qualified reply.";
  if (summary.todayAuditRequestIntent || summary.auditRequestIntent) return "Audit intent exists: deliver the free audit path, then offer the external $29 setup only after fit is clear.";
  if (summary.todayCommercialIntent || summary.commercialIntent) return "Commercial intent exists: route warm sponsor clicks into the USD 49 starter review path.";
  if (summary.todayDownloads || summary.downloads) return "Downloads exist: pitch sponsors around the warmest utility family while search and ad gates mature.";
  if (summary.todayPageViews || summary.pageViews) return "Traffic exists but conversion is thin: test one targeted sponsor proposal against the warmest page family.";
  return "No meaningful signal yet: keep organic distribution active and avoid adding monetization clutter.";
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
