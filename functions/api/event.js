const ALLOWED_EVENTS = new Set([
  "page_view",
  "generate_preview",
  "generate_pdf",
  "download_pdf",
  "generate_file",
  "download_file",
  "free_tool_depth",
  "guide_depth",
  "limit_hit",
  "ai_ideas",
  "ai_ideas_apply",
  "ai_ideas_error",
  "seller_sample_download",
  "seller_checkout_intent",
  "seller_checkout_click",
  "service_checkout_click",
  "service_request_intent",
  "audit_request_intent",
  "sponsor_request_intent",
  "game_play_intent",
  "game_fullscreen_open",
  "game_embed_open",
]);

const ALLOWED_SOURCES = new Set([
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
  "embed",
  "publisher",
  "platform-review",
]);

const ALLOWED_TOOLS = new Set([
  "site",
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
  "pocket-arcade-shelf",
  "game-portal",
  "spell-sigil-duel",
  "ember-crypt-rogue",
  "turbo-diner-shift",
  "cascade-mini-golf",
  "prism-pinball-heist",
  "penalty-fever-arena",
  "pixel-potion-clicker",
  "skyhook-obby-rush",
  "orbital-bubble-forge",
  "crystal-current-match",
  "signal-rail-sprint",
  "starfall-salvage",
  "lumen-grove-keeper",
  "echo-archive-mystery",
  "neon-drift-outlaw",
  "verdant-gridworks",
  "void-glyph-cards",
  "shadow-vault-tactics",
  "rune-forge-atelier",
]);

const ALLOWED_PROJECTS = new Set([
  "printable-tools-lab",
  "pocket-arcade-shelf",
]);

export async function onRequestPost({ request, env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Event store unavailable" }, 503);
  try {
    const body = await request.json();
    const name = cleanKey(body.name, 40);
    if (!ALLOWED_EVENTS.has(name)) return json({ ok: false, error: "Unsupported event" }, 400);
    const tool = cleanTool(body.tool || "site");
    const source = cleanSource(body.source || "direct");
    const path = cleanPath(body.path || "/");
    const project = cleanProject(body.project || inferProject(request));
    const day = new Date().toISOString().slice(0, 10);
    await appendRollup(env.PTL_EVENTS, { day, name, tool, source, path, project });
    return json({ ok: true });
  } catch (error) {
    if (isKvLimitError(error)) {
      return json({ ok: true, sampledOut: true, reason: "event_store_limit" }, 202);
    }
    return json({ ok: false, error: "Event rejected" }, 400);
  }
}

export function onRequestGet() {
  return json({ ok: true, service: "PrintableTools Lab event collector" });
}

async function appendRollup(store, event) {
  const month = event.day.slice(0, 7);
  const key = `rollup:${month}`;
  const rollup = safeJson(await store.get(key), null) || emptyRollup(month);
  const dayBucket = ensureDay(rollup, event.day);
  addCount(rollup.totals.events, event.name);
  addCount(dayBucket.events, event.name);
  addNestedCount(rollup.totals.tools, event.tool, event.name);
  addNestedCount(dayBucket.tools, event.tool, event.name);
  addNestedCount(rollup.totals.sources, event.source, event.name);
  addNestedCount(dayBucket.sources, event.source, event.name);
  const projectTotal = ensureNested(rollup.totals.projects, event.project);
  addCount(projectTotal.events, event.name);
  addNestedCount(projectTotal.tools, event.tool, event.name);
  addNestedCount(projectTotal.sources, event.source, event.name);
  addPathEventCount(projectTotal.paths, event.path, event.name);
  const projectToday = ensureNested(dayBucket.projects, event.project);
  addCount(projectToday.events, event.name);
  addNestedCount(projectToday.tools, event.tool, event.name);
  addNestedCount(projectToday.sources, event.source, event.name);
  addPathEventCount(projectToday.paths, event.path, event.name);
  rollup.updatedAt = new Date().toISOString();
  await store.put(key, JSON.stringify(rollup));
}

function emptyRollup(month) {
  return { month, updatedAt: "", totals: emptyBucket(), today: {} };
}

function emptyBucket() {
  return { events: {}, tools: {}, sources: {}, projects: {}, paths: {} };
}

function ensureDay(rollup, day) {
  if (!rollup.today || typeof rollup.today !== "object") rollup.today = {};
  if (!rollup.today[day]) rollup.today[day] = emptyBucket();
  return rollup.today[day];
}

function ensureNested(container, key) {
  if (!container[key]) container[key] = emptyBucket();
  return container[key];
}

function addCount(container, key) {
  container[key] = (Number(container[key]) || 0) + 1;
}

function addNestedCount(container, outerKey, innerKey) {
  if (!container[outerKey]) container[outerKey] = {};
  addCount(container[outerKey], innerKey);
}

function addPathEventCount(container, path, event) {
  const current = container[path];
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    container[path] = {};
    if (Number(current)) container[path].page_view = Number(current);
  }
  addCount(container[path], event);
}

function safeJson(text, fallback) {
  try {
    const value = JSON.parse(text);
    if (value && value.today) {
      const days = Object.keys(value.today);
      for (const day of days) ensureDay(value, day);
    }
    return value;
  } catch {
    return fallback;
  }
}

function isKvLimitError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("kv put() limit exceeded")
    || message.includes("kv get() limit exceeded")
    || message.includes("write limit")
    || message.includes("read limit")
    || message.includes("too many requests");
}

function cleanKey(value, maxLength) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

function cleanSource(value) {
  const source = cleanKey(value || "direct", 48);
  const canonical = canonicalSource(source);
  if (!canonical) return "direct";
  return ALLOWED_SOURCES.has(canonical) ? canonical : "referral";
}

function canonicalSource(source) {
  if (source === "free-no-signup") return "freenosignup";
  if (source === "no-login") return "nologin";
  if (source === "no-subscription") return "nosubscription";
  if (source === "github-issues") return "github-issue";
  if (source === "sharekit") return "share-kit";
  if (source === "short_video") return "short-video";
  if (source === "game_platform") return "game-platform";
  if (source === "sponsor-call") return "sponsor-outreach";
  if (source === "publisher-embed") return "embed";
  return source;
}

function cleanTool(value) {
  const tool = cleanKey(value || "site", 64);
  return ALLOWED_TOOLS.has(tool) ? tool : "site";
}

function cleanProject(value) {
  const project = cleanKey(value || "printable-tools-lab", 64);
  return ALLOWED_PROJECTS.has(project) ? project : "printable-tools-lab";
}

function inferProject(request) {
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  return /pocket-arcade-shelf/i.test(origin) ? "pocket-arcade-shelf" : "printable-tools-lab";
}

function cleanPath(value) {
  const path = String(value || "/").split("?")[0].replace(/[^a-zA-Z0-9/_-]/g, "");
  return path.startsWith("/") ? path.slice(0, 120) : `/${path.slice(0, 119)}`;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export function onRequestOptions() {
  return json({ ok: true });
}
