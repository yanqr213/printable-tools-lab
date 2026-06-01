const ALLOWED_EVENTS = new Set([
  "page_view",
  "generate_preview",
  "generate_pdf",
  "download_pdf",
  "generate_file",
  "download_file",
  "limit_hit",
  "ai_ideas",
  "ai_ideas_apply",
  "ai_ideas_error",
]);

const ALLOWED_SOURCES = new Set([
  "direct",
  "google",
  "bing",
  "github",
  "github-pages",
  "zearches",
  "listai",
  "nosignuptools",
  "freenosignup",
  "directory",
  "community",
  "referral",
  "unknown",
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
  "cover-letter",
  "resignation-letter",
  "monthly-calendar",
  "meal-planner",
  "image-to-pdf",
  "multi-image-pdf",
  "compress-image",
  "resize-image",
  "convert-image",
  "crop-image",
  "rotate-image",
  "watermark-image",
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
    const day = new Date().toISOString().slice(0, 10);
    const keys = [
      `day:${day}:event:${name}`,
      `day:${day}:tool:${tool}:event:${name}`,
      `day:${day}:source:${source}:event:${name}`,
      `total:event:${name}`,
      `total:tool:${tool}:event:${name}`,
      `total:source:${source}:event:${name}`,
    ];
    if (name === "page_view") keys.push(`day:${day}:path:${path}:views`);
    await Promise.all(keys.map((key) => increment(env.PTL_EVENTS, key)));
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: "Event rejected" }, 400);
  }
}

export function onRequestGet() {
  return json({ ok: true, service: "PrintableTools Lab event collector" });
}

async function increment(store, key) {
  const current = Number(await store.get(key)) || 0;
  await store.put(key, String(current + 1), { expirationTtl: key.startsWith("day:") ? 60 * 60 * 24 * 120 : undefined });
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
  if (!source) return "direct";
  return ALLOWED_SOURCES.has(source) ? source : "referral";
}

function cleanTool(value) {
  const tool = cleanKey(value || "site", 64);
  return ALLOWED_TOOLS.has(tool) ? tool : "site";
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
    },
  });
}
