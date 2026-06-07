const EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit", "game_play_intent", "game_fullscreen_open", "game_embed_open"];
const PRINTABLE_EVENTS = ["page_view", "download_pdf", "download_file", "generate_pdf", "generate_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent", "sponsor_lead_submit"];
const PRINTABLE_SOURCE_EVENTS = ["page_view", "download_pdf", "download_file", "free_tool_depth", "guide_depth", "seller_checkout_intent", "service_request_intent", "audit_request_intent", "sponsor_request_intent"];
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
  const count = async (key) => Number(await env.PTL_EVENTS.get(key)) || 0;
  const [totalEntries, todayEntries, sponsorLeads, todaySponsorLeads, projects] = await Promise.all([
    Promise.all(EVENTS.map(async (event) => [event, await count(`total:event:${event}`)])),
    Promise.all(EVENTS.map(async (event) => [event, await count(`day:${today}:event:${event}`)])),
    count("total:sponsor_leads"),
    count(`day:${today}:sponsor_leads`),
    Promise.all(PROJECTS.map((project) => projectMetrics(project, count, today))),
  ]);
  const totals = Object.fromEntries(totalEntries);
  return json({
    ok: true,
    today,
    totals,
    todayTotals: Object.fromEntries(todayEntries),
    sponsorLeads,
    todaySponsorLeads,
    projects,
    revenueGate: "Revenue is real only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals.",
  });
}

async function projectMetrics(project, count, today) {
  const [totalEntries, todayEntries, toolRows, sourceRows, pathRows, sponsorLeads] = await Promise.all([
    Promise.all(project.events.map(async (event) => [event, await count(totalEventKey(project, event))])),
    Promise.all(project.events.map(async (event) => [event, await count(dayEventKey(project, today, event))])),
    Promise.all(project.tools.map(async (tool) => {
      const entries = await Promise.all(project.events.map(async (event) => [
        event,
        await count(totalToolKey(project, tool, event)),
      ]));
      return { tool, ...Object.fromEntries(entries) };
    })),
    Promise.all(SOURCES.map(async (source) => {
      const entries = await Promise.all(project.sourceEvents.map(async (event) => [
        event,
        await count(totalSourceKey(project, source, event)),
      ]));
      return { source, ...Object.fromEntries(entries) };
    })),
    Promise.all(project.paths.map(async (path) => ({
      path,
      page_view: await count(totalPathKey(project, path)),
      today_page_view: await count(dayPathKey(project, today, path)),
    }))),
    project.id === "printable-tools-lab" ? count("total:sponsor_leads") : 0,
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
      gamePlayIntent: totals.game_play_intent || 0,
      gameFullscreenOpen: totals.game_fullscreen_open || 0,
      gameEmbedOpen: totals.game_embed_open || 0,
    },
    sources: sourceRows,
    paths: pathRows,
    tools: toolRows,
  };
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
    + (totals.sponsor_lead_submit || 0);
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
