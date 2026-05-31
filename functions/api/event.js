const ALLOWED_EVENTS = new Set([
  "page_view",
  "generate_preview",
  "generate_pdf",
  "download_pdf",
  "limit_hit",
  "ai_ideas",
  "ai_ideas_apply",
  "ai_ideas_error",
]);

export async function onRequestPost({ request, env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Event store unavailable" }, 503);
  try {
    const body = await request.json();
    const name = cleanKey(body.name, 40);
    if (!ALLOWED_EVENTS.has(name)) return json({ ok: false, error: "Unsupported event" }, 400);
    const tool = cleanKey(body.tool || "site", 64) || "site";
    const path = cleanPath(body.path || "/");
    const day = new Date().toISOString().slice(0, 10);
    const keys = [
      `day:${day}:event:${name}`,
      `day:${day}:tool:${tool}:event:${name}`,
      `total:event:${name}`,
      `total:tool:${tool}:event:${name}`,
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
