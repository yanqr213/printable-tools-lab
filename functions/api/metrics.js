const EVENTS = ["page_view", "generate_pdf", "download_pdf", "limit_hit", "ai_ideas", "ai_ideas_apply"];
const TOOLS = [
  "invoice-generator",
  "estimate-generator",
  "purchase-order",
  "bill-of-sale",
  "resume-builder",
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
  const totals = {};
  const todayTotals = {};
  for (const event of EVENTS) {
    totals[event] = Number(await env.PTL_EVENTS.get(`total:event:${event}`)) || 0;
    todayTotals[event] = Number(await env.PTL_EVENTS.get(`day:${today}:event:${event}`)) || 0;
  }
  const tools = [];
  for (const tool of TOOLS) {
    const row = { tool };
    for (const event of ["generate_pdf", "download_pdf", "limit_hit", "ai_ideas_apply"]) {
      row[event] = Number(await env.PTL_EVENTS.get(`total:tool:${tool}:event:${event}`)) || 0;
    }
    tools.push(row);
  }
  return json({
    ok: true,
    today,
    totals,
    todayTotals,
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
