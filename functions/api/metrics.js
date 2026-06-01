const EVENTS = ["page_view", "generate_pdf", "download_pdf", "limit_hit", "ai_ideas", "ai_ideas_apply"];
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
  "resume-builder",
  "cover-letter",
  "resignation-letter",
  "monthly-calendar",
  "meal-planner",
  "image-to-pdf",
  "multi-image-pdf",
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
];

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Metrics store unavailable" }, 503);
  const today = new Date().toISOString().slice(0, 10);
  const count = async (key) => Number(await env.PTL_EVENTS.get(key)) || 0;
  const [totalEntries, todayEntries, tools] = await Promise.all([
    Promise.all(EVENTS.map(async (event) => [event, await count(`total:event:${event}`)])),
    Promise.all(EVENTS.map(async (event) => [event, await count(`day:${today}:event:${event}`)])),
    Promise.all(TOOLS.map(async (tool) => {
      const eventEntries = await Promise.all(
        ["generate_pdf", "download_pdf", "limit_hit", "ai_ideas_apply"].map(async (event) => [
          event,
          await count(`total:tool:${tool}:event:${event}`),
        ]),
      );
      return { tool, ...Object.fromEntries(eventEntries) };
    })),
  ]);
  return json({
    ok: true,
    today,
    totals: Object.fromEntries(totalEntries),
    todayTotals: Object.fromEntries(todayEntries),
    tools,
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
