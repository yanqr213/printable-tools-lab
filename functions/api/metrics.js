const EVENTS = ["page_view", "generate_pdf", "download_pdf", "generate_file", "download_file", "limit_hit", "ai_ideas", "ai_ideas_apply"];
const SOURCE_EVENTS = ["page_view", "generate_pdf", "download_pdf", "generate_file", "download_file"];
const TOOLS = [
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
  "nosignuptools",
  "freenosignup",
  "nologin",
  "nosubscription",
  "share-kit",
  "short-video",
  "game-platform",
  "directory",
  "community",
  "referral",
  "unknown",
];

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Metrics store unavailable" }, 503);
  const today = new Date().toISOString().slice(0, 10);
  const count = async (key) => Number(await env.PTL_EVENTS.get(key)) || 0;
  const [totalEntries, todayEntries, tools, sources] = await Promise.all([
    Promise.all(EVENTS.map(async (event) => [event, await count(`total:event:${event}`)])),
    Promise.all(EVENTS.map(async (event) => [event, await count(`day:${today}:event:${event}`)])),
    Promise.all(TOOLS.map(async (tool) => {
      const eventEntries = await Promise.all(
        ["generate_pdf", "download_pdf", "generate_file", "download_file", "limit_hit", "ai_ideas_apply"].map(async (event) => [
          event,
          await count(`total:tool:${tool}:event:${event}`),
        ]),
      );
      return { tool, ...Object.fromEntries(eventEntries) };
    })),
    Promise.all(SOURCES.map(async (source) => {
      const [totalSourceEntries, todaySourceEntries] = await Promise.all([
        Promise.all(SOURCE_EVENTS.map(async (event) => [
          event,
          await count(`total:source:${source}:event:${event}`),
        ])),
        Promise.all(SOURCE_EVENTS.map(async (event) => [
          event,
          await count(`day:${today}:source:${source}:event:${event}`),
        ])),
      ]);
      return {
        source,
        ...Object.fromEntries(totalSourceEntries),
        today: Object.fromEntries(todaySourceEntries),
      };
    })),
  ]);
  return json({
    ok: true,
    today,
    totals: Object.fromEntries(totalEntries),
    todayTotals: Object.fromEntries(todayEntries),
    tools,
    sources,
  });
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
