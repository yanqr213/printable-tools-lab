const EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "sponsor_invoice_request"];
const PRINTABLE_SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_invoice_request"];
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

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Metrics store unavailable" }, 503);
  const today = new Date().toISOString().slice(0, 10);
  const rollup = await readRollup(env.PTL_EVENTS, today);
  const count = async (key) => Number(await env.PTL_EVENTS.get(key)) || 0;
  const [totalEntries, todayEntries, sponsorLeads, todaySponsorLeads, sponsorInvoiceRequests, todaySponsorInvoiceRequests, projects] = await Promise.all([
    Promise.all(EVENTS.map(async (event) => [event, await count(`total:event:${event}`) + countFrom(rollup.totals.events, event)])),
    Promise.all(EVENTS.map(async (event) => [event, await count(`day:${today}:event:${event}`) + countFrom(rollup.today.events, event)])),
    count("total:sponsor_leads"),
    count(`day:${today}:sponsor_leads`),
    count("total:sponsor_invoice_requests"),
    count(`day:${today}:sponsor_invoice_requests`),
    Promise.all(PROJECTS.map((project) => projectMetrics(project, count, today, rollup))),
  ]);
  const totals = Object.fromEntries(totalEntries);
  return json({
    ok: true,
    today,
    totals,
    todayTotals: Object.fromEntries(todayEntries),
    sponsorLeads,
    todaySponsorLeads,
    sponsorInvoiceRequests: sponsorInvoiceRequests + countFrom(rollup.totals.events, "sponsor_invoice_request"),
    todaySponsorInvoiceRequests: todaySponsorInvoiceRequests + countFrom(rollup.today.events, "sponsor_invoice_request"),
    projects,
    revenueGate: "Revenue is real only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals.",
  });
}

async function projectMetrics(project, count, today, rollup) {
  const projectRollup = normalizeBucket(rollup.totals.projects[project.id]);
  const todayProjectRollup = normalizeBucket(rollup.today.projects[project.id]);
  const [totalEntries, todayEntries, toolRows, sourceRows, pathRows, sponsorLeads, sponsorInvoiceRequests] = await Promise.all([
    Promise.all(project.events.map(async (event) => [event, await count(totalEventKey(project, event)) + countFrom(projectRollup.events, event)])),
    Promise.all(project.events.map(async (event) => [event, await count(dayEventKey(project, today, event)) + countFrom(todayProjectRollup.events, event)])),
    Promise.all(project.tools.map(async (tool) => {
      const entries = await Promise.all(project.events.map(async (event) => [
        event,
        await count(totalToolKey(project, tool, event)) + countNested(projectRollup.tools, tool, event),
      ]));
      return { tool, ...Object.fromEntries(entries) };
    })),
    Promise.all(SOURCES.map(async (source) => {
      const entries = await Promise.all(project.sourceEvents.map(async (event) => [
        event,
        await count(totalSourceKey(project, source, event)) + countNested(projectRollup.sources, source, event),
      ]));
      return { source, ...Object.fromEntries(entries) };
    })),
    Promise.all(project.paths.map(async (path) => ({
      path,
      page_view: await count(totalPathKey(project, path)) + countFrom(projectRollup.paths, path),
      today_page_view: await count(dayPathKey(project, today, path)) + countFrom(todayProjectRollup.paths, path),
    }))),
    project.id === "printable-tools-lab" ? count("total:sponsor_leads") : 0,
    project.id === "printable-tools-lab" ? count("total:sponsor_invoice_requests") : 0,
  ]);
  const totals = Object.fromEntries(totalEntries);
  const todayTotals = Object.fromEntries(todayEntries);
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
      sponsorLeads,
      sponsorInvoiceRequests: sponsorInvoiceRequests + (project.id === "printable-tools-lab" ? countFrom(projectRollup.events, "sponsor_invoice_request") : 0),
      gamePlayIntent: totals.game_play_intent || 0,
      gameFullscreenOpen: totals.game_fullscreen_open || 0,
      gameEmbedOpen: totals.game_embed_open || 0,
    },
    sources: sourceRows,
    paths: pathRows,
    tools: toolRows,
  };
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

function totalEventKey(project, event) {
  return project.legacy ? `total:event:${event}` : `total:project:${project.id}:event:${event}`;
}

function dayEventKey(project, today, event) {
  return project.legacy ? `day:${today}:event:${event}` : `day:${today}:project:${project.id}:event:${event}`;
}

function totalToolKey(project, tool, event) {
  return project.legacy ? `total:tool:${tool}:event:${event}` : `total:project:${project.id}:tool:${tool}:event:${event}`;
}

function totalSourceKey(project, source, event) {
  return project.legacy ? `total:source:${source}:event:${event}` : `total:project:${project.id}:source:${source}:event:${event}`;
}

function totalPathKey(project, path) {
  return `total:project:${project.id}:path:${path}:views`;
}

function dayPathKey(project, today, path) {
  return `day:${today}:project:${project.id}:path:${path}:views`;
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
