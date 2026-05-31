const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

async function main() {
  const eventSource = loadFunction("functions/api/event.js", ["onRequestPost", "onRequestGet"]);
  const metricsSource = loadFunction("functions/api/metrics.js", ["onRequestGet"]);
  const store = new MemoryStore();
  const env = { PTL_EVENTS: store };

  const eventResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "download_pdf", tool: "invoice-generator", path: "/tools/invoice-generator/" }),
    }),
    env,
  });
  const eventPayload = await eventResponse.json();
  assert(eventResponse.status === 200 && eventPayload.ok, "Event collector should accept supported events");

  const metricsResponse = await metricsSource.onRequestGet({ env });
  const metricsPayload = await metricsResponse.json();
  assert(metricsPayload.ok, "Metrics endpoint should respond");
  assert(metricsPayload.totals.download_pdf === 1, "Metrics should count downloads");
  assert(metricsPayload.tools.length === 26, "Metrics should include every active tool");
  const invoice = metricsPayload.tools.find((row) => row.tool === "invoice-generator");
  assert(invoice.download_pdf === 1, "Metrics should count per-tool downloads");
  for (const tool of ["multi-image-pdf", "text-to-pdf", "receipt-generator", "timesheet-generator", "certificate-generator", "todo-list"]) {
    assert(metricsPayload.tools.some((row) => row.tool === tool), `Metrics should include ${tool}`);
  }

  const rejectResponse = await eventSource.onRequestPost({
    request: new Request("https://example.test/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "bad_event", tool: "invoice-generator" }),
    }),
    env,
  });
  assert(rejectResponse.status === 400, "Event collector should reject unsupported events");
  console.log("Event metrics test passed.");
}

function loadFunction(file, exportsList) {
  let source = fs.readFileSync(path.join(root, file), "utf8");
  for (const name of exportsList) {
    source = source.replace(new RegExp(`export async function ${name}`), `async function ${name}`);
    source = source.replace(new RegExp(`export function ${name}`), `function ${name}`);
  }
  source += `\nreturn { ${exportsList.join(", ")} };\n`;
  return new Function(source)();
}

class MemoryStore {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) || null;
  }

  async put(key, value) {
    this.data.set(key, value);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
